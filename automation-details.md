# Automation test details: 18 UX changes

The automation test details page with Rajat's 18 changes of 16 Oct 2026 applied. Written in the `design-context/patterns/` house format, as an amendment proposal for `patterns/automation-details.md`. The working prototype in this repo implements it.

Precedence, as the house workflow sets it: **Rajat's brief > design-context guidelines > screenshots**. The nine screenshots attached to the brief count as brief where its text points at them ("see attached ss") and as reference everywhere else, so copy, icons and colours in them follow the guidelines. Every conflict is recorded in §6, never resolved silently.

Sources, all read from `design-context` `main` (e014a73) on 16 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/README.md` and the component files, `patterns/automation-details.md` (the base pattern), `patterns/automation-listing.md`, `patterns/hyperexecute-job-details.md`, `patterns/test-instance-details.md`, `patterns/modal.md`, `patterns/topbar.md`, `patterns/platform-sidebar.md`, `COMPONENTS.md`, `mock-data.md`, `icons.md` and `data/tokens.json`.

Every component and prop below was read from `COMPONENTS.md`. Proposals carry **[proposed]**.

---

## 1. What this page is

Unchanged from the base pattern: a debugging surface for one automation test, with its commands, logs and session video. What changes is how fast the user gets from "this test failed" to "this is the command that failed, and this is what the video shows at that moment".

| Region | Base pattern (4 Sep 2026) | After the 18 changes |
|---|---|---|
| Tests pane | 400px, collapsible | Same, and resizable between 320px and 480px (item 14) |
| Header | Title, then a four-column metadata block, then four buttons | Inline-editable title with a copy-test-ID button, one condensed meta row, and a re-aligned action group (items 1 to 5) |
| Detail | Six tabs plus More, command tree with its own scrolls | Four tabs with a command counter; the All Commands tab is one scroll with a timeline, sticky parents and progressive disclosure (items 6 to 12, 15 to 18) |
| Video | 480px pane on the right | Docks right of the logs (default) or below them, resizable; custom control bar with failure markers (items 9, 13, 14) |

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

## 5. States

| Surface | Empty | Loading | Error |
|---|---|---|---|
| Tests pane | *0 tests in this build* | Skeleton rows | `LTFlash` danger: *Test list failed to load.* with **Try Again** |
| Command list | Queued test: *Queued to run* · *Commands, logs, and the video appear here once the test starts.* Search or range with no hits: *0 matching commands* · *Try a different search term.* | Skeleton rows | *Command list failed to load.* with **Try Again** |
| Disclosure | n/a | Skeleton rows, announced as *Loading 20 passed logs* | n/a |
| Video | *Video unavailable* · *This session ended without a recording.* (base pattern) | Skeleton frame | as empty |
| Network tab | *Network capture is off* · *Set the network capability to true to record requests on the next run.* | n/a | n/a |

The review states are linked from the README.

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

## 9. Gaps found in design-context

Recorded, not changed. Each is a candidate for a design-context pull request once Rajat decides.

- **`mock-data.md`** has no format or values for: command durations under a second (`20ms`), offsets (`00:18` in rows but `0:20` on the axis and `2:04` in the player, both from the screenshots), the automation test ID, request and session IDs, command names, locator strategies, annotation names, framework versions, playback speeds, log lines, and network rows. The prototype takes command names from the W3C WebDriver commands and the screenshots, and flags each.
- **`icons.md`**: lucide's version is still TO FILL. The prototype pins **lucide-react 1.58.0** and uses only names verified present in it (listed in the README). There are no brand marks for browsers, operating systems or frameworks, and no tunnel icon.
- **`TOKENS.md`**: the timeline blue measures exactly `#80ccff`, which only `checks.ansi.blueBright` carries; there is no semantic timeline or marker token. The orange of the active tab underline and of selection is `colors.highlight` (`#ED5F00`), which exists and may close the TI prototype's "no orange-bar token" gap. `radii` stops at 6px (plus pill), while screenshot 4's menu corners measure about 12px, Primer's overlay radius; the prototype uses 6px. The `Upgrade Now` orange has no `btn.orange` token; the prototype uses `severe.emphasis`, as the notification-center prototype did.
- **Components**: no range timeline, splitter, or video player. `LTTestHeader` documents no editable title or tooltip hooks. `LTUnderlineNav` has no overflow (base pattern delta 2).
- **Guidelines**: nothing yet on resizable panes and their limits, dock positions, sticky group headers, or auto-hiding toolbars.

## 10. Open questions

1. **`LTTestHeader`**: does it accept an editable title, a copy button, and tooltips on `timeSince` and `username`? If yes, it replaces the composed header. Story `lttestheader--test-header`.
2. **`LTAccordionWrapper`**: can its headers be sticky and draw the indent rule? If not, the group stays composed.
3. **Tooltips on text** (C1): amend `lttooltip.md` to allow a tooltip on relative times and people, provided the text is focusable?
4. **Where do labels go?** The base pattern's Labels block (job and task tags, plus a counter) has no place in the condensed row. Dropped for now.
5. **Unlink Test**: the base pattern's video header carried *Unlink Test*. The brief's layout has no video header. Where does it go: the meta row's test case link, or the More actions menu?
6. **Grey markers**: screenshot 5 shows grey dots on the played part of the video bar. Are they failures already played, or something else?
7. **Chevrons up and down** (screenshot 6, the double chevron): read as expand and collapse all groups. Right?
8. **Tests: All**: read as a filter by test case, since one session can run several. Right?
9. **Full screen in the header**: read as full screen for the test details (header, logs and video). Right, or full screen video only?
10. **Row icons in an expanded command** (screenshot 9: bug, image, table): read as Raise a bug, View screenshot, and Show as table. Right?
11. **Time formats**: unify `00:18`, `0:20` and `2:04` into one form?
12. **Six tabs or four**: the base pattern has six plus More; the brief shows four. Are Performance and the rest gone?

## 11. When this ships into design-context/

- [ ] Amend `patterns/automation-details.md`: header, meta row, actions and menu, the All Commands anatomy, dock and splitters, states, and this file's copy rows in its copy table. Keep the 4 Sep wording visible with dated notes.
- [ ] `mock-data.md`: the formats in §9, once decided.
- [ ] `icons.md`: lucide 1.58.0 and the names this page uses.
- [ ] `guidelines/`: tooltip on focusable text (C1), splitter limits, sticky parents, the auto-hiding toolbar rule.
- [ ] FE asks: range timeline, splitter and video player components.
