# Automation test details · prototype

A working prototype of LambdaTest's automation test details page with Rajat's 18 UX changes of 16 Oct 2026, his 16 more of 17 Oct 2026 (v2), 11 more of 18 Oct 2026 (v3), 12 more of 19 Oct 2026 (v4), the Network tab's 11 of 27 Oct 2026 (v5, with Rajat's answers of 28 Oct 2026) and its 28 more of 28 Oct 2026 (v6), built from the `design-context` repo: its tokens, component names and props, guidelines, page patterns, text guide and mock data.

**Live:** https://rajat-lt.github.io/automation-details-prototype/

**Spec:** [`automation-details.md`](automation-details.md), in the `design-context/patterns/` house format. It maps each change to components, and records every conflict between the brief, the guidelines and the screenshots (§6), the design decisions (§7), the copy (§8), the gaps found in design-context (§9), and the open questions (§10). v2 adds §3b, §4b and §7b, conflicts C20 to C28, and Rajat's answers; v3 adds §4c and §7c and conflicts C29 to C33; v4 adds §3c, §4d and §7d and conflicts C34 to C39; v5 adds §3d, §4e and §7e and conflicts C40 to C47; Rajat's answers add §4f and §7f and conflicts C48 and C49; v6 adds §3e, §4g and §7g and conflicts C50 to C56.

## Where to see each change

| # | Change | Try it |
|---|---|---|
| 1 | Condensed meta row | Under the title: status, duration, test case, browser, OS, resolution, framework, tunnel, updated by |
| 2 | Editable title, copy test ID | Hover the title, click to rename (Enter saves, Esc restores); the copy button sits beside it |
| 3 | Absolute time on hover | Hover or tab to *6 hours ago* |
| 4 | Email on hover | Hover or tab to *Ritika Sharma* |
| 5 | Action group and menu | View in HyperExecute, Raise a bug, full screen, More actions (Share `S`, View history, Delete) |
| 6 | Progressive disclosure | *Show 20 passed logs* inside test case #TC-225: skeleton, then the commands |
| 7 | Timeline seek bar | Click the bar to seek; red blocks are failures; drag the handles to narrow the window |
| 8 | Timeline controls | Chevrons jump to the previous or next failed command; the undo icon resets the window |
| 9 | Highlight on jump | Any jump (timeline, chevrons, a command's time, the video's seek bar) highlights the command at that moment |
| 10 | `/` focuses search | Press `/` anywhere outside a text field |
| 11 | Command counter | *All Commands 93* |
| 12 | Lighter rows | 48px rows, `neutral.subtle` dividers |
| 13 | Dock | The two icons at the end of the tab bar: logs left of the video, or below it |
| 14 | Resizable sections | Drag any divider, or focus it and use the arrow keys (Home and End for the limits, Enter to reset) |
| 15 | Test case as a parent | Groups with a `#TC-` ID are test cases; the others are annotations |
| 16 | Opens at the failure | Load a failed test: passed runs collapse and the first failure is in view, highlighted |
| 17 | One scroll, sticky parents | Scroll the command list down and up |
| 18 | Indent rule | The line from an open group's chevron to its last command |

**v2, 17 Oct 2026**

| # | Change | Try it |
|---|---|---|
| v2 1 | Reorder tabs | Drag a tab sideways (Esc cancels), or right-click it (or focus it and press Shift + F10): Move left, Move right, Reset tab order |
| v2 2 | Right-click a command | Right-click any command row (not a group): Copy payload, Copy link, Raise a bug. Shift + F10 on a focused row does the same. Open a copied link, such as [`#/t-01/commands/c45`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/commands/c45) |
| v2 3 | Space to the next failure | On All Commands, press Space: the next failed command comes into view and takes focus, cycling after the last. Shift + Space goes back |
| v2 4 | One payload view | Open two commands, switch one to the table (table icon): both switch, and it is remembered |
| v2 5 | Picture-in-picture, collapse | On the video's control row: Open picture-in-picture (drag its header, resize from its top-left corner), Collapse video (then **Show Video** at the end of the tab bar) |
| v2 6 | Actions at a failure | Seek the video onto a red marker: the line above the seek bar turns red with Raise a bug and Copy payload. *Removed by v4 item 9.1; the popovers carry these actions* |
| v2 7 | Arrow keys between commands | Focus a command (click it, or Space), then Up and Down; Home and End; Enter opens it |
| v2 8 | Failure popovers | Hover a red stretch on the video's seek bar or on the timeline |
| v2 9 | Zoom to a failure | Double-click a red stretch on the timeline; the undo icon resets it |
| v2 10 | Copy a table | In table view, the copy icon in the table's corner; paste into a sheet or a doc |
| v2 11 | Decluttered video controls | The command line, the full-width seek bar, then the buttons; Download and Rotate under More video actions. *Replaced by v4 item 9: one row* |
| v2 12 | Unlink | Hover the test case ID in the meta row; Undo in the toast |
| v2 13 | The name uses the space it has | Widen the window or collapse the tests pane: the title shows more; the breadcrumb shows the whole name whenever the bar has room |
| v2 14 | Cmd or Ctrl plus the wheel | Over the video or the timeline, hold Cmd (Mac) or Ctrl and turn the wheel |
| v2 15 | Screenshot dialog | Open a command, then View screenshot: its facts, download, bug and link |
| v2 16 | Full text of cut text | Hover a cut group title, command, tag or value; text that fits shows nothing |
| Answers | Expand all, one time form | The double chevron opens every group and command; every time reads `m:ss`. Press `?` for all shortcuts |

**v3, 18 Oct 2026**

| # | Change | Try it |
|---|---|---|
| v3 1 | Unlink, aligned and always shown | The meta row: `#TC-88904` and its unlink button sit on the row's text line |
| v3 2 | Remarks | Under the meta row of [`#/t-01`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/commands): **View All**, then **Show Less**. [`#/t-04`](https://rajat-lt.github.io/automation-details-prototype/#/t-04/commands) has one that fits; most tests have none |
| v3 3 | Comfortable and condensed rows | The rows icon in the timeline header, beside the undo icon |
| v3 4 | Popovers to work in | Hover a red stretch for a moment, then move into the popover: copy text, Raise a bug, Copy payload, Edit or Add comment. Close it with ×, Esc or a click outside. The stretch at 0:32 is a single failure; the one at 1:16 is merged |
| v3 6 | Comments | Open a failed command: Add comment (or read the one on Create New Session at 0:32). Commented stretches carry a mark above the timeline |
| v3 7 | Controls right of the frame | Dock the logs below the video (the second icon at the end of the tab bar). *Replaced by v4 item 9.4* |
| v3 8 | White tables | Open a command and switch to the table view |
| v3 9 | Counts that filter | Press the passed or failed count beside *Timeline*; press it again for all |
| v3 10 | No Rotate on web videos | More video actions has no Rotate video on a web test (v4 moved Download into it) |

**v4, 19 Oct 2026**

| # | Change | Try it |
|---|---|---|
| v4 1 | The comment below the payload | Open *Create New Session* at 0:32: the payload, then the comment |
| v4 2 | Delete a comment | Edit that comment: **Delete Comment** on the left. No confirmation, for now |
| v4 3 | *Remarks:* | Under the meta row of [`#/t-01`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/commands) |
| v4 4 | One left edge | Collapse the tests pane: the meta row and the remarks start where the test name starts |
| v4 5 | Copy link in the popovers | Hover the red stretch at 0:32 on the video's seek bar or the timeline: the third action |
| v4 6 | Indent rule | An open group's line starts just under its chevron and ends on its last row's bottom border |
| v4 7 | Condensed by default | First visit, or after clearing the site's data |
| v4 8 | Payloads in tabs | Open a failed command, ⋯ > Pop out payload: tabs appear beside the video. Up to 5; drag or right-click a tab to reorder; × or Delete closes one; More ▾ holds the tabs that do not fit |
| v4 9 | The video's controls in one row | Play, seek bar, time, speed, picture-in-picture, collapse, ⋯ (Download video, full screen); the same docked, below, floating and in full screen |
| v4 10 | A test case inside a test case | #TC-7742 holds #TC-8; #TC-56345 holds #TC-4410 at its end. Each has its own rule; scroll inside #TC-8 and both headers stay |
| v4 11 | Search stays | Scroll the list down: only the timeline slides away |

**v5, 27 Oct 2026: the Network tab** ([`#/t-01/network`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/network))

| # | Change | Try it |
|---|---|---|
| v5 1 | The existing list first | Type segments, Download HAR (a real `.har` file), the search's field (*All*), *Search all fields*, *Errors only* (a 500 at 01:36 and a 404 at 02:10), *Show CONNECT* (3 tunnels), the footer |
| v5 2 | Column names | Name, Status, Method, Domain, Type, Size, Start time, Duration, Waterfall |
| v5 3 | Sorting | Click a header: ascending, then descending, then ascending again. Name ascending by default. Waterfall does not sort (answers) |
| v5 4 | A request's details | Click a row (or Enter on it): Headers, Payload, Response, Timing beside the table, which keeps Name and Status. Up and Down walk the requests; Esc closes. Click a Waterfall bar to open Timing directly |
| v5 5 | Duration | The product's Time, renamed: *34.77ms* |
| v5 6 | Start time | *00:05*, `mm:ss` |
| v5 7 | Waterfall | Scroll the table right (the logs beside the video are narrower than the table) and hover a row's Waterfall cell; the ⓘ in its header is the legend. Since the answers the column is the whole run |
| v5 8 | Popover on the right | It opens right of the table, over the video, never above or below the bar |
| v5 9 | Stays open | Move the pointer into it and select a value, or use Copy timings; ×, Esc or a click outside closes it |
| v5 10, 11 | Hierarchy, everything works | Muted secondary columns, tinted error rows, a sticky Name; every control works on every test |

**v5 answers, 28 Oct 2026**

| Answer | Change | Try it |
|---|---|---|
| 39 | The waterfall is the whole run, in the rows or as a strip on top | The two icons left of Download HAR: *Waterfall in rows* and *Waterfall strip on top*. The choice is remembered |
| 39 | The strip's handles filter the list | In the strip view, drag a handle (or focus it and use the arrow keys); the list, the footer and a tag follow. Hover a row to ring its bar |
| 39 | Reset, and R | The undo icon at the strip's top right, or press R anywhere on the tab outside a text field |
| 40 | Waterfall does not sort | Its header has no sort button |
| 41 | The logs stay beside the video on this tab | Dock the logs below the video on All Commands, then open Network: the logs move beside the video, and back on leaving |
| 42 | Chrome DevTools' colours | Hover a row's Waterfall cell, or open a request's Timing tab |

**v6, 28 Oct 2026: one window for the overview and the Waterfall** ([`#/t-01/network`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/network))

| # | Change | Try it |
|---|---|---|
| v6 1, 21 | The overview: the whole session | Above the list: commands' lane, histogram, page-load markers, error ticks, playhead. Drag on it to choose a window; drag the window to move it |
| v6 2, 5 | One window, two views; pinch to zoom | Pinch (or Ctrl + scroll) over the overview or the Waterfall column: both follow. A sideways scroll moves a zoomed-in window |
| v6 3 | Page-load markers | Click a ▼ above the overview: the window becomes that page load |
| v6 4 | Double-click a cluster | Double-click a group of bars in the overview |
| v6 6 | The window filters the list | The footer says *9 of 61 requests*; the token *Time: 00:36.2 to 00:44.3* sits in the toolbar's third row; its × or R clears it |
| v6 7 | Nothing too small | At the whole session's scale every request is a 2px sliver in its longest phase's colour; zoom in to see phases |
| v6 8, 27 | The timing popover | Hover a Waterfall cell: it opens below the row (above it near the bottom), beside the column, with the start time first. Move down the column: it follows without blinking |
| v6 9 | Slow responses | The turtle on *homes* (00:42) and the failing *rum* (01:36); ⋯ › *Set slow response limit* changes the 500ms limit |
| v6 10, 17 | Resize and move columns | Drag a column's right edge, or drag its header; right-click a header (or Shift + F10) for Move left, Move right, Reset columns. Reload: they stay |
| v6 11, 20 | Images | The image mark on *whatnew.png* and the favicons; hover the name for a preview; open one for the Preview tab |
| v6 12 | The command behind each request | The Command column (*after Find Element*) links to the command; the overview's top lane draws them all |
| v6 13 | Video seek | Click a request: the video jumps to its start; All Commands shows that command next time it opens |
| v6 14 | Request actions | Right-click a row, or its ⋯ on hover: seven copies. In the details: Copy link, and More actions for the rest; each Headers list copies itself |
| v6 15 | Bodies not captured | Open a passed test, for example [`#/t-02/network`](https://rajat-lt.github.io/automation-details-prototype/#/t-02/network), and a request's Response tab |
| v6 16 | Run order first | The list opens sorted by Start time |
| v6 18 | Duration after the bar | *65.00ms* after each bar, in milliseconds even past a second (*1251.88ms*) |
| v6 19 | Waterfall always; Overview switch | The *Overview* switch at the end of the third toolbar row; remembered |
| v6 22, 23 | HAR | Download HAR, and its caret: *View HAR file in external viewer* (compare.sitespeed.io in a new tab) and *Download HAR for filtered requests* |
| v6 24 | Errors: a count and a filter | The ⊗ and 🐢 counts in the third row; the filter icon beside the search |
| v6 25 | No legend | The ⓘ is gone |
| v6 26 | Hierarchy as the logs narrow | Drag the divider between the logs and the video: below about 549px the HAR actions fold into ⋯ |
| v6 28 | A link for every request | [`#/t-01/network/n42`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/network/n42) opens the failing beacon, selected, in view, with the video at 01:36 |

*v7 replaces the toolbar rows of v6 items 6, 9, 19, 22, 24 and 26, the popover place of item 8, and item 14's menus; the rows above say what v6 built.*

**v7, 28 Oct 2026: the toolbar from Rajat's screenshots** ([`#/t-01/network`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/network))

| # | Change | Try it |
|---|---|---|
| v7 1, 2, 8 | Two toolbar rows | Row 1: the type segments, then ⚙ and the HAR split button. Row 2: the search joined to its field (*All ▾*), then the counts |
| v7 3 to 5 | The settings menu | ⚙: *Show waterfall overview* and *Show CONNECT* (a tick while on), *Set slow response limit* with its value (*500ms*), which opens the dialog |
| v7 6 | The hourglass | On *homes* (00:42) and *rum* (01:36), on the slow count and in the settings menu |
| v7 7 | Shorter HAR items | The caret beside Download HAR: *Open in external viewer*, *Download filtered HAR* |
| v7 9, 10 | Errors and slow responses filter | Click ⊗ 2: only the errors show and the count looks pressed; click it again for every request. The same control as All Commands' passed and failed counts |
| v7 11, 12 | The timing popover | Scroll the table right and hover a Waterfall bar: the popover opens just above it, its caret on the bar, Copy timings beside × |
| v7 13 | Fewer menu copies | Right-click a row: Copy link, then cURL, fetch and HAR |
| v7 14 | Header tables copy as tables | Open a request, then Copy response headers (or request headers): paste into a doc or a sheet |
| v7 menus | No grey at rest | Open any menu with the mouse: no item is grey until the pointer is on it. design-context [#19](https://github.com/rajat-lt/design-context/pull/19) records the rule |
| v7 narrow | The toolbar at 1280 × 800 | ⚙ and the HAR split button fold into one ⋯; a time window's token sits beside the search and shortens before anything wraps |

## Review states

| State | Link |
|---|---|
| Failed test, default | [`#/t-01/commands`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/commands) |
| Passed test, no disclosure | [`#/t-02/commands`](https://rajat-lt.github.io/automation-details-prototype/#/t-02/commands) |
| Failure further down | [`#/t-04/commands`](https://rajat-lt.github.io/automation-details-prototype/#/t-04/commands) |
| Video unavailable | [`#/t-07/commands`](https://rajat-lt.github.io/automation-details-prototype/#/t-07/commands) |
| Queued test | [`#/t-12/commands`](https://rajat-lt.github.io/automation-details-prototype/#/t-12/commands) |
| Command list loading | [`?demo=commands-loading`](https://rajat-lt.github.io/automation-details-prototype/?demo=commands-loading#/t-01/commands) |
| Command list error | [`?demo=commands-error`](https://rajat-lt.github.io/automation-details-prototype/?demo=commands-error#/t-01/commands) |
| Tests pane loading | [`?demo=tests-loading`](https://rajat-lt.github.io/automation-details-prototype/?demo=tests-loading#/t-01/commands) |
| Tests pane error | [`?demo=tests-error`](https://rajat-lt.github.io/automation-details-prototype/?demo=tests-error#/t-01/commands) |
| Tests pane empty | [`?demo=tests-empty`](https://rajat-lt.github.io/automation-details-prototype/?demo=tests-empty#/t-01/commands) |
| Video loading | [`?demo=video-loading`](https://rajat-lt.github.io/automation-details-prototype/?demo=video-loading#/t-01/commands) |
| A command's link (v2) | [`#/t-01/commands/c45`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/commands/c45) |
| Network, default (v5) | [`#/t-01/network`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/network) |
| Network capture off | [`#/t-07/network`](https://rajat-lt.github.io/automation-details-prototype/#/t-07/network) |
| Network, queued test | [`#/t-12/network`](https://rajat-lt.github.io/automation-details-prototype/#/t-12/network) |
| Network loading | [`?demo=network-loading`](https://rajat-lt.github.io/automation-details-prototype/?demo=network-loading#/t-01/network) |
| Network error | [`?demo=network-error`](https://rajat-lt.github.io/automation-details-prototype/?demo=network-error#/t-01/network) |
| Network empty | [`?demo=network-empty`](https://rajat-lt.github.io/automation-details-prototype/?demo=network-empty#/t-01/network) |
| A request's link (v6) | [`#/t-01/network/n42`](https://rajat-lt.github.io/automation-details-prototype/#/t-01/network/n42) |
| Bodies not captured (v6) | [`#/t-02/network`](https://rajat-lt.github.io/automation-details-prototype/#/t-02/network) |

Pane sizes (the Network tab's details panel too), the dock position, the Network tab's columns (order and widths), *Show waterfall overview* and slow limit, the code theme, the payload view, the row density, the tab order, the video mode and the floating window's place are remembered in the browser. Renames, deletes, unlinks, comments and payload tabs last until a reload.

## Simulated in this prototype

- **The video** is a replay drawn from the command data: the page under test, the element each command targets (blue when it passes, red when it fails), the text it types. There is no recording behind it.
- **Download video** shows a toast; nothing downloads. **Download logs** saves a real `.log` file.
- **View in HyperExecute**, **Raise a bug**, the test case link and **Upgrade Now** show a toast naming where they lead.
- **Share** copies the page link. **Delete** removes the test until the next reload.
- **Copy payload**, **Copy link** and **Copy table** really copy. **Download screenshot** saves a real PNG of the replay frame. **Unlink** and **Link a Test Case** change nothing outside the page.
- **Picture-in-picture** is a window inside the page, not the browser's own (spec §7b).
- **Comments** are kept in the page until a reload. The one on Create New Session at 0:32 is seeded mock data, by the signed-in user. **Delete Comment** deletes at once, with no confirmation, as the brief asks for now.
- **Payload tabs** are kept per test until a reload.
- **Rotate video** is built for mobile recordings, but every mock test is web: `mock-data.md` has no mobile devices.
- **Network logs** are built from each test's own commands (`src/network-data.js`), with the first page's files, sizes and durations from the v5 screenshots; there is no capture behind them. **Download HAR** saves a real HAR 1.2 file of them, and each test's HAR is also built beside the page (`har/{test}.har`) for the external viewer. The image previews of *whatnew.png* and *favicon.ico* are stand-ins drawn for the mock; which runs captured bodies, and which requests are slow, are mock choices (spec §4g). **Copy as cURL**, **Copy as fetch** and the other request copies really copy.

## How it is built from design-context

- **Tokens:** `scripts/tokens.mjs` reads `data/tokens.json` from design-context's `main` branch and writes `src/tokens.css`. Every variable names its token path, and the script stops if a token is missing. The current file was generated from `main` at `618b4b8` (v5 added the switch tokens). The network phase colours are Chrome DevTools' own, by Rajat's answer of 28 Oct 2026, in `src/devtools-phases.css` with each value's DevTools source.
- **Components:** each one is a look-alike of the private `lt-components` library under its real name, using only props documented in `COMPONENTS.md`, styled from the tokens and used as `guidelines/` says.
- **Layout, copy and data:** `patterns/automation-details.md` is the base. `ux-text-guidelines.md` governs every string. `mock-data.md` supplies the cast, names, formats and IDs, and everything it lacks is listed in the spec's §9.
- **Icons:** lucide-react **1.58.0**, the library `icons.md` names, and only icon names confirmed present in that version. All 81 used: Accessibility, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpDown, Bell, Bot, Braces, Bug, ChartColumn, Check, ChevronDown, ChevronRight, ChevronUp, ChevronsDownUp, ChevronsUpDown, CircleAlert, CircleCheck, CircleHelp, ClipboardList, Clock, Copy, Download, Ellipsis, ExternalLink, Globe, GripHorizontal, History, Hourglass, House, Image, Info, KeyRound, Keyboard, Layers, Link, ListFilter, LocateFixed, Maximize, MessageSquare, MessageSquarePlus, Minimize, Monitor, Moon, PanelBottom, PanelLeft, PanelLeftClose, PanelLeftOpen, PanelRight, PanelRightClose, PanelRightOpen, PanelTop, PanelTopClose, PanelTopOpen, Pause, Pencil, PictureInPicture2, Play, RotateCcw, RotateCwSquare, Rows2, Rows4, ScanEye, Search, Settings, Share2, Smartphone, SquareArrowOutUpRight, SquareTerminal, Sun, Table, TestTubes, Trash2, TriangleAlert, Undo2, Unlink, Workflow, X, Zap, ZoomIn. The platform sidebar's icons are placeholders chosen by intent, since `patterns/platform-sidebar.md` does not name them.

## Run it

```bash
npm install
npm run dev
```

To regenerate the tokens, with a design-context checkout beside this folder (or set `DESIGN_CONTEXT`):

```bash
npm run tokens
```

Build for GitHub Pages with `npm run build`; the site is served from the `gh-pages` branch.

## Files

| Path | What it holds |
|---|---|
| `automation-details.md` | The spec |
| `scripts/tokens.mjs`, `src/tokens.css` | Token generator and its output |
| `src/devtools-phases.css` | The network phase colours, Chrome DevTools' own, with their sources |
| `src/lt.jsx`, `src/overlays.jsx` | The LT component look-alikes (v2 adds `LTPopover`, toast actions, and overlays that follow full screen; v5 adds `LTSwitch`, `LTTabNav` and sorting in `LTTable`; v6 adds `LTToken`, `headerProps` in `LTTable` and `place` in `LTPopover`; v7 adds `CountFilter`, toggle items and values in `LTActionMenu`, `headerActions` in `LTPopover` and `fullText` in `LTToken`) |
| `src/App.jsx` | The page: panes, dock, video modes, dialogs, and the video's side with its payload tabs (v4 item 8) |
| `src/shell.jsx` | Platform sidebar and top bar (`patterns/platform-sidebar.md`, `patterns/topbar.md`) |
| `src/header.jsx` | Title, copy test ID, meta row, actions, remarks (items 1 to 5; v3 items 1, 2; v4 items 3, 4) |
| `src/commands.jsx`, `src/timeline.jsx` | All Commands tab (the timeline's handles also serve the Network tab's overview) (items 6 to 12, 15 to 18; v2 items 2, 3, 4, 7, 9, 10, 16; v3 items 3, 6, 9; v4 items 1, 2, 6, 7, 8, 10, 11), and the payload in a tab (v4 item 8) |
| `src/failure.jsx` | Failure popovers on both time bars (v2 item 8; v3 item 4; v4 item 5) |
| `src/video.jsx`, `src/playback.js` | Replay, controls, picture-in-picture, the shared playhead, wheel seeking (item 9; v2 items 5, 11, 14; v4 item 9) |
| `src/tabbar.jsx` | Tab reordering (v2 item 1), and the media tabs with their More menu (v4 item 8) |
| `src/shortcuts.jsx` | Keyboard shortcuts dialog [proposed] |
| `src/clipboard.js` | Plain and rich copy (v2 item 10) |
| `src/comments.js` | Comments on failed commands, and requests to open one (v3 items 4 and 6) |
| `src/layout.jsx` | Splitters (item 14) |
| `src/tabs.jsx` | Logs, Meta Data, tests pane |
| `src/network.jsx`, `src/network-data.js` | The Network tab (v5, v6, v7) and its mock log, with the HAR export |
| `src/network-overview.jsx` | The overview, its brush, and the zoom and pan shared with the Waterfall column (v6) |
| `src/network-detail.jsx`, `src/network-copy.js` | A request's details, with Preview and the capture state (v6), and its copies: link, cURL, fetch and HAR in the menus; the header tables, the body and the timings in their tabs (v7) |
| `vite.config.js` | Builds each test's HAR beside the page, for the external viewer (v6 item 23) |
| `src/data.js`, `src/format.js` | Mock data, including the nested test cases (v4 item 10), and the `mock-data.md` formats |
