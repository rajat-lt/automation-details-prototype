// Comments on failed commands (v3 item 6), one per command, keyed
// "{test}:{command}". A small store, like the playhead's, because three
// surfaces read it: the command's details, the timeline's comment marks and
// the failure popovers. Comments last until a reload, like renames.
//
// GAP: mock-data.md has no comments. The one seeded below is written for the
// mock, by the signed-in user (Ritika Sharma, the top bar's avatar), so the
// read state, the timeline mark and editing can be reviewed without typing.
import { useSyncExternalStore } from 'react'
import { NOW } from './data.js'

let state = {
  't-01:c6': {
    text: 'The grid node restarted during this call. It passes on rerun, so treat it as infrastructure and leave the test as is.',
    by: 'Ritika Sharma',
    at: new Date(NOW - 2 * 60 * 60 * 1000),
  },
}
const subs = new Set()
const emit = () => subs.forEach(f => f())
const subscribe = f => { subs.add(f); return () => subs.delete(f) }

export const commentKey = (testId, cmdId) => `${testId}:${cmdId}`
export const useComment = key => useSyncExternalStore(subscribe, () => state[key])
export const useComments = () => useSyncExternalStore(subscribe, () => state)
export function saveComment(key, text, by) {
  state = { ...state, [key]: { text, by, at: new Date() } }
  emit()
}

/* "Add comment" or "Edit comment" from a failure popover or the video's
   command line: the All Commands tab opens that command's details with the
   comment box focused (v3 item 4). */
const reqSubs = new Set()
export function onCommentRequest(f) { reqSubs.add(f); return () => reqSubs.delete(f) }
export function requestComment(testId, cmdId) { reqSubs.forEach(f => f({ testId, cmdId, n: Date.now() })) }
