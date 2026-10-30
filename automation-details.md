# Automation test details: 18 UX changes, then 16, then 11, then 12, then the Network tab in four rounds, then the setup state

The automation test details page with Rajat's 18 changes of 16 Oct 2026 applied. Written in the `design-context/patterns/` house format, as an amendment proposal for `patterns/automation-details.md`. The working prototype in this repo implements it.

Precedence, as the house workflow sets it: **Rajat's brief > design-context guidelines > screenshots**. The nine screenshots attached to the brief count as brief where its text points at them ("see attached ss") and as reference everywhere else, so copy, icons and colours in them follow the guidelines. Every conflict is recorded in §6, never resolved silently.

Sources, all read from `design-context` `main` (e014a73) on 16 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/README.md` and the component files, `patterns/automation-details.md` (the base pattern), `patterns/automation-listing.md`, `patterns/hyperexecute-job-details.md`, `patterns/test-instance-details.md`, `patterns/modal.md`, `patterns/topbar.md`, `patterns/platform-sidebar.md`, `COMPONENTS.md`, `mock-data.md`, `icons.md` and `data/tokens.json`.

Every component and prop below was read from `COMPONENTS.md`. Proposals carry **[proposed]**.

**v2, 17 Oct 2026.** Rajat's second brief (16 changes) and his answers to §10 are applied. Its items are written *v2 item 1* to *v2 item 16*, beside the first brief's items 1 to 18; §4b, §6 (C20 to C28), §7b and the v2 rows of every other section cover them. Sources were read again from `design-context` `main` (still `e014a73`) on 17 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/README.md`, `ltpopover.md`, `ltactionmenu.md`, `lttooltip.md`, `ltunderlinenav.md`, `ltsegmentedcontrol.md`, `lticonbutton.md`, `ltmodal.md`, `notification-messaging.md`, `COMPONENTS.md` (with its story source snippets in `data/raw/components.json`), `patterns/automation-details.md`, `patterns/module-details.md`, `patterns/topbar.md`, `guidelines/ltbreadcrumbs.md`, `mock-data.md` and `icons.md`. Two outside sources were read for v2: NN/g's [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) (Jakob Nielsen, last reviewed Jan 30, 2024) for v2 item 11, and MDN's [Document Picture-in-Picture API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API) for v2 item 5.

**v3, 18 Oct 2026.** Rajat's third brief: 11 items, two of them reminders (no hallucination; nothing already built may break). Its items are written *v3 item 1* to *v3 item 11*: §4c, conflicts C29 to C33, §7c and the v3 rows of every other section. Sources read again from `design-context` `main` (still `e014a73`) on 18 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/lttextarea.md`, `ltpopover.md`, `COMPONENTS.md` (`LTTextarea`, `LTPopover`) and `mock-data.md` (people, devices).

**v4, 19 Oct 2026.** Rajat's fourth brief: 12 items, the last a reminder to double-check every point. Its items are written *v4 item 1* to *v4 item 12*, and item 8's ten points *8.1* to *8.10*: §3c, §4d, conflicts C34 to C39, §7d and the v4 rows of every other section. Sources read again from `design-context` `main` (still `e014a73`) on 19 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md` (§2 punctuation on labels, §3 never a bare error code), `guidelines/README.md` (§3 hierarchy), `ltbutton.md`, `ltactionmenu.md`, `ltunderlinenav.md`, `COMPONENTS.md` (`LTButton` variants), `patterns/automation-details.md` (§3.3, §6 layout notes, open question 2) and `mock-data.md` (test case IDs). The brief's first screenshots were measured again: 7 and 8 for the indent rule, 5 for the control row, 6 for the toolbar.

**v5, 27 Oct 2026.** Rajat's fifth brief: a revamp of the Network tab in 11 items, with two screenshots: *screenshot N1*, the product's Network tab in dark mode, and *screenshot N2*, a light reference table whose last column draws each request's phases. Its items are written *v5 item 1* to *v5 item 11*. Item 4 reached us cut off ("on clicking a network log row, a"); Rajat answered on 27 Oct 2026: a details panel beside the table, as browser developer tools have, with Headers, Payload, Response and Timing, the table narrowing while it is open. Covered by §3d, §4e, conflicts C40 to C47, §7e and the v5 rows of every other section. Sources read from `design-context` `main` (`618b4b8`) on 27 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md` (§1 rule 2 no negation, §2 casing and punctuation), `guidelines/README.md` (§1 tables and their three states, §3 type for tables, §5 component choice), `ltswitch.md`, `ltpopover.md`, `ltmodal.md` (side sheets), `COMPONENTS.md` (`LTSwitch`, `LTSelect`, `LTTabNav`, `LTTable`, `LTPopover`), `icons.md`, `mock-data.md` and `data/tokens.json` (through `scripts/tokens.mjs`, now 142 tokens). The phase colours were chosen and checked with the dataviz skill's palette validator (§7e).

**v5 answers, 28 Oct 2026.** Rajat answered questions 37 to 42: the Waterfall is a timeline across the whole run, shown either in the rows or as a strip on top whose handles filter the list, with a Reset that R also triggers (39, then his pick of "switch between them"); Waterfall does not sort (40); the phases wear Chrome DevTools' colours (42); `mm:ss` stays (38); Show CONNECT waits for the PM (37). On question 41 he chose a third way: on the Network tab the logs no longer move below the video, so the popover always has the video's side to open into; All Commands keeps the dock control. Covered by §4f, C48, C49, §7f and the "answers" rows of the other sections; superseded v5 text is kept with an italic note. Sources: Chrome DevTools' own code, read in `ChromeDevTools/devtools-frontend` at `main` `a19ceb8912fd` (27 Oct 2026): `front_end/panels/network/NetworkOverview.ts`, `networkPanel.css`, `NetworkWaterfallColumn.ts`, `RequestTimingView.ts`, `networkTimingTable.css` and `front_end/design_system_tokens.css`; and, from design-context, `guidelines/ltsegmentedcontrol.md` and `lticonbutton.md`.

**v6, 28 Oct 2026.** Rajat's sixth brief: 28 more changes to the Network tab, written *v6 item 1* to *v6 item 28*, with the standing reminder against hallucination. Covered by §3e, §4g, conflicts C50 to C56, §7g and the v6 rows of every other section; v5 text that v6 replaces keeps an italic note. Sources read from `design-context` `main` (still `618b4b8`) on 28 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md` (§1 rules, §2 casing, §3 tooltips, toasts and empty states), `guidelines/README.md` (§5 component choice, §10 drag and its keyboard twin), `ltbuttongroup.md` (the split button), `ltactionmenu.md` (no inputs in a menu; an inactive item says when it becomes available), `ltpopover.md`, `lticonbutton.md` (`unsafeDisableTooltip`), `ltswitch.md`, `COMPONENTS.md` (`LTToken`) and `icons.md`. Outside sources, each read on 28 Oct 2026: LambdaTest's [debugging options](https://www.testmuai.com/support/docs/debugging-options/#how-to-use-the-har-log-viewer) page (*Enable HAR logging by passing network.full.har = true in your test capabilities*); Firefox's DevTools source in mozilla-central (the `devtools.netmonitor.audits.slow` preference, 500, and the turtle at the right edge of the File column); compare.sitespeed.io's own script, `start.js` (a `har1` link plus `compare` opens that one HAR); and the WHATWG [Fetch Standard](https://fetch.spec.whatwg.org/#forbidden-request-header) (the forbidden request headers, and CONNECT as a forbidden method).

**v7, 28 Oct 2026.** Rajat's seventh brief: 14 changes to the Network tab, written *v7 item 1* to *v7 item 14*, with four screenshots: *screenshot S1*, the status filter menu with its first item grey at rest; *S2* and *S3*, the new toolbar with the error count at rest and pressed; *S4*, the settings menu. The brief points at S2 to S4 for the toolbar, the count's two states and the menu, so they count as brief there; their copy and icons still follow the guidelines (C62, C63). One change went to design-context itself, and only that one: a menu item is grey on hover only, never at rest (rajat-lt/design-context PR #19, merged as `6cfb737`). Covered by §3f, §4h, conflicts C57 to C63, §7h and the v7 rows of every other section; v6 text that v7 replaces keeps an italic note. Sources read from `design-context` `main` (`618b4b8`, then `6cfb737`) on 28 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md` (§2 sentence-case menu items, §3 tooltips, §4 colours), `guidelines/ltactionmenu.md` (single selection only, every item an icon or none, the trailing slot, an inactive item's reason in its text), `ltpopover.md`, `ltbutton.md`, `ltbuttongroup.md`, `ltinputbox.md`, `COMPONENTS.md` (`LTActionMenu`, `LTPopover`, `LTButton`), `patterns/automation-listing.md` (the scope selector joined to the search), `icons.md` and `data/tokens.json` (`btn.outline`, `btn.invisible`, `actionListItem`). The screenshots were measured (Pillow, about 2.6×): rows of 32px; the pressed count 32px tall with 8px side padding, a `#F6F8FA` fill and a `#D0D7DE` border, which are the outline variant's own; the hourglass in the toolbar's icon grey.

**v8, 29 Oct 2026.** Rajat's eighth brief: 3 changes to the Network tab, written *v8 item 1* to *v8 item 3*, with the standing reminder against hallucination: the hourglass amber everywhere, no time window token, and *View in HAR viewer* (one of the finalists offered for v7 item 7). Covered by §4i, §7i and the v8 rows of the other sections; v7 text that v8 replaces keeps an italic note. The amber is `attention.fg` (`#9a6700`), v6's turtle colour, read from `data/tokens.json` through `src/tokens.css`.

**Setup state, 30 Oct 2026.** Rajat's ninth brief: a loading state for the minutes before a test's results exist, for one flow (the device's setup, Apple Pay, the run, the results), with four reference screenshots. All of it sits in §12, in one place: the research, structure, behaviour, conflicts C64 to C75, decisions, copy, gaps, questions 72 to 85 and the illustrations. §6, §10 and §11 point there. Rajat reviewed it the same day (setup v2, 9 items): §12.12, conflicts C76 to C79, questions 86 to 90; the §12 text it replaces keeps a dated note.

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

**What v4 changes (19 Oct 2026)**

| Region | After v3 | After v4 |
|---|---|---|
| Header | *Remarks*; with the tests pane collapsed, the meta row and the remarks start under the expand button | *Remarks:* (v4 item 3); the meta row and the remarks start where the test name starts (v4 item 4) |
| All Commands | One level of test case; comfortable rows by default; the whole toolbar slides away | A test case can hold one more (v4 item 10); condensed by default (v4 item 7); only the heading and the timeline slide away (v4 item 11); the indent rule starts 4px under the chevron and ends on the last row's bottom border (v4 item 6) |
| A command's details | The comment above the payload; up to six icon buttons | The comment below the payload, with **Delete Comment** (v4 items 1, 2); Copy link and Pop out payload in a ⋯ menu, last (v4 items 8.8, 8.9); the status gives way when the bar is narrow (8.10) |
| Failure popovers | Raise a bug, Copy payload, comment | **Copy link** third (v4 item 5) |
| Video | A command line, the seek bar, then buttons; controls right of the frame when docked below | One row in every mode: play, seek bar, time, speed, picture-in-picture or dock, collapse, ⋯ (v4 item 9). The command line is gone; the failure marks stay |
| The video's side | The video | Payloads popped out of the list open as tabs beside a Video tab: up to 5, reorderable, closable (v4 item 8) |

**What v5 changes (27 Oct 2026)**

| Region | After v4 | After v5 |
|---|---|---|
| Network tab | *Network capture is off* on every test | The product's request list, rebuilt in light mode (v5 item 1): eight type segments, Download HAR, the search's field, *Search all fields*, *Errors only* and *Show CONNECT*; a table with Name, Status, Method, Domain, Type, Size, Start time, Duration and Waterfall that sorts on every header (items 2, 3, 5, 6, 7); the product's footer |
| A request | Nothing | Hovering its Waterfall bar opens its exact phase times to the right of the table, and they stay to copy from (items 7 to 9); clicking the row opens its details beside the table: Headers, Payload, Response, Timing (item 4) |
| Data | No requests | Each test's own page loads, from its Navigate To commands and its search (§4e); capture stays off for one test, t-07, which keeps that state; the Meta Data tab's `network` capability follows |

**What Rajat's answers change (28 Oct 2026)**

| Region | After v5 | After the answers |
|---|---|---|
| Waterfall | Each request's own breakdown, in the last column; sorts by waiting time | A timeline across the whole run, in the rows (each bar at its moment) or as a strip on top whose handles filter the list; Reset or R brings back the whole run; it does not sort |
| Phase colours | design-context tokens, validated | Chrome DevTools' own |
| Layout | The logs beside or below the video, on every tab | On the Network tab the logs always sit beside the video; the dock control shows on the other tabs |

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

**Added in v4:**

| Component | Where | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTButton` | **Delete Comment** (v4 item 2); **More** at the end of the media tabs | `variant="danger"` (`ltbutton.md`: destructive; C36), `size="small"`, `label`; `variant="invisible"` and `trailingIcon` for More |
| `LTActionMenu` | ⋯ in a command's details (Copy link, Pop out payload; Show in All Commands in a payload tab); ⋯ in the video's row (Download video, Enter full screen, Rotate video on mobile); More (folded media tabs); each media tab's menu | `customAnchor`, `options` with `icon`, `inactive` and `description`; `open` and `onMenuToggle` for the tab menu |
| `LTIconButton` | Copy link in the failure popovers (the composed copy button of v2); Close tab (`size="xsmall"`) | `ariaLabel`, `icon`, `size`, `variant`, `tooltipDirection` |
| Media tabs | The Video tab and the payload tabs (v4 item 8) | Composed: a `tablist` styled like `LTUnderlineNav`. No component switches panels in place at this level (C34, §9) |

**Added in v5:**

| Component | Where | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTSegmentedControl` | Request type: All, JS, CSS, Img, Media, Font, Doc, WS (v5 item 1) | `options`, `selectedValue`, `onChange`, `ariaLabel`. Eight options against README §5's five (C40) |
| `LTButton` with `LTActionMenu` | The search's field: All, Name, URL, Status, Method, Domain, Type | `variant="outline"`, `size="medium"`, `trailingIcon`, `label`; `selectionVariant="single"`, `activeId`, `customAnchor`, `width`, `align="start"`. README §5's filter dropdown, as *Tests: All* (C11) |
| `LTInputBox` | *Search all fields* | `value`, `onChange`, `placeholder`, `ariaLabel`, `forwardRef`, `allowClearSearch` |
| `LTSwitch` | *Errors only*, *Show CONNECT* | `label`, `labelPosition` (its default, END: the switch, then the label; C46), `checked`, `onValueChange`, `size="small"`. *v7: both switches are gone; Show CONNECT is a settings menu item* |
| `LTTable` | The request list; General and the headers in the details; the Timing table | `columns`, `data`, `allowValueCopy`. Sortable headers, rendered cells, row handlers and fixed widths are composed (§9) |
| `LTPopover` | Each Waterfall bar's phase times; the Waterfall legend | `heading`, `popOverbodyJSX`, `direction="right"` (bar) and `"right-top"` (legend), `containsInteractiveChildElement`, `openOnClick` (legend only), `forceClose` (C42) |
| `LTTabNav` | Headers, Payload, Response, Timing in a request's details | `items`, `activeTab`, `onSelect`, `ariaLabel`, `size="small"`. README §5: the second tab layer, below the page's `LTUnderlineNav` |
| `LTCodeBlock` | Request payload, response body | `title`, `headerActions` (the page's theme toggle and copy), `theme` |
| `LTCopyToClipboard`, composed copy | Copy URL, Copy payload, Copy response, each header value; Copy timings | `textToCopy`, `copyAriaLabel`, `copiedAriaLabel`; Copy timings is the composed copy of v2 |
| `LTIconButton` | Download HAR, Previous request, Next request, Close details, Waterfall phases | `ariaLabel`, `icon`, `variant`, `size`, `inactive`, `tooltipText` |
| `LTCounterLabel` | Header counts in the details | `count` |
| `LTBlankSlate`, `LTFlash`, `LTSkeletonBox` | The tab's states (§5) | as before |

**Built custom and flagged in v5:** the Waterfall bar and its legend (no chart component), the details panel beside the table (the v1 splitter, not `LTDrawer`: C45), and the composed `LTTable` parts above. See §9.

**Added with the answers (28 Oct 2026):**

| Component | Where | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTSegmentedControl` | Waterfall view: *Waterfall in rows*, *Waterfall strip on top* | `options`, `selectedValue`, `onChange`, `ariaLabel`, `isIconButton` (icons with their names on hover, as the dock control; §7f) |
| `LTIconButton` | Reset timeline, with R; the strip's Waterfall phases | `ariaLabel`, `icon`, `variant`, `size`, `inactive`, `tooltipText`, `keyshortcuts` and the shortcut in the tooltip (`lticonbutton.md`) |
| `LTTag` | The strip's window, *00:40 - 01:40* | `text` |
| Range timeline handles | The strip's two handles and its axis | v1's custom range timeline (`timeline.jsx`, flagged in §9 since v1): the same handles, arrow keys and ticks |

**Built custom and flagged in v2:** tab reordering around `LTUnderlineNav` (v2 item 1); the right-click menu's anchor (v2 item 2); the floating video window (v2 item 5); copy buttons with another icon or rich content, for Copy link and Copy table (v2 items 2, 10, 15), because `LTCopyToClipboard` has a fixed icon and copies plain text; the "full text when cut" tooltip helper (v2 item 16). See §9.

**Added in v7:**

| Component | Where | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTIconButton` with `LTActionMenu` | ⚙ *View settings*: Show waterfall overview, Show CONNECT, Set slow response limit; ⋯ *More actions* when narrow | `icon`, `ariaLabel`, `variant="invisible"`, `size="medium"`; `customAnchor`, `width`, `options`. Toggle items and a trailing value stand in for the TBD option shape (C57, C58, §9) |
| `LTButton` with `LTCounterLabel` | The error and slow counts, and All Commands' passed and failed counts: one composed control, `CountFilter` | `variant` (`invisible` at rest, `outline` pressed), `size` (`medium` here, `small` in All Commands), `ariaLabel`, `inactive`, with `aria-pressed`; `count` |
| `LTButton` and `LTInputBox`, joined | The search and its field as one control (`patterns/automation-listing.md`) | As in v5; the joined corners are this page's CSS |
| `LTToken` | The time window, now on the second row | As in v6, plus a stand-in `fullText` for the cut-short token (§9) |
| `LTPopover` | Copy timings in its head, left of × | As in v6, plus a stand-in `headerActions` (§9) |

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

### 3c. Structure after v4

```jsx
<CommandsScroll>
  <Toolbar>                         {/* v4 item 11: the first two rows slide away */}
    <TimelineHeading />
    <RangeTimeline />
    <Filters>Search commands (/) · Tests: All</Filters>   {/* stays */}
  </Toolbar>
  <Group kind="testCase" tc="#TC-7742" depth={0}>          {/* rule at 24px */}
    <Disclosure n={10} depth={1} />
    <Group kind="testCase" tc="#TC-8" depth={1}>           {/* v4 item 10: rule at 56px, sticks under its parent */}
      <CommandRow depth={2} />
    </Group>
    <CommandRow depth={1} name="Get Current URL" />        {/* the parent goes on after the child ends */}
  </Group>
</CommandsScroll>

<CommandDetail>
  <Bar>
    Request | Response · <LTTag text="500 Internal Server Error" />   {/* gives way first, 8.10 */}
    <Actions>Raise a bug · Add comment · View screenshot · Show as table · ⋯ (Copy link, Pop out payload)</Actions>
  </Bar>
  <Payload />
  <Comment />                       {/* v4 item 1; its box has Delete Comment on the left (v4 item 2) */}
</CommandDetail>

<VideoSide>
  {payloadTabs.length > 0 && (
    <MediaTabs>Video · ✗ Find Element 1:16 × · ✗ Find Element 1:16 (2) × · More ▾</MediaTabs>
  )}
  <VideoPane>                       {/* a tab panel once tabs exist */}
    <Stage />
    <Row>Play · SeekBar · 0:32 / 3:20 · 1x · Open picture-in-picture · Collapse video · ⋯ (Download video, Enter full screen)</Row>
  </VideoPane>
  <PayloadPanel />                  {/* one per payload tab */}
</VideoSide>

<PipWindow>
  <Header>Move video · {test name}</Header>
  <VideoPane mode="pip" />          {/* Dock video in place of Open picture-in-picture */}
</PipWindow>
```

### 3d. Structure after v5: the Network tab

```jsx
<NetworkTab>                        {/* kept mounted, like All Commands; fresh for each test */}
  <Toolbar>
    <LTSegmentedControl>All · JS · CSS · Img · Media · Font · Doc · WS</LTSegmentedControl>
    <LTIconButton ariaLabel="Download HAR" variant="outline" />
    <LTButton label="All" trailingIcon={ChevronDown} />   {/* the search's field, 100px wide whatever it says */}
    <LTInputBox placeholder="Search all fields" />
    <LTSwitch label="Errors only" /> <LTSwitch label="Show CONNECT" />
  </Toolbar>
  <Body>
    <Scroll>                         {/* both ways: the header sticks to the top, Name to the left */}
      <LTTable sort={{ key: 'name', dir: 'asc' }}>
        Name ↑ · Status ↕ · Method ↕ · Domain ↕ · Type ↕ · Size ↕ · Start time ↕ · Duration ↕ · Waterfall ↕ ⓘ
        <Row>favicon.ico · 200 · GET · www.airbnb.com · vnd.microsoft.icon · 24.6 KB · 00:05 · 34.77ms · <WaterfallBar /></Row>
      </LTTable>
    </Scroll>
    {open && <Splitter label="Resize request details" />}
    {open && (
      <RequestDetails>               {/* v5 item 4; the table keeps Name and Status */}
        <Head>favicon.ico · 34 of 61 · Previous request · Next request · Close details</Head>
        <Url>GET 200 https://www.airbnb.com/favicon.ico · Copy URL</Url>
        <LTTabNav>Headers · Payload · Response · Timing</LTTabNav>
        <Panel />
      </RequestDetails>
    )}
  </Body>
  <Footer>61 requests · 1.7 MB transferred · 4.3 MB resources · Finished in 2m 37s</Footer>
</NetworkTab>

<LTPopover direction="right">       {/* beside the bar, right of the table's edge */}
  <Heading>favicon.ico ×</Heading>
  ■ Queueing 2.21ms · ■ DNS lookup 0.00ms · ■ Initial connection 0.00ms · ■ SSL 0.00ms
  ■ Request sent 0.30ms · ■ Waiting (TTFB) 22.88ms · ■ Content download 9.38ms
  Total 34.77ms
  The connection was already open, so DNS lookup, initial connection and SSL took 0ms.
  Copy timings
</LTPopover>
```

*Answers, 28 Oct 2026: the toolbar's first row ends in the Waterfall view switch, then Download HAR; the strip, when chosen, sits between the toolbar and the list; the Waterfall column is 240px and only in the rows view. See the sketch after this paragraph.*

Column widths: Name takes what is left, at least 224px; Status 76, Method 80, Domain 128, Type 104, Size 80, Start time 96, Duration 88, Waterfall 160 (*240 since the answers*); 1,036px in all (*1,116px with the Waterfall column, 876px without*), each fitting its header and sort icon. Gutters are 16px, the outer ones in line with the toolbar. Rows are 32px, as condensed All Commands. At 1512 × 900 with the logs beside the video, the logs are 574px wide, so the table scrolls sideways under the sticky Name; with the logs below the video they are 1,055px wide and every column shows.

```jsx
// After the answers (28 Oct 2026)
<Toolbar>
  All · JS · CSS · Img · Media · Font · Doc · WS        [Waterfall in rows | Waterfall strip on top] · Download HAR
  All ▾ · Search all fields · Errors only · Show CONNECT
</Toolbar>
{view === 'strip' && (
  <Strip>                            {/* the whole run, 00:00 to 03:20 */}
    <Head>Timeline · <LTTag text="00:40 - 01:40" /> · Reset timeline (R) · ⓘ</Head>
    <Track>{/* up to 10 lanes of 3px bars; outside the handles dimmed; the playhead */}
      <Handle which="start" /> <Handle which="end" />
    </Track>
    <Axis>00:00 · 00:30 · … · 03:20</Axis>
  </Strip>
)}
<LTTable>                            {/* rows view: … · Duration · Waterfall ⓘ 00:00 - 03:20 */}
  <Row>favicon.ico · … · 34.77ms · <RunBar left="2.7%" width="max(3px, …)" /></Row>
</LTTable>
```

*v6 replaces the view switch, the strip and the legend: §3e.*

### 3e. Structure after v6: one window, two views

```jsx
<NetworkTab>                        {/* kept mounted; fresh for each test */}
  <Toolbar>                         {/* three rows, in order of importance (v6 item 26) */}
    <Row>
      <LTSegmentedControl>All · JS · CSS · Img · Media · Font · Doc · WS</LTSegmentedControl>
      <LTButtonGroup ariaLabel="HAR file">                   {/* item 22; folds into ⋯ when the row runs out */}
        <LTIconButton icon={Download} ariaLabel="Download HAR" />
        <LTActionMenu customAnchor={<LTIconButton icon={ChevronDown} ariaLabel="More HAR actions" unsafeDisableTooltip />}>
          View HAR file in external viewer · Download HAR for filtered requests
        </LTActionMenu>
      </LTButtonGroup>
      <LTActionMenu customAnchor={<LTIconButton icon={Ellipsis} ariaLabel="More actions" />}>Set slow response limit</LTActionMenu>
    </Row>
    <Row>
      <LTButton label="All" trailingIcon={ChevronDown} />  <LTInputBox placeholder="Search all fields" />
      <LTActionMenu selectionVariant="single" customAnchor={<LTIconButton icon={ListFilter} ariaLabel="Filter requests" />}>
        All requests · Errors · Slow responses
      </LTActionMenu>
      <LTSwitch label="Show CONNECT" />
    </Row>
    <Row>                            {/* the readout and the active filters: a token never moves the rows above */}
      ⊗ 2 · 🐢 2 · <LTToken text="Errors" /> · <LTToken text="Time: 00:40 to 00:50" />        <LTSwitch label="Overview" />
    </Row>
  </Toolbar>
  {overview && (
    <Overview>                       {/* the whole session, always (items 1 to 5, 12, 21) */}
      <Marks>▼ ▼ ▼ ▼ ▼</Marks>        {/* page loads; a click zooms to one */}
      <Track>{/* commands lane · histogram of requests in flight · page-load lines · error ticks · playhead · the window, with All Commands' handles */}</Track>
      <Axis>00:00 · 00:30 · … · 03:20</Axis>
    </Overview>
  )}
  <Body>
    <LTTable sort={{ key: 'start', dir: 'asc' }}>       {/* every edge resizes; every header but Name drags */}
      Name ↕ · Status ↕ · Method ↕ · Domain ↕ · Type ↕ · Size ↕ · Start time ↑ · Command ↕ · Waterfall  00:00 to 03:20
      <Row>whatnew.png 🖼 ⋯ · 200 · GET · www.airbnb.com · webp · 430 B · 00:05 · Navigate To · ▮ 65.00ms</Row>
      <Row>rum 🐢 ⋯ · 500 · POST · www.airbnb.com · plain · 21 B · 01:36 · after Find Element · ▮ 1251.88ms</Row>
    </LTTable>
    {open && <RequestDetails>{/* Copy link · More actions · Previous · Next · Close; Headers · Payload · Preview · Response · Timing */}</RequestDetails>}
  </Body>
  <Footer>9 of 61 requests · 200.6 KB transferred · 855.8 KB resources · Finished in 2m 37s</Footer>
</NetworkTab>

<LTPopover containsInteractiveChildElement>   {/* below the row, or above it; beside the Waterfall column */}
  rum ×
  Start time 01:36.482
  ■ Queueing 2.02ms · ■ DNS lookup 0.00ms · ■ Initial connection 0.00ms · ■ SSL 0.00ms
  ■ Request sent 0.30ms · ■ Waiting (TTFB) 1184.73ms · ■ Content download 64.83ms
  Copy timings
</LTPopover>
```

Column widths, all remembered once changed: Name 240px, and it takes whatever is left over; Status 76, Method 80, Domain 128, Type 104, Size 80, Start time 96, Command 168, Waterfall 280; 1,252px in all. Each has a minimum (Name 140, Waterfall 160, the rest 64 to 104) and 800px at most. The toolbar is 129px tall, the overview 89px.

*v7: the toolbar is two rows (§3f), the popover opens above its bar (§4h item 12), and the menus keep the link, cURL, fetch and HAR (§4h item 13).*

### 3f. Structure after v7: two toolbar rows

```jsx
<Toolbar>                          {/* two rows, 97px; neither wraps (screenshots S2, S3) */}
  <Row>
    <LTSegmentedControl>All · JS · CSS · Img · Media · Font · Doc · WS</LTSegmentedControl>
    <LTActionMenu customAnchor={<LTIconButton icon={Settings} ariaLabel="View settings" variant="invisible" />}>
      ✓ Show waterfall overview · ✓ Show CONNECT · ── · ⧗ Set slow response limit  500ms     {/* S4 */}
    </LTActionMenu>
    <LTButtonGroup ariaLabel="HAR file">
      <LTIconButton icon={Download} ariaLabel="Download HAR" variant="outline" />
      <LTActionMenu customAnchor={<LTIconButton icon={ChevronDown} ariaLabel="More HAR actions" unsafeDisableTooltip />}>
        Open in external viewer · Download filtered HAR
      </LTActionMenu>
    </LTButtonGroup>
    {/* below 548px: ⚙ and the HAR group become one ⋯ More actions (C60) */}
  </Row>
  <Row>
    <Joined>{/* patterns/automation-listing.md: the scope selector joined to the search */}
      <LTButton variant="outline" label="All" trailingIcon={ChevronDown} />
      <LTInputBox type="search" placeholder="Search all fields" />
    </Joined>
    {window && <LTToken text="Time: 01:34.1 to 01:37.7" />}   {/* v6 item 6's token, now here */}
    <CountFilter glyph={<StatusGlyph status="failed" />} count={2} />   {/* All Commands' control */}
    <CountFilter glyph={<Hourglass />} count={2} />
  </Row>
</Toolbar>

<LTPopover containsInteractiveChildElement headerActions={<CopyIconButton ariaLabel="Copy timings" />}>
  rum                                     ⧉ ×      {/* above the bar, caret on it (items 11, 12) */}
  Start time 01:36.482
  ■ Queueing 2.02ms · … · ■ Content download 64.83ms
</LTPopover>
```

The joined field and search take what the row leaves; the counts keep the row's end. A time window's token sits between them: in full while the search keeps at least 112px (572px logs and wider for a window with tenths), without its *Time:* below that (still read out), and shortened with an ellipsis at the narrowest logs, with the full text on hover. *v8 item 2: the token is gone; the search keeps at least 140px again.*

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
15. **Test case as a parent.** A command's parent is either an annotation or a test case, one level deep (*v4 item 10: two levels*). A test case header leads with its ID (`#TC-7742`) in muted text; an annotation header shows its name only. Both show `{n} total · {passed} · {failed}`.
16. **Failed tests open at the failure.** On load, passed runs are collapsed (item 6) and the list scrolls the first failed command into view, under the sticky toolbar, and highlights it once (item 9).
17. **One scroll.** The All Commands tab has a single vertical scroll, and nothing inside it scrolls on its own (payloads grow to their height). Scrolling down slides the timeline and search away (*v4 item 11: search and the filter now stay*) and keeps the current group's header pinned at the top. Scrolling up brings the timeline and search back, with the group header pinned below them. The toolbar stays while it has focus or hover, and while a scroll it started is running, so pressing Next failed command twice still works **[proposed]**.
18. **Indent rule.** An expanded group draws a vertical line from its chevron to its last command (`border.muted`, measured), so a group's start and end read at a glance. *v4 item 6: from 4px under the chevron to the last row's bottom border.*

## 4b. Behaviour, v2 (17 Oct 2026)

1. **Reorderable tabs.** Drag a tab sideways; past 4px it lifts, follows the pointer, and the other tabs slide aside to show where it will land. Esc puts it back. The click that ends a drag never opens the tab. The same moves live in each tab's own menu (right-click, Shift + F10 or the menu key): *Move left*, *Move right* and *Reset tab order*. A move that is impossible stays in the menu, inactive, with its reason (*Already the first tab*). That is design-context's own answer for reordering without a drag component (`patterns/module-details.md`, open question 3: move up and move down in the item's own menu). The order is remembered in the browser [proposed], and screen readers hear *Logs moved to position 1 of 4*.
2. **Right-click on a command.** On a command row, never on its group, the browser's menu gives way to *Copy payload*, *Copy link* and, after a divider, *Raise a bug*. From the keyboard, Shift + F10 or the menu key opens it under the focused row. Copy payload copies the request and the response as one JSON [proposed] (C25). Copy link copies the command's link in this test run, `#/{test}/commands/{command}`. The menu closes, so a toast says what happened: *Payload of Find Element at 1:16 copied.* If the clipboard refuses, the toast says so and what to do: *... failed to copy. Try again.* Opening a command's link opens the test at that command: filters that would hide it are cleared, its group and passed run open, its details open, the video moves to its moment, and the row is focused and highlighted. The link never opens the screenshot dialog: `ltmodal.md` says not to deep-link straight into a modal. The visible twin is a *Copy link* button in every command's details.
3. **Space.** Brings the next failed command into view and focuses it; after the last it starts again from the first (cyclic). Shift + Space goes back [proposed]. Only the list moves; the video stays where it is, as the brief asks ("it simply bring them in-view"); the timeline's chevrons are the controls that also move the video. It works on the All Commands tab whenever focus is on the page, on a row, or on anything else in the list. Inside the list Space means this on every row, buttons included, and Enter activates. Elsewhere (the toolbar, the video, a field) Space keeps its usual meaning. Screen readers hear *Failed command 3 of 20: Find Element at 1:16*. A passed test answers *All commands passed*.
4. **One payload view for every command.** Switching one command between JSON and table switches them all and is remembered, like the code theme. The button names the view it switches to: *Show as table*, *Show as JSON* (the brief's "show json"; v1 said *Show as code*).
5. **Picture-in-picture and collapse.** Two buttons on the video's control row. *Open picture-in-picture* floats the video in a small window over the page; the logs take the whole width. The window carries the same seek bar, failure markers, command line and controls, and it shares the one playhead, so every jump from the list moves it and every jump in it reveals its command (item 9). It moves by its header (or its grip and the arrow keys), resizes from its top-left corner between 320px and the smaller of 640px and half the window [proposed thresholds], always stays fully on screen, and remembers where it was. Its header holds *Dock video* and *Collapse video* (*v4 item 9.4: they moved into the video's row*). *Collapse video* hides the video and pauses it; the end of the tab bar then shows **Show Video**, which brings back the docked view, at its dock position and size. Each change moves focus to the control that reverses it and is announced (*Video collapsed. Show Video brings it back.*). Why a window in the page rather than the browser's own: §7b.
6. **Actions at a failure.** When the playhead is on a failure (seeked there, or playing through it), the command line above the seek bar turns red and reads *404 Not Found · Find Element* with the locator, followed by **Raise a bug** and **Copy payload**. A failure counts for at least 2 seconds, so a 120ms one stays readable while the video plays [proposed]. Away from failures the line names the command the video is on. *Superseded by v4 item 9.1: the line is gone.*
7. **Arrow keys between commands.** The list is one tab stop. Up and Down move focus to the previous or next row (group headers, commands and *Show n passed logs* rows, in screen order); Home and End go to the ends; Enter opens or closes a command's details. The focused row keeps itself in view under the sticky toolbar and group header, and keyboard movement never slides the toolbar away. Only the focused row's controls are in the tab order.
8. **Failure popovers.** Hovering a red stretch of the video's seek bar or the timeline opens an `LTPopover` with the failure's command line and type: *Failed at 0:32* · **500 Internal Server Error** · *unknown error* · *Create New Session · xpath · /Users/ltadmin/...*. A stretch that merges retries says *8 failed commands · 1:16 - 1:21* and folds identical failures into one line with *8 times*. Hover targets are at least 12px wide. It closes when the pointer leaves, and on Esc (C20).
9. **Double-click zoom.** Double-clicking a red stretch on the timeline zooms the bar to it, with a margin on both sides: a quarter of its length, at least 3 seconds each side, and a window of at least 10 seconds [proposed]. The zoom animates, the axis relabels (*1:13 ... 1:25*), retries that read as one block across the whole run separate, a tag beside the counts says *1:13 - 1:25*, and the list shows that window. Reset timeline undoes it, and is inactive with *Showing the whole run* when there is nothing to reset.
10. **Copy a table.** In table view, a copy button in the table's corner copies it with its rows and columns: HTML for rich editors (Docs, Notion, Confluence, email) and tab-separated text for spreadsheets and plain editors, header row first.
11. **Video controls, decluttered.** Three rows: the command line, the seek bar across the whole width, then Play, *1:16 / 3:20* and the speed (*1x*) on the left, and *Open picture-in-picture*, *Collapse video*, *Enter full screen* and *More video actions* (Download video, Rotate video) on the right. The reasoning, heuristic by heuristic, is in §7b. *Superseded by v4 item 9: one row again (C37).*
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
6. **Comments on failed commands.** In a failed command's details, *Add comment* (in the details bar, only while there is none) opens a comment box under the bar: `LTTextarea` labelled *Comment*, with a live count (*117 of 500 characters.*), **Cancel** and **Save**. An empty comment is refused with *Enter a comment.*; above 500 characters, with *Comment must be 500 characters or fewer.*; Cmd or Ctrl + Enter saves. A saved comment shows at the top of the details (*v4 item 1: below the payload now*), readable without a click: the author's initials and name, the time (relative, absolute on hover), the text, and *Edit comment*. Each commented failure gets a 10px comment mark above its stretch on the timeline, not clickable.
7. **Controls right of the frame when the logs are below.** Docked below, the video pane is wide and short, so the command line, seek bar and buttons move to the right of the frame, and the frame takes the pane's whole height at 16:9. The controls keep at least 320px and take whatever width is left; the frame shrinks first. Full screen goes back to controls below. *Superseded by v4 item 9.4.*
8. **Tables on white.** Request and response tables have a white background, also inside a failed command's red tint; the header row keeps its grey.
9. **Counts that filter.** The passed and failed counts beside *Timeline* are toggle buttons: pressing one shows only that status, pressing it again shows every command, and pressing the other switches. While one is on, passed runs stay unfolded and every group with a match opens, as search does. With only passed commands shown, the failure chevrons are inactive and say why (*Showing passed commands only*). A count of 0 is inactive. An empty result says *Clear the status filter or try a wider time range.*
10. **Rotate for mobile only.** Web videos lose *Rotate video*; with Download as the only rare action left, it becomes a plain button instead of a one-item menu (*v4 item 9.3: Download is in More video actions again*). Mobile recordings keep both in *More video actions*. Every mock test is web: `mock-data.md` has no mobile devices to stage one with (§9).
11. **(Reminder: nothing already built may break.)** Every v1 and v2 behaviour was tested again after these changes.

## 4d. Behaviour, v4 (19 Oct 2026)

1. **The comment comes after the payload.** In a failed command's details the order is now: the bar, the payload (table or JSON), then the comment, read or being written. Opening the comment box from a popover still brings the box itself into view.
2. **Delete a comment.** The box of a saved comment has **Delete Comment** on the left of its action row, in the danger variant, apart from **Cancel** and **Save** on the right. It deletes at once, with no confirmation, as the brief asks for now (C36). The box closes, focus returns to the command, screen readers hear *Comment deleted*, the comment mark leaves the timeline, and *Add comment* is back in the bar. A first comment being written has no Delete Comment: there is nothing saved to delete.
3. **Remarks:** The label reads *Remarks:* (C35).
4. **One left edge for the header's text.** With the tests pane collapsed, its expand button has a column of its own, as tall as the title row, and the title, the meta row and the remarks share the next column, so all three start where the test name starts. With the pane open there is no button, and all three start at the header's text edge, as before.
5. **Copy link in the popovers.** A single failure's popover, on the video's seek bar and on the timeline alike, carries four actions: Raise a bug, Copy payload, **Copy link** (third: the command's own link, as in its right-click menu) and Add or Edit comment. Copying turns the icon into a tick and the tooltip into *Copied*, and screen readers hear *Link to Create New Session at 0:32 copied*.
6. **The indent rule, as the design draws it.** Measured on the brief's screenshots 7 and 8: the rule sits under the chevron's centre (24px in) and starts 4px below the chevron's 16px box, so its first few pixels sit inside the group's header. It runs down to the bottom border of the group's last row, whether that is a command, an open command's details, a *Show n passed logs* row or a nested test case. v1 started it under the header and stopped it 12px short.
7. **Condensed by default.** New visitors get condensed rows. The toggle stays, and a choice made with it is still remembered. The default v3 stored for every visitor is not carried over (§7d).
8. **Payloads in tabs beside the video.**
   1. A failed command's ⋯ menu offers **Pop out payload**; passed commands do not.
   2. Choosing it opens the payload as a tab beside the video. The first time, the video moves into a tab too: **Video**, then the payload's tab, styled like the page's tabs (C34). The new tab opens at once and the video pauses, since it can no longer be seen. Focus stays on the ⋯ button, and screen readers hear *Payload of Create New Session at 0:32 opened in a tab*.
   3. The Video tab cannot close. Floating the video (picture-in-picture) or collapsing it takes its tab out of the row; **Dock Video** or **Show Video** brings it back where it was, open. Payload tabs stay whatever the video does: with the video away, its side of the page shows just them. Payload tabs close; they never float or collapse.
   4. Up to 5 payload tabs. With 5 open, Pop out payload stays in the menu, inactive, with *Available after you close a payload tab*. Every tab, Video included, reorders: drag it sideways (Esc cancels), or open its menu (right-click, Shift + F10 or the menu key) for **Move left** and **Move right**, plus **Close tab** on a payload.
   5. Before the first payload opens there are no tabs, and the video shows as it always has. Closing the last payload tab returns to that.
   6. While a payload is open in a tab, Pop out payload is gone from its menu. The tab's × (or Delete on the focused tab, or Close tab in its menu) is the way back: it closes the tab, and Pop out payload returns. Closing the open tab opens the one to its left. Closing from the keyboard moves focus to the tab that opens or, after the last payload tab, to the video's Play button (or to **Dock Video** or **Show Video** when the video is away).
   7. The payload shows in both places: under the command, when its details are open, and in its tab. The tab shows what failed and when (*Create New Session · /Users/... · At 0:32 · 400ms*), then the same bar, payload and comment as under the command. The payload view, the code theme and the comment are shared, so a comment saved in the tab shows under the command too. The tab's ⋯ menu has **Copy link** and **Show in All Commands**, which opens the command in the list the way its link does [proposed].
   8. Six icon buttons did not fit the details bar, so **Copy link** and **Pop out payload** move into a ⋯ menu.
   9. The ⋯ menu is last in the bar, and on every command, so Copy link is always in the same place.
   10. When the bar runs out of width, the status gives way first: it shrinks to 48px (*500…*, the whole label on hover) while the segmented control and the buttons keep their size and place. Where even 48px is not left (a command inside a nested test case with the logs at their narrowest), the status hides; the payload right below states it, and a bare code is never shown (C39). Only when the buttons alone do not fit (a payload tab in a 320px pane) do they move, as one group, to a line of their own under the segmented control, right-aligned.

   **Tab labels.** The failed mark, the command's name (cut past 160px, whole on hover), its time and ×. Retries in the same second read alike, so the later ones get *(2)*, *(3)* by run order. The open tab is bold with the orange underline; a hidden bold copy holds every tab's width, so opening one moves nothing.

   **When tabs outgrow the pane.** Tabs never scroll sideways (`ltunderlinenav.md`): those that do not fit fold into **More ▾** at the end of the row, as the base pattern's own tab bar does, and the open tab always stays in the row. Choosing a tab from More opens it.

   **Keyboard.** The tabs are a tablist and one tab stop. Left and Right move between tabs, Home and End go to the ends, Enter or Space opens the focused tab (so passing over Video never pauses or plays it), and Delete closes a payload tab. × is the mouse's twin and stays out of the tab order.

   **Per test.** Payload tabs belong to their test, for the session: another test has its own (or none), and they come back on returning.
9. **The video's controls: one row, in every mode.**
   1. The command line above the seek bar is gone. The failure marks on the seek bar, and their popovers, stay.
   2. One row, in the brief's order: Play or Pause, the seek bar (it takes the room left), *0:32 / 3:20*, the speed (*1x*), then the icon buttons.
   3. Download video and full screen move into **More video actions** (⋯), last in the row; Rotate video joins them for mobile recordings only. The row's other icon buttons are **Open picture-in-picture** and **Collapse video**.
   4. The row is the same docked beside the logs, docked above them, floating and in full screen. Floating, its first icon button docks the video (**Dock video**, focused when the window opens), and the floating window's header keeps only its grip and the test's name: Dock and Collapse are no longer repeated there. Switching windows from full screen leaves full screen first. Docked above the logs, the frame takes the height left after the row, at 16:9, and the row matches the frame's width, centred, with at least 320px so its controls fit. A row under 360px (a floating window made smaller than its default) drops the total and keeps the elapsed time; the seek bar announces both.
10. **A test case inside a test case.**
    1. A test case can hold another, two levels at most: test case, test case, commands, payload. #TC-7742 holds #TC-8 in its middle, so #TC-7742 goes on after #TC-8 ends; #TC-56345 holds #TC-4410 last, so both end together.
    2. The nested test case has its parent's anatomy: chevron, muted ID, bold title, `{n} total · {passed} · {failed}`, a sticky header, the condensed grey band, its own indent rule.
    3. Each level is 32px further in. Commands sit at 16px on the page, 48px in a test case and 80px in a nested one; the nested header's chevron sits at 48px, in line with its siblings' status icons; an open command's details line up with its name (40, 72 and 104px).
    4. Each open group draws its own rule under its own chevron (24px and 56px), so the page shows where a test case starts, where its child starts, where the child ends (its rule stops and the rows step back 32px) and where the parent ends (its rule stops). The outer rule runs on through the nested header. Scrolled into a nested test case, both headers stay pinned, the child's under its parent's.
    5. Counts take in the nested test case's commands (#TC-7742: *20 total*, 9 of them in #TC-8). Search matches a command on its own words or on any group around it. The Tests filter lists the nested test cases too, with *Inside #TC-7742*; choosing a test case opens it and the one it runs inside, and choosing #TC-7742 includes #TC-8's commands. A command's link, Space and the arrow keys open and walk every level, in screen order.
11. **Search and the filter never slide away.** Scrolling down slides away only the Timeline heading and the timeline; search and the Tests filter stay pinned at the top, with the group headers pinned right under them, in the order screenshot 6 shows. Scrolling up brings the rest back. Focus in search or the filter leaves the timeline where it is; focus on anything above them brings it back.
12. **(Reminder: double-check every point.)** Every item was checked in the running page at 1512 × 900 and 1280 × 800, with layout measured in the page, and every v1 to v3 behaviour was tested again.

## 4e. Behaviour, v5: the Network tab (27 Oct 2026)

1. **The existing list first.** Screenshot N1's tab, rebuilt in light mode from the page's tokens and components: the type segments (All, JS, CSS, Img, Media, Font, Doc, WS) with Download HAR on the right; the search's field (*All*) and *Search all fields*; *Errors only* and *Show CONNECT*; the table; and the footer.
   - **The requests** are each test's own page loads: every Navigate To, and the results page its search submits to, so the list lines up with the commands and the video. The default test, t-01, loads 5 pages in 61 requests (64 with the CONNECT tunnels): the first page fetches the screenshots' files fresh, later pages revalidate most of them (304) and fetch the rest, and every page sends a RUM beacon. Two fail: the checkout page's beacon (*500*, at 01:36) and the login page's banner image (*404*, at 02:10). Names, types, sizes and durations of the first page are the screenshots' own (§9).
   - **Type segments** filter by what was requested, so the missing image stays under Img while its Type shows *html*, what came back. Media and WS find 0 requests in this mock and say so (§5).
   - **Search** looks in the chosen field, ignoring case: *All* (every text column and the URL), Name, URL, Status (code and its text), Method, Domain, Type (the subtype and the MIME type). Matches are marked in the cells that field covers; a URL search also marks names and domains. Choosing a field puts focus back in the search, whose placeholder follows (*Search URLs*). Esc clears it.
   - **Errors only** keeps status 400 and up (*v6: a count and a filter instead, §4g item 24*). **Show CONNECT** adds the CONNECT tunnels, which count in the footer only while shown (§7e).
   - *Answers, 28 Oct 2026: the logs always sit beside the video on this tab, and the first toolbar row also holds the Waterfall view switch (§4f).*
   - **Download HAR** saves `{test ID}-network.har`: HAR 1.2, the whole log whatever the filters, CONNECT included, one page per page load, with headers, text bodies and the phases (HAR's `connect` includes `ssl`; a phase that does not apply is `-1`).
   - **The footer** reads *61 requests · 1.7 MB transferred · 4.3 MB resources · Finished in 2m 37s*. Filtered, the count says *15 of 61 requests* and the sizes add up what shows. *Finished in* is when the last request ended, from the start of the run, for the whole log.
2. **Column names.** Screenshot N1 has a header row whose text is nearly invisible in dark mode; enhanced, it reads *Name, Status, Method, Domain, Type, Size, Time*. Those names stay, with Time renamed (item 5), *Start time* added (item 6) and *Waterfall* last (item 7). Header text is `SMALL_BOLD`, 12px, muted, on the grey header row (README §3), readable in light mode.
3. **Sorting.** Every header is a button. A click sorts its column ascending, the next click on it descending, the next ascending again; a click on another column sorts that one ascending. The default is Name ascending (*v6: Start time ascending, §4g item 16*). Ties keep run order, earliest first, whichever way the column sorts, so the five `_app-fb6ea908a8e8fe2c.js` rows read in the order they loaded. The sorted column shows ↑ or ↓; the others show ↕ in a lighter grey. `aria-sort` sits on the sorted header only, and screen readers hear *Sorted by Duration, descending*. Waterfall sorts by its waiting phase, and says so on hover (*Sorts by waiting time (TTFB)*; question 40). *Answered 28 Oct 2026: Waterfall does not sort.*
4. **A request's details** (Rajat's answer). Clicking a row, or Enter on its name, opens the details beside the table, as developer tools do; the table narrows to Name and Status (Name alone when that would leave it under 220px, as at 1280px wide), and the row takes the selection: the orange bar plus the grey fill (README §1).
   - The head: the name, its place (*34 of 61*), **Previous request**, **Next request** (inactive at the ends, with *This is the first request*) and **Close details**; then the method, the status code (red from 400) and the URL, with **Copy URL**.
   - `LTTabNav`: **Headers** (General, which also holds what the hidden columns show: URL, method, status code, content type, transferred, resource size, start time, duration; then the response and request headers, each with its count and a copy button per value), **Payload** (the request body, or *Empty payload*), **Response** (the body in a code block with the page's theme toggle and copy, or why there is none, or that it is binary), **Timing** (§4e item 7's phases, each on the request's own timeline, with the total, the note and **Copy timings**). Left and Right move between the tabs, Home and End go to the ends. The tab chosen stays for the next request.
   - A splitter resizes the details from 320px up to what leaves the table 220px, and the width is remembered. Clicking a Waterfall bar opens the details on Timing.
   - Esc, **Close details**, or a filter that hides the request closes them, and focus goes back to its row.
5. **Duration.** The product's Time, renamed, with its two decimals: *34.77ms* (§9 on the form). *v6: the column is gone; the duration follows each bar, in milliseconds (§4g item 18).*
6. **Start time.** When the request started in the run, `mm:ss` as the brief writes it: *00:05*, *02:10* (C41).
7. **Waterfall.** The last column draws each request's own breakdown, as screenshot N2 does: every phase that took time, in time order, 2px apart, the whole bar standing for the request's duration (§7e). The phases are HAR 1.2's: Queueing, DNS lookup, Initial connection, SSL, Request sent, Waiting (TTFB), Content download. Hovering a bar for 250ms opens a popover with every phase's exact time, phases that took 0ms in muted text, the total, one line on why some took 0ms (*The connection was already open, so DNS lookup, initial connection and SSL took 0ms.*), and **Copy timings**. The ⓘ in the header opens the legend: each phase, its colour, and what it is. *Answered 28 Oct 2026: the column is now the whole run, and the strip is the other way to see it (§4f).*
8. **The popover opens on the right.** *v6: below or above its row, beside the Waterfall column (§4g item 8).* Never above or below the bar: it opens right of the table's edge, centred on the row with its caret on it, and the legend hangs down from the header row (`right-top`). With the logs beside the video, the table's edge is the video's, so the popover sits over the video and covers no row. When part of the Waterfall column is scrolled out of view, it opens beside the part in view. When the table reaches the window's edge (logs below the video, or the video floating or collapsed), there is no room to its right: it keeps to the window's edge, still to the right, and covers the end of nearby rows (question 41). *Answered 28 Oct 2026: the Network tab no longer docks the logs below the video, so the table's edge is always the video's (§4f); the floating and collapsed video remain (question 49).*
9. **It stays open.** Leaving the bar leaves the popover open, so values can be selected and copied. It closes with its close button, Esc, a click outside, scrolling the table, switching tabs, or hovering another bar for 250ms, which replaces it: one at a time (`ltpopover.md`). A pointer that only crosses other bars on its way to the popover opens nothing.
10. **Visual hierarchy.** Name, Status, Size and Duration in default text; Method, Domain, Type and Start time in muted text. Error rows take the failed command's tint and a red, semibold status code; the code is the label, so colour is never alone. The selection is the orange bar plus the grey fill. Name sticks with a hairline while the rest scrolls under it. Numbers sit right, in tabular figures. The phase colours are validated (§7e). *Answered 28 Oct 2026: Chrome DevTools' colours instead (C48).*
11. **Everything works.** Every control works on every test: segments, search, field, switches, sort, the popover and the legend, the details and their tabs, every copy button, the splitter, Download HAR, and the states (§5). The list is one tab stop: Up and Down move between requests, Home and End go to the ends, Enter opens one; with the details open, the open request follows the arrows. The tab keeps its filters, sort, open request and scroll while another tab shows, and starts fresh for another test.

## 4f. Behaviour after Rajat's answers (28 Oct 2026)

1. **A timeline across the whole run** (answer to 39). The run is 0:00 to the test's duration (3:20 for t-01), the same span as the video and All Commands' timeline.
2. **Waterfall view: rows or strip.** *Superseded by v6: one overview, always the whole session, sharing its window with a Waterfall column that always shows (§4g items 1, 2 and 19).* The first toolbar row ends in an icon segmented control, *Waterfall view*: **Waterfall in rows** (ChartGantt) and **Waterfall strip on top** (PanelTop), named on hover as the dock control's icons are. The choice is remembered, like the page's other views, and announced (*Waterfall shows as a strip on top*).
   - **In rows:** the last column, 240px, is the whole run, with *00:00 - 03:20* in its header and a faint line every minute (for a 3:20 run; the step runs from 5 to 300 seconds, so no run shows more than 6 intervals). A request's bar starts at its start and is as long as it took, at least 3px; at this scale most bars are that thin, so a page load's requests read as a short stack of marks at the same moment, and the hover popover holds their phases. The popover, the legend and a click to Timing work as in §4e.
   - **Strip on top:** the Waterfall column goes, and a strip sits between the toolbar and the list: *Timeline*, the whole run with its axis (*00:00, 00:30 … 03:20*), each request a 3px bar (DevTools' band height) in up to 10 lanes, packed so requests that overlap in time stack. The video's playhead runs across it. Two handles, All Commands' own, select a window: drag them, or focus one and use the arrow keys (1 second, 10 with Shift), Home and End. The list keeps every request that runs at any moment of the window, the footer counts *20 of 61 requests*, a tag says *00:40 - 01:40*, and the strip dims everything outside it. The type segments, search, Errors only and Show CONNECT also thin the strip, so it shows what the list could show.
   - **Reset timeline** (Undo2, at the strip's top right) brings back the whole run, and so does **R** anywhere on the tab except in a text field; it is inactive, with *Showing the whole run*, when there is nothing to reset. **Clear Filters** resets the window too. Leaving the strip view resets it, so no hidden window filters the rows.
   - Hovering a row in the list rings its bar in the strip, and the open request's bar stays ringed, as developer tools highlight a request in their overview.
   - The strip's ⓘ opens the same legend, beside the list.
3. **Waterfall does not sort** (answer to 40). Its header has no sort button; every other column still sorts on a rotating click.
4. **Chrome DevTools' colours** (answer to 42; C48). Queueing white with a light grey border, DNS lookup `#00677F`, Initial connection `#EAB308`, SSL `#D190FF`, Request sent `#009DC1`, Waiting (TTFB) `#37BE5F`, Content download `#4C8DF6` with a `#03A9F4` border: the light theme of DevTools' overview and Waterfall column. They are in `src/devtools-phases.css`, each with its DevTools source, not in the generated `tokens.css`.
5. **The logs stay beside the video on the Network tab** (Rajat's answer to 41). The dock control leaves the tab bar while Network is open; a layout docked below on another tab comes back on leaving. The popover therefore always opens over the video, clear of the table. The video can still float or be collapsed (question 49).
6. **`mm:ss` stays** for Start time (answer to 38), and the strip's axis, tag and handles use it too, so the tab reads one form.

## 4g. Behaviour, v6: one window for the overview and the Waterfall (28 Oct 2026)

1. **The overview is always the whole session.** It sits between the toolbar and the list, the full width of the tab (`network-overview.jsx`). From the top: a row of page-load markers; then the track, with a thin lane of the test's commands (passed in grey, failed in red), a histogram of the requests in flight in each 5px column of the session (3px bars, 2px apart, at least 2px tall where anything is in flight), a dashed line at each page load, a red tick at each error, the video's playhead, and the window: the part outside it dimmed, All Commands' two handles at its ends. Then the axis, *00:00 · 00:30 · … · 03:20*. The histogram counts what the type segments, the search, the status filter and Show CONNECT keep, so it never shows activity the list cannot reach. Hovering the track shows the time and the command running then (*01:16 · Find Element*). Hovering a row marks its request on the histogram, and the open request stays marked.
2. **One window, two views.** The overview's window and the Waterfall column's span are the same thing. Zooming or panning in either moves the other, and the list follows. There is no view switch any more (*v5's rows-or-strip switch is gone, item 19*).
3. **A page-load marker zooms to that load**, from its document request to the end of the last request before the next navigation: *Time: 01:34.1 to 01:37.7* for t-01's third page. The markers are one tab stop; Left and Right move between them, Enter zooms. Each says where it goes (*Zoom to page load 3: /book/stays*).
4. **A double-click on a cluster zooms to it.** Requests closer together than an 80th of the session (at least half a second; 2.5 seconds for t-01) form a cluster; a double-click on one, or within 8px of it, zooms to it with 5% to spare on each side. A double-click on empty track does nothing.
5. **A pinch zooms around the pointer**, over the overview, the Waterfall column or its header: the moment under the pointer stays where it is. Chromium browsers send a trackpad pinch as a wheel event with Ctrl held, and Safari as gesture events; both are handled, and the page itself does not zoom there (C54). A sideways scroll over either view moves a zoomed-in window; over the overview it moves at the overview's scale. An ordinary scroll still scrolls the list. The narrowest window is 0.2 seconds.
6. **The window filters the list.** Rows that run at no moment of it leave the list, the footer counts *9 of 61 requests*, and a token in the toolbar's third row says *Time: 00:36.2 to 00:44.3*, with tenths under 10 seconds and hundredths under 1 (C53). Its × clears it, and so does **R** anywhere on the tab outside a text field (*Clear time range (R)*). Screen readers hear the window and the count once it settles (*Showing 00:36.2 to 00:44.3, 9 of 61 requests*). **Clear Filters** in an empty list clears it too. *v7: the token sits beside the search in the toolbar's second row (§3f).*
7. **Nothing is too small to draw.** In the Waterfall column a request's bar is at least 2px wide and each phase in it at least 1px. A request under 2px wide at the window's scale is a sliver: one 2px tick, slightly taller than a bar, in the colour of its longest phase, so it is never left out. At the whole session's scale nearly every request is a sliver; zoomed to a page load, bars show their phases.
8. **The timing popover opens below its row, or above it** when the viewport ends first, and always inside the viewport (8px from its edges). Where the table has room, it sits beside the Waterfall column rather than over it, its caret on the row, so the pointer can run down the column from bar to bar; otherwise beside the column on the right, or under the bar. The whole cell is the hover target, so the pointer never falls into a gap between rows. Moving to another row's bar swaps the popover in one step, without its fade, so nothing blinks; it never covers its own row, so it cannot open and close in a loop. It still stays open to copy from, and closes with ×, Esc, a click outside, scrolling, switching tabs, or any change to the rows under it (zoom, sort, filter). *v7 item 12: it opens just above its bar, its caret on the bar (question 58 answered).*
9. **Slow responses carry a turtle**, Firefox's sign, at the right edge of the Name cell, when the request waited longer than the limit for its first byte (Waiting, TTFB). The limit is 500ms, Firefox's default (`devtools.netmonitor.audits.slow`), and *Set slow response limit* in the toolbar's overflow menu changes it, in a dialog since a menu holds no inputs (`ltactionmenu.md`). It is remembered for every test. In the mock, the search results page waits about 0.65 seconds on every run, and t-01's failing checkout beacon over a second [mock]. Hovering the turtle says *Slow response: waited 652.84ms for the first byte, over the 500ms limit*. The readout counts them, and the filter can show only them [proposed]. *v7: the hourglass (item 6), in grey; the limit lives in the settings menu (item 5); the readout and filter became the slow count (items 9, 10).*
10. **Every column resizes** by dragging its right edge, where a blue line shows on hover. The edge is a separator too: focus it and use Left and Right (16px, 64px with Shift), Home and End; Enter or a double-click restores the column's width.
11. **Images preview.** Hovering an image's name shows it under or over the row, at its own size up to 160px, on a checkerboard, with its size and type (*120 × 40 · image/webp · 430 B*). The details gain a **Preview** tab for images, before Response, with the image at its own size and, for a 304, a note that it is the browser's cached copy. Images whose bodies were not captured show the capture state of item 15 instead.
12. **Each request shows the command it ran under.** A Command column links to the command running when the request started, or, between commands, to the last one before it, after the word *after* (*after Find Element*). It sorts by the order the commands ran. The overview's top lane draws every command, the lane the brief cites from Playwright's trace viewer, and the hover bubble names the one under the pointer.
13. **Selecting a request seeks the video** to its start, as a command's row does: a click, Enter, Previous and Next, the arrow keys with the details open, and a request's link. All Commands follows the seek the next time it shows, revealing and flashing the command at that moment.
14. **Request actions, kept to their context.** The details' head shows one, **Copy link**, and its **More actions** menu holds the rest: *Copy as cURL*, *Copy as fetch*, *Copy as HAR*, *Copy request headers*, *Copy response headers*, *Copy response*. Inside the tabs each list copies itself: the response and request headers beside their titles, the body in the Response tab, the timings in Timing. The row menu (right-click, Shift + F10, the menu key, or the ⋯ that shows on a hovered row) has all seven, link first. A copy that has nothing to give stays in the menu, inactive, saying when it becomes available: *Available for GET and POST requests* (cURL and fetch for a CONNECT tunnel, which fetch refuses), *Available with network.full.har on*, *Available for text responses*. A menu copy reports in a toast, since the menu has closed: *rum at 01:36 copied as cURL.* *v7 item 13: the menus keep the link, cURL, fetch and HAR; the headers copy as tables in their tab (item 14).*
15. **No body, by choice.** On a run without `network.full.har`, the Response tab, and Preview for images, say *Response body capture is off* · *This run recorded headers and timings only. Set network.full.har to true to capture response bodies on the next run.*, with the capability to copy (`"network.full.har": true`) and **View HAR Docs**, LambdaTest's page that names it. In the mock, the failed runs with network capture (t-01, t-04, t-10, t-16) captured bodies and the passed ones did not [mock]; the Meta Data tab's capabilities list `network.full.har` for each.
16. **The list starts in run order**: Start time ascending on first load, for every test. Sorting another column works as in v5.
17. **Columns move by dragging their header**, every column but Name, which stays first since it sticks to the left. A blue line marks where the column will land; Esc cancels; the click that ends a drag does not sort. The keyboard twin is the column's own menu (right-click, Shift + F10 or the menu key on its header): *Move left*, *Move right*, *Reset columns*. Order and widths are remembered for every test, across reloads.
18. **Duration moves into the Waterfall.** The column is gone; each bar is followed by its duration, small and muted, in milliseconds even past a second (*1251.88ms*). Where the lane ends first, the duration sits before the bar; where the bar fills the lane, over its end on a white ground.
19. **The Waterfall column always shows** (beside the details, as in v5, the list keeps Name and Status only). The **Overview** switch, at the end of the toolbar's third row, shows or hides the overview, and is remembered for every test. The window stays when the overview hides, and its token still shows. *v7 item 4: the switch became the settings menu's Show waterfall overview.*
20. **Images are marked in their row**: an image icon at the right edge of the name, for every image whose body was captured, so they can be found at a glance and previewed (item 11).
21. **Drag on the overview to choose a window**, and drag the window to move it. A press that does not move is a click, and a click does nothing, so a double-click stays free (item 4). The window is also a slider for the keyboard: Left and Right move it a tenth of its width (half with Shift), plus and minus zoom it, Home and End take it to the ends. The handles step 0.1 second in windows up to 2 seconds, 0.5 up to 20, 1 beyond, ten times that with Shift.
22. **HAR, as a split button**: **Download HAR** saves the whole log (CONNECT included), and its caret opens *View HAR file in external viewer* and *Download HAR for filtered requests*, which saves what the list shows (*9 of 61 requests*) and waits, inactive, until a filter is on (C50). *v7 item 7: Open in external viewer and Download filtered HAR, without descriptions.*
23. **The external viewer is compare.sitespeed.io**, opened in a new tab with this test's HAR. It loads a HAR from a link, so each test's HAR is also a file beside the page, `har/{test}.har`, built with the page (`vite.config.js`), which GitHub Pages lets any site read. In the product, that link is a security question (59). The viewer reads a HAR's pages as runs of one page, so it opens comparing the first page load with the second, with a picker for each; the HAR names the browser (`log.browser`) and each page's address (`_url`, a custom field its PageXray reads), so each run is titled by its page, not by the CONNECT tunnel that opens the log (checked on the live site, 28 Oct 2026).
24. **Errors: a count and a filter**, as the tests pane has. The *Errors only* switch is gone. The third row starts with a readout, the failed glyph and the number of errors (status 400 and up), then the turtle and the number of slow responses; and a filter menu beside the search, `ListFilter`, offers *All requests*, *Errors* (*Status 400 and above*) and *Slow responses* (*Waiting (TTFB) over 500ms*). The filter chosen shows as a token with its ×, beside the time token. *v7 items 9 and 10: the readout, the filter menu and its token became two counts that filter, All Commands' control (question 56 answered).*
25. **No legend.** The ⓘ and its phase legend are gone; the popover and the Timing tab name every phase.
26. **The toolbar keeps its order as the logs narrow.** First row: the type segments, then HAR and the overflow menu; second: the search and its field, the filter, Show CONNECT; third: the readout and tokens, then the Overview switch. When the first row cannot hold the segments, the HAR group and ⋯ (below about 549px, as at 1280 × 800), the HAR actions fold into ⋯, where *Download HAR*, *View HAR file in external viewer* and *Download HAR for filtered requests* lead the menu. Nothing else moves; the search keeps at least 140px. *v7: two rows; below 548px the settings and the HAR group fold into one ⋯ (C60).*
27. **The popover has the start, not the total.** Its first line is *Start time 01:36.482*, to the millisecond, set apart from the phases; the total and the note on 0ms phases left it. The Timing tab keeps both, and *Copy timings* in the popover copies what it shows. *v7 item 11: Copy timings moved to the popover's head, and the footer left.*
28. **Every request has its own link**, `#/{test}/network/{request}`: *Copy link* in the details' head and in the row menu. Opening one opens that test on the Network tab with the request selected and its details open, the row in the middle of the list with focus, and the video at its start. Whatever would hide it is cleared first (its type, the status filter, a search that misses it, a window it is outside), and a CONNECT tunnel turns Show CONNECT on. All Commands, which opens a failed test at its first failure, follows the request's moment instead. A link to a request this run lacks says so in a toast.

## 4h. Behaviour, v7: the toolbar from Rajat's screenshots (28 Oct 2026)

1. **Two toolbar rows, as screenshots S2 and S3 draw them.** The first holds the type segments, then the settings menu and the HAR split button at its end; the second, the search joined to its field, then the error and slow counts at its end. v6's third row is gone: its readout became the counts (items 9, 10), its Overview switch a menu item (item 4), and its time token moved beside the search (§3f). The toolbar is 97px tall, 32px less than in v6. Neither row wraps, so nothing under the toolbar moves while a window is drawn.
2. **The type segments stay as they were**: All, JS, CSS, Img, Media, Font, Doc, WS.
3. **Settings: a gear, the invisible variant**, named *View settings*, left of the HAR group. It opens S4's menu.
4. **The settings menu ticks what is on**: *Show waterfall overview* and *Show CONNECT* show or hide the overview and the CONNECT tunnels, with a tick while each is on. A choice closes the menu (`closeMenuOnClick`, true by default) and is announced (*Waterfall overview hidden*, *CONNECT requests shown*). The overview's choice is remembered for every test, as before; Show CONNECT resets with each test, as before (question 65). The items take sentence case (C63).
5. **Set slow response limit opens the same dialog** as in v6. The item shows the limit in its trailing slot, *500ms*, as S4 does (C58), and screen readers hear it with the label.
6. **The hourglass marks slow responses** everywhere the turtle did: the row's flag, the slow count, the settings item, and the dialog's help (*… get the hourglass.*). lucide `Hourglass`, present in 1.58.0. It wears the toolbar's icon grey, as S2 draws it, in the rows too (§7h). *v8 item 1: amber everywhere.*
7. **The HAR menu's items are short, without descriptions**: *Open in external viewer* and *Download filtered HAR*. With no filter on, *Download filtered HAR* stays inactive, and its reason (*Available while a filter is on*) is read to screen readers only (C59). *v8 item 3: View in HAR viewer.*
8. **The search keeps its field** and works as in v5 and v6; the two now read as one control, the scope selector joined to its search that `patterns/automation-listing.md` draws.
9. **Errors and slow responses are counts that filter**, where the search ends: the failed glyph with the number of errors (status 400 and up), and the hourglass with the number of slow responses. It is All Commands' control, one component for both tabs (`CountFilter` in `lt.jsx`): pressing one shows only those requests; pressing it again shows every request; one at a time, as in All Commands. The counts follow the type and the time window, as All Commands' follow its test filter and range, and leave the search out, as those do [proposed]. A count of 0 is inactive unless its filter is on. Tooltips: *Show only errors: status 400 and above*, *Show only slow responses: waiting (TTFB) over 500ms*, *Show all requests*, *0 errors*. The v6 filter menu and its token are gone.
10. **Rest and pressed, as S2 and S3 show.** At rest, the invisible variant; pressed, the outline variant, whose own colours (`btn.outline.bg` `#F6F8FA`, `btn.outline.border` `#D0D7DE`) are the ones S3 shows. 32px tall beside the search, with 8px of side padding. All Commands' counts take the same pressed look, since they are the same control (they had a white fill and the selected segment's darker border) [proposed].
11. **Copy timings sits in the popover's head, left of ×**, and the footer is gone. The body is the start and the phases, as v6 item 27 left it.
12. **The timing popover opens just above its bar**, its caret on the middle of the part of the bar in view, 10px above it. At the viewport's sides it slides along, 8px inside, its caret still on the bar; it opens below the bar only when the viewport ends above it and there is more room below. Moving between bars swaps it without its fade, as in v6. While open it covers the bars of the rows just above it (question 68).
13. **The menus keep four copies.** The row menu (right-click, Shift + F10, the menu key, the row's ⋯) offers *Copy link*, *Copy as cURL*, *Copy as fetch* and *Copy as HAR*; the details' More actions the last three, beside its Copy link button. *Copy request headers*, *Copy response headers* and *Copy response* left the menus; the Headers and Response tabs copy those.
14. **The header lists copy as tables.** *Copy response headers* and *Copy request headers* put an HTML table (*Header*, *Value*, then each header) and the same rows as tab-separated text on the clipboard, as All Commands copies a payload table (`copyRich`, `tableClipboard`): rich editors paste a table, spreadsheets rows and columns.

**Found and fixed while checking v7** (each also in the live v6 build):
- **A click inside a popover reached what lies under it.** React passes a portal's events to the portal's React parents, so a click in the timing popover also opened the row's details, and a click in a failure popover on All Commands' timeline or the video's seek bar moved the video (from 01:36 to 00:00 in the check). The row, the timeline and the seek bar now count only their own elements.
- **The page itself scrolled**, by about 500px of blank space, once a wheel scroll in a panel such as a request's details ran past its end: visually hidden text inside scrolled panels sat below the page. The page's frame now holds it (`.app` is positioned). Checked on the live v6 site first (the page scrolled 679px), then fixed here.

**design-context, the one change there:** `guidelines/ltactionmenu.md` gained one rule under Do. An item's hover background (the grey `actionListItem.default.hoverBg`, or `actionListItem.danger.hoverBg`) shows only while the pointer is over it; at rest, including the moment the menu opens, the first item, which takes focus, and the selected item, which shows only its tick, look like the rest; keyboard focus shows the focus ring (`focus.outlineColor`). design-context holds no component code, so the rule lives in the component's guideline (rajat-lt/design-context PR #19, `6cfb737`). In the prototype every menu follows it: the look-alike had painted the focused item grey.

## 4i. Behaviour, v8 (29 Oct 2026)

1. **The hourglass is amber everywhere**: the row's flag, the slow count in the toolbar, and *Set slow response limit* in the settings menu (and in ⋯ when the toolbar folds). The colour is `attention.fg` (`#9a6700`, 4.87:1 on white), v6's turtle colour. The image mark beside it stays grey.
2. **The time window has no token.** A window still filters the list as before (v6 item 6). What shows it now: the overview's dimmed edges and handles, the Waterfall header's range (*01:34.1 to 01:37.7*), and the footer's count (*10 of 61 requests*); screen readers still hear it once it settles. It clears with **R**, by zooming back out to the whole session, or with **Clear Filters** when nothing matches. The search keeps at least 140px again. The token's words (*Time: … to …*, *Clear time range (R)*) left the page, and `LTToken` is no longer used on it (question 71).
3. **The HAR menu says *View in HAR viewer*** (was *Open in external viewer*), in the caret's menu and in ⋯ when the toolbar folds. It still opens compare.sitespeed.io in a new tab.

*Corrected 29 Oct 2026: v7 gave the toolbar's fold width as about 552px. Measured at 1280 × 800, it folds at 547px and not at 548px, so the v7 text now says 548px.*

## 5. States

| Surface | Empty | Loading | Error |
|---|---|---|---|
| Tests pane | *0 tests in this build* | Skeleton rows | `LTFlash` danger: *Test list failed to load.* with **Try Again** |
| Command list | Queued test: *Queued to run* · *Commands, logs, and the video appear here once the test starts.* Search or range with no hits: *0 matching commands* · *Try a different search term.* | Skeleton rows | *Command list failed to load.* with **Try Again** |
| Disclosure | n/a | Skeleton rows, announced as *Loading 20 passed logs* | n/a |
| Video | *Video unavailable* · *This session ended without a recording.* (base pattern) | Skeleton frame | as empty |
| Network tab | *Network capture is off* · *Set the network capability to true to record requests on the next run.* (*v5: one test, t-07; the others have requests, and their states follow below*) | n/a (*v5: skeleton rows*) | n/a (*v5: an error flash*) |

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

**Added in v4:**

| Surface | State | What shows |
|---|---|---|
| The video's side | No payload tabs | No tabs; the video as before |
| The video's side | Payload tabs, video floating or collapsed | The payload tabs only; **Dock Video** or **Show Video** at the end of the logs' tab bar |
| Pop out payload | 5 tabs open | Inactive, with *Available after you close a payload tab* |
| Media tabs | More than fit | **More ▾** at the end of the row, with the folded tabs; the open tab stays in the row |
| Details bar | Narrow | The status cut to 48px; narrower, hidden; the buttons on a second line only when they alone do not fit |
| Comment box | Editing a saved comment | **Delete Comment** on the left |
| Toolbar | Scrolled down | Search and the Tests filter only |

**Added in v5:**

| Surface | State | What shows |
|---|---|---|
| Network tab | Capture off (t-07) | *Network capture is off* · *Set the network capability to true to record requests on the next run.* |
| Network tab | Queued (t-12) | *Queued to run* · *Network requests appear here once the test starts.* |
| Network tab | Loading (`?demo=network-loading`) | Skeleton toolbar and rows |
| Network tab | Error (`?demo=network-error`) | `LTFlash` danger: *Network logs failed to load.* with **Try Again** |
| Network tab | Empty (`?demo=network-empty`) | *0 network requests* · *Capture was on, and this run made 0 requests.* |
| Request list | Filters that match nothing | *0 matching requests*, then the most specific reason: *Try a different search term or field.* · *Every CSS request in this run succeeded.* · *Every request in this run succeeded.* · *This run made 0 media requests.*; and **Clear Filters** |
| Request list | Error rows | The failed tint and a red, semibold code |
| Request list | A request open | Name and Status only, the open row selected; the details beside |
| Details | Nothing to show | *Empty payload* · *This GET request sent only its URL and headers.*; *Empty response body* with its reason (*The server answered 304 Not Modified, so the browser used its cached copy.*, *The server answered 204 No Content.*, or for CONNECT *A CONNECT request opens a tunnel. Its answer is a status line only.*); *Binary response* · *Previews show text responses. This one is image/webp, 430 B.* |
| Details | The first or last request | Previous or Next inactive, with *This is the first request* or *This is the last request* |
| Popover | Phases that took 0ms | Muted rows, and the note on why |

**Added with the answers (28 Oct 2026):**

| Surface | State | What shows |
|---|---|---|
| Strip | Whole run | Handles at 00:00 and the run's end; Reset inactive, with *Showing the whole run* |
| Strip | A window | The tag (*00:40 - 01:40*), the outside dimmed, the list and footer filtered, Reset active |
| Request list | A window with no requests | *0 matching requests* · *Try a wider time range.* (or, with other filters, *This time range has 0 CSS requests.*, *Every request in this time range succeeded.*) · **Clear Filters**, which also resets the window |
| Tab bar | Network open | No dock control; Dock Video or Show Video still show while the video floats or is collapsed |

**Added in v6:**

| Surface | State | What shows |
|---|---|---|
| Overview | Whole session | Handles at 00:00 and the session's end; nothing dimmed; no time token |
| Overview | A window | The outside dimmed, the list and footer filtered, the token *Time: 00:36.2 to 00:44.3* with its × |
| Overview | Hidden (Overview off) | The list and the Waterfall column as before; a window set earlier still filters, with its token |
| Toolbar | Narrow (below about 549px) | The HAR group folds into ⋯, which then leads with the three HAR actions |
| Toolbar | A status filter | The token *Errors* or *Slow responses* with its × beside the readout |
| Request list | A status filter that matches nothing | *0 matching requests* · *Every JavaScript request in this run succeeded.* or *Every request in this time range got its first byte within 500ms.* · **Clear Filters** |
| Waterfall | A request under 2px at this scale | A 2px sliver in the colour of its longest phase |
| Waterfall | No room after the bar | The duration before the bar, or over its end on white |
| Popover | No room below the row | Above the row; in a short viewport, kept 8px inside it |
| Response, Preview | Bodies not captured | *Response body capture is off* · the capability to copy · **View HAR Docs** |
| Preview | A 304 image | The cached copy, and *The server answered 304 Not Modified, so this is the copy the browser had.* |
| HAR menu | No filter on | *Download HAR for filtered requests* inactive, with *Available while a filter is on* |
| Request menus | A copy with nothing to give | Inactive, with *Available for GET and POST requests*, *Available with network.full.har on*, *Available for text responses*, *Available when the response has a body*, or *Available when the response has headers* |
| Column menu | A move that cannot happen | *Already next to Name* · *Already the last column* · *Already in the default order and widths* |
| Slow limit dialog | Not a whole number from 1 to 60000 | *Enter a whole number of milliseconds, from 1 to 60000.* under the field |
| A request's link | A request this run lacks | A toast: *Request {id} is outside this run's network log.* |

*v7 replaces the narrow toolbar, the status filter's token, the popover's place, the HAR menu's reason and the header and response copies' rows above; see below.*

**Added in v7:**

| Surface | State | What shows |
|---|---|---|
| Toolbar | From 548px | Two rows: the segments, ⚙ and the HAR split button; the search with its field, then the two counts |
| Toolbar | Below 548px (1280 × 800) | ⚙ and the HAR group fold into one ⋯ *More actions*: the three HAR actions, then the two toggles, then the slow limit |
| Toolbar | A window, room enough | *Time: 01:34.1 to 01:37.7 ×* between the search (at least 112px) and the counts *v8: no token.* |
| Toolbar | A window, less room | *01:34.1 to 01:37.7 ×*, *Time:* read out; at the narrowest logs, cut with an ellipsis and whole on hover *v8: no token.* |
| Counts | At rest | Invisible variant: glyph and count only |
| Counts | Pressed | Outline variant (grey fill, border); the list holds only errors or slow responses; *Show all requests* on hover |
| Counts | 0 in view, not pressed | Inactive, with *0 errors* or *0 slow responses* |
| Settings menu | Opened | *Show waterfall overview* and *Show CONNECT* ticked while on; *Set slow response limit* with *500ms*; no item grey until the pointer is on it |
| Any menu | Opened with the mouse | No grey on any item, the first and the selected included |
| Any menu | Opened or moved through with the keyboard | The focus ring on the focused item |
| Popover | Room above the bar | Above the bar, its caret on the bar's middle, 10px above |
| Popover | The viewport ends above | Below the bar; kept 8px inside the viewport either way |
| HAR menu | No filter on | *Download filtered HAR* inactive; *Available while a filter is on* for screen readers (C59) |
| Request menus | CONNECT | *Copy as cURL* and *Copy as fetch* inactive, with *Available for GET and POST requests* |

**Added in v8:**

| Surface | State | What shows |
|---|---|---|
| Toolbar | A window | No token. The overview, the Waterfall header and the footer show the window; R, zooming out, or Clear Filters (nothing matches) clears it |
| Slow responses | Wherever the hourglass shows | Amber (`attention.fg`): the row, the count, the settings item |

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
| C34 | Media tabs (v4 item 8.2) | Brief: put the video in a tab "similar to 'all commands' tabs" | `ltunderlinenav.md`: one `LTUnderlineNav` per page; a second tab structure is `LTTabNav`, always below it; every tab has its own URL | A tablist styled like the page's tab bar, at the top of the video's side, without URLs | Brief wins on the look. The tabs switch panels in place, so they are a tablist, not navigation. Their overflow follows the same file: More ▾, never sideways scrolling |
| C35 | *Remarks:* (v4 item 3) | Brief: "Remarks:" | `ux-text-guidelines.md` §2: no punctuation on headings, labels and buttons; form labels take no trailing colon | *Remarks:* | Brief wins |
| C36 | Deleting a comment (v4 item 2) | Brief: no confirmation, for now | `ltbutton.md`: danger, sparingly, typically behind a confirmation dialog | **Delete Comment**, danger, no confirmation | Brief wins, for now; question 35 asks about the real product |
| C37 | The video's controls, again (v4 item 9) | Brief: one row, controls inline with the seek bar, the same in every mode | C26 (v2: three rows) and v3 item 7 (controls right of the frame when docked below) | One row in every mode | The newest brief wins; it reverses C26's outcome and v3 item 7 |
| C38 | One rail per level (v4 item 10) | Brief: nested test cases, with clear starts and ends | `patterns/automation-details.md` §6: one left rail for the status icon, so the tree reads vertically | One rail per level (16, 48, 80px) | Brief wins; within a level the rail holds |
| C39 | A narrow status label (v4 item 8.10) | Brief: truncate the label when the buttons do not fit | `ux-text-guidelines.md` §3: never a bare error code | Cut to 48px (*500…*, whole on hover), hidden below that | Below 48px a cut label shows less than the code; the payload under it carries the status |
| C40 | Eight type segments (v5 item 1) | Screenshot N1: All, JS, CSS, Img, Media, Font, Doc, WS | `guidelines/README.md` §5: a filter with more than 5 options is `LTSelect`, not `LTSegmentedControl` | `LTSegmentedControl` with the eight, in the product's order and words | Brief wins: "make the currently existing network logs list first". A select would hide, behind a click, types the product shows at a glance |
| C41 | Start time's form (v5 item 6) | Brief: `mm:ss` | C28: one form for a moment in the run, `m:ss` | `mm:ss` in this column only: *00:05* | Brief wins; it names the form. Question 38 |
| C42 | Data in a popover (v5 items 7 to 9) | Brief: a hoverable popover with every phase's exact time, staying open to copy from | `ltpopover.md`: for light instructions, short text with maybe one link or button | `LTPopover`, interactive: close button, Esc and click-outside, a phase list and **Copy timings** | Brief wins, as C20 and C31 did for the failure popovers |
| C43 | *Start time* (v5 item 6) | Brief: "Start Time" | `ux-text-guidelines.md` §2: sentence case for labels and column headers | *Start time* | Guideline wins |
| C44 | The product's words | Screenshot N1: *Errors Only*, *Show Connect*, *Finished: 34.9s* | `ux-text-guidelines.md` §2: sentence case, no colon on labels; CONNECT is the HTTP method's name; `mock-data.md`: durations as `Mo D H M S` | *Errors only*, *Show CONNECT*, *Finished in 2m 37s*; *All* and *Search all fields* kept | Guideline wins on case and form; the words stay |
| C45 | Where a request's details open (v5 item 4) | Rajat: a panel beside the table, the table narrowing, as developer tools | README §5 and `ltmodal.md`: secondary content that keeps context goes in `LTDrawer`, right side only | A panel inside the tab, beside the table, with a splitter; no backdrop | `ltmodal.md` also says a drawer always shows a backdrop, so nothing behind it stays interactive, and is never for heavy information. The details are headers and bodies, read while the arrow keys walk the table |
| C46 | The switch's label (v5 item 1) | Screenshot N1: the switch, then its label | `ltswitch.md`: by default the label sits on the left and the switch is pushed to the right | `labelPosition` END, `LTSwitch`'s own default: the switch, then the label | Brief wins (the existing list first). `ltswitch.md` itself leaves its default when a switch sits inline with other content; its alternative, a vertical layout, does not fit a toolbar row |
| C48 | The phase colours (answer to 42) | Rajat: use Chrome DevTools' colours | The house workflow: every colour from design-context's tokens; the dataviz validator (§7e): DevTools' yellow fails the lightness band and its teal the chroma floor, and three phases sit under 3:1 against white (Initial connection 1.92, SSL 2.30, Waiting 2.42; the queueing border 1.50) | DevTools' light-theme values, in their own file with their sources | Brief wins. The validator accepts the low contrast only when values are also shown as text: the popover and the Timing tab write every phase's time. Adjacent separation passes (CVD ΔE 8.8, normal 19.2); all pairs do not (Waiting and Initial connection 5.2 for protan vision; Content download and Request sent 10.6 normal) |
| C49 | The Waterfall view switch (answer to 39) | Rajat's chosen sketch: *Waterfall view: [Rows] [Strip]*, in words | `ltsegmentedcontrol.md`: icon-only segments only when the icon is genuinely obvious, always with a tooltip; never obscure icons without a visible label; in tight space, hide the labels | Icon-only: ChartGantt (*Waterfall in rows*) and PanelTop (*Waterfall strip on top*), named on hover and to screen readers | Words do not fit the row at 574px; the guideline allows hiding labels in tight space. Whether these two icons are obvious enough is question 53 |
| C47 | HTTP reason phrases | The data: *304 Not Modified*, *204 No Content*, *404 Not Found* | `ux-text-guidelines.md` §1 rule 2: no negation | Kept, in the status code and in the details' reasons | They are the protocol's names for the codes, and the page already shows them in full (*404 Not Found*, v2) |
| C50 | The HAR button group (v6 item 22) | Brief: an icon button group, the first icon button downloading the whole HAR, a chevron icon button opening the menu | `ltbuttongroup.md`: the split button is a text button plus an icon-only caret; the caret has `unsafeDisableTooltip` | Both halves icon-only (`Download`, `ChevronDown`), outline and medium; the caret without its own tooltip, named *More HAR actions* | Brief wins on the icons; the guideline's caret is kept as written |
| C51 | Data on hover again (v6 items 8, 11, 27) | Brief: the timing popover, and an image preview on hover | `ltpopover.md`: for light instructions, with a visible dismiss | The timing popover as in C42; the image preview as a hover popover without a close button, as v2's failure previews (C20) | Brief wins, as in C20 and C42 |
| C52 | *Filtered logs* (v6 item 22) | Brief: *download HAR for filtered logs* | `ux-text-guidelines.md` §6: one term per concept; this tab calls them requests (*61 requests*, *0 matching requests*) | *Download HAR for filtered requests* | Guideline wins on the term; the meaning is the brief's |
| C53 | The time token's words (v6 item 6) | Brief: *Time: 00:40 to 00:50 ×* | `mock-data.md` ranges use a spaced hyphen; the strip's v5 tag said *00:40 - 01:40* | *Time: 00:40 to 00:50*, with tenths and hundredths when the window is short | Brief wins; it gives the string *Moot since v8 item 2: the token is gone.* |
| C54 | Pinch and Ctrl + wheel (v6 item 5) | Brief: a pinch zooms around the pointer | v2 item 14: Ctrl (Windows) or ⌘ (Mac) plus the wheel seeks the video, over the video and All Commands' timeline; Ctrl + wheel elsewhere zooms the page, which low-vision users rely on | Over the overview and the Waterfall column only, Ctrl + wheel (a pinch, in Chromium browsers) zooms the window and the page does not zoom. ⌘ + wheel, the Mac's seek, keeps its two places | Brief wins over those two areas. On Windows, Ctrl + wheel seeks over the video but zooms over the overview (question 61) |
| C55 | Duration's unit (v6 item 18) | Brief: the duration in ms after each bar | C28 and `fmtMs`: past a second the page writes seconds (*1.2s*) | Milliseconds with two decimals at any length: *1251.88ms* | Brief wins; the popover and Timing tab use the same form |
| C56 | The slow limit in a menu (v6 item 9) | Brief: the threshold editable in the overflow | `ltactionmenu.md`: no inputs in a menu; an LTModal instead | The overflow menu's *Set slow response limit* opens a 480px dialog with the field | Both: the setting lives in the overflow, its field in a dialog. *v7: the settings menu (item 5)* |
| C57 | Toggles in a menu (v7 items 3, 4; S4) | Brief: two items ticked while their part shows, beside an item with an icon | `ltactionmenu.md`: single selection only, *LTActionMenu has no multi-selection*, that job is LTSelectPanel's; every item has an icon or none does | Two `menuitemcheckbox` items, each ticked on its own; the tick and the hourglass share one 16px leading column, so the labels line up | Brief wins: two independent show and hide switches, not a selection from a list. The look-alike's `checked` item stands in (§9) |
| C58 | A value in the trailing slot (v7 item 5; S4) | Brief: *500ms* after *Set slow response limit* | `ltactionmenu.md`: the trailing slot is for submenu arrows and keyboard shortcuts | *500ms* in the trailing slot, read out with the label | Brief wins; the value tells what the dialog will change |
| C59 | An inactive item without its reason (v7 item 7) | Brief: no descriptions on the HAR menu's items | `ltactionmenu.md`: an inactive item writes its reason into the item text, since a tooltip will not do and screen readers get nothing otherwise | *Download filtered HAR* inactive with no filter on, its reason (*Available while a filter is on*) read to screen readers only | Brief wins on what shows; the label itself says it needs a filter, and screen readers keep the reason |
| C60 | The settings gear at narrow widths (v7 items 1, 3) | S2 and S3: ⚙ and the HAR split button beside the segments | v6 item 26: the toolbar keeps its order as the logs narrow, the actions folding first | Below 548px (1280 × 800 by default) ⚙ and the HAR group become one ⋯ *More actions*, HAR actions first | The screenshots show the wide layout only; there the brief wins, and narrow, v6 item 26's rule applies (question 69) |
| C61 | The timing popover over its own column (v7 item 12) | Brief: just above the bar, the caret on it, inside the viewport | v6's decision (§7g, question 58): beside the column, so the pointer could run down the bars | Above the bar; below it only when the viewport ends above | Brief wins and answers question 58; above, it covers the bars of the rows above while open (question 68) |
| C62 | Carets (S2, S3) | Screenshots: Primer's filled triangle on *All ▾* and the HAR caret | `icons.md`: lucide only; v5 and v6 used `ChevronDown` | `ChevronDown` kept | Guideline wins; icons in screenshots follow the guidelines |
| C63 | Menu item casing (S4) | Screenshot: *Show Waterfall Overview*, *Show Connect* | `ux-text-guidelines.md` §2 (9 Oct 2026): action-menu items take sentence case; CONNECT is the method's name, written in capitals in the Method column and the v5 switch | *Show waterfall overview*, *Show CONNECT* | Guideline wins on casing; copy in screenshots follows the guide |

C64 to C75, the setup state's: §12.5; C76 to C79, its review's: §12.12.

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
- **One comment per failed command**, edited in place, shown at the top of the details: it explains the failure, so it comes before the payload. No delete yet (question 22). *v4 items 1 and 2: below the payload, and deletable.*
- **The 500-character limit is a validation rule**, not a hard stop (C33): nothing pasted is cut off unseen, the live count shows where the text stands, and Save says what to fix.
- **Remarks open in place**, at a reading width, with **Show Less** to fold them; the brief's one line is the default (question 21).
- **A status filter acts like search**: passed runs unfold and groups with a match open, because the filter asks to see those commands.
- **Condensed keeps the type size.** Height comes out of padding, never out of legibility; the grey group band replaces the distinction the extra height gave.
- **Docked below, the frame takes the height and the controls the width**, with at least 320px for the controls, since the seek bar needs width more than height. *Superseded by v4 item 9.4.*
- **Download becomes a plain button on web videos**, rather than a menu with one item. *Superseded by v4 item 9.3.*

### 7d. v4 decisions [proposed]

- **The Video tab leaves the row while the video floats or is collapsed**, and comes back where it was. Rejected: a Video tab that only says the video is elsewhere, a tab with nothing in it.
- **Docking the video opens its tab**: **Dock Video** and **Show Video** say the user wants to see it.
- **A new payload tab opens, the video pauses, and focus stays where it was**: the tab appears away from the eye, so it opens itself; focus stays so the user keeps their place in the list.
- **Manual activation in the media tabs**: moving focus across the Video tab never pauses or plays it.
- **Closing the open tab opens the one to its left**, as browsers do.
- **Payload tabs per test, for the session**: not remembered across reloads, like comments and renames in this prototype.
- **Show in All Commands** in a payload tab's menu: not in the brief, added so the two places a payload shows lead to each other.
- **More ▾ rather than sideways scrolling** when tabs outgrow the pane. A scrolling row was built first and replaced: `ltunderlinenav.md` forbids it (C34).
- **Same-second retries get (2), (3)** by run order, so a tab's name never changes when tabs move.
- **The floating window's header keeps only its grip and the name**: Dock and Collapse now live in the video's own row, the same in every mode (C37).
- **Docked above the logs, the row matches the frame's width**, so the controls stay with the video; at least 320px, the narrowest video anywhere (`guidelines/README.md` §2).
- **The total gives way only below 360px** of row; a floating window at its default 400px shows both.
- **The new density default needs a new stored key.** v3 stored *comfortable* for every visitor, so condensed (v4 item 7) lives under a new key; anyone who picks comfortable keeps it.
- **The nested header sticks under its parent's**, so inside #TC-8 both #TC-7742 and #TC-8 stay in view.
- **A test case's counts include its nested test case**: the parent's result includes its child's.
- **Choosing a test case in the filter opens it and its parent**: the user asked to see it.
- **The status hides rather than shrink past 48px**, and the buttons wrap only as the last step (C39).

### 7e. v5 decisions [proposed]

- *Superseded 28 Oct 2026: the whole run (§4f).* **The Waterfall is each request's own breakdown**, as screenshot N2 draws it, not a timeline across the run: across t-01's 2m 37s, a 50ms request would be under a tenth of a pixel in the 136px bar. Start time and Duration carry when and how long (question 39).
- *Superseded 28 Oct 2026 by Chrome DevTools' colours (C48); kept for the record.* **The phase colours** (`--net-*`, generated by `scripts/tokens.mjs`), in time order: Queueing `checks.ansi.gray`, DNS lookup `sponsors.emphasis`, Initial connection `checks.ansi.yellow`, SSL `ansi.magentaBright`, Request sent `checks.ansi.white`, Waiting (TTFB) `checks.ansi.green`, Content download `ansi.blueBright`. Chosen by a search over design-context's chart-like colour tokens, with the status colours and the accent left out as reserved, keeping the developer-tools convention where a token allows it: connection yellow, SSL purple, waiting green, download blue. No cyan token passes both the lightness band and the chroma floor (`ansi.cyan` and `ansi.cyanBright` read grey, `checks.ansi.cyan` is too light, `checks.ansi.cyanBright` fails both), so DNS is pink. The dataviz validator's results, on white:
  - The five hues, adjacent, which is how a stacked bar is read: every check passes. Worst CVD ΔE 25.0 (deutan), worst normal-vision ΔE 29.9. Yellow and green sit under 3:1 against white (2.24, 2.28), which the validator allows only with visible labels or a table: the popover and the Timing tab name every value.
  - With the two greys in their places (Queueing first, Request sent between SSL and Waiting): adjacent CVD ΔE 9.3 and normal 21.5, both passing. The greys fail the lightness and chroma checks by design: they are the neutral phases.
  - All pairs: SSL and Content download are too close for protan vision (ΔE 2.0; 14.2 normal). They never touch in a bar, the order is fixed and every phase is named, and the validator applies all-pairs to scatter plots and maps, not stacks. Question 42 offers the one swap that passes all pairs.
- **2px gaps between phases, each phase at least 2px**, so a 0.1ms Request sent still shows; the popover has the exact value.
- **Show CONNECT means the HTTP CONNECT tunnels** a capture proxy records, one for each new connection. In the mock a request after 30 idle seconds opens one, so t-01 has 3. Off by default, as in screenshot N1, and counted only while shown (question 37).
- **Errors only means status 400 and up.**
- **The search's field** offers every text column plus the URL, with the product's *All* first (question 44). It shows only the field's name, as the product does, at a fixed width, so choosing one never moves the row. *Fields: All*, after *Tests: All*, was built first and pushed the switches to a third row whenever a longer field was chosen.
- **Type segments filter by what was requested**, as developer tools do, so a broken image is found under Img.
- **Name and Status stay beside the details.** Developer tools keep only Name; Status keeps the errors in view (question 43). Where the two would leave the table under 220px (the logs at their 487px at 1280 × 800), Name stays alone, and the details' head carries the status.
- **The details keep the tab chosen** for the next request, as developer tools do; they open on Headers the first time.
- **The details panel** is 400px by default, at least 320px (the pane scale of `guidelines/README.md` §2), and leaves the table at least 220px.
- **Filtered, the footer's sizes add up what shows**, so it stays on one line in the default pane; *Finished in* stays for the whole log.
- **Download HAR saves the whole log**, whatever the filters (question 45).
- **The tab stays mounted** while another tab shows, as All Commands does, and starts fresh for another test.
- **Duration keeps the product's two decimals** in the page's unit form (*34.77ms*), where commands show whole milliseconds (*20ms*): network timings differ in the decimals.

### 7f. Decisions after the answers [proposed]

- **Icon segments for the Waterfall view** (C49). Rajat's chosen sketch showed *Rows* and *Strip* as words; two labelled segments do not fit the first toolbar row in the default 574px, and the dock control already sets the icon-with-name-on-hover form on this page. ChartGantt and PanelTop are verified in lucide-react 1.58.0 (question 53).
- **Rows is the default view**, the order of Rajat's sketch; the choice is remembered.
- **The window keeps every request that runs at any moment of it**, not only those that start in it, so a slow request crossing the edge stays in view, as in developer tools.
- **The strip shows what the other filters match**, so it never shows a bar the list cannot reach; the window alone does not thin it.
- **Lanes, not connections.** DevTools' overview puts a connection's requests on one band; over one HTTP/2 connection nearly every request would share a band, so the strip packs requests into up to 10 lanes instead.
- **A click on the strip does nothing.** All Commands' bar seeks the video on a click, and developer tools' overview draws a new window on a drag; the brief asked for the handles only (question 50). The playhead still shows where the video is.
- **R is the strip's shortcut, its visible twin the Reset button** (`ux-persona.md`: every shortcut has a visible twin). It is listed in the shortcuts dialog. All Commands' Reset timeline has no key yet (question 51).
- **Leaving the strip view resets the window**: a window nobody can see would filter the list silently.
- **The Network tab keeps the logs beside the video, and only that tab**: Rajat named All Commands as the tab that keeps the dock control; Logs and Meta Data keep it too until he says otherwise (question 48).
- **Waterfall is 240px in the rows view**, half as wide again, since it now holds the whole run: a 3:20 run gets about 1px a second instead of 0.7px.

### 7g. v6 decisions [proposed]

- **A histogram of requests in flight**, not of requests started: a long request counts in every column it spans, so a slow page shows as wide as it was. Linear heights, at least 2px where anything is in flight. The bars wear All Commands' timeline blue (`checks.ansi.blueBright`) with a 1px cap in `accent.emphasis`: the blue alone is 1.64:1 on the track, which the dataviz validator accepts only with a table view, and the list below is that table; the cap passes 3:1.
- **Page loads as markers and dashed lines.** A small triangle above the track, its line through it; no colour of its own, since red is the errors' and the accent is for links. Errors are 2px red ticks at the foot of the track.
- **The commands' lane is 3px**, passed grey (`fg.subtle`), failed red, each at least 2px wide.
- **The narrowest window is 0.2 seconds**, a few requests wide, so bars always show their phases before the zoom stops.
- **A wheel notch zooms by up to 1.82×** (e^(Δ/100), Δ capped at 60px), so a mouse wheel's large steps stay usable and a trackpad's small ones stay smooth; each event builds on the last, even before the screen repaints.
- **The popover sits beside the Waterfall column**, not under the bar (question 58): under the bar it covers the next rows' bars, and the pointer could no longer run down the column.
- **A swap between popovers skips the fade-in**, and the popover closes when the rows under it change, so it never points at the wrong row.
- **Slivers are 2px wide and 14px tall**, 4px taller than a bar, without rounded ends, so a squeezed request reads as a tick, in its longest phase's colour.
- **The duration's place**: after the bar when it fits, before it when the lane ends first, over the bar's end on white when the bar fills the lane. Measured with the page's own font, so it never collides.
- **The readout and tokens have their own row**, the tests pane's arrangement, so a token appearing or leaving never moves the toolbar's other rows or the overview under a drag.
- **Slow responses join errors** in the readout and the filter, to make item 9's triage a click (question 56).
- **The Overview switch sits at the end of the third row**, right above what it shows (`ltswitch.md`: content a switch reveals comes after it).
- **Columns: Name stays first and fills the rest.** It sticks to the left, so moving it would leave the list without its anchor; its width is a minimum, so the list never leaves a gap on the right.
- **The Command column says *after*** for a request that started between commands, naming the last command before it (question 57); before the first command, *Before the first command*.
- **The image mark shows only for captured images**: it promises a preview, and without a body there is none (question 62).
- **A request's link clears only what hides it**, and skips All Commands' first-failure opening, so the list, the video and the link agree.
- **The HAR files are built with the page**, one per test with network capture, from the same mock as the page; their dates are the build's, since the mock's clock is the moment the page loads.
- **The slow limit is a whole number of milliseconds, 1 to 60000**, and the dialog's secondary button names what is kept (*Keep 500ms*).
- **Copy as fetch leaves out the headers a page cannot set** (the Fetch Standard's forbidden request headers) and moves the referrer to its own field; cURL copies every header, in bash quoting.

### 7h. v7 decisions [proposed]

- **One counting control for both tabs.** The Network counts are All Commands' passed and failed counts, now one composed component (`CountFilter`): invisible at rest, the outline variant pressed. S3's pressed colours are the outline variant's own tokens, so no colour is invented; All Commands' counts change with it (question 66).
- **The counts follow the type and the time window, not the search**, as All Commands' follow its test filter and range; a count says how many requests pressing it would leave, before any search (question 70).
- **The time token lives on the second row**, between the search and the counts, rather than on a row of its own: a row that appears would push the overview down under a drag. It drops *Time:* when the search would fall under 112px, and shortens with an ellipsis at the narrowest logs, whole on hover. *v8 item 2: the token is gone.*
- **Narrow, one ⋯ holds ⚙ and HAR** (C60): a gear holding downloads would mislabel them, and ⋯ is the page's overflow everywhere else (question 69).
- **The hourglass is grey everywhere**, as S2 draws it in the count: one sign, one colour. `ux-text-guidelines.md` §4 keeps yellow for a decision the user must take, and a slow response is a fact to look into (was amber in v6; question 67). *v8 item 1: amber everywhere, Rajat's choice (question 67).*
- **View settings** names the gear: it holds how this tab shows its requests, not the run's capture settings.
- **A choice in the settings menu closes it**, LTActionMenu's default; the change shows behind it and is announced.
- **The popover's caret aims at the part of the bar in view**, and the popover keeps 10px above the bar so its 7px caret point stays clear of it.
- **Copy timings joins the popover's head** through a stand-in slot (`headerActions`, §9), left of ×, the order of the details panel's head.
- **Events from a popover stay in the popover.** The row, All Commands' timeline and the video's seek bar ignore events that reach them from a portal, so copying from a popover never opens a row or moves the video.
- **The page never scrolls behind its panels**: the app's frame is positioned, so the visually hidden text inside a scrolled panel stays in its frame.

### 7i. v8 decisions [proposed]

- **One class colours every hourglass** (`net-hourglass`), so the row's flag, the count and the menu item cannot drift apart. The menu's icon column takes it through a wrapped icon, with no change to the look-alike menu.
- **The search's 140px minimum returns** with the token gone, as v6 item 26 set it.

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

**Added in v4:**

| Where | String | Rule |
|---|---|---|
| Remarks | Remarks: | C35 |
| Comment box | **Delete Comment** · *Comment deleted* (announced) | §2 Title Case button that names its object (`ltbutton.md`); §3 Silent success still speaks |
| Details menu | More actions · Copy link · Pop out payload · Available after you close a payload tab · Show in All Commands | §2 sentence case menu items; `ltactionmenu.md`: the reason in the item, positive |
| Pop out | *Payload of Create New Session at 0:32 opened in a tab* (announced) | §3 Silent success still speaks |
| Media tabs | Video and payloads (the tablist) · Video · Find Element at 1:16 (2) · Close Find Element at 1:16 tab · Close tab · Move left · Move right · More · More tabs · *Find Element tab closed* (announced) | §3 Tooltips; §2 sentence case menu items |
| Popover | Copy link · *Link to Create New Session at 0:32 copied* | §3 Tooltips; §5 *{object} failed to {verb}* on failure |
| Video row | Open picture-in-picture · Dock video · Collapse video · More video actions · Download video · Enter full screen · Exit full screen · Rotate video | §3 Tooltips; §2 sentence case menu items |
| Tests filter | Inside #TC-7742 | `ltactionmenu.md` item description |
| Nested group | *, test case, inside #TC-7742* (screen readers) | §1 rule 1 |

**Added in v5:**

| Where | String | Rule |
|---|---|---|
| Type segments | All · JS · CSS · Img · Media · Font · Doc · WS · *Request type* (the group) | screenshot N1's words (C40) |
| Toolbar | Download HAR · All · Name · URL · Status · Method · Domain · Type · *Search in: All* (screen readers) | §3 Tooltips name the action; §2 sentence case menu items |
| Search | Search all fields · Search names · Search URLs · Search status codes · Search methods · Search domains · Search types | §2; the placeholder names what it searches |
| Switches | Errors only · Show CONNECT | `ltswitch.md`: label the setting, not its state; C44 |
| Columns | Name · Status · Method · Domain · Type · Size · Start time · Duration · Waterfall | §2 sentence case headers (C43) |
| Sorting | Sorts by waiting time (TTFB) · *Sorted by Duration, descending* (announced) | §3 Tooltips; §3 Silent success still speaks |
| Popover | Copy timings · Timings copied · Total · Waterfall phases · Queueing · DNS lookup · Initial connection · SSL · Request sent · Waiting (TTFB) · Content download | §2 sentence case; the phase names are developer tools' |
| Popover notes | The connection was already open, so DNS lookup, initial connection and SSL took 0ms. · The address was already known, so DNS lookup took 0ms. · CONNECT opens a tunnel for the HTTPS requests after it, so its DNS lookup and SSL show 0ms. | §1 rule 2 no negation (*took 0ms*, not *took no time*) |
| Legend | Waiting in the browser's queue for a connection. · Finding the server's address for the domain. · Opening the connection to the server. · The handshake that secures the connection. · Sending the request. · Waiting for the first byte of the response. · Receiving the rest of the response. | §1 rules 1 and 6 |
| Details | 34 of 61 · Previous request · Next request · This is the first request · This is the last request · Close details · Copy URL · URL copied · Headers · Payload · Response · Timing · General · Response headers · Request headers · Field · Header · Value | §3 Tooltips; inactive controls say why, positively |
| General | Request URL · Request method · Status code · Content type (left out for CONNECT, rather than *None*) · Transferred · Resource size · Start time · Duration | §2; §3 empty values name the state, never *None* |
| Details, empty | Empty payload · This GET request sent only its URL and headers. · Empty response body · Binary response · Previews show text responses. This one is image/webp, 430 B. · Copy payload · Copy response | §1 rule 2; §3 Empty states |
| Timing | Started at 00:05 · 34.77ms in total · Phase · When · Duration · Total | §2 |
| Footer | 61 requests · 15 of 61 requests · 1.7 MB transferred · 4.3 MB resources · Finished in 2m 37s | C44; `mock-data.md` duration form |
| States | see §5 | §1 rule 2 (*0 matching requests*, *made 0 media requests*, *Every request in this run succeeded.*) |

**Added with the answers (28 Oct 2026):**

| Where | String | Rule |
|---|---|---|
| View switch | Waterfall view (the group) · Waterfall in rows · Waterfall strip on top · *Waterfall shows in the rows* · *Waterfall shows as a strip on top* (announced) | `ltsegmentedcontrol.md`: segments are nouns; §3 Silent success still speaks |
| Strip | Timeline · 00:40 - 01:40 (*Showing 00:40 - 01:40* to screen readers) · Reset timeline (R) · Showing the whole run · *Showing the whole run* (announced) · Timeline start · Timeline end | All Commands' words; `mock-data.md` ranges with a spaced hyphen |
| Waterfall header | 00:00 - 03:20 | as above |
| States | Try a wider time range. · This time range has 0 CSS requests. · Every request in this time range succeeded. | §1 rule 2; §3 Empty states teach the next action |
| Shortcuts | R · Reset the Network tab's timeline strip | §2 |

**Added in v6:**

| Where | String | Rule |
|---|---|---|
| Overview | Timeline overview (the region) · Page loads (the markers) · Zoom to page load 3: /book/stays · Time range · *Arrow keys move the range. Plus and minus zoom it.* (screen readers) · 01:16 · Find Element (hover) | §3 Tooltips name the action; §1 rule 1 |
| Time token | Time: 00:40 to 00:50 · Time: 00:40.2 to 00:40.6 · Clear time range · Clear time range (R) · *Showing 00:36.2 to 00:44.3, 9 of 61 requests* · *Showing the whole session, 61 requests* (announced) | the brief's words (C53); §3 Tooltips with the shortcut |
| Toolbar | Download HAR · More HAR actions · View HAR file in external viewer · compare.sitespeed.io, in a new tab · Download HAR for filtered requests · 9 of 61 requests · Available while a filter is on · More actions · Set slow response limit · Now 500ms of waiting (TTFB) · Overview | `ltactionmenu.md`: sentence case items, the reason in the item, positive (C52) |
| Filter | Filter requests · Filter requests: Errors · All requests · Errors · Status 400 and above · Slow responses · Waiting (TTFB) over 500ms · Clear filter: Errors | §2; §3 Tooltips |
| Readout | 2 errors: status 400 and above · 2 slow responses: over 500ms of waiting (hover) · *2 errors*, *2 slow responses* (screen readers) | §3 Status is never colour alone |
| Rows | Slow response: waited 652.84ms for the first byte, over the 500ms limit · *, image* and *, slow response: 652.84ms waiting* (screen readers) · after · Before the first command | §3 Tooltips, one clause, no full stop |
| Columns | Command · Resize Name column (and each column) · Move left · Move right · Reset columns · Already next to Name · Already the last column · Already in the default order and widths · *Command column moved to position 2 of 9* · *Columns back in their default order and widths* · *Column move canceled* (announced) | §2; tab reordering's words (v2) |
| Request menus | Actions for rum at 01:36 · Copy link · Copy as cURL · Copy as fetch · Copy as HAR · Copy request headers · Copy response headers · Copy response · Available for GET and POST requests · Available with network.full.har on · Available for text responses · Available when the response has a body · Available when the response has headers | `ltactionmenu.md`; §1 rule 2 |
| Toasts | rum at 01:36 copied as cURL. · rum at 01:36 copied as fetch. · rum at 01:36 copied as HAR. · Link to rum at 01:36 copied. · Request headers of rum at 01:36 copied. · Response headers of rum at 01:36 copied. · Response of rum at 01:36 copied. · *… failed to copy. Try again.* · Request n99 is outside this run's network log. | §3 Toasts: the trigger's term, past tense; failures say what to do |
| Details | Copy link · *Link to rum at 01:36 copied* · More actions · Preview · Copy response headers · Copy request headers · *Response headers copied* · 120 × 40 · image/webp · 430 B · cached copy · The server answered 304 Not Modified, so this is the copy the browser had. · Started at 00:05.481 · 65.00ms in total | §3 Silent success still speaks |
| Capture off | Response body capture is off · This run recorded headers and timings only. Set network.full.har to true to capture response bodies on the next run. (images: *… to capture images …*) · Copy capability · Capability copied · View HAR Docs | §3 Empty states: what is happening, then what the user gets; standalone links are CTAs (§2) |
| Popover | Start time · 01:36.482 | §2 |
| Slow limit | Slow response limit · Waiting (TTFB) limit, in milliseconds · Requests that wait longer than this for the first byte of their response get the turtle. The default is 500ms. · Enter a whole number of milliseconds, from 1 to 60000. · Keep 500ms · Save Limit · *Slow response limit set to 1000ms* (announced) | §3 field errors lead with the fix; the secondary button names what is kept |
| Shortcuts | R · Show the whole session in the Network tab · + or − · Zoom the Network overview's time range, once it has focus | §2 |

*v7 replaces v6's Toolbar, Filter and Readout rows, the turtle in the Slow limit row, and the header and response copies in the Request menus, Toasts and Details rows.*

**Added in v7:**

| Where | String | Rule |
|---|---|---|
| Settings | View settings · Show waterfall overview · Show CONNECT · Set slow response limit · 500ms · *Waterfall overview shown*, *Waterfall overview hidden*, *CONNECT requests shown*, *CONNECT requests hidden* (announced) | §2: sentence-case menu items (C63); §3 Tooltips name the action |
| Narrow toolbar | More actions · More network actions (the menu) · Download HAR | §2 |
| HAR menu | Open in external viewer · Download filtered HAR · *Available while a filter is on* (screen readers) | `ltactionmenu.md` (C59); finalists in the report *v8: View in HAR viewer.* |
| Counts | *2 errors*, *2 slow responses* (names) · Show only errors: status 400 and above · Show only slow responses: waiting (TTFB) over 500ms · Show all requests · 0 errors · 0 slow responses · *Showing errors only*, *Showing slow responses only*, *Showing all requests* (announced) | §3 Tooltips: one clause, no full stop; All Commands' wording |
| Time token | Time: 01:34.1 to 01:37.7 · 01:34.1 to 01:37.7 (narrow, *Time:* read out) · Clear time range (R) | C53 *v8: gone.* |
| Popover | Copy timings · *Timings copied* | §3 Silent success still speaks |
| Request menus | Copy link · Copy as cURL · Copy as fetch · Copy as HAR | `ltactionmenu.md` |
| Details | Copy response headers · Copy request headers · *Response headers copied*, *Request headers copied* (the tables) | §3 |
| Slow limit | Requests that wait longer than this for the first byte of their response get the hourglass. The default is 500ms. | §1 |

**Added in v8:**

| Where | String | Rule |
|---|---|---|
| HAR menu | View in HAR viewer | Rajat's pick of the v7 finalists |
| Time token | Gone: *Time: 01:34.1 to 01:37.7*, *Clear time range (R)* | v8 item 2 |

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

**Found in v4:**

- **No guidance on nested lists**: indentation per level, a rule per level, stacked sticky headers. The prototype's are proposals (C38).
- **No component switches panels in place at the first level.** `LTUnderlineNav` is navigation with URLs, `LTTabNav` sits below it (C34), and neither documents closable tabs. `LTUnderlineNav` still has no overflow (the base pattern's open question 2), so More ▾ is composed.
- **`mock-data.md` has no nested test cases.** #TC-8 is its own example ID, #TC-4410 follows its `#TC-` format, and the two nested names are its own extra test-case-shaped titles (its *Test instance names* list).
- **No rule for a danger action without a confirmation.** Unlink offers Undo; Delete Comment, for now, nothing (C36).

**Found in v5:**

- **`mock-data.md` has no network values**: hosts, paths, sizes, durations, phases, headers or bodies. `src/network-data.js` takes the first page's file names, types, sizes and durations from screenshots N1 and N2 (N1's where a name appears in both, so *9de5c062541a58ac.css* is N1's 4 KB, not N2's 16.9 KB), the host from v1's screenshots (www.airbnb.com, the mock test's site), and writes the rest for the mock: later pages, the phases (from a seeded generator, adding up to each duration), headers, bodies and the two failures. N1's one third-party host (*app.revenu…*, cut off) is not guessed at: every request uses the one host.
- **No format for sizes or for durations under a millisecond.** The prototype uses the product's own: *0 B*, *230 B*, *24.6 KB*, *2.2 MB* (1,000 bytes to a KB), and two decimals in the page's unit form (*34.77ms*).
- **`LTTable` documents four props** (`allowValueCopy`, `columns`, `data`, `tabIndex`) and has no guideline file. Sorting, rendered cells, row handlers, fixed widths, a sticky header and a sticky first column are composed in the look-alike; the real column shape is unknown.
- **`LTSwitch`'s look is undocumented**: no sizes in `COMPONENTS.md`, and `ltswitch.md` has a TO FILL for `square`. The look-alike measures screenshot N1: a 32 × 16 pill with a 16px round knob, in Primer's toggle-switch tokens (`switchTrack.*`, `switchKnob.*`).
- **`LTTabNav`'s `items` shape is TBD**, and nothing says whether its tabs are links or switch panels in place. The look-alike switches in place, with tab semantics; the project-listing prototype's tabs are links.
- **`ltpopover.md` covers light instructions only**, not a data popover (C42), and its directions (`right-top` and the rest) are listed without placement rules. The look-alike now places `right-top` and `right-bottom` with the caret 16px from the box's end.
- **No chart component and no categorical palette.** The bar, its legend and the colours are composed from tokens and checked with the dataviz validator (§7e).
- **`icons.md`**: the page now uses 79 lucide names, all present in 1.58.0; v5 adds ArrowUp, ArrowDown and ArrowUpDown for sorting, and reuses Info, Download, Copy, ChevronUp, ChevronDown, Sun, Moon and X (README). *Answers: 80, with ChartGantt; PanelTop and Undo2 were already in use.*

**Found with the answers (28 Oct 2026):**

- **No categorical or chart palette in design-context**, so Rajat chose an outside one: Chrome DevTools' (C48). A design-context palette for timings, or adopting DevTools' with its contrast caveat, would settle it for every product.
- **No overview or brush component.** The strip reuses v1's custom range timeline, still flagged (§9 of v1).

**Found in v6:**

- **`LTToken` documents `as`, `hideRemoveButton`, `isSelected` and `size` only**, not its text or its remove handler. The look-alike takes `text`, `onRemove`, `removeLabel` and `removeTooltip` in their place, and the token's look is measured from Primer's (a pill with a remove button).
- **`LTTable` documents no column widths, resizing or reordering.** Resize edges, header drags and the column menu are composed, with `headerProps` added to the look-alike's composed props.
- **`LTPopover` documents no placement relative to another element.** `place` in the look-alike puts the Network tab's popovers above or below a row; `ltpopover.md`'s directions describe the caret only.
- **No brush or overview component**, again: the overview is custom, reusing the range timeline's handles (§9 of v1 and the answers).
- **`icons.md`**: its *Filter* and *External link* rows are TO FILL. The prototype uses `ListFilter`, as the tests pane does, and lucide's `ExternalLink` for the viewer that opens in a new tab; `Turtle` follows Firefox's sign. The page now uses 81 lucide names, all present in 1.58.0: v6 adds ExternalLink and Turtle and drops ChartGantt.
- **`mock-data.md` has no images or HAR settings.** The SVG icons' previews are their own bodies; the banner (*whatnew.png*) and *favicon.ico* are stand-ins drawn for the mock at the sizes the files would have [mock]. Which runs captured bodies, and which requests are slow, are written for the mock (§4g items 9 and 15).

**Found in v7:**

- **design-context holds no component code.** `COMPONENTS.md` documents props from Storybook and `guidelines/` documents use, so the menu's rest state (S1) went into `guidelines/ltactionmenu.md` as a rule (PR #19). The look-alikes in this repo are where it shows.
- **`LTActionMenu` documents single selection only** (`selectionVariant` `NONE` or `SINGLE`) and its `options` shape is TBD. The look-alike's `checked` (a toggle item), a `trailing` value without a shortcut (read out) and `hint` (an inactive item's reason for screen readers) stand in (C57 to C59).
- **`LTPopover` documents no slot beside its close button**; `headerActions` stands in.
- **`LTButton` documents no pressed state.** The counts carry `aria-pressed` and switch from the invisible to the outline variant, both documented.
- **`LTToken` documents no text props**, as v6 found; v7 adds `fullText`, shown on hover when the token is cut short.
- **No pattern for a filter row that runs short.** The time token's three widths (§3f) are this page's own [proposed].
- **`icons.md`**: its *Settings* row is TO FILL; the gear is lucide `Settings`, as the platform sidebar uses. v7 adds `Hourglass` and drops `Turtle`: still 81 lucide names, all present in 1.58.0.
- **`LTSwitch` is no longer used on the page**: Show CONNECT and the overview's switch became menu items. The look-alike stays in `lt.jsx`.

**Found in v8:**

- **`LTToken` is no longer used on the page**: its last use, the time window's token, is gone. The look-alike stays in `lt.jsx`, as `LTSwitch` does.

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
15. **The command line above the seek bar** names the current command whenever there is no failure. Keep that, or show the line only at failures (with its space kept empty)? **Answered 19 Oct 2026:** the line is gone (v4 item 9.1).
16. **Space** overrides the video players' play and pause, and button activation inside the list (C22). Acceptable?
17. **`m:ss`** as the one time form (C28), for `mock-data.md`?
18. **Keyboard shortcuts dialog** and the `?` shortcut: keep? It is not in the brief; it answers the persona's rule that every shortcut has a visible twin.
19. **A floating window outside the browser**: worth adding the browser's own picture-in-picture for real recordings, beside the in-page window? It would show the video with only the browser's controls.
20. **`ltpopover.md`**: amend it to allow a hover preview of data, without a close button (C20)?

**New in v3:**

21. **Remarks, 1 line or 2?** The brief says "show 2 lines of remarks" and then "by default, only 1 line is visible". Built: 1 line and **View All**. Two lines is a one-line change.
22. **Comments**: can they be deleted? Edited by their author only? One per command (as built) or a thread? **Answered in part 19 Oct 2026:** they can be deleted, with no confirmation for now (v4 item 2).
23. **A comment mark in the command's row** as well as on the timeline?
24. **The popover**: stays open until closed (as built), or closes once the pointer leaves both the strip and the popover?
25. **The comment action on the video's failure line**, added so a failure offers the same three actions everywhere: keep it? **Moot since 19 Oct 2026:** the line is gone (v4 item 9.1).
26. **Status counts**: one at a time (as built), or both pressed at once?
27. **Default density**: comfortable (as built)? **Answered 19 Oct 2026:** condensed (v4 item 7).

**New in v4:**

28. **The Video tab while the video floats or is collapsed**: it leaves the row (as built), or stays, with the way back in its panel?
29. **Payload tabs**: kept per test for the session (as built), or remembered across reloads and carried in the page's link?
30. **Show in All Commands** in a payload tab's menu: keep it? It is not in the brief.
31. **The floating window's header** lost Dock and Collapse, which now sit in the video's row: keep them in both places?
32. **A narrow details bar**: below 48px the status hides, and in a 320px payload tab the buttons wrap under the segmented control. Acceptable, or should the logs and the video's side get wider minimums instead?
33. **A test case's counts**: include its nested test case's commands (as built), or only its own?
34. **The second row of tabs** (C34): the brief's look, at the top of the video's side (as built), or `LTTabNav`, per `ltunderlinenav.md`?
35. **Deleting a comment, for real**: an Undo toast, as Unlink has, rather than a confirmation (`ux-persona.md`: recovery beats confirmation)?
36. **Nesting deeper than two levels**: never, or folded into the second level?

**New in v5:**

37. **Show CONNECT**: read as the HTTP CONNECT tunnels the capture proxy records, hidden by default. Right? *Rajat is checking with the PM (28 Oct 2026).*
38. **Start time's form**: `mm:ss` as the brief writes it (as built, C41), or the page's `m:ss`? A run past an hour would read *61:05* in `mm:ss`. **Answered 28 Oct 2026:** keep `mm:ss`.
39. **The Waterfall**: each request's own breakdown, as screenshot N2 draws it (as built), or a timeline across the run, each bar placed at its start, as developer tools draw it by default? **Answered 28 Oct 2026:** the whole run, in the rows or as a strip on top with handles, switched (§4f).
40. **Sorting the Waterfall**: by its waiting phase, TTFB (as built), or not sortable? **Answered 28 Oct 2026:** not sortable.
41. **The popover with the logs below the video** (or the video floating or collapsed): the table reaches the window's edge, so the popover keeps to the edge and covers the end of nearby rows. Keep, or keep a margin right of the table in those layouts? **Answered 28 Oct 2026:** the Network tab drops the dock control; All Commands keeps it.
42. **Phase colours**: SSL and Content download are close for protan vision when compared out of order (§7e). Swap SSL to `ansi.green`, which passes every pair, and give up developer tools' purple SSL? **Answered 28 Oct 2026:** use Chrome DevTools' colours (C48).
43. **Beside the details**: Name and Status (as built), or Name only, as developer tools do?
44. **The search's fields**: All, Name, URL, Status, Method, Domain, Type (as built). Which fields does the product's *All* search?
45. **Download HAR**: the whole log (as built), or only what the filters show? **Answered 28 Oct 2026 (v6 item 22):** both: Download HAR the whole log, and Download HAR for filtered requests in its menu.
46. **A request's moment in the video**: should Start time seek the video, as a command's time does? **Answered 28 Oct 2026 (v6 item 13):** selecting a request seeks the video.
47. **The type segments' words** (*Img*, *Doc*, *WS*): kept from the product; spell them out (*Images*, *Documents*, *WebSockets*)?

**New with the answers (28 Oct 2026):**

48. **The dock control on Logs and Meta Data**: kept (as built), or dropped like Network's, so only All Commands moves the logs?
49. **A floating or collapsed video on the Network tab**: the table then reaches the window's edge and the popover covers the end of nearby rows. Keep, or keep the video docked while Network is open?
50. **A click on the strip**: nothing (as built), seek the video as All Commands' timeline does, or draw a new window as developer tools' overview does? **Answered 28 Oct 2026 (v6 item 21):** a drag draws a window and moves it; a click still does nothing.
51. **R on All Commands' timeline** too, so the key means "reset the timeline" on both tabs?
52. **DevTools' contrast** (C48): keep the three light phases as they are, the times being written in the popover and Timing tab, or darken them for 3:1?
53. **The view switch's icons** (C49): clear enough, or should the first row make room for the words (for example by making the type segments small)? **Moot since 28 Oct 2026:** the switch is gone (v6 item 19).

**New in v6:**

54. **Bodies and `network.full.har`**: LambdaTest's page says the capability enables HAR logging, but not that the HAR holds response bodies. Built as if it does (the Response tab's empty state names it). Right?
55. **The dock control on Network**: it left the tab so the v5 popover had the video's side to open into (question 41). The popover now opens above or below its row, so the reason is gone. Bring the control back on Network?
56. **"An error counter with filter"**: read as the tests pane's pair, a readout plus a filter menu, with the active filter as a token. Slow responses joined errors in both [proposed]. Keep that? **Answered 28 Oct 2026 (v7 items 9 and 10):** counts that filter, All Commands' control, for errors and slow responses.
57. **The Command column**: the command running when the request started, or, between commands, *after* the last one (as built). Or leave those requests blank?
58. **The popover's place**: beside the Waterfall column, below or above the row (as built), so the pointer can run down the bars; or under the bar itself, covering the next rows' bars? **Answered 28 Oct 2026 (v7 item 12):** just above the bar, its caret on it.
59. **The external viewer in the product**: compare.sitespeed.io reads a HAR from a link that any site may fetch, and a real HAR can hold cookies and tokens. A short-lived signed link, and a word with security, before this ships?
60. **Sorting by duration** left with the Duration column (item 18), and Waterfall does not sort (answer to 40). Bring back a way to sort by duration, for example in the Waterfall header?
61. **Ctrl + wheel on Windows** (C54): it seeks over the video and All Commands' timeline and zooms over the overview and Waterfall. Keep the two meanings, or move the seek to another key there?
62. **The image mark without a body**: shown only for captured images (as built), or for every image, with a hover that explains why there is no preview?
63. **The Waterfall beside the details panel**: the list keeps Name and Status, as in v5 and developer tools. Should "always" (item 19) keep the Waterfall there too?
64. **The overview's page-load markers** are unlabelled triangles, named on hover. Number them, or name the page beside each when there is room?

**New in v7:**

65. **Show CONNECT in the settings menu** resets with each test, as the v5 switch did, while the overview's choice is remembered. Remember Show CONNECT too, now that it sits among settings?
66. **The pressed count**: S3's look (the outline variant) now shows in All Commands too, since it is the same control. Keep it in both tabs?
67. **The hourglass's colour**: grey everywhere, as S2 draws it (as built), or amber in the rows so slow requests stand out more? **Answered 29 Oct 2026 (v8 item 1):** amber everywhere.
68. **The popover above the bar** covers the bars of the rows just above while it is open: moving down the column swaps it from bar to bar, moving up means going round it or closing it. Acceptable?
69. **The narrow toolbar** (1280 × 800 by default): ⚙ and the HAR group fold into one ⋯ (as built). Or should the gear stay and only HAR fold?
70. **What the counts count**: the type and the time window, not the search, as All Commands' counts (as built). Or every filter, the search included?

**New in v8:**

71. **A visible way back to the whole session**: the token's × was the visible twin of **R** (`ux-persona.md`: every power-user shortcut has a visible twin). A window now clears with R, by zooming out, or with Clear Filters when nothing matches. Add a visible control, for example a reset button at the overview's end like the v5 strip's, or leave it?

Questions 72 to 85, the setup state's: §12.9; 86 to 90, its review's: §12.12.

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
- [ ] v4: amend `patterns/automation-details.md` with §4d; record C34 to C39.
- [ ] v4: `guidelines/`: nested lists (indent per level, a rule per level, stacked sticky headers), the media tab row and its overflow, the order in which a narrow bar gives way.
- [ ] v4: `mock-data.md`, nested test cases.
- [ ] v4 FE asks: closable in-place tabs with overflow, and a video player whose control row works in every mode.
- [ ] v4: `icons.md`, add SquareArrowOutUpRight and LocateFixed to this page's names (README).
- [ ] v5: amend `patterns/automation-details.md` with §3d and §4e (the Network tab); record C40 to C47.
- [ ] v5: `mock-data.md`, network values and the size and duration forms (§9).
- [ ] v5: `guidelines/`: sortable tables (a button per header, the rotation, `aria-sort` on one header), a details panel beside a table, the data popover's placement (beside, never above or below), and the phase palette.
- [ ] v5 FE asks: `LTTable` sorting, rendered cells and sticky columns; `LTSwitch`'s sizes; `LTTabNav` tabs that switch in place; `LTPopover` for data.
- [ ] v5: `icons.md`, add ArrowUp, ArrowDown and ArrowUpDown to this page's names (README).
- [ ] v5 answers: amend `patterns/automation-details.md` with §4f; record C48 and C49; decide where a timing palette lives (C48, §9).
- [ ] v5 answers: `guidelines/`: an overview strip with handles (the range timeline's second use), and a per-tab exception to the dock control.
- [ ] v5 answers: `icons.md`, add ChartGantt (README).
- [ ] v6: amend `patterns/automation-details.md` with §3e and §4g; record C50 to C56.
- [ ] v6: `guidelines/`: an overview with a brush that shares its window with a table column; resizable and movable table columns with their keyboard twin; popovers placed against a table row; tokens for active filters beside a readout.
- [ ] v6 FE asks: `LTToken`'s text and remove props; `LTTable` column widths, resizing and reordering; `LTPopover` placement against another element; an overview component.
- [ ] v6: `icons.md`, fill *Filter* (`ListFilter`) and *External link* (`ExternalLink`), and add Turtle (README).
- [ ] v6: `mock-data.md`, HAR capture per run and the image stand-ins (§9).
- [x] v7: `guidelines/ltactionmenu.md`, a menu item's grey on hover only, never at rest (rajat-lt/design-context PR #19, `6cfb737`, 28 Oct 2026). Rajat asked for this one change in design-context and nothing else.
- [ ] v7: amend `patterns/automation-details.md` with §3f and §4h; record C57 to C63.
- [ ] v7: `guidelines/`: counts that filter as one control across tabs (rest invisible, pressed outline); toggle items and a value in a menu (C57, C58); a filter row's token that shortens before the row wraps.
- [ ] v7 FE asks: toggle items (`menuitemcheckbox`) and values in `LTActionMenu`; a slot beside `LTPopover`'s close button; a pressed state on `LTButton`.
- [ ] v7: `icons.md`, fill *Settings* (`Settings`) and swap Turtle for Hourglass (README).
- [ ] v8: amend `patterns/automation-details.md` with §4i.
- [ ] v8: `guidelines/`: the slow-response mark's colour (`attention.fg`) wherever it shows.
- [ ] Setup state: §12.10; its review: §12.12.

## 12. The setup state (30 Oct 2026)

Rajat's ninth brief, 30 Oct 2026, written *setup item 1* to *setup item 17*. The page shows nothing while a test is being set up, so users think it is stuck (item 1). How long setup takes depends on what the run asks for: usually 15 to 30 seconds with no preferences, 10 to 15 minutes with many or complex ones, and there is no maximum, median or average to show (items 2, 3, 10). The brief lists the backend's steps (item 4) and asks for:
- one flow, with generic setup, Apple Pay, the test run and showing the results (items 5, 16, 17);
- the current step and the next few (item 7);
- no time left and no percentage, because steps retry, Apple Pay up to 5 times (item 8), with retries perhaps shown (item 9);
- small animated illustrations or icons, one per major step and only the current one visible (item 11), animated with oil-motion if it helps (item 12);
- the tests list and the header filled, the other sections bare until the data arrives (item 14), and the test's status *running* meanwhile (item 15);
- an objective, bias-aware view (item 6), no hallucination (item 13), and at most two minutes of grounded research (item 7).

Four reference screenshots came with it: *R1*, Claude's working line (a spinning mark, the step's name, a stream of text under a rail); *R2*, Metaview's onboarding steps (ticked, current with nested sub-steps, pending); *R3*, Lovable's project steps (tick, spinner with a sub-line, grey dot); *R4*, a task list with dashed circles for pending steps. The brief says not to follow them alone, so they count as reference.

Sources read from `design-context` `main` (`6cfb737`) on 30 Oct 2026:
- `ux-persona.md`.
- `ux-text-guidelines.md`: §3 empty states, whose own example is *Setting up your device · Logs stream here as soon as the device is ready.*; §3 inline status (announce what visuals hide); §5 *running* over *in progress*; §7 no ETA unless it is reliable, and running work shows elapsed time.
- `guidelines/README.md`: §4 the status vocabulary and the open conflict over running's colour; §7 `LTSkeletonBox` against `LTLoader`.
- `guidelines/ltprogressbar.md`: motion only while a value changes; reduced motion.
- `patterns/automation-details.md` (§4, the panes load independently), `patterns/kane-agent-playground.md` (`LTTimeline` as a live step rail), `patterns/realtime-testing-window.md` §5 (*Connecting to Galaxy Z Fold4*, *Allocating a device*).
- `COMPONENTS.md`: `LTTimeline` (compound `LTTimeline.Item` with `badgeIcon` and `LTTimeline.Body`; `politenessLevel`), `LTLoader`, `LTBlankSlate` (`visual`), `LTTimer`, `LTTestStatusLabel`.
- `mock-data.md` (the statuses; the Status component draws running as a blue partial ring), `icons.md`, `TOKENS.md` (`animation.easeOutCubic`, the only motion token).
- `illustration-style-kit/`: `SKILL.md`, `references/parts.md` and the checker.

Outside sources, each read on 30 Oct 2026:
- Primer, [Loading](https://primer.style/product/ui-patterns/loading/), from GitHub's design system, on which design-context builds.
- NN/g, [Progress Indicators Make a Slow System Less Insufferable](https://www.nngroup.com/articles/progress-indicators/) (Katie Sherwin, Oct 26, 2014).
- W3C, [Understanding SC 2.2.2: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) (WCAG 2.2, Level A).
- TestMu AI (formerly LambdaTest), [Apple Pay Automation on Real Devices](https://www.testmuai.com/support/docs/apple-pay-auto/) and [Upload Your Application](https://www.testmuai.com/support/docs/application-setup-via-api/), for the product's facts.
- [oil-oil/oil-motion](https://github.com/oil-oil/oil-motion): `README.en.md` and `SKILL.md`, read through the GitHub API (MIT licence, created Aug 07, 2026, last pushed Oct 04, 2026).

### 12.1 What the research says, and what it changed

- **Primer, Loading.**
  - Says: over about 10 seconds, use a determinate state and treat the process as a background task, so the rest of the page stays usable. An animated icon or illustration may be a "branding moment" for special loading states, used sparingly. Put the indicator nearest to the content it stands in for, without a jarring shift when content replaces it, and replace a cluster of indicators with one. Announce status with `role="status"` or a live region, without over-announcing. Loading indicators keep animating for people who prefer reduced motion, kept subtle.
  - Changed: one panel in the centre pane; the page stays usable; the spinner turns under reduced motion, the illustration does not.
- **NN/g.**
  - Says: looped spinners suit 2 to 10 seconds; beyond that a user cannot tell a working spinner from a stuck one. Percent-done suits longer waits, and when the time is hard to know, showing the number of steps helps users estimate. Static text such as "Loading…" is not enough. Long processes should offer a way to stop.
  - Changed: steps instead of a percentage, a ticking time on the current step, the attempt count, and question 79.
- **W3C, 2.2.2.**
  - Says: motion that starts by itself, lasts more than 5 seconds and sits beside other content needs a way to pause, stop or hide it, unless it is essential. Its note on loading lets an animation count as essential when no interaction can happen during that phase and leaving out progress could make the page look frozen or broken.
  - Changed: this page stays usable during setup, so the note does not cover a looping illustration; each one moves for at most 4 seconds, then rests (C66).
- **TestMu AI docs.**
  - Say: Apple Pay automation runs on real iOS devices, with Appium (and with Playwright in Safari), on the Real Device Plus Automation Cloud plan. The `applePay` capability provisions the Wallet, a sandbox card, AssistiveTouch and the passcode; `applePayCardType` takes amex, visa, master and discover, in priority order. The page lists iPhone 17 (iOS 26), iPhone 16 (18), iPhone 15 (17), iPhone 14 (16) and iPhone 13 (15), and its example uses an iPhone 16 on iOS 18. An uploaded app's URL has the form `lt://APP` followed by 21 digits.
  - Changed: the mock test is an Appium app test on an iPhone 16 with iOS 18, with `applePay: true` and `applePayCardType: ["visa"]`.
- **oil-motion.**
  - Is: an agent skill, not an animation library. It makes frame animations (sprite sheets, video) with AI image and video models called through ZenMux, billed per generation on the user's API key, and ties them to scroll, pointer, drag, touch or state. Its own scope leaves out interface transitions and micro-interactions that CSS, JavaScript, SVG, Lottie or real-time 3D can do, and single illustrations.
  - Changed: not used (C67). The spots move with CSS keyframes on their SVG groups.

### 12.2 Structure

- **Where:** the centre pane, under the tab bar, in place of All Commands, Logs and Network, the tabs whose content the run produces. Meta Data shows the run's capabilities, which exist before it starts. The tab bar, the tests pane and the header stay as they are (item 14).
- **The panel:** an ordered list of steps, up to 560px wide, centred in the pane with its text left-aligned, and top-aligned 32px below the tabs. Top-aligned, so the list does not jump as steps open and fold. *Setup v2 item 2: one centred composition, vertically centred in the pane, with no box (§12.12).*
- **The rail:** a 16px badge per major step on a 1px `border.muted` line (`LTTimeline.Item` with `badgeIcon`; story `lttimeline--timeline`; drawn by the look-alike, §12.8). *Setup v2 items 3 and 5: the main steps sit in a centred block under the stage, the running one with the blue spinner (§12.12).*
  - Done: `CircleCheck` in `success.fg`; the label in default text and its time at the row's end.
  - Current: `CircleDot` in `accent.fg`, with `aria-current="step"`; the step opens into a card.
  - Pending: `CircleDashed` and the label in `fg.muted`.
- **The current step's card** (1px `border.default`, 6px radius `radii.2`, 16px padding): *Setup v2 item 2: gone; the illustration, the step's name and its current sub-step are centred, with no box (§12.12).*
  - The step's illustration in a 144 × 136 slot, decorative (`aria-hidden`).
  - The step's name, bold, with the step's own elapsed time at the end of the line.
  - After a failed attempt: *Attempt 2 of 5* with `RotateCw`, and the failed attempt's reason.
  - For a slow step, once: *This step takes longer than the others.*
  - Its sub-steps: done (`CircleCheck`, its time at the end), current (`LTLoader` small, the page's only spinner, the label semibold), pending (`CircleDashed`, muted).
  - The illustration sits left of the text when the card is at least 360px wide (the narrowest logs pane, 480px, leaves 404px), and above it when narrower.
- **Under the list:** *Commands, logs, and the video appear here after the test runs.*, muted; with network capture on, *Commands, logs, network requests, and the video appear here after the test runs.* *Removed by setup v2 item 1.4.*
- **Video pane:** its bare frame and one muted line, *The video appears here after the test runs.*, with no heading: the centre pane is the only narrator.
- **Header:** the status pill *Running*, and the duration ticking the test's elapsed time (`ux-text-guidelines.md` §7: *Running · 14m 11s*). For a device test the meta row shows the device, its OS and the framework: *iPhone 16*, *iOS 18*, *Appium*.
- **Tests pane:** the row's running glyph, and *Running* where the duration goes, as *Queued* does. The readout and the status filter gain *Running*.

### 12.3 Behaviour, item by item

1. **The flow (items 4, 16):** four major steps, each from the brief. *Setup v2 items 7 to 9: Apple Pay is listed only once Reading your capabilities ends; Configuring the device (4.5) and Reading your capabilities (4.6) have a row each; Setting up the passcode joins Apple Pay; Loading your results happens in place, as skeletons (§12.12).*

| Major step | Its sub-steps | Brief |
|---|---|---|
| Setting up iPhone 16 | Finding an available iPhone 16 · Allocating the device · Checking your app · Installing your app · Applying your capabilities | 4.1 to 4.6 (4.5 and 4.6 share the last row) |
| Setting up Apple Pay | Setting up the wallet · Adding a sandbox card · Loading the wallet and card · Setting the card as the payment method | 4.7, 4.8 |
| Running your test | Running final checks · Running your commands | 4.10 |
| Loading your results | Loading commands · Loading logs · Loading the video | 4.11; network capture is off for this run, so it has no network row |

2. **The current step and the next ones (item 7):** every major step shows from the start; only the current one opens. Finished steps fold to one line with their time. *Setup v2 item 3: sub-steps show one at a time (§12.12).*
3. **No time left, no percentage (items 8, 10):** elapsed time only: the test's in the header, the current step's in its card, and each finished step's and sub-step's at the end of its row. The steps do the determinate job (NN/g); screen readers hear *Step 2 of 4*. *Setup v2 item 1.3: steps and sub-steps show no times; the header's duration stays.*
4. **Retries (items 8, 9):** nothing shows on a first attempt. When an attempt fails, the card shows *Attempt 2 of 5* and *The card failed to load on attempt 1.*, and the step's sub-steps run again from the first (question 73). The attempt line stays until the step ends. Grey with an icon: the user has no decision to make and nothing is broken yet (`ux-text-guidelines.md` §4).
5. **The slow step (item 4.8):** Apple Pay's card says once, from the moment the step starts, *This step takes longer than the others.* No minutes are promised. *Setup v2 item 4: replaced by the long-step note, shown only when a setup sub-step runs long (§12.12).*
6. **Illustrations (item 11):** one per major step, none for sub-steps, only the current one shown. Each plays for at most 4 seconds when its step starts, when a retry starts, and when a sub-step starts if the last play ended 10 or more seconds before; then it rests in the pose the kit drew (C66). With reduced motion it never moves. Each one's motion: §12.11. *Setup v2 item 2: on the centred stage; Loading your results has none (§12.12).*
7. **The spinner:** on the current sub-step only, `LTLoader` small, about a turn a second. It keeps turning with reduced motion, as Primer asks of loading indicators (question 80). *Setup v2 item 5: the running main step has it too (§12.12).*
8. **Status (item 15):** the test is *Running* from the moment setup starts: header pill, tests pane row, readout and filter.
9. **The hand-off (items 4.11, 14):** when the last sub-step ends, the list shows it done for 600ms, then the results replace the panel in place: All Commands' list (and its counter in the tab), Logs, Network's state, the video, the header's *Passed* and final duration, and the tests pane row. Nothing else moves. Screen readers hear *Results ready. Test passed.* Focus stays where it was (C73). *Replaced by setup v2 item 9: when the run ends, the stage gives way to skeletons and each result fades in as it arrives (§12.12).*
10. **Announcements:** one hidden status line, not the list (C74): each major step as it starts (*Setting up Apple Pay. Step 2 of 4.*), each retry (*The card failed to load. Trying again, attempt 2 of 5.*), and the end. Sub-steps are not announced; each row carries its state in hidden text (*, done in 41s*, *, running*, *, pending*), read on demand. *Setup v2: also a long sub-step, once, and the outcome as the results start loading (§12.12).*
11. **The page stays usable:** the tests list, the header's actions and the tabs work throughout. Opening another test and coming back finds the run where it is: progress belongs to the run, not to the page.
12. **Duration:** counts from the moment the test started, setup included; once the run ends it stops at its final value [proposed]. *Setup v2: it stops when the run ends, as the results start loading (§12.12).*
13. **Prototype only:** a dashed *Prototype* bar at the bottom right, over the video pane's empty space, on this test only, with **Pause** (or **Play**), **Next Step** and **Restart**. The demo plays the whole flow in about 90 seconds, its first Apple Pay attempt failing on its third sub-step; real setups take minutes (item 3). Not part of the design. *Setup v2: the demo takes about 105 seconds; Next Step also stops where a long sub-step starts to shimmer, at the skeletons and at each result.*

### 12.4 States

| State | What shows |
|---|---|
| Setting up | The list and the current step's card with its illustration; the header's *Running* and ticking duration; the video pane's line |
| Retrying | As above, with *Attempt 2 of 5* and the failed attempt's reason in the card |
| Running your test | The flask; *Running final checks*, then *Running your commands* |
| Loading your results | The chart; a row for each result the run captured. *Setup v2: skeletons in place, §12.12* |
| Done | The results in place; *Passed* in the header and the tests pane |
| Reduced motion | Still illustrations; the spinner turns. *Setup v2: the carousel and the shimmer stay still too* |
| Meta Data | The run's capabilities, as for a finished test |

### 12.5 Conflicts recorded

| # | Topic | Brief or reference | Guideline or source | Built | Why |
|---|---|---|---|---|---|
| C64 | Determinate progress | Brief: no time left, no percentage | Primer: a determinate state beyond about 10 seconds; NN/g: percent-done for 10 seconds or more | Steps and sub-steps as the determinate part, and elapsed times; no percentage, no ETA | NN/g's own advice when the time is hard to know: show the number of steps. `ux-text-guidelines.md` §7: no ETA unless it is reliable |
| C65 | A spinner on a long wait | A sub-step can last minutes | NN/g: looped animation for 2 to 10 seconds | The spinner marks the current sub-step only; the step's ticking time and the attempt count show it is alive | A ticking time tells working from stuck, which a spinner alone cannot |
| C66 | How long illustrations move | Brief: animated illustrations | WCAG 2.2.2 (Level A): motion over 5 seconds beside other content needs pause, stop or hide, unless essential; its note on loading covers a phase in which no interaction can happen | At most 4 seconds per play, then rest; plays on a step's start, a retry, and a sub-step's start at most once every 10 seconds; none with reduced motion | The page stays usable during setup, so a looping illustration is not essential |
| C67 | oil-motion | Brief: use oil-motion for the animation | Its README and SKILL.md: frame animation from AI video for scroll, pointer and state; UI motion that CSS or SVG can do is outside its scope; generation needs a ZenMux API key, is billed, and sends prompts and images to model providers | CSS keyframes on the illustrations' SVG groups, transform and opacity only | Its own scope excludes this job, and the drawings already exist as vectors |
| C68 | One loader or three | Brief: keep the sections bare | Base pattern §4: each pane gets its own loader | One progress panel in the centre pane; the video pane keeps one static line; the tests pane and header show data | Primer: replace a cluster of loading indicators with one; persona: one narrator per screen. The base pattern speaks of data loading, a separate wait |
| C69 | Running's colour | Brief: status *running* | README §4 (open since 8 Oct 2026): *Running* uses `attention` (yellow) for `LTTag`; `mock-data.md`: the Status component's running glyph is a blue partial ring | The pill in `accent.emphasis` with a white partial ring, as each pill takes its glyph's colour | `LTTestStatusLabel` is the Status component; Rajat is fixing the status colours (9 Oct 2026) |
| C70 | Apple Pay's sub-steps | Brief: wallet, card, loading, checkout payment method | TestMu AI docs: `applePay` provisions the Wallet, a sandbox card, AssistiveTouch and the passcode | The brief's four | Brief wins; question 75 |
| C71 | Results together or one by one | Brief: a step that shows the results | Primer: show each item as soon as it loads | The results arrive together at the end of *Loading your results* | Brief wins; question 77 |
| C72 | The reference screenshots' words and colours | R2 to R4: Title Case steps (*Client Setup*), blue or green marks | `ux-text-guidelines.md` §2 sentence case; §4 colours | Sentence case; blue only on the current step's dot and the spinner; green on finished steps' ticks | Reference only (item 7) |
| C73 | Focus after loading | Primer: when a process loads new content, move focus to its first focusable element | The user did not start this load and may be working elsewhere on the page | Focus stays; screen readers hear the result | Moving focus would pull the user out of what they are doing |
| C74 | A live rail | `kane-agent-playground.md`: `LTTimeline` with `politenessLevel="polite"`, so steps are heard | Primer: avoid over-announcing; times tick every second inside the list | The list is not live; one hidden status line announces steps, retries and the end | A live list would read a time every second |
| C75 | The time component | Base pattern: `LTTimer` (`00:00:24`) for times in the run | `ux-text-guidelines.md` §7 and `mock-data.md`: running work as *14m 11s* | The duration form, *1m 12s*; `LTTimer` is not used | `LTTimer` writes a clock time; elapsed work is a duration |

### 12.6 Design decisions [proposed]

- **One place narrates.** The panel stands in for the tabs whose content the run produces. Rejected: the illustration in the video pane (two places to look, and the video can float or collapse); a full-page interstitial (Primer: sparingly; it would hide the tests list and header that item 14 keeps); a banner above the tabs (the layout shifts when it leaves).
- **The list is the progress.** Every major step always shows; only the current one opens. Rejected: every sub-step always open (16 rows, the current one buried); a bar with a percentage (no reliable figure, item 8). *Setup v2 item 3: sub-steps show one at a time.*
- **The illustration sits in the current step's card**, beside its name, and leaves with it. Rejected: one picture above the list, which leaves the eye to match picture and row. *Setup v2 item 2: the illustration is centred above the step's name, with no card.*
- **Elapsed, never remaining.** Rejected: an ETA or a range (items 8 and 10; no historic data yet).
- **Retries show only when they happen.** Rejected: *Attempt 1 of 5* from the start, which suggests failure on every run.
- **The slow step says so once.** Rejected: an estimate in minutes, which nothing in the system can keep. *Setup v2 item 4: replaced by the long-step note.*
- **One spinner on screen**, on the current sub-step; the current major step has a still blue dot. Rejected: a spinner on both, which doubles the motion. *Setup v2 item 5: two, the running main step's and its sub-step's.*
- **A motion budget:** transform and opacity only; entrances on `animation.easeOutCubic` (`--ease-out`); turns ease in and out and end where they began, so a replay starts without a snap.
- **The hand-off holds the last tick for 600ms**, then the results replace the panel, with no toast: the result is in view (`ux-text-guidelines.md` §3: success only when the result is out of sight). *Setup v2 item 9: replaced by skeletons.*
- **The steps follow the capabilities:** Apple Pay is a step because `applePay` is true; with network capture off, *Loading your results* has no network row.

### 12.7 Copy

All strings follow `ux-text-guidelines.md`; rule numbers are that guide's.

| Where | String | Rule |
|---|---|---|
| Major steps | Setting up iPhone 16 · Setting up Apple Pay · Running your test · Loading your results | §2 sentence case; §5 *running*; the device by its name. *Test run* is avoided: it names a Test Manager entity (§6) |
| Sub-steps | Finding an available iPhone 16 · Allocating the device · Checking your app · Installing your app · Applying your capabilities | *Allocating*, as `realtime-testing-window.md` §5 says it; *capabilities*, as the TestMu AI docs and Meta Data say it |
| Sub-steps | Setting up the wallet · Adding a sandbox card · Loading the wallet and card · Setting the card as the payment method | The brief's four; *sandbox card* is the docs' term |
| Sub-steps | Running final checks · Running your commands · Loading commands · Loading logs · Loading the video | *commands*, as All Commands says it |
| Retry | Attempt 2 of 5 · *The card failed to load on attempt 1.* | §5 *{object} failed to {verb}*; one clause |
| Slow step | This step takes longer than the others. *Removed in setup v2 (item 4's note replaces it).* | No minutes promised (§7) |
| Under the list | Commands, logs, and the video appear here after the test runs. (With network capture on: Commands, logs, network requests, and the video appear here after the test runs.) *Removed by setup v2 item 1.4.* | §3 empty states: the body says what the user gets; serial comma |
| Video pane | The video appears here after the test runs. | As above |
| Header and tests pane | Running · *1m 12s* | §7: running work shows elapsed time |
| Screen readers | *Setting up Apple Pay. Step 2 of 4.* · *The card failed to load. Trying again, attempt 2 of 5.* · *Results ready. Test passed.* · rows: *, done in 41s*, *, running*, *, pending* | §3: announce what visuals hide |
| Prototype bar | Prototype · Pause · Play · Next Step · Restart | §2 Title Case buttons; not product copy |

Finalists for the four strings that carry the most (§8 format):

**The retry line**

| | Option |
|---|---|
| A, recommended | *Attempt 2 of 5* (label) and *The card failed to load on attempt 1.* |
| B | *Trying again · attempt 2 of 5* and *The card failed to load.* |
| C | *Retrying (2 of 5)*, the reason in a tooltip |
| D | *Attempt 1 failed while loading the card. Trying again.* |

- Why these work: A counts and names the failure in the house form, *{object} failed to {verb}*, in two short lines. B carries the same facts with more motion in the words. C keeps the line short. D says it all in one sentence.
- Picking between them: B when the reason is often unknown; C when space is tight, accepting that a tooltip hides the reason from many users; D when retries are rare and a counter is not wanted.

**The slow step**

| | Option |
|---|---|
| A, recommended | *This step takes longer than the others.* |
| B | *Apple Pay takes the longest to set up.* |
| C | *Apple Pay setup can take several minutes.* |
| D | *Longer than the other steps* |

- Why these work: A holds for any slow step and promises nothing. B and C name the preference. D is the shortest.
- Picking between them: B once timings show Apple Pay is always the longest; C once historic data exists (item 10); D only where a label, not a sentence, fits.

**Under the list**

| | Option |
|---|---|
| A, recommended | *Commands, logs, and the video appear here after the test runs.* |
| B | *Your results appear here after the test runs.* |
| C | *Results show here as soon as they are ready.* |

- Why these work: A names what will arrive, as the queued state does. B is shorter. C fits results that arrive one by one.
- Picking between them: B if the list of results varies a lot between runs; C if question 77 is answered with incremental loading.

**The video pane**

| | Option |
|---|---|
| A, recommended | *The video appears here after the test runs.* |
| B | *Video after the test runs* |
| C | *Waiting for the session* (the queued state's heading) |

- Why these work: A matches the line under the list. B is the shortest. C reuses an existing string.
- Picking between them: B where only a label fits; C only before the session exists, which is the queued state.

### 12.8 Gaps found in design-context

- `mock-data.md` has no mobile devices, OS versions or app IDs. The mock uses the TestMu AI docs' example (iPhone 16, iOS 18, Appium) and their app URL form (`lt://APP` and 21 digits, generated).
- Nothing in design-context names setup steps, sub-steps or retry limits; these are the brief's, worded here.
- `icons.md` leaves *Running or in progress* and *Retry or rerun* [TO FILL]. Used here: `LTLoader`'s spinner and `RotateCw`; the step badges `CircleCheck`, `CircleDot` and `CircleDashed` (lucide 1.58.0, each checked in the installed package).
- `COMPONENTS.md`: `LTTimeline.Item`'s badge size, and whether `badgeIcon` takes a spinner (story `lttimeline--timeline`); `LTLoader`'s look (Primer's spinner assumed).
- No pattern for step progress; `kane-agent-playground.md`'s rail is the nearest.
- `TOKENS.md` has one easing and no durations.
- The illustration kit has no drawing for a device being set up, a payment, a running test or results loading. The four spots are built from lifted parts (§12.11) and wait for Rajat's approval, as the kit requires.

### 12.9 Open questions

72. **When do preference steps appear?** Built: from the start, read from the capabilities. Or only once *Applying your capabilities* has listed them (brief 4.6)? **Answered 30 Oct 2026 (setup v2 item 7):** only once the test's settings are read.
73. **An Apple Pay retry:** does it start again from *Setting up the wallet* (built), or retry only the failed sub-step?
74. **After the fifth failed attempt:** does the test end with an error, go on without Apple Pay, or something else? That failure state is a later variant.
75. **AssistiveTouch and the passcode:** the docs list them in Apple Pay's provisioning. Show them as sub-steps? **Answered in part 30 Oct 2026 (setup v2 item 8):** the passcode shows as a sub-step; AssistiveTouch is still open.
76. **Do commands stream in while the test runs?** If so, the panel should give way to the live list when *Running your commands* starts.
77. **Results all at once** (built, as the brief describes), or each as soon as it is ready, the video last (Primer)? **Taken as answered by setup v2 item 9 [proposed]:** each result as it arrives, behind its skeleton.
78. **Finished steps:** should they open to show their sub-steps and times, during setup and afterwards (in Meta Data, say), to see where a slow setup spent its time?
79. **Stop:** can a user stop a test while it sets up (NN/g: long processes need a way out)? Where would it live?
80. **The spinner beyond 5 seconds** (C66): accept it as essential, or stop it too and let the ticking time carry it? *Setup v2: the shimmer of a long sub-step joins this question (C77).*
81. **The illustrations:** keep the kit drafts, change them, or use lucide icons instead?
82. **The running glyph** is still, as the Status component draws it. Should it turn?
83. **Elsewhere:** should a test being set up show as such beyond this page, for example in the builds listing or in notifications?
84. **The backend's names for the steps**, and the retry limits of steps other than Apple Pay's 5?
85. **Duration:** does a running test's duration count its setup (built), or only the run?

### 12.10 When this ships into design-context/

- [ ] Amend `patterns/automation-details.md` with this section: the setup state and its hand-off; record C64 to C75.
- [ ] `guidelines/`: a step-progress pattern (rail, current card, retries, elapsed times, announcements), the motion budget (C66), and one narrator for a page that loads in parts.
- [ ] `mock-data.md`: mobile devices, OS versions, app URLs and setup steps.
- [ ] `icons.md`: fill *Running or in progress* and *Retry or rerun*; add CircleCheck, CircleDot, CircleDashed and RotateCw to this page's names.
- [ ] FE asks: `LTTimeline` badge states (done, current, pending), `LTLoader` inside a list, and a running state for `LTTestStatusLabel`.
- [ ] Illustration kit: the four drafts into `gallery/pending/`, once Rajat approves them.

### 12.11 The illustrations

Four spots built with design-context's illustration kit (`illustration-style-kit/skill/lambdatest-illustration` at `6cfb737`) from parts lifted out of LambdaTest's own drawings, in a scratch copy of the repo: nothing was committed to design-context. Their modules are in `illustrations/kit-drafts/`, with 2x previews, so the kit can rebuild them. Each is cut to a 144 × 136 slot shown at 1x, so the line stays 2px. Each piece that moves is its own SVG group.

| Step | Parts | The one accent (share of ink) | Checker | Motion: at most 4 seconds, then rest |
|---|---|---|---|---|
| Setting up iPhone 16 | `phone-r134` without its home button (an iPhone 16 has none), its right edge drawn closed where r134's plus badge sat; `gears-r13`'s three gears at half size, each over a white disc | The large gear's hub (0.06) | PASS | The gears turn: the large one once, the small ones twice the other way, easing in and out |
| Setting up Apple Pay | `credit-card-r69` and its broken grey ring, at 0.84 | The filled circle of the card's mark (0.133); the stripe took 0.32, over the cap | PASS | The ring turns once; the card lifts 4px and settles |
| Running your test | `flask-r97` at 0.84 | The burner's flame (0.016) | WARN, line evenness 0.205: the lifted flask alone measures 0.234 | The bubbles rise into place one after another; the flame flickers |
| Loading your results | `bar-chart-r107` at 0.46, to fit the slot | The tallest bar as an accent outline (0.121); solid, at 0.48, it took 0.285 | WARN, subject height 0.142 of the artboard (cut for a 144px slot, not an empty state) and line evenness 0.198 (short strokes taper more when small; at 3x the bars read as closed outlines) | The bars rise from the baseline in turn, then the tooltip appears *Setup v2 item 9: no longer shown, since Loading your results happens as skeletons; the draft stays in `illustrations/kit-drafts/`.* |

### 12.12 Setup v2: Rajat's review (30 Oct 2026)

Rajat's review of §12, the same day, written *setup v2 item 1* to *setup v2 item 9*:

1. While the test loads, remove: (1) the control that puts the logs beside or below the video, (2) the option to hide or show the video, (3) each step's and sub-step's time, (4) *Commands, logs, and the video appear here after the test runs.*
2. The illustration in the centre, no bordered box, the current step centre-aligned.
3. The main steps in order (done, running, next); the sub-steps as a carousel showing only the one running.
4. A sub-step that runs long (one of Apple Pay's, for example) shimmers on its words, with a short line that reassures: the system is still working, it has not stalled, and the user should wait for it to finish. Worded by the text guide.
5. Blue spinner for a running step or sub-step, green tick for done, dashed circle for pending.
6. Keep the look pleasing and the hierarchy clear.
7. Apple Pay's setup is known only once the test's settings are read.
8. A passcode sub-step under Apple Pay.
9. Logs and commands load with skeletons and a subtle, pleasing animation.

Read again for this round: `ux-text-guidelines.md` (§1 rules 2, 3 and 7; §2 full stops; §3 inline status), `ux-persona.md` (disabled with a tooltip beats hidden; teach at the slow path, once), `icons.md` (fill follows size) and Primer's Loading pattern (skeletons; one announcement for a set of skeletons; incremental loading), all read earlier the same day.

**Structure**

- **The stage**, in place of All Commands, Logs and Network while the test sets up and runs, centred in the pane both ways and scrolling only when the pane is shorter:
  - the running main step's illustration, 144 × 136;
  - its name, 16px bold;
  - a line for retries, 12px muted: *Attempt 2 of 5. The card failed to load on attempt 1.*;
  - the sub-step carousel: one line, 14px, the blue spinner and the running sub-step;
  - a line for a long sub-step, 12px muted: *Still working on this step. It finishes on its own.*
  - The two 12px lines keep their room when empty, so the stage never jumps.
- **The main steps**, 32px under the stage: a block centred in the pane, its rows left-aligned on one rail, 32px each. Done: green tick, default text. Running: blue spinner, semibold. Pending: dashed circle, muted. No times.
- **Removed while the test loads:** the dock control at the end of the tab bar, the video's collapse control, every step and sub-step time, and the line under the list. The logs stay beside the video and the video shows docked, as the Network tab already forces; the user's own choices come back with the results.
- **Kept:** the header's ticking duration, the video pane's line, the tests pane's *Running*.

**Behaviour**

1. **The flow:**

| Main step | Sub-steps | Brief |
|---|---|---|
| Setting up iPhone 16 | Finding an available iPhone 16 · Allocating the device · Checking your app · Installing your app · Configuring the device · Reading your capabilities | 4.1 to 4.6, a row each |
| Setting up Apple Pay, listed once Reading your capabilities ends | Setting up the wallet · Adding a sandbox card · Loading the wallet and card · Setting up the passcode · Setting the card as the payment method | 4.7, 4.8; setup v2 items 7, 8 |
| Running your test | Running final checks · Running your commands | 4.10 |
| Loading your results | Commands, logs and the video, each in place | 4.11; setup v2 item 9 |

2. **Apple Pay joins the list** (item 7): before the settings are read, three steps show (*Step 1 of 3*). When *Reading your capabilities* ends, Apple Pay's row opens into place, pending, and starts half a second later (*Step 2 of 4*).
3. **The carousel** (item 3): one sub-step at a time. A finished one swaps its spinner for a green tick for half a second, then rises out as the next rises in (320ms, `animation.easeOutCubic`). A failed one gives way at once, to the retry.
4. **A long sub-step** (item 4): after 8 seconds in the prototype (question 86 for the product), a setup sub-step's words shimmer, a soft band sweeping across them every 2.4 seconds, and the note fades in below. Screen readers hear the note once. Only setup sub-steps count: *Running your commands* lasts as long as the user's own test (question 90). In the demo, Apple Pay's second attempt spends 16 seconds on *Loading the wallet and card*.
5. **Icons** (item 5): the blue spinner on the running main step and on the running sub-step, the green tick for done, the dashed circle for pending. Two spinners now show at once; §12.6's single spinner is superseded.
6. **Retries:** as before, now on the line under the step's name, centred and without an icon: a 12px icon would need a filled glyph (`icons.md`), which lucide does not have.
7. **The illustrations:** as §12.11, one per main step, on the stage. Loading your results has no stage, so the chart is no longer shown (question 89).
8. **The results** (item 9): when the run ends and its last tick has shown, the stage gives way to a skeleton in each region, fading in over 300ms:
   - All Commands: its toolbar and rows, the existing loading state;
   - Logs: its console, the real title (*Appium logs*) and 16 lines shimmering in a wave;
   - the video: its frame.
   - The header shows the outcome (*Passed*) and the duration stops, since the run is over (question 88).
   - Each region fades in (320ms, a 4px rise) as its result arrives: commands, then logs, then the video. All Commands' count appears with its commands. Network capture is off for this run, so its tab shows that state at once.
   - Screen readers hear *Test passed. Loading the results.*, then *Results ready.* once the last one arrives (Primer: one announcement for a set of skeletons).
9. **Once everything has arrived,** the dock and collapse controls return, with the user's own choices.
10. **Motion:** the stage fades in; the spots move as §12.11 says; the carousel, the shimmer and the row opening as above. With reduced motion the spots, the carousel, the shimmer and the row opening stay still, and the spinners turn.
11. **Prototype:** about 105 seconds in all. **Next Step** stops where each sub-step starts, where a long one starts to shimmer, at the skeletons and at each result.

**Conflicts recorded**

| # | Topic | Brief | Guideline or source | Built | Why |
|---|---|---|---|---|---|
| C76 | Hidden controls (item 1) | Remove the dock control and the option to hide or show the video while the test loads | `ux-persona.md`: disabled with a tooltip beats hidden | Hidden while the test loads; back with the results | Brief wins: there is nothing yet to dock, hide or float, and they return as soon as there is |
| C77 | The shimmer (item 4) | Shimmer a long sub-step's words | WCAG 2.2.2: motion over 5 seconds beside other content needs pause, stop or hide, unless essential (C66) | The shimmer runs while the sub-step runs long; still with reduced motion | Brief wins; it carries the reassurance. Question 80 covers it too |
| C78 | Hidden sub-steps (item 3) | Only the running sub-step shows | NN/g: showing the number of steps helps users estimate | The main steps still show in full; the running step's sub-steps do not | Brief wins; the main steps keep NN/g's point where it matters most |
| C79 | "Please wait" (item 4) | Tell users to please wait for it to finish | `ux-text-guidelines.md` §1 rules 2 and 7: no negation, no *please* | *Still working on this step. It finishes on its own.* | Guide wins on the words; the meaning is the brief's |

**Decisions [proposed]**

- **The last step happens in place.** When the run ends, skeletons stand where commands, logs and the video will be, and each fades in as it arrives. Rejected: a stage for *Loading your results* followed by skeletons, which is two loaders for one wait; all results at once (Primer: show each as soon as it loads).
- **The video gets a skeleton too.** Item 9 names logs and commands, but the video pane's line (*after the test runs*) stops being true once the run has ended.
- **The outcome shows when the run ends**, while the results still load; the duration stops then.
- **Room kept** for the attempt line and the note, so the stage stays put as they come and go; the list grows only when Apple Pay joins it, and opens smoothly.
- **A beat between sub-steps:** a finished one keeps its tick for half a second, so progress is seen, not only the next step.
- **Brief 4.5 and 4.6 get a row each** now that one line shows at a time: *Configuring the device* and *Reading your capabilities*. The second is what reveals Apple Pay.
- **The passcode sits after the card** (*Loading the wallet and card*) and before *Setting the card as the payment method*: the docs list the passcode after the card, and the payment method stays last, as the brief has it (question 87).
- **The logs' title follows the framework:** *Appium logs* for this test, where §12's Appium test showed *Selenium logs*.
- **While the test loads,** the logs sit beside the video and the video shows docked, whatever was chosen before; the choice returns with the results.

**Copy**

| Where | String | Rule |
|---|---|---|
| Stage, retry | Attempt 2 of 5. The card failed to load on attempt 1. | §5 *{object} failed to {verb}*; body text ends with a full stop |
| Stage, long sub-step | Still working on this step. It finishes on its own. | §1 rules 2, 3 and 7; §3 inline status |
| Sub-steps, new | Configuring the device · Reading your capabilities · Setting up the passcode | §2 sentence case; *capabilities* as before |
| Logs | Appium logs · *Loading logs* (screen readers) | The framework's own name |
| Screen readers | *Setting up iPhone 16. Step 1 of 3.* · *Setting up Apple Pay. Step 2 of 4.* · *Still working on this step. It finishes on its own.* · *Test passed. Loading the results.* · *Results ready.* | §3 announce what visuals hide |

Finalists for the long-step note (§8 format):

| | Option |
|---|---|
| A, recommended | *Still working on this step. It finishes on its own.* |
| B | *Still working on this step.* |
| C | *We're still on it. This step can take a while.* |
| D | *Still running. Some steps take longer than others.* |

- Why these work: A says the step is alive and that it ends without the user's help, in house words. B is the shortest, one clause. C speaks as *we* (§1, voice) and owns the wait. D treats a slow step as normal.
- Picking between them: B where space is tight; C if the product's voice should be warmer here; D if long sub-steps turn out to be common.

**Open questions**

86. **The long-step threshold:** 8 seconds in the compressed demo. For the product, [proposed] 30 seconds: with setups of 10 to 15 minutes, a lower threshold shows the note on most sub-steps, and it turns into wallpaper. What should it be?
87. **The passcode's place** among Apple Pay's sub-steps: after the card (built), or first, before the wallet?
88. **The outcome while results load:** the header shows *Passed* from the run's end (built), or *Running* until the results are in?
89. **Loading your results** has no stage now, so the chart illustration is unused. Keep it so, or show the stage with the chart before the skeletons?
90. **The long-step note during the run:** built for setup sub-steps only. Should a long *Running your commands* reassure too?

**When this ships into design-context/**

- [ ] Record C76 to C79 and these decisions in `patterns/automation-details.md`, with §12.
- [ ] `guidelines/`: the sub-step carousel, the long-step shimmer and note, and skeletons per region with one announcement.
- [ ] The long-step note into `ux-text-guidelines.md`'s examples, once chosen.
