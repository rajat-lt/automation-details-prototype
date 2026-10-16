// Splitters (brief item 14) and small layout hooks. No component covers a
// resizable pane, so the splitter is built custom and flagged
// (automation-details.md §9). Drag alone is not accessible
// (guidelines/README.md §10), so every splitter is a focusable separator that
// arrow keys resize, Home and End take to its limits, and Enter or a double
// click restore to its default.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cx } from './lt.jsx'

export function usePref(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(`adp:${key}`); return s == null ? initial : JSON.parse(s) } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(`adp:${key}`, JSON.stringify(v)) } catch { /* private mode */ } }, [key, v])
  return [v, setV]
}

export function useSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // Measure now, so the first render after mount already uses the real
    // size, then keep it current.
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [ref])
  return size
}

/**
 * orientation "vertical": a vertical bar that resizes a width.
 * orientation "horizontal": a horizontal bar that resizes a height.
 * `invert`: the pane being sized sits after the bar (right or below), so
 * dragging toward it shrinks it.
 */
export function Splitter({ orientation = 'vertical', value, min, max, defaultValue, onChange, label, invert = false }) {
  const start = useRef(null)
  const [dragging, setDragging] = useState(false)
  const clamp = v => Math.round(Math.min(max, Math.max(min, v)))
  const horiz = orientation === 'horizontal'
  return (
    <div role="separator" tabIndex={0} aria-label={label} aria-orientation={orientation}
      aria-valuenow={Math.round(value)} aria-valuemin={Math.round(min)} aria-valuemax={Math.round(max)}
      className={cx('splitter', `splitter--${orientation}`, dragging && 'is-dragging')}
      onPointerDown={e => {
        e.preventDefault()
        start.current = { p: horiz ? e.clientY : e.clientX, v: value }
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
      }}
      onPointerMove={e => {
        if (!start.current) return
        const d = (horiz ? e.clientY : e.clientX) - start.current.p
        onChange(clamp(start.current.v + (invert ? -d : d)))
      }}
      onPointerUp={() => { start.current = null; setDragging(false) }}
      onDoubleClick={() => onChange(clamp(defaultValue))}
      onKeyDown={e => {
        const big = e.shiftKey ? 64 : 16
        const grow = horiz ? (invert ? 'ArrowUp' : 'ArrowDown') : (invert ? 'ArrowLeft' : 'ArrowRight')
        const shrink = horiz ? (invert ? 'ArrowDown' : 'ArrowUp') : (invert ? 'ArrowRight' : 'ArrowLeft')
        let v = null
        if (e.key === grow) v = value + big
        if (e.key === shrink) v = value - big
        if (e.key === 'Home') v = min
        if (e.key === 'End') v = max
        if (e.key === 'Enter') v = defaultValue
        if (v != null) { e.preventDefault(); onChange(clamp(v)) }
      }}>
      <span className="splitter__line" aria-hidden="true" />
    </div>
  )
}
