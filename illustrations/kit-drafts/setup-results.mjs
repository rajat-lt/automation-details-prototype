// Draft: the setup step "Loading your results" in the automation details page's setup state
// (lambdatest/automation-details, 30 Oct 2026). r107's bar chart with its tooltip over the tallest
// bar. In the page the bars rise from the baseline one after another and the tooltip appears,
// whenever the step moves on, then all rest. Each bar is its own group. The one accent: the
// tallest bar, the one the tooltip points at, drawn as an accent outline (accentLine) of r107's
// solid bar; solid, it took 0.285 of the ink, over the 0.15 cap.
import { place } from '../../../scripts/lib/house.mjs';
import { part } from '../_setup-lib.mjs';

const S = 0.46;
const C = [300, 250];
const bars = [[4], [5, 6], [7], [3], [8], [9]]; // left to right; layer 6 is a mark at bar 2's foot

export default {
  title: 'A bar chart filling in',
  kind: 'spot',
  items: [
    ...bars.map((layers, n) => place(part('bar-chart-r107', { pick: layers, accentLine: [3] }), { x: C[0], y: C[1], s: S, id: `bar-${n + 1}` })),
    place(part('bar-chart-r107', { pick: [2] }), { x: C[0], y: C[1], s: S, id: 'tooltip' }),
  ],
};
