// One playhead shared by the video, its control bar and the timeline.
// `jump` is the event behind brief item 9: whenever the video jumps to a time,
// the command at that time is revealed and highlighted. Continuous playback
// never emits it, so the list does not scroll under the reader.
import { useEffect, useRef, useSyncExternalStore } from 'react'

function createStore(initial) {
  let state = initial
  const subs = new Set()
  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
      subs.forEach(f => f())
    },
    subscribe(f) { subs.add(f); return () => subs.delete(f) },
  }
}

export const playback = createStore({ time: 0, playing: false, rate: 1, duration: 0 })
export const usePlayback = sel => useSyncExternalStore(playback.subscribe, () => sel(playback.get()))

const jumpSubs = new Set()
export function onJump(f) { jumpSubs.add(f); return () => jumpSubs.delete(f) }

/** Seek and tell the list. `commandId` pins the highlight to a specific row. */
export function jumpTo(time, { commandId = null, source = 'seek' } = {}) {
  const { duration } = playback.get()
  const t = Math.min(Math.max(0, time), duration || time)
  playback.set({ time: t })
  jumpSubs.forEach(f => f({ time: t, commandId, source }))
}

export function seekSilently(time) {
  const { duration } = playback.get()
  playback.set({ time: Math.min(Math.max(0, time), duration || time) })
}

// Chromium reports "macOS", older engines "MacIntel": match either, any case.
export const isMac = /mac|iphone|ipad/i.test(navigator.userAgentData?.platform ?? navigator.platform ?? '')

/**
 * v2 item 14: Cmd (Mac) or Ctrl (Windows) plus the mouse wheel seeks, over
 * the element `ref` points at: the video and the timeline [proposed scope].
 * Elsewhere Ctrl and the wheel keep zooming the page, which low-vision users
 * rely on. One wheel notch (about 100px) moves 1 second; down or right is
 * later. The list follows once the wheel stops, so it does not scroll under
 * every notch.
 */
export function useWheelSeek(ref) {
  const settle = useRef(0) // outlives re-renders, so the final jump still fires
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = e => {
      if (!(isMac ? e.metaKey : e.ctrlKey)) return
      e.preventDefault()
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1
      const d = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit
      seekSilently(playback.get().time + d / 100)
      clearTimeout(settle.current)
      settle.current = setTimeout(() => jumpTo(playback.get().time, { source: 'wheel' }), 250)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  })
  useEffect(() => () => clearTimeout(settle.current), [])
}
