// Logs, Network and Meta Data tabs, and the tests pane.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Download, ListFilter, Maximize, Minimize, Moon, PanelLeftClose, Sun } from 'lucide-react'
import {
  LTIconButton, LTInputBox, LTCodeBlock, LTBlankSlate, LTTable, LTFlash, LTButton, LTSkeletonBox, StatusGlyph,
  LTTooltip, announce, cx,
} from './lt.jsx'
import { LTActionMenu } from './overlays.jsx'
import { capabilitiesFor, BUILD } from './data.js'
import { fmtDuration, fmtMs, fmtOffset } from './format.js'

/* ---------------- Logs ----------------
   A log console: LTCodeBlock with its toolbar in headerActions, dark by
   default with its own light toggle (guidelines/README.md §1,
   patterns/hyperexecute-job-details.md §3.3). Lines come from the commands.
   It scrolls inside itself, as hyperexecute-job-details.md §6 says; item 17's
   single scroll is about the All Commands tab. */
export function LogsTab({ detail, theme, setTheme }) {
  const lines = useMemo(() => detail.commands.flatMap(c => {
    const stamp = `${fmtOffset(c.at)}.${String(Math.round((c.at % 1) * 1000)).padStart(3, '0')}`
    const args = c.request.requestBody ? ` ${c.request.requestBody}` : ''
    const head = { stamp, level: 'INFO', text: `${c.request.requestMethod} ${c.request.requestPath}${args}` }
    if (c.status === 'failed') {
      const body = JSON.parse(c.response.responseBody).value
      return [head, { stamp, level: 'ERROR', text: `${c.name} failed after ${fmtMs(c.ms)}: ${body.error}. ${body.message}`, error: true }]
    }
    return [head, { stamp, level: 'INFO', text: `${c.name} finished in ${fmtMs(c.ms)} with ${c.response.responseStatus}` }]
  }), [detail])
  const [q, setQ] = useState('')
  const [cur, setCur] = useState(0)
  const [fs, setFs] = useState(false)
  const boxRef = useRef(null)
  const bodyRef = useRef(null)
  const hits = useMemo(() => (q ? lines.map((l, i) => (l.text.toLowerCase().includes(q.toLowerCase()) ? i : -1)).filter(i => i >= 0) : []), [q, lines])
  useEffect(() => { setCur(0) }, [q])
  useEffect(() => {
    if (!hits.length) return
    bodyRef.current?.querySelector(`[data-line="${hits[cur]}"]`)?.scrollIntoView({ block: 'center' })
  }, [cur, hits])
  useEffect(() => {
    const f = () => setFs(document.fullscreenElement === boxRef.current)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])
  const download = () => {
    const text = lines.map(l => `${l.stamp}  ${l.level.padEnd(5)}  ${l.text}`).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    a.download = `${detail.test.testId}-selenium.log`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const dark = theme === 'dark'
  return (
    <div className="logs-tab" ref={boxRef}>
      <LTCodeBlock theme={theme} title="Selenium logs" className="logs-console" bodyRef={bodyRef}
        headerActions={<>
          <LTInputBox value={q} onChange={setQ} placeholder="Search logs" ariaLabel="Search logs" size="small"
            colorScheme={dark ? 'dark' : 'light'} className="logs-search"
            onKeyDown={e => { if (e.key === 'Enter' && hits.length) { e.preventDefault(); setCur(c => (c + (e.shiftKey ? hits.length - 1 : 1)) % hits.length) } }} />
          {q && <span className="logs-count" aria-live="polite">{hits.length ? `${cur + 1} of ${hits.length}` : '0 matches'}</span>}
          <LTIconButton icon={ChevronUp} ariaLabel="Previous match" variant="invisible" size="small" inactive={!hits.length}
            className={cx(dark && 'on-dark')} onClick={() => setCur(c => (c - 1 + hits.length) % hits.length)} />
          <LTIconButton icon={ChevronDown} ariaLabel="Next match" variant="invisible" size="small" inactive={!hits.length}
            className={cx(dark && 'on-dark')} onClick={() => setCur(c => (c + 1) % hits.length)} />
          <LTIconButton icon={dark ? Sun : Moon} ariaLabel={dark ? 'Switch logs to light theme' : 'Switch logs to dark theme'}
            variant="invisible" size="small" className={cx(dark && 'on-dark')} onClick={() => setTheme(dark ? 'light' : 'dark')} />
          <LTIconButton icon={Download} ariaLabel="Download logs" variant="invisible" size="small"
            className={cx(dark && 'on-dark')} onClick={download} />
          <LTIconButton icon={fs ? Minimize : Maximize} ariaLabel={fs ? 'Exit full screen' : 'Enter full screen'}
            variant="invisible" size="small" className={cx(dark && 'on-dark')}
            onClick={() => (fs ? document.exitFullscreen() : boxRef.current?.requestFullscreen?.())} />
        </>}>
        <ol className="log-lines" aria-label="Selenium logs">
          {lines.map((l, i) => (
            <li key={i} data-line={i} className={cx('log-line', l.error && 'is-error', hits[cur] === i && 'is-current', q && hits.includes(i) && 'is-hit')}>
              <span className="log-num" aria-hidden="true">{i + 1}</span>
              <span className="log-stamp">{l.stamp}</span>
              <span className="log-level">{l.level}</span>
              <span className="log-text">{l.text}</span>
            </li>
          ))}
        </ol>
      </LTCodeBlock>
    </div>
  )
}

/* ---------------- Network ----------------
   Capture is off for this run (capabilities: network false), which is the
   honest state for mock data with no recorded requests. */
export function NetworkTab() {
  return (
    <div className="tab-state">
      <LTBlankSlate heading="Network capture is off"
        description="Set the network capability to true to record requests on the next run." />
    </div>
  )
}

/* ---------------- Meta Data ---------------- */
export function MetaDataTab({ test }) {
  const rows = capabilitiesFor(test).map(([k, v]) => ({ k, v }))
  return (
    <div className="tab-pad">
      <LTTable caption="Capabilities" allowValueCopy
        columns={[{ key: 'k', title: 'Capability', mono: true }, { key: 'v', title: 'Value', mono: true, copy: true, copyName: 'k' }]}
        data={rows} />
    </div>
  )
}

/* ---------------- Tests pane ----------------
   From the base pattern §3.1: heading, collapse, search, filter, a pass and
   fail readout (icon plus count), and rows with status, name and duration.
   Selection is the orange bar plus the grey fill (guidelines/README.md §1). */
export function TestsPane({ tests, names, selectedId, onCollapse, demo, onRetry }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const listRef = useRef(null)
  const shown = tests.filter(t => (status === 'all' || t.status === status) && (names[t.id] ?? t.name).toLowerCase().includes(q.trim().toLowerCase()))
  const n = s => tests.filter(t => t.status === s).length
  useEffect(() => {
    listRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])
  return (
    <aside className="tp" aria-label="Tests">
      <div className="tp-head">
        <h2 className="tp-title">Tests</h2>
        <LTIconButton icon={PanelLeftClose} ariaLabel="Collapse tests pane" variant="invisible" size="small" onClick={onCollapse} />
      </div>
      <div className="tp-filters">
        <LTInputBox value={q} onChange={setQ} placeholder="Search tests" ariaLabel="Search tests" size="small" className="tp-search" />
        <LTActionMenu ariaLabel="Filter tests" width={200} selectionVariant="single" selectedValue={status}
          anchor={<LTIconButton icon={ListFilter} ariaLabel="Filter tests" variant="outline" size="small" />}
          onSelect={o => setStatus(o.value)}
          options={[{ value: 'all', label: 'All' }, { value: 'passed', label: 'Passed' }, { value: 'failed', label: 'Failed' }, { value: 'queued', label: 'Queued' }]} />
      </div>
      {demo !== 'tests-loading' && demo !== 'tests-error' && demo !== 'tests-empty' && (
        <p className="tp-summary">
          {/* Readout, not a filter (base pattern open question 5). */}
          <span><StatusGlyph status="failed" />{n('failed')}<span className="vh"> failed</span></span>
          <span><StatusGlyph status="passed" />{n('passed')}<span className="vh"> passed</span></span>
          <span><StatusGlyph status="queued" />{n('queued')}<span className="vh"> queued</span></span>
        </p>
      )}
      <div className="tp-list" ref={listRef}>
        {demo === 'tests-loading' ? (
          <div aria-busy="true" aria-label="Loading tests">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="tp-row tp-row--skeleton">
                <LTSkeletonBox width={16} height={16} radius="var(--radius-pill)" delay={i * 60} />
                <span className="tp-sk-lines"><LTSkeletonBox width="88%" height={12} delay={i * 60} /><LTSkeletonBox width="48%" height={10} delay={i * 60} /></span>
              </div>
            ))}
          </div>
        ) : demo === 'tests-error' ? (
          <div className="tp-state">
            <LTFlash variant="danger" text="Test list failed to load."
              action={<LTButton variant="outline" size="small" label="Try Again" onClick={onRetry} />} />
          </div>
        ) : demo === 'tests-empty' ? (
          <LTBlankSlate heading="0 tests in this build" description="Tests appear here as the build runs them." />
        ) : shown.length === 0 ? (
          <LTBlankSlate heading="0 matching tests" description="Try a different search term." />
        ) : (
          <ul>
            {shown.map(t => {
              const name = names[t.id] ?? t.name
              const on = t.id === selectedId
              return (
                <li key={t.id}>
                  <LTTooltip text={name} direction="right" delayDuration={600}>
                    <a href={`#/${t.id}/commands`} className={cx('tp-row', on && 'is-selected')} aria-current={on ? 'page' : undefined}>
                      <StatusGlyph status={t.status} />
                      <span className="tp-row__main">
                        <span className="tp-row__name">{name}</span>
                        <span className="tp-row__meta">{`${t.browser} ${t.browserVersion} · ${t.os} ${t.osVersion}`}</span>
                      </span>
                      <span className="tp-row__dur">{t.status === 'queued' ? 'Queued' : fmtDuration(t.durationSec)}</span>
                      <span className="vh">{`, ${t.status}`}</span>
                    </a>
                  </LTTooltip>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}

export { BUILD }
