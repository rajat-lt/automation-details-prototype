// Setup state (30 Oct 2026, spec §12): what the page shows while a test is
// being set up, before its results exist. The run's progress is simulated
// here as the backend would report it (major steps, their sub-steps, and
// attempts) on a clock that keeps going while other tests are open. Pages
// read it through narrow hooks: the header's time re-renders the header,
// the step list re-renders the list, and the page itself re-renders only
// when setup ends.
import React, { useEffect, useRef, useSyncExternalStore } from 'react'
import { CircleCheck, CircleDashed, CircleDot, Pause, Play, RotateCcw, RotateCw, SkipForward } from 'lucide-react'
import { LTButton, LTLoader, announce, cx } from './lt.jsx'
import { fmtDuration } from './format.js'
import deviceSvg from './illustrations/setup-device.svg?raw'
import applepaySvg from './illustrations/setup-applepay.svg?raw'
import runSvg from './illustrations/setup-run.svg?raw'
import resultsSvg from './illustrations/setup-results.svg?raw'

// Kit drafts, one per major step (spec §12.11). Inline, so CSS can move
// their groups.
const ILLUSTRATIONS = { device: deviceSvg, applepay: applepaySvg, run: runSvg, results: resultsSvg }

/* The flow (spec §12.3 item 1). `sec` is each sub-step's length in the
   prototype; real setups take minutes (brief item 3). Apple Pay's first
   attempt fails 4 seconds into its third sub-step, and the step starts again
   from its first (question 73). */
const STEPS = [
  { id: 'device', title: 'Setting up iPhone 16', ill: 'device', subs: [
    { title: 'Finding an available iPhone 16', sec: 3 },
    { title: 'Allocating the device', sec: 4 },
    { title: 'Checking your app', sec: 2 },
    { title: 'Installing your app', sec: 5 },
    { title: 'Applying your capabilities', sec: 3 },
  ] },
  { id: 'applepay', title: 'Setting up Apple Pay', ill: 'applepay', slow: true, maxAttempts: 5,
    failures: { 1: { sub: 2, after: 4, reason: 'The card failed to load' } },
    subs: [
      { title: 'Setting up the wallet', sec: 5 },
      { title: 'Adding a sandbox card', sec: 6 },
      { title: 'Loading the wallet and card', sec: 5 },
      { title: 'Setting the card as the payment method', sec: 4 },
    ] },
  { id: 'run', title: 'Running your test', ill: 'run', subs: [
    { title: 'Running final checks', sec: 3 },
    { title: 'Running your commands', sec: 25 },
  ] },
  { id: 'results', title: 'Loading your results', ill: 'results', subs: [
    { title: 'Loading commands', sec: 2 },
    { title: 'Loading logs', sec: 2 },
    { title: 'Loading the video', sec: 4 },
  ] },
]
// The last tick shows for 600ms before the results replace the list (§12.6).
const HANDOFF = 0.6

/* One segment per sub-step per attempt, in time order, and each major
   step's span. */
const SEGMENTS = []
const SPANS = []
{
  let t = 0
  STEPS.forEach((step, si) => {
    const start = t
    for (let attempt = 1; ; attempt++) {
      const fail = step.failures?.[attempt]
      let failed = false
      for (let sub = 0; sub < step.subs.length; sub++) {
        const stops = fail?.sub === sub
        const len = stops ? fail.after : step.subs[sub].sec
        SEGMENTS.push({ si, attempt, sub, start: t, end: t + len })
        t += len
        if (stops) { failed = true; break }
      }
      if (!failed) break
    }
    SPANS.push({ start, end: t })
  })
}
const TOTAL = SEGMENTS[SEGMENTS.length - 1].end
const DONE_AT = TOTAL + HANDOFF
/** The run's final duration, setup included (§12.3 item 12). */
export const SETUP_TOTAL_SEC = Math.round(TOTAL)

/* ---------- the clock ---------- */
const store = { start: performance.now(), pausedAt: null, timer: null, listeners: new Set() }
const now = () => performance.now()
const time = () => Math.min(DONE_AT, Math.max(0, ((store.pausedAt ?? now()) - store.start) / 1000))
const emit = () => store.listeners.forEach(l => l())
const stop = () => { clearInterval(store.timer); store.timer = null }
const run = () => {
  if (store.timer || store.pausedAt != null || time() >= DONE_AT) return
  store.timer = setInterval(() => { emit(); if (time() >= DONE_AT) stop() }, 250)
}
const subscribe = l => {
  store.listeners.add(l); run()
  return () => { store.listeners.delete(l); if (!store.listeners.size) stop() }
}
const jump = to => {
  store.start = (store.pausedAt ?? now()) - to * 1000
  run(); emit()
}
/* The prototype bar's controls (§12.3 item 13), not part of the design. */
const setupControls = {
  pause: () => { if (store.pausedAt == null) { store.pausedAt = now(); stop(); emit() } },
  play: () => { if (store.pausedAt != null) { store.start += now() - store.pausedAt; store.pausedAt = null; run(); emit() } },
  next: () => { const t = time(); const seg = SEGMENTS.find(s => s.end > t + 1e-3); jump(seg ? seg.end : DONE_AT) },
  restart: () => jump(0),
}

const useClock = get => useSyncExternalStore(subscribe, get)
export const useSetupPhase = () => useClock(() => (time() >= DONE_AT ? 'done' : 'setup'))
const useSeconds = () => useClock(() => Math.floor(time()))
const useQuarter = () => useClock(() => Math.floor(time() * 4) / 4)
const usePaused = () => useClock(() => store.pausedAt != null)

/* ---------- state at a moment ---------- */
function stateAt(t) {
  const cur = SEGMENTS.find(s => t < s.end) ?? null // null in the hand-off
  const steps = STEPS.map((step, si) => {
    const span = SPANS[si]
    const last = si === STEPS.length - 1
    // In the hand-off the last step stays open, every row ticked (§12.3 item 9).
    const status = !cur ? (last ? 'current' : 'done') : si < cur.si ? 'done' : si === cur.si ? 'current' : 'pending'
    // Whole seconds, floored as the header's clock is, so the two agree.
    const out = { ...step, si, status, elapsed: status === 'done' || !cur ? span.end - span.start : status === 'current' ? Math.floor(t - span.start) : 0 }
    if (status !== 'current') return out
    const attempt = cur ? cur.attempt : SEGMENTS[SEGMENTS.length - 1].attempt
    const subIndex = cur ? cur.sub : step.subs.length
    out.attempt = attempt
    out.subIndex = subIndex
    out.complete = !cur
    out.lastFail = attempt > 1 ? { attempt: attempt - 1, reason: step.failures[attempt - 1].reason } : null
    out.subs = step.subs.map((sub, i) => {
      const seg = SEGMENTS.find(s => s.si === si && s.attempt === attempt && s.sub === i)
      const st = i < subIndex ? 'done' : i === subIndex ? 'current' : 'pending'
      return { ...sub, status: st, elapsed: st === 'done' ? seg.end - seg.start : 0 }
    })
    return out
  })
  return { steps, current: cur ? cur.si : STEPS.length - 1 }
}

/* ---------- pieces ---------- */

/** The header's duration while a test sets up (§12.2): elapsed, ticking. */
export function SetupClock() {
  const s = useSeconds()
  return <span role="timer">{fmtDuration(Math.min(s, TOTAL))}</span>
}

/* An illustration plays when its step starts or a retry starts, and when a
   sub-step starts if the last play began 14 seconds before (4 to play, 10
   at rest), C66. A new key remounts it, which restarts its CSS animations;
   each lasts at most 4 seconds and ends in the drawn pose. */
function usePlayKey(step) {
  const ref = useRef(null)
  const t = now()
  const r = ref.current ?? (ref.current = { key: 0, at: t, si: step.si, attempt: step.attempt, sub: step.subIndex })
  if (r.si !== step.si || r.attempt !== step.attempt) { r.key += 1; r.at = t }
  else if (r.sub !== step.subIndex && !step.complete && t - r.at >= 14000) { r.key += 1; r.at = t }
  r.si = step.si; r.attempt = step.attempt; r.sub = step.subIndex
  return r.key
}

const STATE_WORDS = { done: 'done', current: 'running', pending: 'pending' }

function SubStep({ sub }) {
  return (
    <li className={cx('su-sub', `is-${sub.status}`)}>
      <span className="su-badge" aria-hidden="true">
        {sub.status === 'done' ? <CircleCheck size={16} /> : sub.status === 'current' ? <LTLoader size="small" /> : <CircleDashed size={16} />}
      </span>
      <span className="su-sub__title">{sub.title}</span>
      {sub.status === 'done' && <span className="su-time" aria-hidden="true">{fmtDuration(sub.elapsed)}</span>}
      <span className="vh">{sub.status === 'done' ? `, done in ${fmtDuration(sub.elapsed)}` : `, ${STATE_WORDS[sub.status]}`}</span>
    </li>
  )
}

function StepCard({ step }) {
  const playKey = usePlayKey(step)
  return (
    <div className="su-card">
      <div className="su-card__top">
        <span key={playKey} className="su-card__ill" aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[step.ill] }} />
        <div className="su-card__text">
          <p className="su-card__title">
            <span className="su-card__name">{step.title}</span>
            <span className="su-time">
              <span className="vh">{step.complete ? ', done in ' : ', running for '}</span>{fmtDuration(step.elapsed)}
            </span>
          </p>
          {step.lastFail && (
            <>
              <p className="su-attempt"><RotateCw size={14} aria-hidden="true" />{`Attempt ${step.attempt} of ${step.maxAttempts}`}</p>
              <p className="su-card__line">{`${step.lastFail.reason} on attempt ${step.lastFail.attempt}.`}</p>
            </>
          )}
          {step.slow && <p className="su-card__line">This step takes longer than the others.</p>}
        </div>
      </div>
      <ol className="su-subs">
        {step.subs.map(sub => <SubStep key={sub.title} sub={sub} />)}
      </ol>
    </div>
  )
}

function Step({ step }) {
  if (step.status === 'current') {
    return (
      <li className={cx('su-step', 'is-current', step.complete && 'is-complete')} aria-current="step">
        <span className="su-badge" aria-hidden="true">{step.complete ? <CircleCheck size={16} /> : <CircleDot size={16} />}</span>
        <StepCard step={step} />
      </li>
    )
  }
  return (
    <li className={cx('su-step', `is-${step.status}`)}>
      <span className="su-badge" aria-hidden="true">{step.status === 'done' ? <CircleCheck size={16} /> : <CircleDashed size={16} />}</span>
      <span className="su-step__title">{step.title}</span>
      {step.status === 'done' && <span className="su-time" aria-hidden="true">{fmtDuration(step.elapsed)}</span>}
      <span className="vh">{step.status === 'done' ? `, done in ${fmtDuration(step.elapsed)}` : ', pending'}</span>
    </li>
  )
}

/** The step list, in place of the tabs the run fills (§12.2). */
export function SetupPanel({ results }) {
  const s = stateAt(useQuarter())
  return (
    <div className="su">
      <ol className="su-steps" aria-label="Test setup">
        {s.steps.map(step => <Step key={step.id} step={step} />)}
      </ol>
      <p className="su-foot">{`${results} appear here after the test runs.`}</p>
    </div>
  )
}

/* One hidden status line: each major step as it starts, each retry, and the
   end (§12.3 item 10, C74). Only while the test's page is open. */
export function SetupAnnouncer({ active, outcome }) {
  const q = useQuarter()
  // The end is read from the phase: a quarter second floors 88.6 to 88.5.
  const done = useSetupPhase() === 'done'
  const s = stateAt(q)
  const step = s.steps[s.current]
  const key = done ? 'done' : `${s.current}:${step.attempt ?? 1}`
  const prev = useRef(null)
  useEffect(() => {
    if (!active) { prev.current = null; return }
    if (prev.current === key) return
    const first = prev.current == null
    prev.current = key
    if (key === 'done') announce(`Results ready. Test ${outcome}.`)
    else if (step.lastFail && !first) announce(`${step.lastFail.reason}. Trying again, attempt ${step.attempt} of ${step.maxAttempts}.`)
    else announce(`${step.title}. Step ${s.current + 1} of ${STEPS.length}.`)
  }, [key, active]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

/* Prototype only (§12.3 item 13): a dashed bar, not product UI. */
export function SetupControls() {
  const paused = usePaused()
  const done = useSetupPhase() === 'done'
  return (
    <div className="proto-bar" role="group" aria-label="Prototype controls">
      <span className="proto-bar__label">Prototype</span>
      {/* Inactive, not removed, once setup ends, so keyboard focus stays put. */}
      {paused
        ? <LTButton variant="invisible" size="small" leadingIcon={Play} label="Play" inactive={done} onClick={setupControls.play} />
        : <LTButton variant="invisible" size="small" leadingIcon={Pause} label="Pause" inactive={done} onClick={setupControls.pause} />}
      <LTButton variant="invisible" size="small" leadingIcon={SkipForward} label="Next Step" inactive={done} onClick={setupControls.next} />
      <LTButton variant="invisible" size="small" leadingIcon={RotateCcw} label="Restart" onClick={setupControls.restart} />
    </div>
  )
}
