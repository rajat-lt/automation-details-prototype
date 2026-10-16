// Range timeline: brief items 7 and 8. Built custom and flagged: LTSlider has
// one thumb and a % suffix, LTTimeline is a vertical activity rail, and
// nothing else covers a two-handle seek bar with failure markers
// (automation-details.md §9). Colours are measured from screenshot 6: the bar
// is #80ccff and failures are danger.emphasis at about 50% over it.
import React, { useRef, useState } from 'react'
import { usePlayback, jumpTo } from './playback.js'
import { fmtClock } from './format.js'
import { cx } from './lt.jsx'

const MIN_GAP = 5 // seconds between the two handles

function ticksFor(duration, width) {
  const steps = [5, 10, 15, 20, 30, 60, 120, 300]
  const fits = Math.max(2, Math.floor(width / 56))
  const step = steps.find(s => duration / s <= fits) ?? 600
  const out = []
  for (let s = 0; s <= duration + 0.001; s += step) out.push(s)
  if (out[out.length - 1] < duration - step * 0.4) out.push(duration)
  else out[out.length - 1] = duration
  return out
}

function Handle({ which, value, min, max, onChange, onCommit, trackRef, duration }) {
  const drag = useRef(false)
  const toTime = x => {
    const r = trackRef.current.getBoundingClientRect()
    return Math.min(1, Math.max(0, (x - r.left) / r.width)) * duration
  }
  return (
    <span role="slider" tabIndex={0} className={cx('tl-handle', `tl-handle--${which}`)}
      style={{ left: `${(value / duration) * 100}%` }}
      aria-label={which === 'start' ? 'Timeline start' : 'Timeline end'}
      aria-valuemin={Math.round(min)} aria-valuemax={Math.round(max)} aria-valuenow={Math.round(value)}
      aria-valuetext={fmtClock(value)}
      onPointerDown={e => { e.stopPropagation(); drag.current = true; e.currentTarget.setPointerCapture(e.pointerId) }}
      onPointerMove={e => { if (drag.current) onChange(Math.min(max, Math.max(min, toTime(e.clientX)))) }}
      onPointerUp={() => { if (drag.current) { drag.current = false; onCommit?.() } }}
      onClick={e => e.stopPropagation()}
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

export function RangeTimeline({ duration, segments, range, onRange, onSeek }) {
  const trackRef = useRef(null)
  const time = usePlayback(s => s.time)
  const [hover, setHover] = useState(null)
  const [width, setWidth] = useState(600)
  const [start, end] = range
  const pct = s => `${(s / duration) * 100}%`
  const measure = el => { if (el && el.offsetWidth && el.offsetWidth !== width) setWidth(el.offsetWidth) }
  const timeAt = x => {
    const r = trackRef.current.getBoundingClientRect()
    return Math.min(1, Math.max(0, (x - r.left) / r.width)) * duration
  }
  return (
    <div className="tl" ref={measure}>
      {/* The bar seeks the video (item 7). A click on a failure seeks to the
          failure's first command. The keyboard route is the two handles plus
          Previous and Next failed command. */}
      <div ref={trackRef} className="tl-track"
        onPointerMove={e => setHover(timeAt(e.clientX))} onPointerLeave={() => setHover(null)}
        onClick={e => {
          const t = timeAt(e.clientX)
          const seg = segments.find(s => t >= s.start - duration * 0.004 && t <= s.end + duration * 0.004)
          if (seg) onSeek(seg.start, seg.ids[0])
          else onSeek(t, null)
        }}>
        <span className="tl-base" />
        <span className="tl-range" style={{ left: pct(start), width: pct(end - start) }} />
        {segments.map((s, i) => (
          <span key={i} className="tl-fail" aria-hidden="true"
            style={{ left: pct(s.start), width: `max(4px, ${pct(s.end - s.start)})` }} />
        ))}
        <span className="tl-playhead" style={{ left: pct(time) }} aria-hidden="true" />
        {hover != null && (
          <span className="tl-hover" style={{ left: pct(hover) }} aria-hidden="true">{fmtClock(hover)}</span>
        )}
        <Handle which="start" value={start} min={0} max={end - MIN_GAP} duration={duration} trackRef={trackRef}
          onChange={v => onRange([v, end])} />
        <Handle which="end" value={end} min={start + MIN_GAP} max={duration} duration={duration} trackRef={trackRef}
          onChange={v => onRange([start, v])} />
      </div>
      <div className="tl-axis" aria-hidden="true">
        {ticksFor(duration, width).map((s, i, a) => (
          <span key={s} className={cx('tl-tick', i === 0 && 'is-first', i === a.length - 1 && 'is-last')}
            style={{ left: pct(s) }}>{fmtClock(s)}</span>
        ))}
      </div>
    </div>
  )
}

export { jumpTo }
