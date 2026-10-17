# Automation test details: 18 UX changes, then 16, then 11 more

The automation test details page with Rajat's 18 changes of 16 Oct 2026 applied. Written in the `design-context/patterns/` house format, as an amendment proposal for `patterns/automation-details.md`. The working prototype in this repo implements it.

Precedence, as the house workflow sets it: **Rajat's brief > design-context guidelines > screenshots**. The nine screenshots attached to the brief count as brief where its text points at them ("see attached ss") and as reference everywhere else, so copy, icons and colours in them follow the guidelines. Every conflict is recorded in §6, never resolved silently.

Sources, all read from `design-context` `main` (e014a73) on 16 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/README.md` and the component files, `patterns/automation-details.md` (the base pattern), `patterns/automation-listing.md`, `patterns/hyperexecute-job-details.md`, `patterns/test-instance-details.md`, `patterns/modal.md`, `patterns/topbar.md`, `patterns/platform-sidebar.md`, `COMPONENTS.md`, `mock-data.md`, `icons.md` and `data/tokens.json`.

Every component and prop below was read from `COMPONENTS.md`. Proposals carry **[proposed]**.

**v2, 17 Oct 2026.** Rajat's second brief (16 changes) and his answers to §10 are applied. Its items are written *v2 item 1* to *v2 item 16*, beside the first brief's items 1 to 18; §4b, §6 (C20 to C28), §7b and the v2 rows of every other section cover them. Sources were read again from `design-context` `main` (still `e014a73`) on 17 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/README.md`, `ltpopover.md`, `ltactionmenu.md`, `lttooltip.md`, `ltunderlinenav.md`, `ltsegmentedcontrol.md`, `lticonbutton.md`, `ltmodal.md`, `notification-messaging.md`, `COMPONENTS.md` (with its story source snippets in `data/raw/components.json`), `patterns/automation-details.md`, `patterns/module-details.md`, `patterns/topbar.md`, `guidelines/ltbreadcrumbs.md`, `mock-data.md` and `icons.md`. Two outside sources were read for v2: NN/g's [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) (Jakob Nielsen, last reviewed Jan 30, 2024) for v2 item 11, and MDN's [Document Picture-in-Picture API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API) for v2 item 5.

**v3, 18 Oct 2026.** Rajat's third brief: 11 items, two of them reminders (no hallucination; nothing already built may break). Its items are written *v3 item 1* to *v3 item 11*: §4c, conflicts C29 to C33, §7c and the v3 rows of every other section. Sources read again from `design-context` `main` (still `e014a73`) on 18 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/lttextarea.md`, `ltpopover.md`, `COMPONENTS.md` (`LTTextarea`, `LTPopover`) and `mock-data.md` (people, devices).

---

## 1. What this page is

Unchanged from the base pattern: a debugging surface for one automation test, with its commands, logs and session video. What changes is how fast the user gets from "this test failed" to "this is the command that failed, and this is what the video shows at that moment".

| Region | Base pattern (4 Sep 2026) | After the 18 changes |
|---|---|---|
| Tests pane | 400px, collapsible | Same, and resizable between 320px and 480px (item 14) |
| Header | Title, then a four-column metadata block, then four buttons | Inline-editable title with a copy-test-ID button, one condensed meta row, and a re-aligned action group (items 1 to 5) |
| Detail | Six tabs plus More, command tree with its own scrolls | Four tabs with a command counter; the All Commands tab is one scroll with a timeline, sticky parents and progressive disclosure (items 6 to 12, 15 to 18) |
| Video | 480px pane on the right | Docks right of the logs (default) or below them, resizable; custom control bar with failure markers (items 9, 13, 14) |

**What v2 changes (17 Oct 2026)**

| Region | After the 18 changes | After v2 |
|---|---|---|
| Header | Editable title, condensed meta row, actions | Unlink beside the test case ID on hover (v2 item 12). The name and the breadcrumb use the width they have and show the full name on hover only when cut (v2 items 13, 16). Keyboard shortcuts in More actions [proposed] |
| Tabs | Four tabs | Reorderable by dragging, or from each tab's own menu (v2 item 1) |
| All Commands | One scroll, timeline, disclosure, sticky parents | Right-click menu on a command (v2 item 2); Space to the next failure (v2 item 3); one JSON or table setting for every command (v2 item 4); arrow keys between rows (v2 item 7); failure popovers and double-click zoom on the timeline (v2 items 8, 9); table copy (v2 item 10); full text of cut text on hover (v2 item 16); Expand all opens every command too (answer 1) |
| Video | Docked, one-row control bar | Picture-in-picture and collapse (v2 item 5); three rows, with a command line that carries Raise a bug and Copy payload at a failure (v2 items 6, 11); failure popovers (v2 item 8); Cmd or Ctrl plus the wheel seeks (v2 item 14) |
| Screenshot dialog | The image | The command's facts, plus download, bug and link (v2 item 15) |
| Time | `00:18`, `0:20`, `2:04` | One form, `m:ss` (answer 6) |

**What v3 changes (18 Oct 2026)**

| Region | After v2 | After v3 |
|---|---|---|
| Header | Unlink shown on hover, with its space kept; the ID 3px low | Unlink always shown, on the row's baseline (v3 item 1). Remarks under the meta row: one line, **View All** for the rest (v3 item 2) |
| All Commands | One row height; counts as a readout | Comfortable or condensed rows (v3 item 3); the counts filter by status (v3 item 9); comments on failed commands (v3 item 6); tables on white (v3 item 8) |
| Failure popovers | Close when the pointer leaves | Stay open to copy from; a single failure carries Raise a bug, Copy payload and a comment action; a new reading order (v3 item 4) |
| Timeline | Failure stretches | A comment mark above every stretch with a comment (v3 item 6.2) |
| Video | Controls below the frame everywhere; Rotate for every test | Controls right of the frame while the logs are docked below (v3 item 7); Rotate only for mobile (v3 item 10); a comment action on the failure line |

## 2. Component inventory

| Component | Where | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTInlineTextInput` | Test name (item 2) | `value`, `onChange`, `onBlur`, `onKeyDown`, `ariaLabel`, `showEditTooltip={false}` (C18), `selectOnFocus`, `validationStatus`, `maxLength`, `size="large"` |
| `LTCopyToClipboard` | Copy test ID (item 2) | `textToCopy`, `copyAriaLabel="Copy test ID"`, `copiedAriaLabel="Test ID copied"`, `buttonVariant="invisible"` |
| `LTTestStatusLabel` | Header pill, rows, summaries | `status`, `showStatusText` (true in the header pill only), `width`, `height` |
| `LTMetaData` | Each item of the condensed meta row (item 1) | `leadingIcon`, `value`, `showLeadingDot`, `size="medium"` |
| `LTTestHeader` | Candidate for the whole header | Its props (`status`, `totalTime`, `clockIcon`, `browser`, `browserIcon`, `osName`, `osVersion`, `osIcon`, `resolution`, `resolutionIcon`, `isTunnelActive`, `tunnelIcon`, `timeSince`, `username`, `headerActions`) match the condensed row one for one. Not used directly: it documents no hook for an editable title or for tooltips on `timeSince` and `username`. See open question 1 |
| `LTTooltip` | Absolute time, email, every icon button | `direction`, `delayDuration` (400) |
| `LTButton` | View in HyperExecute, Tests filter, disclosure, Try Again | `variant`, `size`, `label`, `leadingIcon`, `trailingIcon` |
| `LTIconButton` | Raise a bug, full screen, timeline controls, row actions | `ariaLabel`, `icon`, `variant`, `size`, `tooltipDirection`, `keyshortcuts` |
| `LTActionMenu` | More actions (item 5), Tests filter, playback speed | `anchorType="icon"`, `options`, `menuOverlayPosition`, `selectionVariant="single"` (filter, speed), `width` |
| `LTButtonGroup` | Previous and next failed command (item 8) | `children`, with `role="toolbar"` and a label, per `guidelines/ltbuttongroup.md` |
| `LTUnderlineNav` | All Commands, Logs, Network, Meta Data | `navs` (shape TBD, story `ltunderlinenav--with-counters`), `ariaLabel`, `size` |
| `LTCounterLabel` | 93 on the All Commands tab (item 11), timeline counts | `count`, `scheme` |
| `LTSegmentedControl` | Dock position (item 13), Request and Response | `options` (TBD, story `ltsegmentedcontrol--icon-buttons`), `selectedValue`, `onChange`, `ariaLabel`, `isIconButton`, `showTooltip`, `variant="small"` |
| `LTInputBox` | Search commands (item 10), Search tests, log search | `inputOnly`, `type="search"`, `variant="default"`, `allowClearSearch`, `forwardRef`, `colorScheme="dark"` on the log console |
| `LTTag` | Locator strategy chips, HTTP status | `text`, `labelStyle="outline"`, `variant` (`secondary`, `success`, `danger`), `size="small"` |
| `LTSkeletonBox` | Disclosure loading (item 6), list loading | `width`, `height`, `radius`, `delay` |
| `LTCodeBlock` | Request and response payloads, the Logs console | `children`, `title`, `headerActions` |
| `LTAccordionWrapper` | Annotation and test case groups (item 15) | `isMultiOpen`, `showArrowAtEnd={false}` (its default, which puts the chevron at the start, as the brief shows). Composed rather than used: sticky headers and the indent rule are not props. See open question 2 |
| `LTSectionSlider` | Tests pane collapse | `position="left"`, `defaultExpanded`, `width`, `onSliderChange`. Resizing is not a prop, so the splitter is composed |
| `LTLink` | `#TC-88904` in the meta row, test rows | `href`, `label`, `muted` |
| `LTBreadcrumbs` | Top bar: Builds, build, test | `items`, `separator="/"`, `maxCharsPerItem={20}` |
| `LTModal` | Delete confirmation, command screenshot | `title`, `isOpen`, `onClose`, `renderFooter`, `initialRef`, `extraStyle={{ width }}` |
| `LTDrawer` | View history | `title`, `width={480}`, `content` |
| `LTToast` | Share, Delete, simulated actions | top right, 4 seconds (`guidelines/README.md` §7) |
| `LTBlankSlate`, `LTFlash`, `LTLoader` | Empty, error and loading states | as in the base pattern |
| `LTTable` | Meta Data | `columns`, `data`, `allowValueCopy` |

**Built custom and flagged, per `guidelines/README.md` §10:** the range timeline (item 7), the splitters (item 14), the video player and its control bar (no video component exists), the dock layout (item 13). See §9.

**Added in v2:**

| Component | Where | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTPopover` | Failure details on hover, on the video's seek bar and the timeline (v2 item 8) | `heading`, `popOverbodyJSX`, `direction`, `canChangeDirection`, `openOnClick={false}`: it opens on hover, as its own story `ltpopover--popover` does. C20 |
| `LTActionMenu` | Right-click menu on a command (v2 item 2), each tab's menu (v2 item 1), More video actions (v2 item 11), playback speed | `open` and `onMenuToggle` (controlled mode, story-verified) with a `customAnchor` at the pointer, `selectionVariant="single"` and `activeId` for speed. The look-alike now uses `customAnchor` and `activeId`; v1 called them `anchor` and `selectedValue` |
| `LTToast` | Undo after unlinking (v2 item 12), copy results | the secondary action (story `lttoast--with-secondary-action`) |
| `LTIconButton` | Unlink test case (`size="xsmall"`, beside text, as `lticonbutton.md` allows), picture-in-picture, collapse, dock, move, row actions | `ariaLabel`, `icon`, `size`, `variant`, `tooltipDirection`, `inactive` |
| `LTTag` | The zoomed window (`leadingVisual`), status in the screenshot dialog and the failure popovers | `text`, `variant`, `leadingVisual` (`icons.md`, "How icons are passed") |
| `LTModal` with `LTTable` | Keyboard shortcuts [proposed]; the screenshot dialog's command facts | `title`, `isOpen`, `onClose`, `extraStyle={{ width: 480 }}` |
| `LTCopyToClipboard` | Copy payload on the command line (v2 item 6) | `textToCopy`, `copyAriaLabel`, `copiedAriaLabel` |
| `LTSegmentedControl` | Dock position, while the video is docked | unchanged; segments renamed to nouns (C27) |

**Added in v3:**

| Component | Where | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTTextarea` | Writing a comment (v3 item 6) | `label`, `required`, `rows={3}`, `resize="vertical"`, `value`, `onChange`, `placeholder`, `caption` (the live count), `validationStatus`, `validationMessage`, `forwardRef`. There is no length prop, so the 500-character limit is validation (C33) |
| `LTButton` | Cancel and Save; the passed and failed counts as toggles (v3 item 9) | `variant`, `size`, `label`, `inactive`, `ariaLabel`, with `aria-pressed` for the toggles |
| `LTPopover` | Failure popovers, now interactive (v3 item 4) | `containsInteractiveChildElement`, `forceClose`, plus v2's props. With interactive content it follows `ltpopover.md`: a visible close button, Esc and click-outside |
| `LTIconButton` | Add comment, Edit comment, the density toggle, Download video | as before |
| `LTAvatar` | The comment's author | `initials`, `name`, `size` |

**Built custom and flagged in v2:** tab reordering around `LTUnderlineNav` (v2 item 1); the right-click menu's anchor (v2 item 2); the floating video window (v2 item 5); copy buttons with another icon or rich content, for Copy link and Copy table (v2 items 2, 10, 15), because `LTCopyToClipboard` has a fixed icon and copies plain text; the "full text when cut" tooltip helper (v2 item 16). See §9.

## 3. Structure

```jsx
<TestDetails>
  {/* Header: items 1 to 5 */}
  <Header>
    <TitleRow>
      {/* title/medium, the sanctioned override (guidelines/README.md §3).
          Measured 20px in the brief's screenshot. Hover shows the input's
          border; the copy button appears on hover and on keyboard focus. */}
      <LTInlineTextInput size="large" value={test.name} ariaLabel="Test name"
        showEditTooltip={false} />
      <LTCopyToClipboard textToCopy={test.id} copyAriaLabel="Copy test ID"
        copiedAriaLabel="Test ID copied" />
      <Actions>{/* right-aligned, 8px apart */}
        <LTButton variant="outline" size="medium" leadingIcon={Zap} label="View in HyperExecute" />
        <LTIconButton variant="outline" ariaLabel="Raise a bug" icon={Bug} />
        <LTIconButton variant="outline" ariaLabel="Enter full screen" icon={Maximize} />
        <LTActionMenu anchorType="icon" ariaLabel="More actions" options={[
          { label: "Share", icon: Share2, trailing: "S" },
          { label: "View history", icon: History },
          "divider",
          { label: "Delete", icon: Trash2, variant: "danger" },
        ]} />
      </Actions>
    </TitleRow>
    {/* Condensed meta row: LTMetaData items with the leading dot. */}
    <MetaRow>
      <LTTestStatusLabel status="failed" showStatusText />
      <LTMetaData leadingIcon={Clock} value="3m 20s" />
      <LTMetaData value={<LTLink muted label="#TC-88904" />} />
      <LTMetaData value="Chrome 120" /> <LTMetaData value="Windows 12" />
      <LTMetaData leadingIcon={Monitor} value="1920x1080" />
      <LTMetaData value="Selenium" /> <LTMetaData value="Tunnel on" />
      {/* Items 3 and 4: tooltips on focusable text. */}
      <LTMetaData value={<>Updated <LTTooltip text="Oct 16, 2026, 08:21 AM">6 hours ago</LTTooltip>
        {" by "}<LTTooltip text="ritika.sharma@dundermifflin.com">Ritika Sharma</LTTooltip></>} />
    </MetaRow>
  </Header>

  {/* Item 13: logs dock left of the video (default) or below it.
      Item 14: every boundary is a splitter with min and max. */}
  <Workspace dock={dock}>
    <LogsSection>
      <TabBar>
        <LTUnderlineNav navs={[
          { label: "All Commands", counter: 93 },   /* item 11 */
          { label: "Logs" }, { label: "Network" }, { label: "Meta Data" },
        ]} />
        <LTSegmentedControl isIconButton ariaLabel="Logs position" options={[
          { value: "side", icon: PanelLeft, label: "Dock left of the video" },
          { value: "bottom", icon: PanelBottom, label: "Dock below the video" },
        ]} />
      </TabBar>
      {/* Item 17: ONE scroll container for the whole tab. */}
      <CommandsScroll>
        {/* Sticky; slides away on scroll down, back on scroll up. */}
        <Toolbar>
          <TimelineHeader>  {/* item 7 */}
            <LTText as="h2" variant="SUBHEADER_BOLD" text="Timeline" />
            <PassFail passed={73} failed={20} />
            <LTIconButton ariaLabel="Reset timeline" icon={Undo2} />          {/* item 8 */}
            <LTIconButton ariaLabel="Expand all groups" icon={ChevronsUpDown} />
            <LTButtonGroup role="toolbar" aria-label="Failed commands">       {/* item 8 */}
              <LTIconButton ariaLabel="Previous failed command" icon={ChevronUp} />
              <LTIconButton ariaLabel="Next failed command" icon={ChevronDown} />
            </LTButtonGroup>
          </TimelineHeader>
          <RangeTimeline duration={200} failures={segments} playhead={t} />  {/* custom */}
          <LTInputBox type="search" placeholder="Search commands (/)" />     {/* item 10 */}
          <LTButton variant="outline" label="Tests: All" trailingIcon={ChevronDown} />
        </Toolbar>
        <CommandList>
          {/* Item 15: two parent types, one level deep. Item 18: indent rule. */}
          <Group kind="annotation" title="Open https://www.airbnb.com" />
          <Group kind="testCase" id="#TC-7742" title="Filter and Verify Product Search Results" />
          {/* Item 6: a run of passed commands collapses to one row. */}
          <LTButton variant="link-look" label="Show 20 passed logs" />
          <CommandRow />  {/* status, name, LTTag strategy, value, details, duration, offset */}
        </CommandList>
      </CommandsScroll>
    </LogsSection>
    <Splitter />
    <VideoPane>{/* custom player, control bar with failure markers */}</VideoPane>
  </Workspace>
</TestDetails>
```

### 3b. Structure after v2

```jsx
<LogsSection>
  {/* v2 item 1: drag a tab, or open its menu (right-click, Shift + F10):
      Move left, Move right, Reset tab order. */}
  <ReorderTabs order={tabOrder}>
    <LTUnderlineNav navs={tabsInUserOrder} trailing={
      videoMode === "docked" ? <LTSegmentedControl ariaLabel="Logs position" /* item 13 */ />
      : videoMode === "pip" ? <LTButton variant="outline" label="Dock Video" />
      : <LTButton variant="outline" label="Show Video" />  /* v2 item 5: the way back */
    } />
  </ReorderTabs>
  <CommandsScroll>{/* as §3, plus the right-click menu and roving focus */}</CommandsScroll>
</LogsSection>

<VideoPane mode="docked">          {/* or inside <PipWindow>, v2 item 5 */}
  <Stage />
  <Controls>
    {/* v2 items 6 and 11: the command at the playhead. At a failure it turns
        red, names the type in words and carries Raise a bug and Copy payload. */}
    <NowLine />
    <SeekBar />                    {/* the whole width; LTPopover per failure (v2 item 8) */}
    <Row>
      <LTIconButton ariaLabel="Play" /> 1:16 / 3:20 <SpeedMenu label="1x" />
      <Spacer />
      <LTIconButton ariaLabel="Open picture-in-picture" />
      <LTIconButton ariaLabel="Collapse video" />
      <LTIconButton ariaLabel="Enter full screen" />
      <LTActionMenu title="More video actions" /* Download video, Rotate video */ />
    </Row>
  </Controls>
</VideoPane>

{/* v2 item 5: floats over the page, moves by its header, resizes from its
    top-left corner between 320px and the smaller of 640px and half the window. */}
<PipWindow>
  <Header>Move video · {test name} · Dock video · Collapse video</Header>
  <VideoPane mode="pip" />
</PipWindow>
```

## 4. Behaviour, item by item

1. **Condensed meta row.** One line under the title, items joined by a middle dot (`LTMetaData showLeadingDot`). Order follows the brief's screenshot: status pill, duration, linked test case, browser, OS, resolution, framework, tunnel, updated by. When space runs out the row ends in an ellipsis and stays one line.
2. **Inline-editable title.** Hover draws the input's border, which says "editable"; there is no edit tooltip (C18). Click to edit, which selects the name; Enter or blur saves; Esc restores. An empty name is refused with *Enter a test name.* The new name updates the breadcrumb, the tests pane and the browser tab, and screen readers hear *Test name updated*. Beside the title, a copy button copies the test ID; it shows on hover of the title and whenever it has keyboard focus, so keyboard users reach it. After copying, its icon becomes a tick for 2 seconds, its tooltip reads *Copied*, and screen readers hear *Test ID copied*.
3. **Absolute time on hover.** `6 hours ago` shows `MMM DD, YYYY, HH:MM AM/PM` in a tooltip: *Oct 16, 2026, 08:21 AM*. The text is focusable, so the tooltip also opens on keyboard focus.
4. **Email on hover.** The user's name shows their email in a tooltip, same treatment as item 3.
5. **Action group.** Right-aligned, 8px apart, in the brief's order: View in HyperExecute, Raise a bug, full screen, More actions. The menu holds Share (shortcut `S`), View history, a divider, and Delete in the danger variant. Delete confirms in a 480px modal (§5).
6. **Progressive disclosure.** In a failed test, every run of 3 or more consecutive passed commands collapses to one row: *Show 20 passed logs*. Selecting it shows skeleton rows for 600ms, then the commands, and moves focus to the first one. Runs of 1 or 2 stay visible, because a disclosure row would take the same space **[proposed]**. A group whose commands all passed stays collapsed, so its header still shows. Passed tests show every command.
7. **Timeline.** A seek bar across the run, with the failures in red. The handles select a time window, and the list shows only the commands inside it. A click on the bar seeks the video. A vertical line shows where the video is.
8. **Timeline controls.** Chevron up and down jump to the previous and next failed command, by the video's position; at either end the button stays focusable but inactive and says so. The undo icon resets the window to the whole run.
9. **Highlight on jump.** Whenever the video jumps (a timeline click, previous or next failure, a command's timestamp, a marker or the video's own seek bar), the command at that moment scrolls into view and is highlighted in the accent tint, which fades over 2 seconds. If it sat inside a collapsed group or a disclosure, those open first.
10. **`/` focuses search.** Anywhere on the page, unless the user is typing in a field. The placeholder carries the shortcut until a keyboard hint component exists (`guidelines/README.md` §10).
11. **Counter on the tab.** All Commands carries an `LTCounterLabel` with the total, 93. It counts rows in the tab, per `ux-text-guidelines.md` §7.
12. **Lighter rows.** Dividers drop to `neutral.subtle`, rows grow to 48px and align on one rail. The failed row tint is `danger.subtle` at about 40%, as measured in the brief.
13. **Dock.** An icon-only segmented control at the end of the tab bar puts the logs left of the video (default) or below it, like Chrome DevTools. The choice is remembered.
14. **Resizable sections.** Every boundary between sections has a splitter, draggable and keyboard operable (arrow keys move 16px, Home and End go to the limits, double-click restores the default). Limits **[proposed]**: tests pane 320 to 480px; video 320px wide to whatever leaves the logs 480px; docked below, the video is 200px tall up to 60% of the space.
15. **Test case as a parent.** A command's parent is either an annotation or a test case, one level deep. A test case header leads with its ID (`#TC-7742`) in muted text; an annotation header shows its name only. Both show `{n} total · {passed} · {failed}`.
16. **Failed tests open at the failure.** On load, passed runs are collapsed (item 6) and the list scrolls the first failed command into view, under the sticky toolbar, and highlights it once (item 9).
17. **One scroll.** The All Commands tab has a single vertical scroll, and nothing inside it scrolls on its own (payloads grow to their height). Scrolling down slides the timeline and search away and keeps the current group's header pinned at the top. Scrolling up brings the timeline and search back, with the group header pinned below them. The toolbar stays while it has focus or hover, and while a scroll it started is running, so pressing Next failed command twice still works **[proposed]**.
18. **Indent rule.** An expanded group draws a vertical line from its chevron to its last command (`border.muted`, measured), so a group's start and end read at a glance.

## 4b. Behaviour, v2 (17 Oct 2026)

1. **Reorderable tabs.** Drag a tab sideways; past 4px it lifts, follows the pointer, and the other tabs slide aside to show where it will land. Esc puts it back. The click that ends a drag never opens the tab. The same moves live in each tab's own menu (right-click, Shift + F10 or the menu key): *Move left*, *Move right* and *Reset tab order*. A move that is impossible stays in the menu, inactive, with its reason (*Already the first tab*). That is design-context's own answer for reordering without a drag component (`patterns/module-details.md`, open question 3: move up and move down in the item's own menu). The order is remembered in the browser [proposed], and screen readers hear *Logs moved to position 1 of 4*.
2. **Right-click on a command.** On a command row, never on its group, the browser's menu gives way to *Copy payload*, *Copy link* and, after a divider, *Raise a bug*. From the keyboard, Shift + F10 or the menu key opens it under the focused row. Copy payload copies the request and the response as one JSON [proposed] (C25). Copy link copies the command's link in this test run, `#/{test}/commands/{command}`. The menu closes, so a toast says what happened: *Payload of Find Element at 1:16 copied.* If the clipboard refuses, the toast says so and what to do: *... failed to copy. Try again.* Opening a command's link opens the test at that command: filters that would hide it are cleared, its group and passed run open, its details open, the video moves to its moment, and the row is focused and highlighted. The link never opens the screenshot dialog: `ltmodal.md` says not to deep-link straight into a modal. The visible twin is a *Copy link* button in every command's details.
3. **Space.** Brings the next failed command into view and focuses it; after the last it starts again from the first (cyclic). Shift + Space goes back [proposed]. Only the list moves; the video stays where it is, as the brief asks ("it simply bring them in-view"); the timeline's chevrons are the controls that also move the video. It works on the All Commands tab whenever focus is on the page, on a row, or on anything else in the list. Inside the list Space means this on every row, buttons included, and Enter activates. Elsewhere (the toolbar, the video, a field) Space keeps its usual meaning. Screen readers hear *Failed command 3 of 20: Find Element at 1:16*. A passed test answers *All commands passed*.
4. **One payload view for every command.** Switching one command between JSON and table switches them all and is remembered, like the code theme. The button names the view it switches to: *Show as table*, *Show as JSON* (the brief's "show json"; v1 said *Show as code*).
5. **Picture-in-picture and collapse.** Two buttons on the video's control row. *Open picture-in-picture* floats the video in a small window over the page; the logs take the whole width. The window carries the same seek bar, failure markers, command line and controls, and it shares the one playhead, so every jump from the list moves it and every jump in it reveals its command (item 9). It moves by its header (or its grip and the arrow keys), resizes from its top-left corner between 320px and the smaller of 640px and half the window [proposed thresholds], always stays fully on screen, and remembers where it was. Its header holds *Dock video* and *Collapse video*. *Collapse video* hides the video and pauses it; the end of the tab bar then shows **Show Video**, which brings back the docked view, at its dock position and size. Each change moves focus to the control that reverses it and is announced (*Video collapsed. Show Video brings it back.*). Why a window in the page rather than the browser's own: §7b.
6. **Actions at a failure.** When the playhead is on a failure (seeked there, or playing through it), the command line above the seek bar turns red and reads *404 Not Found · Find Element* with the locator, followed by **Raise a bug** and **Copy payload**. A failure counts for at least 2 seconds, so a 120ms one stays readable while the video plays [proposed]. Away from failures the line names the command the video is on.
7. **Arrow keys between commands.** The list is one tab stop. Up and Down move focus to the previous or next row (group headers, commands and *Show n passed logs* rows, in screen order); Home and End go to the ends; Enter opens or closes a command's details. The focused row keeps itself in view under the sticky toolbar and group header, and keyboard movement never slides the toolbar away. Only the focused row's controls are in the tab order.
8. **Failure popovers.** Hovering a red stretch of the video's seek bar or the timeline opens an `LTPopover` with the failure's command line and type: *Failed at 0:32* · **500 Internal Server Error** · *unknown error* · *Create New Session · xpath · /Users/ltadmin/...*. A stretch that merges retries says *8 failed commands · 1:16 - 1:21* and folds identical failures into one line with *8 times*. Hover targets are at least 12px wide. It closes when the pointer leaves, and on Esc (C20).
9. **Double-click zoom.** Double-clicking a red stretch on the timeline zooms the bar to it, with a margin on both sides: a quarter of its length, at least 3 seconds each side, and a window of at least 10 seconds [proposed]. The zoom animates, the axis relabels (*1:13 ... 1:25*), retries that read as one block across the whole run separate, a tag beside the counts says *1:13 - 1:25*, and the list shows that window. Reset timeline undoes it, and is inactive with *Showing the whole run* when there is nothing to reset.
10. **Copy a table.** In table view, a copy button in the table's corner copies it with its rows and columns: HTML for rich editors (Docs, Notion, Confluence, email) and tab-separated text for spreadsheets and plain editors, header row first.
11. **Video controls, decluttered.** Three rows: the command line, the seek bar across the whole width, then Play, *1:16 / 3:20* and the speed (*1x*) on the left, and *Open picture-in-picture*, *Collapse video*, *Enter full screen* and *More video actions* (Download video, Rotate video) on the right. The reasoning, heuristic by heuristic, is in §7b.
12. **Unlink.** Hovering or focusing the test case ID in the meta row shows an *Unlink test case* button right beside it. Its space is kept while hidden, so nothing in the row moves. Unlinking happens at once, because it can be undone: the toast reads *Test case #TC-88904 unlinked.* with **Undo** [proposed]. The meta row then offers **Link a Test Case**, the base pattern's wording.
13. **The name uses the space it has.** The title keeps the width the header leaves it, recomputed on every resize, so it shows in full whenever the viewport, the tests pane (collapsed or narrowed) and the actions leave room, and ends in an ellipsis only when they do not. The breadcrumb's current crumb, the same name, did not: v1 capped it at 420px at every width. It now takes whatever the top bar has left. Both show the full name on hover when cut (v2 item 16).
14. **Cmd or Ctrl plus the wheel seeks.** Over the video (docked or floating) or the timeline: Cmd on a Mac, Ctrl elsewhere. One wheel notch moves 1 second; down or right is later. The list reveals the command once the wheel stops, so it does not scroll under every notch. Elsewhere on the page the browser keeps the gesture, so Ctrl and the wheel still zoom the page on Windows (C23).
15. **Screenshot dialog keeps its context.** Title *Screenshot at 1:16*; beneath it the command's facts (*Failed · Find Element · [data-testid='price-filter-button'] · 500ms · 404 Not Found*) and three buttons: *Download screenshot* (a real PNG), *Raise a bug* and *Copy link* (the command's link).
16. **Full text of cut text.** Group titles, command names, strategy tags, values, the breadcrumb, the title, test names in the tests pane and the video's command line show their full text in a tooltip on hover, and only while they are cut off. Truncation is measured at the moment of hover, so it follows the viewport, the pane sizes, and whatever sits beside the text. In a row that runs out of width, the value gives way first (down to 48px), then the name and the strategy shrink together; the duration and time never do. Checked at the narrowest layout the page allows: 1280px wide with the logs at their 480px minimum, every row stays inside its width.

**Rajat's answers to §10, 17 Oct 2026**

- **The double chevron** expands and collapses every group and every command inside them. Expand all therefore also loads the hidden passed runs and opens every command's details; its label is *Expand all* or *Collapse all*.
- **Tests: All** filters by test case: kept.
- **Full screen** of the test details: kept.
- **The bug, image and table icons** in a command's details: changed only by v2 items 4, 10 and 15.
- **The grey markers** on the played part of the video bar are failures already played: kept.
- **Time formats:** one form. `m:ss` [proposed], with `h:mm:ss` from an hour, everywhere a moment of the run shows: rows, the axis, the player, the logs, dialogs (C28).
- **Unlink Test:** beside the test case ID (v2 item 12).

## 4c. Behaviour, v3 (18 Oct 2026)

1. **Unlink, always shown and aligned.** The test case ID and its *Unlink test case* button now sit on the meta row's text baseline; v2 aligned them to the bottom of the 24px line the status pill sets, which put the ID about 3px below its neighbours. The button is always visible, so there is no empty gap after the ID. Hovering the ID still shows the link's hover; hovering the button still shows its tooltip and hover fill.
2. **Remarks.** A test run with remarks shows them under the meta row: a muted *Remarks* label, then the text on one line, cut to the width the header has. When that cuts it, **View All** sits at the end of the line; it opens every line, however many, and **Show Less** folds them back. The cut is measured on every resize, so a remark that fits shows no button. A run without remarks shows nothing. The open text keeps to a reading width (about 88 characters). See question 21 on "2 lines".
3. **Comfortable and condensed rows.** A toggle icon button in the timeline header, beside Reset timeline, switches the list between comfortable (the current rows: 48px, group headers 48px) and condensed (32px rows, 36px group headers). Type stays at 14px and 12px, so every command reads as before. In condensed, group headers take a grey band, so a group still parts from its commands. The icon shows the view it switches to (*Switch to condensed view*); the choice is remembered and announced.
4. **Failure popovers you can work in.** After a 250ms hover (so a pointer passing over the bar opens nothing), the popover opens and stays open when the pointer leaves the strip. It closes with its close button, Esc, a click outside, or by hovering another failure, which replaces it; one is open at a time. Its text can be selected and copied. A single failure reads, in order: the command; *At 0:32 · 400ms*; the HTTP status as a red tag with the WebDriver error; the error's own message when it adds something; the locator; the comment, when there is one; then **Raise a bug**, **Copy payload** and **Add comment** (or **Edit comment**). A merged stretch lists its failures with counts and offers no actions (v3 item 4.5); on the timeline it says how to reach one: *Double-click to zoom in and act on one command.* The comment action closes the popover and opens the command's details with the comment box focused and in view, switching to All Commands if another tab shows.
5. **(Reminder: no hallucination.)** Every claim in this round was checked against design-context or the running page.
6. **Comments on failed commands.** In a failed command's details, *Add comment* (in the details bar, only while there is none) opens a comment box under the bar: `LTTextarea` labelled *Comment*, with a live count (*117 of 500 characters.*), **Cancel** and **Save**. An empty comment is refused with *Enter a comment.*; above 500 characters, with *Comment must be 500 characters or fewer.*; Cmd or Ctrl + Enter saves. A saved comment shows at the top of the details, readable without a click: the author's initials and name, the time (relative, absolute on hover), the text, and *Edit comment*. Each commented failure gets a 10px comment mark above its stretch on the timeline, not clickable.
7. **Controls right of the frame when the logs are below.** Docked below, the video pane is wide and short, so the command line, seek bar and buttons move to the right of the frame, and the frame takes the pane's whole height at 16:9. The controls keep at least 320px and take whatever width is left; the frame shrinks first. Full screen goes back to controls below.
8. **Tables on white.** Request and response tables have a white background, also inside a failed command's red tint; the header row keeps its grey.
9. **Counts that filter.** The passed and failed counts beside *Timeline* are toggle buttons: pressing one shows only that status, pressing it again shows every command, and pressing the other switches. While one is on, passed runs stay unfolded and every group with a match opens, as search does. With only passed commands shown, the failure chevrons are inactive and say why (*Showing passed commands only*). A count of 0 is inactive. An empty result says *Clear the status filter or try a wider time range.*
10. **Rotate for mobile only.** Web videos lose *Rotate video*; with Download as the only rare action left, it becomes a plain button instead of a one-item menu. Mobile recordings keep both in *More video actions*. Every mock test is web: `mock-data.md` has no mobile devices to stage one with (§9).
11. **(Reminder: nothing already built may break.)** Every v1 and v2 behaviour was tested again after these changes.

## 5. States

| Surface | Empty | Loading | Error |
|---|---|---|---|
| Tests pane | *0 tests in this build* | Skeleton rows | `LTFlash` danger: *Test list failed to load.* with **Try Again** |
| Command list | Queued test: *Queued to run* · *Commands, logs, and the video appear here once the test starts.* Search or range with no hits: *0 matching commands* · *Try a different search term.* | Skeleton rows | *Command list failed to load.* with **Try Again** |
| Disclosure | n/a | Skeleton rows, announced as *Loading 20 passed logs* | n/a |
| Video | *Video unavailable* · *This session ended without a recording.* (base pattern) | Skeleton frame | as empty |
| Network tab | *Network capture is off* · *Set the network capability to true to record requests on the next run.* | n/a | n/a |

The review states are linked from the README.

**Added in v2:**

| Surface | State | What shows |
|---|---|---|
| Video | Picture-in-picture | The floating window; the end of the tab bar shows **Dock Video**; the logs take the whole width |
| Video | Collapsed | Nothing of the video; the end of the tab bar shows **Show Video**; playback is paused |
| Video | Unavailable, docked | The blank slate, with *Collapse video* still on hand |
| Timeline | Zoomed | A tag beside the counts (*1:13 - 1:25*); Reset timeline active |
| Meta row | Unlinked | **Link a Test Case** where the test case ID was |
| Clipboard | Refused | A danger toast: *{object} failed to copy. Try again.*; copy buttons say *{object} failed to copy* in their tooltip |
| Tab menu | A move that cannot happen | The item stays, inactive, with its reason |

**Added in v3:**

| Surface | State | What shows |
|---|---|---|
| Remarks | None, fits, cut, open | Nothing; one line; one line with **View All**; every line with **Show Less** |
| Comment | None, writing, saved | *Add comment* in the details bar; the comment box; the comment with *Edit comment* |
| Comment box | Empty, too long | *Enter a comment.*; *Comment must be 500 characters or fewer.* (with the count) |
| Command list | Status filter with no match | *0 matching commands* · *Clear the status filter or try a wider time range.* |
| Status counts | Count of 0 | Inactive, with *0 failed commands* (or passed) |

**Delete confirmation** follows `patterns/modal.md` §5, because deleting a test is permanent: title *Delete test "{name}"?*; for a failed run only, a warning `LTFlash` naming what is specific to it (*This is a failed run. Its video and logs are the record of the failure.*); the consequence, with the reassurance last (*Deleting removes this test's video, logs, and 93 commands from the build. Test case #TC-88904 stays in Test Manager.*); *This action is permanent. Type DELETE to confirm.*; and **Keep Test** beside **Delete Test**, which stays inactive until the word matches. Focus starts on Keep Test, and the backdrop stops closing the dialog once something is typed (modal.md delta 3). After deleting, a toast confirms (*Test "{name}" deleted.*) and the next test opens.

## 6. Conflicts recorded

| # | Topic | Brief or screenshot | design-context | Prototype does | Why |
|---|---|---|---|---|---|
| C1 | Tooltips on plain text (items 3, 4) | Brief asks for them | `guidelines/lttooltip.md`: never on non-interactive elements | Tooltips shown; the time and the name are made focusable so keyboard users reach them | Brief wins. Proposed amendment in §10 |
| C2 | Disclosure control (item 6) | Brief: a link, *Show 20 passed logs* | README §5 and `ltlink.md`: an in-page trigger is a button; `ux-text-guidelines.md` §2: standalone action links take Title Case; §6: one term per concept (these are commands); `ltlabelgroup.md`: *Show {n} More* | Brief's words and link look; button semantics underneath | Brief wins on words and look. Guide-compliant alternative: *Show 20 Passed Commands* |
| C3 | Video controls | Screenshot 5: custom control bar with failure markers | README §10 and base pattern open question 2: native `<video controls>`, not restyled, until FE decides | Custom control bar per the screenshot | The screenshot is the brief's design, and the native rule was a stopgap. The prototype's video is synthetic, so native controls were not possible either |
| C4 | Request and response surface | Screenshot 9: light code block | README §1: code and log surfaces default to dark, with their own toggle | Dark by default, light one click away, choice remembered | Guideline wins over a screenshot detail |
| C5 | Failed command icon | Screenshot 7: red warning triangle | `mock-data.md`: failed uses the Status `Failed` glyph; the triangle is `Warning` (amber) | Bare red cross, the `Failed` glyph without its circle | Guideline wins |
| C6 | `View` button label | Screenshot 1: *View* with a bolt | `ltbutton.md`: the label carries the meaning, icons are decorative; base pattern: *View in HyperExecute* | *View in HyperExecute* | Guideline wins; the brief asked for alignment, which is kept |
| C7 | Copy tooltip | Screenshot 3: *Copy Test ID* | `ux-text-guidelines.md` §2: tooltips in sentence case | *Copy test ID* | Guideline wins |
| C8 | Menu item | Screenshot 4: *View History* | `ux-text-guidelines.md` §2 (9 Oct 2026): action-menu items in sentence case | *View history* | Guideline wins |
| C9 | Tab names | Screenshot 6: *All Commands*, *Logs*, *Networks*, *Meta Data* | `ltunderlinenav.md` [Open, 8 Oct 2026]: keep the casing shown until settled; base pattern: *network* | *All Commands*, *Logs*, *Network*, *Meta Data* | Casing kept as shown (the open question is Rajat's); *Networks* to *Network* to match the base pattern |
| C10 | Pass and fail counts | Screenshots 6 and 7: icon plus count | `ltcounterlabel.md`: never a bare count; `ux-text-guidelines.md` §3: colour plus word plus icon | Icon plus count, with the words announced to screen readers | The base pattern's own readout (§3.1, *Status icon plus count, never colour alone*) is the precedent |
| C11 | *Tests: All* control | Screenshot 6 | README §5: a filter dropdown is `LTButton` outline with a caret, never `LTSelect` (the base pattern used `LTSelect` for *View: All*) | `LTButton` outline plus `LTActionMenu` single selection | README §5 is the global rule |
| C12 | Request and Response switch | Screenshot 9: segmented control | `ltsegmentedcontrol.md`: segments must not switch tabbed views | `LTSegmentedControl`, no `role` | `hyperexecute-job-details.md` §3.3 already switches panels with one; the guideline's concern is navigation, and nothing here changes the URL |
| C13 | Selector values | Screenshot 7: italics | `ltinputbox.md`: monospace for code-like values | Monospace | Guideline wins |
| C14 | Brand icons in the meta row | Screenshot 1: Chrome, Windows, Selenium and tunnel marks | `icons.md`: lucide only, flag rather than substitute; lucide 1.58.0 has no brand marks (`Chrome` was removed) and design-context has no `assets/icons/` | Names as text: *Chrome 120*, *Windows 12*, *Selenium*, *Tunnel on* | Guideline wins; gap in §9 |
| C15 | Relative time | Screenshot 1: *Updated 6h ago* | `mock-data.md`: *Updated 4 days ago* | *Updated 6 hours ago* | Guideline wins |
| C16 | Breadcrumb | Base pattern: `LTBreadcrumbs` inside the centre pane | `patterns/topbar.md` (11 Sep 2026): the breadcrumb lives in the top bar | Top bar | The newer shell pattern wins |
| C17 | Auto-hiding toolbar (item 17) | Brief asks for it | `command-log-nesting-spec.md` §5.3 (15 Oct 2026, outside design-context) says not to | Brief | Brief wins; that file is a proposal outside the repo |
| C18 | Edit tooltip on the title | `LTInlineTextInput` defaults `showEditTooltip` to true; screenshot 2 shows no tooltip | `lttooltip.md`: never use a tooltip to explain a form field | Off; the hover border says "editable" | Guideline wins, and the screenshot agrees |
| C19 | Status glyphs, filled or bare | Screenshot 6: filled circles in the timeline; screenshot 7: bare glyphs in group rows and commands | `mock-data.md`: pick one `bg?` value per surface and hold it | Filled in the timeline header and the tests pane, bare in the command list | Each surface holds one value, as the screenshots already do |
| C20 | Popover for errors, on hover (v2 item 8) | Brief: "in a popover (use LTPopover, not tooltip)" | `ltpopover.md`: never for errors or critical information; always a visible dismiss; a hover hint is a tooltip | `LTPopover`, opening on hover (the component's own default, story `ltpopover--popover`), closing when the pointer leaves and on Esc, with no close button | Brief wins. It holds no controls and closes itself, so a close button would be a target that can only be reached by leaving it. Proposed amendment in §10 |
| C21 | Bug wording | v2 item 2: "create bug"; v2 items 6 and 15: "raise bug" | `ux-text-guidelines.md` §6: one term per concept; `test-instance-details.md` and this page: *Raise a bug* | *Raise a bug* everywhere | The brief uses both words; the page and design-context already use one |
| C22 | Space (v2 item 3) | Brief: Space jumps to the next failed command | Not a design-context rule. Video players use Space for play and pause, and a focused button activates on Space (NN/g heuristic 4, platform conventions) | Space is next failed command on the All Commands tab; in the list it overrides button activation and Enter activates; elsewhere Space keeps its meaning | Brief wins; recorded because it overrides a convention. See §10 |
| C23 | Cmd or Ctrl plus the wheel (v2 item 14) | Brief: it seeks the video | Not a design-context rule. Ctrl plus the wheel zooms the page in Windows browsers, which low-vision users rely on | Seeks only over the video and the timeline [proposed]; elsewhere the browser keeps the gesture. On a Mac, Ctrl plus the wheel is never taken | Brief wins where its meaning is unambiguous, and nowhere else |
| C24 | Tooltips on cut text (v2 item 16) | Brief: show the full text on hover, only when cut | `lttooltip.md`: never on non-interactive elements, never repeat visible text | Shown only while the text is cut, on rows, headers and links that are interactive | `ltunderlinenav.md` already does exactly this for long tab names, and the base pattern's delta 1 asks it for the title. Text that fits gets nothing |
| C25 | What "payload" means (v2 items 2, 6) | Brief: "copy payload" | Nothing defines it | The request and the response, as one JSON [proposed] | A bug report needs both; the details' own copy buttons still copy one side |
| C26 | Video control bar (v2 item 11) | Screenshot 5: one row with the seek bar between the buttons | v2 item 11: declutter it, with NN/g's heuristics | Three rows (§7b) | The brief's newer instruction wins over the older screenshot |
| C27 | Dock segment labels | v1 used *Dock left of the video* and *Dock below the video* | `ltsegmentedcontrol.md`: never phrase a segment as an action | *Logs left of the video*, *Logs below the video* | A v1 mistake, corrected |
| C28 | One time form (answer 6) | Rajat: unify `00:18`, `0:20` and `2:04` | `mock-data.md` has no format for a moment in the run (§9) | `m:ss`, `h:mm:ss` from an hour [proposed] | The form video players use, and two of the three screenshots already did |
| C29 | Counts as filters (v3 item 9) | Brief: the counts are clickable icon buttons that filter | `guidelines/README.md` §5: a filter with 2 to 5 options is `LTSegmentedControl`; `ltsegmentedcontrol.md`: include a segment for the full list | Two toggle buttons (`aria-pressed`); no button pressed is the full list | Brief wins; the "full list" is the state with nothing pressed |
| C30 | *View All* (v3 item 2) | Brief: "a truncation icon or view all link" | README §5: an in-page trigger is a button, never a link styled as one | A button with the link's look, as *Show 20 passed logs* (C2) | The brief's link, and one treatment for both in-place expanders on the page |
| C31 | Popover dismissal (v3 item 4) | Brief: stays open when the pointer leaves the strip | `ltpopover.md`: always a visible dismiss, plus Esc and click-outside | All three, now that it holds actions | Brief and guideline agree here; C20's other half (errors in a popover) stands |
| C32 | Bug wording, again (v3 item 4.2) | Brief: "create bug" | C21: one term, *Raise a bug* | *Raise a bug* | As C21 |
| C33 | 500-character limit (v3 item 6.1) | Brief: max 500 characters | `COMPONENTS.md`: `LTTextarea` has no length prop | A validation rule with a live count; Save refuses more | No prop is invented; nothing typed or pasted is cut off silently |

## 7. Design decisions [proposed]

- **The video follows the list, never the other way round during playback.** The list does not auto-scroll while the video plays; it moves only when the video jumps (item 9). A list that scrolls under the reader's eyes while they read is the hostile kind of motion. Rejected: live follow mode.
- **Previous and next go by the video's position, not by list focus.** One cursor for both surfaces keeps them in sync. Rejected: a separate list cursor, which drifts from the video.
- **Disclosure threshold of 3.** Collapsing one or two commands saves nothing. Rejected: always collapse (a one-row disclosure replacing one row is noise).
- **Toolbar stays while in use** (item 17), see §4. Rejected: hide on every downward scroll, which makes the toolbar's own buttons vanish under the pointer.
- **Played markers turn grey on the video bar**, as screenshot 5 shows; the timeline in the tab keeps them red. See open question 6.
- **Share copies the test's link** and confirms with a toast, since the clipboard is out of sight. Rejected: a share dialog, which the brief does not show.
- **Delete requires typing DELETE** (`patterns/modal.md` §5): a test's video and logs are gone for good.
- **A failed command opens on Response,** a passed one on Request. The response holds the error, which is what the user came for; screenshot 9 shows Request selected. Rejected: always Request.
- **All Commands keeps its state across tab switches and dock changes**: open payloads, revealed runs, filters and scroll survive a visit to Logs. Rejected: a fresh list on every return, which loses the user's place.
- **The timeline counts follow the selected window,** so narrowing the window answers "how many failures in here". The tab counter keeps the total (ux-text-guidelines.md §7).

### 7b. v2 decisions [proposed]

**The video's controls (v2 item 11), checked against NN/g's ten heuristics.**

Every control, ranked by how often a debugging session needs it, decides where it goes: seek (constantly), play and pause, the time, the failure markers, then the failure actions (only at a failure), the speed, full screen, picture-in-picture and collapse (now and then), download and rotate (rarely).

| Heuristic | What it decided |
|---|---|
| 1. Visibility of system status | The command line always names what the video shows; the speed shows its value (*1x*) instead of hiding behind a settings gear; a floating or collapsed video is labeled at the end of the tab bar (**Dock Video**, **Show Video**) |
| 2. Match between the system and the real world | `m:ss`, the time form of video players; *picture-in-picture*, the browsers' own word |
| 3. User control and freedom | Every mode has a labeled way back (*Dock video*, **Show Video**); focus lands on it; Reset timeline undoes a zoom; Undo follows an unlink |
| 4. Consistency and standards | Play on the left with the time beside it, window controls and full screen on the right, as video players place them. Nothing moves when a failure starts or ends: the command line keeps its height |
| 5. Error prevention | The wheel seeks only over the video and the timeline, so scrolling the list with a modifier held never moves the video |
| 6. Recognition rather than recall | The failure's actions appear where the failure is shown, while it is shown; nobody has to remember which command failed |
| 7. Flexibility and efficiency of use | Cmd or Ctrl plus the wheel, Space, and the arrow keys speed up experts; every one has a button or a menu item for everyone else |
| 8. Aesthetic and minimalist design | The seek bar gets a row to itself, the full width of the pane; Download video and Rotate video, the rarely used ones, move into *More video actions* |
| 9. Help users recognize, diagnose, and recover from errors | A failure reads *404 Not Found*, never a bare code (also `ux-text-guidelines.md` §3), next to the two actions that start fixing it |
| 10. Help and documentation | *Keyboard shortcuts* in More actions, also on `?`, lists every shortcut on the page |

**Biases named and set aside.** Anchoring: v1 kept screenshot 5's one row because the screenshot had it; the order above comes from frequency of use instead. Equal salience: v1 gave Download and Rotate the same weight as Play. Sunk cost: v1's inline slot for the failure actions was built first and then dropped (see below).

**Rejected:**
- Buttons inline in the seek row: they shorten the bar, the thing used most.
- Speed inside a settings gear: hides a state that changes what the user sees.
- The failure actions inline in the button row: tried first; at the default 480px pane the command name shrank to one letter and left a bare *404*.
- A strip that appears only at a failure: the controls would grow and shrink while the video plays, and in the floating window the video itself would jump.
- A chip over the video: it would cover the frame at the moment the frame matters most.

**Picture-in-picture inside the page (v2 item 5).** The browser's Picture-in-Picture for `<video>` shows one video element with only the browser's own controls (MDN), so it cannot carry this seek bar, its failure markers or the failure actions; this replay is not a `<video>` either. The newer Document Picture-in-Picture API can float any HTML above other windows, but MDN marks it *Limited availability* (not Baseline), and the site cannot set the window's position. The prototype floats a window inside the page, which every browser supports and which can enforce the brief's size threshold. A real recording could add the browser's floating window later, as an extra (§10).

**Other decisions:**
- **Tab order** is remembered per browser, as the prototype has no accounts. The real product would keep it per user (§10).
- **The command line shows the current command when there is no failure**, so its space is never empty and the video always says what it is showing (§10).
- **Space stays in the list.** It does not move the video; the chevrons do. That keeps two distinct tools: one to read through failures, one to watch them.
- **Arrow keys never slide the toolbar away**: a toolbar that hides while the user steps through rows would move the rows under the focus.
- **A command's link** clears filters that would hide the command, opens it, and moves the video to it, so the person who opens it sees what the sender saw.
- **The zoom selects the same window it shows**, so the list and the counts follow the zoom; Reset timeline undoes both.
- **Collapsing the video pauses it**: a hidden video playing on is motion nobody can see.
- **Unlink happens at once, with Undo**, instead of asking first: nothing is lost, and recovery beats a confirmation (`ux-persona.md`).
- **The title does not trade places with the actions.** Rejected: moving *View in HyperExecute* into the menu when a name is long, which would move a button from test to test.
- **Clipboard failures are reported**, in the house form *{object} failed to copy*, instead of claiming success.
- **Full screen now carries its overlays.** Menus, tooltips, popovers, toasts, dialogs and the floating window mount inside whatever is full screen. In v1 they mounted outside it and could not show there.

### 7c. v3 decisions [proposed]

- **The popover opens on a held hover and stays until dismissed.** The 250ms wait keeps a pointer crossing the bar from opening popovers; staying open is what the brief asks for, so text can be copied. Rejected: closing when the pointer leaves both the strip and the popover, which loses the popover the moment the pointer overshoots while selecting text.
- **One reading order for both popovers**: what (the command, or how many), when, why (status and WebDriver error), where (the locator), what the team knows (the comment), and only then what to do. The close button sits in the heading row, apart from the actions, so closing is never mistaken for one of them.
- **A merged stretch teaches its way to the actions**: *Double-click to zoom in and act on one command.*, on the timeline only, where the zoom exists.
- **The single popover previews the comment** in two lines, so the comment mark above a stretch leads somewhere on hover.
- **The video's failure line gets the comment action too**, so a failure offers the same three actions wherever it shows. Not in the brief; see question 25.
- **One comment per failed command**, edited in place, shown at the top of the details: it explains the failure, so it comes before the payload. No delete yet (question 22).
- **The 500-character limit is a validation rule**, not a hard stop (C33): nothing pasted is cut off unseen, the live count shows where the text stands, and Save says what to fix.
- **Remarks open in place**, at a reading width, with **Show Less** to fold them; the brief's one line is the default (question 21).
- **A status filter acts like search**: passed runs unfold and groups with a match open, because the filter asks to see those commands.
- **Condensed keeps the type size.** Height comes out of padding, never out of legibility; the grey group band replaces the distinction the extra height gave.
- **Docked below, the frame takes the height and the controls the width**, with at least 320px for the controls, since the seek bar needs width more than height.
- **Download becomes a plain button on web videos**, rather than a menu with one item.

## 8. Copy

All strings follow `ux-text-guidelines.md`. Rule numbers are that guide's.

| Where | String | Rule |
|---|---|---|
| Header button | View in HyperExecute | §2 Title Case CTA; §1 rule 17 product name |
| Icon buttons | Raise a bug · Enter full screen · Exit full screen · More actions | §3 Tooltips: name the action; *Raise a bug* is `test-instance-details.md`'s wording |
| Menu | Share (S) · View history · Delete | §2 sentence case for menu items; shortcut in the trailing slot (`ltactionmenu.md`) |
| Copy button | Copy test ID · Copied · *Test ID copied* (screen readers) | §2; §3 Silent success still speaks |
| Title | *Enter a test name.* · *Test name updated* (screen readers) | §3 Field errors lead with the fix; §3 Silent success still speaks |
| Meta | Updated 6 hours ago by Ritika Sharma · tooltip *Oct 16, 2026, 08:21 AM* | `mock-data.md` relative and absolute formats; §2 tooltips without a full stop |
| Tabs | All Commands · Logs · Network · Meta Data | C9 |
| Dock | Logs position · Dock left of the video · Dock below the video | §3 Tooltips |
| Timeline | Timeline · Reset timeline · Expand all groups · Collapse all groups · Previous failed command · Next failed command | §3 Tooltips; one term: failed |
| Search | Search commands (/) | README §10 keyboard hint stopgap |
| Filter | Tests: All | base pattern's *View: All* form |
| Disclosure | Show 20 passed logs · Show 1 passed log | brief, C2 |
| Row actions | Show details · Hide details · Jump video to 00:32 · Raise a bug · View screenshot · Show as table · Show as code · Copy request · Copy response | §3 Tooltips |
| Empty, error | see §5 | §3 Empty states and Error messages; §1 rule 2 no negation |
| Delete | Delete test "{name}"? · Keep Test · Delete Test · Test "{name}" deleted. | §3 Confirmation dialogs; Toasts |
| Share | Test link copied. | §3 Toasts |
| Video | Play · Pause · Seek · Playback speed · Download video · Rotate video · Enter full screen | §3 Tooltips |
| Logs | Selenium logs · Search logs · {n} of {total} · 0 matches · Previous match · Next match · Switch logs to light theme · Download logs | §3 Tooltips; §1 rule 2 (*0 matches*, not *No matches*) |
| Drawers and dialogs | Test history · Screenshot at {00:32} | §2 sentence case for headings |

**Added in v2:**

| Where | String | Rule |
|---|---|---|
| Tab menu | Move left · Move right · Reset tab order · Already the first tab · Already the last tab · Already in the default order | §2 sentence case for menu items; `ltactionmenu.md`: the reason in the item, positive |
| Tab announcements | Logs moved to position 1 of 4 · Tab move canceled · Tabs back in the default order | §3 Silent success still speaks; §1 rule 9 *canceled* |
| Command menu | Copy payload · Copy link · Raise a bug | §2 sentence case; §6 one term (C21) |
| Copy toasts | Payload of Find Element at 1:16 copied. · Link to Find Element at 1:16 copied. · Test link failed to copy. Try again. | §3 Toasts: name the object, reuse the trigger's verb; §3 Error messages |
| Copy buttons | Copy link · Copy response table · Copied · Link to Find Element at 1:16 failed to copy | §3 Tooltips; §5 *{object} failed to {verb}* |
| Space | Failed command 3 of 20: Find Element at 1:16 · All commands passed · 0 failed commands in this view | §1 rule 2 no negation; §2 numbers as digits |
| Payload view | Show as table · Show as JSON · Payloads show as tables · Payloads show as JSON | §3 Tooltips; JSON is better known than its full name (§6) |
| Expand | Expand all · Collapse all · All groups and commands expanded | §3 Tooltips |
| Timeline | Showing the whole run · Timeline zoomed to 1:13 - 1:25 | §3 disabled controls say when they are available, positively |
| Popover | Failed at 0:32 · 8 failed commands · 1:16 - 1:21 · 8 times · 3 more failed commands | §2 a label starting with a number keeps the rest lowercase; middle dot |
| Video | Open picture-in-picture · Collapse video · Dock video · Move video · Resize video · More video actions · Download video · Rotate video · 1x playback speed · **Show Video** · **Dock Video** | §3 Tooltips name the action; §2 Title Case buttons |
| Video announcements | Video in picture-in-picture · Video docked · Video collapsed. Show Video brings it back. | §3 Silent success still speaks |
| Command line | 404 Not Found · Find Element · Raise a bug · Copy payload · Payload copied | §3 Error messages: never a bare code |
| Unlink | Unlink test case · Test case #TC-88904 unlinked. · **Undo** · **Link a Test Case** · Test case #TC-88904 linked | §3 Toasts: offer Undo; base pattern copy table |
| Screenshot dialog | Screenshot at 1:16 · Download screenshot · Raise a bug · Copy link | §3 Tooltips |
| Shortcuts | Keyboard shortcuts · Shortcut · Action · Bring the next failed command into view · Previous or next command, once a command has focus · Show these shortcuts | §2 sentence case headings and labels |
| Dock | Logs position · Logs left of the video · Logs below the video | C27 |

**Added in v3:**

| Where | String | Rule |
|---|---|---|
| Remarks | Remarks · **View All** · **Show Less** | §2 Title Case for standalone actions |
| Density | Switch to condensed view · Switch to comfortable view · *Condensed view* · *Comfortable view* (announced) | §3 Tooltips name the action |
| Counts | Show only passed commands · Show only failed commands · Show all commands · 0 failed commands · Showing passed commands only · *Showing all commands* (announced) | §2 a label that starts with a number stays lowercase |
| Empty list | Clear the status filter or try a wider time range. | §3 Empty states: teach the next action |
| Comment box | Comment · Add context for your team · 117 of 500 characters. · Enter a comment. · Comment must be 500 characters or fewer. · **Cancel** · **Save** · *Comment saved* (announced) | §3 Field errors lead with the fix; constraint errors state the rule; `lttextarea.md`: captions end with a full stop |
| Comment actions | Add comment · Edit comment | §3 Tooltips |
| Popover | At 0:32 · 400ms · Close · Double-click to zoom in and act on one command. | §2 helper text ends with a full stop |
| Video | Download video | §3 Tooltips |
| Shortcuts | Save the comment you are writing | §2 |

## 9. Gaps found in design-context

Recorded, not changed. Each is a candidate for a design-context pull request once Rajat decides.

- **`mock-data.md`** has no format or values for: command durations under a second (`20ms`), offsets (`00:18` in rows but `0:20` on the axis and `2:04` in the player, both from the screenshots), the automation test ID, request and session IDs, command names, locator strategies, annotation names, framework versions, playback speeds, log lines, and network rows. The prototype takes command names from the W3C WebDriver commands and the screenshots, and flags each.
- **`icons.md`**: lucide's version is still TO FILL. The prototype pins **lucide-react 1.58.0** and uses only names verified present in it (listed in the README). There are no brand marks for browsers, operating systems or frameworks, and no tunnel icon.
- **`TOKENS.md`**: the timeline blue measures exactly `#80ccff`, which only `checks.ansi.blueBright` carries; there is no semantic timeline or marker token. The orange of the active tab underline and of selection is `colors.highlight` (`#ED5F00`), which exists and may close the TI prototype's "no orange-bar token" gap. `radii` stops at 6px (plus pill), while screenshot 4's menu corners measure about 12px, Primer's overlay radius; the prototype uses 6px. The `Upgrade Now` orange has no `btn.orange` token; the prototype uses `severe.emphasis`, as the notification-center prototype did.
- **Components**: no range timeline, splitter, or video player. `LTTestHeader` documents no editable title or tooltip hooks. `LTUnderlineNav` has no overflow (base pattern delta 2).
- **Guidelines**: nothing yet on resizable panes and their limits, dock positions, sticky group headers, or auto-hiding toolbars.

**Found in v2:**

- **No context menu.** `LTActionMenu` opens from a button; the right-click menus compose its documented controlled mode (`open`, `onMenuToggle`) with a `customAnchor` placed at the pointer.
- **Still no drag and drop** (`guidelines/README.md` §10). Tab reordering is custom, with the house's keyboard answer: moves in the item's own menu.
- **`LTActionMenu`'s `options` shape is still TBD** (passthrough stories). The look-alike's item fields `onSelect`, `description` and `inactive`, and its `ariaLabel`, stand in for it.
- **`LTPopover` guidance covers onboarding only.** Nothing covers a hover preview of data, which v2 item 8 needs (C20).
- **`LTCopyToClipboard` copies plain text with a fixed icon.** Copy link (a link icon) and Copy table (HTML plus text) are composed from `LTIconButton` with the same feedback.
- **No floating window or picture-in-picture component.**
- **No keyboard shortcuts pattern**: no `KeybindingHint` yet (README §10) and no shortcuts dialog. The prototype's dialog is a proposal.
- **`mock-data.md` has no format for a moment in the run.** Answer 6 asks for one; `m:ss` is proposed (C28).

**Found in v3:**

- **`mock-data.md` has no remarks, no comments and no mobile devices.** The remarks and the one seeded comment are written for the mock; the mobile case of v3 item 10 (Rotate video) is built but cannot be staged.
- **`LTTextarea` has no length prop** (C33), and the library has no comment component; the comment is composed from `LTTextarea`, `LTAvatar`, `LTButton` and `LTIconButton`.
- **`LTPopover`'s `containsInteractiveChildElement`** is documented by name only; the prototype reads it as "stays open while you work in it".
- **No guideline on list density** or on status filters made from counts.

## 10. Open questions

1. **`LTTestHeader`**: does it accept an editable title, a copy button, and tooltips on `timeSince` and `username`? If yes, it replaces the composed header. Story `lttestheader--test-header`.
2. **`LTAccordionWrapper`**: can its headers be sticky and draw the indent rule? If not, the group stays composed.
3. **Tooltips on text** (C1): amend `lttooltip.md` to allow a tooltip on relative times and people, provided the text is focusable?
4. **Where do labels go?** The base pattern's Labels block (job and task tags, plus a counter) has no place in the condensed row. Dropped for now.
5. **Unlink Test**: the base pattern's video header carried *Unlink Test*. The brief's layout has no video header. Where does it go: the meta row's test case link, or the More actions menu? **Answered 17 Oct 2026:** beside the test case ID, on hover (v2 item 12).
6. **Grey markers**: screenshot 5 shows grey dots on the played part of the video bar. Are they failures already played, or something else? **Answered 17 Oct 2026:** failures already played.
7. **Chevrons up and down** (screenshot 6, the double chevron): read as expand and collapse all groups. Right? **Answered 17 Oct 2026:** all groups and every command inside them.
8. **Tests: All**: read as a filter by test case, since one session can run several. Right? **Answered 17 Oct 2026:** yes.
9. **Full screen in the header**: read as full screen for the test details (header, logs and video). Right, or full screen video only? **Answered 17 Oct 2026:** as built.
10. **Row icons in an expanded command** (screenshot 9: bug, image, table): read as Raise a bug, View screenshot, and Show as table. Right? **Answered 17 Oct 2026:** yes, with v2 items 4, 10 and 15.
11. **Time formats**: unify `00:18`, `0:20` and `2:04` into one form? **Answered 17 Oct 2026:** yes; `m:ss` is proposed (C28).
12. **Six tabs or four**: the base pattern has six plus More; the brief shows four. Are Performance and the rest gone?

Still open from v1: 1, 2, 3, 4 and 12. **New in v2:**

13. **Tab order**: kept per user account in the real product, or per browser, as the prototype does?
14. **Copy payload**: the request and the response together (as built), or only the side the details show?
15. **The command line above the seek bar** names the current command whenever there is no failure. Keep that, or show the line only at failures (with its space kept empty)?
16. **Space** overrides the video players' play and pause, and button activation inside the list (C22). Acceptable?
17. **`m:ss`** as the one time form (C28), for `mock-data.md`?
18. **Keyboard shortcuts dialog** and the `?` shortcut: keep? It is not in the brief; it answers the persona's rule that every shortcut has a visible twin.
19. **A floating window outside the browser**: worth adding the browser's own picture-in-picture for real recordings, beside the in-page window? It would show the video with only the browser's controls.
20. **`ltpopover.md`**: amend it to allow a hover preview of data, without a close button (C20)?

**New in v3:**

21. **Remarks, 1 line or 2?** The brief says "show 2 lines of remarks" and then "by default, only 1 line is visible". Built: 1 line and **View All**. Two lines is a one-line change.
22. **Comments**: can they be deleted? Edited by their author only? One per command (as built) or a thread?
23. **A comment mark in the command's row** as well as on the timeline?
24. **The popover**: stays open until closed (as built), or closes once the pointer leaves both the strip and the popover?
25. **The comment action on the video's failure line**, added so a failure offers the same three actions everywhere: keep it?
26. **Status counts**: one at a time (as built), or both pressed at once?
27. **Default density**: comfortable (as built)?

## 11. When this ships into design-context/

- [ ] Amend `patterns/automation-details.md`: header, meta row, actions and menu, the All Commands anatomy, dock and splitters, states, and this file's copy rows in its copy table. Keep the 4 Sep wording visible with dated notes.
- [ ] `mock-data.md`: the formats in §9, once decided.
- [ ] `icons.md`: lucide 1.58.0 and the names this page uses.
- [ ] `guidelines/`: tooltip on focusable text (C1), splitter limits, sticky parents, the auto-hiding toolbar rule.
- [ ] FE asks: range timeline, splitter and video player components.
- [ ] v2: amend `patterns/automation-details.md` with §4b; record C20 to C28 as deltas or amendments.
- [ ] v2: `mock-data.md`, the time form for a moment in the run (C28), once Rajat confirms `m:ss`.
- [ ] v2: `guidelines/`: a context-menu recipe (`LTActionMenu` controlled, anchored at the pointer), the reorder-by-menu rule for tabs, the "full text only when cut" tooltip rule, and the hover-preview popover (C20).
- [ ] v2: `icons.md`, the 69 lucide names this page uses (README).
- [ ] v2 FE asks: a context menu, drag and drop with its keyboard twin, a floating video window, rich copy in `LTCopyToClipboard`, and a shortcuts dialog with `KeybindingHint`.
- [ ] v3: amend `patterns/automation-details.md` with §4c; record C29 to C33.
- [ ] v3: `mock-data.md`, remarks and comments values, and mobile devices once there is a mobile pattern.
- [ ] v3: `guidelines/`: list density, status filters made from counts, the interactive popover's dismiss rules, the comment pattern.
- [ ] v3 FE asks: a length limit on `LTTextarea`, a comment component, and the documented behaviour of `containsInteractiveChildElement`.
