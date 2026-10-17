// Failures on the two time bars: hovering a red stretch of the video's seek
// bar or the timeline opens an LTPopover (v2 item 8). v3 item 4 makes it
// interactive: it stays open to copy from, and a single failure carries
// Raise a bug, Copy payload and a comment action. Shared by video.jsx and
// timeline.jsx.
//
// Reading order, most important first (v3 item 4.3):
//   heading   what failed: the command, or "8 failed commands"
//   meta      when: at 1:16 · 500ms, or the stretch 1:16 - 1:21
//   type      why: the HTTP status as a red tag, then the WebDriver error
//   message   the error's own words, when they add something
//   locator   where: strategy and value
//   comment   what the team already knows, when there is one
//   actions   what to do next, last, after the facts that decide it
import React, { useState } from 'react'
import { Bug, MessageSquare, MessageSquarePlus, Pencil } from 'lucide-react'
import { LTTag, LTIconButton, LTCopyToClipboard } from './lt.jsx'
import { LTPopover } from './overlays.jsx'
import { payloadText, statusLabel } from './data.js'
import { fmtMs, fmtTime, fmtTimeRange } from './format.js'
import { commentKey, requestComment, useComment, useComments } from './comments.js'

const errorOf = c => {
  try { return JSON.parse(c.response.responseBody).value ?? {} } catch { return {} }
}

function TypeLine({ cmd }) {
  const { error } = errorOf(cmd)
  return (
    <div className="fp__type">
      <LTTag variant="danger" text={statusLabel(cmd.response.responseStatus)} />
      {error && <span className="fp__error">{error}</span>}
    </div>
  )
}

function Locator({ cmd }) {
  if (!cmd.strategy && !cmd.value) return null
  return (
    <p className="fp__locator">
      {cmd.strategy && <span className="fp__strategy">{cmd.strategy}</span>}
      {cmd.value && <code className="fp__value">{cmd.value}</code>}
    </p>
  )
}

/* One failed command: the facts, the comment if any, then three actions. */
function SingleFailure({ cmd, testId, onStub, close }) {
  const comment = useComment(commentKey(testId, cmd.id))
  const { message } = errorOf(cmd)
  const label = statusLabel(cmd.response.responseStatus)
  // "500 Internal Server Error" already says "Internal Server Error".
  const showMessage = message && !label.toLowerCase().endsWith(message.toLowerCase())
  return (
    <div className="fp">
      <p className="fp__meta">{`At ${fmtTime(cmd.at)} · ${fmtMs(cmd.ms)}`}</p>
      <TypeLine cmd={cmd} />
      {showMessage && <p className="fp__message">{message}</p>}
      <Locator cmd={cmd} />
      {comment && (
        <div className="fp__comment">
          <MessageSquare size={12} aria-hidden="true" className="fp__comment-icon" />
          <p className="fp__comment-text"><span className="fp__comment-by">{comment.by}</span>{' '}{comment.text}</p>
        </div>
      )}
      <div className="fp__actions" role="group" aria-label={`Actions for ${cmd.name} at ${fmtTime(cmd.at)}`}>
        <LTIconButton icon={Bug} ariaLabel="Raise a bug" variant="invisible" size="small" tooltipDirection="s"
          onClick={() => { close(); onStub(`The bug form opens here, with ${cmd.name} at ${fmtTime(cmd.at)} attached.`) }} />
        <LTCopyToClipboard textToCopy={payloadText(cmd)} size="small" tooltipDirection="s"
          copyAriaLabel="Copy payload" copiedAriaLabel="Payload copied" />
        <LTIconButton icon={comment ? Pencil : MessageSquarePlus} ariaLabel={comment ? 'Edit comment' : 'Add comment'}
          variant="invisible" size="small" tooltipDirection="s"
          onClick={() => { close(); requestComment(testId, cmd.id) }} />
      </div>
    </div>
  )
}

/* Several failures merged into one stretch: no actions (v3 item 4.5), so it
   says how to reach one command when that is possible. */
function BundledFailures({ cmds, testId, hint }) {
  const comments = useComments()
  const groups = []
  for (const c of cmds) {
    const key = [c.name, c.strategy, c.value, c.response.responseStatus].join('|')
    const g = groups.find(x => x.key === key)
    if (g) g.cmds.push(c)
    else groups.push({ key, cmd: c, cmds: [c] })
  }
  const shown = groups.slice(0, 3)
  const rest = cmds.length - shown.reduce((sum, g) => sum + g.cmds.length, 0)
  return (
    <div className="fp">
      <p className="fp__meta">{fmtTimeRange(cmds[0].at, cmds[cmds.length - 1].at)}</p>
      <ul className="fp__list">
        {shown.map(({ key, cmd, cmds: same }) => {
          const noted = same.filter(c => comments[commentKey(testId, c.id)]).length
          return (
            <li key={key} className="fp__item">
              <p className="fp__item-head">
                <span className="fp__name">{cmd.name}</span>
                {same.length > 1 && <span className="fp__times">{`${same.length} times`}</span>}
                {noted > 0 && (
                  <span className="fp__noted">
                    <MessageSquare size={12} aria-hidden="true" />{noted}
                    <span className="vh">{noted === 1 ? ' comment' : ' comments'}</span>
                  </span>
                )}
              </p>
              <TypeLine cmd={cmd} />
              <Locator cmd={cmd} />
            </li>
          )
        })}
      </ul>
      {rest > 0 && <p className="fp__more">{`${rest} more failed command${rest === 1 ? '' : 's'}`}</p>}
      {hint && <p className="fp__hint">{hint}</p>}
    </div>
  )
}

/**
 * Hover targets over the red stretches, at least 12px wide so a 120ms failure
 * is still easy to hit. Clicks pass through to the bar underneath, which
 * seeks; `onDoubleClick` is the timeline's zoom (v2 item 9), and only there
 * does a merged stretch point at it.
 */
export function FailureHits({ segments, byId, view, direction, onDoubleClick, testId, onStub }) {
  const [v0, v1] = view
  const pct = s => `${((s - v0) / (v1 - v0)) * 100}%`
  // Closing after an action that takes the user elsewhere (bug, comment).
  const [force, setForce] = useState(false)
  const close = () => { setForce(true); setTimeout(() => setForce(false), 0) }
  return segments.map((s, i) => {
    if (s.end < v0 || s.start > v1) return null
    const cmds = s.ids.map(id => byId.get(id))
    const single = cmds.length === 1
    return (
      <LTPopover key={`${s.start}-${i}`} direction={direction} canChangeDirection containsInteractiveChildElement
        forceClose={force}
        heading={single ? cmds[0].name : `${cmds.length} failed commands`}
        popOverbodyJSX={single
          ? <SingleFailure cmd={cmds[0]} testId={testId} onStub={onStub} close={close} />
          : <BundledFailures cmds={cmds} testId={testId}
              hint={onDoubleClick ? 'Double-click to zoom in and act on one command.' : null} />}>
        <span className="fail-hit" data-seg={i} aria-hidden="true"
          style={{ left: pct((s.start + s.end) / 2), width: `max(12px, ${pct(v0 + (s.end - s.start))})` }}
          onDoubleClick={onDoubleClick ? e => { e.stopPropagation(); onDoubleClick(s) } : undefined} />
      </LTPopover>
    )
  })
}
