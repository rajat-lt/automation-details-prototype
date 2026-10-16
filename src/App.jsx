// Automation test details, with Rajat's 18 changes of 16 Oct 2026.
// Spec: automation-details.md. Shell, tokens, components and copy come from
// design-context (main e014a73); every departure is recorded in the spec.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PanelBottom, PanelLeft } from 'lucide-react'
import { PlatformSidebar, TopBar } from './shell.jsx'
import { TestHeader } from './header.jsx'
import { CommandsTab } from './commands.jsx'
import { VideoPane, frameDataURL } from './video.jsx'
import { LogsTab, NetworkTab, MetaDataTab, TestsPane } from './tabs.jsx'
import { Splitter, usePref, useSize } from './layout.jsx'
import { Announcer, LTButton, LTFlash, LTInputBox, StatusGlyph, LTTooltip, announce, cx } from './lt.jsx'
import { LTDrawer, LTModal, LTSegmentedControl, LTUnderlineNav, ToastProvider, useToast } from './overlays.jsx'
import { BUILD, TESTS, getDetail, failureSegments, historyFor } from './data.js'
import { fmtCount, fmtDateTime, fmtDuration, fmtOffset, fmtRelative } from './format.js'
import { playback } from './playback.js'

const TABS = [
  { id: 'commands', label: 'All Commands' },
  { id: 'logs', label: 'Logs' },
  { id: 'network', label: 'Network' },
  { id: 'metadata', label: 'Meta Data' },
]

function parseHash() {
  const [, testId, tab] = window.location.hash.match(/^#\/([^/]+)\/([^/?]+)/) ?? []
  return { testId, tab: TABS.some(t => t.id === tab) ? tab : 'commands' }
}

// Pane limits [proposed]: the 320 / 400 / 480 pane scale (guidelines/README.md
// §2) for the tests pane and the video's default; the logs keep 480px.
const TESTS_W = { min: 320, def: 400, max: 480 }
const VIDEO_W = { min: 320, def: 480 }
const LOGS_MIN_W = 480
const VIDEO_H = { min: 200, def: 360 }
const LOGS_MIN_H = 240

function Page() {
  const toast = useToast()
  const [route, setRoute] = useState(parseHash)
  const [demo, setDemo] = useState(() => new URLSearchParams(window.location.search).get('demo'))
  const [names, setNames] = useState({})
  const [deleted, setDeleted] = useState(() => new Set())
  const [dock, setDock] = usePref('dock', 'side')
  const [testsW, setTestsW] = usePref('testsWidth', TESTS_W.def)
  const [testsCollapsed, setTestsCollapsed] = usePref('testsCollapsed', false)
  const [videoW, setVideoW] = usePref('videoWidth', VIDEO_W.def)
  const [videoH, setVideoH] = usePref('videoHeight', VIDEO_H.def)
  const [codeTheme, setCodeTheme] = usePref('codeTheme', 'dark')
  const [logTheme, setLogTheme] = usePref('logTheme', 'dark')
  const [fullscreen, setFullscreen] = useState(false)
  const [modal, setModal] = useState(null) // 'delete' | 'history' | { shot: cmd }
  const [typed, setTyped] = useState('')
  const searchRef = useRef(null)
  const focusSearch = useRef(false)
  const detailRef = useRef(null)
  const wsRef = useRef(null)
  const keepRef = useRef(null)
  const ws = useSize(wsRef)

  useEffect(() => {
    const on = () => setRoute(parseHash())
    window.addEventListener('hashchange', on)
    if (!window.location.hash) window.location.replace(`#/${TESTS[0].id}/commands`)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const tests = TESTS.filter(t => !deleted.has(t.id))
  const test = tests.find(t => t.id === route.testId) ?? tests[0]
  const detail = getDetail(test.id)
  const name = names[test.id] ?? test.name
  const segments = useMemo(() => failureSegments(detail.failed), [detail])
  const tab = route.tab
  const go = (testId, t = tab) => { window.location.hash = `#/${testId}/${t}` }

  useEffect(() => {
    playback.set({ time: 0, playing: false, duration: detail.durationSec })
    document.title = `${name} · Automation`
  }, [test.id])
  useEffect(() => { document.title = `${name} · Automation` }, [name])

  useEffect(() => {
    const f = () => setFullscreen(document.fullscreenElement === detailRef.current)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  const share = useCallback(async () => {
    try { await navigator.clipboard.writeText(window.location.href) } catch { /* clipboard blocked */ }
    toast('Test link copied.', 'success')
  }, [toast])

  // Item 10: "/" focuses command search. "S" shares (screenshot 4's shortcut).
  useEffect(() => {
    const onKey = e => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"], [role="menu"], [role="slider"], [role="separator"]')) return
      if (document.querySelector('.lt-backdrop')) return
      if (e.key === '/') {
        e.preventDefault()
        if (tab === 'commands' && searchRef.current) searchRef.current.focus()
        else { focusSearch.current = true; go(test.id, 'commands') }
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault(); share()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [tab, test.id, share])

  // "/" pressed on another tab: focus the search once All Commands has rendered.
  useEffect(() => {
    if (tab === 'commands' && focusSearch.current && searchRef.current) {
      focusSearch.current = false
      searchRef.current.focus()
    }
  })

  const onStub = text => toast(text, 'default')
  const onMenu = v => {
    if (v === 'share') share()
    if (v === 'history') setModal('history')
    if (v === 'delete') { setTyped(''); setModal('delete') }
  }
  const doDelete = () => {
    const idx = tests.findIndex(t => t.id === test.id)
    const next = tests[idx + 1] ?? tests[idx - 1]
    setDeleted(s => new Set(s).add(test.id))
    setModal(null)
    toast(`Test "${name}" deleted.`, 'success')
    if (next) go(next.id, 'commands')
  }

  // Limits that depend on the space available.
  const videoWMax = Math.max(VIDEO_W.min, (ws.width || 1200) - LOGS_MIN_W - 8)
  const videoWNow = Math.min(Math.max(videoW, VIDEO_W.min), videoWMax)
  const videoHMax = Math.max(VIDEO_H.min, Math.min((ws.height || 800) * 0.6, (ws.height || 800) - LOGS_MIN_H))
  const videoHNow = Math.min(Math.max(videoH, VIDEO_H.min), videoHMax)

  const dockControl = (
    // Item 13: implicitly saved setting, so LTSegmentedControl, icon-only with
    // tooltips (guidelines/ltsegmentedcontrol.md).
    <LTSegmentedControl isIconButton variant="small" ariaLabel="Logs position" selectedValue={dock}
      onChange={setDock}
      options={[
        { value: 'side', label: 'Dock left of the video', icon: PanelLeft },
        { value: 'bottom', label: 'Dock below the video', icon: PanelBottom },
      ]} />
  )

  const panel = (
    <section className="logs" aria-label="Test detail">
      <LTUnderlineNav ariaLabel="Test detail" current={tab} trailing={dockControl}
        navs={TABS.map(t => ({
          ...t, href: `#/${test.id}/${t.id}`,
          counter: t.id === 'commands' && detail.commands.length ? fmtCount(detail.commands.length) : undefined,
        }))} />
      <div className="logs-panel">
        {/* Kept mounted while other tabs show, so revealed runs, open groups
            and the scroll position survive a tab switch. */}
        <div className="tab-host" hidden={tab !== 'commands'}>
          <CommandsTab key={`${test.id}:${demo}`} detail={detail} searchRef={searchRef} codeTheme={codeTheme}
            setCodeTheme={setCodeTheme} onStub={onStub} onScreenshot={cmd => setModal({ shot: cmd })}
            demo={demo === 'commands-loading' ? 'loading' : demo === 'commands-error' ? 'error' : null}
            onRetry={() => setDemo(null)} />
        </div>
        {tab === 'logs' && (detail.commands.length
          ? <LogsTab detail={detail} theme={logTheme} setTheme={setLogTheme} />
          : <div className="tab-state"><p className="lt-blank__heading">Logs appear here once the test starts.</p></div>)}
        {tab === 'network' && <NetworkTab />}
        {tab === 'metadata' && <MetaDataTab test={test} />}
      </div>
    </section>
  )

  const video = (
    <div className={cx('vp-wrap', `vp-wrap--${dock}`)} style={dock === 'side' ? { width: videoWNow } : { height: videoHNow }}>
      <VideoPane key={test.id} detail={detail} segments={segments} onToast={t => toast(t, 'default')}
        loading={demo === 'video-loading'} />
    </div>
  )

  const crumbs = [{ label: 'Builds' }, { label: BUILD.name }, { label: name }]
  const shot = modal?.shot

  return (
    <div className="app">
      <PlatformSidebar active="automation" />
      <div className="main">
        <TopBar crumbs={crumbs} onUpgrade={() => onStub('Plans and pricing open here.')} />
        <div className="page">
          {!testsCollapsed && (
            <>
              <div className="tp-wrap" style={{ width: testsW }}>
                <TestsPane tests={tests} names={names} selectedId={test.id} onCollapse={() => setTestsCollapsed(true)}
                  demo={demo} onRetry={() => setDemo(null)} />
              </div>
              <Splitter orientation="vertical" label="Resize tests pane" value={testsW}
                min={TESTS_W.min} max={TESTS_W.max} defaultValue={TESTS_W.def} onChange={setTestsW} />
            </>
          )}
          <main ref={detailRef} className={cx('td', fullscreen && 'is-fullscreen')}>
            <TestHeader test={test} name={name} fullscreen={fullscreen} onStub={onStub}
              testsCollapsed={testsCollapsed} onExpandTests={() => setTestsCollapsed(false)}
              onRename={v => { setNames(n => ({ ...n, [test.id]: v })); announce('Test name updated') }}
              onToggleFullscreen={() => (fullscreen ? document.exitFullscreen() : detailRef.current?.requestFullscreen?.())}
              onMenu={onMenu} />
            <div ref={wsRef} className={cx('ws', `ws--${dock}`)}>
              {/* Keyed so a dock switch moves the panes instead of remounting
                  them: open payloads, revealed runs and playback survive it. */}
              {dock === 'side' ? [
                <React.Fragment key="panel">{panel}</React.Fragment>,
                <Splitter key="split-v" orientation="vertical" invert label="Resize video pane" value={videoWNow}
                  min={VIDEO_W.min} max={videoWMax} defaultValue={VIDEO_W.def} onChange={setVideoW} />,
                <React.Fragment key="video">{video}</React.Fragment>,
              ] : [
                <React.Fragment key="video">{video}</React.Fragment>,
                <Splitter key="split-h" orientation="horizontal" label="Resize video pane" value={videoHNow}
                  min={VIDEO_H.min} max={videoHMax} defaultValue={VIDEO_H.def} onChange={setVideoH} />,
                <React.Fragment key="panel">{panel}</React.Fragment>,
              ]}
            </div>
          </main>
        </div>
      </div>

      {/* Delete: permanent, so patterns/modal.md §5's full recipe. */}
      <LTModal isOpen={modal === 'delete'} title={`Delete test "${name}"?`} onClose={() => setModal(null)}
        extraStyle={{ width: 480 }} initialRef={keepRef} keepOnBackdrop={typed.length > 0}
        renderFooter={() => (
          <>
            <LTButton ref={keepRef} variant="outline" size="medium" label="Keep Test" onClick={() => setModal(null)} />
            <LTButton variant="danger" size="medium" label="Delete Test" inactive={typed !== 'DELETE'} onClick={doDelete} />
          </>
        )}>
        {test.status === 'failed' && (
          <LTFlash variant="warning" text="This is a failed run. Its video and logs are the record of the failure." />
        )}
        <p className="modal-copy">{`Deleting removes this test's video, logs, and ${fmtCount(detail.commands.length)} commands from the build. Test case ${test.testCaseId} stays in Test Manager.`}</p>
        <p className="modal-copy modal-copy--strong">This action is permanent. Type DELETE to confirm.</p>
        <LTInputBox type="text" value={typed} onChange={setTyped} placeholder="Type DELETE to confirm"
          ariaLabel="Type DELETE to confirm deletion" className="modal-input" />
      </LTModal>

      <LTDrawer isOpen={modal === 'history'} title="Test history" subTitle={name} onClose={() => setModal(null)} width={480}>
        <ol className="history">
          {historyFor({ ...test, name }).map(h => (
            <li key={h.id} className="history__row">
              <StatusGlyph status={h.status} />
              <span className="history__main">
                <span className="history__build">{h.build}</span>
                <span className="history__meta">
                  <LTTooltip type="description" text={fmtDateTime(h.at)} direction="bottom">
                    <time tabIndex={0} className="meta-hint" dateTime={h.at.toISOString()}>{fmtRelative(h.at)}</time>
                  </LTTooltip>
                  {` · ${fmtDuration(h.durationSec)} · ${h.by}`}
                </span>
              </span>
              <span className="vh">{`, ${h.status}`}</span>
            </li>
          ))}
        </ol>
      </LTDrawer>

      <LTModal isOpen={!!shot} title={shot ? `Screenshot at ${fmtOffset(shot.at)}` : ''} subTitle={shot?.name}
        onClose={() => setModal(null)} extraStyle={{ width: 960 }}>
        {shot && <img className="shot" alt={`The page at ${fmtOffset(shot.at)}, during ${shot.name}`}
          src={frameDataURL(detail, shot.at + Math.min(0.5, shot.ms / 2000))} />}
      </LTModal>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Announcer />
      <Page />
    </ToastProvider>
  )
}
