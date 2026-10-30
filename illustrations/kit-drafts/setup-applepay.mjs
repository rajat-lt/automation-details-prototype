// Draft: the setup step "Setting up Apple Pay" in the automation details page's setup state
// (lambdatest/automation-details, 30 Oct 2026). r69's card inside its broken grey ring, the house's
// own drawing of a card being handled. In the page the ring turns and the card settles for a few
// seconds whenever the step moves on, then both rest. The one accent: the filled circle of the card's mark (the card
// is the story; the stripe in accent took 0.32 of the ink, over the 0.15 cap). Card and ring are separate groups so each can move on its own.
import { place } from '../../../scripts/lib/house.mjs';
import { part, data } from '../_setup-lib.mjs';

const S = 0.84;
const C = [300, 250];
const d = data('credit-card-r69');
// The ring's centre, from its bounding box, so it turns about itself.
const n = (d.layers[8].d.match(/-?\d+(\.\d+)?/g) || []).map(Number); const xs = n.filter((_, j) => j % 2 === 0), ys = n.filter((_, j) => j % 2 === 1);
const R = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
const ring = place(part('credit-card-r69', { pick: [8] }), { x: -R[0], y: -R[1] });

export default {
  title: 'A card being added, its ring turning',
  kind: 'spot',
  items: [
    place(ring, { x: C[0] + R[0] * S, y: C[1] + R[1] * S, s: S, id: 'ring' }),
    // Paper (the silhouette without the ring), outline, text dashes, stripe, and the mark, its filled circle in accent.
    place(part('credit-card-r69', { pick: [1, 2, 3, 4, 5, 6, 7], accent: [6] }), { x: C[0], y: C[1], s: S, id: 'card' }),
  ],
};
