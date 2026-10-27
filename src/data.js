// Mock data. Values come from design-context mock-data.md: the cast, test case
// and test instance names, build names, browser and OS strings, resolutions,
// #TC- IDs and the dundermifflin.com email shape. Every list carries an awkward
// row (40-word name, typo name, a queued test with no duration).
//
// GAP (automation-details.md §9): mock-data.md has nothing for commands, so
// command names follow the W3C WebDriver commands and the brief's screenshots,
// and request IDs, session IDs and test IDs follow screenshot 9's shapes with
// generated values. Annotation names other than the screenshot's are marked.
import { emailFor } from './format.js'

export const NOW = new Date()
const MIN = 60 * 1000, HOUR = 60 * MIN, DAY = 24 * HOUR

/* Seeded RNG so every reload shows the same data. */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hex = (r, n) => Array.from({ length: n }, () => '0123456789abcdef'[Math.floor(r() * 16)]).join('')
const b32 = (r, n) => Array.from({ length: n }, () => 'ABCDEFGHJKMNPQRSTVWXYZ0123456789'[Math.floor(r() * 32)]).join('')

/* ---------------- the build and its tests ---------------- */

export const BUILD = { name: 'Schedule King || 2026-09-03 07:33:26', id: '103558549' }

// The signed-in user: the top bar's avatar (RS), who writes new comments.
export const CURRENT_USER = 'Ritika Sharma'

// mock-data.md § Browser and OS strings, § Device resolutions
const CONFIGS = [
  ['Chrome', '120', 'Windows', '12'], ['Firefox', '144', 'macOS', 'Tahoe'],
  ['Brave', '1.63', 'Windows', '11'], ['Edge', '147', 'macOS', 'Ventura'],
  ['Edge', '150', 'Windows', '10'], ['Opera', '108', 'macOS', 'Golden Gate'],
  ['Chrome', '151', 'macOS', 'Ventura'], ['Safari', '27', 'macOS', 'Sonoma'],
]
const RES = ['1920x1080', '1280x1024', '1024x768', '3840x1600', '1440x900']
const PEOPLE = ['Ritika Sharma', 'Mahendra Damodardas Baahubali', 'Darth Vader', 'Oppenheimer',
  'Mehmed Dracul', 'George Orwell', 'Gabbar Singh', 'Kokushibo']

// Remarks on a test run (v3 item 2). GAP: mock-data.md has no remarks, so
// these are written for the mock: one that runs to several lines, one that
// fits on a line, and none on every other test.
const REMARKS_LONG = 'Fails on Chrome 120 only. The price filter button moved into the Filters drawer in the Oct 03 release, so the Find Element locator needs an update before the rerun. The 0:32 screenshot error is an infrastructure retry and passes on rerun. Checkout and login failures are tracked in #TC-225 and #TC-56345.'
const REMARKS_SHORT = 'Units table loads late on Chrome 151. Rerun before triaging.'

// [name, status, durationSec, config, resolution, person, updated ago (ms), extra]
const ROWS = [
  ['Verify the siteplan shown on Tourbook property page when property has Leasing and Standard siteplan', 'failed', 200, 0, 0, 0, 6 * HOUR + 12 * MIN, { tc: '#TC-88904', remarks: REMARKS_LONG }],
  ['Filter and Verify Product Search Results', 'passed', 74, 1, 0, 2, 6 * HOUR + 40 * MIN],
  ['Attempt Signup and Verify Preferences Screen Persistence', 'passed', 103, 2, 1, 3, 7 * HOUR],
  ['Verify the building specification and Units details table on properties details page with source data', 'failed', 151, 6, 0, 1, 7 * HOUR + 25 * MIN, { deepFailure: true, remarks: REMARKS_SHORT }],
  ['Complete Purchase Using Gift Card and Credit Card', 'passed', 96, 3, 4, 4, 8 * HOUR],
  ['Verify account lock after multiple failed login attempts', 'passed', 48, 0, 0, 5, 8 * HOUR + 30 * MIN],
  ['Paste the shadow and non-shadow propeties in properties filter and verify the diplayed properties', 'failed', 83, 4, 3, 6, 9 * HOUR, { noVideo: true }],
  ['Verify OTP expiry after 60 seconds on the login screen', 'passed', 71, 7, 4, 7, 10 * HOUR],
  ['Validate cart total after applying two coupon codes', 'passed', 59, 5, 1, 0, 11 * HOUR],
  ['Check invoice download in both PDF and CSV formats', 'failed', 64, 1, 2, 2, 12 * HOUR],
  ['Verify session timeout redirects to login with the return URL preserved', 'passed', 112, 0, 0, 3, 13 * HOUR],
  ['Validate bulk upload of 500 records shows progress and a summary', 'queued', 0, 2, 0, 4, 13 * HOUR + 20 * MIN],
  ['Verify dark mode persists across page reloads and new tabs', 'passed', 41, 6, 0, 5, 14 * HOUR],
  ['Check filter chips clear individually and via Clear all', 'passed', 37, 3, 4, 6, 15 * HOUR],
  ['Filter and Verify Product Search Results', 'passed', 81, 7, 4, 1, 16 * HOUR],
  ['Verify account lock after multiple failed login attempts', 'failed', 55, 2, 1, 0, 1 * DAY + 2 * HOUR],
  ['Complete Purchase Using Gift Card and Credit Card', 'passed', 104, 0, 3, 7, 2 * DAY],
  ['Attempt Signup and Verify Preferences Screen Persistence', 'passed', 99, 4, 0, 2, 4 * DAY],
]

export const TESTS = ROWS.map(([name, status, dur, cfg, res, person, ago, extra = {}], i) => {
  const r = rng(1000 + i)
  const [browser, browserVersion, os, osVersion] = CONFIGS[cfg]
  const user = PEOPLE[person]
  return {
    id: `t-${String(i + 1).padStart(2, '0')}`,
    name, status, durationSec: dur,
    browser, browserVersion, os, osVersion,
    resolution: RES[res],
    framework: 'Selenium',
    tunnel: i % 3 !== 2,
    testCaseId: extra.tc ?? `#TC-${Math.floor(r() * 99999) + 1}`,
    updatedAt: new Date(NOW - ago),
    updatedBy: user,
    updatedByEmail: emailFor(user),
    video: status !== 'queued' && !extra.noVideo,
    deepFailure: !!extra.deepFailure,
    remarks: extra.remarks ?? null,
    // Web or mobile automation. Rotate video is for mobile only (v3 item 10).
    // GAP: mock-data.md has no mobile devices, so every mock test is web.
    platform: 'web',
    testId: hex(r, 32), // GAP: no automation test ID format in mock-data.md
  }
})

/* ---------------- commands ---------------- */

// Command → W3C WebDriver endpoint. GAP: mock-data.md has no command names.
const ENDPOINT = {
  'Create New Session': ['POST', '/wd/hub/session'],
  'Set Timeouts': ['POST', '/timeouts'],
  'Maximize Window': ['POST', '/window/maximize'],
  'Navigate To': ['POST', '/url'],
  'Get Title': ['GET', '/title'],
  'Get Current URL': ['GET', '/url'],
  'Find Element': ['POST', '/element'],
  'Find Elements': ['POST', '/elements'],
  'Click Element': ['POST', '/element/{el}/click'],
  'Send Keys To Element': ['POST', '/element/{el}/value'],
  'Get Element Text': ['GET', '/element/{el}/text'],
  'Get Element Attribute': ['GET', '/element/{el}/attribute/{name}'],
  'Is Element Displayed': ['GET', '/element/{el}/displayed'],
  'Execute Script': ['POST', '/execute/sync'],
  'Take Screenshot': ['GET', '/screenshot'],
  'Delete Session': ['DELETE', ''],
}

const STATUS_TEXT = { 200: 'OK', 400: 'Bad Request', 404: 'Not Found', 500: 'Internal Server Error' }
export const statusLabel = code => `${code} ${STATUS_TEXT[code]}`

// W3C WebDriver error codes (public spec), by failure kind.
const FAILURES = {
  noSuchElement: (c) => [404, { error: 'no such element', message: `Unable to locate element: ${c.value}` }],
  intercepted: () => [400, { error: 'element click intercepted', message: 'Element <button id="reserve-button"> is not clickable at point (842, 611). Other element would receive the click: <div class="modal-backdrop">' }],
  server: () => [500, { error: 'unknown error', message: 'Internal Server Error' }],
}

/*
 * The default test, hand-written to match the brief's screenshots:
 * 93 commands, 73 passed and 20 failed, over 3:20 (screenshot 6 counts and
 * axis); failure clusters at 1:16-1:22, 1:56-2:00 and 2:21 (screenshot 6
 * segments); "Open https://www.airbnb.com" holding Find Element / accessibility-id
 * / urlBox at 00:18 and the failed Create New Session / xpath at 00:32
 * (screenshot 7); a 20-command passed run ("Show 20 passed logs", the brief).
 * Columns: name, at (s), ms, strategy, value, extras.
 *
 * v4 item 10: a test case can hold a test case, two levels at most. A nested
 * one is an object among its parent's rows. #TC-7742 holds #TC-8 in its
 * middle (the price filter failures), so the parent goes on after the child
 * ends; #TC-56345 holds #TC-4410 at its very end, so both end on the same
 * command. Child names come from mock-data.md's test-case-shaped titles.
 */
const T01 = [
  { top: true, rows: [
    ['Create New Session', 0, 2400, null, null, { page: 'blank' }],
    ['Set Timeouts', 2.6, 14, null, null, { page: 'blank' }],
    ['Maximize Window', 2.8, 180, null, null, { page: 'blank' }],
  ] },
  { kind: 'annotation', title: 'Open https://www.airbnb.com', page: 'home', rows: [
    ['Navigate To', 5.2, 1800, null, 'https://www.airbnb.com', { url: 'https://www.airbnb.com' }],
    ['Find Element', 18, 20, 'accessibility-id', 'urlBox', { target: 'address' }],
    ['Get Title', 24.4, 40],
    ['Create New Session', 32, 400, 'xpath', '/Users/ltadmin/Documents/appium/builds/app-release.zip', { fail: 'server', path: '/screenshot' }],
  ] },
  { kind: 'testCase', tc: '#TC-7742', title: 'Filter and Verify Product Search Results', page: 'search', rows: [
    ['Find Element', 36, 32, 'css selector', "[data-testid='structured-search-input-field-query']", { target: 'search' }],
    ['Click Element', 37.1, 120, null, null, { target: 'search' }],
    ['Send Keys To Element', 38, 260, null, 'Goa', { target: 'search', typed: 'Goa' }],
    ['Find Element', 41.5, 18, 'css selector', "button[type='submit']", { target: 'submit' }],
    ['Click Element', 42.2, 140, null, null, { target: 'submit' }],
    ['Get Current URL', 46, 12],
    ['Find Elements', 50.3, 64, 'css selector', "[itemprop='itemListElement']", { target: 'results' }],
    ['Is Element Displayed', 55, 22, null, null, { target: 'results' }],
    ['Execute Script', 61.4, 30, null, 'window.scrollBy(0, 640)'],
    ['Get Element Text', 68.2, 26, null, null, { target: 'results' }],
    { kind: 'testCase', tc: '#TC-8', title: 'Check filter chips clear individually and via Clear all', rows: [
      ...[76, 76.8, 77.6, 78.4, 79.2, 80, 80.8, 81.6].map(t =>
        ['Find Element', t, 500, 'css selector', "[data-testid='price-filter-button']", { target: 'price', fail: 'noSuchElement' }]),
      ['Take Screenshot', 84, 380],
    ] },
    ['Get Current URL', 88.5, 10],
  ] },
  { top: true, page: 'search', rows: [
    ['Execute Script', 91, 26, null, 'window.scrollTo(0, 0)'],
    ['Get Title', 92.4, 38],
  ] },
  { kind: 'testCase', tc: '#TC-225', title: 'Complete Purchase Using Gift Card and Credit Card', page: 'checkout', rows: [
    ['Navigate To', 94, 1500, null, 'https://www.airbnb.com/book/stays', { url: 'https://www.airbnb.com/book/stays' }],
    ['Find Element', 96.2, 20, 'id', 'checkout-form', { target: 'form' }],
    ['Find Element', 97, 18, 'id', 'gift-card-code', { target: 'gift' }],
    ['Send Keys To Element', 97.6, 210, null, 'LTGIFT2026', { target: 'gift', typed: 'LTGIFT2026' }],
    ['Find Element', 99.8, 16, 'id', 'apply-gift-card', { target: 'apply' }],
    ['Click Element', 100.3, 150, null, null, { target: 'apply' }],
    ['Get Element Text', 101.9, 24, null, null, { target: 'gift' }],
    ['Find Element', 103.5, 22, 'id', 'card-number', { target: 'card' }],
    ['Send Keys To Element', 104.1, 300, null, '4242 4242 4242 4242', { target: 'card', typed: '4242 4242 4242 4242' }],
    ['Find Element', 106, 19, 'id', 'card-expiry', { target: 'expiry' }],
    ['Send Keys To Element', 106.5, 120, null, '12 / 29', { target: 'expiry', typed: '12 / 29' }],
    ['Find Element', 108.2, 17, 'id', 'card-cvc', { target: 'cvc' }],
    ['Send Keys To Element', 108.7, 90, null, '123', { target: 'cvc', typed: '123' }],
    ['Find Element', 110.4, 18, 'id', 'billing-zip', { target: 'zip' }],
    ['Send Keys To Element', 110.9, 110, null, '560001', { target: 'zip', typed: '560001' }],
    ['Execute Script', 112.6, 28, null, 'document.activeElement.blur()'],
    ['Take Screenshot', 113.4, 420],
    ['Find Element', 114.6, 21, 'id', 'reserve-button', { target: 'reserve' }],
    ['Is Element Displayed', 115, 20, null, null, { target: 'reserve' }],
    ['Get Element Attribute', 115.4, 18, null, 'disabled', { target: 'reserve' }],
    ...[116, 116.6, 117.2, 117.8, 118.4, 119, 119.6].map(t =>
      ['Click Element', t, 120, null, null, { target: 'reserve', fail: 'intercepted', backdrop: true }]),
    ['Take Screenshot', 121.5, 400, null, null, { backdrop: true }],
    ['Find Element', 124, 20, 'css selector', '.modal-backdrop', { target: 'modal', backdrop: true }],
    ['Get Element Text', 126.2, 30, null, null, { target: 'modal', backdrop: true }],
  ] },
  { kind: 'testCase', tc: '#TC-56345', title: 'Verify account lock after multiple failed login attempts', page: 'login', rows: [
    ['Navigate To', 130, 1200, null, 'https://www.airbnb.com/login', { url: 'https://www.airbnb.com/login' }],
    ['Find Element', 132, 18, 'id', 'email-login-email', { target: 'email' }],
    ['Send Keys To Element', 132.6, 380, null, 'ritika.sharma@dundermifflin.com', { target: 'email', typed: 'ritika.sharma@dundermifflin.com' }],
    ['Find Element', 135, 16, 'id', 'password', { target: 'password' }],
    ['Send Keys To Element', 135.5, 160, null, '********', { target: 'password', typed: '********' }],
    ['Click Element', 138, 160, null, null, { target: 'login' }],
    ...[141.2, 141.5, 141.8, 142.1].map(t => ['Take Screenshot', t, 240, null, null, { fail: 'server', lockError: true }]),
    { kind: 'testCase', tc: '#TC-4410', title: 'Verify session timeout redirects to login with the return URL preserved', rows: [
      ['Get Element Text', 144, 26, 'css selector', '.login-error', { target: 'error', lockError: true }],
      ['Is Element Displayed', 146.5, 20, null, null, { target: 'error', lockError: true }],
      ['Get Current URL', 148, 11, null, null, { lockError: true }],
      ['Get Title', 150.2, 36, null, null, { lockError: true }],
    ] },
  ] },
  // Annotation name invented for the mock (GAP), echoing the test's own name.
  { kind: 'annotation', title: 'Verify the siteplan on the property page', page: 'listing', rows: [
    ['Navigate To', 154, 1600, null, 'https://www.airbnb.com/rooms/plus', { url: 'https://www.airbnb.com/rooms/plus' }],
    ['Find Element', 157, 22, 'css selector', "[data-section-id='SITEPLAN']", { target: 'siteplan' }],
    ['Execute Script', 158, 34, null, 'arguments[0].scrollIntoView()', { target: 'siteplan' }],
    ['Is Element Displayed', 160.2, 18, null, null, { target: 'siteplan' }],
    ['Find Element', 162.4, 20, 'xpath', "//img[@alt='Leasing siteplan']", { target: 'siteplan' }],
    ['Get Element Attribute', 163, 16, null, 'src', { target: 'siteplan' }],
    ['Click Element', 165.6, 130, null, null, { target: 'tabLeasing' }],
    ['Take Screenshot', 167, 410],
    ['Find Element', 170.2, 19, 'xpath', "//button[text()='Standard']", { target: 'tabStandard' }],
    ['Click Element', 171, 125, null, null, { target: 'tabStandard', standard: true }],
    ['Find Element', 173.4, 21, 'xpath', "//img[@alt='Standard siteplan']", { target: 'siteplan', standard: true }],
    ['Is Element Displayed', 174, 17, null, null, { target: 'siteplan', standard: true }],
    ['Take Screenshot', 176.5, 395, null, null, { standard: true }],
    ['Find Element', 180, 23, 'css selector', "[data-testid='units-table']", { target: 'units', standard: true }],
    ['Get Element Text', 181.2, 28, null, null, { target: 'units', standard: true }],
    ['Find Elements', 185, 41, 'css selector', "[data-testid='units-table'] tr", { target: 'units', standard: true }],
    ['Get Title', 190, 35, null, null, { standard: true }],
  ] },
  { top: true, page: 'listing', rows: [
    ['Take Screenshot', 194, 400, null, null, { standard: true }],
    ['Get Current URL', 196.5, 12, null, null, { standard: true }],
    ['Delete Session', 198, 900, null, null, { standard: true, page: 'blank' }],
  ] },
]

/* Flows for the other tests. GAP: invented annotation names, per the note above. */
const FLOWS = [
  { kind: 'annotation', title: 'Open the home page', page: 'home', rows: [
    ['Navigate To', 0, 1700, null, 'https://www.airbnb.com', { url: 'https://www.airbnb.com' }],
    ['Find Element', 0, 20, 'accessibility-id', 'urlBox', { target: 'address' }],
    ['Get Title', 0, 38],
  ] },
  { kind: 'testCase', title: 'Filter and Verify Product Search Results', page: 'search', fail: ['Find Element', 'css selector', "[data-testid='price-filter-button']", 'noSuchElement', 'price'], rows: [
    ['Find Element', 0, 30, 'css selector', "[data-testid='structured-search-input-field-query']", { target: 'search' }],
    ['Send Keys To Element', 0, 240, null, 'Goa', { target: 'search', typed: 'Goa' }],
    ['Click Element', 0, 130, null, null, { target: 'submit' }],
    ['Find Elements', 0, 60, 'css selector', "[itemprop='itemListElement']", { target: 'results' }],
    ['Is Element Displayed', 0, 20, null, null, { target: 'results' }],
    ['Get Element Text', 0, 24, null, null, { target: 'results' }],
  ] },
  { kind: 'testCase', title: 'Complete Purchase Using Gift Card and Credit Card', page: 'checkout', fail: ['Click Element', null, null, 'intercepted', 'reserve'], rows: [
    ['Find Element', 0, 20, 'id', 'gift-card-code', { target: 'gift' }],
    ['Send Keys To Element', 0, 200, null, 'LTGIFT2026', { target: 'gift', typed: 'LTGIFT2026' }],
    ['Find Element', 0, 22, 'id', 'card-number', { target: 'card' }],
    ['Send Keys To Element', 0, 300, null, '4242 4242 4242 4242', { target: 'card', typed: '4242 4242 4242 4242' }],
    ['Find Element', 0, 21, 'id', 'reserve-button', { target: 'reserve' }],
    ['Click Element', 0, 140, null, null, { target: 'reserve' }],
    ['Take Screenshot', 0, 410],
  ] },
  { kind: 'annotation', title: 'Log in as a returning guest', page: 'login', fail: ['Take Screenshot', null, null, 'server', null], rows: [
    ['Navigate To', 0, 1200, null, 'https://www.airbnb.com/login', { url: 'https://www.airbnb.com/login' }],
    ['Find Element', 0, 18, 'id', 'email-login-email', { target: 'email' }],
    ['Send Keys To Element', 0, 380, null, 'ritika.sharma@dundermifflin.com', { target: 'email', typed: 'ritika.sharma@dundermifflin.com' }],
    ['Find Element', 0, 16, 'id', 'password', { target: 'password' }],
    ['Send Keys To Element', 0, 150, null, '********', { target: 'password', typed: '********' }],
    ['Click Element', 0, 160, null, null, { target: 'login' }],
    ['Get Current URL', 0, 11],
  ] },
  { kind: 'testCase', title: 'Verify the building specification and Units details table on properties details page with source data', page: 'listing', fail: ['Find Element', 'css selector', "[data-testid='units-table']", 'noSuchElement', 'units'], rows: [
    ['Navigate To', 0, 1500, null, 'https://www.airbnb.com/rooms/plus', { url: 'https://www.airbnb.com/rooms/plus' }],
    ['Find Element', 0, 22, 'css selector', "[data-section-id='SITEPLAN']", { target: 'siteplan' }],
    ['Execute Script', 0, 30, null, 'arguments[0].scrollIntoView()', { target: 'siteplan' }],
    ['Is Element Displayed', 0, 18, null, null, { target: 'siteplan' }],
    ['Find Element', 0, 23, 'css selector', "[data-testid='units-table']", { target: 'units' }],
    ['Get Element Text', 0, 28, null, null, { target: 'units' }],
    ['Take Screenshot', 0, 400],
  ] },
]

function platformCode(t) {
  if (t.os === 'Windows') return `WIN${t.osVersion}`
  return 'MAC'
}

function buildRequest(cmd, t, sessionId, r, startNs) {
  const [method, path0] = ENDPOINT[cmd.name] ?? ['POST', '/']
  const el = hex(r, 8) + '-' + hex(r, 4) + '-' + hex(r, 4)
  let path = cmd.name === 'Create New Session' && !cmd.path ? path0
    : `/wd/hub/session/${sessionId}${cmd.path ?? path0}`
  path = path.replace('{el}', el).replace('{name}', cmd.value ?? 'value')
  let body = ''
  if (cmd.name === 'Navigate To') body = { url: cmd.value }
  else if (cmd.name === 'Find Element' || cmd.name === 'Find Elements') body = { using: cmd.strategy, value: cmd.value }
  else if (cmd.name === 'Send Keys To Element') body = { text: cmd.value }
  else if (cmd.name === 'Execute Script') body = { script: cmd.value, args: [] }
  else if (cmd.name === 'Create New Session' && !cmd.path) body = { capabilities: { alwaysMatch: { browserName: t.browser, browserVersion: t.browserVersion, platformName: `${t.os} ${t.osVersion}` } } }
  else if (cmd.name === 'Set Timeouts') body = { implicit: 0, pageLoad: 300000, script: 30000 }
  return {
    requestId: `LT01${b32(r, 26)}-${platformCode(t)}-DYNAMIC-SPOT-3-V1_${String(Math.floor(r() * 900000) + 100000)}-US-EAST-1`,
    requestStartTime: startNs + Math.round(cmd.at * 1e9),
    requestMethod: method,
    requestPath: path,
    duration: cmd.ms,
    requestBody: body === '' ? '' : JSON.stringify(body),
  }
}

function buildResponse(cmd, sessionId) {
  if (cmd.status === 'failed') {
    const [code, value] = FAILURES[cmd.fail](cmd)
    return { responseStatus: code, responseBody: JSON.stringify({ value }) }
  }
  let value = null
  if (cmd.name === 'Create New Session') value = { sessionId, capabilities: { acceptInsecureCerts: false } }
  else if (cmd.name === 'Get Title') value = 'Holiday rentals, cabins, beach houses and more'
  else if (cmd.name === 'Get Current URL') value = cmd.url ?? 'https://www.airbnb.com/s/Goa/homes'
  else if (cmd.name === 'Find Element') value = { 'element-6066-11e4-a52e-4f735466cecf': hex(rng(cmd.idx), 8) }
  else if (cmd.name === 'Find Elements') value = [1, 2, 3].map(i => ({ 'element-6066-11e4-a52e-4f735466cecf': hex(rng(cmd.idx + i), 8) }))
  else if (cmd.name === 'Is Element Displayed') value = true
  else if (cmd.name === 'Get Element Text') value = cmd.lockError ? 'Too many attempts. Try again in 15 minutes.' : (cmd.target === 'units' ? '12 units' : 'Gift card applied')
  else if (cmd.name === 'Get Element Attribute') value = cmd.value === 'src' ? 'siteplan-leasing.png' : null
  else if (cmd.name === 'Take Screenshot') value = 'iVBORw0KGgoAAAANSUhEUgAA…'
  return { responseStatus: 200, responseBody: JSON.stringify({ value }) }
}

function row([name, at, ms, strategy, value, extra = {}], defaults) {
  return { name, at, ms, strategy: strategy ?? null, value: value ?? null, ...defaults, ...extra }
}

/** Builds the command tree for one test. Memoized: details never change. */
const cache = new Map()
export function getDetail(testId) {
  if (cache.has(testId)) return cache.get(testId)
  const t = TESTS.find(x => x.id === testId)
  if (!t) return null
  const r = rng(parseInt(testId.slice(2), 10) * 7919)
  const sessionId = hex(r, 32)
  const startNs = (t.updatedAt.getTime() - t.durationSec * 1000) * 1e6

  let blocks
  if (t.status === 'queued') blocks = []
  else if (t.id === 't-01') blocks = T01
  else blocks = generic(t, r)

  // A group's `items` are its direct children in order: commands as
  // { type: 'command', cmd } and nested groups. `children` are every command
  // inside it, nested ones included, for its counts. A command's `path` is
  // its groups from the outermost in; `parentId` is the innermost.
  const commands = []
  const tree = []
  const groups = []
  const makeGroup = (b, id, parent) => {
    const g = { type: 'group', id, kind: b.kind, tc: b.tc ?? null, title: b.title, items: [], children: [],
      depth: parent ? parent.depth + 1 : 0, parentId: parent?.id ?? null }
    groups.push(g) // outer before inner, in screen order
    return g
  }
  const addRows = (rows, group, page, path) => rows.forEach((spec, i) => {
    if (!Array.isArray(spec)) {
      const child = makeGroup(spec, `${group.id}-${i}`, group)
      addRows(spec.rows, child, spec.page ?? page, [...path, child.id])
      group.items.push(child)
      group.children.push(...child.children)
      return
    }
    const cmd = row(spec, { page })
    cmd.idx = commands.length
    cmd.id = `c${cmd.idx}`
    cmd.status = cmd.fail ? 'failed' : 'passed'
    cmd.parentId = group?.id ?? null
    cmd.path = path
    cmd.request = buildRequest(cmd, t, sessionId, r, startNs)
    cmd.response = buildResponse(cmd, sessionId)
    commands.push(cmd)
    if (group) { group.items.push({ type: 'command', cmd }); group.children.push(cmd) }
    else tree.push({ type: 'command', cmd })
  })
  for (const [bi, b] of blocks.entries()) {
    if (b.top) { addRows(b.rows, null, b.page ?? 'blank', []); continue }
    const g = makeGroup(b, `g${bi}`, null)
    addRows(b.rows, g, b.page ?? 'blank', [g.id])
    tree.push(g)
  }

  const failed = commands.filter(c => c.status === 'failed')
  const detail = {
    test: t,
    sessionId,
    commands,
    tree,
    groups,
    failed,
    passedCount: commands.length - failed.length,
    failedCount: failed.length,
    durationSec: t.durationSec,
  }
  cache.set(testId, detail)
  return detail
}

/* Spreads a set of flows over the test's duration; failed tests get 1 to 3
   failing retries in one flow (two flows in the deep-failure case). */
function generic(t, r) {
  const n = 3 + Math.floor(r() * 3)
  const start = Math.floor(r() * FLOWS.length)
  const picked = Array.from({ length: n }, (_, i) => FLOWS[(start + i) % FLOWS.length])
  const failAt = t.status === 'failed'
    ? new Set(t.deepFailure ? [n - 2, n - 1] : [1 + Math.floor(r() * (n - 1))])
    : new Set()

  const blocks = [{ top: true, rows: [
    ['Create New Session', 0, 2100, null, null, { page: 'blank' }],
    ['Set Timeouts', 0, 12, null, null, { page: 'blank' }],
  ] }]
  picked.forEach((f, i) => {
    let rows = f.rows.map(x => [...x])
    if (t.deepFailure) rows = [...rows, ...rows.map(x => [...x])] // longer runs before the failure
    if (failAt.has(i) && f.fail) {
      const [name, strategy, value, kind, target] = f.fail
      const tries = 1 + Math.floor(r() * 3)
      const at = Math.max(1, rows.length - 2)
      rows.splice(at, 0, ...Array.from({ length: tries }, () =>
        [name, 0, kind === 'intercepted' ? 120 : 480, strategy, value, { target, fail: kind, backdrop: kind === 'intercepted' }]))
    }
    const tc = f.kind === 'testCase' ? `#TC-${Math.floor(r() * 99999) + 1}` : null
    blocks.push({ kind: f.kind, tc, title: f.title, page: f.page, rows })
  })
  blocks.push({ top: true, rows: [['Delete Session', 0, 850, null, null, { page: 'blank' }]] })

  // Lay commands out over the duration, in order.
  const all = blocks.flatMap(b => b.rows)
  const span = Math.max(10, t.durationSec - 3)
  all.forEach((x, i) => { x[1] = +(i === 0 ? 0 : 1 + (i / (all.length - 1)) * span).toFixed(1) })
  return blocks
}

/**
 * Failure segments for the timelines: failures within `gap` seconds merge into
 * one. 2 seconds at the whole run; a zoomed timeline passes a gap scaled to
 * its window, so the merge stays the same on screen and retries separate.
 */
export function failureSegments(failed, gap = 2) {
  const segs = []
  for (const c of failed) {
    const end = c.at + c.ms / 1000
    const last = segs[segs.length - 1]
    if (last && c.at - last.end <= gap) { last.end = Math.max(last.end, end); last.ids.push(c.id) }
    else segs.push({ start: c.at, end, ids: [c.id] })
  }
  return segs
}

/** "Copy payload" (v2 items 2 and 6): the request and the response, as one JSON. */
export function payloadText(cmd) {
  const parse = s => { try { return JSON.parse(s) } catch { return s } }
  return JSON.stringify({
    request: { ...cmd.request, requestBody: cmd.request.requestBody ? parse(cmd.request.requestBody) : '' },
    response: { responseStatus: cmd.response.responseStatus, responseBody: parse(cmd.response.responseBody) },
  }, null, 2)
}

/** A command's deep link in this test run (v2 item 2): `#/{test}/commands/{command}`. */
export function commandHref(testId, cmdId) {
  return `${window.location.origin}${window.location.pathname}#/${testId}/commands/${cmdId}`
}

/** The command playing at time t: the last one that started at or before t. */
export function commandAt(commands, t) {
  let hit = null
  for (const c of commands) { if (c.at <= t + 1e-6) hit = c; else break }
  return hit
}

/** Mock execution history for "View history". GAP: no history format. */
export function historyFor(test) {
  const r = rng(test.name.length * 31)
  const builds = ['Schedule King || 2026-09-03 07:33:26', 'shell-entry-repro-1785646201', '8338d2e4-f880-4bfb-96dd-8767c347e7eb']
  // The first row is this run, so it repeats the header's facts.
  return Array.from({ length: 6 }, (_, i) => (i === 0 ? {
    id: 'h0', status: test.status, build: BUILD.name, at: test.updatedAt,
    durationSec: test.durationSec, by: test.updatedBy,
  } : {
    id: `h${i}`,
    status: r() < 0.3 ? 'failed' : 'passed',
    build: builds[i % builds.length],
    at: new Date(test.updatedAt - i * (DAY + Math.floor(r() * 6) * HOUR)),
    durationSec: Math.max(20, Math.round(test.durationSec * (0.8 + r() * 0.4)) || 60),
    by: PEOPLE[Math.floor(r() * PEOPLE.length)],
  }))
}

/* v5: network capture is on for every test but one, which keeps the
   "capture is off" state reachable (the failed test without a video). */
const NETWORK_OFF = new Set(['t-07'])
export const networkOn = t => !NETWORK_OFF.has(t.id)

/** Capabilities for the Meta Data tab: LambdaTest W3C `LT:Options` keys. */
export function capabilitiesFor(t) {
  return [
    ['browserName', t.browser], ['browserVersion', t.browserVersion],
    ['platformName', `${t.os} ${t.osVersion}`], ['resolution', t.resolution],
    ['build', BUILD.name], ['name', t.name],
    ['tunnel', String(t.tunnel)], ['network', String(networkOn(t))], ['console', 'true'],
    ['video', String(t.video)],
  ]
}
