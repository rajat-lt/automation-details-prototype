// Draft: the setup step "Setting up iPhone 16" in the automation details page's setup state
// (lambdatest/automation-details, 30 Oct 2026). r134's phone with r13's three gears at its lower
// right corner, without its home button; in the page the gears turn for a few seconds whenever the step moves on, then rest.
// Each gear is its own group over a white disc, so it hides the phone's edge behind it at any angle.
// r134's phone is open on its right edge, where r134's plus badge sat; here that edge is drawn
// closed, straight, as the phone's other sides are. Items paint back to front.
import { place } from '../../../scripts/lib/house.mjs';
import { part, disc, data } from '../_setup-lib.mjs';

const S = 0.5;                       // gears' scale (geometry only; the line stays 2 px)
const PHONE = { x: 278, y: 246, s: 0.78 };
const BIG = [306, 290];              // the large gear's centre on the artboard
const g = data('gears-r13');
const box = (i) => { const n = (g.layers[i].d.match(/-?\d+(\.\d+)?/g) || []).map(Number); const xs = n.filter((_, j) => j % 2 === 0), ys = n.filter((_, j) => j % 2 === 1); return { cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2, r: (Math.max(...xs) - Math.min(...xs)) / 2 }; };
const L = box(1), M = box(9), Sm = box(11);
const at = (c) => [BIG[0] + (c.cx - L.cx) * S, BIG[1] + (c.cy - L.cy) * S];
const gear = (c, layers, opts, id) => {
  const centred = place(part('gears-r13', { pick: layers, ...opts }), { x: -c.cx, y: -c.cy });
  const [x, y] = at(c);
  return [place(disc(c.r + 1 / S), { x, y, s: S, id: `${id}-disc` }), place(centred, { x, y, s: S, id })];
};
// No home button (r134's solid disc): an iPhone 16 has none. Layers: paper, outline, speaker.
const phone = part('phone-r134', { pick: [0, 2, 3] });
phone.layers[1] = { ...phone.layers[1], d: phone.layers[1].d + 'L43.85 -36.51Z' };

export default {
  title: 'A phone being set up, its gears turning',
  kind: 'spot',
  items: [
    place(phone, { ...PHONE, id: 'phone' }),
    ...gear(M, [9, 10, 5, 6], {}, 'gear-mid'),
    ...gear(Sm, [11, 12, 7, 8], {}, 'gear-small'),            // grey in r13, kept grey
    ...gear(L, [1, 2, 3, 4], { accentLine: [3, 4] }, 'gear-big'), // the one accent: the hub that drives the set-up
  ],
};
