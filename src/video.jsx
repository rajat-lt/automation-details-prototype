// Video pane. There is no video component in lt-components (guidelines/README.md
// §10, base pattern open question 2), and there is no real recording here, so
// the "video" is a synthetic session replay drawn on canvas from the command
// data: the page the test is on, the element each command targets (blue when
// it passes, red when it fails), the text it types. The control bar started
// from the brief's screenshot 5 (conflict C3) and was rebuilt for v2 item 11:
// the seek bar on its own full-width row, playback on the left, the
// failed-command slot in the middle, the window controls on the right, and
// rare actions in a menu (automation-details.md §4b and §7b).
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Bug, Download, Ellipsis, GripHorizontal, Maximize, Minimize, PanelRight, PanelRightClose, PanelTop, PanelTopClose,
  Pause, PictureInPicture2, Play, RotateCwSquare,
} from 'lucide-react'
import {
  LTIconButton, LTButton, LTBlankSlate, LTSkeletonBox, LTCopyToClipboard, StatusGlyph, TruncText, cx, usePortalRoot,
} from './lt.jsx'
import { LTActionMenu } from './overlays.jsx'
import { playback, usePlayback, jumpTo, seekSilently, useWheelSeek } from './playback.js'
import { commandAt, failureAt, payloadText, statusLabel } from './data.js'
import { fmtTime } from './format.js'
import { FailureHits } from './failure.jsx'

const W = 960, H = 540

/* ---------------- renderer ---------------- */
let C = null
function colors() {
  if (C) return C
  const s = getComputedStyle(document.documentElement)
  const v = n => s.getPropertyValue(n).trim()
  C = {
    canvas: v('--canvas-default'), subtle: v('--canvas-subtle'), muted: v('--bg-muted'),
    neutral: v('--bg-neutral-subtle'), border: v('--border-default'), fg: v('--fg-default'),
    fgMuted: v('--fg-muted'), fgSubtle: v('--fg-subtle'), accent: v('--accent-emphasis'),
    accentSubtle: v('--accent-subtle'), danger: v('--danger-emphasis'), dangerFg: v('--danger-fg'),
    dangerSubtle: v('--danger-subtle'), onEmphasis: v('--fg-on-emphasis'), backdrop: v('--overlay-backdrop'),
    sans: v('--font-sans'),
  }
  return C
}

const PAGE = {
  blank: { url: 'about:blank', tab: 'New tab' },
  home: { url: 'https://www.airbnb.com', tab: 'Home' },
  search: { url: 'https://www.airbnb.com/s/Goa/homes', tab: 'Search results' },
  checkout: { url: 'https://www.airbnb.com/book/stays', tab: 'Checkout' },
  login: { url: 'https://www.airbnb.com/login', tab: 'Log in' },
  listing: { url: 'https://www.airbnb.com/rooms/plus', tab: 'Listing' },
}

const T = {
  address: [80, 33, 800, 18],
  search: [300, 68, 360, 32], submit: [626, 71, 26, 26],
  results: [240, 126, 696, 368], price: [32, 140, 84, 28],
  form: [16, 118, 512, 252], gift: [24, 144, 380, 32], apply: [416, 144, 100, 32],
  card: [24, 204, 492, 32], expiry: [24, 264, 238, 32], cvc: [278, 264, 238, 32], zip: [24, 324, 238, 32],
  reserve: [616, 370, 304, 40], modal: [330, 210, 300, 150],
  email: [354, 184, 252, 32], password: [354, 240, 252, 32], login: [354, 296, 252, 36], error: [354, 344, 252, 36],
  siteplan: [616, 164, 312, 188], tabLeasing: [616, 128, 92, 28], tabStandard: [714, 128, 92, 28], units: [24, 384, 912, 140],
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}
function box(ctx, [x, y, w, h], fill, stroke, r = 6) {
  rr(ctx, x, y, w, h, r)
  if (fill) { ctx.fillStyle = fill; ctx.fill() }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke() }
}
function text(ctx, s, x, y, { size = 12, color, weight = 400, max } = {}) {
  ctx.font = `${weight} ${size}px ${colors().sans}`
  ctx.fillStyle = color ?? colors().fg
  ctx.textBaseline = 'middle'
  let str = s
  if (max) while (str.length > 1 && ctx.measureText(str).width > max) str = str.slice(0, -2) + '…'
  ctx.fillText(str, x, y)
}
const line = (ctx, x, y, w, c) => box(ctx, [x, y, w, 8], c ?? colors().neutral, null, 4)

function typedAt(cmds, t, page) {
  const out = {}
  for (const c of cmds) {
    if (c.at > t) break
    if (c.page !== page) continue
    if (c.name === 'Navigate To') for (const k of Object.keys(out)) delete out[k]
    if (c.typed) {
      const p = Math.min(1, (t - c.at) / Math.max(0.2, c.ms / 1000))
      out[c.target] = c.typed.slice(0, Math.ceil(c.typed.length * p))
    }
  }
  return out
}

export function drawFrame(ctx, detail, t) {
  const c = colors()
  const cmds = detail.commands
  const cur = commandAt(cmds, t)
  const page = cur?.page ?? 'blank'
  const typed = typedAt(cmds, t, page)
  const standard = !!cur?.standard

  ctx.fillStyle = c.canvas; ctx.fillRect(0, 0, W, H)
  // Browser chrome
  ctx.fillStyle = c.subtle; ctx.fillRect(0, 0, W, 56)
  box(ctx, [8, 6, 200, 22], c.canvas, null, 6)
  text(ctx, PAGE[page].tab, 20, 17, { size: 11, color: c.fgMuted, max: 176 })
  box(ctx, T.address, c.canvas, c.border, 9)
  text(ctx, PAGE[page].url, 92, 42, { size: 11, color: c.fgMuted, max: 760 })
  ctx.fillStyle = c.border; ctx.fillRect(0, 56, W, 1)

  if (page === 'blank') {
    text(ctx, cur ? cur.name : 'Waiting for the session', W / 2 - 80, 300, { size: 13, color: c.fgSubtle })
  } else {
    // Site header
    box(ctx, [24, 72, 96, 24], c.neutral, null, 6)
    if (page !== 'login') {
      box(ctx, T.search, c.canvas, c.border, 16)
      text(ctx, typed.search || 'Search destinations', 316, 84, { size: 12, color: typed.search ? c.fg : c.fgSubtle })
      ctx.fillStyle = c.fg; ctx.beginPath(); ctx.arc(639, 84, 13, 0, Math.PI * 2); ctx.fill()
    }
    ctx.fillStyle = c.neutral; ctx.beginPath(); ctx.arc(920, 84, 14, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = c.border; ctx.fillRect(0, 112, W, 1)

    if (page === 'home') {
      for (let row = 0; row < 2; row++) for (let i = 0; i < 4; i++) {
        const x = 24 + i * 232, y = 126 + row * 210
        box(ctx, [x, y, 216, 136], c.neutral, null, 8)
        line(ctx, x, y + 148, 150); line(ctx, x, y + 164, 96)
      }
    }
    if (page === 'search') {
      box(ctx, [24, 126, 200, 372], c.muted, null, 8)
      ;['Type of place', 'Rooms and beds', 'Amenities'].forEach((s, i) => {
        box(ctx, [32, 184 + i * 40, 184, 28], c.canvas, c.border, 14)
        text(ctx, s, 44, 198 + i * 40, { size: 11, color: c.fgMuted })
      })
      for (let i = 0; i < 4; i++) {
        const y = 126 + i * 92
        box(ctx, [240, y, 120, 80], c.neutral, null, 8)
        line(ctx, 376, y + 12, 320); line(ctx, 376, y + 30, 220); line(ctx, 376, y + 48, 140)
      }
    }
    if (page === 'checkout') {
      const field = (key, label) => {
        const [x, y, w, h] = T[key]
        text(ctx, label, x, y - 10, { size: 11, color: c.fgMuted })
        box(ctx, T[key], c.canvas, c.border, 6)
        if (typed[key]) text(ctx, typed[key], x + 10, y + h / 2, { size: 12, max: w - 20 })
      }
      field('gift', 'Gift card'); field('card', 'Card number'); field('expiry', 'Expiry'); field('cvc', 'CVC'); field('zip', 'Billing ZIP')
      box(ctx, T.apply, c.muted, c.border, 6); text(ctx, 'Apply', T.apply[0] + 32, T.apply[1] + 16, { size: 12, weight: 600 })
      box(ctx, [600, 126, 336, 300], c.canvas, c.border, 8)
      line(ctx, 616, 146, 200); line(ctx, 616, 166, 140)
      box(ctx, [616, 190, 304, 120], c.muted, null, 6)
      box(ctx, T.reserve, c.fg, null, 8)
      text(ctx, 'Reserve', T.reserve[0] + 128, T.reserve[1] + 20, { size: 13, weight: 600, color: c.onEmphasis })
    }
    if (page === 'login') {
      box(ctx, [330, 124, 300, 324], c.canvas, c.border, 10)
      text(ctx, 'Log in', 354, 152, { size: 15, weight: 600 })
      for (const k of ['email', 'password']) {
        box(ctx, T[k], c.canvas, c.border, 6)
        if (typed[k]) text(ctx, typed[k], T[k][0] + 10, T[k][1] + 16, { size: 12, max: 230 })
      }
      box(ctx, T.login, c.fg, null, 8)
      text(ctx, 'Continue', T.login[0] + 98, T.login[1] + 18, { size: 13, weight: 600, color: c.onEmphasis })
      if (cur?.lockError) text(ctx, 'Too many attempts. Try again in 15 minutes.', T.error[0], T.error[1] + 18, { size: 11, color: c.dangerFg, max: 252 })
    }
    if (page === 'listing') {
      box(ctx, [24, 124, 560, 236], c.neutral, null, 10)
      line(ctx, 24, 368, 300)
      box(ctx, [608, 120, 328, 240], c.canvas, c.border, 8)
      box(ctx, T.tabLeasing, standard ? c.canvas : c.fg, c.border, 14)
      text(ctx, 'Leasing', T.tabLeasing[0] + 24, T.tabLeasing[1] + 14, { size: 11, color: standard ? c.fg : c.onEmphasis })
      box(ctx, T.tabStandard, standard ? c.fg : c.canvas, c.border, 14)
      text(ctx, 'Standard', T.tabStandard[0] + 20, T.tabStandard[1] + 14, { size: 11, color: standard ? c.onEmphasis : c.fg })
      // A simple floor plan that changes with the tab.
      const [sx, sy] = T.siteplan
      ctx.strokeStyle = c.fgSubtle; ctx.lineWidth = 1.5
      ctx.strokeRect(sx + 8, sy + 8, 296, 172)
      const walls = standard ? [[sx + 110, sy + 8, sx + 110, sy + 180], [sx + 8, sy + 90, sx + 304, sy + 90]]
        : [[sx + 160, sy + 8, sx + 160, sy + 180], [sx + 160, sy + 110, sx + 304, sy + 110], [sx + 8, sy + 70, sx + 160, sy + 70]]
      for (const [a, b, d, e] of walls) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(d, e); ctx.stroke() }
      for (let i = 0; i < 4; i++) {
        const y = 392 + i * 32
        ctx.fillStyle = c.border; ctx.fillRect(24, y + 26, 912, 1)
        line(ctx, 32, y + 10, 160); line(ctx, 260, y + 10, 90); line(ctx, 420, y + 10, 120)
      }
    }
    if (cur?.backdrop) {
      ctx.fillStyle = c.backdrop; ctx.fillRect(0, 57, W, H - 57)
      box(ctx, T.modal, c.canvas, c.border, 10)
      text(ctx, 'Confirm your phone number', T.modal[0] + 20, T.modal[1] + 28, { size: 14, weight: 600 })
      box(ctx, [T.modal[0] + 20, T.modal[1] + 56, 260, 30], c.canvas, c.border, 6)
      box(ctx, [T.modal[0] + 180, T.modal[1] + 102, 100, 32], c.fg, null, 8)
      text(ctx, 'Continue', T.modal[0] + 204, T.modal[1] + 118, { size: 12, weight: 600, color: c.onEmphasis })
    }
  }

  // The command's target, while it runs.
  if (cur?.target && T[cur.target]) {
    const until = cur.at + Math.max(0.9, cur.ms / 1000)
    if (t <= until) {
      const [x, y, w, h] = T[cur.target]
      const failed = cur.status === 'failed'
      rr(ctx, x - 3, y - 3, w + 6, h + 6, 8)
      ctx.globalAlpha = 0.35; ctx.fillStyle = failed ? c.dangerSubtle : c.accentSubtle; ctx.fill(); ctx.globalAlpha = 1
      ctx.lineWidth = 2; ctx.strokeStyle = failed ? c.danger : c.accent
      if (failed && cur.fail === 'noSuchElement') ctx.setLineDash([6, 4])
      ctx.stroke(); ctx.setLineDash([])
      if (/Click/.test(cur.name)) drawCursor(ctx, x + w / 2, y + h / 2, c)
    }
  }
}

function drawCursor(ctx, x, y, c) {
  ctx.save(); ctx.translate(x, y)
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.lineTo(4.5, 12); ctx.lineTo(8, 19); ctx.lineTo(10.5, 18)
  ctx.lineTo(7, 11); ctx.lineTo(12.5, 11); ctx.closePath()
  ctx.fillStyle = c.fg; ctx.fill(); ctx.strokeStyle = c.canvas; ctx.lineWidth = 1.2; ctx.stroke()
  ctx.restore()
}

/** A still of the replay at time t, for the "View screenshot" dialog. */
export function frameDataURL(detail, t) {
  const cv = document.createElement('canvas')
  cv.width = W * 2; cv.height = H * 2
  const ctx = cv.getContext('2d'); ctx.scale(2, 2)
  drawFrame(ctx, detail, t)
  return cv.toDataURL('image/png')
}

/* ---------------- canvas ---------------- */
function ReplayCanvas({ detail, rotation }) {
  const ref = useRef(null)
  const time = usePlayback(s => s.time)
  const size = useRef({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const cv = ref.current
    const fit = () => {
      const width = cv.clientWidth, height = cv.clientHeight
      if (!width || !height) return
      const dpr = window.devicePixelRatio || 1
      cv.width = Math.round(width * dpr); cv.height = Math.round(height * dpr)
      size.current = { w: width, h: height }
      paint()
    }
    fit() // now, not only when the observer next reports
    const ro = new ResizeObserver(fit)
    ro.observe(cv)
    return () => ro.disconnect()
  }, [detail])
  const paint = () => {
    const cv = ref.current; if (!cv || !cv.width) return
    const ctx = cv.getContext('2d')
    ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0)
    drawFrame(ctx, detail, playback.get().time)
  }
  useEffect(paint, [time, detail])
  return <canvas ref={ref} className="vp-canvas" style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
    role="img" aria-label={`Session recording for ${detail.test.name}`} />
}

/* ---------------- control bar ---------------- */
function SeekBar({ duration, segments, byId }) {
  const time = usePlayback(s => s.time)
  const ref = useRef(null)
  const dragging = useRef(false)
  const at = clientX => {
    const r = ref.current.getBoundingClientRect()
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * duration
  }
  const pct = s => `${(s / duration) * 100}%`
  return (
    <div ref={ref} className="vc-seek" role="slider" tabIndex={0} aria-label="Seek"
      aria-valuemin={0} aria-valuemax={Math.round(duration)} aria-valuenow={Math.round(time)}
      aria-valuetext={`${fmtTime(time)} of ${fmtTime(duration)}`}
      onPointerDown={e => {
        dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); seekSilently(at(e.clientX))
      }}
      onPointerMove={e => { if (dragging.current) seekSilently(at(e.clientX)) }}
      onPointerUp={e => { if (!dragging.current) return; dragging.current = false; jumpTo(at(e.clientX), { source: 'video' }) }}
      onKeyDown={e => {
        const step = e.shiftKey ? 15 : 5
        if (e.key === 'ArrowRight') { e.preventDefault(); jumpTo(time + step, { source: 'video' }) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); jumpTo(time - step, { source: 'video' }) }
        if (e.key === 'Home') { e.preventDefault(); jumpTo(0, { source: 'video' }) }
        if (e.key === 'End') { e.preventDefault(); jumpTo(duration, { source: 'video' }) }
      }}>
      <span className="vc-track" />
      <span className="vc-played" style={{ width: pct(time) }} />
      {/* Failure markers: red ahead of the playhead, grey once played, as
          screenshot 5 shows (Rajat confirmed, 17 Oct 2026). Hovering one
          opens its popover (v2 item 8). */}
      {segments.map((s, i) => (
        <span key={i} aria-hidden="true"
          className={cx('vc-marker', s.end - s.start < 1 && 'is-dot', s.start < time && 'is-played')}
          style={{ left: pct(s.start), width: s.end - s.start < 1 ? undefined : `max(6px, ${pct(s.end - s.start)})` }} />
      ))}
      <FailureHits segments={segments} byId={byId} view={[0, duration]} direction="top" />
      <span className="vc-thumb" style={{ left: pct(time) }} />
    </div>
  )
}

/* v2 items 6 and 11: one line above the seek bar names the command the
   playhead is on. When that is a failure, the line turns red, gives the type
   in words (404 Not Found, never a bare code: ux-text-guidelines.md §3) and
   carries Raise a bug and Copy payload. The line keeps its height either way,
   so nothing jumps when a failure starts or ends, and the buttons never
   crowd the seek bar [proposed]. */
function NowLine({ commands, segments, byId, onStub }) {
  const time = usePlayback(s => s.time)
  const failed = failureAt(segments, byId, time)
  const cmd = failed ?? commandAt(commands, time)
  if (!cmd) return <div className="vc-now" />
  if (!failed) {
    return (
      <div className="vc-now">
        <StatusGlyph status={cmd.status} bare size={14} />
        <TruncText className="vc-now__name" text={cmd.name} />
        {cmd.value && <TruncText className="vc-now__value" text={cmd.value} />}
      </div>
    )
  }
  return (
    <div className="vc-now is-failed" role="group" aria-label={`Failed command at ${fmtTime(failed.at)}`}>
      <span className="vc-now__fail">
        <StatusGlyph status="failed" bare size={14} />
        <TruncText className="vc-now__type" text={statusLabel(failed.response.responseStatus)} />
        <span className="meta-dot" aria-hidden="true">·</span>
        <TruncText className="vc-now__name" text={failed.name} />
        {failed.value && <TruncText className="vc-now__value" text={failed.value} />}
      </span>
      <LTIconButton icon={Bug} ariaLabel="Raise a bug" variant="invisible" size="small" tooltipDirection="n"
        onClick={() => onStub(`The bug form opens here, with ${failed.name} at ${fmtTime(failed.at)} attached.`)} />
      <LTCopyToClipboard textToCopy={payloadText(failed)} size="small" tooltipDirection="n"
        copyAriaLabel="Copy payload" copiedAriaLabel="Payload copied" />
    </div>
  )
}

function useClock(duration) {
  useEffect(() => {
    let raf = 0, last = 0
    const tick = now => {
      const s = playback.get()
      if (s.playing) {
        const dt = last ? (now - last) / 1000 : 0
        const next = s.time + dt * s.rate
        if (next >= duration) playback.set({ time: duration, playing: false })
        else playback.set({ time: next })
      }
      last = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])
}

/**
 * mode "docked": in the page, beside or above the logs (brief item 13).
 * mode "pip": inside PipWindow (v2 item 5), which carries Dock and Collapse
 * in its own header. One VideoPane is mounted at a time, so there is one
 * clock; every surface reads and moves the same playhead (playback.js).
 */
export function VideoPane({ detail, segments, byId, onStub, loading = false, mode = 'docked', dock = 'side', onPip, onCollapse }) {
  const hasVideo = detail && detail.test.video && detail.commands.length > 0
  const duration = detail?.durationSec ?? 0
  const playing = usePlayback(s => s.playing)
  const time = usePlayback(s => s.time)
  const rate = usePlayback(s => s.rate)
  const [rotation, setRotation] = useState(0)
  const [fs, setFs] = useState(false)
  const paneRef = useRef(null)
  useClock(duration)
  useWheelSeek(paneRef)
  useEffect(() => {
    const f = () => setFs(document.fullscreenElement === paneRef.current)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  const windowControls = mode === 'docked' && (
    <>
      <LTIconButton icon={PictureInPicture2} ariaLabel="Open picture-in-picture" variant="invisible" size="small"
        tooltipDirection="n" onClick={onPip} data-focus="video-pip" />
      <LTIconButton icon={dock === 'side' ? PanelRightClose : PanelTopClose} ariaLabel="Collapse video" variant="invisible"
        size="small" tooltipDirection="n" onClick={onCollapse} data-focus="video-collapse" />
    </>
  )

  if (loading) {
    return (
      <section className={cx('vp', `vp--${mode}`)} aria-label="Video" aria-busy="true">
        <div className="vp-stage"><LTSkeletonBox width="100%" height="100%" radius="var(--radius-2)" /></div>
      </section>
    )
  }
  if (!hasVideo) {
    const queued = detail?.test.status === 'queued'
    return (
      <section className={cx('vp', `vp--${mode}`)} aria-label="Video">
        <div className="vp-empty">
          <LTBlankSlate heading={queued ? 'Waiting for the session' : 'Video unavailable'}
            description={queued ? 'The video appears here once the test starts.' : 'This session ended without a recording.'} />
        </div>
        {mode === 'docked' && (
          <div className="vc-row vc-row--empty">
            <LTIconButton icon={dock === 'side' ? PanelRightClose : PanelTopClose} ariaLabel="Collapse video" variant="invisible"
              size="small" tooltipDirection="n" onClick={onCollapse} data-focus="video-collapse" />
          </div>
        )}
      </section>
    )
  }
  const toggle = () => {
    const s = playback.get()
    if (!s.playing && s.time >= duration) playback.set({ time: 0 })
    playback.set({ playing: !s.playing })
  }
  return (
    <section ref={paneRef} className={cx('vp', `vp--${mode}`, fs && 'is-fullscreen')} aria-label="Video">
      <div className="vp-stage" onClick={toggle}>
        <ReplayCanvas detail={detail} rotation={rotation} />
      </div>
      <div className="vc">
        <NowLine commands={detail.commands} segments={segments} byId={byId} onStub={onStub} />
        <SeekBar duration={duration} segments={segments} byId={byId} />
        <div className="vc-row">
          <LTIconButton icon={playing ? Pause : Play} ariaLabel={playing ? 'Pause' : 'Play'} variant="invisible" size="small"
            tooltipDirection="n" onClick={toggle} />
          <span className="vc-time" aria-hidden="true">{`${fmtTime(time)} / ${fmtTime(duration)}`}</span>
          {/* The speed shows its value: the state is visible, not behind a gear. */}
          <LTActionMenu ariaLabel="Playback speed" width={120} selectionVariant="single" activeId={rate}
            customAnchor={<LTButton variant="invisible" size="small" label={`${rate}x`} ariaLabel={`${rate}x playback speed`}
              className="vc-speed" />}
            onSelect={o => playback.set({ rate: o.value })}
            options={[0.5, 1, 1.5, 2].map(r => ({ value: r, label: `${r}x` }))} />
          <span className="spacer" />
          {windowControls}
          <LTIconButton icon={fs ? Minimize : Maximize} ariaLabel={fs ? 'Exit full screen' : 'Enter full screen'}
            variant="invisible" size="small" tooltipDirection="n"
            onClick={() => (fs ? document.exitFullscreen() : paneRef.current?.requestFullscreen?.())} />
          {/* Rare actions leave the bar (NN/g heuristic 8, automation-details.md §7b). */}
          <LTActionMenu ariaLabel="More video actions" width={200}
            customAnchor={<LTIconButton icon={Ellipsis} ariaLabel="More video actions" variant="invisible" size="small" tooltipDirection="n" />}
            onSelect={o => {
              if (o.value === 'download') onStub('Video download started.')
              if (o.value === 'rotate') setRotation(r => (r + 90) % 360)
            }}
            options={[
              { value: 'download', label: 'Download video', icon: Download },
              { value: 'rotate', label: 'Rotate video', icon: RotateCwSquare },
            ]} />
        </div>
      </div>
    </section>
  )
}

/* ---------------- picture-in-picture (v2 item 5) ----------------
   A window floating inside the page, not the browser's Picture-in-Picture:
   the native window shows only a <video> element with the browser's own
   controls, so it could not carry this seek bar, its failure markers or the
   failed-command slot. It moves by its header (or the grip and arrow keys)
   and resizes from its top-left corner between 320px and the smaller of
   640px and half the window [proposed thresholds]. */
export const PIP = { min: 320, max: 640, gap: 16 }
export function pipMaxWidth() {
  return Math.max(PIP.min, Math.min(PIP.max, Math.floor(window.innerWidth / 2)))
}

export function PipWindow({ rect, setRect, title, dock, onDock, onCollapse, children }) {
  const root = usePortalRoot()
  const ref = useRef(null)
  const drag = useRef(null)
  const heightRef = useRef(0)
  const [, setTick] = useState(0)
  const clampW = w => Math.min(Math.max(w, PIP.min), pipMaxWidth())
  // Keeps the whole window on screen, whatever the stored position says.
  const place = r => {
    const w = clampW(r.width)
    return {
      width: r.width,
      right: Math.min(Math.max(PIP.gap, r.right), Math.max(PIP.gap, window.innerWidth - w - PIP.gap)),
      bottom: Math.min(Math.max(PIP.gap, r.bottom), Math.max(PIP.gap, window.innerHeight - heightRef.current - PIP.gap)),
    }
  }
  const width = clampW(rect.width)
  const pos = place(rect)
  useLayoutEffect(() => {
    if (ref.current && ref.current.offsetHeight !== heightRef.current) {
      heightRef.current = ref.current.offsetHeight
      setTick(t => t + 1)
    }
  })
  useEffect(() => {
    const f = () => setTick(t => t + 1) // re-clamp on window resize
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])

  const startMove = e => {
    if (e.button !== 0 || e.target.closest('button:not(.pip-grip), [role="slider"]')) return
    e.preventDefault()
    drag.current = { kind: 'move', x: e.clientX, y: e.clientY, right: pos.right, bottom: pos.bottom }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const startResize = e => {
    e.preventDefault(); e.stopPropagation()
    drag.current = { kind: 'resize', x: e.clientX, width }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = e => {
    const d = drag.current
    if (!d) return
    if (d.kind === 'move') setRect(r => place({ ...r, right: d.right - (e.clientX - d.x), bottom: d.bottom - (e.clientY - d.y) }))
    else setRect(r => ({ ...r, width: Math.round(clampW(d.width - (e.clientX - d.x))) }))
  }
  const end = () => { drag.current = null }
  const moveKeys = e => {
    const step = e.shiftKey ? 64 : 16
    const dx = { ArrowLeft: step, ArrowRight: -step }[e.key] ?? 0
    const dy = { ArrowUp: step, ArrowDown: -step }[e.key] ?? 0
    if (!dx && !dy) return
    e.preventDefault()
    setRect(r => { const p = place(r); return place({ ...r, right: p.right + dx, bottom: p.bottom + dy }) })
  }
  const resizeKeys = e => {
    const step = e.shiftKey ? 64 : 16
    const by = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step }[e.key]
    if (by == null && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    setRect(r => ({ ...r, width: e.key === 'Home' ? PIP.min : e.key === 'End' ? pipMaxWidth() : clampW(clampW(r.width) + by) }))
  }

  return createPortal(
    <div ref={ref} className="pip" role="region" aria-label="Picture-in-picture video"
      style={{ width, right: pos.right, bottom: pos.bottom }} onPointerMove={onMove} onPointerUp={end} onPointerCancel={end}>
      <div className="pip-head" onPointerDown={startMove}>
        <LTIconButton icon={GripHorizontal} ariaLabel="Move video" variant="invisible" size="small" className="pip-grip"
          tooltipDirection="n" onKeyDown={moveKeys} />
        <TruncText className="pip-title" text={title} />
        <LTIconButton icon={dock === 'side' ? PanelRight : PanelTop} ariaLabel="Dock video" variant="invisible" size="small"
          tooltipDirection="n" onClick={onDock} data-focus="pip-dock" />
        <LTIconButton icon={dock === 'side' ? PanelRightClose : PanelTopClose} ariaLabel="Collapse video" variant="invisible"
          size="small" tooltipDirection="n" onClick={onCollapse} />
      </div>
      {children}
      <span role="slider" tabIndex={0} className="pip-resize" aria-label="Resize video"
        aria-valuemin={PIP.min} aria-valuemax={pipMaxWidth()} aria-valuenow={width} aria-valuetext={`${width} pixels wide`}
        onPointerDown={startResize} onKeyDown={resizeKeys} />
    </div>, root)
}
