// One playhead shared by the video, its control bar and the timeline.
// `jump` is the event behind brief item 9: whenever the video jumps to a time,
// the command at that time is revealed and highlighted. Continuous playback
// never emits it, so the list does not scroll under the reader.
import { useSyncExternalStore } from 'react'

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
