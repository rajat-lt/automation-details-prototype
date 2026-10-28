// Network tab, v5 (27 Oct 2026): Rajat's 11 items. The product's request
// list first, with named columns that sort on a rotating click, a Start time
// column, and a Waterfall column whose popover gives each phase's exact
// time. A row opens its details beside the table, as browser developer tools
// do. Rajat's answers of 28 Oct 2026: the waterfall is a timeline across the
// whole run, it does not sort, the phases wear Chrome DevTools' colours, and
// on this tab the logs always sit beside the video (App.jsx).
//
// v6 (28 Oct 2026): Rajat's 28 items, spec §4g. The overview on top is the
// whole session, and its window is the Waterfall column's too, so zooming or
// panning either view moves the other (items 1 to 6, 21; network-overview.jsx).
// The waterfall paints every request, slivers included (item 7), with its
// duration after the bar (item 18), and the column always shows (item 19).
// Its popover opens above or below the row and stays in the viewport (items
// 8, 27). Slow responses carry Firefox's turtle (item 9), images a mark and
// a hover preview (items 11, 20), and each request the command it ran under
// (item 12). Columns resize and reorder, and the page remembers both (items
// 10, 17). Selecting a request seeks the video (item 13), its actions copy it
// (item 14, network-copy.js), and its link opens the test on it (item 28).
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, Copy, Download, Ellipsis, ExternalLink, Image, ListFilter, RotateCcw, Turtle } from 'lucide-react'
import {
  CopyIconButton, LTBlankSlate, LTButton, LTButtonGroup, LTFlash, LTIconButton, LTInputBox, LTLink, LTSkeletonBox, LTSwitch,
  LTTable, LTToken, LTTooltip, StatusGlyph, TruncText, announce, cx, visibleRect,
} from './lt.jsx'
import { LTActionMenu, LTModal, LTPopover, LTSegmentedControl, closePopover } from './overlays.jsx'
import { Splitter, usePref, useSize } from './layout.jsx'
import { jumpTo } from './playback.js'
import { getDetail } from './data.js'
import { networkFor, toHar, PHASES, phaseStyle } from './network-data.js'
import { NetworkOverview, MIN_SPAN, isFullWin, useGestureZoom, wheelWin } from './network-overview.jsx'
import { ImagePreview, RequestDetails, timingText } from './network-detail.jsx'
import { copyFor, copyOptions, where } from './network-copy.js'
import { fmtBytes, fmtClock, fmtClockFine, fmtDuration, fmtMsExact, fmtTime, fmtWindow } from './format.js'
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

/* v6 item 24: the status filter, beside the error count, as the tests pane
   has it (a filter menu and a readout). Slow responses join errors as the
   other thing worth finding [proposed]. */
const STATUSES = { all: 'All requests', errors: 'Errors', slow: 'Slow responses' }

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
const SORTERS = {
  name: (a, b) => collator.compare(a.name, b.name),
  status: (a, b) => a.status - b.status,
  method: (a, b) => collator.compare(a.method, b.method),
  domain: (a, b) => collator.compare(a.host, b.host),
  type: (a, b) => collator.compare(a.type, b.type),
  size: (a, b) => a.bytes - b.bytes,
  start: (a, b) => a.start - b.start,
  command: (a, b) => a.cmdIdx - b.cmdIdx, // the order the commands ran
} // Waterfall does not sort (Rajat, 28 Oct 2026); Duration left with its column (v6 item 18)
const TITLES = { name: 'Name', status: 'Status', method: 'Method', domain: 'Domain', type: 'Type', size: 'Size',
  start: 'Start time', command: 'Command', waterfall: 'Waterfall' }

/* v6 items 10 and 17: every column but Name moves, every column resizes, and
   both are remembered for every test (usePref). Name stays first, since it
   sticks to the left edge, and takes whatever width is left over. Widths in
   px [proposed]: each fits its header and sort icon. */
const COLS = ['status', 'method', 'domain', 'type', 'size', 'start', 'command', 'waterfall']
const WIDTH = { name: 240, status: 76, method: 80, domain: 128, type: 104, size: 80, start: 96, command: 168, waterfall: 280 }
const MIN_W = { name: 140, status: 64, method: 64, domain: 72, type: 64, size: 64, start: 88, command: 104, waterfall: 160 }
const MAX_W = 800
function cleanCols(p) {
  const order = (Array.isArray(p?.order) ? p.order : []).filter((k, i, all) => COLS.includes(k) && all.indexOf(k) === i)
  for (const k of COLS) if (!order.includes(k)) order.push(k)
  const widths = { ...WIDTH }
  for (const k of Object.keys(WIDTH)) {
    const v = p?.widths?.[k]
    if (Number.isFinite(v)) widths[k] = Math.min(MAX_W, Math.max(MIN_W[k], Math.round(v)))
  }
  return { order, widths }
}
const moved = (order, from, to) => { const o = [...order]; o.splice(to, 0, o.splice(from, 1)[0]); return o }

const PANEL = { min: 320, def: 400 } // the details panel [proposed]
const TABLE_MIN = 220 // Name and Status while the details are open
const SLOW_MS = 500 // Firefox's devtools.netmonitor.audits.slow (v6 item 9)

/* Search marks, as All Commands draws them. */
function Hl({ text, q }) {
  if (!q || !text) return text
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return text
  return <>{text.slice(0, i)}<mark className="hl">{text.slice(i, i + q.length)}</mark><Hl text={text.slice(i + q.length)} q={q} /></>
}

/* ---------- the waterfall (items 7, 8, 18, 27) ---------- */

// Faint lines every `step` seconds of the window, at most six across.
const STEPS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600]
const gridStep = span => STEPS.find(s => span / s <= 6) ?? 1200

let measureCtx = null
function textWidth(text) {
  measureCtx ??= document.createElement('canvas').getContext('2d')
  measureCtx.font = `11px ${getComputedStyle(document.body).fontFamily}`
  return measureCtx.measureText(text).width
}
const dominant = q => PHASES.reduce((best, p) => (q.timings[p.key] > q.timings[best.key] ? p : best), PHASES[0])

/* A request's bar in the window, in px of the lane. Item 7: a bar is painted
   at least 2px wide and a phase at least 1px; a request narrower than 2px is
   a sliver, one tick in the colour of its longest phase, and a request is
   never left out. Item 18: its duration follows the bar, or sits before it
   when the lane ends first, or over its end when the bar fills the lane. */
function WaterfallBar({ q, win, laneW }) {
  const [a, b] = win
  const px = laneW / (b - a)
  const x = (q.start - a) * px
  const trueW = (q.duration / 1000) * px
  const parts = PHASES.filter(p => q.timings[p.key] > 0)
  const sliver = trueW < 2
  const w = sliver ? 2 : Math.max(trueW, parts.length)
  const label = fmtMsExact(q.duration)
  const lw = textWidth(label) + 4
  const v0 = Math.max(0, x), v1 = Math.min(laneW, x + w)
  const side = laneW - v1 >= lw ? 'after' : v0 >= lw ? 'before' : 'over'
  return (
    <>
      <span className={cx('net-runbar', sliver && 'is-sliver')}
        style={{ left: x, width: w, ...(sliver ? phaseStyle(dominant(q)) : {}) }}>
        {!sliver && parts.map(p => <span key={p.key} style={{ flexGrow: q.timings[p.key], ...phaseStyle(p) }} />)}
      </span>
      <span className={cx('net-wf__dur', `is-${side}`)}
        style={side === 'after' ? { left: v1 + 4 } : side === 'before' ? { right: laneW - v0 + 4 } : { right: 0 }}>{label}</span>
    </>
  )
}

/* Items 27: the request's start, then the exact time of every phase, to
   copy from. The Timing tab keeps the total and the notes. */
function PhaseList({ q }) {
  return (
    <div className="net-pop">
      <dl className="net-phases">
        <div className="net-phases__row net-phases__start"><dt>Start time</dt><dd>{fmtClockFine(q.start, 3)}</dd></div>
        {PHASES.map(p => {
          const v = q.timings[p.key]
          return (
            <div key={p.key} className={cx('net-phases__row', v === 0 && 'is-zero')}>
              <dt><span className="net-swatch" style={phaseStyle(p)} aria-hidden="true" />{p.label}</dt>
              <dd>{fmtMsExact(v)}</dd>
            </div>
          )
        })}
      </dl>
      <div className="net-pop__actions">
        <CopyIconButton icon={Copy} ariaLabel="Copy timings" copiedLabel="Timings copied" copy={() => copyText(timingText(q))} />
      </div>
    </div>
  )
}

/* Item 8: the popovers open below their row, or above it when the viewport
   ends first, and stay inside the viewport. The waterfall's opens beside the
   Waterfall column where the table has room, so the pointer can run down the
   column from bar to bar; the image preview lines up with the name. */
const EDGE = 8, GAP = 4
function nextToRow(tr, h) {
  const rr = visibleRect(tr)
  const vh = window.innerHeight
  const side = rr.bottom + GAP + h <= vh - EDGE || rr.top - GAP - h < EDGE ? 'bottom' : 'top'
  const top = side === 'bottom' ? rr.bottom + GAP : rr.top - GAP - h
  return { side, top: Math.min(Math.max(EDGE, top), vh - h - EDGE) }
}
function placeWaterfall(anchor, pop) {
  const tr = anchor.closest('tr'), td = anchor.closest('td'), sc = anchor.closest('.net-scroll')
  if (!tr || !td || !sc) return null
  const w = pop.offsetWidth, h = pop.offsetHeight, vw = window.innerWidth
  const { side, top } = nextToRow(tr, h)
  const cr = visibleRect(td), sr = sc.getBoundingClientRect()
  const bar = anchor.querySelector('.net-runbar')?.getBoundingClientRect()
  const barX = bar ? Math.min(cr.right, Math.max(cr.left, bar.left + bar.width / 2)) : cr.left + cr.width / 2
  let left, at
  if (cr.left - Math.max(sr.left, EDGE) >= w) { left = cr.left - w; at = cr.left }
  else if (Math.min(sr.right, vw - EDGE) - cr.right >= w) { left = cr.right; at = cr.right }
  else { left = barX - w / 2; at = barX }
  left = Math.min(Math.max(EDGE, left), vw - w - EDGE)
  return { top, left, side, caretX: Math.min(w - 16, Math.max(16, at - left)) }
}
function placeByName(anchor, pop) {
  const tr = anchor.closest('tr')
  if (!tr) return null
  const w = pop.offsetWidth, h = pop.offsetHeight
  const { side, top } = nextToRow(tr, h)
  const ar = anchor.getBoundingClientRect()
  const left = Math.min(Math.max(EDGE, ar.left), window.innerWidth - w - EDGE)
  return { top, left, side, caretX: Math.min(w - 16, Math.max(16, ar.left + 24 - left)) }
}

/* Items 10 and 17: a column's right edge resizes it. A separator, so arrow
   keys resize it too (Shift for bigger steps), Enter or a double-click
   restores its width, as the page's splitters do. */
function ColResize({ title, width, min, onChange, onReset }) {
  const start = useRef(null)
  const [dragging, setDragging] = useState(false)
  return (
    <span role="separator" tabIndex={0} aria-orientation="vertical" aria-label={`Resize ${title} column`}
      aria-valuenow={Math.round(width)} aria-valuemin={min} aria-valuemax={MAX_W}
      className={cx('net-colresize', dragging && 'is-dragging')}
      onPointerDown={e => {
        if (e.button !== 0) return
        e.preventDefault()
        e.stopPropagation()
        // From the width it shows: Name may be wider than its setting.
        start.current = { x: e.clientX, w: e.currentTarget.closest('th').offsetWidth }
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
      }}
      onPointerMove={e => { if (start.current) onChange(start.current.w + e.clientX - start.current.x) }}
      onPointerUp={() => { start.current = null; setDragging(false) }}
      onClick={e => e.stopPropagation()}
      onDoubleClick={e => { e.stopPropagation(); onReset() }}
      onKeyDown={e => {
        const big = e.shiftKey ? 64 : 16
        const v = e.key === 'ArrowRight' ? width + big : e.key === 'ArrowLeft' ? width - big
          : e.key === 'Home' ? min : e.key === 'End' ? MAX_W : null
        if (e.key === 'Enter') { e.preventDefault(); onReset(); return }
        if (v != null) { e.preventDefault(); e.stopPropagation(); onChange(v) }
      }} />
  )
}

/* v6 item 9: the limit lives in the overflow menu, and a menu holds no
   inputs (guidelines/ltactionmenu.md), so the item opens this dialog. */
function SlowLimitDialog({ isOpen, value, onClose, onSave }) {
  const [draft, setDraft] = useState(String(value))
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  useEffect(() => { if (isOpen) { setDraft(String(value)); setError('') } }, [isOpen])
  const save = () => {
    const n = Number(draft)
    if (!Number.isInteger(n) || n < 1 || n > 60000) {
      setError('Enter a whole number of milliseconds, from 1 to 60000.')
      inputRef.current?.focus()
      return
    }
    onSave(n)
  }
  return (
    <LTModal isOpen={isOpen} title="Slow response limit" onClose={onClose} extraStyle={{ width: 480 }} initialRef={inputRef}
      keepOnBackdrop={draft !== String(value)}
      renderFooter={() => (
        <>
          <LTButton variant="outline" size="medium" label={`Keep ${value}ms`} onClick={onClose} />
          <LTButton variant="primary" size="medium" label="Save Limit" onClick={save} />
        </>
      )}>
      <form className="net-slow" onSubmit={e => { e.preventDefault(); save() }}>
        <p className="net-slow__label" aria-hidden="true">Waiting (TTFB) limit, in milliseconds</p>
        <LTInputBox type="number" value={draft} onChange={v => { setDraft(v); setError('') }} forwardRef={inputRef}
          ariaLabel="Waiting (TTFB) limit, in milliseconds" className="net-slow__input" />
        {error && <p className="net-slow__error" role="alert">{error}</p>}
        <p className="net-slow__help">{`Requests that wait longer than this for the first byte of their response get the turtle. The default is ${SLOW_MS}ms.`}</p>
      </form>
    </LTModal>
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

export function NetworkTab({ test, codeTheme, setCodeTheme, isCurrent, demo, onRetry, focusRequest, onToast }) {
  const log = useMemo(() => networkFor(test.id), [test.id])
  const commands = useMemo(() => getDetail(test.id).commands, [test.id])
  const cmdById = useMemo(() => new Map(commands.map(c => [c.id, c])), [commands])
  const [type, setType] = useState('all')
  const [field, setField] = useState('all')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [showConnect, setShowConnect] = useState(false)
  const [sort, setSort] = useState({ key: 'start', dir: 'asc' }) // v6 item 16: run order on first load
  const [selectedId, setSelectedId] = useState(null)
  const [activeId, setActiveId] = useState(null) // the row in the tab order
  const [detailTab, setDetailTab] = useState('headers')
  const [panelW, setPanelW] = usePref('netPanelWidth', PANEL.def)
  const [overviewOn, setOverviewOn] = usePref('netOverview', true) // v6 item 19
  const [slowMs, setSlowMs] = usePref('netSlowMs', SLOW_MS) // v6 item 9
  const [colPref, setColPref] = usePref('netColumns', null) // v6 items 10 and 17
  const run = Math.max(1, test.durationSec)
  const [win, setWin] = useState(() => [0, run])
  const [hoverId, setHoverId] = useState(null)
  const [ctx, setCtx] = useState(null) // the row menu: { q, x, y }
  const [colMenu, setColMenu] = useState(null) // a column's menu: { key, x, y }
  const [slowOpen, setSlowOpen] = useState(false)
  const [dropX, setDropX] = useState(null) // where a dragged column lands
  const winRef = useRef(win)
  winRef.current = win
  const setWinRef = useRef(setWin)
  const bodyRef = useRef(null)
  const scrollRef = useRef(null)
  const searchRef = useRef(null)
  const toolbarRef = useRef(null)
  const typesRef = useRef(null)
  const focusPending = useRef(null)
  const dragCol = useRef(null)
  const suppressSort = useRef(false)
  const body = useSize(bodyRef)
  const toolbar = useSize(toolbarRef)
  const types = useSize(typesRef)
  const cols = useMemo(() => cleanCols(colPref), [colPref])
  const setCols = f => setColPref(p => f(cleanCols(p)))

  const fieldDef = FIELDS.find(f => f.value === field)
  const needle = query.trim().toLowerCase()
  const textOf = q => (field === 'all' ? FIELDS.slice(1).map(f => f.get(q)).join(' ') : fieldDef.get(q)).toLowerCase()
  const isSlow = q => q.method !== 'CONNECT' && q.timings.wait > slowMs
  // CONNECT tunnels count only while they show (Show CONNECT).
  const base = useMemo(() => log.requests.filter(q => showConnect || q.method !== 'CONNECT'), [log, showConnect])
  const matched = useMemo(() => base.filter(q => (type === 'all' || q.category === type)
    && (status === 'all' || (status === 'errors' ? q.status >= 400 : isSlow(q)))
    && (!needle || textOf(q).includes(needle))), [base, type, status, needle, field, slowMs])
  const narrowed = !isFullWin(win, run)
  const rows = useMemo(() => {
    // The window keeps every request that runs at any moment of it.
    const out = narrowed ? matched.filter(q => q.end >= win[0] && q.start <= win[1]) : [...matched]
    const by = SORTERS[sort.key]
    // Ties keep run order, whichever way the column sorts.
    return out.sort((a, b) => (sort.dir === 'asc' ? by(a, b) : by(b, a)) || a.start - b.start)
  }, [matched, narrowed, win, sort])
  const filtering = type !== 'all' || status !== 'all' || !!needle || narrowed
  const errorCount = useMemo(() => base.filter(q => q.status >= 400).length, [base])
  const slowCount = useMemo(() => base.filter(isSlow).length, [base, slowMs])
  // Item 3: each page load runs from its document to the last request
  // before the next navigation.
  const pages = useMemo(() => log.on ? log.pages.map((p, i) => {
    const doc = log.requests.find(q => q.id === p.docId)
    const own = log.requests.filter(q => q.pageIndex === i && q.method !== 'CONNECT')
    const a = doc?.start ?? p.at
    return { ...p, win: [a, Math.max(a + MIN_SPAN, ...own.map(q => q.end))] }
  }) : [], [log])

  const selIndex = rows.findIndex(q => q.id === selectedId)
  const selected = selIndex >= 0 ? rows[selIndex] : null
  const current = rows.some(q => q.id === activeId) ? activeId : rows[0]?.id
  // A filter that hides the open request closes its details.
  useEffect(() => { if (selectedId && selIndex < 0 && !focusPending.current) setSelectedId(null) }, [selectedId, selIndex])
  // A popover over rows that moved would point at the wrong one.
  useEffect(() => { closePopover() }, [rows])

  const rowEl = id => scrollRef.current?.querySelector(`[data-row="${id}"]`)
  const reveal = (id, center = false) => {
    const sc = scrollRef.current, tr = rowEl(id)?.closest('tr')
    if (!sc || !tr) return
    const sr = sc.getBoundingClientRect(), rr = tr.getBoundingClientRect()
    const head = sc.querySelector('thead')?.getBoundingClientRect().height ?? 0
    if (center) sc.scrollTop += rr.top - sr.top - head - (sc.clientHeight - head - rr.height) / 2
    else if (rr.top < sr.top + head) sc.scrollTop -= sr.top + head - rr.top
    else if (rr.bottom > sr.bottom) sc.scrollTop += rr.bottom - sr.bottom
  }
  // The open request stays in view as it changes (keys, Previous, Next).
  useEffect(() => { if (selectedId && !focusPending.current) reveal(selectedId) }, [selectedId])

  // Item 13: selecting a request seeks the video to its start, as a command
  // does (the video and All Commands follow, playback.js).
  const select = id => {
    const q = log.requests.find(r => r.id === id)
    setSelectedId(id)
    setActiveId(id)
    if (q) jumpTo(q.start, { source: 'network' })
  }
  const open = (id, tab) => {
    if (tab) setDetailTab(tab)
    select(id)
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
    if (next) select(next.id)
  }

  /* Item 28: a request's link opens the test on it. Whatever hides it is
     cleared (the type, the status filter, the search, the window, CONNECT),
     the details open, the row comes into view with focus, and the video
     seeks to it. */
  useEffect(() => {
    if (!focusRequest?.id || demo || !log.on) return
    const q = log.requests.find(r => r.id === focusRequest.id)
    if (!q) { onToast?.(`Request ${focusRequest.id} is outside this run's network log.`, 'default'); return }
    if (type !== 'all' && q.category !== type) setType('all')
    if (status !== 'all') setStatus('all')
    if (needle && !textOf(q).includes(needle)) setQuery('')
    if (q.method === 'CONNECT') setShowConnect(true)
    if (!(q.end >= win[0] && q.start <= win[1])) setWin([0, run])
    focusPending.current = q.id
    setSelectedId(q.id)
    setActiveId(q.id)
    // After the page's own reset of the video for a newly opened test
    // (App.jsx), which runs once this effect has.
    const t = setTimeout(() => jumpTo(q.start, { source: 'network' }), 0)
    return () => clearTimeout(t)
  }, [focusRequest?.n])
  useLayoutEffect(() => {
    const id = focusPending.current
    if (!id || !isCurrent || !rowEl(id)) return
    focusPending.current = null
    reveal(id, true)
    rowEl(id).focus({ preventScroll: true })
  })

  const resetWin = () => {
    if (isFullWin(winRef.current, run)) return
    setWin([0, run])
  }
  // The window's changes are announced once they settle, with what shows.
  const firstWin = useRef(true)
  useEffect(() => {
    if (firstWin.current) { firstWin.current = false; return }
    const t = setTimeout(() => announce(isFullWin(win, run) ? `Showing the whole session, ${rows.length} requests`
      : `Showing ${fmtWindow(win[0], win[1])}, ${rows.length} of ${base.length} requests`), 600)
    return () => clearTimeout(t)
  }, [win[0], win[1]])
  // R shows the whole session again (Rajat, 28 Oct 2026), from anywhere on
  // the tab but a text field, as "/" and "S" work across the page (App.jsx).
  useEffect(() => {
    if (!isCurrent) return
    const onKey = e => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || (e.key !== 'r' && e.key !== 'R')) return
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"], [role="menu"]') || document.querySelector('.lt-backdrop')) return
      e.preventDefault()
      resetWin()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  /* Item 5 in the Waterfall column: a pinch zooms around the pointer, a
     sideways scroll moves a zoomed-in window (network-overview.jsx). */
  const ready = log.on && test.status !== 'queued' && !demo && log.requests.length > 0
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = e => {
      const cell = e.target.closest?.('.net-wf-cell')
      const lane = (cell?.querySelector('.net-wf__lane') ?? (cell && el.querySelector('td.net-wf-cell .net-wf__lane')))
      if (!lane) return
      const lr = lane.getBoundingClientRect()
      const [a, b] = winRef.current
      const t = a + Math.min(1, Math.max(0, (e.clientX - lr.left) / lr.width)) * (b - a)
      const next = wheelWin(e, winRef.current, run, t, lr.width)
      if (e.ctrlKey) e.preventDefault()
      if (!next) return
      e.preventDefault()
      winRef.current = next // the next event of the same gesture builds on this one
      setWin(next)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [run, ready])
  const laneTimeAt = x => {
    const lane = scrollRef.current?.querySelector('td.net-wf-cell .net-wf__lane')
    const [a, b] = winRef.current
    if (!lane) return (a + b) / 2
    const lr = lane.getBoundingClientRect()
    return a + Math.min(1, Math.max(0, (x - lr.left) / lr.width)) * (b - a)
  }
  useGestureZoom(scrollRef, { winRef, run, timeAt: laneTimeAt, onWin: setWinRef, within: '.net-wf-cell' })

  const onSort = key => {
    if (suppressSort.current) return
    const dir = sort.key === key && sort.dir === 'asc' ? 'desc' : 'asc'
    setSort({ key, dir })
    announce(`Sorted by ${TITLES[key]}, ${dir === 'asc' ? 'ascending' : 'descending'}`)
  }

  /* The list is one tab stop (as All Commands, v2 item 7): Up and Down move
     between requests, Home and End to the ends, Enter opens one. With the
     details open, the open request follows. Esc closes the details. Shift
     + F10 or the menu key opens the request's menu (item 14). */
  const onKeyDown = e => {
    const id = e.target.closest?.('[data-row]')?.dataset.row
    if (!id) return
    const i = rows.findIndex(q => q.id === id)
    if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') {
      e.preventDefault()
      const r = e.target.getBoundingClientRect()
      setCtx({ q: rows[i], x: r.left + 24, y: r.bottom })
      return
    }
    const j = e.key === 'ArrowDown' ? Math.min(rows.length - 1, i + 1) : e.key === 'ArrowUp' ? Math.max(0, i - 1)
      : e.key === 'Home' ? 0 : e.key === 'End' ? rows.length - 1 : null
    if (e.key === 'Escape' && selected) { e.preventDefault(); close(); return }
    if (j == null) return
    e.preventDefault()
    const to = rows[j].id
    setActiveId(to)
    if (selected) select(to)
    rowEl(to)?.focus({ preventScroll: true })
    reveal(to)
  }

  /* ---------- request actions (item 14) ---------- */
  const runCopy = async (value, q) => {
    const c = copyFor(value, { test, log, q })
    if (!c) return
    const ok = await copyText(c.text)
    onToast?.(ok ? c.done : c.failed, ok ? 'success' : 'danger')
  }
  const closeCtx = () => {
    const id = ctx?.q.id
    setCtx(null)
    if (id) rowEl(id)?.focus({ preventScroll: true })
  }

  /* ---------- HAR (items 22 and 23) ---------- */
  const saveHar = (requests, suffix) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(toHar(test, log, requests), null, 2)], { type: 'application/json' }))
    a.download = `${test.testId}-network${suffix}.har`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const downloadHar = () => saveHar(log.requests, '')
  const downloadFiltered = () => saveHar(rows, '-filtered')
  // compare.sitespeed.io opens a HAR from a link to it (its har1 parameter),
  // so it gets this test's HAR file, built beside the page (vite.config.js).
  const viewHar = () => {
    const har = new URL(`har/${test.id}.har`, window.location.href).href
    window.open(`https://compare.sitespeed.io/?har1=${encodeURIComponent(har)}&compare=1`, '_blank', 'noopener,noreferrer')
  }
  const harOptions = [
    { value: 'view', label: 'View HAR file in external viewer', icon: ExternalLink, description: 'compare.sitespeed.io, in a new tab' },
    { value: 'filtered', label: 'Download HAR for filtered requests', icon: Download, inactive: !filtering,
      description: filtering ? `${rows.length} of ${base.length} requests` : 'Available while a filter is on' },
  ]
  const onHar = v => { if (v === 'har') downloadHar(); if (v === 'view') viewHar(); if (v === 'filtered') downloadFiltered() }

  const clearFilters = () => { setType('all'); setStatus('all'); setQuery(''); setField('all'); setWin([0, run]) }

  /* ---------- columns: resize, reorder (items 10 and 17) ---------- */
  const setWidth = (key, v) => setCols(c => ({ ...c, widths: { ...c.widths, [key]: Math.min(MAX_W, Math.max(MIN_W[key], Math.round(v))) } }))
  const moveCol = (key, to) => {
    const from = cols.order.indexOf(key)
    const at = Math.min(cols.order.length - 1, Math.max(0, to))
    if (from === at) return
    setCols(c => ({ ...c, order: moved(c.order, from, at) }))
    announce(`${TITLES[key]} column moved to position ${at + 2} of ${cols.order.length + 1}`)
  }
  const endColDrag = (commit = true) => {
    const d = dragCol.current
    if (!d) return
    dragCol.current = null
    d.th.style.transform = ''
    d.th.classList.remove('is-dragged')
    setDropX(null)
    if (d.started) {
      // The click that ends the drag must not sort.
      suppressSort.current = true
      setTimeout(() => { suppressSort.current = false }, 0)
      if (commit) moveCol(d.key, d.to)
    }
  }
  useEffect(() => {
    if (dropX == null) return
    const onKey = e => { if (e.key === 'Escape') { e.preventDefault(); endColDrag(false); announce('Column move canceled') } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dropX != null])
  const headerProps = c => {
    if (c.key === 'name' || selected) return { 'data-col': c.key }
    return {
      'data-col': c.key,
      onPointerDown: e => {
        if (e.button !== 0 || e.pointerType === 'touch' || e.target.closest('.net-colresize')) return
        const th = e.currentTarget
        const ths = [...th.parentElement.querySelectorAll('th[data-col]')].filter(t => t.dataset.col !== 'name')
        dragCol.current = { key: c.key, th, ths, rects: ths.map(t => t.getBoundingClientRect()), from: ths.indexOf(th),
          to: ths.indexOf(th), x0: e.clientX, started: false, pointerId: e.pointerId }
      },
      onPointerMove: e => {
        const d = dragCol.current
        if (!d) return
        const dx = e.clientX - d.x0
        if (!d.started) {
          if (Math.abs(dx) < 4) return
          d.started = true
          try { d.th.setPointerCapture(d.pointerId) } catch { /* pointer already gone */ }
          d.th.classList.add('is-dragged')
        }
        d.th.style.transform = `translateX(${dx}px)`
        const r = d.rects[d.from]
        const centre = r.left + r.width / 2 + dx
        const others = d.rects.filter((_, i) => i !== d.from)
        d.to = others.filter(o => o.left + o.width / 2 < centre).length
        // The line marks the edge the column lands on.
        const sc = scrollRef.current, sr = sc.getBoundingClientRect()
        const edge = d.to < others.length ? others[d.to].left : others[others.length - 1].right
        setDropX({ x: edge - sr.left + sc.scrollLeft, top: sc.scrollTop, h: sc.clientHeight })
      },
      onPointerUp: () => endColDrag(true),
      onPointerCancel: () => endColDrag(false),
      onContextMenu: e => { e.preventDefault(); setColMenu({ key: c.key, x: e.clientX, y: e.clientY }) },
      onKeyDown: e => {
        if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') {
          e.preventDefault()
          const r = e.currentTarget.getBoundingClientRect()
          setColMenu({ key: c.key, x: r.left, y: r.bottom })
        }
      },
    }
  }
  const isDefaultCols = cols.order.join() === COLS.join() && Object.keys(WIDTH).every(k => cols.widths[k] === WIDTH[k])

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
  const [a, b] = win

  /* ---------- columns ---------- */
  const marks = MARKS[field]
  const mark = key => (marks.includes(key) ? needle : '')
  // Name and Status beside the details; Name alone, as developer tools have
  // it, when the logs are too narrow for both (1280px wide).
  const compact = !!selected
  const nameOnly = compact && bodyW - panelNow - 1 < TABLE_MIN
  const resize = key => (
    <ColResize title={TITLES[key]} width={cols.widths[key]} min={MIN_W[key]}
      onChange={v => setWidth(key, v)} onReset={() => setWidth(key, WIDTH[key])} />
  )
  const DEFS = {
    status: { title: 'Status', sortable: true, render: q => (
      <span className={cx('net-status', q.status >= 400 && 'is-error')}>
        <Hl text={String(q.status)} q={mark('status')} /><span className="vh">{` ${q.statusText}`}</span>
      </span>
    ) },
    method: { title: 'Method', sortable: true, className: 'is-muted', render: q => <Hl text={q.method} q={mark('method')} /> },
    domain: { title: 'Domain', sortable: true, className: 'is-muted',
      render: q => <TruncText className="net-ellipsis" text={q.host}><Hl text={q.host} q={mark('domain')} /></TruncText> },
    type: { title: 'Type', sortable: true, className: 'is-muted',
      render: q => <TruncText className="net-ellipsis" text={q.type}><Hl text={q.type} q={mark('type')} /></TruncText> },
    size: { title: 'Size', sortable: true, align: 'end', render: q => fmtBytes(q.bytes) },
    start: { title: 'Start time', sortable: true, align: 'end', className: 'is-muted', render: q => fmtClock(q.start) },
    // Item 12: the command running when the request started, or the last
    // one before it, which says "after". It links to the command.
    command: { title: 'Command', sortable: true, render: q => {
      const c = cmdById.get(q.cmdId)
      if (!c) return <span className="net-cmd is-muted">Before the first command</span>
      return (
        <span className="net-cmd">
          {!q.cmdRunning && <span className="net-cmd__after">after</span>}
          <LTLink href={`#/${test.id}/commands/${c.id}`} className="net-cmd__link" aria-label={`${c.name}, at ${fmtTime(c.at)}`}>
            <TruncText className="net-ellipsis" text={c.name} />
          </LTLink>
        </span>
      )
    } },
    waterfall: { title: 'Waterfall', className: 'net-wf-cell' },
  }
  const shown = compact ? (nameOnly ? [] : ['status']) : cols.order
  const lastKey = shown[shown.length - 1] ?? 'name'
  // The lane: the column less its padding (16px at the table's edge).
  const laneW = cols.widths.waterfall - 8 - (lastKey === 'waterfall' ? 16 : 8)
  const span = b - a
  const gStep = gridStep(span)
  const grid = {
    '--wf-step': `${(gStep / span) * laneW}px`,
    '--wf-x0': `${((Math.ceil(a / gStep - 1e-9) * gStep - a) / span) * laneW}px`,
  }
  const columns = [
    { key: 'name', title: 'Name', sortable: true, headerExtra: !compact && resize('name'), render: q => {
      const slow = isSlow(q)
      const cell = (
        <span className="net-namecell">
          <button type="button" className="net-name" data-row={q.id} tabIndex={q.id === current ? 0 : -1}
            aria-expanded={q.id === selectedId} aria-controls={q.id === selectedId ? 'net-detail' : undefined}>
            {q.preview ? <span className="net-ellipsis"><Hl text={q.name} q={mark('name')} /></span>
              : <TruncText className="net-ellipsis" text={q.name}><Hl text={q.name} q={mark('name')} /></TruncText>}
            {(q.preview || slow) && (
              <span className="vh">{[q.preview && ', image', slow && `, slow response: ${fmtMsExact(q.timings.wait)} waiting`].filter(Boolean).join('')}</span>
            )}
          </button>
          {/* Item 20: images show which they are; item 9: slow ones too. */}
          {q.preview && <Image size={14} aria-hidden="true" className="net-flag" />}
          {slow && (
            <LTTooltip text={`Slow response: waited ${fmtMsExact(q.timings.wait)} for the first byte, over the ${slowMs}ms limit`} direction="top">
              <span className="net-flag net-flag--slow"><Turtle size={14} aria-hidden="true" /></span>
            </LTTooltip>
          )}
          {/* The menu's mouse twin; the keyboard uses Shift + F10. */}
          <button type="button" className="net-rowmenu" tabIndex={-1} aria-hidden="true"
            onClick={e => {
              e.stopPropagation()
              const r = e.currentTarget.getBoundingClientRect()
              setActiveId(q.id)
              setCtx({ q, x: r.left, y: r.bottom })
            }}>
            <Ellipsis size={16} aria-hidden="true" />
          </button>
        </span>
      )
      // Item 11: an image previews on hover, under or over its row.
      return q.preview ? (
        <LTPopover heading={q.name} popOverbodyJSX={<ImagePreview q={q} compact />} place={placeByName} openDelay={300}
          className="net-imgpop" forceClose={!isCurrent}>
          {cell}
        </LTPopover>
      ) : cell
    } },
    ...shown.map(key => {
      const d = DEFS[key]
      const col = { key, ...d, width: cols.widths[key], headerExtra: compact ? undefined : resize(key) }
      if (key !== 'waterfall') return col
      return {
        ...col,
        headerExtra: compact ? undefined : <><span className="net-wf-scale">{fmtWindow(a, b)}</span>{resize('waterfall')}</>,
        // Items 8 and 27: hover opens the phases after a moment, and they
        // stay until closed so they can be copied. The Timing tab holds
        // the same numbers for the keyboard.
        render: q => (
          <LTPopover containsInteractiveChildElement heading={q.name} forceClose={!isCurrent} place={placeWaterfall}
            popOverbodyJSX={<PhaseList q={q} />}>
            <span className="net-wf" aria-hidden="true">
              <span className="net-wf__lane"><WaterfallBar q={q} win={win} laneW={laneW} /></span>
            </span>
          </LTPopover>
        ),
      }
    }),
  ]
  const minW = cols.widths.name + shown.reduce((sum, k) => sum + cols.widths[k], 0)
  const hot = [...new Set([hoverId, selectedId])].map(id => id && log.requests.find(q => q.id === id)).filter(Boolean)

  const sum = (list, k) => list.reduce((s, q) => s + q[k], 0)
  const finished = Math.max(...log.requests.map(q => q.end))
  // The product's footer. Filtered, the count says "of" the whole (item 6),
  // and the sizes add up what shows.
  const noun = n => `request${n === 1 ? '' : 's'}`
  const foot = [
    filtering ? `${rows.length} of ${base.length} ${noun(base.length)}` : `${base.length} ${noun(base.length)}`,
    `${fmtBytes(sum(rows, 'bytes'))} transferred`,
    `${fmtBytes(sum(rows, 'resourceBytes'))} resources`,
    `Finished in ${fmtDuration(finished)}`,
  ]

  const typeDef = TYPES.find(t => t.value === type)
  const scope = narrowed ? 'in this time range' : 'in this run'
  const emptyWhy = needle ? 'Try a different search term or field.'
    : status === 'errors' ? `Every ${type !== 'all' ? `${typeDef.noun} ` : ''}request ${scope} succeeded.`
      : status === 'slow' ? `Every ${type !== 'all' ? `${typeDef.noun} ` : ''}request ${scope} got its first byte within ${slowMs}ms.`
        : type !== 'all' ? (narrowed ? `This time range has 0 ${typeDef.noun} requests.` : `This run made 0 ${typeDef.noun} requests.`)
          : 'Try a wider time range.'

  /* Item 26: the toolbar keeps its order of importance as the logs narrow.
     The filters stay; the HAR actions fold into the overflow menu first. */
  const toolsW = toolbar.width - 32
  const foldHar = !!toolbar.width && types.width + 8 + 60 + 8 + 32 > toolsW
  const moreOptions = [
    ...(foldHar ? [{ value: 'har', label: 'Download HAR', icon: Download }, ...harOptions, { divider: true }] : []),
    { value: 'slow', label: 'Set slow response limit', icon: Turtle, description: `Now ${slowMs}ms of waiting (TTFB)` },
  ]

  return (
    <div className="net">
      <div className="net-toolbar" ref={toolbarRef}>
        <div className="net-toolbar__row">
          <span ref={typesRef} className="net-types">
            <LTSegmentedControl ariaLabel="Request type" selectedValue={type} onChange={setType}
              options={TYPES.map(t => ({ value: t.value, label: t.label }))} />
          </span>
          <span className="net-toolbar__end">
            {/* Item 22: Download HAR, with its caret menu (a split button,
                guidelines/ltbuttongroup.md; the brief makes both halves icons). */}
            {!foldHar && (
              <LTButtonGroup ariaLabel="HAR file">
                <LTIconButton icon={Download} ariaLabel="Download HAR" variant="outline" size="medium" onClick={downloadHar} />
                <LTActionMenu ariaLabel="HAR actions" width={288} onSelect={o => onHar(o.value)} options={harOptions}
                  customAnchor={<LTIconButton icon={ChevronDown} ariaLabel="More HAR actions" variant="outline" size="medium"
                    unsafeDisableTooltip />} />
              </LTButtonGroup>
            )}
            <LTActionMenu ariaLabel="More network actions" width={288} options={moreOptions}
              onSelect={o => { if (o.value === 'slow') setSlowOpen(true); else onHar(o.value) }}
              customAnchor={<LTIconButton icon={Ellipsis} ariaLabel="More actions" variant="outline" size="medium" />} />
          </span>
        </div>
        <div className="net-toolbar__row">
          {/* The search's scope: LTButton outline with a caret and a single
              selection menu, as All Commands' test filter (README §5, C11). */}
          <LTActionMenu ariaLabel="Search in" width={200} align="start" selectionVariant="single" activeId={field}
            customAnchor={<LTButton variant="outline" size="medium" trailingIcon={ChevronDown} className="net-field"
              ariaLabel={`Search in: ${fieldDef.label}`} label={fieldDef.label} />}
            onSelect={o => { setField(o.value); searchRef.current?.focus() }}
            options={FIELDS.map(f => ({ value: f.value, label: f.label }))} />
          <LTInputBox value={query} onChange={setQuery} placeholder={fieldDef.placeholder} ariaLabel={fieldDef.placeholder}
            forwardRef={searchRef} className="net-search"
            onKeyDown={e => { if (e.key === 'Escape' && query) { e.preventDefault(); e.stopPropagation(); setQuery('') } }} />
          {/* Item 24: a filter menu, as the tests pane has (README §5). */}
          <LTActionMenu ariaLabel="Filter requests" width={248} selectionVariant="single" activeId={status}
            onSelect={o => setStatus(o.value)}
            customAnchor={<LTIconButton icon={ListFilter} variant="outline" size="medium"
              ariaLabel={status === 'all' ? 'Filter requests' : `Filter requests: ${STATUSES[status]}`} />}
            options={[
              { value: 'all', label: STATUSES.all },
              { value: 'errors', label: STATUSES.errors, description: 'Status 400 and above' },
              { value: 'slow', label: STATUSES.slow, description: `Waiting (TTFB) over ${slowMs}ms` },
            ]} />
          <LTSwitch label="Show CONNECT" checked={showConnect} onValueChange={setShowConnect} />
        </div>
        <div className="net-toolbar__row net-toolbar__status">
          {/* Item 24: the counts, a readout as the tests pane has (not a
              filter); the active filters as tokens (item 6). */}
          <p className="net-readout">
            <LTTooltip text={`${errorCount} error${errorCount === 1 ? '' : 's'}: status 400 and above`} direction="top">
              <span><StatusGlyph status="failed" size={14} />{errorCount}<span className="vh">{` error${errorCount === 1 ? '' : 's'}`}</span></span>
            </LTTooltip>
            <LTTooltip text={`${slowCount} slow response${slowCount === 1 ? '' : 's'}: over ${slowMs}ms of waiting`} direction="top">
              <span><Turtle size={14} aria-hidden="true" className="net-readout__slow" />{slowCount}
                <span className="vh">{` slow response${slowCount === 1 ? '' : 's'}`}</span></span>
            </LTTooltip>
          </p>
          {status !== 'all' && (
            <LTToken size="small" text={STATUSES[status]} onRemove={() => setStatus('all')} removeLabel={`Clear filter: ${STATUSES[status]}`} />
          )}
          {narrowed && (
            <LTToken size="small" text={`Time: ${fmtWindow(a, b)}`} onRemove={resetWin} removeLabel="Clear time range"
              removeTooltip="Clear time range (R)" />
          )}
          <span className="spacer" />
          <LTSwitch label="Overview" checked={overviewOn} onValueChange={setOverviewOn} />
        </div>
      </div>

      {overviewOn && (
        <NetworkOverview requests={matched} pages={pages} commands={commands} run={run} win={win} onWin={setWin}
          errors={matched.filter(q => q.status >= 400)} hot={hot} />
      )}

      <div className="net-body" ref={bodyRef}>
        <div ref={scrollRef} className={cx('net-scroll', compact && 'is-compact')} onKeyDown={onKeyDown}
          style={{ '--net-min': `${minW}px`, ...grid }}>
          {rows.length === 0 ? (
            <LTBlankSlate heading="0 matching requests" description={emptyWhy}
              primaryAction={<LTButton variant="outline" size="small" label="Clear Filters" onClick={clearFilters} />} />
          ) : (
            <LTTable caption={`Network requests of ${test.name}`} className={cx('net-table', compact && 'is-compact')}
              columns={columns} data={rows} sort={sort} onSort={onSort} rowKey={q => q.id} headerProps={headerProps}
              rowProps={q => ({
                className: cx('net-row', q.status >= 400 && 'is-error', q.id === selectedId && 'is-selected', ctx?.q.id === q.id && 'has-menu'),
                // A click on the bar opens the details on Timing; a link
                // goes where it points.
                onClick: e => { if (!e.target.closest('a, .net-rowmenu')) open(q.id, e.target.closest('.net-wf') ? 'timing' : null) },
                onContextMenu: e => { e.preventDefault(); setActiveId(q.id); setCtx({ q, x: e.clientX, y: e.clientY }) },
                onMouseEnter: () => setHoverId(q.id),
                onMouseLeave: () => setHoverId(h => (h === q.id ? null : h)),
              })} />
          )}
          {dropX != null && <span className="net-coldrop" style={{ left: dropX.x, top: dropX.top, height: dropX.h }} aria-hidden="true" />}
        </div>
        {selected && (
          <>
            <Splitter orientation="vertical" invert label="Resize request details" value={panelNow}
              min={PANEL.min} max={panelMax} defaultValue={PANEL.def} onChange={setPanelW} />
            <div className="net-detail-wrap" style={{ width: panelNow }}
              onKeyDown={e => { if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); close() } }}>
              <RequestDetails q={selected} testId={test.id} index={selIndex} count={rows.length} tab={detailTab} setTab={setDetailTab}
                onPrev={() => step(-1)} onNext={() => step(1)} onClose={close} onCopy={runCopy}
                codeTheme={codeTheme} setCodeTheme={setCodeTheme} />
            </div>
          </>
        )}
      </div>

      <p className="net-foot">
        {foot.map((f, i) => (
          <span key={i}>{i > 0 && <span className="meta-dot" aria-hidden="true">·</span>}{f}</span>
        ))}
      </p>

      {ctx && (
        // Item 14's row menu: right-click, Shift + F10, or the row's ⋯. The
        // same copies as the details' menu, with the link first.
        <LTActionMenu open onMenuToggle={o => { if (!o) closeCtx() }} align="start" width={248}
          ariaLabel={`Actions for ${where(ctx.q)}`}
          customAnchor={<span className="ctx-anchor" style={{ left: ctx.x, top: ctx.y }} />}
          onSelect={o => runCopy(o.value, ctx.q)} options={copyOptions(ctx.q)} />
      )}
      {colMenu && (
        // Every move a drag makes, from the keyboard too (README §10).
        <LTActionMenu open onMenuToggle={o => { if (!o) setColMenu(null) }} align="start" width={232}
          ariaLabel={`Move ${TITLES[colMenu.key]} column`}
          customAnchor={<span className="ctx-anchor" style={{ left: colMenu.x, top: colMenu.y }} />}
          onSelect={o => {
            const i = cols.order.indexOf(colMenu.key)
            if (o.value === 'left') moveCol(colMenu.key, i - 1)
            if (o.value === 'right') moveCol(colMenu.key, i + 1)
            if (o.value === 'reset') { setColPref(null); announce('Columns back in their default order and widths') }
          }}
          options={(() => {
            const i = cols.order.indexOf(colMenu.key)
            const last = i === cols.order.length - 1
            return [
              { value: 'left', label: 'Move left', icon: ArrowLeft, inactive: i === 0, description: i === 0 ? 'Already next to Name' : undefined },
              { value: 'right', label: 'Move right', icon: ArrowRight, inactive: last, description: last ? 'Already the last column' : undefined },
              { divider: true },
              { value: 'reset', label: 'Reset columns', icon: RotateCcw, inactive: isDefaultCols,
                description: isDefaultCols ? 'Already in the default order and widths' : undefined },
            ]
          })()} />
      )}
      <SlowLimitDialog isOpen={slowOpen} value={slowMs} onClose={() => setSlowOpen(false)}
        onSave={v => { setSlowMs(v); setSlowOpen(false); announce(`Slow response limit set to ${v}ms`) }} />
    </div>
  )
}
