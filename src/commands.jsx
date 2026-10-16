// All Commands tab: brief items 6 to 12 and 15 to 18.
// Spec: automation-details.md §3 and §4.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Bug, ChevronDown, ChevronRight, ChevronUp, ChevronsDownUp, ChevronsUpDown, Ellipsis, Image, Moon, Sun,
  Table, Braces, Undo2,
} from 'lucide-react'
import {
  LTButton, LTIconButton, LTTooltip, LTTag, LTInputBox, LTCounterLabel, LTTestStatusLabel, StatusGlyph,
  LTCodeBlock, LTCopyToClipboard, LTBlankSlate, LTFlash, LTSkeletonBox, LTTable, LTButtonGroup, announce, cx,
} from './lt.jsx'
import { LTActionMenu, LTSegmentedControl } from './overlays.jsx'
import { RangeTimeline } from './timeline.jsx'
import { onJump, jumpTo, playback, usePlayback } from './playback.js'
import { commandAt, failureSegments, statusLabel } from './data.js'
import { fmtMs, fmtOffset } from './format.js'

const RUN_MIN = 3 // a passed run collapses from 3 commands up [proposed]
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

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

function CommandDetail({ cmd, tab, setTab, view, setView, codeTheme, setCodeTheme, onStub, onScreenshot }) {
  const data = payloadOf(cmd, tab)
  const code = cmd.response.responseStatus
  const text = JSON.stringify(data, null, 2)
  return (
    <div className={cx('cmd-detail', cmd.status === 'failed' && 'is-failed')} id={`${cmd.id}-detail`}>
      <div className="cmd-detail__bar">
        {/* Request and Response: LTSegmentedControl, as hyperexecute-job-details.md
            §3.3 switches panels with one (C12). */}
        <LTSegmentedControl variant="small" ariaLabel="Payload" selectedValue={tab} onChange={setTab}
          options={[{ value: 'request', label: 'Request' }, { value: 'response', label: 'Response' }]} />
        <LTTag text={statusLabel(code)} variant={code >= 400 ? 'danger' : 'success'} />
        <span className="spacer" />
        <LTIconButton icon={Bug} ariaLabel="Raise a bug" variant="invisible" size="small"
          onClick={() => onStub('The bug form opens here, with this command attached.')} />
        <LTIconButton icon={Image} ariaLabel="View screenshot" variant="invisible" size="small"
          onClick={() => onScreenshot(cmd)} />
        <LTIconButton icon={view === 'table' ? Braces : Table} ariaLabel={view === 'table' ? 'Show as code' : 'Show as table'}
          variant="invisible" size="small" onClick={() => setView(view === 'table' ? 'code' : 'table')} />
      </div>
      {view === 'table' ? (
        <LTTable caption={tab === 'request' ? 'Request' : 'Response'} allowValueCopy
          columns={[{ key: 'k', title: 'Field', mono: true }, { key: 'v', title: 'Value', mono: true, copy: true, copyName: 'k' }]}
          data={Object.entries(data).map(([k, v]) => ({ k, v: typeof v === 'string' ? v : JSON.stringify(v) }))} />
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
    </div>
  )
}

/* ---------- rows ---------- */
function CommandRow({ cmd, depth, q, open, onToggle, flashN, detailProps }) {
  return (
    <>
      <div className={cx('cmd-row', `depth-${depth}`, cmd.status === 'failed' && 'is-failed', open && 'is-open')}
        data-cmd={cmd.id} tabIndex={-1}
        onClick={e => { if (!e.target.closest('button, a, input')) onToggle() }}>
        {flashN > 0 && <span key={flashN} className="cmd-flash" aria-hidden="true" />}
        <span className="cmd-status">
          {/* The Failed glyph, not the screenshot's triangle (C5); bare glyphs
              in this dense list (mock-data.md: one bg? value per surface). */}
          <LTTestStatusLabel status={cmd.status} showStatusText={false} bare />
        </span>
        <span className="cmd-name"><Hl text={cmd.name} q={q} /></span>
        {cmd.strategy && <LTTag text={cmd.strategy} variant="secondary" />}
        {cmd.value && <span className="cmd-value" title={cmd.value}><Hl text={cmd.value} q={q} /></span>}
        <span className="cmd-meta">
          <LTTooltip text={open ? 'Hide details' : 'Show details'} direction="top">
            <button type="button" className={cx('cmd-more', open && 'is-open')} aria-expanded={open}
              aria-controls={open ? `${cmd.id}-detail` : undefined}
              aria-label={`${open ? 'Hide' : 'Show'} details for ${cmd.name}`} onClick={onToggle}>
              <Ellipsis size={16} aria-hidden="true" />
            </button>
          </LTTooltip>
          <span className="cmd-dur">{fmtMs(cmd.ms)}</span>
          <span className="meta-dot" aria-hidden="true">·</span>
          <LTTooltip text={`Jump video to ${fmtOffset(cmd.at)}`} direction="top">
            <button type="button" className="cmd-at" aria-label={`Jump video to ${fmtOffset(cmd.at)}`}
              onClick={() => jumpTo(cmd.at, { commandId: cmd.id, source: 'row' })}>
              {fmtOffset(cmd.at)}
            </button>
          </LTTooltip>
        </span>
      </div>
      {open && <CommandDetail cmd={cmd} {...detailProps(cmd)} />}
    </>
  )
}

function Disclosure({ run, depth, onReveal }) {
  const n = run.cmds.length
  return (
    <div className={cx('cmd-row', 'cmd-row--disclosure', `depth-${depth}`)}>
      {/* Brief item 6: the brief's words and link look, with button semantics
          (an in-page trigger is a button, guidelines/README.md §5; C2). */}
      <button type="button" className="cmd-disclosure" aria-expanded="false" onClick={() => onReveal(run)}>
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
function FailureNav({ failures }) {
  const time = usePlayback(s => s.time)
  const next = failures.find(c => c.at > time + 0.05)
  const prev = [...failures].reverse().find(c => c.at < time - 0.05)
  return (
    <LTButtonGroup ariaLabel="Failed commands">
      <LTIconButton icon={ChevronUp} variant="outline" size="small" inactive={!prev}
        ariaLabel="Previous failed command" tooltipText={prev ? 'Previous failed command' : 'Showing the first failed command'}
        onClick={() => prev && jumpTo(prev.at, { commandId: prev.id, source: 'nav' })} />
      <LTIconButton icon={ChevronDown} variant="outline" size="small" inactive={!next}
        ariaLabel="Next failed command" tooltipText={next ? 'Next failed command' : 'Showing the last failed command'}
        onClick={() => next && jumpTo(next.at, { commandId: next.id, source: 'nav' })} />
    </LTButtonGroup>
  )
}

/* ---------- the tab ---------- */
export function CommandsTab({ detail, searchRef, codeTheme, setCodeTheme, onStub, onScreenshot, demo, onRetry }) {
  const { commands, tree, durationSec: duration } = detail
  const failedTest = detail.failedCount > 0
  const groups = useMemo(() => tree.filter(n => n.type === 'group'), [tree])
  const byId = useMemo(() => new Map(commands.map(c => [c.id, c])), [commands])

  const [expanded, setExpanded] = useState(() => new Set(groups
    .filter(g => !failedTest || g.children.some(c => c.status === 'failed')).map(g => g.id)))
  const [revealed, setRevealed] = useState(() => new Set())
  const [loadingRuns, setLoadingRuns] = useState(() => new Set())
  const [openDetails, setOpenDetails] = useState(() => new Set())
  const [tabs, setTabs] = useState({})
  const [views, setViews] = useState({})
  const [query, setQuery] = useState('')
  const [testFilter, setTestFilter] = useState('all')
  const [range, setRange] = useState([0, duration])
  const [flash, setFlash] = useState({ id: null, n: 0 })
  const [hidden, setHidden] = useState(false)
  const [toolbarH, setToolbarH] = useState(0)
  const [pendingScroll, setPendingScroll] = useState(null)

  const scrollRef = useRef(null)
  const toolbarRef = useRef(null)
  const lastTop = useRef(0)
  const suppressUntil = useRef(0)
  const toolbarActive = useRef(false)
  const focusAfterReveal = useRef(null)

  const q = query.trim().toLowerCase()
  const fullRange = range[0] <= 0.01 && range[1] >= duration - 0.01
  const tcGroups = groups.filter(g => g.kind === 'testCase')
  const filterGroup = testFilter === 'all' ? null : tcGroups.find(g => g.tc === testFilter)
  const filtering = !!q || !fullRange || !!filterGroup
  const disclosureOn = failedTest && !q

  const groupOf = useMemo(() => new Map(groups.flatMap(g => g.children.map(c => [c.id, g]))), [groups])
  const matches = useCallback(c => {
    if (!q) return true
    const g = groupOf.get(c.id)
    return [c.name, c.strategy, c.value, g?.title, g?.tc].filter(Boolean).join(' ').toLowerCase().includes(q)
  }, [q, groupOf])
  const inRange = useCallback(c => c.at >= range[0] - 1e-6 && c.at <= range[1] + 1e-6, [range])
  const visible = useCallback(c => matches(c) && inRange(c) && (!filterGroup || c.parentId === filterGroup.id),
    [matches, inRange, filterGroup])

  /* Layout: top-level runs and groups, each with its runs of passed commands. */
  const layout = useMemo(() => {
    const blocks = []
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
    let pending = []
    const flush = () => {
      if (pending.length) blocks.push({ type: 'seq', key: `root-${pending[0].id}`, items: runsFor(pending, `root-${pending[0].id}`) })
      pending = []
    }
    for (const node of tree) {
      if (node.type === 'command') { if (visible(node.cmd)) pending.push(node.cmd); continue }
      flush()
      const kids = node.children.filter(visible)
      if (filtering && kids.length === 0) continue
      blocks.push({ type: 'group', node, kids, items: runsFor(kids, node.id) })
    }
    flush()
    return { blocks, runOf }
  }, [tree, visible, filtering, disclosureOn])

  const counts = useMemo(() => {
    const inR = commands.filter(c => inRange(c) && (!filterGroup || c.parentId === filterGroup.id))
    return { passed: inR.filter(c => c.status === 'passed').length, failed: inR.filter(c => c.status === 'failed').length }
  }, [commands, inRange, filterGroup])
  const failuresForNav = useMemo(() => detail.failed.filter(c => inRange(c) && (!filterGroup || c.parentId === filterGroup.id)),
    [detail.failed, inRange, filterGroup])
  const segments = useMemo(() => failureSegments(detail.failed), [detail.failed])

  /* Reveal a command (item 9): open its group and its passed run, then scroll
     it under the sticky toolbar and flash it. */
  const reveal = useCallback((cmd, { flashIt = true } = {}) => {
    if (!cmd || !visible(cmd)) return
    if (cmd.parentId) setExpanded(s => (s.has(cmd.parentId) ? s : new Set(s).add(cmd.parentId)))
    const key = layout.runOf.get(cmd.id)
    if (key) setRevealed(s => (s.has(key) ? s : new Set(s).add(key)))
    suppressUntil.current = Date.now() + 1200
    setHidden(false)
    setPendingScroll({ id: cmd.id, flashIt, n: Date.now() })
  }, [visible, layout])

  useLayoutEffect(() => {
    if (!pendingScroll) return
    const sc = scrollRef.current
    const row = sc?.querySelector(`[data-cmd="${pendingScroll.id}"]`)
    if (!row) return
    const sr = sc.getBoundingClientRect(), rr = row.getBoundingClientRect()
    const head = row.closest('.cmd-group')?.querySelector('.cmd-group__head')
    const topSpace = (toolbarRef.current?.offsetHeight ?? 0) + (head?.offsetHeight ?? 0) + 8
    const rowTop = rr.top - sr.top
    if (rowTop < topSpace || rr.bottom > sr.bottom - 8) {
      suppressUntil.current = Date.now() + 1200
      sc.scrollTo({ top: sc.scrollTop + rowTop - topSpace, behavior: reduceMotion() ? 'auto' : 'smooth' })
    }
    if (pendingScroll.flashIt) setFlash(f => ({ id: pendingScroll.id, n: f.n + 1 }))
    setPendingScroll(null)
  }, [pendingScroll, expanded, revealed])

  // Item 9: every jump of the video reveals and highlights its command.
  useEffect(() => onJump(({ time, commandId }) => {
    reveal(commandId ? byId.get(commandId) : commandAt(commands, time))
  }), [reveal, byId, commands])

  // Item 16: a failed test opens at its first failure.
  useEffect(() => {
    if (!failedTest || demo) return
    const first = detail.failed[0]
    const t = setTimeout(() => reveal(first), 120)
    return () => clearTimeout(t)
  }, [])

  // Item 17: the toolbar slides away on scroll down and back on scroll up.
  useLayoutEffect(() => {
    const el = toolbarRef.current
    if (!el) return
    setToolbarH(el.offsetHeight) // now, not only when the observer next reports
    const ro = new ResizeObserver(() => setToolbarH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [demo, commands.length])
  const onScroll = e => {
    const st = e.currentTarget.scrollTop
    const dy = st - lastTop.current
    lastTop.current = st
    if (st <= toolbarH) { if (hidden) setHidden(false); return }
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
    const row = scrollRef.current?.querySelector(`[data-cmd="${id}"]`)
    if (row) { row.focus({ preventScroll: true }); focusAfterReveal.current = null }
  }, [revealed])

  const toggleGroup = id => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const allOpen = groups.length > 0 && groups.every(g => expanded.has(g.id))
  const toggleDetails = id => setOpenDetails(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const detailProps = cmd => ({
    tab: tabs[cmd.id] ?? (cmd.status === 'failed' ? 'response' : 'request'),
    setTab: v => setTabs(t => ({ ...t, [cmd.id]: v })),
    view: views[cmd.id] ?? 'code',
    setView: v => setViews(t => ({ ...t, [cmd.id]: v })),
    codeTheme, setCodeTheme, onStub, onScreenshot,
  })

  const renderItems = (items, depth) => items.map(it => {
    if (it.type === 'cmd') {
      return <CommandRow key={it.cmd.id} cmd={it.cmd} depth={depth} q={q} open={openDetails.has(it.cmd.id)}
        onToggle={() => toggleDetails(it.cmd.id)} flashN={flash.id === it.cmd.id ? flash.n : 0} detailProps={detailProps} />
    }
    const { run } = it
    if (revealed.has(run.key)) {
      return run.cmds.map(c => (
        <CommandRow key={c.id} cmd={c} depth={depth} q={q} open={openDetails.has(c.id)}
          onToggle={() => toggleDetails(c.id)} flashN={flash.id === c.id ? flash.n : 0} detailProps={detailProps} />
      ))
    }
    if (loadingRuns.has(run.key)) return <SkeletonRows key={run.key} n={run.cmds.length} depth={depth} label={`Loading ${run.cmds.length} passed logs`} />
    return <Disclosure key={run.key} run={run} depth={depth} onReveal={revealRun} />
  })

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
    <div ref={scrollRef} className="cmd-scroll" onScroll={onScroll}
      style={{ '--sticky-top': `${hidden ? 0 : toolbarH}px` }}>
      {/* Item 17: the toolbar is sticky, hides on scroll down and returns on
          scroll up. It stays while hovered or focused, and while a scroll it
          started is running [proposed]. */}
      <div ref={toolbarRef} className={cx('cmd-toolbar', hidden && 'is-hidden')}
        onMouseEnter={() => { toolbarActive.current = true }} onMouseLeave={() => { toolbarActive.current = false }}
        onFocus={() => { toolbarActive.current = true; setHidden(false) }}
        onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) toolbarActive.current = false }}>
        <div className="cmd-tl-head">
          <h2 className="cmd-tl-title">Timeline</h2>
          {/* Icon plus count, as the base pattern's summary (§3.1); the words
              are announced (C10). Counts follow the selected window. */}
          {/* Filled glyphs here, as screenshot 6 shows; bare in the group
              stats, as screenshot 7 shows. */}
          <span className="cmd-tl-count"><StatusGlyph status="passed" /><LTCounterLabel count={counts.passed} /><span className="vh"> passed</span></span>
          <span className="cmd-tl-count"><StatusGlyph status="failed" /><LTCounterLabel count={counts.failed} /><span className="vh"> failed</span></span>
          <span className="spacer" />
          <LTIconButton icon={Undo2} ariaLabel="Reset timeline" variant="invisible" size="small"
            onClick={() => { setRange([0, duration]); announce('Timeline reset to the whole run') }} />
          <LTIconButton icon={allOpen ? ChevronsDownUp : ChevronsUpDown} variant="invisible" size="small"
            ariaLabel={allOpen ? 'Collapse all groups' : 'Expand all groups'}
            onClick={() => setExpanded(allOpen ? new Set() : new Set(groups.map(g => g.id)))} />
          <FailureNav failures={failuresForNav} />
        </div>
        <RangeTimeline duration={duration} segments={segments} range={range} onRange={setRange}
          onSeek={(t, id) => jumpTo(t, { commandId: id, source: 'timeline' })} />
        <div className="cmd-filters">
          {/* Item 10: "/" focuses this field (App.jsx). The shortcut sits in
              the placeholder until a keyboard hint exists (README §10). */}
          <LTInputBox value={query} onChange={setQuery} placeholder="Search commands (/)" ariaLabel="Search commands"
            forwardRef={searchRef} keyshortcuts="/" className="cmd-search"
            onKeyDown={e => { if (e.key === 'Escape' && query) { e.preventDefault(); e.stopPropagation(); setQuery('') } }} />
          {/* A filter dropdown is LTButton outline with a caret, never LTSelect
              (guidelines/README.md §5; C11). */}
          <LTActionMenu ariaLabel="Tests" width={360} selectionVariant="single" selectedValue={testFilter}
            anchor={<LTButton variant="outline" size="medium" trailingIcon={ChevronDown} className="cmd-testfilter"
              ariaLabel={`Tests: ${filterGroup ? `${filterGroup.tc} ${filterGroup.title}` : 'All'}`}>
              <span className="lead">Tests:</span> <strong>{filterLabel}</strong></LTButton>}
            onSelect={o => setTestFilter(o.value)}
            options={[{ value: 'all', label: 'All' }, ...tcGroups.map(g => ({ value: g.tc, label: `${g.tc} ${g.title}` }))]} />
        </div>
      </div>

      <div className="cmd-list">
        {layout.blocks.length === 0 && (
          <LTBlankSlate heading="0 matching commands"
            description={q ? 'Try a different search term.' : 'Try a wider time range or a different test.'} />
        )}
        {layout.blocks.map(b => {
          if (b.type === 'seq') return <React.Fragment key={b.key}>{renderItems(b.items, 0)}</React.Fragment>
          const g = b.node
          const open = expanded.has(g.id) || (!!q && b.kids.length > 0)
          const passed = g.children.filter(c => c.status === 'passed').length
          const failed = g.children.length - passed
          return (
            // Item 15: a parent is an annotation or a test case. Item 18: the
            // body draws the indent rule from the chevron to the last command.
            <section key={g.id} className={cx('cmd-group', open && 'is-open')} aria-label={`${g.kind === 'testCase' ? 'Test case' : 'Annotation'}: ${g.tc ? `${g.tc} ` : ''}${g.title}`}>
              <div className="cmd-group__head">
                <button type="button" className="cmd-group__toggle" aria-expanded={open}
                  aria-controls={`${g.id}-body`} onClick={() => toggleGroup(g.id)}>
                  {open ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
                  {g.kind === 'testCase' && <span className="cmd-group__tc">{g.tc}</span>}
                  <span className="cmd-group__title"><Hl text={g.title} q={q} /></span>
                  <span className="vh">{g.kind === 'testCase' ? ', test case' : ', annotation'}</span>
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
              {open && <div className="cmd-group__body" id={`${g.id}-body`}>{renderItems(b.items, 1)}</div>}
            </section>
          )
        })}
      </div>
    </div>
  )
}
