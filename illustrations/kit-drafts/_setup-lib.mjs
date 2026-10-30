// Helpers for the setup-state spots (automation details prototype, 30 Oct 2026). Draft only.
// part(name, { pick, accent, accentLine, greyAsInk }) builds a part from chosen layers of a lifted
// object, so one lifted drawing can become several groups that move on their own in the page.
// Kind mapping follows parts/candidates/lifted.mjs; `accent` turns the listed solid layers into the
// accent fill and `accentLine` the listed lines into accent lines (the one accent, on the key object).
import { readFileSync } from 'node:fs';
import { ellipse } from '../../scripts/lib/house.mjs';
const dir = new URL('../../parts/lifted/', import.meta.url);
export const data = (name) => JSON.parse(readFileSync(new URL(name + '.json', dir), 'utf8'));
export function part(name, { pick, accent = [], accentLine = [], greyAsInk = false, label } = {}) {
  const d = data(name);
  const idx = pick ?? d.layers.map((_, i) => i).filter((i) => !d.layers[i].silhouette && !d.layers[i].tag);
  const remap = { grey: 'line', greySolid: 'solid' };
  const layers = idx.map((i) => {
    const L = d.layers[i];
    let k = greyAsInk && remap[L.kind] ? remap[L.kind] : L.kind;
    if (accent.includes(i)) k = 'accent';
    if (accentLine.includes(i)) k = 'accentLine';
    return k === 'accent' || k === 'accentLine' ? { kind: k, d: L.d, step: 100 } : { kind: k, d: L.d };
  });
  return { name: label ?? name, layers };
}
// A white disc under a turning part, so it hides what is behind it at every angle.
export const disc = (r, label = 'disc') => ({ name: label, layers: [{ kind: 'paper', d: ellipse(0, 0, r, r) }] });
