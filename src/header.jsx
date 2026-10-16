// Test header: brief items 1 to 5. Spec: automation-details.md §3 and §4.
import React, { useState } from 'react'
import { Bug, Clock, Ellipsis, History, Maximize, Minimize, Monitor, PanelLeftOpen, Share2, Trash2, Zap } from 'lucide-react'
import { LTButton, LTIconButton, LTTooltip, LTCopyToClipboard, LTTestStatusLabel, LTMetaData, LTLink, cx } from './lt.jsx'
import { LTActionMenu, LTInlineTextInput } from './overlays.jsx'
import { fmtDateTime, fmtDuration, fmtRelative } from './format.js'

export function TestHeader({ test, name, onRename, onMenu, fullscreen, onToggleFullscreen, onStub,
  testsCollapsed, onExpandTests }) {
  const [titleHover, setTitleHover] = useState(false)
  const updated = test.updatedAt
  return (
    <header className="td-head">
      <div className="td-title-row">
        {testsCollapsed && (
          <LTIconButton icon={PanelLeftOpen} ariaLabel="Expand tests pane" variant="invisible"
            onClick={onExpandTests} className="td-expand-tests" />
        )}
        {/* Item 2. Hovering the title draws the input's border; the copy
            button shows on that hover and whenever it has keyboard focus. */}
        <div className={cx('td-titlewrap', titleHover && 'is-hover')}
          onMouseEnter={() => setTitleHover(true)} onMouseLeave={() => setTitleHover(false)}>
          <h1 className="td-title">
            <span className="vh">{name}</span>
            <LTInlineTextInput value={name} onCommit={onRename} ariaLabel="Test name" size="large"
              validationMessage="Enter a test name." />
          </h1>
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
            anchor={<LTIconButton variant="outline" icon={Ellipsis} ariaLabel="More actions" />}
            onSelect={o => onMenu(o.value)}
            options={[
              { value: 'share', label: 'Share', icon: Share2, trailing: 'S', keyshortcuts: 'S' },
              { value: 'history', label: 'View history', icon: History },
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
        {test.status !== 'queued' && <LTMetaData leadingIcon={Clock} label="Duration" value={fmtDuration(test.durationSec)} />}
        <LTMetaData>
          <LTLink href="#test-case" muted aria-label={`Test case ${test.testCaseId}`}
            onClick={e => { e.preventDefault(); onStub(`Test case ${test.testCaseId} opens in Test Manager.`) }}>
            {test.testCaseId}
          </LTLink>
        </LTMetaData>
        <LTMetaData label="Browser" value={`${test.browser} ${test.browserVersion}`} />
        <LTMetaData label="Operating system" value={`${test.os} ${test.osVersion}`} />
        <LTMetaData leadingIcon={Monitor} label="Resolution" value={test.resolution} />
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
    </header>
  )
}
