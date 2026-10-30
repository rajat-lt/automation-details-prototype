// Test header: brief items 1 to 5, v2 items 12 and 13, v3 items 1 and 2,
// v4 items 3 and 4. Spec: automation-details.md §3, §4, §4b, §4c and §4d.
import React, { useId, useLayoutEffect, useRef, useState } from 'react'
import {
  Bug, Clock, Ellipsis, History, Keyboard, Maximize, Minimize, Monitor, PanelLeftOpen, Share2, Smartphone, Trash2, Unlink, Zap,
} from 'lucide-react'
import { LTButton, LTIconButton, LTTooltip, LTCopyToClipboard, LTTestStatusLabel, LTMetaData, LTLink, cx } from './lt.jsx'
import { LTActionMenu, LTInlineTextInput } from './overlays.jsx'
import { fmtDateTime, fmtDuration, fmtRelative } from './format.js'
import { SetupClock } from './setup.jsx'

/* v3 item 2: the test run's remarks, under the meta row, only when there
   are some. One line by default, cut to the width the header has; when that
   cuts it, View All at the end of the line shows every line, and Show Less
   folds it back. Measured on every resize, so a remark that fits shows no
   button. v4 item 3: the label ends in a colon, as the brief asks, against
   the text guide's no-punctuation rule for labels (C35). */
function Remarks({ text }) {
  const [open, setOpen] = useState(false)
  const [cut, setCut] = useState(false)
  const ref = useRef(null)
  const id = useId()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || open) return
    const measure = () => setCut(el.scrollWidth > el.clientWidth + 1)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [text, open])
  return (
    <div className={cx('td-remarks', open && 'is-open')}>
      <span className="td-remarks__label">Remarks:</span>
      <span ref={ref} id={id} className="td-remarks__text">{text}</span>
      {(cut || open) && (
        // The brief's "view all link": a link's look on a button, since it
        // acts in place (guidelines/README.md §5), the same treatment as
        // "Show 20 passed logs" (C2). Standalone, so Title Case
        // (ux-text-guidelines.md §2).
        <button type="button" className="td-remarks__toggle" aria-expanded={open} aria-controls={id}
          onClick={() => setOpen(o => !o)}>
          {open ? 'Show Less' : 'View All'}
        </button>
      )}
    </div>
  )
}

export function TestHeader({ test, name, onRename, onMenu, fullscreen, onToggleFullscreen, onStub,
  testsCollapsed, onExpandTests, linked, onUnlink, onLink }) {
  const [titleHover, setTitleHover] = useState(false)
  const [titleTip, setTitleTip] = useState('')
  const updated = test.updatedAt
  // v2 items 13 and 16: the name takes all the width the row has left, and
  // only when that runs out does it end in an ellipsis, with the full name on
  // hover. Measured at the moment of hover, never while editing.
  const checkTitle = e => {
    const input = e.currentTarget.querySelector('input')
    setTitleTip(input && document.activeElement !== input && input.scrollWidth > input.clientWidth + 1 ? name : '')
  }
  return (
    <header className="td-head">
      {/* v4 item 4: the expand button has a column of its own, so the meta
          row and the remarks line up with the test name instead of starting
          under the button. */}
      {testsCollapsed && (
        <span className="td-expand">
          <LTIconButton icon={PanelLeftOpen} ariaLabel="Expand tests pane" variant="invisible"
            onClick={onExpandTests} />
        </span>
      )}
      <div className="td-main">
        <div className="td-title-row">
          {/* Item 2. Hovering the title draws the input's border; the copy
              button shows on that hover and whenever it has keyboard focus. */}
          <div className={cx('td-titlewrap', titleHover && 'is-hover')}
            onMouseEnter={() => setTitleHover(true)} onMouseLeave={() => setTitleHover(false)}>
            <LTTooltip text={titleTip} direction="bottom">
              <h1 className="td-title" onMouseEnter={checkTitle} onFocus={() => setTitleTip('')}>
                <span className="vh">{name}</span>
                <LTInlineTextInput value={name} onCommit={onRename} ariaLabel="Test name" size="large"
                  validationMessage="Enter a test name." />
              </h1>
            </LTTooltip>
            <span className="td-copy">
              <LTCopyToClipboard textToCopy={test.testId} copyAriaLabel="Copy test ID"
                copiedAriaLabel="Test ID copied" tooltipDirection="n" />
            </span>
          </div>

          {/* Item 5, in the screenshot's order. "View" carries its full name:
              the label must hold the meaning, icons are decorative (C6). */}
          <div className="td-actions">
            <LTButton variant="outline" size="medium" leadingIcon={Zap} label="View in HyperExecute"
              onClick={() => onStub('The HyperExecute job for this test opens here.')} />
            <LTIconButton variant="outline" icon={Bug} ariaLabel="Raise a bug"
              onClick={() => onStub('The bug form for your linked issue tracker opens here.')} />
            <LTIconButton variant="outline" icon={fullscreen ? Minimize : Maximize}
              ariaLabel={fullscreen ? 'Exit full screen' : 'Enter full screen'} onClick={onToggleFullscreen} />
            <LTActionMenu ariaLabel="More actions" width={248}
              customAnchor={<LTIconButton variant="outline" icon={Ellipsis} ariaLabel="More actions" />}
              onSelect={o => onMenu(o.value)}
              options={[
                { value: 'share', label: 'Share', icon: Share2, trailing: 'S', keyshortcuts: 'S' },
                { value: 'history', label: 'View history', icon: History },
                { value: 'shortcuts', label: 'Keyboard shortcuts', icon: Keyboard, trailing: '?', keyshortcuts: '?' },
                { divider: true },
                { value: 'delete', label: 'Delete', icon: Trash2, variant: 'danger' },
              ]} />
          </div>
        </div>

        {/* Item 1: one condensed row, middle dots between items, an ellipsis
            when it runs out of room. Browser, OS and framework are words:
            icons.md has no brand marks (C14). */}
        <p className="td-meta">
          <LTTestStatusLabel status={test.status} showStatusText />
          {/* Setup state: a running test's duration ticks its elapsed time
              (ux-text-guidelines.md §7; spec §12.2). */}
          {test.status !== 'queued' && <LTMetaData leadingIcon={Clock} label="Duration"
            value={test.status === 'running' ? <SetupClock /> : fmtDuration(test.durationSec)} />}
          <LTMetaData>
            {linked ? (
              // v2 item 12: Unlink sits right beside the test case ID. v3 item 1:
              // always shown, aligned to the row's text, with no empty gap.
              <span className="tc-link">
                <LTLink href="#test-case" muted aria-label={`Test case ${test.testCaseId}`}
                  onClick={e => { e.preventDefault(); onStub(`Test case ${test.testCaseId} opens in Test Manager.`) }}>
                  {test.testCaseId}
                </LTLink>
                <LTIconButton icon={Unlink} ariaLabel="Unlink test case" variant="invisible" size="xsmall"
                  tooltipDirection="s" className="tc-unlink" onClick={onUnlink} />
              </span>
            ) : (
              // The base pattern's unlinked state, as a standalone action link.
              <button type="button" className="lt-link lt-link--muted meta-linkbtn" data-focus="link-tc" onClick={onLink}>
                Link a Test Case
              </button>
            )}
          </LTMetaData>
          {/* A device test shows its device and OS instead of a browser and a
              resolution (setup state, spec §12.2). */}
          {test.platform === 'mobile' ? (
            <>
              <LTMetaData leadingIcon={Smartphone} label="Device" value={test.device} />
              <LTMetaData label="Operating system" value={`${test.os} ${test.osVersion}`} />
            </>
          ) : (
            <>
              <LTMetaData label="Browser" value={`${test.browser} ${test.browserVersion}`} />
              <LTMetaData label="Operating system" value={`${test.os} ${test.osVersion}`} />
              <LTMetaData leadingIcon={Monitor} label="Resolution" value={test.resolution} />
            </>
          )}
          <LTMetaData label="Framework" value={test.framework} />
          <LTMetaData value={test.tunnel ? 'Tunnel on' : 'Tunnel off'} />
          {/* Items 3 and 4: tooltips on focusable text (C1). */}
          <LTMetaData>
            {'Updated '}
            <LTTooltip type="description" text={fmtDateTime(updated)} direction="bottom">
              <time className="meta-hint" tabIndex={0} dateTime={updated.toISOString()}>{fmtRelative(updated)}</time>
            </LTTooltip>
            {' by '}
            <LTTooltip type="description" text={test.updatedByEmail} direction="bottom">
              <span className="meta-hint meta-person" tabIndex={0}>{test.updatedBy}</span>
            </LTTooltip>
          </LTMetaData>
        </p>
        {test.remarks && <Remarks key={test.id} text={test.remarks} />}
      </div>
    </header>
  )
}
