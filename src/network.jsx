// Network tab, v5 (27 Oct 2026): Rajat's 11 items. The product's request
// list first (item 1), with named columns (item 2) that sort on a rotating
// click, Name ascending by default (item 3); Time renamed Duration (item 5);
// a Start time column (item 6); and a Waterfall column whose popover gives
// each phase's exact time (items 7 to 9). A row opens its details beside the
// table, as browser developer tools do (item 4, Rajat's answer of 27 Oct
// 2026). Spec: automation-details.md §3d, §4e and §7e.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Download, Info, Moon, Sun, X } from 'lucide-react'
import {
  LTBlankSlate, LTButton, LTCodeBlock, LTCopyToClipboard, CopyIconButton, LTCounterLabel, LTFlash, LTIconButton,
  LTInputBox, LTSkeletonBox, LTSwitch, LTTable, TruncText, announce, cx,
} from './lt.jsx'
import { LTActionMenu, LTPopover, LTSegmentedControl, LTTabNav } from './overlays.jsx'
import { Splitter, usePref, useSize } from './layout.jsx'
import { Json } from './commands.jsx'
import { networkFor, toHar, PHASES } from './network-data.js'
import { fmtBytes, fmtClock, fmtDuration, fmtMsExact } from './format.js'
import { copyText } from './clipboard.js'

/* The product's eight type segments, in its order (C40: more than the five
   README §5 allows). `noun` is the type in a sentence. */
const TYPES = [
  { value: 'all', label: 'All' },
  { value: 'js', label: 'JS', noun: 'JavaScript' },
  { value: 'css', label: 'CSS', noun: 'CSS' },
  { value: 'img', label: 'Img', noun: 'image' },
  { value: 'media', label: 'Media', noun: 'media' },
  { value: 'font', label: 'Font', noun: 'font' },
  { value: 'doc', label: 'Doc', noun: 'document' },
  { value: 'ws', label: 'WS', noun: 'WebSocket' },
]

/* The search field's scope: the product's "All" dropdown, one option per
   text column plus the full URL [proposed]. */
const FIELDS = [
  { value: 'all', label: 'All', placeholder: 'Search all fields' },
  { value: 'name', label: 'Name', placeholder: 'Search names', get: q => q.name },
  { value: 'url', label: 'URL', placeholder: 'Search URLs', get: q => q.url },
  { value: 'status', label: 'Status', placeholder: 'Search status codes', get: q => `${q.status} ${q.statusText}` },
  { value: 'method', label: 'Method', placeholder: 'Search methods', get: q => q.method },
  { value: 'domain', label: 'Domain', placeholder: 'Search domains', get: q => q.host },
  { value: 'type', label: 'Type', placeholder: 'Search types', get: q => `${q.type} ${q.mime}` },
]
// The cells a search in each field marks: a URL search also marks the name
// and domain, which are part of it.
const MARKS = { all: ['name', 'status', 'method', 'domain', 'type'], name: ['name'], url: ['name', 'domain'],
  status: ['status'], method: ['method'], domain: ['domain'], type: ['type'] }

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
const SORTERS = {
  name: (a, b) => collator.compare(a.name, b.name),
  status: (a, b) => a.status - b.status,
  method: (a, b) => collator.compare(a.method, b.method),
  domain: (a, b) => collator.compare(a.host, b.host),
  type: (a, b) => collator.compare(a.type, b.type),
  size: (a, b) => a.bytes - b.bytes,
  start: (a, b) => a.start - b.start,
  duration: (a, b) => a.duration - b.duration,
  // The bar is each request's own breakdown, so it sorts by the phase it is
  // mostly made of, the wait for the first byte [proposed, question 40].
  waterfall: (a, b) => a.timings.wait - b.timings.wait,
}
const TITLES = { name: 'Name', status: 'Status', method: 'Method', domain: 'Domain', type: 'Type', size: 'Size',
  start: 'Start time', duration: 'Duration', waterfall: 'Waterfall' }
// Fixed widths, each fitting its header and sort icon (Waterfall also its
// legend); Name takes the rest, 224px at least (styles.css .net-table).
const WIDTHS = { status: 76, method: 80, domain: 128, type: 104, size: 80, start: 96, duration: 88, waterfall: 160 }

/* What each phase is, for the Waterfall legend. */
const MEANS = {
  blocked: 'Waiting in the browser\'s queue for a connection.',
  dns: 'Finding the server\'s address for the domain.',
  connect: 'Opening the connection to the server.',
  ssl: 'The handshake that secures the connection.',
  send: 'Sending the request.',
  wait: 'Waiting for the first byte of the response.',
  receive: 'Receiving the rest of the response.',
}

const PANEL = { min: 320, def: 400 } // the details panel [proposed]
const TABLE_MIN = 220 // Name and Status while the details are open

/* Search marks, as All Commands draws them. */
function Hl({ text, q }) {
  if (!q || !text) return text
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return text
  return <>{text.slice(0, i)}<mark className="hl">{text.slice(i, i + q.length)}</mark><Hl text={text.slice(i + q.length)} q={q} /></>
}

/* Why some phases took 0ms, said once under the list. */
function timingNote(q) {
  if (q.method === 'CONNECT') return 'CONNECT opens a tunnel for the HTTPS requests after it, so its DNS lookup and SSL show 0ms.'
  if (!q.timings.connect && !q.timings.ssl) return 'The connection was already open, so DNS lookup, initial connection and SSL took 0ms.'
  if (!q.timings.dns) return 'The address was already known, so DNS lookup took 0ms.'
  return null
}
const timingText = q => [q.url, ...PHASES.map(p => `${p.label}: ${fmtMsExact(q.timings[p.key])}`),
  `Total: ${fmtMsExact(q.duration)}`].join('\n')

/* Each request's own breakdown, the reference screenshot's bar: every phase
   that took time, in time order, 2px apart (dataviz: a surface gap between
   fills). The bar is the request's duration, whatever its length. */
function WaterfallBar({ q }) {
  return (
    <span className="net-bar">
      {PHASES.filter(p => q.timings[p.key] > 0).map(p => (
        <span key={p.key} className="net-bar__seg" style={{ flexGrow: q.timings[p.key], background: p.color }} />
      ))}
    </span>
  )
}

/* Items 7 to 9: the exact time of every phase, to copy from. */
function PhaseList({ q }) {
  const note = timingNote(q)
  return (
    <div className="net-pop">
      <dl className="net-phases">
        {PHASES.map(p => {
          const v = q.timings[p.key]
          return (
            <div key={p.key} className={cx('net-phases__row', v === 0 && 'is-zero')}>
              <dt><span className="net-swatch" style={{ background: p.color }} aria-hidden="true" />{p.label}</dt>
              <dd>{fmtMsExact(v)}</dd>
            </div>
          )
        })}
        <div className="net-phases__row net-phases__total"><dt>Total</dt><dd>{fmtMsExact(q.duration)}</dd></div>
      </dl>
      {note && <p className="net-pop__note">{note}</p>}
      <div className="net-pop__actions">
        <CopyIconButton icon={Copy} ariaLabel="Copy timings" copiedLabel="Timings copied" copy={() => copyText(timingText(q))} />
      </div>
    </div>
  )
}

function Legend() {
  return (
    <ul className="net-legend">
      {PHASES.map(p => (
        <li key={p.key}>
          <span className="net-swatch" style={{ background: p.color }} aria-hidden="true" />
          <span><span className="net-legend__name">{p.label}</span>{` ${MEANS[p.key]}`}</span>
        </li>
      ))}
    </ul>
  )
}

/* ---------- the request's details (item 4) ---------- */

function CodeView({ title, text, json, codeTheme, setCodeTheme, copyLabel, copiedLabel }) {
  return (
    <LTCodeBlock theme={codeTheme} title={title} className="net-code"
      headerActions={<>
        <LTIconButton icon={codeTheme === 'dark' ? Sun : Moon} variant="invisible" size="small"
          ariaLabel={codeTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className={codeTheme === 'dark' ? 'on-dark' : undefined}
          onClick={() => setCodeTheme(codeTheme === 'dark' ? 'light' : 'dark')} />
        <LTCopyToClipboard textToCopy={text} size="small" dark={codeTheme === 'dark'}
          copyAriaLabel={copyLabel} copiedAriaLabel={copiedLabel} />
      </>}>
      {json ? <Json value={JSON.parse(text)} /> : <pre className="code-pre">{text}</pre>}
    </LTCodeBlock>
  )
}

// Header names are code, so monospace; General's labels are words.
const KV_COLUMNS = name => [{ key: 'k', title: name ?? 'Field', mono: !!name }, { key: 'v', title: 'Value', mono: true, copy: true, copyName: 'k' }]
const kv = pairs => pairs.map(([k, v]) => ({ k, v }))

function HeadersPanel({ q }) {
  // General also holds what the hidden columns show while the details are
  // open. A CONNECT has no content type, so that row is left out rather than
  // filled with "None" (ux-text-guidelines.md: empty values name the state).
  const general = [
    ['Request URL', q.url], ['Request method', q.method], ['Status code', `${q.status} ${q.statusText}`],
    ...(q.mime ? [['Content type', q.mime]] : []), ['Transferred', fmtBytes(q.bytes)],
    ['Resource size', fmtBytes(q.resourceBytes)], ['Start time', fmtClock(q.start)], ['Duration', fmtMsExact(q.duration)],
  ]
  const section = (title, rows, column, none) => (
    <section className="net-dp__section">
      <h3 className="net-dp__title">{title}{rows.length > 0 && column && <LTCounterLabel count={rows.length} />}</h3>
      {rows.length ? <LTTable caption={title} allowValueCopy columns={KV_COLUMNS(column)} data={kv(rows)} />
        : <p className="net-dp__none">{none}</p>}
    </section>
  )
  return (
    <div className="net-dp__stack">
      {section('General', general, null)}
      {section('Response headers', q.responseHeaders, 'Header', '0 response headers.')}
      {section('Request headers', q.requestHeaders, 'Header', '0 request headers.')}
    </div>
  )
}

function PayloadPanel({ q, codeTheme, setCodeTheme }) {
  if (q.payload.kind === 'none') {
    return <LTBlankSlate heading="Empty payload" description={`This ${q.method} request sent only its URL and headers.`} />
  }
  return <CodeView title="Request payload" text={q.payload.text} json codeTheme={codeTheme} setCodeTheme={setCodeTheme}
    copyLabel="Copy payload" copiedLabel="Payload copied" />
}

function ResponsePanel({ q, codeTheme, setCodeTheme }) {
  if (q.body.kind === 'empty') {
    const why = q.method === 'CONNECT' ? 'A CONNECT request opens a tunnel. Its answer is a status line only.'
      : q.status === 304 ? 'The server answered 304 Not Modified, so the browser used its cached copy.'
        : `The server answered ${q.status} ${q.statusText}.`
    return <LTBlankSlate heading="Empty response body" description={why} />
  }
  if (q.body.kind === 'binary') {
    return <LTBlankSlate heading="Binary response"
      description={`Previews show text responses. This one is ${q.mime}, ${fmtBytes(q.resourceBytes)}.`} />
  }
  return <CodeView title={q.mime} text={q.body.text} json={q.body.lang === 'json'} codeTheme={codeTheme}
    setCodeTheme={setCodeTheme} copyLabel="Copy response" copiedLabel="Response copied" />
}

/* The Timing tab: the popover's numbers, each phase on its own line of the
   request's time, as developer tools draw it. */
function TimingPanel({ q }) {
  let at = 0
  const rows = PHASES.map(p => {
    const r = { ...p, ms: q.timings[p.key], at }
    at += r.ms
    return r
  })
  const note = timingNote(q)
  const pct = v => `${(v / q.duration) * 100}%`
  return (
    <div className="net-dp__stack">
      <div className="net-timing__head">
        <p className="net-timing__meta">{`Started at ${fmtClock(q.start)} · ${fmtMsExact(q.duration)} in total`}</p>
        <CopyIconButton icon={Copy} ariaLabel="Copy timings" copiedLabel="Timings copied" copy={() => copyText(timingText(q))} />
      </div>
      <LTTable caption={`Timing of ${q.name}`} className="net-ttable" rowKey={r => r.key}
        rowProps={r => ({ className: cx(r.ms === 0 && 'is-zero', r.total && 'is-total') })}
        columns={[
          { key: 'phase', title: 'Phase', render: r => (
            <span className="net-phase">
              {!r.total && <span className="net-swatch" style={{ background: r.color }} aria-hidden="true" />}{r.label}
            </span>
          ) },
          { key: 'bar', title: 'When', render: r => (
            <span className="net-track" aria-hidden="true">
              {r.ms > 0 && <span className="net-track__bar"
                style={{ left: pct(r.at), width: `max(2px, ${pct(r.ms)})`, background: r.total ? 'var(--fg-subtle)' : r.color }} />}
            </span>
          ) },
          { key: 'ms', title: 'Duration', align: 'end', render: r => fmtMsExact(r.ms) },
        ]}
        data={[...rows, { key: 'total', label: 'Total', ms: q.duration, at: 0, total: true }]} />
      {note && <p className="net-dp__none">{note}</p>}
    </div>
  )
}

function RequestDetails({ q, index, count, tab, setTab, onPrev, onNext, onClose, codeTheme, setCodeTheme }) {
  const first = index === 0, last = index === count - 1
  return (
    <aside className="net-detail" id="net-detail" aria-label={`Details of ${q.name}`}>
      <div className="net-detail__head">
        <div className="net-detail__row">
          <TruncText className="net-detail__name" text={q.name} />
          <span className="net-detail__pos">{`${index + 1} of ${count}`}</span>
          <span className="spacer" />
          <LTIconButton icon={ChevronUp} ariaLabel="Previous request" variant="invisible" size="small" inactive={first}
            tooltipText={first ? 'This is the first request' : 'Previous request'} onClick={onPrev} />
          <LTIconButton icon={ChevronDown} ariaLabel="Next request" variant="invisible" size="small" inactive={last}
            tooltipText={last ? 'This is the last request' : 'Next request'} onClick={onNext} />
          <LTIconButton icon={X} ariaLabel="Close details" variant="invisible" size="small" onClick={onClose} />
        </div>
        <div className="net-detail__url">
          <span className="net-detail__method">{q.method}</span>
          <span className={cx('net-status', 'net-detail__status', q.status >= 400 && 'is-error')}>
            {q.status}<span className="vh">{` ${q.statusText}`}</span>
          </span>
          <TruncText className="net-detail__href" text={q.url} />
          <LTCopyToClipboard textToCopy={q.url} size="xsmall" copyAriaLabel="Copy URL" copiedAriaLabel="URL copied" />
        </div>
      </div>
      {/* A second tab layer below the page's tabs: LTTabNav (README §5). */}
      <LTTabNav size="small" ariaLabel="Request details" idPrefix="net" activeTab={tab} onSelect={setTab}
        items={[{ id: 'headers', label: 'Headers' }, { id: 'payload', label: 'Payload' },
          { id: 'response', label: 'Response' }, { id: 'timing', label: 'Timing' }]} />
      <div className="net-detail__body" role="tabpanel" id="net-panel" aria-labelledby={`net-tab-${tab}`} tabIndex={0}>
        {tab === 'headers' && <HeadersPanel q={q} />}
        {tab === 'payload' && <PayloadPanel q={q} codeTheme={codeTheme} setCodeTheme={setCodeTheme} />}
        {tab === 'response' && <ResponsePanel q={q} codeTheme={codeTheme} setCodeTheme={setCodeTheme} />}
        {tab === 'timing' && <TimingPanel q={q} />}
      </div>
    </aside>
  )
}

/* ---------- states ---------- */

function Skeleton() {
  return (
    <div className="net" aria-busy="true" aria-label="Loading network requests">
      <div className="net-toolbar">
        <LTSkeletonBox width={400} height={32} radius="var(--radius-2)" />
        <LTSkeletonBox width="100%" height={32} radius="var(--radius-2)" />
      </div>
      <div className="net-scroll">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="net-skrow">
            <LTSkeletonBox width="36%" height={12} delay={i * 60} />
            <LTSkeletonBox width={32} height={12} delay={i * 60} />
            <LTSkeletonBox width={40} height={12} delay={i * 60} />
            <LTSkeletonBox width="20%" height={12} delay={i * 60} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function NetworkTab({ test, codeTheme, setCodeTheme, isCurrent, demo, onRetry }) {
  const log = useMemo(() => networkFor(test.id), [test.id])
  const [type, setType] = useState('all')
  const [field, setField] = useState('all')
  const [query, setQuery] = useState('')
  const [errorsOnly, setErrorsOnly] = useState(false)
  const [showConnect, setShowConnect] = useState(false)
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })
  const [selectedId, setSelectedId] = useState(null)
  const [activeId, setActiveId] = useState(null) // the row in the tab order
  const [detailTab, setDetailTab] = useState('headers')
  const [panelW, setPanelW] = usePref('netPanelWidth', PANEL.def)
  const bodyRef = useRef(null)
  const scrollRef = useRef(null)
  const searchRef = useRef(null)
  const body = useSize(bodyRef)

  const fieldDef = FIELDS.find(f => f.value === field)
  const needle = query.trim().toLowerCase()
  // CONNECT tunnels count only while they show (Show CONNECT).
  const base = useMemo(() => log.requests.filter(q => showConnect || q.method !== 'CONNECT'), [log, showConnect])
  const rows = useMemo(() => {
    const text = q => (field === 'all' ? FIELDS.slice(1).map(f => f.get(q)).join(' ') : fieldDef.get(q)).toLowerCase()
    const out = base.filter(q => (type === 'all' || q.category === type) && (!errorsOnly || q.status >= 400)
      && (!needle || text(q).includes(needle)))
    const by = SORTERS[sort.key]
    // Ties keep run order, whichever way the column sorts.
    return out.sort((a, b) => (sort.dir === 'asc' ? by(a, b) : by(b, a)) || a.start - b.start)
  }, [base, type, errorsOnly, needle, field, fieldDef, sort])
  const filtering = type !== 'all' || errorsOnly || !!needle

  const selIndex = rows.findIndex(q => q.id === selectedId)
  const selected = selIndex >= 0 ? rows[selIndex] : null
  const current = rows.some(q => q.id === activeId) ? activeId : rows[0]?.id
  // A filter that hides the open request closes its details.
  useEffect(() => { if (selectedId && selIndex < 0) setSelectedId(null) }, [selectedId, selIndex])

  const rowEl = id => scrollRef.current?.querySelector(`[data-row="${id}"]`)
  const reveal = id => {
    const sc = scrollRef.current, tr = rowEl(id)?.closest('tr')
    if (!sc || !tr) return
    const sr = sc.getBoundingClientRect(), rr = tr.getBoundingClientRect()
    const head = sc.querySelector('thead')?.getBoundingClientRect().height ?? 0
    if (rr.top < sr.top + head) sc.scrollTop -= sr.top + head - rr.top
    else if (rr.bottom > sr.bottom) sc.scrollTop += rr.bottom - sr.bottom
  }
  // The open request stays in view as it changes (keys, Previous, Next).
  useEffect(() => { if (selectedId) reveal(selectedId) }, [selectedId])

  const open = (id, tab) => {
    if (tab) setDetailTab(tab)
    setSelectedId(id)
    setActiveId(id)
  }
  const close = () => {
    const id = selectedId
    setSelectedId(null)
    // Focus goes back to the request whose details closed (a timeout, since
    // animation frames stall while the window is not painting).
    setTimeout(() => rowEl(id)?.focus({ preventScroll: true }), 0)
  }
  const step = d => {
    const next = rows[selIndex + d]
    if (next) open(next.id)
  }

  const onSort = key => {
    const dir = sort.key === key && sort.dir === 'asc' ? 'desc' : 'asc'
    setSort({ key, dir })
    announce(`Sorted by ${TITLES[key]}, ${dir === 'asc' ? 'ascending' : 'descending'}`)
  }

  /* The list is one tab stop (as All Commands, v2 item 7): Up and Down move
     between requests, Home and End to the ends, Enter opens one. With the
     details open, the open request follows. Esc closes the details. */
  const onKeyDown = e => {
    const id = e.target.closest?.('[data-row]')?.dataset.row
    if (!id) return
    const i = rows.findIndex(q => q.id === id)
    const j = e.key === 'ArrowDown' ? Math.min(rows.length - 1, i + 1) : e.key === 'ArrowUp' ? Math.max(0, i - 1)
      : e.key === 'Home' ? 0 : e.key === 'End' ? rows.length - 1 : null
    if (e.key === 'Escape' && selected) { e.preventDefault(); close(); return }
    if (j == null) return
    e.preventDefault()
    const to = rows[j].id
    setActiveId(to)
    if (selected) setSelectedId(to)
    rowEl(to)?.focus({ preventScroll: true })
    reveal(to)
  }

  const downloadHar = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(toHar(test, log), null, 2)], { type: 'application/json' }))
    a.download = `${test.testId}-network.har`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const clearFilters = () => { setType('all'); setErrorsOnly(false); setQuery(''); setField('all') }

  /* ---------- states ---------- */
  if (!log.on) {
    return (
      <div className="tab-state">
        <LTBlankSlate heading="Network capture is off"
          description="Set the network capability to true to record requests on the next run." />
      </div>
    )
  }
  if (test.status === 'queued') {
    return <div className="tab-state"><LTBlankSlate heading="Queued to run" description="Network requests appear here once the test starts." /></div>
  }
  if (demo === 'loading') return <Skeleton />
  if (demo === 'error') {
    return (
      <div className="tab-pad">
        <LTFlash variant="danger" text="Network logs failed to load."
          action={<LTButton variant="outline" size="small" label="Try Again" onClick={onRetry} />} />
      </div>
    )
  }
  if (demo === 'empty' || !log.requests.length) {
    return <div className="tab-state"><LTBlankSlate heading="0 network requests" description="Capture was on, and this run made 0 requests." /></div>
  }

  const bodyW = body.width || 0
  const panelMax = Math.max(PANEL.min, bodyW - TABLE_MIN - 1)
  const panelNow = Math.min(Math.max(panelW, PANEL.min), panelMax)

  /* ---------- columns ---------- */
  const marks = MARKS[field]
  const mark = key => (marks.includes(key) ? needle : '')
  // Item 4: Name and Status beside the details; Name alone, as developer
  // tools have it, when the logs are too narrow for both (1280px wide).
  const compact = !!selected
  const nameOnly = compact && bodyW - panelNow - 1 < TABLE_MIN
  const columns = [
    { key: 'name', title: 'Name', sortable: true, render: q => (
      <button type="button" className="net-name" data-row={q.id} tabIndex={q.id === current ? 0 : -1}
        aria-expanded={q.id === selectedId} aria-controls={q.id === selectedId ? 'net-detail' : undefined}>
        <TruncText className="net-ellipsis" text={q.name}><Hl text={q.name} q={mark('name')} /></TruncText>
      </button>
    ) },
    ...(nameOnly ? [] : [{ key: 'status', title: 'Status', sortable: true, width: WIDTHS.status, render: q => (
      <span className={cx('net-status', q.status >= 400 && 'is-error')}>
        <Hl text={String(q.status)} q={mark('status')} /><span className="vh">{` ${q.statusText}`}</span>
      </span>
    ) }]),
    ...(compact ? [] : [
      { key: 'method', title: 'Method', sortable: true, width: WIDTHS.method, className: 'is-muted',
        render: q => <Hl text={q.method} q={mark('method')} /> },
      { key: 'domain', title: 'Domain', sortable: true, width: WIDTHS.domain, className: 'is-muted',
        render: q => <TruncText className="net-ellipsis" text={q.host}><Hl text={q.host} q={mark('domain')} /></TruncText> },
      { key: 'type', title: 'Type', sortable: true, width: WIDTHS.type, className: 'is-muted',
        render: q => <TruncText className="net-ellipsis" text={q.type}><Hl text={q.type} q={mark('type')} /></TruncText> },
      { key: 'size', title: 'Size', sortable: true, align: 'end', width: WIDTHS.size, render: q => fmtBytes(q.bytes) },
      { key: 'start', title: 'Start time', sortable: true, align: 'end', width: WIDTHS.start, className: 'is-muted',
        render: q => fmtClock(q.start) },
      { key: 'duration', title: 'Duration', sortable: true, align: 'end', width: WIDTHS.duration,
        render: q => fmtMsExact(q.duration) },
      { key: 'waterfall', title: 'Waterfall', sortable: true, width: WIDTHS.waterfall, className: 'net-wf-cell',
        sortHint: 'Sorts by waiting time (TTFB)',
        // The legend hangs down beside the rows (right-top), from the
        // table's edge, so it covers none of them either.
        headerExtra: (
          <LTPopover direction="right-top" openOnClick containsInteractiveChildElement heading="Waterfall phases"
            forceClose={!isCurrent} popOverbodyJSX={<Legend />}>
            <span className="net-legend-anchor">
              <LTIconButton icon={Info} ariaLabel="Waterfall phases" variant="invisible" size="xsmall" />
            </span>
          </LTPopover>
        ),
        // Items 7 to 9: hover opens it to the right, never above or below,
        // and it stays until closed so values can be copied. The Timing tab
        // holds the same numbers for the keyboard (§4e).
        render: q => (
          <LTPopover direction="right" containsInteractiveChildElement heading={q.name} forceClose={!isCurrent}
            popOverbodyJSX={<PhaseList q={q} />}>
            <span className="net-wf" aria-hidden="true"><WaterfallBar q={q} /></span>
          </LTPopover>
        ) },
    ]),
  ]

  const sum = (list, k) => list.reduce((s, q) => s + q[k], 0)
  const finished = Math.max(...log.requests.map(q => q.end))
  // The product's footer. Filtered, the count says "of" the whole, and the
  // sizes add up what shows, so the line still fits the default pane.
  const noun = n => `request${n === 1 ? '' : 's'}`
  const foot = [
    filtering ? `${rows.length} of ${base.length} ${noun(base.length)}` : `${base.length} ${noun(base.length)}`,
    `${fmtBytes(sum(rows, 'bytes'))} transferred`,
    `${fmtBytes(sum(rows, 'resourceBytes'))} resources`,
    `Finished in ${fmtDuration(finished)}`,
  ]

  const typeDef = TYPES.find(t => t.value === type)
  const emptyWhy = needle ? 'Try a different search term or field.'
    : errorsOnly && type !== 'all' ? `Every ${typeDef.noun} request in this run succeeded.`
      : errorsOnly ? 'Every request in this run succeeded.'
        : `This run made 0 ${typeDef.noun} requests.`

  return (
    <div className="net">
      <div className="net-toolbar">
        <div className="net-toolbar__row">
          <LTSegmentedControl ariaLabel="Request type" selectedValue={type} onChange={setType}
            options={TYPES.map(t => ({ value: t.value, label: t.label }))} />
          <LTIconButton icon={Download} ariaLabel="Download HAR" variant="outline" size="medium" onClick={downloadHar}
            className="net-har" />
        </div>
        <div className="net-toolbar__row">
          {/* The search's scope: LTButton outline with a caret and a single
              selection menu, as All Commands' test filter (README §5, C11).
              The product's "All" with no lead: the field beside it says
              what it searches, and a fixed width keeps the row still. */}
          <LTActionMenu ariaLabel="Search in" width={200} align="start" selectionVariant="single" activeId={field}
            customAnchor={<LTButton variant="outline" size="medium" trailingIcon={ChevronDown} className="net-field"
              ariaLabel={`Search in: ${fieldDef.label}`} label={fieldDef.label} />}
            onSelect={o => { setField(o.value); searchRef.current?.focus() }}
            options={FIELDS.map(f => ({ value: f.value, label: f.label }))} />
          <LTInputBox value={query} onChange={setQuery} placeholder={fieldDef.placeholder} ariaLabel={fieldDef.placeholder}
            forwardRef={searchRef} className="net-search"
            onKeyDown={e => { if (e.key === 'Escape' && query) { e.preventDefault(); e.stopPropagation(); setQuery('') } }} />
          <span className="net-switches">
            <LTSwitch label="Errors only" checked={errorsOnly} onValueChange={setErrorsOnly} />
            <LTSwitch label="Show CONNECT" checked={showConnect} onValueChange={setShowConnect} />
          </span>
        </div>
      </div>

      <div className="net-body" ref={bodyRef}>
        <div ref={scrollRef} className={cx('net-scroll', compact && 'is-compact')} onKeyDown={onKeyDown}>
          {rows.length === 0 ? (
            <LTBlankSlate heading="0 matching requests" description={emptyWhy}
              primaryAction={<LTButton variant="outline" size="small" label="Clear Filters" onClick={clearFilters} />} />
          ) : (
            <LTTable caption={`Network requests of ${test.name}`} className={cx('net-table', compact && 'is-compact')}
              columns={columns} data={rows} sort={sort} onSort={onSort} rowKey={q => q.id}
              rowProps={q => ({
                className: cx('net-row', q.status >= 400 && 'is-error', q.id === selectedId && 'is-selected'),
                // A click on the bar opens the details on Timing.
                onClick: e => open(q.id, e.target.closest('.net-wf') ? 'timing' : null),
              })} />
          )}
        </div>
        {selected && (
          <>
            <Splitter orientation="vertical" invert label="Resize request details" value={panelNow}
              min={PANEL.min} max={panelMax} defaultValue={PANEL.def} onChange={setPanelW} />
            <div className="net-detail-wrap" style={{ width: panelNow }}
              onKeyDown={e => { if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); close() } }}>
              <RequestDetails q={selected} index={selIndex} count={rows.length} tab={detailTab} setTab={setDetailTab}
                onPrev={() => step(-1)} onNext={() => step(1)} onClose={close} codeTheme={codeTheme} setCodeTheme={setCodeTheme} />
            </div>
          </>
        )}
      </div>

      <p className="net-foot">
        {foot.map((f, i) => (
          <span key={i}>{i > 0 && <span className="meta-dot" aria-hidden="true">·</span>}{f}</span>
        ))}
      </p>
    </div>
  )
}
