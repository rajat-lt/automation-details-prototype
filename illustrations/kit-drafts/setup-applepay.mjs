// Draft: the setup step "Setting up Apple Pay" in the automation details page's setup state
// (lambdatest/automation-details, 30 Oct 2026; setup v3 the same day). r69's card on its own,
// without its broken grey ring (Rajat: remove the circle and animate the card itself), floating
// over a grey floor shadow, a house spark mark off its top right corner. In the page the card
// rises and settles in a loop while its shadow narrows and pales under it, the spark twinkles
// at the top of each rise, and the mark's accent circle swells gently. Card body, the mark's two
// circles, the spark and the shadow are separate groups so each can move on its own.
// The one accent: the filled circle of the card's mark (the card is the story). At 0.95 with a
// 12 px deep shadow it takes 0.145 of the ink; at 1.1 with a shallow shadow it took 0.181.
import { place, ellipse } from '../../../scripts/lib/house.mjs';
import { part } from '../_setup-lib.mjs';
import { sparkle } from '../../../parts/candidates/objects.mjs';

const S = 0.95;
const C = [289, 245]; // the card's origin, so card, spark and shadow sit centred
// Grey, as the style spec gives floor shadows (#A0A0A0); flat, like the kit's shadow().
const SHADOW = { y: Math.round(46 * S + 5), w: Math.round(82 * S), h: 12 };
const floor = { name: 'shadow', layers: [{ kind: 'greySolid', d: ellipse(0, 0, SHADOW.w / 2, SHADOW.h / 2) }] };

export default {
  title: 'A card floating over its shadow',
  kind: 'spot',
  items: [
    place(floor, { x: C[0] - 3, y: C[1] + SHADOW.y, id: 'shadow' }),
    // Paper (the silhouette without the ring), outline, text dashes, stripe.
    place(part('credit-card-r69', { pick: [1, 2, 3, 4, 5] }), { x: C[0], y: C[1], s: S, id: 'card' }),
    place(part('credit-card-r69', { pick: [7] }), { x: C[0], y: C[1], s: S, id: 'mark-ring' }),
    place(part('credit-card-r69', { pick: [6], accent: [6] }), { x: C[0], y: C[1], s: S, id: 'mark' }),
    // House spark marks: tapered flicks that start clear of the corner they radiate from.
    place(sparkle({ len: 10, gap: 7, spread: 80 }), { x: C[0] + 53 * S, y: C[1] - 31 * S, r: 45, id: 'spark' }),
  ],
};
