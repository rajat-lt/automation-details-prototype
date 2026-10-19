// All Commands tab: brief items 6 to 12 and 15 to 18, v2 items 2, 3, 4, 7, 9,
// 10 and 16, v3 items 3, 4, 6 and 9, and v4 items 1, 2, 6, 7, 8, 10 and 11.
// Spec: automation-details.md §3, §4, §4b, §4c and §4d.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Bug, ChevronDown, ChevronRight, ChevronUp, ChevronsDownUp, ChevronsUpDown, Copy, Ellipsis, Image, Link, Moon, Sun,
  Table, Braces, Undo2, ZoomIn, MessageSquarePlus, Pencil, Rows2, Rows4, SquareArrowOutUpRight, LocateFixed,
} from 'lucide-react'
import {
  LTButton, LTIconButton, LTTooltip, LTTag, LTInputBox, LTCounterLabel, LTTestStatusLabel, StatusGlyph,
  LTCodeBlock, LTCopyToClipboard, CopyIconButton, LTBlankSlate, LTFlash, LTSkeletonBox, LTTable, LTButtonGroup,
  LTTextarea, LTAvatar, TruncText, announce, cx,
} from './lt.jsx'
import { LTActionMenu, LTSegmentedControl } from './overlays.jsx'
import { RangeTimeline } from './timeline.jsx'
import { onJump, jumpTo, seekSilently, usePlayback } from './playback.js'
import { commandAt, commandHref, failureSegments, payloadText, statusLabel, CURRENT_USER } from './data.js'
import { fmtDateTime, fmtMs, fmtRelative, fmtTime, fmtTimeRange, initials } from './format.js'
import { commentKey, deleteComment, onCommentRequest, saveComment, useComment } from './comments.js'
import { copyRich, copyText, tableClipboard } from './clipboard.js'

const RUN_MIN = 3 // a passed run collapses from 3 commands up [proposed]
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const where = c => `${c.name} at ${fmtTime(c.at)}`
/* The group headers stuck above an element: one for each group it sits in,
   so two inside a nested test case (v4 item 10). A header does not count
   itself. */
const stickyHeads = el => {
  let h = 0
  for (let g = el.closest('.cmd-group'); g; g = g.parentElement?.closest('.cmd-group')) {
    const head = g.querySelector(':scope > .cmd-group__head')
    if (head && !head.contains(el)) h += head.offsetHeight
  }
  return h
}

/* ---------- search highlight ---------- */
function Hl({ text, q }) {
  if (!q || !text) return text
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return text
  return <>{text.slice(0, i)}<mark className="hl">{text.slice(i, i + q.length)}</mark><Hl text={text.slice(i + q.length)} q={q} /></>
}

/* ---------- payload rendering ---------- */
function Json({ value }) {
  const src = JSON.stringify(value, null, 2)
  const parts = []
  const re = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g
  let last = 0, m
  while ((m = re.exec(src))) {
    if (m.index > last) parts.push(src.slice(last, m.index))
    const tok = m[0]
    const cls = /^"/.test(tok) ? (/:$/.test(tok) ? 'tok-key' : 'tok-str') : /true|false|null/.test(tok) ? 'tok-lit' : 'tok-num'
    parts.push(<span key={m.index} className={cls}>{tok}</span>)
    last = m.index + tok.length
  }
  parts.push(src.slice(last))
  return <pre className="code-pre">{parts}</pre>
}

function payloadOf(cmd, tab) {
  if (tab === 'request') return cmd.request
  let body
  try { body = JSON.parse(cmd.response.responseBody) } catch { body = cmd.response.responseBody }
  return { responseStatus: cmd.response.responseStatus, responseBody: body }
}

const TABLE_COLUMNS = [{ key: 'k', title: 'Field', mono: true }, { key: 'v', title: 'Value', mono: true, copy: true, copyName: 'k' }]
const tableRows = data => Object.entries(data).map(([k, v]) => ({ k, v: typeof v === 'string' ? v : JSON.stringify(v) }))

/* ---------- comments (v3 item 6) ----------
   Failed commands only, one comment each. Read without a click: it sits in
   the open details, below the payload (v4 item 1). Written in LTTextarea,
   500 characters at most, with Cancel and Save, and Delete Comment once
   saved (v4 item 2). */
const COMMENT_MAX = 500

function CommentView({ comment, onEdit }) {
  return (
    <div className="cmt">
      <div className="cmt__head">
        <span aria-hidden="true"><LTAvatar initials={initials(comment.by)} name={comment.by} size={20} /></span>
        <span className="cmt__by">{comment.by}</span>
        <span className="meta-dot" aria-hidden="true">·</span>
        <LTTooltip type="description" text={fmtDateTime(comment.at)} direction="top">
          <time className="meta-hint" tabIndex={0} dateTime={comment.at.toISOString()}>{fmtRelative(comment.at)}</time>
        </LTTooltip>
        <span className="spacer" />
        <LTIconButton icon={Pencil} ariaLabel="Edit comment" variant="invisible" size="small" onClick={onEdit} />
      </div>
      <p className="cmt__text">{comment.text}</p>
    </div>
  )
}

function CommentEditor({ initial, onSave, onCancel, onDelete, focusKey, scrollOnFocus }) {
  const [text, setText] = useState(initial)
  const [error, setError] = useState('')
  const ref = useRef(null)
  // Opened from a popover, the list has already scrolled the box into view;
  // opened from its own button, the box is brought into view if it opened
  // below the fold.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.focus({ preventScroll: true })
    el.setSelectionRange(el.value.length, el.value.length)
    if (scrollOnFocus) el.closest('.cmt')?.scrollIntoView({ block: 'nearest' })
  }, [focusKey])
  const over = text.length > COMMENT_MAX
  const save = () => {
    const v = text.trim()
    const problem = !v ? 'Enter a comment.' : v.length > COMMENT_MAX ? `Comment must be ${COMMENT_MAX} characters or fewer.` : ''
    if (problem) { setError(problem); ref.current?.focus(); return }
    onSave(v)
  }
  const message = error || (over ? `Comment must be ${COMMENT_MAX} characters or fewer.` : '')
  return (
    // Cmd or Ctrl + Enter saves, as comment boxes commonly do.
    <div className="cmt cmt--edit" onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save() } }}>
      <LTTextarea label="Comment" required rows={3} resize="vertical" value={text} forwardRef={ref}
        placeholder="Add context for your team"
        onChange={v => { setText(v); if (error) setError('') }}
        caption={`${text.length} of ${COMMENT_MAX} characters.`}
        validationStatus={message ? 'error' : 'default'} validationMessage={message} />
      <div className="cmt__actions">
        {/* v4 item 2: delete sits apart on the left, away from Save; no
            confirmation for now, as the brief asks. Only a saved comment can
            be deleted. */}
        {onDelete && <LTButton variant="danger" size="small" label="Delete Comment" onClick={onDelete} />}
        <span className="spacer" />
        <LTButton variant="outline" size="small" label="Cancel" onClick={onCancel} />
        <LTButton variant="primary" size="small" label="Save" onClick={save} />
      </div>
    </div>
  )
}

function CommandDetail({ cmd, tab, setTab, view, setView, codeTheme, setCodeTheme, onStub, onScreenshot, link,
  testId, editing, setEditing, commentFocus, commentScroll, onToast, popOut, inTab = false, onShowInList }) {
  const data = payloadOf(cmd, tab)
  const code = cmd.response.responseStatus
  const text = JSON.stringify(data, null, 2)
  const part = tab === 'request' ? 'Request' : 'Response'
  const failed = cmd.status === 'failed'
  const key = commentKey(testId, cmd.id)
  const comment = useComment(key)
  /* v4 item 8.10: the buttons never move or clip. The status gives way
     first: it shrinks to 48px ("500…", whole on hover); with less room than
     that it hides, since the payload right below carries the same status;
     only when the buttons still do not fit do they wrap, as one group, to a
     line of their own. The other parts never change width, so this is
     measured, not guessed, and cannot flip back and forth. */
  const barRef = useRef(null)
  const [fit, setFit] = useState('fit') // 'fit' | 'tight' | 'wrap'
  const checkFit = () => {
    const bar = barRef.current
    const seg = bar?.querySelector('.lt-seg'), actions = bar?.querySelector('.cmd-detail__actions')
    if (!seg || !actions) return
    const gap = parseFloat(getComputedStyle(bar).columnGap) || 0
    const rest = bar.clientWidth - seg.offsetWidth - actions.offsetWidth
    setFit(rest - 2 * gap >= 48 ? 'fit' : rest - gap >= 0 ? 'tight' : 'wrap')
  }
  // On every render (a button comes or goes) and on every resize of the bar.
  const checkRef = useRef(checkFit)
  checkRef.current = checkFit
  useLayoutEffect(checkFit)
  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => checkRef.current())
    ro.observe(barRef.current)
    return () => ro.disconnect()
  }, [])
  return (
    <div className={cx('cmd-detail', failed && 'is-failed')} id={`${cmd.id}-detail`}>
      <div ref={barRef} className={cx('cmd-detail__bar', fit === 'tight' && 'is-tight', fit === 'wrap' && 'is-wrapped')}>
        {/* Request and Response: LTSegmentedControl, as hyperexecute-job-details.md
            §3.3 switches panels with one (C12). */}
        <LTSegmentedControl variant="small" ariaLabel="Payload" selectedValue={tab} onChange={setTab}
          options={[{ value: 'request', label: 'Request' }, { value: 'response', label: 'Response' }]} />
        {/* v4 item 8.10: gives way first (the measure above). */}
        <LTTag text={statusLabel(code)} variant={code >= 400 ? 'danger' : 'success'} className="cmd-detail__status" />
        <div className="cmd-detail__actions">
          <LTIconButton icon={Bug} ariaLabel="Raise a bug" variant="invisible" size="small"
            onClick={() => onStub(`The bug form opens here, with ${where(cmd)} attached.`)} />
          {/* v3 item 6.4: adds the comment while there is none; after that the
              comment shows below with its own Edit button. */}
          {failed && !comment && !editing && (
            <LTIconButton icon={MessageSquarePlus} ariaLabel="Add comment" variant="invisible" size="small"
              onClick={() => setEditing(true, { scroll: true })} />
          )}
          <LTIconButton icon={Image} ariaLabel="View screenshot" variant="invisible" size="small"
            onClick={() => onScreenshot(cmd)} />
          {/* v2 item 4: one setting for every command, remembered, like the
              code theme. The icon shows the view it switches to. */}
          <LTIconButton icon={view === 'table' ? Braces : Table} ariaLabel={view === 'table' ? 'Show as JSON' : 'Show as table'}
            variant="invisible" size="small" onClick={() => setView(view === 'table' ? 'json' : 'table')} />
          {/* v4 items 8.8 and 8.9: six buttons do not fit, so Copy link and
              Pop out payload move into a menu, last in the row. The menu is on
              every command, so Copy link is always in the same place. */}
          <LTActionMenu ariaLabel={`More actions for ${where(cmd)}`} width={240}
            customAnchor={<LTIconButton icon={Ellipsis} ariaLabel="More actions" variant="invisible" size="small" />}
            onSelect={async o => {
              if (o.value === 'link') {
                const ok = await copyText(link)
                onToast(ok ? `Link to ${where(cmd)} copied.` : `Link to ${where(cmd)} failed to copy. Try again.`, ok ? 'success' : 'danger')
              }
              if (o.value === 'popout') popOut.open(cmd)
              if (o.value === 'show') onShowInList(cmd)
            }}
            options={[
              { value: 'link', label: 'Copy link', icon: Link },
              ...(inTab ? [{ value: 'show', label: 'Show in All Commands', icon: LocateFixed }] : []),
              // v4 items 8.1 and 8.6: failed commands only; gone while the payload
              // is open in a tab, whose close button brings it back.
              ...(!inTab && failed && popOut && !popOut.isOpen(cmd.id) ? [{
                value: 'popout', label: 'Pop out payload', icon: SquareArrowOutUpRight,
                // Five tabs at most (v4 item 8.4); the reason is in the item,
                // worded positively (guidelines/ltactionmenu.md).
                inactive: popOut.full, description: popOut.full ? 'Available after you close a payload tab' : undefined,
              }] : []),
            ]} />
        </div>
      </div>
      {view === 'table' ? (
        <div className="cmd-table">
          <LTTable caption={part} allowValueCopy columns={TABLE_COLUMNS} data={tableRows(data)} />
          {/* v2 item 10: rows and columns survive the paste. HTML for rich
              editors, tab-separated text for spreadsheets (clipboard.js). */}
          <span className="cmd-table__copy">
            <CopyIconButton icon={Copy} ariaLabel={`Copy ${part.toLowerCase()} table`} copiedLabel={`${part} table copied`}
              copy={() => copyRich(tableClipboard(TABLE_COLUMNS, tableRows(data)))} />
          </span>
        </div>
      ) : (
        // Code surfaces default to dark and carry their own toggle (README §1, C4).
        // No inner scroll: the payload grows to its height (item 17).
        <LTCodeBlock theme={codeTheme} className="cmd-code"
          headerActions={<>
            <LTIconButton icon={codeTheme === 'dark' ? Sun : Moon} variant="invisible" size="small"
              ariaLabel={codeTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className={codeTheme === 'dark' ? 'on-dark' : undefined}
              onClick={() => setCodeTheme(codeTheme === 'dark' ? 'light' : 'dark')} />
            <LTCopyToClipboard textToCopy={text} size="small" dark={codeTheme === 'dark'}
              copyAriaLabel={tab === 'request' ? 'Copy request' : 'Copy response'}
              copiedAriaLabel={tab === 'request' ? 'Request copied' : 'Response copied'} />
          </>}>
          <Json value={data} />
        </LTCodeBlock>
      )}
      {/* v4 item 1: the comment comes after the payload it is about. */}
      {failed && editing && (
        <CommentEditor initial={comment?.text ?? ''} focusKey={commentFocus} scrollOnFocus={commentScroll}
          onCancel={() => setEditing(false)}
          onDelete={comment ? () => { deleteComment(key); setEditing(false); announce('Comment deleted') } : undefined}
          onSave={v => { saveComment(key, v, CURRENT_USER); setEditing(false); announce('Comment saved') }} />
      )}
      {failed && !editing && comment && <CommentView comment={comment} onEdit={() => setEditing(true, { scroll: true })} />}
    </div>
  )
}

/* v4 item 8: a failed command's payload in its own tab beside the video. The
   same details as under the command, with their own Request or Response and
   comment box; the payload view, the code theme and the comment itself are
   shared, so both places stay in step. */
export function PayloadPanel({ cmd, testId, payloadView, setPayloadView, codeTheme, setCodeTheme, onStub, onScreenshot,
  onToast, onShowInList }) {
  const [tab, setTab] = useState('response')
  const [editing, setEditingState] = useState(false)
  const [focusN, setFocusN] = useState(0)
  const scroll = useRef(false)
  return (
    <div className="pp">
      <div className="pp__head">
        <StatusGlyph status="failed" bare />
        <span className="pp__name">{cmd.name}</span>
        {cmd.value && <TruncText className="pp__value" text={cmd.value} />}
      </div>
      <p className="pp__meta">{`At ${fmtTime(cmd.at)} · ${fmtMs(cmd.ms)}`}</p>
      <CommandDetail cmd={cmd} tab={tab} setTab={setTab} view={payloadView}
        setView={v => { setPayloadView(v); announce(v === 'table' ? 'Payloads show as tables' : 'Payloads show as JSON') }}
        codeTheme={codeTheme} setCodeTheme={setCodeTheme} onStub={onStub} onScreenshot={onScreenshot}
        link={commandHref(testId, cmd.id)} testId={testId} onToast={onToast} inTab onShowInList={onShowInList}
        editing={editing} commentFocus={focusN} commentScroll={scroll.current}
        setEditing={(on, { scroll: sc = false } = {}) => { scroll.current = sc; setEditingState(on); if (on) setFocusN(n => n + 1) }} />
    </div>
  )
}

/* ---------- rows ----------
   v2 item 7: the list is one tab stop. The active row's main button (and its
   timestamp) are tabbable; Up and Down move between rows, Home and End to the
   ends, Enter opens a command's details. v2 item 16: every text that can be
   cut off (name, strategy, value, group title) shows its full text on hover,
   and only while it is cut off. */
function CommandRow({ cmd, depth, q, open, onToggle, flashN, detailProps, active, onContext }) {
  const failed = cmd.status === 'failed'
  return (
    <>
      <div className={cx('cmd-row', `depth-${depth}`, failed && 'is-failed', open && 'is-open')} data-cmd={cmd.id}
        onClick={e => { if (!e.target.closest('button, a, input')) onToggle() }}
        onContextMenu={e => onContext(e, cmd)}>
        {flashN > 0 && <span key={flashN} className="cmd-flash" aria-hidden="true" />}
        <button type="button" className="cmd-main" data-row={cmd.id} tabIndex={active ? 0 : -1}
          aria-expanded={open} aria-controls={open ? `${cmd.id}-detail` : undefined}
          aria-describedby={`${cmd.id}-desc`} onClick={onToggle}>
          <span className="cmd-status">
            {/* The Failed glyph, not the screenshot's triangle (C5); bare glyphs
                in this dense list (mock-data.md: one bg? value per surface). */}
            <LTTestStatusLabel status={cmd.status} showStatusText={false} bare />
          </span>
          <TruncText className="cmd-name" text={cmd.name}><Hl text={cmd.name} q={q} /></TruncText>
          {cmd.strategy && <LTTag text={cmd.strategy} variant="secondary" className="cmd-strategy" />}
          {cmd.value && <TruncText className="cmd-value" text={cmd.value}><Hl text={cmd.value} q={q} /></TruncText>}
        </button>
        <span id={`${cmd.id}-desc`} className="vh">
          {`${fmtMs(cmd.ms)}, at ${fmtTime(cmd.at)}${failed ? `, ${statusLabel(cmd.response.responseStatus)}` : ''}`}
        </span>
        <span className="cmd-meta">
          {/* Screenshot 7's pill: a mouse twin of the main button. */}
          <LTTooltip text={open ? 'Hide details' : 'Show details'} direction="top">
            <button type="button" className={cx('cmd-more', open && 'is-open')} tabIndex={-1} aria-hidden="true"
              onClick={onToggle}>
              <Ellipsis size={16} aria-hidden="true" />
            </button>
          </LTTooltip>
          <span className="cmd-dur" aria-hidden="true">{fmtMs(cmd.ms)}</span>
          <span className="meta-dot" aria-hidden="true">·</span>
          <LTTooltip text={`Jump video to ${fmtTime(cmd.at)}`} direction="top">
            <button type="button" className="cmd-at" tabIndex={active ? 0 : -1} aria-label={`Jump video to ${fmtTime(cmd.at)}`}
              onClick={() => jumpTo(cmd.at, { commandId: cmd.id, source: 'row' })}>
              {fmtTime(cmd.at)}
            </button>
          </LTTooltip>
        </span>
      </div>
      {open && <CommandDetail cmd={cmd} {...detailProps(cmd)} />}
    </>
  )
}

function Disclosure({ run, depth, onReveal, active }) {
  const n = run.cmds.length
  return (
    <div className={cx('cmd-row', 'cmd-row--disclosure', `depth-${depth}`)}>
      {/* Brief item 6: the brief's words and link look, with button semantics
          (an in-page trigger is a button, guidelines/README.md §5; C2). */}
      <button type="button" className="cmd-disclosure" data-row={run.key} tabIndex={active ? 0 : -1}
        aria-expanded="false" onClick={() => onReveal(run)}>
        {`Show ${n} passed log${n === 1 ? '' : 's'}`}
      </button>
    </div>
  )
}

function SkeletonRows({ n, depth, label }) {
  return (
    <div className="cmd-skeleton" aria-busy="true" aria-label={label}>
      {Array.from({ length: Math.min(n, 6) }, (_, i) => (
        <div key={i} className={cx('cmd-row', 'cmd-row--skeleton', `depth-${depth}`)}>
          <LTSkeletonBox width={16} height={16} radius="var(--radius-pill)" delay={i * 60} />
          <LTSkeletonBox width={`${30 + ((i * 37) % 40)}%`} height={12} delay={i * 60} />
          <span className="spacer" />
          <LTSkeletonBox width={72} height={12} delay={i * 60} />
        </div>
      ))}
    </div>
  )
}

/* Previous and next failed command (item 8). Goes by the video's position
   [proposed]; subscribes to the playhead on its own so the list does not
   re-render on every frame. */
function FailureNav({ failures, reason }) {
  const time = usePlayback(s => s.time)
  const next = failures.find(c => c.at > time + 0.05)
  const prev = [...failures].reverse().find(c => c.at < time - 0.05)
  return (
    <LTButtonGroup ariaLabel="Failed commands">
      <LTIconButton icon={ChevronUp} variant="outline" size="small" inactive={!prev}
        ariaLabel="Previous failed command"
        tooltipText={prev ? 'Previous failed command' : reason ?? 'Showing the first failed command'}
        onClick={() => prev && jumpTo(prev.at, { commandId: prev.id, source: 'nav' })} />
      <LTIconButton icon={ChevronDown} variant="outline" size="small" inactive={!next}
        ariaLabel="Next failed command"
        tooltipText={next ? 'Next failed command' : reason ?? 'Showing the last failed command'}
        onClick={() => next && jumpTo(next.at, { commandId: next.id, source: 'nav' })} />
    </LTButtonGroup>
  )
}

/* ---------- the tab ---------- */
export function CommandsTab({ detail, searchRef, codeTheme, setCodeTheme, payloadView, setPayloadView, onStub, onToast,
  onScreenshot, demo, onRetry, isCurrent, focusCommand, density, setDensity, popOut }) {
  const { commands, tree, durationSec: duration } = detail
  const failedTest = detail.failedCount > 0
  // Every group, nested ones too (v4 item 10), outer before inner.
  const groups = detail.groups
  const groupById = useMemo(() => new Map(groups.map(g => [g.id, g])), [groups])
  const byId = useMemo(() => new Map(commands.map(c => [c.id, c])), [commands])

  const [expanded, setExpanded] = useState(() => new Set(groups
    .filter(g => !failedTest || g.children.some(c => c.status === 'failed')).map(g => g.id)))
  const [revealed, setRevealed] = useState(() => new Set())
  const [loadingRuns, setLoadingRuns] = useState(() => new Set())
  const [openDetails, setOpenDetails] = useState(() => new Set())
  const [tabs, setTabs] = useState({})
  const [query, setQuery] = useState('')
  const [testFilter, setTestFilter] = useState('all')
  const [view, setView] = useState([0, duration]) // what the timeline shows (v2 item 9)
  const [range, setRange] = useState([0, duration]) // the window the handles select
  const [flash, setFlash] = useState({ id: null, n: 0 })
  const [hidden, setHidden] = useState(false)
  const [toolbarH, setToolbarH] = useState(0)
  const [hideH, setHideH] = useState(0) // how much of the toolbar slides away (v4 item 11)
  const [pendingScroll, setPendingScroll] = useState(null)
  const [activeRow, setActiveRow] = useState(null)
  const [ctx, setCtx] = useState(null) // right-click menu: { cmd, x, y }
  const [statusFilter, setStatusFilter] = useState(null) // v3 item 9: 'passed' | 'failed' | null
  const [commentEdit, setCommentEdit] = useState(null) // the command whose comment box is open
  const [commentFocus, setCommentFocus] = useState(0) // bumps to focus that box

  const scrollRef = useRef(null)
  const toolbarRef = useRef(null)
  const lastTop = useRef(0)
  const suppressUntil = useRef(0)
  const programmatic = useRef(null) // scrollTop a scroll we started is heading to
  const toolbarActive = useRef(false)
  const focusAfterReveal = useRef(null)
  const lastSpace = useRef(null)
  const deepPending = useRef(null)

  const q = query.trim().toLowerCase()
  const fullRange = range[0] <= 0.01 && range[1] >= duration - 0.01
  const zoomed = view[0] > 0.01 || view[1] < duration - 0.01
  const tcGroups = groups.filter(g => g.kind === 'testCase')
  const filterGroup = testFilter === 'all' ? null : tcGroups.find(g => g.tc === testFilter)
  const filtering = !!q || !fullRange || !!filterGroup || !!statusFilter
  // A search or a status filter shows every match; collapsing passed runs
  // would hide the very commands asked for.
  const disclosureOn = failedTest && !q && !statusFilter

  // A command matches a search on its own words or on any group around it.
  const matches = useCallback(c => {
    if (!q) return true
    const around = c.path.map(id => groupById.get(id)).flatMap(g => [g.title, g.tc])
    return [c.name, c.strategy, c.value, ...around].filter(Boolean).join(' ').toLowerCase().includes(q)
  }, [q, groupById])
  const inRange = useCallback(c => c.at >= range[0] - 1e-6 && c.at <= range[1] + 1e-6, [range])
  // A test case filter keeps the commands of its nested test case too.
  const inTest = useCallback(c => !filterGroup || c.path.includes(filterGroup.id), [filterGroup])
  const visible = useCallback(c => matches(c) && inRange(c) && inTest(c) && (!statusFilter || c.status === statusFilter),
    [matches, inRange, inTest, statusFilter])

  /* Layout, built the way the list renders: commands and runs of passed
     commands in order, and groups holding the same, nested once at most
     (v4 item 10). A nested group breaks a run of passed commands. */
  const layout = useMemo(() => {
    const runOf = new Map()
    const runsFor = (cmds, parentKey) => {
      const out = []
      let i = 0
      while (i < cmds.length) {
        if (disclosureOn && cmds[i].status === 'passed') {
          let j = i
          while (j < cmds.length && cmds[j].status === 'passed') j++
          const run = { key: `${parentKey}:${cmds[i].id}`, cmds: cmds.slice(i, j) }
          if (run.cmds.length >= RUN_MIN) {
            run.cmds.forEach(c => runOf.set(c.id, run.key))
            out.push({ type: 'run', run })
          } else run.cmds.forEach(c => out.push({ type: 'cmd', cmd: c }))
          i = j
        } else { out.push({ type: 'cmd', cmd: cmds[i] }); i++ }
      }
      return out
    }
    const itemsFor = (nodes, key) => {
      const out = []
      let pending = []
      const flush = () => {
        if (pending.length) out.push(...runsFor(pending, `${key}-${pending[0].id}`))
        pending = []
      }
      for (const node of nodes) {
        if (node.type === 'command') { if (visible(node.cmd)) pending.push(node.cmd); continue }
        flush()
        const kids = node.children.filter(visible)
        if (filtering && kids.length === 0) continue
        out.push({ type: 'group', node, kids, items: itemsFor(node.items, node.id) })
      }
      flush()
      return out
    }
    return { items: itemsFor(tree, 'root'), runOf }
  }, [tree, visible, filtering, disclosureOn])

  // A search or a status filter opens every group with a match, so the
  // matches show without a click.
  const groupOpen = b => expanded.has(b.node.id) || ((!!q || !!statusFilter) && b.kids.length > 0)

  /* The focusable rows, in screen order: group headers, commands, and
     disclosures (v2 item 7), into nested groups too. Mirrors the render. */
  const rowOrder = useMemo(() => {
    const out = []
    const push = items => items.forEach(it => {
      if (it.type === 'cmd') out.push(it.cmd.id)
      else if (it.type === 'group') { out.push(it.node.id); if (groupOpen(it)) push(it.items) }
      else if (revealed.has(it.run.key)) it.run.cmds.forEach(c => out.push(c.id))
      else if (!loadingRuns.has(it.run.key)) out.push(it.run.key)
    })
    push(layout.items)
    return out
  }, [layout, revealed, loadingRuns, expanded, q, statusFilter])
  const currentRow = rowOrder.includes(activeRow) ? activeRow : rowOrder[0]

  const counts = useMemo(() => {
    const inR = commands.filter(c => inRange(c) && inTest(c))
    return { passed: inR.filter(c => c.status === 'passed').length, failed: inR.filter(c => c.status === 'failed').length }
  }, [commands, inRange, inTest])
  const failuresForNav = useMemo(() => (statusFilter === 'passed' ? []
    : detail.failed.filter(c => inRange(c) && inTest(c))),
  [detail.failed, inRange, inTest, statusFilter])
  // Zoomed in, failures merge over a proportionally shorter gap, so retries
  // that read as one block across the whole run separate (v2 item 9).
  const segments = useMemo(() => failureSegments(detail.failed, (2 * (view[1] - view[0])) / duration),
    [detail.failed, view, duration])

  /* Reveal a command (item 9): open its group and its passed run, then scroll
     it under the sticky toolbar and flash it. `focus` also moves keyboard
     focus to it (v2 items 2 and 3). */
  const reveal = useCallback((cmd, { flashIt = true, focus = false, comment = false } = {}) => {
    if (!cmd || !visible(cmd)) return
    // Opens every group around it, the outer test case and the nested one.
    if (cmd.path.length) setExpanded(s => (cmd.path.every(id => s.has(id)) ? s : new Set([...s, ...cmd.path])))
    const key = layout.runOf.get(cmd.id)
    if (key) setRevealed(s => (s.has(key) ? s : new Set(s).add(key)))
    setActiveRow(cmd.id)
    suppressUntil.current = Date.now() + 1200
    setHidden(false)
    setPendingScroll({ id: cmd.id, flashIt, focus, comment, n: Date.now() })
  }, [visible, layout])

  useLayoutEffect(() => {
    if (!pendingScroll) return
    const sc = scrollRef.current
    const row = sc?.querySelector(`[data-cmd="${pendingScroll.id}"]`)
    if (!row) return
    const sr = sc.getBoundingClientRect(), rr = row.getBoundingClientRect()
    const topSpace = (toolbarRef.current?.offsetHeight ?? 0) + stickyHeads(row) + 8
    const rowTop = rr.top - sr.top
    // Opening a comment box (v3 item 4.4): the box must be in view too, even
    // when the row and the box do not both fit under the toolbar.
    const editor = pendingScroll.comment ? sc.querySelector(`#${CSS.escape(pendingScroll.id)}-detail .cmt--edit`) : null
    const er = editor?.getBoundingClientRect()
    if (rowTop < topSpace || rr.bottom > sr.bottom - 8 || (er && er.bottom > sr.bottom - 8)) {
      let wanted = sc.scrollTop + rowTop - topSpace
      if (er) wanted = Math.max(wanted, sc.scrollTop + (er.bottom - sr.top) + 8 - sc.clientHeight)
      // Keep the toolbar shown until this scroll lands, however long a smooth
      // scroll takes; 2.5 seconds is the fallback if it stops short.
      const target = Math.min(wanted, sc.scrollHeight - sc.clientHeight)
      programmatic.current = target
      suppressUntil.current = Date.now() + 2500
      // Instant in a background tab, where a smooth scroll would wait to be seen.
      sc.scrollTo({ top: target, behavior: reduceMotion() || document.hidden ? 'auto' : 'smooth' })
    }
    if (pendingScroll.focus) row.querySelector('.cmd-main')?.focus({ preventScroll: true })
    if (pendingScroll.flashIt) setFlash(f => ({ id: pendingScroll.id, n: f.n + 1 }))
    setPendingScroll(null)
  }, [pendingScroll, expanded, revealed])

  // Item 9: every jump of the video reveals and highlights its command.
  useEffect(() => onJump(({ time, commandId }) => {
    reveal(commandId ? byId.get(commandId) : commandAt(commands, time))
  }), [reveal, byId, commands])

  const clearFilters = () => {
    setQuery(''); setTestFilter('all'); setStatusFilter(null); setView([0, duration]); setRange([0, duration])
  }

  /* v3 item 4.4: "Add comment" or "Edit comment" in a failure popover (or on
     the video's command line) brings that command into view with its details
     open and the comment box focused. Waits until the tab is on screen, since
     a hidden list can be neither scrolled nor focused. */
  const pendingComment = useRef(null)
  const commentScroll = useRef(false) // the box was opened by its own button
  const openComment = cmdId => {
    const cmd = byId.get(cmdId)
    if (!cmd) return
    commentScroll.current = false
    setOpenDetails(s => new Set(s).add(cmd.id))
    setCommentEdit(cmd.id)
    setCommentFocus(n => n + 1)
    if (visible(cmd)) { reveal(cmd, { comment: true }); return }
    deepPending.current = { id: cmd.id, focus: false, comment: true }
    clearFilters()
  }
  const openCommentRef = useRef(openComment)
  openCommentRef.current = openComment
  const isCurrentRef = useRef(isCurrent)
  isCurrentRef.current = isCurrent
  useEffect(() => onCommentRequest(({ testId, cmdId }) => {
    if (testId !== detail.test.id) return
    if (isCurrentRef.current) openCommentRef.current(cmdId)
    else pendingComment.current = cmdId
  }), [detail.test.id])
  useEffect(() => {
    if (!isCurrent || !pendingComment.current) return
    const id = pendingComment.current
    pendingComment.current = null
    openComment(id)
  }, [isCurrent])

  // Item 16: a failed test opens at its first failure, unless a link named a command.
  useEffect(() => {
    if (!failedTest || demo || focusCommand?.id) return
    const first = detail.failed[0]
    const t = setTimeout(() => reveal(first), 120)
    return () => clearTimeout(t)
  }, [])

  // v2 item 2: a command's link opens this test at that command, with its
  // details open and the video at its moment. Filters that would hide it
  // are cleared first.
  useEffect(() => {
    const cmd = focusCommand?.id && byId.get(focusCommand.id)
    if (!cmd) return
    seekSilently(cmd.at)
    setOpenDetails(s => new Set(s).add(cmd.id))
    if (visible(cmd)) { reveal(cmd, { focus: true }); return }
    deepPending.current = { id: cmd.id, focus: true }
    clearFilters()
  }, [focusCommand?.n])
  useEffect(() => {
    const p = deepPending.current
    const cmd = p && byId.get(p.id)
    if (cmd && visible(cmd)) { deepPending.current = null; reveal(cmd, { focus: p.focus, comment: p.comment }) }
  }, [visible])

  /* Item 17: the toolbar slides away on scroll down and back on scroll up.
     v4 item 11: only the heading and the timeline slide away; search and the
     Tests filter stay, as the brief's screenshot puts them last. The toolbar
     moves up by everything above the filters, less its own top padding. */
  useLayoutEffect(() => {
    const el = toolbarRef.current
    if (!el) return
    const measure = () => {
      setToolbarH(el.offsetHeight)
      const filters = el.querySelector('.cmd-filters')
      setHideH(filters ? Math.max(0, filters.offsetTop - parseFloat(getComputedStyle(el).paddingTop)) : el.offsetHeight)
    }
    measure() // now, not only when the observer next reports
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [demo, commands.length])
  const onScroll = e => {
    const st = e.currentTarget.scrollTop
    const dy = st - lastTop.current
    lastTop.current = st
    if (st <= toolbarH) { if (hidden) setHidden(false); return }
    if (programmatic.current != null) {
      if (Math.abs(st - programmatic.current) > 2 && Date.now() < suppressUntil.current) return
      programmatic.current = null // landed: user scrolling counts again
      return
    }
    if (Date.now() < suppressUntil.current || toolbarActive.current) return
    if (dy > 4 && !hidden) setHidden(true)
    else if (dy < -4 && hidden) setHidden(false)
  }

  const revealRun = run => {
    setLoadingRuns(s => new Set(s).add(run.key))
    announce(`Loading ${run.cmds.length} passed logs`)
    focusAfterReveal.current = run.cmds[0].id
    setTimeout(() => {
      setLoadingRuns(s => { const n = new Set(s); n.delete(run.key); return n })
      setRevealed(s => new Set(s).add(run.key))
      announce(`${run.cmds.length} passed logs shown`)
    }, 600)
  }
  useEffect(() => {
    const id = focusAfterReveal.current
    if (!id) return
    const btn = scrollRef.current?.querySelector(`[data-cmd="${id}"] .cmd-main`)
    if (btn) { setActiveRow(id); btn.focus({ preventScroll: true }); focusAfterReveal.current = null }
  }, [revealed])

  /* v2 item 7: Up and Down move focus between rows, without scrolling the
     toolbar away; the scroll is instant and counts as ours (item 17). */
  const focusRow = id => {
    const sc = scrollRef.current
    const el = sc?.querySelector(`[data-row="${CSS.escape(id)}"]`)
    if (!el) return
    setActiveRow(id)
    el.focus({ preventScroll: true })
    const rowEl = el.closest('.cmd-row, .cmd-group__head') ?? el
    const sr = sc.getBoundingClientRect(), rr = rowEl.getBoundingClientRect()
    const top = sr.top + (hidden ? toolbarH - hideH : toolbarH) + stickyHeads(rowEl)
    const delta = rr.top < top ? rr.top - top : rr.bottom > sr.bottom ? rr.bottom - sr.bottom + 8 : 0
    if (delta) {
      programmatic.current = Math.max(0, Math.min(sc.scrollTop + delta, sc.scrollHeight - sc.clientHeight))
      suppressUntil.current = Date.now() + 400
      sc.scrollTop = programmatic.current
    }
  }
  const onListKey = e => {
    if (e.target.closest('.cmd-detail')) return
    const id = e.target.closest('[data-row]')?.dataset.row
      ?? e.target.closest('.cmd-row')?.querySelector('[data-row]')?.dataset.row
    if (!id) return
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault()
      const i = rowOrder.indexOf(id)
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? rowOrder.length - 1
        : Math.min(rowOrder.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))
      if (rowOrder[j]) focusRow(rowOrder[j])
    } else if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') {
      const cmd = byId.get(id)
      if (!cmd) return
      e.preventDefault()
      const r = e.target.closest('.cmd-row').getBoundingClientRect()
      setCtx({ cmd, x: r.left + 40, y: r.bottom - 8 })
    }
  }

  /* v2 item 3: Space brings the next failed command into view, cycling past
     the last; Shift + Space goes back [proposed]. Only the list moves; the
     video stays put, as the brief asks. Inside the list Space means this on
     every row, buttons included; Enter opens and closes. */
  const jumpFailure = useCallback(dir => {
    const fails = commands.filter(c => c.status === 'failed' && visible(c))
    if (!fails.length) { announce(detail.failedCount ? '0 failed commands in this view' : 'All commands passed'); return }
    const focusedId = document.activeElement?.closest?.('.cmd-row')?.dataset.cmd
    const base = byId.get(focusedId) ?? byId.get(lastSpace.current)
    const baseIdx = base ? base.idx : dir > 0 ? -1 : Infinity
    const next = (dir > 0 ? fails.find(c => c.idx > baseIdx) : [...fails].reverse().find(c => c.idx < baseIdx))
      ?? (dir > 0 ? fails[0] : fails[fails.length - 1])
    lastSpace.current = next.id
    reveal(next, { focus: true })
    announce(`Failed command ${fails.indexOf(next) + 1} of ${fails.length}: ${where(next)}`)
  }, [commands, visible, byId, reveal, detail.failedCount])
  useEffect(() => {
    if (!isCurrent) return
    const inList = t => !!t.closest?.('.cmd-list') && !t.closest('.cmd-detail')
    const onKey = e => {
      if (e.key !== ' ' || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return
      if (document.querySelector('.lt-backdrop, .lt-menu')) return
      const t = e.target
      if (!inList(t) && t !== document.body && t.closest?.('button, a, input, textarea, select, [contenteditable="true"], [role], [tabindex]')) return
      e.preventDefault()
      if (!e.repeat) jumpFailure(e.shiftKey ? -1 : 1)
    }
    // A button activates on Space's keyup, so that is stopped too in the list.
    const onKeyUp = e => { if (e.key === ' ' && inList(e.target)) e.preventDefault() }
    document.addEventListener('keydown', onKey)
    document.addEventListener('keyup', onKeyUp)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('keyup', onKeyUp) }
  }, [isCurrent, jumpFailure])

  /* v2 item 2: the right-click menu on a command, never on its parent. */
  const onContext = (e, cmd) => {
    if (e.target.closest('.cmd-detail')) return
    e.preventDefault()
    setActiveRow(cmd.id)
    setCtx({ cmd, x: e.clientX, y: e.clientY })
  }
  const closeCtx = () => {
    const id = ctx?.cmd.id
    setCtx(null)
    if (id) scrollRef.current?.querySelector(`[data-cmd="${id}"] .cmd-main`)?.focus({ preventScroll: true })
  }
  // The menu has closed by now, so a toast says what happened (the clipboard
  // is out of sight); a failure says so and what to do (ux-text-guidelines.md §3).
  const runCtx = async (value, cmd) => {
    if (value === 'payload' || value === 'link') {
      const ok = await copyText(value === 'payload' ? payloadText(cmd) : commandHref(detail.test.id, cmd.id))
      const what = value === 'payload' ? `Payload of ${where(cmd)}` : `Link to ${where(cmd)}`
      onToast(ok ? `${what} copied.` : `${what} failed to copy. Try again.`, ok ? 'success' : 'danger')
    }
    if (value === 'bug') onStub(`The bug form opens here, with ${where(cmd)} attached.`)
  }

  const toggleGroup = id => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleDetails = id => setOpenDetails(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  /* Rajat, 17 Oct 2026: the double chevron expands and collapses every group
     and every command inside, so Expand all also loads the hidden passed runs. */
  const visibleCmds = useMemo(() => commands.filter(visible), [commands, visible])
  const allOpen = groups.every(g => expanded.has(g.id)) && visibleCmds.every(c => openDetails.has(c.id))
  const expandAll = () => {
    setExpanded(new Set(groups.map(g => g.id)))
    setOpenDetails(new Set(visibleCmds.map(c => c.id)))
    const hiddenRuns = [...new Set(layout.runOf.values())].filter(k => !revealed.has(k))
    if (hiddenRuns.length) {
      setLoadingRuns(new Set(hiddenRuns))
      setTimeout(() => { setLoadingRuns(new Set()); setRevealed(s => new Set([...s, ...hiddenRuns])) }, 600)
    }
    announce('All groups and commands expanded')
  }
  const collapseAll = () => {
    setExpanded(new Set()); setOpenDetails(new Set())
    announce('All groups and commands collapsed')
  }

  /* v2 item 9: a double-click on a failure zooms the timeline to it, with a
     margin on both sides: a quarter of its length, at least 3 seconds, and a
     window of at least 10 seconds [proposed]. The handles select the same
     window, so the list shows it; Reset timeline undoes both. */
  const zoomTo = seg => {
    const pad = Math.max(3, (seg.end - seg.start) * 0.25)
    let a = seg.start - pad, b = seg.end + pad
    if (b - a < 10) { const c = (a + b) / 2; a = c - 5; b = c + 5 }
    a = Math.max(0, a); b = Math.min(duration, b)
    setView([a, b]); setRange([a, b])
    announce(`Timeline zoomed to ${fmtTimeRange(a, b)}`)
  }
  const resetTimeline = () => {
    setView([0, duration]); setRange([0, duration])
    announce('Timeline reset to the whole run')
  }

  const detailProps = cmd => ({
    tab: tabs[cmd.id] ?? (cmd.status === 'failed' ? 'response' : 'request'),
    setTab: v => setTabs(t => ({ ...t, [cmd.id]: v })),
    view: payloadView,
    setView: v => { setPayloadView(v); announce(v === 'table' ? 'Payloads show as tables' : 'Payloads show as JSON') },
    codeTheme, setCodeTheme, onStub, onScreenshot, onToast, popOut,
    link: commandHref(detail.test.id, cmd.id),
    testId: detail.test.id,
    editing: commentEdit === cmd.id,
    setEditing: (on, { scroll = false } = {}) => {
      commentScroll.current = scroll
      setCommentEdit(on ? cmd.id : null)
      if (on) setCommentFocus(n => n + 1)
      else scrollRef.current?.querySelector(`[data-cmd="${cmd.id}"] .cmd-main`)?.focus({ preventScroll: true })
    },
    commentFocus,
    commentScroll: commentScroll.current,
  })

  const renderItems = (items, depth) => items.map(it => {
    if (it.type === 'group') return renderGroup(it, depth)
    if (it.type === 'cmd') {
      return <CommandRow key={it.cmd.id} cmd={it.cmd} depth={depth} q={q} open={openDetails.has(it.cmd.id)}
        onToggle={() => toggleDetails(it.cmd.id)} flashN={flash.id === it.cmd.id ? flash.n : 0} detailProps={detailProps}
        active={currentRow === it.cmd.id} onContext={onContext} />
    }
    const { run } = it
    if (revealed.has(run.key)) {
      return run.cmds.map(c => (
        <CommandRow key={c.id} cmd={c} depth={depth} q={q} open={openDetails.has(c.id)}
          onToggle={() => toggleDetails(c.id)} flashN={flash.id === c.id ? flash.n : 0} detailProps={detailProps}
          active={currentRow === c.id} onContext={onContext} />
      ))
    }
    if (loadingRuns.has(run.key)) return <SkeletonRows key={run.key} n={run.cmds.length} depth={depth} label={`Loading ${run.cmds.length} passed logs`} />
    return <Disclosure key={run.key} run={run} depth={depth} onReveal={revealRun} active={currentRow === run.key} />
  })

  /* Item 15: a parent is an annotation or a test case; v4 item 10: a test
     case can hold one more level of test case, in the same anatomy, 32px
     further in. Item 18 and v4 item 6: each open group draws its own indent
     rule, from 4px under its chevron to the bottom border of its last row,
     so where each level starts and ends reads at a glance. The counts take in
     the nested test case's commands too. */
  const renderGroup = (b, depth) => {
    const g = b.node
    const open = groupOpen(b)
    const passed = g.children.filter(c => c.status === 'passed').length
    const failed = g.children.length - passed
    const isTc = g.kind === 'testCase'
    const parent = g.parentId ? groupById.get(g.parentId) : null
    return (
      <section key={g.id} className={cx('cmd-group', `depth-${depth}`, open && 'is-open')}
        aria-label={`${isTc ? 'Test case' : 'Annotation'}: ${g.tc ? `${g.tc} ` : ''}${g.title}`}>
        <div className="cmd-group__head">
          <button type="button" className="cmd-group__toggle" aria-expanded={open} data-row={g.id}
            tabIndex={currentRow === g.id ? 0 : -1} aria-controls={`${g.id}-body`} onClick={() => toggleGroup(g.id)}>
            {open ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
            {isTc && <span className="cmd-group__tc">{g.tc}</span>}
            <TruncText className="cmd-group__title" text={g.title}><Hl text={g.title} q={q} /></TruncText>
            <span className="vh">
              {`${isTc ? ', test case' : ', annotation'}${parent ? `, inside ${parent.tc ?? parent.title}` : ''}`}
            </span>
          </button>
          <span className="cmd-group__stats">
            <span>{g.children.length} total</span>
            <span className="meta-dot" aria-hidden="true">·</span>
            <span className="stat"><StatusGlyph status="passed" bare />{passed}<span className="vh"> passed</span></span>
            {failed > 0 && <>
              <span className="meta-dot" aria-hidden="true">·</span>
              <span className="stat"><StatusGlyph status="failed" bare />{failed}<span className="vh"> failed</span></span>
            </>}
          </span>
        </div>
        {open && <div className="cmd-group__body" id={`${g.id}-body`}>{renderItems(b.items, depth + 1)}</div>}
      </section>
    )
  }

  /* ---------- states ---------- */
  if (demo === 'loading') {
    return (
      <div className="cmd-scroll" aria-busy="true">
        <div className="cmd-toolbar">
          <LTSkeletonBox width={120} height={16} />
          <LTSkeletonBox width="100%" height={12} radius="var(--radius-pill)" className="sk-gap" />
          <LTSkeletonBox width="100%" height={32} radius="var(--radius-2)" className="sk-gap" />
        </div>
        <SkeletonRows n={8} depth={0} label="Loading commands" />
      </div>
    )
  }
  if (demo === 'error') {
    return (
      <div className="cmd-scroll cmd-scroll--state">
        <LTFlash variant="danger" text="Command list failed to load."
          action={<LTButton variant="outline" size="small" label="Try Again" onClick={onRetry} />} />
      </div>
    )
  }
  if (!commands.length) {
    return (
      <div className="cmd-scroll cmd-scroll--state">
        <LTBlankSlate heading="Queued to run" description="Commands, logs, and the video appear here once the test starts." />
      </div>
    )
  }

  const filterLabel = filterGroup ? filterGroup.tc : 'All'
  return (
    <div ref={scrollRef} className={cx('cmd-scroll', density === 'condensed' && 'is-condensed')} onScroll={onScroll}
      style={{ '--sticky-top': `${hidden ? toolbarH - hideH : toolbarH}px`, '--toolbar-hide': `${hideH}px` }}>
      {/* Item 17: the toolbar is sticky, hides on scroll down and returns on
          scroll up. It stays while hovered or focused, and while a scroll it
          started is running [proposed]. v4 item 11: search and the filter
          never hide, so focus in them leaves the timeline where it is; focus
          on anything above them brings it back. */}
      <div ref={toolbarRef} className={cx('cmd-toolbar', hidden && 'is-hidden')}
        onMouseEnter={() => { toolbarActive.current = true }} onMouseLeave={() => { toolbarActive.current = false }}
        onFocus={e => { toolbarActive.current = true; if (!e.target.closest('.cmd-filters')) setHidden(false) }}
        onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) toolbarActive.current = false }}>
        <div className="cmd-tl-head">
          <h2 className="cmd-tl-title">Timeline</h2>
          {/* Icon plus count, as the base pattern's summary (§3.1); the words
              are announced (C10). Counts follow the selected window. Filled
              glyphs here, as screenshot 6 shows; bare in the group stats, as
              screenshot 7 shows (C19). v3 item 9: each count is a toggle that
              shows only its status; pressing it again shows every command
              (C29). */}
          {[['passed', counts.passed], ['failed', counts.failed]].map(([st, n]) => {
            const on = statusFilter === st
            return (
              <LTTooltip key={st} direction="bottom"
                text={on ? 'Show all commands' : n === 0 ? `0 ${st} commands` : `Show only ${st} commands`}>
                <LTButton variant="invisible" size="small" className={cx('cmd-tl-count', on && 'is-on')}
                  aria-pressed={on} ariaLabel={`${n} ${st}`} inactive={n === 0 && !on}
                  onClick={() => {
                    setStatusFilter(on ? null : st)
                    announce(on ? 'Showing all commands' : `Showing ${st} commands only`)
                  }}>
                  <StatusGlyph status={st} /><LTCounterLabel count={n} />
                </LTButton>
              </LTTooltip>
            )
          })}
          {/* The zoom is a mode the user chose, so it carries a label
              (ux-persona.md: show the mode, not the motion). */}
          {zoomed && (
            <span className="cmd-tl-zoom">
              <span className="vh">Timeline zoomed to </span>
              <LTTag variant="secondary" leadingVisual={ZoomIn} text={fmtTimeRange(view[0], view[1])} />
            </span>
          )}
          <span className="spacer" />
          <LTIconButton icon={Undo2} ariaLabel="Reset timeline" variant="invisible" size="small"
            inactive={!zoomed && fullRange} tooltipText={!zoomed && fullRange ? 'Showing the whole run' : 'Reset timeline'}
            onClick={resetTimeline} />
          {/* v3 item 3: row density, a toggle like the payload view's; the icon
              shows the view it switches to, and the choice is remembered. */}
          <LTIconButton icon={density === 'condensed' ? Rows2 : Rows4} variant="invisible" size="small"
            ariaLabel={density === 'condensed' ? 'Switch to comfortable view' : 'Switch to condensed view'}
            onClick={() => {
              const next = density === 'condensed' ? 'comfortable' : 'condensed'
              setDensity(next)
              announce(next === 'condensed' ? 'Condensed view' : 'Comfortable view')
            }} />
          <LTIconButton icon={allOpen ? ChevronsDownUp : ChevronsUpDown} variant="invisible" size="small"
            ariaLabel={allOpen ? 'Collapse all' : 'Expand all'} onClick={allOpen ? collapseAll : expandAll} />
          <FailureNav failures={failuresForNav} reason={statusFilter === 'passed' ? 'Showing passed commands only' : undefined} />
        </div>
        <RangeTimeline view={view} segments={segments} byId={byId} range={range} testId={detail.test.id} onStub={onStub}
          onRange={([a, b]) => setRange([Math.max(view[0], a), Math.min(view[1], b)])}
          onSeek={(t, id) => jumpTo(t, { commandId: id, source: 'timeline' })} onZoom={zoomTo} />
        <div className="cmd-filters">
          {/* Item 10: "/" focuses this field (App.jsx). The shortcut sits in
              the placeholder until a keyboard hint exists (README §10). */}
          <LTInputBox value={query} onChange={setQuery} placeholder="Search commands (/)" ariaLabel="Search commands"
            forwardRef={searchRef} keyshortcuts="/" className="cmd-search"
            onKeyDown={e => { if (e.key === 'Escape' && query) { e.preventDefault(); e.stopPropagation(); setQuery('') } }} />
          {/* A filter dropdown is LTButton outline with a caret, never LTSelect
              (guidelines/README.md §5; C11). It filters by test case (Rajat,
              17 Oct 2026). */}
          <LTActionMenu ariaLabel="Tests" width={360} selectionVariant="single" activeId={testFilter}
            customAnchor={<LTButton variant="outline" size="medium" trailingIcon={ChevronDown} className="cmd-testfilter"
              ariaLabel={`Tests: ${filterGroup ? `${filterGroup.tc} ${filterGroup.title}` : 'All'}`}>
              <span className="lead">Tests:</span> <strong>{filterLabel}</strong></LTButton>}
            onSelect={o => {
              setTestFilter(o.value)
              // v4 item 10: the chosen test case opens, with the one it runs
              // inside, so its commands show without another click.
              const g = tcGroups.find(x => x.tc === o.value)
              if (g) setExpanded(s => new Set([...s, g.id, ...(g.parentId ? [g.parentId] : [])]))
            }}
            options={[{ value: 'all', label: 'All' }, ...tcGroups.map(g => ({
              value: g.tc, label: `${g.tc} ${g.title}`,
              // v4 item 10: a nested test case names the one it runs inside.
              description: g.parentId ? `Inside ${groupById.get(g.parentId).tc ?? groupById.get(g.parentId).title}` : undefined,
            }))]} />
        </div>
      </div>

      <div className="cmd-list" onKeyDown={onListKey}
        onFocus={e => { const id = e.target.dataset?.row; if (id) setActiveRow(id) }}>
        {layout.items.length === 0 && (
          <LTBlankSlate heading="0 matching commands"
            description={q ? 'Try a different search term.'
              : statusFilter ? 'Clear the status filter or try a wider time range.'
                : 'Try a wider time range or a different test.'} />
        )}
        {renderItems(layout.items, 0)}
      </div>

      {ctx && (
        // Composed: LTActionMenu opens from a button; here its documented
        // controlled mode (open, onMenuToggle) and customAnchor put it at the
        // pointer, or under the row from the keyboard (automation-details.md §9).
        <LTActionMenu open onMenuToggle={o => { if (!o) closeCtx() }} align="start" width={200}
          ariaLabel={`Actions for ${where(ctx.cmd)}`}
          customAnchor={<span className="ctx-anchor" style={{ left: ctx.x, top: ctx.y }} />}
          onSelect={o => runCtx(o.value, ctx.cmd)}
          options={[
            { value: 'payload', label: 'Copy payload', icon: Copy },
            { value: 'link', label: 'Copy link', icon: Link },
            { divider: true },
            // The brief says "create bug" here and "raise bug" in items 6 and
            // 15; the page already says Raise a bug, one term (C21).
            { value: 'bug', label: 'Raise a bug', icon: Bug },
          ]} />
      )}
    </div>
  )
}
