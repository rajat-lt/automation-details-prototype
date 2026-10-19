# Automation test details · prototype

A working prototype of LambdaTest's automation test details page with Rajat's 18 UX changes of 16 Oct 2026, his 16 more of 17 Oct 2026 (v2), 11 more of 18 Oct 2026 (v3) and 12 more of 19 Oct 2026 (v4), built from the `design-context` repo: its tokens, component names and props, guidelines, page patterns, text guide and mock data.

**Live:** https://rajat-lt.github.io/automation-details-prototype/

**Spec:** [`automation-details.md`](automation-details.md), in the `design-context/patterns/` house format. It maps each change to components, and records every conflict between the brief, the guidelines and the screenshots (§6), the design decisions (§7), the copy (§8), the gaps found in design-context (§9), and the open questions (§10). v2 adds §3b, §4b and §7b, conflicts C20 to C28, and Rajat's answers; v3 adds §4c and §7c and conflicts C29 to C33; v4 adds §3c, §4d and §7d and conflicts C34 to C39.

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

Pane sizes, the dock position, the code theme, the payload view, the row density, the tab order, the video mode and the floating window's place are remembered in the browser. Renames, deletes, unlinks, comments and payload tabs last until a reload.

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

## How it is built from design-context

- **Tokens:** `scripts/tokens.mjs` reads `data/tokens.json` from design-context's `main` branch and writes `src/tokens.css`. Every variable names its token path, and the script stops if a token is missing. The current file was generated from `main` at `e014a73`.
- **Components:** each one is a look-alike of the private `lt-components` library under its real name, using only props documented in `COMPONENTS.md`, styled from the tokens and used as `guidelines/` says.
- **Layout, copy and data:** `patterns/automation-details.md` is the base. `ux-text-guidelines.md` governs every string. `mock-data.md` supplies the cast, names, formats and IDs, and everything it lacks is listed in the spec's §9.
- **Icons:** lucide-react **1.58.0**, the library `icons.md` names, and only icon names confirmed present in that version. All 76 used: Accessibility, ArrowLeft, ArrowRight, Bell, Bot, Braces, Bug, ChartColumn, Check, ChevronDown, ChevronRight, ChevronUp, ChevronsDownUp, ChevronsUpDown, CircleAlert, CircleCheck, CircleHelp, ClipboardList, Clock, Copy, Download, Ellipsis, Globe, GripHorizontal, History, House, Image, Info, KeyRound, Keyboard, Layers, Link, ListFilter, LocateFixed, Maximize, MessageSquare, MessageSquarePlus, Minimize, Monitor, Moon, PanelBottom, PanelLeft, PanelLeftClose, PanelLeftOpen, PanelRight, PanelRightClose, PanelRightOpen, PanelTop, PanelTopClose, PanelTopOpen, Pause, Pencil, PictureInPicture2, Play, RotateCcw, RotateCwSquare, Rows2, Rows4, ScanEye, Search, Settings, Share2, Smartphone, SquareArrowOutUpRight, SquareTerminal, Sun, Table, TestTubes, Trash2, TriangleAlert, Undo2, Unlink, Workflow, X, Zap, ZoomIn. The platform sidebar's icons are placeholders chosen by intent, since `patterns/platform-sidebar.md` does not name them.

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
| `src/lt.jsx`, `src/overlays.jsx` | The LT component look-alikes (v2 adds `LTPopover`, toast actions, and overlays that follow full screen) |
| `src/App.jsx` | The page: panes, dock, video modes, dialogs, and the video's side with its payload tabs (v4 item 8) |
| `src/shell.jsx` | Platform sidebar and top bar (`patterns/platform-sidebar.md`, `patterns/topbar.md`) |
| `src/header.jsx` | Title, copy test ID, meta row, actions, remarks (items 1 to 5; v3 items 1, 2; v4 items 3, 4) |
| `src/commands.jsx`, `src/timeline.jsx` | All Commands tab (items 6 to 12, 15 to 18; v2 items 2, 3, 4, 7, 9, 10, 16; v3 items 3, 6, 9; v4 items 1, 2, 6, 7, 8, 10, 11), and the payload in a tab (v4 item 8) |
| `src/failure.jsx` | Failure popovers on both time bars (v2 item 8; v3 item 4; v4 item 5) |
| `src/video.jsx`, `src/playback.js` | Replay, controls, picture-in-picture, the shared playhead, wheel seeking (item 9; v2 items 5, 11, 14; v4 item 9) |
| `src/tabbar.jsx` | Tab reordering (v2 item 1), and the media tabs with their More menu (v4 item 8) |
| `src/shortcuts.jsx` | Keyboard shortcuts dialog [proposed] |
| `src/clipboard.js` | Plain and rich copy (v2 item 10) |
| `src/comments.js` | Comments on failed commands, and requests to open one (v3 items 4 and 6) |
| `src/layout.jsx` | Splitters (item 14) |
| `src/tabs.jsx` | Logs, Network, Meta Data, tests pane |
| `src/data.js`, `src/format.js` | Mock data, including the nested test cases (v4 item 10), and the `mock-data.md` formats |
