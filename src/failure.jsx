// Failures on the two time bars (v2 item 8): hovering a red stretch of the
// video's seek bar or the timeline opens an LTPopover with the failed command
// line and its type (404, 400, 500). Shared by video.jsx and timeline.jsx.
import React from 'react'
import { LTTag } from './lt.jsx'
import { LTPopover } from './overlays.jsx'
import { statusLabel } from './data.js'
import { fmtTime, fmtTimeRange } from './format.js'

const errorOf = c => {
  try { return JSON.parse(c.response.responseBody).value?.error ?? null } catch { return null }
}

/** The popover body: identical failures (retries) fold into one line with a count. */
export function FailureSummary({ cmds }) {
  const groups = []
  for (const c of cmds) {
    const key = [c.name, c.strategy, c.value, c.response.responseStatus].join('|')
    const g = groups.find(x => x.key === key)
    if (g) g.n += 1
    else groups.push({ key, cmd: c, n: 1 })
  }
  const shown = groups.slice(0, 3)
  const rest = cmds.length - shown.reduce((sum, g) => sum + g.n, 0)
  return (
    <div className="fs">
      {shown.map(({ key, cmd, n }) => (
        <div key={key} className="fs__item">
          <div className="fs__type">
            <LTTag variant="danger" text={statusLabel(cmd.response.responseStatus)} />
            {errorOf(cmd) && <span className="fs__error">{errorOf(cmd)}</span>}
            {n > 1 && <span className="fs__times">{`${n} times`}</span>}
          </div>
          <p className="fs__cmd">
            <strong>{cmd.name}</strong>
            {cmd.strategy && <span className="fs__strategy">{cmd.strategy}</span>}
            {cmd.value && <code className="fs__value">{cmd.value}</code>}
          </p>
        </div>
      ))}
      {rest > 0 && <p className="fs__more">{`${rest} more failed command${rest === 1 ? '' : 's'}`}</p>}
    </div>
  )
}

export const summaryHeading = cmds => (cmds.length === 1
  ? `Failed at ${fmtTime(cmds[0].at)}`
  : `${cmds.length} failed commands · ${fmtTimeRange(cmds[0].at, cmds[cmds.length - 1].at)}`)

/**
 * Hover targets over the red stretches, at least 12px wide so a 120ms failure
 * is still easy to hit. Clicks pass through to the bar underneath, which
 * seeks; `onDoubleClick` is the timeline's zoom (v2 item 9).
 */
export function FailureHits({ segments, byId, view, direction, onDoubleClick }) {
  const [v0, v1] = view
  const pct = s => `${((s - v0) / (v1 - v0)) * 100}%`
  return segments.map((s, i) => {
    if (s.end < v0 || s.start > v1) return null
    const cmds = s.ids.map(id => byId.get(id))
    return (
      <LTPopover key={`${s.start}-${i}`} direction={direction} canChangeDirection
        heading={summaryHeading(cmds)} popOverbodyJSX={<FailureSummary cmds={cmds} />}>
        <span className="fail-hit" data-seg={i} aria-hidden="true"
          style={{ left: pct((s.start + s.end) / 2), width: `max(12px, ${pct(v0 + (s.end - s.start))})` }}
          onDoubleClick={onDoubleClick ? e => { e.stopPropagation(); onDoubleClick(s) } : undefined} />
      </LTPopover>
    )
  })
}
