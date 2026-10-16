// Automation test details: Rajat's 18 changes of 16 Oct 2026 and the 16 of
// 17 Oct 2026 (v2). Spec: automation-details.md. Shell, tokens, components and
// copy come from design-context (main e014a73); every departure is recorded in
// the spec.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bug, Download, Link, PanelBottom, PanelLeft, PanelRight, PanelRightOpen, PanelTop, PanelTopOpen } from 'lucide-react'
import { PlatformSidebar, TopBar } from './shell.jsx'
import { TestHeader } from './header.jsx'
import { CommandsTab } from './commands.jsx'
import { VideoPane, PipWindow, frameDataURL } from './video.jsx'
import { LogsTab, NetworkTab, MetaDataTab, TestsPane } from './tabs.jsx'
import { ReorderTabs } from './tabbar.jsx'
import { ShortcutsDialog } from './shortcuts.jsx'
import { Splitter, usePref, useSize } from './layout.jsx'
import {
  Announcer, LTButton, LTFlash, LTInputBox, LTIconButton, LTMetaData, LTTag, StatusGlyph, LTTooltip, CopyIconButton,
  TruncText, announce, cx,
} from './lt.jsx'
import { LTDrawer, LTModal, LTSegmentedControl, ToastProvider, useToast } from './overlays.jsx'
import { BUILD, TESTS, getDetail, failureSegments, historyFor, commandHref, statusLabel } from './data.js'
import { fmtCount, fmtDateTime, fmtDuration, fmtMs, fmtRelative, fmtTime } from './format.js'
import { playback } from './playback.js'
import { copyText } from './clipboard.js'

const TAB_IDS = ['commands', 'logs', 'network', 'metadata']
const TAB_LABELS = { commands: 'All Commands', logs: 'Logs', network: 'Network', metadata: 'Meta Data' }

// #/{test}/{tab}, or #/{test}/commands/{command} for a command's link (v2 item 2).
let hashN = 0
function parseHash() {
  const [, testId, tab, commandId] = window.location.hash.match(/^#\/([^/]+)\/([^/?]+)(?:\/([^/?]+))?/) ?? []
  hashN += 1
  return { testId, tab: TAB_IDS.includes(tab) ? tab : 'commands', commandId: tab === 'commands' ? commandId : undefined, n: hashN }
}
const cleanOrder = o => (Array.isArray(o) && o.length === TAB_IDS.length && TAB_IDS.every(id => o.includes(id)) ? o : TAB_IDS)

// Pane limits [proposed]: the 320 / 400 / 480 pane scale (guidelines/README.md
// §2) for the tests pane and the video's default; the logs keep 480px.
const TESTS_W = { min: 320, def: 400, max: 480 }
const VIDEO_W = { min: 320, def: 480 }
const LOGS_MIN_W = 480
const VIDEO_H = { min: 200, def: 360 }
const LOGS_MIN_H = 240

/* v2 item 15: the screenshot keeps its command's context, and its own
   download, bug and link actions. */
function ScreenshotBody({ cmd, detail, onStub }) {
  const src = useMemo(() => frameDataURL(detail, cmd.at + Math.min(0.5, cmd.ms / 2000)), [cmd, detail])
  const failed = cmd.status === 'failed'
  const at = fmtTime(cmd.at)
  const download = () => {
    const a = document.createElement('a')
    a.href = src
    a.download = `screenshot-${at.replace(/:/g, '-')}-${cmd.name.toLowerCase().replace(/\s+/g, '-')}.png`
    a.click()
  }
  return (
    <>
      <div className="shot-bar">
        <p className="shot-meta">
          <span className="shot-status"><StatusGlyph status={cmd.status} bare />{failed ? 'Failed' : 'Passed'}</span>
          <LTMetaData value={<strong>{cmd.name}</strong>} />
          {cmd.value && <LTMetaData label="Locator"><TruncText className="shot-value" text={cmd.value} /></LTMetaData>}
          <LTMetaData label="Duration" value={fmtMs(cmd.ms)} />
          {failed && <LTMetaData><LTTag variant="danger" text={statusLabel(cmd.response.responseStatus)} /></LTMetaData>}
        </p>
        <span className="shot-actions">
          <LTIconButton icon={Download} ariaLabel="Download screenshot" variant="invisible" size="small" onClick={download} />
          <LTIconButton icon={Bug} ariaLabel="Raise a bug" variant="invisible" size="small"
            onClick={() => onStub(`The bug form opens here, with this screenshot and ${cmd.name} at ${at} attached.`)} />
          {/* The link opens the command, not this dialog: guidelines/ltmodal.md,
              never deep-link straight into a modal. */}
          <CopyIconButton icon={Link} ariaLabel="Copy link" copiedLabel={`Link to ${cmd.name} at ${at} copied`}
            copy={() => copyText(commandHref(detail.test.id, cmd.id))} />
        </span>
      </div>
      <img className="shot" alt={`The page at ${at}, during ${cmd.name}`} src={src} />
    </>
  )
}

function Page() {
  const toast = useToast()
  const [route, setRoute] = useState(parseHash)
  const [demo, setDemo] = useState(() => new URLSearchParams(window.location.search).get('demo'))
  const [names, setNames] = useState({})
  const [deleted, setDeleted] = useState(() => new Set())
  const [unlinked, setUnlinked] = useState(() => new Set())
  const [dock, setDock] = usePref('dock', 'side')
  const [videoMode, setVideoMode] = usePref('videoMode', 'docked') // v2 item 5: docked, pip or collapsed
  const [pipRect, setPipRect] = usePref('pipRect', { right: 24, bottom: 24, width: 400 })
  const [tabOrderPref, setTabOrder] = usePref('tabOrder', TAB_IDS)
  const [testsW, setTestsW] = usePref('testsWidth', TESTS_W.def)
  const [testsCollapsed, setTestsCollapsed] = usePref('testsCollapsed', false)
  const [videoW, setVideoW] = usePref('videoWidth', VIDEO_W.def)
  const [videoH, setVideoH] = usePref('videoHeight', VIDEO_H.def)
  const [codeTheme, setCodeTheme] = usePref('codeTheme', 'dark')
  const [logTheme, setLogTheme] = usePref('logTheme', 'dark')
  const [payloadView, setPayloadView] = usePref('payloadView', 'json') // v2 item 4: one setting for every command
  const [fullscreen, setFullscreen] = useState(false)
  const [modal, setModal] = useState(null) // 'delete' | 'history' | 'shortcuts' | { shot: cmd }
  const [typed, setTyped] = useState('')
  const searchRef = useRef(null)
  const focusSearch = useRef(false)
  const focusNext = useRef(null)
  const detailRef = useRef(null)
  const wsRef = useRef(null)
  const keepRef = useRef(null)
  const ws = useSize(wsRef)
  const tabOrder = cleanOrder(tabOrderPref)

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
  const byId = useMemo(() => new Map(detail.commands.map(c => [c.id, c])), [detail])
  const linked = !unlinked.has(test.id)
  const tab = route.tab
  const go = (testId, t = tab) => { window.location.hash = `#/${testId}/${t}` }

  useEffect(() => {
    playback.set({ time: 0, playing: false, duration: detail.durationSec })
  }, [test.id])
  useEffect(() => { document.title = `${name} · Automation` }, [name])

  useEffect(() => {
    const f = () => setFullscreen(document.fullscreenElement === detailRef.current)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  // Share copies the test's link, without any command a link pointed at.
  const share = useCallback(async () => {
    const ok = await copyText(`${window.location.origin}${window.location.pathname}#/${test.id}/${tab}`)
    toast(ok ? 'Test link copied.' : 'Test link failed to copy. Try again.', ok ? 'success' : 'danger')
  }, [toast, test.id, tab])

  // Item 10: "/" focuses command search. "S" shares (screenshot 4's
  // shortcut). "?" lists every shortcut (a visible twin for each, §7b).
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
      } else if (e.key === '?') {
        e.preventDefault(); setModal('shortcuts')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [tab, test.id, share])

  // "/" pressed on another tab: focus the search once All Commands has
  // rendered. A video-mode change moves focus to the control that undoes it.
  useEffect(() => {
    if (tab === 'commands' && focusSearch.current && searchRef.current) {
      focusSearch.current = false
      searchRef.current.focus()
    }
    if (focusNext.current) {
      const el = document.querySelector(`[data-focus="${focusNext.current}"]`)
      if (el) { el.focus(); focusNext.current = null }
    }
  })

  const onStub = text => toast(text, 'default')
  const onMenu = v => {
    if (v === 'share') share()
    if (v === 'history') setModal('history')
    if (v === 'shortcuts') setModal('shortcuts')
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

  // v2 item 12: unlinking is reversible, so it happens at once and the toast
  // offers Undo (ux-text-guidelines.md §3 Toasts) instead of a confirmation.
  const unlink = () => {
    const id = test.id, tc = test.testCaseId
    setUnlinked(s => new Set(s).add(id))
    focusNext.current = 'link-tc'
    toast(`Test case ${tc} unlinked.`, 'default', {
      label: 'Undo',
      onClick: () => {
        setUnlinked(s => { const n = new Set(s); n.delete(id); return n })
        announce(`Test case ${tc} linked`)
      },
    })
  }

  // v2 item 5. Each change moves focus to the control that reverses it, since
  // the button that was pressed disappears.
  const changeVideoMode = (mode, focusKey) => {
    if (mode === 'collapsed') playback.set({ playing: false })
    setVideoMode(mode)
    focusNext.current = focusKey
    announce({ docked: 'Video docked', pip: 'Video in picture-in-picture', collapsed: 'Video collapsed. Show Video brings it back.' }[mode])
  }
  const docked = videoMode === 'docked'

  // Limits that depend on the space available.
  const videoWMax = Math.max(VIDEO_W.min, (ws.width || 1200) - LOGS_MIN_W - 8)
  const videoWNow = Math.min(Math.max(videoW, VIDEO_W.min), videoWMax)
  const videoHMax = Math.max(VIDEO_H.min, Math.min((ws.height || 800) * 0.6, (ws.height || 800) - LOGS_MIN_H))
  const videoHNow = Math.min(Math.max(videoH, VIDEO_H.min), videoHMax)

  // The end of the tab bar always says where the video is (show the mode):
  // its dock position while docked, otherwise the way back.
  const videoControl = docked ? (
    // Item 13: implicitly saved setting, so LTSegmentedControl, icon-only with
    // tooltips. Segments are nouns, not actions (guidelines/ltsegmentedcontrol.md;
    // v1 said "Dock left of the video", corrected 17 Oct 2026).
    <LTSegmentedControl isIconButton variant="small" ariaLabel="Logs position" selectedValue={dock}
      onChange={setDock}
      options={[
        { value: 'side', label: 'Logs left of the video', icon: PanelLeft },
        { value: 'bottom', label: 'Logs below the video', icon: PanelBottom },
      ]} />
  ) : videoMode === 'pip' ? (
    <LTButton variant="outline" size="small" leadingIcon={dock === 'side' ? PanelRight : PanelTop} label="Dock Video"
      data-focus="tab-dock" onClick={() => changeVideoMode('docked', 'video-pip')} />
  ) : (
    <LTButton variant="outline" size="small" leadingIcon={dock === 'side' ? PanelRightOpen : PanelTopOpen} label="Show Video"
      data-focus="show-video" onClick={() => changeVideoMode('docked', 'video-collapse')} />
  )

  const panel = (
    <section className="logs" aria-label="Test detail">
      <ReorderTabs order={tabOrder} setOrder={setTabOrder} defaultOrder={TAB_IDS} ariaLabel="Test detail" current={tab}
        trailing={videoControl}
        navs={tabOrder.map(id => ({
          id, label: TAB_LABELS[id], href: `#/${test.id}/${id}`,
          counter: id === 'commands' && detail.commands.length ? fmtCount(detail.commands.length) : undefined,
        }))} />
      <div className="logs-panel">
        {/* Kept mounted while other tabs show, so revealed runs, open groups
            and the scroll position survive a tab switch. */}
        <div className="tab-host" hidden={tab !== 'commands'}>
          <CommandsTab key={`${test.id}:${demo}`} detail={detail} searchRef={searchRef} codeTheme={codeTheme}
            setCodeTheme={setCodeTheme} payloadView={payloadView} setPayloadView={setPayloadView}
            onStub={onStub} onToast={toast} onScreenshot={cmd => setModal({ shot: cmd })}
            isCurrent={tab === 'commands' && !modal}
            focusCommand={route.testId === test.id && route.commandId ? { id: route.commandId, n: route.n } : null}
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

  const videoPane = mode => (
    <VideoPane key={test.id} detail={detail} segments={segments} byId={byId} onStub={onStub}
      loading={demo === 'video-loading'} mode={mode} dock={dock}
      onPip={() => changeVideoMode('pip', 'pip-dock')} onCollapse={() => changeVideoMode('collapsed', 'show-video')} />
  )
  const video = (
    <div className={cx('vp-wrap', `vp-wrap--${dock}`)} style={dock === 'side' ? { width: videoWNow } : { height: videoHNow }}>
      {videoPane('docked')}
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
              onMenu={onMenu} linked={linked} onUnlink={unlink}
              onLink={() => onStub('Test Manager opens here, to pick the test case to link.')} />
            <div ref={wsRef} className={cx('ws', `ws--${docked ? dock : 'solo'}`)}>
              {/* Keyed so a dock or mode switch moves the panes instead of
                  remounting them: open payloads, revealed runs and playback
                  survive it. */}
              {!docked ? [
                <React.Fragment key="panel">{panel}</React.Fragment>,
              ] : dock === 'side' ? [
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

      {videoMode === 'pip' && (
        <PipWindow rect={pipRect} setRect={setPipRect} title={name} dock={dock}
          onDock={() => changeVideoMode('docked', 'video-pip')} onCollapse={() => changeVideoMode('collapsed', 'show-video')}>
          {videoPane('pip')}
        </PipWindow>
      )}

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
        <p className="modal-copy">{`Deleting removes this test's video, logs, and ${fmtCount(detail.commands.length)} commands from the build.${linked ? ` Test case ${test.testCaseId} stays in Test Manager.` : ''}`}</p>
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

      <LTModal isOpen={!!shot} title={shot ? `Screenshot at ${fmtTime(shot.at)}` : ''}
        onClose={() => setModal(null)} extraStyle={{ width: 960 }}>
        {shot && <ScreenshotBody cmd={shot} detail={detail} onStub={onStub} />}
      </LTModal>

      <ShortcutsDialog isOpen={modal === 'shortcuts'} onClose={() => setModal(null)} />
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
