// Setup state (30 Oct 2026, spec §12; setup v2 the same day, §12.12): what
// the page shows while a test is being set up, before its results exist.
// The run's progress is simulated here as the backend would report it (major
// steps, their sub-steps, and attempts) on a clock that keeps going while
// other tests are open. Pages read it through narrow hooks: the header's time
// re-renders the header, the stage re-renders the stage, and the page itself
// re-renders only when the phase changes or a result arrives.
import React, { useEffect, useRef, useSyncExternalStore } from 'react'
import { CircleCheck, CircleDashed, Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { LTButton, LTLoader, announce, cx } from './lt.jsx'
import { fmtDuration } from './format.js'
import deviceSvg from './illustrations/setup-device.svg?raw'
import applepaySvg from './illustrations/setup-applepay.svg?raw'
import runSvg from './illustrations/setup-run.svg?raw'

// Kit drafts, one per major step shown on the stage (spec §12.11). Inline,
// so CSS can move their groups. Loading your results has none since setup v2
// item 9: it happens in place, as skeletons.
const ILLUSTRATIONS = { device: deviceSvg, applepay: applepaySvg, run: runSvg }

/* The flow (spec §12.3 item 1, setup v2 items 7 and 8). `sec` is each
   sub-step's length in the prototype; real setups take minutes (brief item
   3). Apple Pay is listed only once the capabilities are read. Its first
   attempt fails 4 seconds into its third sub-step and the step starts again
   from its first (question 73); on the second attempt that sub-step runs
   long, to show the long-step treatment (setup v2 item 4). */
const STEPS = [
  { id: 'device', title: 'Setting up iPhone 16', ill: 'device', setup: true, subs: [
    { title: 'Finding an available iPhone 16', sec: 3 },
    { title: 'Allocating the device', sec: 4 },
    { title: 'Checking your app', sec: 2 },
    { title: 'Installing your app', sec: 5 },
    { title: 'Configuring the device', sec: 3 },
    { title: 'Reading your capabilities', sec: 2 },
  ] },
  { id: 'applepay', title: 'Setting up Apple Pay', ill: 'applepay', setup: true, maxAttempts: 5, knownAfter: 'device',
    failures: { 1: { sub: 2, after: 4, reason: 'The card failed to load' } },
    lengths: { 2: { 2: 16 } },
    subs: [
      { title: 'Setting up the wallet', sec: 5 },
      { title: 'Adding a sandbox card', sec: 6 },
      { title: 'Loading the wallet and card', sec: 5 },
      { title: 'Setting up the passcode', sec: 4 },
      { title: 'Setting the card as the payment method', sec: 4 },
    ] },
  { id: 'run', title: 'Running your test', ill: 'run', subs: [
    { title: 'Running final checks', sec: 3 },
    { title: 'Running your commands', sec: 25 },
  ] },
  // In place, as skeletons: commands, then logs, then the video (setup v2 item 9).
  { id: 'results', title: 'Loading your results', subs: [
    { title: 'Loading commands', sec: 2 },
    { title: 'Loading logs', sec: 2 },
    { title: 'Loading the video', sec: 4 },
  ] },
]
// A finished sub-step shows its tick this long before the next slides in.
const BEAT = 0.5
// When a setup sub-step counts as long. The prototype's times are compressed;
// the product's threshold is question 86 [proposed 30 seconds].
const LONG_SEC = 8
// Setup v2 item 4, copy finalists in spec §12.12.
const REASSURANCE = 'Still working on this step. It finishes on its own.'

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
        const len = stops ? fail.after : step.lengths?.[attempt]?.[sub] ?? step.subs[sub].sec
        SEGMENTS.push({ si, attempt, sub, start: t, end: t + len, failed: stops })
        t += len
        if (stops) { failed = true; break }
      }
      if (!failed) break
    }
    SPANS.push({ start, end: t })
  })
}
const RESULTS = STEPS.length - 1
const RUN_END = SPANS[RESULTS].start
// The stage gives way to the skeletons once the run's last tick has shown.
const RESULTS_AT = RUN_END + BEAT
// When commands, logs and the video arrive.
const READY = SEGMENTS.filter(s => s.si === RESULTS).map(s => s.end)
const DONE_AT = SPANS[RESULTS].end
// When each step is listed: from the start, or once the step it waits on ends.
const KNOWN_AT = STEPS.map(st => (st.knownAfter ? SPANS[STEPS.findIndex(x => x.id === st.knownAfter)].end : 0))
/** The run's final duration, setup included: it stops when the run ends. */
export const SETUP_TOTAL_SEC = Math.round(RUN_END)

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
/* The prototype bar's controls (§12.3 item 13), not part of the design.
   Next Step goes to the moment the next sub-step shows as running (after a
   finished one's tick), then to the skeletons, then to each result. */
const STOPS = [
  ...SEGMENTS.map((s, i) => (i > 0 && s.si < RESULTS ? s.start + (SEGMENTS[i - 1].failed ? 0 : BEAT) : null)).filter(x => x != null),
  // ...and the moment a long setup sub-step starts to shimmer.
  ...SEGMENTS.filter(s => STEPS[s.si].setup && s.end - s.start > LONG_SEC).map(s => s.start + LONG_SEC),
  RESULTS_AT, ...READY,
].sort((a, b) => a - b)
const setupControls = {
  pause: () => { if (store.pausedAt == null) { store.pausedAt = now(); stop(); emit() } },
  play: () => { if (store.pausedAt != null) { store.start += now() - store.pausedAt; store.pausedAt = null; run(); emit() } },
  next: () => { const t = time(); jump(STOPS.find(x => x > t + 1e-3) ?? DONE_AT) },
  restart: () => jump(0),
}

const useClock = get => useSyncExternalStore(subscribe, get)
const phaseAt = t => (t < RESULTS_AT ? 'setup' : t < DONE_AT ? 'results' : 'done')
/** 'setup' (the stage), 'results' (skeletons until each result arrives) or 'done'. */
export const useSetupPhase = () => useClock(() => phaseAt(time()))
/** The results that have arrived, as bits: 1 commands, 2 logs, 4 video. */
export const useResultsReady = () => useClock(() => READY.reduce((m, end, i) => (time() >= end ? m | (1 << i) : m), 0))
const useSeconds = () => useClock(() => Math.floor(time()))
const useQuarter = () => useClock(() => Math.floor(time() * 4) / 4)
const usePaused = () => useClock(() => store.pausedAt != null)

/* ---------- what the stage shows at a moment ---------- */
function viewAt(t) {
  const i = SEGMENTS.findIndex(s => t < s.end)
  const idx = i < 0 ? SEGMENTS.length - 1 : i
  const seg = SEGMENTS[idx]
  const prev = SEGMENTS[idx - 1]
  // A finished sub-step keeps its tick for a beat; a failed one gives way at once.
  const beat = !!prev && !prev.failed && t < seg.start + BEAT
  const shown = beat ? prev : seg
  const step = STEPS[shown.si]
  const list = STEPS.map((st, si) => ({ id: st.id, title: st.title, si,
    status: t >= SPANS[si].end ? 'done' : si === shown.si ? 'current' : 'pending' }))
    .filter(r => t >= KNOWN_AT[r.si])
  const attempt = shown.attempt
  return {
    step, list, attempt, maxAttempts: step.maxAttempts,
    lastFail: attempt > 1 ? { attempt: attempt - 1, reason: step.failures[attempt - 1].reason } : null,
    sub: { key: `${shown.si}:${attempt}:${shown.sub}`, title: step.subs[shown.sub].title, status: beat ? 'done' : 'current' },
    long: !beat && !!step.setup && t - seg.start >= LONG_SEC,
  }
}

/* ---------- pieces ---------- */

/** The header's duration while a test sets up (§12.2): elapsed, ticking. */
export function SetupClock() {
  const s = useSeconds()
  return <span role="timer">{fmtDuration(Math.min(s, Math.floor(RUN_END)))}</span>
}

/* An illustration plays when its step starts or a retry starts, and when a
   sub-step starts if the last play began 14 seconds before (4 to play, 10
   at rest), C66. A new key remounts it, which restarts its CSS animations;
   each lasts at most 4 seconds and ends in the drawn pose. */
function usePlayKey(view) {
  const ref = useRef(null)
  const t = now()
  const si = view.step.id, attempt = view.attempt, sub = view.sub.key
  const r = ref.current ?? (ref.current = { key: 0, at: t, si, attempt, sub })
  if (r.si !== si || r.attempt !== attempt) { r.key += 1; r.at = t }
  else if (r.sub !== sub && t - r.at >= 14000) { r.key += 1; r.at = t }
  r.si = si; r.attempt = attempt; r.sub = sub
  return r.key
}

const STATE_WORDS = { done: 'done', current: 'running', pending: 'pending' }

/* Setup v2 item 3: one sub-step at a time. A finished one shows its tick,
   then slides up and out as the next slides in; the previous line stays
   mounted, hidden, until the next change. */
function SubLine({ item }) {
  return (
    <>
      <span className={cx('su-badge', `is-${item.status}`)} aria-hidden="true">
        {item.status === 'done' ? <CircleCheck size={16} /> : <LTLoader size="small" />}
      </span>
      <span className="su-carousel__text">{item.title}</span>
      <span className="vh">{`, ${STATE_WORDS[item.status]}`}</span>
    </>
  )
}
function SubCarousel({ item, long }) {
  const ref = useRef(null)
  if (!ref.current) ref.current = { cur: item, prev: null }
  else if (ref.current.cur.key !== item.key) ref.current = { cur: item, prev: ref.current.cur }
  else ref.current.cur = item
  const { prev } = ref.current
  return (
    <div className="su-carousel">
      {prev && <p key={`out:${prev.key}`} className="su-carousel__item is-out" aria-hidden="true"><SubLine item={prev} /></p>}
      <p key={item.key} className={cx('su-carousel__item', 'is-in', long && 'is-long')}><SubLine item={item} /></p>
    </div>
  )
}

/** The stage, in place of the tabs the run fills (§12.2, setup v2 items 2, 3, 5). */
export function SetupPanel() {
  const v = viewAt(useQuarter())
  const playKey = usePlayKey(v)
  // Rows listed after the stage first showed slide open; the first ones only fade in.
  const first = useRef(null)
  if (!first.current) first.current = new Set(v.list.map(r => r.id))
  return (
    <div className="su">
      <div className="su-stage">
        <div className="su-hero">
          <span key={`${v.step.id}:${playKey}`} className="su-hero__ill" aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[v.step.ill] }} />
          <h2 className="su-hero__title">{v.step.title}</h2>
          <p className="su-hero__attempt">
            {v.lastFail && `Attempt ${v.attempt} of ${v.maxAttempts}. ${v.lastFail.reason} on attempt ${v.lastFail.attempt}.`}
          </p>
          <SubCarousel item={v.sub} long={v.long} />
          <p className={cx('su-hero__note', v.long && 'is-on')} aria-hidden={!v.long}>{REASSURANCE}</p>
        </div>
        <ol className="su-steps" aria-label="Setup steps">
          {v.list.map(r => (
            <li key={r.id} className={cx('su-step', `is-${r.status}`, !first.current.has(r.id) && 'is-new')}
              aria-current={r.status === 'current' ? 'step' : undefined}>
              <span className={cx('su-badge', `is-${r.status}`)} aria-hidden="true">
                {r.status === 'done' ? <CircleCheck size={16} /> : r.status === 'current' ? <LTLoader size="small" /> : <CircleDashed size={16} />}
              </span>
              <span className="su-step__title">{r.title}</span>
              <span className="vh">{`, ${STATE_WORDS[r.status]}`}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* One hidden status line (§12.3 item 10, C74), only while the test's page is
   open: each major step as it starts, each retry, a long sub-step once, then
   the run's outcome as the results load, and their arrival. */
export function SetupAnnouncer({ active, outcome }) {
  const q = useQuarter()
  const phase = useSetupPhase()
  const v = viewAt(q)
  const prev = useRef({ step: null, long: null, phase: null })
  useEffect(() => {
    const p = prev.current
    if (!active) { prev.current = { step: null, long: null, phase: null }; return }
    if (phase !== 'setup') {
      if (p.phase !== phase) announce(phase === 'results' ? `Test ${outcome}. Loading the results.` : 'Results ready.')
      prev.current = { ...p, phase }
      return
    }
    const cur = v.list.find(r => r.status === 'current')
    const stepKey = cur ? `${cur.id}:${v.attempt}` : p.step
    const longKey = v.long ? v.sub.key : p.long
    if (cur && stepKey !== p.step) {
      const position = v.list.indexOf(cur) + 1
      const retry = v.lastFail && p.step?.startsWith(`${cur.id}:`)
      announce(retry
        ? `${v.lastFail.reason}. Trying again, attempt ${v.attempt} of ${v.maxAttempts}.`
        : `${cur.title}. Step ${position} of ${v.list.length}.${v.long ? ` ${REASSURANCE}` : ''}`)
    } else if (v.long && longKey !== p.long) {
      announce(REASSURANCE)
    }
    prev.current = { step: stepKey, long: longKey, phase }
  }, [q, phase, active]) // eslint-disable-line react-hooks/exhaustive-deps
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
