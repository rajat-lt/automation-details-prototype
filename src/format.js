// Formats from design-context mock-data.md (§ Formats, § Relative or absolute
// timestamps). Anything mock-data.md does not define is marked GAP and listed
// in automation-details.md §9.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = n => String(n).padStart(2, '0')

/** `MMM DD, YYYY` — the only absolute date format. Zero-padded day. */
export function fmtDate(d) {
  return `${MONTHS[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`
}

/** `MMM DD, YYYY, HH:MM AM/PM`, 12-hour, zero-padded hour (`07:33 AM`). */
export function fmtDateTime(d) {
  const h = d.getHours() % 12 || 12
  return `${fmtDate(d)}, ${pad(h)}:${pad(d.getMinutes())} ${d.getHours() < 12 ? 'AM' : 'PM'}`
}

/**
 * Relative under 30 days, absolute after (mock-data.md). The examples there
 * spell the unit out ("Updated 4 days ago"), so hours and minutes do too.
 */
export function fmtRelative(d, now = new Date()) {
  const s = Math.max(0, (now - d) / 1000)
  const days = Math.floor(s / 86400)
  if (days > 30) return `on ${fmtDate(d)}`
  const unit = (n, w) => `${n} ${w}${n === 1 ? '' : 's'} ago`
  if (days >= 1) return unit(days, 'day')
  const hours = Math.floor(s / 3600)
  if (hours >= 1) return unit(hours, 'hour')
  return unit(Math.max(1, Math.floor(s / 60)), 'minute')
}

/** Duration `Mo D H M S`, leading units dropped: `3m 20s`, `14m 11s`, `11s`. */
export function fmtDuration(sec) {
  let s = Math.round(sec)
  const h = Math.floor(s / 3600); s -= h * 3600
  const m = Math.floor(s / 60); s -= m * 60
  const parts = []
  if (h) parts.push(`${h}h`)
  if (h || m) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

/** GAP: command durations under a second. Screenshot form: `20ms`, `400ms`. */
export function fmtMs(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${+(ms / 1000).toFixed(1)}s`
}

/**
 * GAP, one form since 17 Oct 2026: a moment in the run, everywhere it shows
 * (command rows, the timeline axis, the player, the logs, dialogs). The
 * brief's screenshots used three forms (`00:18`, `0:20`, `2:04`) and Rajat
 * chose to unify them. `m:ss` [proposed], the form video players use, and
 * `h:mm:ss` from an hour.
 */
export function fmtTime(sec) {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`
}

/**
 * A request's start in the run, `mm:ss` as v5 item 6 asks (`00:05`, `02:34`):
 * the brief names the form, so the Network tab's Start time keeps it, against
 * the page's `m:ss` everywhere else (spec C41).
 */
export function fmtClock(sec) {
  const s = Math.max(0, Math.floor(sec))
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
}

/** GAP: transfer sizes. The product's own form: `0 B`, `230 B`, `24.6 KB`, `2.2 MB`, 1,000 bytes to a KB. */
export function fmtBytes(n) {
  if (n < 1000) return `${Math.round(n)} B`
  if (n < 1e6) return `${+(n / 1000).toFixed(1)} KB`
  return `${+(n / 1e6).toFixed(1)} MB`
}

/**
 * GAP: a request's duration and its phases, to the hundredth of a
 * millisecond as the product's Network tab shows them (`25.26 ms`), in the
 * page's unit form (`20ms`). Two decimals always, so a column lines up, and
 * in milliseconds even past a second, as v6 item 18 asks: `0.12ms`,
 * `48.30ms`, `1251.88ms`.
 */
export function fmtMsExact(ms) {
  return `${ms.toFixed(2)}ms`
}

/**
 * A moment in the run as `mm:ss` (fmtClock) with `decimals` places of a
 * second [proposed]: the Network tab's zoomed-in windows (v6 item 6) and a
 * request's start in its timing popover (v6 item 27), where whole seconds
 * say too little. `00:42.4`, `00:42.406`.
 */
export function fmtClockFine(sec, decimals = 0) {
  const k = 10 ** decimals
  const t = Math.round(Math.max(0, sec) * k) / k
  const m = Math.floor(t / 60)
  const s = (t - m * 60).toFixed(decimals).padStart(decimals ? decimals + 3 : 2, '0')
  return `${pad(m)}:${s}`
}

/** The Network tab's time window, in v6 item 6's words: `00:40 to 00:50`, with tenths under 10 seconds and hundredths under 1. */
export function fmtWindow(a, b) {
  const span = b - a
  const d = span < 1 ? 2 : span < 10 ? 1 : 0
  return `${fmtClockFine(a, d)} to ${fmtClockFine(b, d)}`
}

/** A window of the run, with a spaced hyphen as mock-data.md's date ranges use: `1:13 - 1:25`. */
export function fmtTimeRange(a, b) {
  return `${fmtTime(a)} - ${fmtTime(b)}`
}

/** Numbers above 999: `k` and `M`, up to 2 decimals, zeros trimmed (9 Oct 2026). */
export function fmtCount(n) {
  if (n < 1000) return String(n)
  if (n < 1e6) return `${+(n / 1000).toFixed(2)}k`
  return `${+(n / 1e6).toFixed(2)}M`
}

/** Avatar initials (mock-data.md § People). */
export function initials(name) {
  const w = name.trim().split(/\s+/)
  return (w.length === 1 ? w[0][0] : w[0][0] + w[w.length - 1][0]).toUpperCase()
}

/** `firstname.lastname@company.com`; single-word names use the first name. */
export function emailFor(name, domain = 'dundermifflin.com') {
  const w = name.trim().toLowerCase().split(/\s+/)
  return `${w.length === 1 ? w[0] : `${w[0]}.${w[w.length - 1]}`}@${domain}`
}
