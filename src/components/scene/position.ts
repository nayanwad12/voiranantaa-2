/**
 * Where are we in the universe?
 *
 * The homepage marks its five chapters with `data-chapter="0..4"`
 * (Sky, Air, Space, Water, Earth). Other pages set a fixed element on
 * `<main data-scene="1.2" data-scene-dim="0.5">`. Returns a continuous
 * element index `e` (0 = Sky … 4 = Earth) and a dim amount for legibility.
 */

export const ELEMENTS = ["Sky", "Air", "Space", "Water", "Earth"] as const;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export function readScenePosition(): { e: number; dim: number } {
  const main = document.querySelector<HTMLElement>("[data-scene]");
  const dim = main ? parseFloat(main.dataset.sceneDim ?? "0.3") : 0.3;
  const chapters = document.querySelectorAll<HTMLElement>("[data-chapter]");

  if (chapters.length === 0) {
    const e = main ? parseFloat(main.dataset.scene ?? "0") : 0;
    return { e: clamp(Number.isFinite(e) ? e : 0, 0, 4), dim };
  }

  const mid = window.innerHeight * 0.5;
  let e = 0;
  chapters.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.top > mid) return;
    const idx = Number(el.dataset.chapter) || 0;
    const progress = clamp((mid - r.top) / Math.max(r.height, 1), 0, 1);
    // Each chapter holds its world, then dissolves into the next over its last third.
    const isLast = i === chapters.length - 1;
    e = idx + (isLast ? 0 : smooth(0.66, 1, progress));
  });

  return { e: clamp(e, 0, 4), dim };
}

export function elementWeights(e: number): [number, number, number, number, number] {
  const w = [0, 1, 2, 3, 4].map((i) => clamp(1 - Math.abs(e - i), 0, 1));
  return w as [number, number, number, number, number];
}
