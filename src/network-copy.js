// Request actions (v6 item 14): what a request copies as, for the row menu
// and the details panel's menu. The forms follow what browser developer
// tools copy [proposed]: cURL in bash quoting, fetch as a call with its
// headers, HAR as a log holding this one request. v7 item 13: the headers
// and the response left the menus; each copies from its own tab, the
// headers as tables (network-detail.jsx).
import { toHar } from './network-data.js'
import { fmtClock } from './format.js'

/** A request named for a sentence: `rum at 01:36` (several share a name). */
export const where = q => `${q.name} at ${fmtClock(q.start)}`

/** v6 item 28: the request's own link, which opens the test on this request. */
export const requestHref = (testId, id) => `${window.location.origin}${window.location.pathname}#/${testId}/network/${id}`

// Single quotes, with any quote inside closed, escaped and reopened.
const sq = s => `'${String(s).replace(/'/g, `'\\''`)}'`

export function asCurl(q) {
  const parts = [`curl ${sq(q.url)}`]
  if (q.method !== 'GET') parts.push(`-X ${q.method}`)
  for (const [k, v] of q.requestHeaders) parts.push(`-H ${sq(`${k}: ${v}`)}`)
  if (q.payload.kind !== 'none') parts.push(`--data-raw ${sq(q.payload.text)}`)
  return parts.join(' \\\n  ')
}

// The headers a page's script may not set (the Fetch standard's forbidden
// request-header names), left out of the fetch call; the referrer goes in
// its own field.
const FORBIDDEN = new Set(['accept-charset', 'accept-encoding', 'access-control-request-headers',
  'access-control-request-method', 'connection', 'content-length', 'cookie', 'cookie2', 'date', 'dnt', 'expect', 'host',
  'keep-alive', 'origin', 'referer', 'set-cookie', 'te', 'trailer', 'transfer-encoding', 'upgrade', 'via'])
export function asFetch(q) {
  const headers = Object.fromEntries(q.requestHeaders.filter(([k]) =>
    !FORBIDDEN.has(k) && !k.startsWith('proxy-') && !k.startsWith('sec-')))
  const referrer = q.requestHeaders.find(([k]) => k === 'referer')?.[1]
  const init = {
    headers,
    ...(referrer ? { referrer } : {}),
    body: q.payload.kind === 'none' ? null : q.payload.text,
    method: q.method,
  }
  return `fetch(${JSON.stringify(q.url)}, ${JSON.stringify(init, null, 2)});`
}

export const asHar = (test, log, q) => JSON.stringify(toHar(test, log, [q]), null, 2)

/* Every copy, in the order the menus list them. A copy that has nothing to
   give stays in the menu, inactive, saying when it becomes available
   (guidelines/ltactionmenu.md). Fetch refuses the CONNECT method, and a
   tunnel has no request to replay, so cURL and fetch wait for GET and POST. */
export function copyOptions(q) {
  const tunnel = q.method === 'CONNECT'
  return [
    { value: 'link', label: 'Copy link' },
    { divider: true },
    { value: 'curl', label: 'Copy as cURL', inactive: tunnel, description: tunnel ? 'Available for GET and POST requests' : undefined },
    { value: 'fetch', label: 'Copy as fetch', inactive: tunnel, description: tunnel ? 'Available for GET and POST requests' : undefined },
    { value: 'har', label: 'Copy as HAR' },
  ]
}

/** The text a copy puts on the clipboard, and its toasts: the trigger's
    term, past tense, and a failure that says what to do (ux-text-guidelines.md §3). */
export function copyFor(value, { test, log, q }) {
  const w = where(q)
  const as = (text, form) => ({ text, done: `${w} copied as ${form}.`, failed: `${w} failed to copy as ${form}. Try again.` })
  const of = (text, what) => ({ text, done: `${what} copied.`, failed: `${what} failed to copy. Try again.` })
  switch (value) {
    case 'link': return of(requestHref(test.id, q.id), `Link to ${w}`)
    case 'curl': return as(asCurl(q), 'cURL')
    case 'fetch': return as(asFetch(q), 'fetch')
    case 'har': return as(asHar(test, log, q), 'HAR')
    default: return null
  }
}
