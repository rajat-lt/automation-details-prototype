// A request's details beside the Network tab's list (v5 item 4), and what
// v6 added to them (Rajat, 28 Oct 2026): the request's actions in the header
// (item 14: Copy link shows, the other copies sit in its menu, and each tab
// copies what it shows), a Preview tab for images (item 11), and the state a
// tab shows when the run kept no response bodies (item 15).
import React from 'react'
import { ChevronDown, ChevronUp, Copy, Ellipsis, Link, Moon, Sun, X } from 'lucide-react'
import {
  LTBlankSlate, LTCodeBlock, LTCopyToClipboard, CopyIconButton, LTCounterLabel, LTIconButton, LTLink, LTTable, TruncText, cx,
} from './lt.jsx'
import { LTActionMenu, LTTabNav } from './overlays.jsx'
import { Json } from './commands.jsx'
import { PHASES, phaseStyle } from './network-data.js'
import { copyOptions, headersText, requestHref, where } from './network-copy.js'
import { fmtBytes, fmtClock, fmtClockFine, fmtMsExact } from './format.js'
import { copyText } from './clipboard.js'

// LambdaTest's docs, read 28 Oct 2026: "Enable HAR logging by passing
// network.full.har = true in your test capabilities."
const HAR_DOCS = 'https://www.testmuai.com/support/docs/debugging-options/#how-to-use-the-har-log-viewer'

/* Why some phases took 0ms, said once under the Timing tab's list. */
function timingNote(q) {
  if (q.method === 'CONNECT') return 'CONNECT opens a tunnel for the HTTPS requests after it, so its DNS lookup and SSL show 0ms.'
  if (!q.timings.connect && !q.timings.ssl) return 'The connection was already open, so DNS lookup, initial connection and SSL took 0ms.'
  if (!q.timings.dns) return 'The address was already known, so DNS lookup took 0ms.'
  return null
}
/** The timings as text: what the popover shows (start and phases), plus the total on the Timing tab. */
export const timingText = (q, total = false) => [q.url, `Start time: ${fmtClockFine(q.start, 3)}`,
  ...PHASES.map(p => `${p.label}: ${fmtMsExact(q.timings[p.key])}`), ...(total ? [`Total: ${fmtMsExact(q.duration)}`] : [])].join('\n')

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

/* Item 15: the run kept headers and timings only. The heading says what is
   happening, the body what turning it on gives, with the capability to copy
   and the docs that name it (ux-text-guidelines.md §3 Empty states). */
function CaptureOff({ what }) {
  return (
    <LTBlankSlate heading="Response body capture is off"
      description={`This run recorded headers and timings only. Set network.full.har to true to capture ${what} on the next run.`}
      primaryAction={(
        <div className="net-capture">
          <span className="net-capture__cap">
            <code>"network.full.har": true</code>
            <LTCopyToClipboard textToCopy={'"network.full.har": true'} size="xsmall" copyAriaLabel="Copy capability"
              copiedAriaLabel="Capability copied" />
          </span>
          <LTLink href={HAR_DOCS} target="_blank" rel="noopener noreferrer">View HAR Docs</LTLink>
        </div>
      )} />
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
  // v6 item 14: each list of headers copies itself, where it shows.
  const section = (title, rows, column, none, copyLabel) => (
    <section className="net-dp__section">
      <h3 className="net-dp__title">
        {title}{rows.length > 0 && column && <LTCounterLabel count={rows.length} />}
        {rows.length > 0 && copyLabel && (
          <CopyIconButton icon={Copy} size="xsmall" ariaLabel={copyLabel} copiedLabel={`${title} copied`}
            copy={() => copyText(headersText(rows))} className="net-dp__copy" />
        )}
      </h3>
      {rows.length ? <LTTable caption={title} allowValueCopy columns={KV_COLUMNS(column)} data={kv(rows)} />
        : <p className="net-dp__none">{none}</p>}
    </section>
  )
  return (
    <div className="net-dp__stack">
      {section('General', general, null)}
      {section('Response headers', q.responseHeaders, 'Header', '0 response headers.', 'Copy response headers')}
      {section('Request headers', q.requestHeaders, 'Header', '0 request headers.', 'Copy request headers')}
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
  if (q.body.kind === 'uncaptured') return <CaptureOff what="response bodies" />
  if (q.body.kind === 'empty') {
    const why = q.method === 'CONNECT' ? 'A CONNECT request opens a tunnel. Its answer is a status line only.'
      : q.status === 304 ? 'The server answered 304 Not Modified, so the browser used its cached copy.'
        : `The server answered ${q.status} ${q.statusText}.`
    return <LTBlankSlate heading="Empty response body" description={why} />
  }
  if (q.body.kind === 'binary') {
    return <LTBlankSlate heading="Binary response"
      description={`This response is ${q.mime}, ${fmtBytes(q.resourceBytes)}. ${q.preview ? 'The Preview tab shows it.' : 'This tab shows text responses.'}`} />
  }
  return <CodeView title={q.mime} text={q.body.text} json={q.body.lang === 'json'} codeTheme={codeTheme}
    setCodeTheme={setCodeTheme} copyLabel="Copy response" copiedLabel="Response copied" />
}

/* Item 11: the image itself, on a checkerboard so transparent parts show,
   at its own size up to the panel's width. */
export function ImagePreview({ q, compact = false }) {
  const p = q.preview
  return (
    <figure className={cx('net-img', compact && 'net-img--compact')}>
      <span className="net-img__frame">
        {/* A set width: a percentage alone collapses inside a popover sized to its content. */}
        <img src={p.src} width={p.width} height={p.height} style={{ width: p.width }}
          alt={compact ? '' : `${q.name}, ${p.width} × ${p.height}`} />
      </span>
      <figcaption className="net-img__meta">
        {`${p.width} × ${p.height} · ${q.mime}${p.cached ? ' · cached copy' : ` · ${fmtBytes(q.resourceBytes)}`}`}
      </figcaption>
    </figure>
  )
}

function PreviewPanel({ q }) {
  if (q.body.kind === 'uncaptured') return <CaptureOff what="images" />
  return (
    <div className="net-dp__stack">
      <ImagePreview q={q} />
      {q.preview.cached && <p className="net-dp__none">The server answered 304 Not Modified, so this is the copy the browser had.</p>}
    </div>
  )
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
        <p className="net-timing__meta">{`Started at ${fmtClockFine(q.start, 3)} · ${fmtMsExact(q.duration)} in total`}</p>
        <CopyIconButton icon={Copy} ariaLabel="Copy timings" copiedLabel="Timings copied" copy={() => copyText(timingText(q, true))} />
      </div>
      <LTTable caption={`Timing of ${q.name}`} className="net-ttable" rowKey={r => r.key}
        rowProps={r => ({ className: cx(r.ms === 0 && 'is-zero', r.total && 'is-total') })}
        columns={[
          { key: 'phase', title: 'Phase', render: r => (
            <span className="net-phase">
              {!r.total && <span className="net-swatch" style={phaseStyle(r)} aria-hidden="true" />}{r.label}
            </span>
          ) },
          { key: 'bar', title: 'When', render: r => (
            <span className="net-track" aria-hidden="true">
              {r.ms > 0 && <span className="net-track__bar"
                style={{ left: pct(r.at), width: `max(2px, ${pct(r.ms)})`, ...(r.total ? { background: 'var(--fg-subtle)' } : phaseStyle(r)) }} />}
            </span>
          ) },
          { key: 'ms', title: 'Duration', align: 'end', render: r => fmtMsExact(r.ms) },
        ]}
        data={[...rows, { key: 'total', label: 'Total', ms: q.duration, at: 0, total: true }]} />
      {note && <p className="net-dp__none">{note}</p>}
    </div>
  )
}

/** The tabs a request has: Preview only for an image the server sent (v6 item 11). */
export function tabsFor(q) {
  const image = !!q.preview || (q.mime.startsWith('image/') && q.body.kind === 'uncaptured' && (q.status === 200 || q.status === 304))
  return [{ id: 'headers', label: 'Headers' }, { id: 'payload', label: 'Payload' },
    ...(image ? [{ id: 'preview', label: 'Preview' }] : []), { id: 'response', label: 'Response' }, { id: 'timing', label: 'Timing' }]
}

export function RequestDetails({ q, testId, index, count, tab, setTab, onPrev, onNext, onClose, onCopy, codeTheme, setCodeTheme }) {
  const first = index === 0, last = index === count - 1
  const tabs = tabsFor(q)
  const current = tabs.some(t => t.id === tab) ? tab : 'headers'
  return (
    <aside className="net-detail" id="net-detail" aria-label={`Details of ${q.name}`}>
      <div className="net-detail__head">
        <div className="net-detail__row">
          <TruncText className="net-detail__name" text={q.name} />
          <span className="net-detail__pos">{`${index + 1} of ${count}`}</span>
          <span className="spacer" />
          {/* Item 14, kept contextual: the link shows; the other copies wait
              in the menu, and each tab copies what it shows. */}
          <CopyIconButton icon={Link} ariaLabel="Copy link" copiedLabel={`Link to ${where(q)} copied`}
            copy={() => copyText(requestHref(testId, q.id))} />
          <LTActionMenu ariaLabel={`Actions for ${where(q)}`} width={248}
            customAnchor={<LTIconButton icon={Ellipsis} ariaLabel="More actions" variant="invisible" size="small" />}
            onSelect={o => onCopy(o.value, q)}
            options={copyOptions(q).filter(o => o.value !== 'link').slice(1)} />
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
      <LTTabNav size="small" ariaLabel="Request details" idPrefix="net" activeTab={current} onSelect={setTab} items={tabs} />
      <div className="net-detail__body" role="tabpanel" id="net-panel" aria-labelledby={`net-tab-${current}`} tabIndex={0}>
        {current === 'headers' && <HeadersPanel q={q} />}
        {current === 'payload' && <PayloadPanel q={q} codeTheme={codeTheme} setCodeTheme={setCodeTheme} />}
        {current === 'preview' && <PreviewPanel q={q} />}
        {current === 'response' && <ResponsePanel q={q} codeTheme={codeTheme} setCodeTheme={setCodeTheme} />}
        {current === 'timing' && <TimingPanel q={q} />}
      </div>
    </aside>
  )
}
