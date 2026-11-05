/**
 * One continuous particle universe behind the whole page. The same dust
 * re-forms for each chapter: a galaxy vortex (sky), currents of wind (air),
 * rising sparks (fire), an ocean surface (water) and a planet with a ring
 * (earth). Between chapters the particles scatter into a drifting cloud and
 * settle into the next shape. A deep starfield stays throughout. Every shape
 * is computed on the GPU from per-particle random seeds; the page only sets
 * the shape weights, the colours and the camera.
 */

export const galaxyVertex = /* glsl */ `
attribute vec4 aA;        // random seeds
attribute vec4 aB;        // random seeds; xy also place the particle on the ocean grid
attribute vec2 aInfo;     // kind (0 star, 1 dust, 2 bead), size
uniform mat4 uProj;
uniform mat4 uView;
uniform mat3 uTilt;       // orientation of the vortex disk
uniform float uTime;
uniform float uScale;     // pixels per world unit at distance 1
uniform float uDpr;
uniform float uW[5];      // how much of each shape: vortex, air, fire, water, earth
uniform vec3 uColA;
uniform vec3 uColB;
uniform float uLevel;     // overall brightness, kept low behind text
varying vec3 vColor;
varying float vGlow;

const float TAU = 6.2831853;
const float S = 1.45;

float gs(float u, float v) { return sqrt(-2.0 * log(max(u, 1e-4))) * cos(TAU * v); }
vec3 spin(vec3 p, float a) {
  float c = cos(a), s = sin(a);
  return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
}
float well(float r) { return -0.5 * exp(-r / S * 1.5); }

// SKY: a tilted vortex of dotted rings and spiral arms around a bright core.
vec3 vortex(vec4 a, vec4 b, float t, out float lum) {
  vec3 p;
  float rad;
  float pace = 1.0;
  if (a.x < 0.42) {
    float k = floor(a.y * 36.0);
    rad = (0.18 + k * 0.066) * S;
    float slots = floor(60.0 + (rad / S) * 150.0);
    float ang = (floor(a.z * slots) + 0.5) / slots * TAU;
    rad *= 1.0 + 0.06 * sin(3.0 * ang + k);
    p = vec3(cos(ang) * rad, well(rad) + gs(b.z, b.w) * 0.015, sin(ang) * rad);
  } else if (a.x < 0.62) {
    rad = (0.2 + pow(a.y, 1.3) * 2.5) * S;
    float ang = step(0.5, a.z) * 3.14159 + log(rad / S) * 2.4 + gs(b.z, b.w) * 0.14;
    p = vec3(cos(ang) * rad, well(rad) + gs(b.w, a.w) * 0.05, sin(ang) * rad);
  } else if (a.x < 0.9) {
    rad = pow(a.y, 1.2) * 3.3 * S;
    float ang = a.z * TAU;
    p = vec3(cos(ang) * rad, gs(b.z, b.w) * 0.45 * (0.3 + rad / S * 0.25), sin(ang) * rad);
    pace = 0.6;
  } else {
    rad = (0.04 + a.y * a.y * 0.55) * S;
    float ang = a.z * TAU;
    p = vec3(cos(ang) * rad, well(rad) + gs(b.z, b.w) * 0.06, sin(ang) * rad);
  }
  lum = 1.5 * (1.3 - clamp(rad * 0.18, 0.0, 0.8));
  return uTilt * spin(p, t * pace * 0.34 / (rad / S + 0.25));
}

// AIR: long ribbons of wind drifting across the frame.
vec3 air(vec4 a, vec4 b, float t, out float lum) {
  float i = floor(a.x * 7.0);
  float u = fract(a.y + t * (0.014 + 0.008 * fract(i * 0.37)));
  float x = (u - 0.5) * 10.0;
  float ph = i * 1.7;
  float y = (fract(i * 0.618) - 0.5) * 3.4 + sin(x * 0.55 + ph + t * 0.22) * 0.6;
  float z = (fract(i * 0.23) - 0.5) * 2.4 + cos(x * 0.4 + ph) * 0.8;
  float thick = 0.015 + 0.07 * b.z * b.z;
  lum = 2.6 * smoothstep(0.0, 0.12, u) * smoothstep(1.0, 0.88, u);
  return vec3(x, y + gs(b.w, a.z) * thick, z + gs(a.w, b.z) * thick);
}

// FIRE: sparks rising from a wide bed, swaying as they climb and fade.
vec3 fire(vec4 a, vec4 b, float t, out float lum) {
  float h = fract(a.y + t * (0.025 + 0.035 * a.z));
  float y = -2.6 + h * 5.6;
  float r = sqrt(b.z) * (0.7 + h * 2.0);
  float ang = a.x * TAU + t * 0.15 + h * 1.8;
  vec3 p = vec3(cos(ang) * r, y, sin(ang) * r * 0.6);
  p.x += sin(y * 1.7 + b.w * TAU + t * 1.2) * 0.25;
  lum = 4.0 * smoothstep(0.0, 0.08, h) * (1.0 - h * 0.85);
  return p;
}

// WATER: a dotted ocean surface rolling under the stars.
vec3 water(vec4 a, vec4 b, float t, out float lum) {
  float x = (b.x - 0.5) * 11.0;
  float z = -7.5 + b.y * 10.0;
  float y = -0.9 + sin(x * 0.55 + t * 0.45) * 0.22 + sin(z * 0.85 - t * 0.38 + x * 0.3) * 0.16 + sin((x + z) * 1.6 + t * 0.8) * 0.05;
  lum = 4.0 + (y + 0.9) * 5.5;
  return vec3(x, y, z);
}

// EARTH: a planet of dots with mineral patches, circled by a ring.
vec3 earth(vec4 a, vec4 b, float t, out float lum) {
  const mat3 T = mat3(0.97, 0.24, 0.0, -0.21, 0.86, 0.46, 0.11, -0.45, 0.89);
  if (a.x < 0.72) {
    float u = a.y * 2.0 - 1.0;
    float ang = a.z * TAU + t * 0.05;
    float s = sqrt(1.0 - u * u);
    vec3 d = vec3(cos(ang) * s, u, sin(ang) * s);
    vec3 cell = floor(vec3(cos(a.z * TAU) * s, u, sin(a.z * TAU) * s) * 5.0);
    float land = step(0.45, fract(sin(dot(cell, vec3(12.9, 78.2, 37.7))) * 43758.5));
    lum = 1.7 + 1.6 * land;
    return T * (d * 1.7 * (1.0 + (b.z - 0.5) * 0.03));
  }
  float rad = 2.4 + b.z * 1.1;
  float ang = a.z * TAU + t * 0.25 / rad;
  lum = 2.2;
  return T * vec3(cos(ang) * rad, gs(b.w, a.w) * 0.02, sin(ang) * rad);
}

void main() {
  float kind = aInfo.x;
  vec3 p;
  vec3 col;
  float bright;

  if (kind < 0.5) {
    // Stars: a deep shell around everything, turning very slowly.
    float u = aA.x * 2.0 - 1.0;
    float ang = aA.y * TAU;
    float d = 5.5 + aA.z * 11.0;
    float s = sqrt(1.0 - u * u);
    p = spin(vec3(cos(ang) * s * d, u * d, sin(ang) * s * d), uTime * 0.006);
    col = mix(vec3(1.0), mix(uColA, uColB, aB.x), 0.3);
    bright = 1.0;
  } else if (kind < 1.5) {
    // Dust: a blend of the shapes in view.
    p = vec3(0.0);
    bright = 0.0;
    float l;
    if (uW[0] > 0.001) { p += uW[0] * vortex(aA, aB, uTime, l); bright += uW[0] * l; }
    if (uW[1] > 0.001) { p += uW[1] * air(aA, aB, uTime, l); bright += uW[1] * l; }
    if (uW[2] > 0.001) { p += uW[2] * fire(aA, aB, uTime, l); bright += uW[2] * l; }
    if (uW[3] > 0.001) { p += uW[3] * water(aA, aB, uTime, l); bright += uW[3] * l; }
    if (uW[4] > 0.001) { p += uW[4] * earth(aA, aB, uTime, l); bright += uW[4] * l; }
    // Between shapes the dust scatters into a drifting cloud, then re-forms.
    float k = clamp((1.0 - max(max(max(uW[0], uW[1]), max(uW[2], uW[3])), uW[4])) * 2.0, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);
    p += vec3(gs(aA.w, aB.z), gs(aB.w, aA.z) * 0.6, gs(aA.y, aB.x)) * k * 1.4;
    p = spin(p, k * (aA.w - 0.5) * 1.4);
    bright *= 1.0 + k * 0.35;
    col = mix(uColA, uColB, aB.w);
  } else {
    // Beads: glowing chains that orbit with the vortex, seen only in the sky.
    p = uTilt * spin(aA.xyz, uTime * aA.w);
    bright = 1.25 * uW[0];
    col = mix(vec3(1.0), uColA, 0.2);
  }

  vec4 mv = uView * vec4(p, 1.0);
  float depth = max(-mv.z, 0.05);
  gl_Position = uProj * mv;

  float px = aInfo.y * uScale / depth;
  // Points thinner than a pixel stay one pixel and dim instead, so they never shimmer.
  bright *= clamp(px, 0.0, 1.0);
  // Capped sizes keep the field fine-grained, however close a particle comes.
  float maxPx = kind > 0.5 && kind < 1.5 ? 2.4 : kind > 1.5 ? 16.0 : 7.0;
  gl_PointSize = clamp(px, 1.0, maxPx) * uDpr;

  float phase = fract(aA.x * 7.31 + aB.y * 3.7);
  bright *= 0.72 + 0.28 * sin(uTime * (0.8 + phase * 2.2) + phase * TAU);
  bright *= smoothstep(24.0, 7.0, depth) * smoothstep(0.12, 0.7, depth);
  bright *= 0.45 + 0.55 * fract(phase * 3.17 + 0.37);
  vColor = col * bright * uLevel;
  vGlow = step(0.026, aInfo.y);
}
`;

export const galaxyFragment = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vGlow;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  // Small dots keep a full centre so a one- or two-pixel particle still reads.
  float dot1 = 1.0 - smoothstep(0.18, 0.5, d);
  float halo = exp(-d * d * 14.0) * 0.75 + smoothstep(0.17, 0.04, d);
  gl_FragColor = vec4(vColor * mix(dot1, halo, vGlow), 1.0);
}
`;

/** Small deterministic random, so the universe looks the same on every visit. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seeds for every particle: stars, dust (which takes every shape) and beads. */
export function buildParticles(density: number) {
  const r = rng(7);
  const A: number[] = [];
  const B: number[] = [];
  const info: number[] = [];
  const stars = Math.round(2800 * density);
  const dust = Math.round(19000 * density);

  for (let i = 0; i < stars; i++) {
    A.push(r(), r(), r(), r());
    B.push(r(), r(), r(), r());
    info.push(0, r() < 0.012 ? 0.08 + r() * 0.07 : 0.012 + r() * 0.016);
  }

  // Dust: B.xy are spread on a grid so the ocean reads as an even surface.
  const cols = 160;
  const rows = Math.ceil(dust / cols);
  for (let i = 0; i < dust; i++) {
    A.push(r(), r(), r(), r());
    B.push(((i % cols) + 0.5) / cols, (Math.floor(i / cols) + 0.5) / rows, r(), r());
    info.push(1, 0.0055 + r() * 0.0055);
  }

  // Beads: A.xyz is the position in the disk, A.w the orbit speed.
  const S = 1.45;
  const chains = [
    { rad: 1.4, y: 0.3, from: 2.2, beads: 8 },
    { rad: 0.45, y: -0.04, from: 4.1, beads: 6 },
    { rad: 1.05, y: -0.28, from: 5.4, beads: 7 },
  ];
  for (const c of chains) {
    const rad = c.rad * S;
    for (let i = 0; i < c.beads; i++) {
      const a = c.from + i * 0.11;
      const t = i / (c.beads - 1);
      A.push(Math.cos(a) * rad, c.y + t * 0.05, Math.sin(a) * rad, (0.34 / (c.rad + 0.25)) * 0.5);
      B.push(r(), r(), r(), r());
      info.push(2, 0.1 - t * 0.055);
    }
  }

  return { a: new Float32Array(A), b: new Float32Array(B), info: new Float32Array(info), count: info.length / 2 };
}

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Index into uW. */
const VORTEX = 0;
const AIR = 1;
const FIRE = 2;
const WATER = 3;
const EARTH = 4;

export type Scene = {
  shape: number;
  colA: RGB;
  colB: RGB;
  /** Overall brightness; lower where text sits on the particles. */
  level: number;
  /** Camera angles (radians) and distance from the centre. */
  yaw: number;
  pitch: number;
  dist: number;
};

const scene = (shape: number, a: string, b: string, level: number, yaw: number, pitch: number, dist: number): Scene => ({
  shape,
  colA: hex(a),
  colB: hex(b),
  level,
  yaw,
  pitch,
  dist,
});

/** One mood per section (data-form 0–11), grouped by the chapter's element. */
export const SCENES: Scene[] = [
  // 0 hero — sky: the galaxy, white light
  scene(VORTEX, "#FFFFFF", "#D6DCFF", 0.6, 0, 0, 3.9),
  // 1 idea — sky: black and purple
  scene(VORTEX, "#E6DAFF", "#A77FE0", 0.55, 0.55, 0.12, 3.4),
  // 2 theme — air: light blue and lemon
  scene(AIR, "#9ED3F5", "#F0E64A", 0.85, 0, 0.05, 4.2),
  // 3 rasas — air
  scene(AIR, "#F0E64A", "#BFE3FA", 0.7, 0.3, 0.1, 4.2),
  // 4 categories — fire: yellow and orange
  scene(FIRE, "#F2C21B", "#E8661A", 0.9, 0, 0.05, 4.4),
  // 5 challenge — fire
  scene(FIRE, "#E8661A", "#FFE9A0", 0.8, 0.35, 0.1, 4.2),
  // 6 live — water: blue and black
  scene(WATER, "#5B8FD6", "#CFE3FF", 0.9, 0, 0.2, 3.6),
  // 7 journey — water
  scene(WATER, "#3A6FB0", "#9CC4F0", 0.8, 0.3, 0.24, 3.6),
  // 8 vision — earth: brown, orange and black
  scene(EARTH, "#C8641E", "#E8B07A", 0.9, 0, 0.12, 4.4),
  // 9 finale — back to the galaxy, in every colour of the edition
  scene(VORTEX, "#FFFFFF", "#E2BE22", 0.62, -0.4, 0.08, 3.7),
  // 10 how to / selection — earth
  scene(EARTH, "#B0703A", "#E8661A", 0.7, 0.5, 0.2, 4.6),
  // 11 attend — earth
  scene(EARTH, "#E8B07A", "#C8641E", 0.75, -0.35, 0.1, 4.4),
];

/* Minimal matrix helpers (column-major, as WebGL expects). */

export function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

export function lookAt(eye: number[], target: number[], up: number[]) {
  const sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const norm = (v: number[]) => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const z = norm(sub(eye, target));
  const x = norm(cross(up, z));
  const y = cross(z, x);
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
}

/** Rotation about x by `ax`, then about z by `az` (column-major 3×3). */
export function tilt(ax: number, az: number) {
  const cx = Math.cos(ax),
    sx = Math.sin(ax),
    cz = Math.cos(az),
    sz = Math.sin(az);
  // Rz * Rx
  return new Float32Array([cz, sz, 0, -sz * cx, cz * cx, sx, sz * sx, -cz * sx, cx]);
}
