// Draft: the setup step "Running your test" in the automation details page's setup state
// (lambdatest/automation-details, 30 Oct 2026). r97's flask on its stand over the burner: a test
// that is running. In the page the bubbles rise and fade for a few seconds whenever the step moves
// on, then rest where r97 drew them; the flame flickers. Each bubble and the flame are their own groups. The one accent: the burner's
// flame (it is what keeps the test going); the liquid in accent would pass the 0.15 cap.
import { place } from '../../../scripts/lib/house.mjs';
import { part, data } from '../_setup-lib.mjs';

const S = 0.84;
const C = [300, 250];
const d = data('flask-r97');
const bubbles = d.layers.map((L, i) => (L.tag === 'bubbles' ? i : -1)).filter((i) => i >= 0);
const body = d.layers.map((L, i) => (!L.tag && !L.silhouette ? i : -1)).filter((i) => i >= 0);
const paperWithout = d.layers.findIndex((L) => L.silhouette && (L.without || []).join('+') === 'bubbles');

export default {
  title: 'A flask bubbling over a burner',
  kind: 'spot',
  items: [
    place(part('flask-r97', { pick: [paperWithout, ...body.filter((i) => i !== 5)] }), { x: C[0], y: C[1], s: S, id: 'flask' }),
    // The flame (layer 5, a solid) in its own group, so it can flicker; drawn after the flask, as the lift's order puts it over the stand's back.
    place(part('flask-r97', { pick: [5], accent: [5] }), { x: C[0], y: C[1], s: S, id: 'flame' }),
    ...bubbles.map((i, n) => place(part('flask-r97', { pick: [i] }), { x: C[0], y: C[1], s: S, id: `bubble-${n + 1}` })),
  ],
};
