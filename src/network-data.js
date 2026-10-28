// Network logs for the Network tab (v5, 27 Oct 2026). Every test with capture
// on gets a HAR-shaped log built from its own commands: a page load for each
// Navigate To, and for the results page its search submits to, so the log
// lines up with the commands and the video.
//
// GAP (automation-details.md §9): mock-data.md has no network values. File
// names, types, sizes and durations come from the brief's two screenshots
// (screenshot 1 where a name appears there, else screenshot 2). The host is
// the mock test's own site (www.airbnb.com, from v1's screenshots); start
// offsets, later pages' sizes, headers and bodies are written for the mock.
// Phases are HAR 1.2's timings (blocked, dns, connect, ssl, send, wait,
// receive), with connect kept apart from its SSL part here; the HAR export
// adds them back together, as HAR's `connect` includes `ssl`.
import { TESTS, getDetail, networkOn, fullHarOn } from './data.js'

const HOST = 'www.airbnb.com'
const ORIGIN = `https://${HOST}`

/* The first page a test loads, after its document. Columns: path, the Type
   column's value (the MIME subtype, as the product shows it), the MIME type,
   the type filter, bytes, duration in ms, and the start in ms after the
   document starts. */
const FIRST_LOAD = [
  ['/speculation', 'speculationrules+json', 'application/speculationrules+json', 'other', 151, 36, 104],
  ['/static/css/c96ade92e42fd6f2.css', 'css', 'text/css', 'css', 543500, 52, 61],
  ['/static/css/9de5c062541a58ac.css', 'css', 'text/css', 'css', 4000, 42.58, 62],
  ['/static/css/e1b8aad9cab6c068.css', 'css', 'text/css', 'css', 18300, 37, 63],
  ['/static/js/rocket-loader.min.js', 'javascript', 'application/javascript', 'js', 3800, 44.1, 70],
  ['/static/js/16841-6b4fc1c25f57d01c.js', 'javascript', 'application/javascript', 'js', 3900, 50.36, 78],
  ['/static/js/30802-4295a4378d477cbe.js', 'javascript', 'application/javascript', 'js', 3900, 50.41, 79],
  ['/static/js/_buildManifest.js', 'javascript', 'application/javascript', 'js', 66000, 51.13, 82],
  ['/static/js/scheduler.min.js', 'javascript', 'application/javascript', 'js', 9900, 51.42, 84],
  ['/static/js/c0799804-341225c7afdd1296.js', 'javascript', 'application/javascript', 'js', 18700, 51.86, 86],
  ['/static/js/_app-fb6ea908a8e8fe2c.js', 'javascript', 'application/javascript', 'js', 428, 52.02, 88],
  ['/static/js/65362-4dc03b9d04ca6059.js', 'javascript', 'application/javascript', 'js', 4300, 52.13, 90],
  ['/static/js/48230-91e605fa905e268f.js', 'javascript', 'application/javascript', 'js', 2200, 52.55, 91],
  ['/static/media/4c9affa5bc8f420e-s.p.woff2', 'woff2', 'font/woff2', 'font', 24000, 47.29, 148],
  ['/images/whatnew.png', 'webp', 'image/webp', 'img', 430, 65, 236],
  ['/favicon_black.svg', 'svg+xml', 'image/svg+xml', 'img', 230, 29.63, 412],
  ['/favicon_white.svg', 'svg+xml', 'image/svg+xml', 'img', 217, 32.16, 414],
  ['/favicon.ico', 'vnd.microsoft.icon', 'image/vnd.microsoft.icon', 'img', 24600, 34.77, 418],
]

/* Every later page: the browser revalidates what it already holds (304, a
   few hundred bytes over the wire) and fetches the rest again. Columns: path,
   start in ms after the document starts, status. */
const REPEAT_LOAD = [
  ['/speculation', 98, 200],
  ['/static/css/c96ade92e42fd6f2.css', 58, 304],
  ['/static/css/9de5c062541a58ac.css', 59, 304],
  ['/static/css/e1b8aad9cab6c068.css', 60, 304],
  ['/static/js/_app-fb6ea908a8e8fe2c.js', 72, 304],
  ['/static/js/_buildManifest.js', 74, 304],
  ['/images/whatnew.png', 214, 200],
  ['/favicon.ico', 380, 304],
]
const BY_PATH = Object.fromEntries(FIRST_LOAD.map(a => [a[0], a]))

// Document sizes: screenshot 2 for the first page (215.5 KB); the rest are mock.
const DOC_BYTES = { '/': 215500, '/s/Goa/homes': 198400, '/book/stays': 176200, '/login': 142700, '/rooms/plus': 231900 }

/* The phases, in time order, with the names the Timing tab and the popover
   use. `color` and `border` are Chrome DevTools' (src/devtools-phases.css,
   spec C48): DevTools draws queueing white with a light grey border, and
   content download with a brighter blue border. */
export const PHASES = [
  { key: 'blocked', label: 'Queueing', color: 'var(--net-queueing)', border: 'var(--net-queueing-border)' },
  { key: 'dns', label: 'DNS lookup', color: 'var(--net-dns)' },
  { key: 'connect', label: 'Initial connection', color: 'var(--net-connect)' },
  { key: 'ssl', label: 'SSL', color: 'var(--net-ssl)' },
  { key: 'send', label: 'Request sent', color: 'var(--net-send)' },
  { key: 'wait', label: 'Waiting (TTFB)', color: 'var(--net-wait)' },
  { key: 'receive', label: 'Content download', color: 'var(--net-receive)', border: 'var(--net-receive-border)' },
]
/** A phase's fill, with DevTools' border where it has one. */
export const phaseStyle = p => ({ background: p.color, boxShadow: p.border ? `inset 0 0 0 1px ${p.border}` : undefined })

const STATUS_TEXT = { 200: 'OK', 204: 'No Content', 304: 'Not Modified', 404: 'Not Found', 500: 'Internal Server Error' }

/* Seeded RNG, the same shape as data.js's, so every reload shows the same log. */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const round2 = v => Math.round(v * 100) / 100

/* An asset's ETag: the same on every page, so a 304 sends back the tag the
   first load received. */
function etagFor(path) {
  let h = 2166136261
  for (const ch of path) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return `"${(h >>> 0).toString(16).padStart(8, '0')}"`
}

/* Splits a request's duration into its phases. The first request on a new
   connection pays for the connection and SSL, and the very first one for DNS
   too (cached after that); the rest goes to waiting and downloading, more of
   it to downloading the bigger the body, unless `wait` fixes the wait for the
   first byte (v6's slow requests). The duration is the sum. */
function phases(r, total, { fresh, dnsFresh, bytes, doc, wait }) {
  const blocked = doc ? 0.6 + r() * 0.8 : 0.3 + r() * 2.2
  const dns = dnsFresh ? 9 + r() * 9 : 0
  const connect = fresh ? 14 + r() * 10 : 0
  const ssl = fresh ? 11 + r() * 9 : 0
  const send = 0.06 + r() * 0.3
  const rest = Math.max(total - (blocked + dns + connect + ssl + send), 4 + r() * 6)
  const share = Math.min(0.75, Math.max(0.12, bytes / (bytes + 60000)))
  const p = { blocked, dns, connect, ssl, send, wait: wait != null ? Math.min(wait, rest - 1) : rest * (1 - share), receive: 0 }
  for (const k in p) p[k] = round2(p[k])
  // Downloading takes what is left, so the rounded phases add up exactly.
  p.receive = round2(Math.max(total, blocked + dns + connect + ssl + send + rest) - (p.blocked + p.dns + p.connect + p.ssl + p.send + p.wait))
  return p
}

/* Bodies written for the mock, short and plainly generic. A run without
   network.full.har kept none of them (v6 item 15). */
const SVG_BLACK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6"/></svg>'
const SVG_WHITE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#fff" stroke="#d0d7de"/></svg>'
function bodyFor(q, full) {
  if (q.method === 'CONNECT' || q.status === 204 || q.status === 304) return { kind: 'empty' }
  if (!full) return { kind: 'uncaptured' }
  if (q.status === 404) return { kind: 'text', lang: 'html', text: '<!doctype html>\n<title>404 Not Found</title>\n<h1>Not Found</h1>' }
  if (q.status === 500) return { kind: 'text', lang: 'plain', text: 'Internal Server Error' }
  if (q.category === 'doc') {
    return { kind: 'text', lang: 'html', text: [
      '<!doctype html>', '<html lang="en">', '  <head>', '    <meta charset="utf-8">',
      '    <link rel="stylesheet" href="/static/css/c96ade92e42fd6f2.css">',
      '    <script type="speculationrules" src="/speculation"></script>', '  </head>', '  <body>',
      '    <div id="root"></div>', '    <script src="/static/js/_app-fb6ea908a8e8fe2c.js" defer></script>',
      '  </body>', '</html>'].join('\n') }
  }
  if (q.type === 'speculationrules+json') {
    return { kind: 'text', lang: 'json', text: JSON.stringify({ prefetch: [{ source: 'document', where: { href_matches: '/*' }, eagerness: 'moderate' }] }, null, 2) }
  }
  if (q.category === 'css') return { kind: 'text', lang: 'css', text: 'body{margin:0;font-family:system-ui,sans-serif}\n.header{display:flex;align-items:center;gap:16px}\n.card{border-radius:12px}' }
  if (q.category === 'js') return { kind: 'text', lang: 'js', text: `(self.chunks=self.chunks||[]).push([["${q.name.replace(/\.js$/, '')}"],{}]);` }
  if (q.type === 'svg+xml') return { kind: 'text', lang: 'xml', text: q.name.includes('white') ? SVG_WHITE : SVG_BLACK }
  return { kind: 'binary' }
}

/* v6 items 11 and 20: what an image response looks like. The SVGs are their
   own bodies; the icon and the banner are stand-ins drawn for the mock, since
   the screenshots give only their names and sizes (spec §9). A 304 shows the
   copy the browser already had. */
const svgUri = svg => `data:image/svg+xml,${encodeURIComponent(svg)}`
const STAND_INS = {
  '/favicon.ico': { width: 32, height: 32, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#59636e"/><circle cx="16" cy="16" r="7" fill="#fff"/></svg>' },
  '/images/whatnew.png': { width: 120, height: 40, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" rx="8" fill="#ddf4ff"/><circle cx="20" cy="20" r="8" fill="#218bff"/><rect x="36" y="14" width="68" height="5" rx="2.5" fill="#0969da"/><rect x="36" y="23" width="48" height="4" rx="2" fill="#80ccff"/></svg>' },
}
function previewFor(q, full) {
  if (!full || !q.mime.startsWith('image/') || (q.status !== 200 && q.status !== 304)) return null
  const svg = q.type === 'svg+xml' ? (q.name.includes('white') ? SVG_WHITE : SVG_BLACK) : STAND_INS[q.path]?.svg
  if (!svg) return null
  const size = q.type === 'svg+xml' ? { width: 32, height: 32 } : STAND_INS[q.path]
  return { src: svgUri(svg), width: size.width, height: size.height, cached: q.status === 304, standIn: q.type !== 'svg+xml' }
}

function requestHeaders(q) {
  if (q.method === 'CONNECT') return [['host', q.url]]
  const accept = q.category === 'doc' ? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    : q.category === 'css' ? 'text/css,*/*;q=0.1'
      : q.category === 'img' ? 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' : '*/*'
  const h = [['accept', accept], ['accept-encoding', 'gzip, deflate, br'], ['accept-language', 'en-US,en;q=0.9']]
  if (q.method === 'POST') h.push(['content-type', 'application/json'])
  if (q.status === 304) h.push(['if-none-match', etagFor(q.path)])
  if (q.category !== 'doc') h.push(['referer', q.page])
  return h
}

function responseHeaders(q, startedAt) {
  if (q.method === 'CONNECT') return []
  const h = []
  if (q.status !== 204 && q.status !== 304) {
    h.push(['content-type', /^text\/|javascript|json/.test(q.mime) ? `${q.mime}; charset=utf-8` : q.mime])
    h.push(['content-length', String(q.bytes)])
  }
  h.push(['cache-control', q.category === 'doc' || q.method === 'POST' || q.status >= 400 ? 'no-cache, no-store' : 'public, max-age=31536000, immutable'])
  h.push(['date', new Date(startedAt + q.start * 1000).toUTCString()])
  if (q.method === 'GET' && q.category !== 'doc' && q.status < 400) h.push(['etag', etagFor(q.path)])
  return h
}

/** Builds the log for one test. Memoized: a log never changes. */
const cache = new Map()
export function networkFor(testId) {
  if (cache.has(testId)) return cache.get(testId)
  const t = TESTS.find(x => x.id === testId)
  const detail = getDetail(testId)
  if (!t || !detail || !networkOn(t) || t.status === 'queued') {
    const none = { on: !!t && networkOn(t), requests: [], pages: [], startedAt: 0 }
    cache.set(testId, none)
    return none
  }
  const r = rng(parseInt(testId.slice(2), 10) * 104729)
  const startedAt = t.updatedAt.getTime() - t.durationSec * 1000
  const full = fullHarOn(t)

  // The pages this test loads, in order: every Navigate To, and the results
  // page a search submits to (data.js's Get Current URL answers it).
  const pages = []
  for (const c of detail.commands) {
    if (c.name === 'Navigate To' && c.value) pages.push({ url: new URL(c.value).href, at: c.at })
    if (c.name === 'Click Element' && c.target === 'submit') pages.push({ url: `${ORIGIN}/s/Goa/homes`, at: c.at + 0.15 })
  }

  const requests = []
  let lastEnd = -Infinity
  let dnsDone = false
  const push = (o, timings) => {
    const duration = round2(PHASES.reduce((s, p) => s + timings[p.key], 0))
    const q = {
      id: `n${requests.length}`, host: HOST, path: o.method === 'CONNECT' ? '' : new URL(o.url).pathname,
      statusText: STATUS_TEXT[o.status], ...o, timings, duration, end: o.start + duration / 1000,
    }
    q.requestHeaders = requestHeaders(q)
    q.responseHeaders = responseHeaders(q, startedAt)
    q.body = bodyFor(q, full)
    q.preview = previewFor(q, full)
    requests.push(q)
    return q
  }
  const add = ({ ms, wait, ...o }) => {
    // A request after 30 idle seconds opens a new connection: through the
    // capture proxy it starts with a CONNECT tunnel, listed only with Show
    // CONNECT (spec §4e). The tunnel has no DNS or SSL of its own.
    const fresh = o.start - lastEnd > 30
    if (fresh) {
      push({ method: 'CONNECT', url: `${HOST}:443`, name: `${HOST}:443`, status: 200, statusText: 'Connection established',
        type: 'tunnel', mime: '', category: 'connect', bytes: 0, resourceBytes: 0, start: o.start, page: o.page, pageIndex: o.pageIndex,
        payload: { kind: 'none' } },
      { blocked: round2(0.2 + r()), dns: 0, connect: round2(6 + r() * 6), ssl: 0, send: round2(0.05 + r() * 0.1), wait: round2(4 + r() * 8), receive: 0 })
    }
    const timings = phases(r, ms, { fresh, dnsFresh: fresh && !dnsDone, bytes: o.bytes, doc: o.category === 'doc', wait })
    if (fresh) dnsDone = true
    const q = push(o, timings)
    lastEnd = Math.max(lastEnd, q.end)
    return q
  }

  pages.forEach((pg, pageIndex) => {
    const path = new URL(pg.url).pathname
    const first = pageIndex === 0
    const docStart = pg.at + 0.04 + r() * 0.03
    const docBytes = DOC_BYTES[path] ?? 180000
    const base = { page: pg.url, pageIndex, payload: { kind: 'none' } }
    // v6 item 9: the search results page waits about 0.65s for its first
    // byte, past the 500ms slow limit [mock].
    const slowDoc = path === '/s/Goa/homes'
    const doc = add({ ...base, method: 'GET', url: pg.url, name: path === '/' ? HOST : path.split('/').pop(), status: 200,
      type: 'html', mime: 'text/html', category: 'doc', bytes: docBytes, resourceBytes: docBytes,
      ms: slowDoc ? 700 + r() * 30 : first ? 68 : 60 + r() * 30, wait: slowDoc ? 640 + r() * 20 : undefined, start: docStart })
    pg.docId = doc.id
    // A later page's files start once its document's first byte is in; the
    // first page keeps the screenshots' offsets.
    const T = doc.timings
    const firstByte = docStart + (T.blocked + T.dns + T.connect + T.ssl + T.send + T.wait) / 1000
    const assets = first ? FIRST_LOAD.map(a => [a, a[6], 200]) : REPEAT_LOAD.map(([p, offset, status]) => [BY_PATH[p], offset, status])
    for (const [[p, type, mime, category, bytes, ms], offset, status] of assets) {
      // The login page's banner image is gone: a 404 page answers it (spec §4e).
      const missing = p === '/images/whatnew.png' && path === '/login'
      const code = missing ? 404 : status
      add({ ...base, method: 'GET', url: `${ORIGIN}${p}`, name: p.split('/').pop(), status: code,
        // The filter goes by what was asked for, so the 404 stays under Img;
        // Type shows what came back.
        type: missing ? 'html' : type, mime: missing ? 'text/html' : mime, category,
        bytes: code === 304 ? 250 + Math.floor(r() * 20) : missing ? 1200 : bytes, resourceBytes: missing ? 1200 : bytes,
        // The first page keeps the screenshots' durations; later pages vary.
        ms: code === 304 ? 14 + r() * 6 : first ? ms : ms * (0.74 + r() * 0.12),
        start: (first ? docStart : firstByte) + (offset + r() * 6) / 1000 })
    }
    // RUM beacons: two on the first page (screenshot 1's 25.26ms and 27.06ms),
    // one on every later page. The checkout page's one fails (spec §4e), and
    // only after waiting over a second for its answer (v6 item 9) [mock].
    const beacons = first ? [[2.1, 25.26, 'load'], [9.8, 27.06, 'hidden']] : [[2.4, 24 + r() * 6, 'load']]
    for (const [after, ms, event] of beacons) {
      const failed = path === '/book/stays'
      add({ ...base, method: 'POST', url: `${ORIGIN}/rum`, name: 'rum', status: failed ? 500 : 204,
        type: 'plain', mime: 'text/plain', category: 'other', bytes: failed ? 21 : 0, resourceBytes: failed ? 21 : 0,
        ms: failed ? 1240 + r() * 20 : ms, wait: failed ? 1180 + r() * 10 : undefined, start: docStart + after + r() * 0.2,
        payload: { kind: 'json', text: JSON.stringify({ page: pg.url, event }, null, 2) } })
    }
  })

  requests.sort((a, b) => a.start - b.start)
  // v6 item 12: the command each request ran under: the one running when it
  // started, or else the last one before it (`cmdRunning` false).
  for (const q of requests) {
    let running = null, prev = null
    for (const c of detail.commands) {
      if (c.at > q.start + 1e-6) break
      prev = c
      if (q.start <= c.at + c.ms / 1000 + 1e-6) running = c
    }
    const c = running ?? prev
    q.cmdId = c?.id ?? null
    q.cmdIdx = c?.idx ?? -1
    q.cmdRunning = !!running
  }
  const log = { on: true, requests, pages, startedAt, full }
  cache.set(testId, log)
  return log
}

/* A HAR 1.2 file (spec §4e): the whole log, or the requests given (v6: the
   filtered ones, or one request), with the pages they belong to. HAR's
   connect includes SSL, and a phase that does not apply is -1. The browser,
   and each page's URL in `_url` (a custom field; PageXray, behind
   compare.sitespeed.io, reads it), name the run in an external viewer
   (v6 item 23), instead of the CONNECT tunnel that opens the log. */
export function toHar(t, log, requests = log.requests) {
  const iso = sec => new Date(log.startedAt + sec * 1000).toISOString()
  const used = new Set(requests.map(q => q.pageIndex))
  return {
    log: {
      version: '1.2',
      creator: { name: 'LambdaTest automation details prototype', version: '6' },
      browser: { name: t.browser, version: t.browserVersion },
      pages: log.pages.map((p, i) => ({ startedDateTime: iso(p.at), id: `page_${i + 1}`, title: p.url, _url: p.url, pageTimings: {} }))
        .filter((_, i) => used.has(i)),
      entries: requests.map(q => ({
        pageref: `page_${q.pageIndex + 1}`,
        startedDateTime: iso(q.start),
        time: q.duration,
        request: {
          method: q.method, url: q.url, httpVersion: q.method === 'CONNECT' ? 'HTTP/1.1' : 'HTTP/2',
          headers: q.requestHeaders.map(([name, value]) => ({ name, value })), queryString: [], cookies: [],
          headersSize: -1, bodySize: q.payload.kind === 'json' ? q.payload.text.length : 0,
          ...(q.payload.kind === 'json' ? { postData: { mimeType: 'application/json', text: q.payload.text } } : {}),
        },
        response: {
          status: q.status, statusText: q.statusText, httpVersion: q.method === 'CONNECT' ? 'HTTP/1.1' : 'HTTP/2',
          headers: q.responseHeaders.map(([name, value]) => ({ name, value })), cookies: [],
          content: { size: q.resourceBytes, mimeType: q.mime, ...(q.body.kind === 'text' ? { text: q.body.text } : {}) },
          redirectURL: '', headersSize: -1, bodySize: q.status === 204 || q.status === 304 ? 0 : q.bytes,
        },
        cache: {},
        timings: {
          blocked: q.timings.blocked, dns: q.timings.dns || -1, connect: (q.timings.connect + q.timings.ssl) || -1,
          ssl: q.timings.ssl || -1, send: q.timings.send, wait: q.timings.wait, receive: q.timings.receive,
        },
      })),
    },
  }
}
