// The Network tab's overview (v6, Rajat's items of 28 Oct 2026: 1 to 5, 12
// and 21). Always the whole session, on top of the request list: a density
// histogram of the requests in flight, since at a session's scale single
// request bars would be slivers (item 1); page-load markers that zoom to
// their load (item 3); error ticks; a thin lane of the test's commands, as
// Playwright's trace viewer lanes its actions (item 12); the video's
// playhead; and a brush whose window filters the list (item 6). Dragging on
// the track selects a window and dragging the window moves it (item 21), a
// double-click zooms to a cluster of requests (item 4), and a pinch zooms
// around the pointer (item 5). The window is the Waterfall column's too, so
// either view moves the other and there is no mode to learn (item 2).
// Spec: automation-details.md §4g.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Handle, ticksFor } from './timeline.jsx'
import { usePlayback } from './playback.js'
import { LTTooltip, cx } from './lt.jsx'
import { useSize } from './layout.jsx'
import { fmtClock, fmtClockFine, fmtWindow } from './format.js'

export const MIN_SPAN = 0.2 // seconds: the narrowest window, a few requests wide
const BIN = 5 // px per histogram column: a 3px bar and a 2px gap (the dataviz spacer)
const HIST_H = 26

export const isFullWin = ([a, b], run) => a <= 1e-6 && b >= run - 1e-6
export function clampWin([a, b], run) {
  const span = Math.min(run, Math.max(MIN_SPAN, b - a))
  const s = Math.min(Math.max(0, a), run - span)
  return [s, s + span]
}
/** Zoom by `factor` around the moment `t`, which keeps its place in the
    window. A moment outside the window (the overview shows the whole
    session) becomes the window's centre: the zoom goes where it points. */
export function zoomWin([a, b], t, factor, run) {
  const span = Math.min(run, Math.max(MIN_SPAN, (b - a) * factor))
  const k = t >= a && t <= b ? (t - a) / (b - a) : 0.5
  return clampWin([t - k * span, t - k * span + span], run)
}
export const panWin = ([a, b], dt, run) => clampWin([a + dt, b + dt], run)

/* One wheel event over either view (item 5). Chromium browsers send a
   trackpad pinch as a wheel event with ctrlKey set; it zooms around the
   pointer instead of zooming the page. A sideways scroll moves a
   zoomed-in window. Returns the new window, or null to leave the event to
   the page. */
export function wheelWin(e, win, run, t, widthPx) {
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1
  if (e.ctrlKey) {
    const d = Math.max(-60, Math.min(60, e.deltaY * unit))
    return zoomWin(win, t, Math.exp(d * 0.01), run)
  }
  const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0
  if (!dx || isFullWin(win, run)) return null
  return panWin(win, (dx * unit * (win[1] - win[0])) / Math.max(1, widthPx), run)
}

/* Safari sends a trackpad pinch as gesture events instead: `scale` grows
   from 1 as the fingers spread. Same zoom, from the window the pinch began
   on. */
export function useGestureZoom(ref, { winRef, run, timeAt, onWin, within }) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let from = null
    const start = e => {
      from = !within || e.target.closest?.(within) ? winRef.current : null
      if (from) e.preventDefault()
    }
    const change = e => {
      if (!from) return
      e.preventDefault()
      if (e.scale) onWin.current(zoomWin(from, timeAt(e.clientX), 1 / e.scale, run))
    }
    el.addEventListener('gesturestart', start)
    el.addEventListener('gesturechange', change)
    return () => { el.removeEventListener('gesturestart', start); el.removeEventListener('gesturechange', change) }
  }, [ref.current, run])
}

/* Requests close together in time, for the double-click (item 4): a gap
   wider than an 80th of the session, at least half a second, splits them. */
export function clustersOf(requests, run) {
  const gap = Math.max(0.5, run / 80)
  const out = []
  for (const q of [...requests].sort((x, y) => x.start - y.start)) {
    const last = out[out.length - 1]
    if (last && q.start - last.end <= gap) last.end = Math.max(last.end, q.end)
    else out.push({ start: q.start, end: q.end })
  }
  return out
}

const pathOf = url => { try { const u = new URL(url); return `${u.pathname}${u.search}` } catch { return url } }

export function NetworkOverview({ requests, pages, commands, errors, hot, run, win, onWin }) {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const { width } = useSize(trackRef)
  const W = Math.max(1, width)
  const time = usePlayback(s => s.time)
  const [hover, setHover] = useState(null)
  const [dragging, setDragging] = useState(null) // 'pan' | 'select'
  const [markAt, setMarkAt] = useState(0) // the page-load marker in the tab order
  const drag = useRef(null)
  const winRef = useRef(win)
  winRef.current = win
  const onWinRef = useRef(onWin)
  onWinRef.current = onWin
  const [a, b] = win
  const span = b - a
  const full = isFullWin(win, run)
  const pct = t => `${(t / run) * 100}%`
  const timeAt = x => {
    const r = trackRef.current.getBoundingClientRect()
    return Math.min(run, Math.max(0, ((x - r.left) / Math.max(1, r.width)) * run))
  }

  // Requests in flight in each 5px column of the session.
  const hist = useMemo(() => {
    const n = Math.max(1, Math.floor(W / BIN))
    const per = run / n
    const counts = new Array(n).fill(0)
    for (const q of requests) {
      const i0 = Math.max(0, Math.floor(q.start / per)), i1 = Math.min(n - 1, Math.floor(q.end / per))
      for (let i = i0; i <= i1; i++) counts[i] += 1
    }
    return { counts, max: Math.max(1, ...counts) }
  }, [requests, run, W])
  const clusters = useMemo(() => clustersOf(requests, run), [requests, run])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onWheel = e => {
      // A sideways scroll here moves the window across the whole session,
      // so it pans at the session's scale.
      const w = trackRef.current.offsetWidth
      const next = wheelWin(e, winRef.current, run, timeAt(e.clientX), e.ctrlKey ? w : (w * (winRef.current[1] - winRef.current[0])) / run)
      if (e.ctrlKey) e.preventDefault() // a pinch here never zooms the page
      if (!next) return
      e.preventDefault()
      winRef.current = next // the next event of the same gesture builds on this one
      onWinRef.current(next)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [run])
  useGestureZoom(rootRef, { winRef, run, timeAt, onWin: onWinRef })

  /* Drag on the track selects a window; drag inside a narrowed window moves
     it. A press that does not move is a click, and a click does nothing, so
     a double-click is free to zoom. */
  const onPointerDown = e => {
    if (e.button !== 0 || e.target.closest('.tl-handle')) return
    const t = timeAt(e.clientX)
    drag.current = { kind: !full && t >= a && t <= b ? 'pan' : 'select', x0: e.clientX, t0: t, win0: win, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = e => {
    const d = drag.current
    if (!d) { setHover(timeAt(e.clientX)); return }
    if (!d.moved && Math.abs(e.clientX - d.x0) < 3) return
    if (!d.moved) { d.moved = true; setDragging(d.kind) }
    const t = timeAt(e.clientX)
    setHover(t)
    if (d.kind === 'pan') onWin(panWin(d.win0, ((e.clientX - d.x0) / W) * run, run))
    else onWin(clampWin(t >= d.t0 ? [d.t0, Math.max(t, d.t0 + MIN_SPAN)] : [Math.min(t, d.t0 - MIN_SPAN), d.t0], run))
  }
  const endDrag = () => { drag.current = null; setDragging(null) }
  const onDoubleClick = e => {
    if (e.target.closest('.tl-handle')) return
    const t = timeAt(e.clientX)
    const near = (8 / W) * run
    const c = clusters.find(k => t >= k.start - near && t <= k.end + near)
    if (!c) return
    const pad = Math.max(0.02, (c.end - c.start) * 0.05)
    onWin(clampWin([c.start - pad, c.end + pad], run))
  }

  // The window is a slider too: arrows move it, plus and minus zoom it.
  const onWindowKey = e => {
    const step = span * (e.shiftKey ? 0.5 : 0.1)
    const mid = (a + b) / 2
    const next = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? panWin(win, -step, run)
      : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? panWin(win, step, run)
        : e.key === 'Home' ? clampWin([0, span], run) : e.key === 'End' ? clampWin([run - span, run], run)
          : e.key === '+' || e.key === '=' ? zoomWin(win, mid, 0.5, run)
            : e.key === '-' || e.key === '_' ? zoomWin(win, mid, 2, run) : null
    if (next) { e.preventDefault(); onWin(next) }
  }
  const onMarkKey = e => {
    const j = e.key === 'ArrowRight' ? Math.min(pages.length - 1, markAt + 1) : e.key === 'ArrowLeft' ? Math.max(0, markAt - 1)
      : e.key === 'Home' ? 0 : e.key === 'End' ? pages.length - 1 : null
    if (j == null) return
    e.preventDefault()
    setMarkAt(j)
    rootRef.current?.querySelectorAll('.nov-mark')[j]?.focus()
  }

  const fine = span < 10 ? 1 : 0
  const handleStep = span <= 2 ? 0.1 : span <= 20 ? 0.5 : 1
  const running = hover == null ? null
    : commands.find(c => hover >= c.at - (2 / W) * run && hover <= c.at + Math.max(c.ms / 1000, (2 / W) * run))
  return (
    <section ref={rootRef} className="nov" aria-label="Timeline overview" aria-describedby="nov-sum">
      <p id="nov-sum" className="vh">
        {`The whole session: ${pages.length} page load${pages.length === 1 ? '' : 's'} and ${errors.length} error${errors.length === 1 ? '' : 's'}. Showing ${fmtWindow(a, b)}.`}
      </p>
      <div className="nov-marks" role="group" aria-label="Page loads" onKeyDown={onMarkKey}>
        {pages.map((p, i) => (
          <LTTooltip key={p.docId} text={`Zoom to page load ${i + 1}: ${pathOf(p.url)}`} direction="top">
            <button type="button" className="nov-mark" style={{ left: pct(p.at) }} tabIndex={i === markAt ? 0 : -1}
              aria-label={`Zoom to page load ${i + 1} of ${pages.length}: ${pathOf(p.url)}, at ${fmtClock(p.at)}`}
              onFocus={() => setMarkAt(i)} onClick={() => onWin(clampWin(p.win, run))} />
          </LTTooltip>
        ))}
      </div>
      <div ref={trackRef} className={cx('nov-track', !full && 'is-narrowed', dragging && `is-${dragging}`)}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
        onPointerLeave={() => { if (!drag.current) setHover(null) }} onDoubleClick={onDoubleClick}>
        <span className="nov-clip" aria-hidden="true">
          <span className="nov-lane">
            {commands.map(c => (
              <span key={c.id} className={cx('nov-cmd', c.status === 'failed' && 'is-failed')}
                style={{ left: pct(c.at), width: `max(2px, ${pct(c.ms / 1000)})` }} />
            ))}
          </span>
          <svg className="nov-hist" width={W} height={HIST_H} focusable="false">
            {hist.counts.map((n, i) => {
              if (!n) return null
              const h = Math.max(2, Math.round((n / hist.max) * HIST_H))
              return (
                <g key={i}>
                  <rect className="nov-bin" x={i * BIN} y={HIST_H - h} width={BIN - 2} height={h} />
                  <rect className="nov-cap" x={i * BIN} y={HIST_H - h} width={BIN - 2} height={1} />
                </g>
              )
            })}
          </svg>
          {pages.map(p => <span key={p.docId} className="nov-nav" style={{ left: pct(p.at) }} />)}
          {errors.map(q => <span key={q.id} className="nov-err" style={{ left: pct(q.start) }} />)}
          {hot.map(q => (
            <span key={q.id} className="nov-hot" style={{ left: pct(q.start), width: `max(2px, ${pct(q.end - q.start)})` }} />
          ))}
          {!full && <span className="nov-shade" style={{ left: 0, width: pct(a) }} />}
          {!full && <span className="nov-shade" style={{ left: pct(b), right: 0 }} />}
          {time <= run && <span className="nov-playhead" style={{ left: pct(time) }} />}
        </span>
        <span role="slider" tabIndex={0} className="nov-window" aria-label="Time range"
          aria-valuemin={0} aria-valuemax={Math.round(run - span)} aria-valuenow={Math.round(a)}
          aria-valuetext={fmtWindow(a, b)} aria-describedby="nov-keys" onKeyDown={onWindowKey}
          style={{ left: pct(a), width: `max(6px, ${pct(span)})` }} />
        <span id="nov-keys" className="vh">Arrow keys move the range. Plus and minus zoom it.</span>
        <Handle which="start" value={a} min={0} max={b - MIN_SPAN} view={[0, run]} trackRef={trackRef}
          fmt={v => fmtClockFine(v, fine)} step={handleStep} bigStep={handleStep * 10} onChange={v => onWin(clampWin([v, b], run))} />
        <Handle which="end" value={b} min={a + MIN_SPAN} max={run} view={[0, run]} trackRef={trackRef}
          fmt={v => fmtClockFine(v, fine)} step={handleStep} bigStep={handleStep * 10} onChange={v => onWin(clampWin([a, v], run))} />
        {hover != null && (
          <span className="tl-hover nov-bubble" style={{ left: pct(hover) }} aria-hidden="true">
            {fmtClock(hover)}{running && <span className="nov-bubble__cmd">{` · ${running.name}`}</span>}
          </span>
        )}
      </div>
      <div className="tl-axis" aria-hidden="true">
        {ticksFor(0, run, W)
          // mm:ss labels are wider than All Commands' m:ss: a tick too close
          // to the session's end gives way to the end's label.
          .filter((s, i, all) => i === all.length - 1 || ((run - s) / run) * W >= 56)
          .map((s, i, all) => (
          <span key={`${i}-${s}`} className={cx('tl-tick', i === 0 && 'is-first', i === all.length - 1 && 'is-last')}
            style={{ left: pct(s) }}>{fmtClock(s)}</span>
        ))}
      </div>
    </section>
  )
}
