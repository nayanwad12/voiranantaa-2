/**
 * Particle formations — one shape per chapter of the descent.
 * Every point keeps its colour; each formation decides where it sits.
 *
 *  0 RINGS     Sky      — the edition's three rings, inside a field of stars
 *  1 TUNNEL    Sky      — a star tunnel the camera flies through
 *  2 STRINGS   Air      — raga strings, vibrating
 *  3 WORLDS    Air      — nine small worlds, one per rasa
 *  4 HALVES    Space    — two approaches: a lattice (FORM) and a cloud (VOICE)
 *  5 RATIO     Space    — 95 / 5: one large sphere and one small one
 *  6 DIAL      Water    — a five-minute dial
 *  7 RIVER     Water    — the journey: a flowing path with four milestones
 *  8 TERRAIN   Earth    — mineral ground
 *  9 INFINITY  Earth    — ∞, to see the infinite
 */

export const FORMATION_COUNT = 10;

/** Colour classes: most points blue or ice-white; accents in small doses. */
export const CLASS = { blue: 0, ice: 1, pink: 2, green: 3, red: 4 } as const;
type Cls = (typeof CLASS)[keyof typeof CLASS];

export const CLASS_COLORS: Record<Cls, [number, number, number]> = {
  0: [0.298, 0.592, 1.0], // #4C97FF
  1: [0.86, 0.91, 1.0], // ice white
  2: [1.0, 0.455, 0.8], // #FF74CC
  3: [0.745, 1.0, 0.294], // #BEFF4B
  4: [1.0, 0.294, 0.365], // #FF4B5D
};

/** Seeded random so server and every device build the same universe. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type V3 = [number, number, number];
const TAU = Math.PI * 2;

function onSphere(r: number, rand: () => number): V3 {
  const u = rand() * 2 - 1;
  const t = rand() * TAU;
  const s = Math.sqrt(1 - u * u);
  return [r * s * Math.cos(t), r * u, r * s * Math.sin(t)];
}

function inSphere(r: number, rand: () => number): V3 {
  const p = onSphere(1, rand);
  const k = r * Math.cbrt(rand());
  return [p[0] * k, p[1] * k, p[2] * k];
}

function farStar(rand: () => number): V3 {
  const p = onSphere(1, rand);
  const k = 14 + rand() * 22;
  return [p[0] * k, p[1] * k, p[2] * k - 8];
}

export type Universe = {
  count: number;
  positions: Float32Array[]; // one per formation
  colors: Float32Array;
  seeds: Float32Array;
};

export function buildUniverse(count: number): Universe {
  const rand = mulberry32(20261215);
  const positions = Array.from({ length: FORMATION_COUNT }, () => new Float32Array(count * 3));
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r = rand();
    const cls: Cls = r < 0.05 ? CLASS.pink : r < 0.06 ? CLASS.green : r < 0.07 ? CLASS.red : r < 0.38 ? CLASS.ice : CLASS.blue;
    const c = CLASS_COLORS[cls];
    colors.set(c, i * 3);
    seeds[i] = rand();
    const shapes: V3[] = [
      rings(cls, rand),
      tunnel(rand),
      strings(rand),
      worlds(i, rand),
      halves(i, rand),
      ratio(cls, rand),
      dial(i, rand),
      river(rand),
      terrain(rand),
      infinity(rand),
    ];
    shapes.forEach((p, k) => positions[k].set(p, i * 3));
  }
  return { count, positions, colors, seeds };
}

// ------------------------------------------------------------------ shapes

function rings(cls: Cls, rand: () => number): V3 {
  if (rand() < 0.28) return farStar(rand);
  // Outer ring blue, middle ring ice, inner ring pink — the edition motif.
  const radius = cls === CLASS.blue ? 2.9 : cls === CLASS.ice ? 2.35 : 1.8;
  const a = rand() * TAU;
  const j = (rand() - 0.5) * 0.09;
  const z = (rand() - 0.5) * 0.12;
  return [(radius + j) * Math.cos(a), (radius + j) * Math.sin(a), z];
}

function tunnel(rand: () => number): V3 {
  const a = rand() * TAU;
  const r = 2.2 + Math.pow(rand(), 0.6) * 5.5;
  const z = 8 - rand() * 60;
  return [r * Math.cos(a), r * Math.sin(a), z];
}

function strings(rand: () => number): V3 {
  if (rand() < 0.15) return farStar(rand);
  const lines = 7;
  const line = Math.floor(rand() * lines);
  const x = (rand() * 2 - 1) * 8;
  const y = (line - (lines - 1) / 2) * 0.62;
  const z = (rand() - 0.5) * 0.05 - line * 0.25;
  return [x, y, z];
}

function worlds(i: number, rand: () => number): V3 {
  if (rand() < 0.12) return farStar(rand);
  const k = i % 9;
  const cx = ((k % 3) - 1) * 2.5;
  const cy = (1 - Math.floor(k / 3)) * 2.2;
  const s = 0.72;
  let p: V3;
  switch (k) {
    case 0: // beauty — a soft sphere
      p = onSphere(s, rand);
      break;
    case 1: {
      // joy — a bouncing ring of points
      const a = rand() * TAU;
      p = [s * Math.cos(a), s * Math.sin(a) * 0.35 + Math.abs(Math.sin(a * 3)) * 0.4 - 0.2, (rand() - 0.5) * 0.2];
      break;
    }
    case 2: // compassion — falling lines
      p = [(Math.floor(rand() * 7) - 3) * 0.2, (rand() * 2 - 1) * s, 0];
      break;
    case 3: {
      // anger — spikes
      const d = onSphere(1, rand);
      const len = rand() < 0.3 ? s * 1.3 : s * 0.45;
      p = [d[0] * len, d[1] * len, d[2] * len];
      break;
    }
    case 4: // courage — a rising column
      p = [(rand() - 0.5) * 0.25, (rand() * 2 - 1) * s * 1.1, (rand() - 0.5) * 0.25];
      break;
    case 5: {
      // fear — a broken shell
      const d = onSphere(s, rand);
      p = Math.sin(d[1] * 14) > 0 ? d : [d[0] * 1.25, d[1] * 1.25, d[2] * 1.25];
      break;
    }
    case 6: // disquiet — a warped plane
      p = [(rand() * 2 - 1) * s, 0, (rand() * 2 - 1) * s];
      p[1] = Math.sin(p[0] * 6) * Math.cos(p[2] * 5) * 0.3;
      break;
    case 7: {
      // wonder — a burst
      const d = onSphere(1, rand);
      const len = Math.pow(rand(), 3) * s * 1.2;
      p = [d[0] * len, d[1] * len, d[2] * len];
      break;
    }
    default: {
      // peace — a still disc
      const a = rand() * TAU;
      const r = Math.sqrt(rand()) * s;
      p = [r * Math.cos(a), (rand() - 0.5) * 0.04, r * Math.sin(a)];
    }
  }
  return [cx + p[0], cy + p[1], p[2]];
}

function halves(i: number, rand: () => number): V3 {
  if (rand() < 0.1) return farStar(rand);
  if (i % 2 === 0) {
    // FORM — a lattice cube
    const g = 6;
    const ax = Math.floor(rand() * 3);
    const a = (Math.floor(rand() * (g + 1)) / g) * 2 - 1;
    const b = (Math.floor(rand() * (g + 1)) / g) * 2 - 1;
    const t = rand() * 2 - 1;
    const v: V3 = ax === 0 ? [t, a, b] : ax === 1 ? [a, t, b] : [a, b, t];
    return [-2.7 + v[0] * 1.2, v[1] * 1.2, v[2] * 1.2];
  }
  // VOICE — a breathing cloud
  const p = inSphere(1.6, rand);
  return [2.7 + p[0], p[1], p[2]];
}

function ratio(cls: Cls, rand: () => number): V3 {
  if (cls === CLASS.pink || cls === CLASS.green || cls === CLASS.red) {
    const p = onSphere(0.7, rand);
    return [3.4 + p[0], 1.6 + p[1], p[2]];
  }
  if (rand() < 0.1) return farStar(rand);
  const p = onSphere(2.6, rand);
  const j = 1 + (rand() - 0.5) * 0.04;
  return [-0.6 + p[0] * j, p[1] * j, p[2] * j];
}

function dial(i: number, rand: () => number): V3 {
  if (rand() < 0.12) return farStar(rand);
  const pick = rand();
  if (pick < 0.55) {
    const a = rand() * TAU;
    const r = 2.8 + (rand() - 0.5) * 0.05;
    return [r * Math.cos(a), r * Math.sin(a), 0];
  }
  if (pick < 0.85) {
    // 60 ticks, every fifth one longer
    const t = Math.floor(rand() * 60);
    const a = (t / 60) * TAU;
    const len = t % 5 === 0 ? 0.45 : 0.16;
    const r = 2.55 - rand() * len;
    return [r * Math.cos(a), r * Math.sin(a), 0];
  }
  // the hand
  const r = rand() * 2.2;
  return [0.02 * (rand() - 0.5), r, 0.05];
}

function river(rand: () => number): V3 {
  if (rand() < 0.12) return farStar(rand);
  const milestones = [-6, -2, 2, 6];
  if (rand() < 0.22) {
    const m = milestones[Math.floor(rand() * 4)];
    const p = inSphere(0.32, rand);
    return [m + p[0], Math.sin(m * 0.55) * 0.9 + p[1], p[2]];
  }
  const x = (rand() * 2 - 1) * 8.5;
  const w = (rand() - 0.5) * 0.35;
  return [x, Math.sin(x * 0.55) * 0.9 + w, (rand() - 0.5) * 0.6];
}

function terrain(rand: () => number): V3 {
  const x = (rand() * 2 - 1) * 10;
  const z = 3 - rand() * 18;
  const h =
    Math.sin(x * 0.7) * Math.cos(z * 0.5) * 0.5 + Math.sin(x * 1.9 + z * 1.3) * 0.18 + Math.abs(Math.sin(x * 0.3 - z * 0.4)) * 0.6;
  return [x, -2.4 + h, z];
}

function infinity(rand: () => number): V3 {
  if (rand() < 0.15) return farStar(rand);
  const t = rand() * TAU;
  const a = 3.6;
  const d = 1 + Math.sin(t) ** 2;
  const j = () => (rand() - 0.5) * 0.12;
  return [(a * Math.cos(t)) / d + j(), (a * Math.sin(t) * Math.cos(t)) / d + j(), j() * 2];
}
