// Range timeline: brief items 7 and 8, v2 items 8, 9 and 14. Built custom and
// flagged: LTSlider has one thumb and a % suffix, LTTimeline is a vertical
// activity rail, and nothing else covers a two-handle seek bar with failure
// markers (automation-details.md §9). Colours are measured from screenshot 6:
// the bar is #80ccff and failures are danger.emphasis at about 50% over it.
//
// `view` is the stretch of the run the bar shows: the whole run, or the window
// a double-click on a failure zooms to (v2 item 9). The handles select a
// window inside it, and the list shows only that window.
import React, { useEffect, useRef, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { usePlayback, useWheelSeek } from './playback.js'
import { fmtTime } from './format.js'
import { cx } from './lt.jsx'
import { FailureHits } from './failure.jsx'
import { commentKey, useComments } from './comments.js'

const MIN_GAP = 5 // seconds between the two handles

// Shared with the Network tab's strip (v5), so its handles and axis behave
// as these do.
export function ticksFor(v0, v1, width) {
  const span = v1 - v0
  const steps = [1, 2, 5, 10, 15, 20, 30, 60, 120, 300, 600]
  const fits = Math.max(2, Math.floor(width / 56))
  const step = steps.find(s => span / s <= fits) ?? 1200
  const out = [v0]
  for (let s = Math.ceil(v0 / step) * step; s < v1; s += step) {
    if (s - v0 > step * 0.6 && v1 - s > step * 0.6) out.push(s)
  }
  out.push(v1)
  return out
}

export function Handle({ which, value, min, max, onChange, trackRef, view, fmt = fmtTime }) {
  const drag = useRef(false)
  const [v0, v1] = view
  const toTime = x => {
    const r = trackRef.current.getBoundingClientRect()
    return v0 + Math.min(1, Math.max(0, (x - r.left) / r.width)) * (v1 - v0)
  }
  return (
    <span role="slider" tabIndex={0} className={cx('tl-handle', `tl-handle--${which}`)}
      style={{ left: `${((value - v0) / (v1 - v0)) * 100}%` }}
      aria-label={which === 'start' ? 'Timeline start' : 'Timeline end'}
      aria-valuemin={Math.round(min)} aria-valuemax={Math.round(max)} aria-valuenow={Math.round(value)}
      aria-valuetext={fmt(value)}
      onPointerDown={e => { e.stopPropagation(); drag.current = true; e.currentTarget.setPointerCapture(e.pointerId) }}
      onPointerMove={e => { if (drag.current) onChange(Math.min(max, Math.max(min, toTime(e.clientX)))) }}
      onPointerUp={() => { drag.current = false }}
      onClick={e => e.stopPropagation()}
      onDoubleClick={e => e.stopPropagation()}
      onKeyDown={e => {
        const step = e.shiftKey ? 10 : 1
        let v = null
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = value + step
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = value - step
        if (e.key === 'Home') v = min
        if (e.key === 'End') v = max
        if (v != null) { e.preventDefault(); onChange(Math.min(max, Math.max(min, v))) }
      }}>
      <span className="tl-grip" aria-hidden="true" />
    </span>
  )
}

export function RangeTimeline({ view, segments, byId, range, onRange, onSeek, onZoom, testId, onStub }) {
  const comments = useComments()
  const trackRef = useRef(null)
  const time = usePlayback(s => s.time)
  const [hover, setHover] = useState(null)
  const [width, setWidth] = useState(600)
  const [zooming, setZooming] = useState(false)
  const [v0, v1] = view
  const [start, end] = range
  const pct = s => `${((s - v0) / (v1 - v0)) * 100}%`
  const measure = el => { if (el && el.offsetWidth && el.offsetWidth !== width) setWidth(el.offsetWidth) }
  const timeAt = x => {
    const r = trackRef.current.getBoundingClientRect()
    return v0 + Math.min(1, Math.max(0, (x - r.left) / r.width)) * (v1 - v0)
  }
  useWheelSeek(trackRef)
  // Animate a zoom so the user sees where the new window came from.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    setZooming(true)
    const t = setTimeout(() => setZooming(false), 320)
    return () => clearTimeout(t)
  }, [v0, v1])

  return (
    <div className={cx('tl', zooming && 'is-zooming')} ref={measure}>
      {/* The bar seeks the video (item 7). A click on a failure seeks to its
          first failed command; hovering one opens its popover (v2 item 8);
          a double-click zooms to it (v2 item 9). The keyboard route is the
          two handles plus Previous and Next failed command. */}
      <div ref={trackRef} className="tl-track"
        onPointerMove={e => setHover(timeAt(e.clientX))} onPointerLeave={() => setHover(null)}
        onClick={e => {
          const hit = e.target.closest?.('[data-seg]')
          const seg = hit ? segments[+hit.dataset.seg] : null
          if (seg) onSeek(seg.start, seg.ids[0])
          else onSeek(timeAt(e.clientX), null)
        }}>
        <span className="tl-clip">
          <span className="tl-base" />
          <span className="tl-range" style={{ left: pct(start), width: `${((end - start) / (v1 - v0)) * 100}%` }} />
          {segments.map((s, i) => (s.end < v0 || s.start > v1 ? null : (
            <span key={i} className="tl-fail" aria-hidden="true"
              style={{ left: pct(s.start), width: `max(4px, ${((s.end - s.start) / (v1 - v0)) * 100}%)` }} />
          )))}
          {time >= v0 && time <= v1 && <span className="tl-playhead" style={{ left: pct(time) }} aria-hidden="true" />}
        </span>
        {/* v3 item 6.2: a 10px comment mark over every stretch with a comment.
            Decorative and not clickable; the comment itself is in the
            command's details and the stretch's popover. */}
        {segments.map((s, i) => (s.end < v0 || s.start > v1 || !s.ids.some(id => comments[commentKey(testId, id)]) ? null : (
          <span key={`note-${i}`} className="tl-note" aria-hidden="true" style={{ left: pct((s.start + s.end) / 2) }}>
            <MessageSquare size={10} fill="currentColor" strokeWidth={1.5} />
          </span>
        )))}
        <FailureHits segments={segments} byId={byId} view={view} direction="bottom" onDoubleClick={onZoom}
          testId={testId} onStub={onStub} />
        {hover != null && (
          <span className="tl-hover" style={{ left: pct(hover) }} aria-hidden="true">{fmtTime(hover)}</span>
        )}
        <Handle which="start" value={start} min={v0} max={end - MIN_GAP} view={view} trackRef={trackRef}
          onChange={v => onRange([v, end])} />
        <Handle which="end" value={end} min={start + MIN_GAP} max={v1} view={view} trackRef={trackRef}
          onChange={v => onRange([start, v])} />
      </div>
      <div className="tl-axis" aria-hidden="true">
        {ticksFor(v0, v1, width).map((s, i, a) => (
          <span key={`${i}-${s}`} className={cx('tl-tick', i === 0 && 'is-first', i === a.length - 1 && 'is-last')}
            style={{ left: pct(s) }}>{fmtTime(s)}</span>
        ))}
      </div>
    </div>
  )
}
