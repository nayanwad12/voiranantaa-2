/**
 * The night sky behind the whole page: a deep navy sky crossed by the Milky
 * Way (a glowing band of dust with a warm core and dark lanes), tens of
 * thousands of stars at real depth, and a sparse layer of near stars that
 * drift past as the camera moves. Two layers: the sky glow is a soft,
 * low-resolution shader; the stars are crisp points drawn over it.
 * Sections can tint the sky with a faint nebula colour, on and off.
 */

/* ------------------------------------------------------------------
   Sky glow: navy, the Milky Way band, its core and dust lanes, and an
   optional accent nebula. Computed per pixel from the view direction.
------------------------------------------------------------------- */

export const skyVertex = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const skyFragment = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform mat3 uCam;        // columns: right, up, forward
uniform vec2 uLens;       // tan(fov/2) * aspect, tan(fov/2)
uniform float uTime;
uniform vec3 uBand;       // normal of the galactic plane
uniform vec3 uCore;       // direction of the galactic core
uniform vec3 uAccent;     // nebula colour
uniform float uAccentAmt; // 0 = pure night sky
uniform float uLevel;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v / 0.9375;
}

void main() {
  vec2 ndc = gl_FragCoord.xy / uRes * 2.0 - 1.0;
  vec3 dir = normalize(uCam * vec3(ndc.x * uLens.x, ndc.y * uLens.y, 1.0));

  float h = dot(dir, uBand);                 // distance from the galactic plane
  float toCore = max(dot(dir, uCore), 0.0);  // 1 at the core
  float n1 = fbm(dir * 3.0);
  float n2 = fbm(dir * 14.0 + 4.0);
  float n3 = fbm(dir * 26.0 + 9.0);

  // The band: narrow, mottled with star clouds, brighter towards the core.
  float width = 0.075 + 0.05 * n1 + 0.06 * toCore;
  float band = exp(-h * h / (width * width));
  float halo = exp(-h * h / (width * width * 6.0));
  float core = pow(toCore, 5.0);
  float glow = band * (0.2 + 0.8 * n1) * (0.45 + 0.55 * n3) * (0.5 + 2.0 * core);
  // Ragged dark dust lanes along the middle of the band.
  float lane = smoothstep(0.52, 0.74, n2) * exp(-(h - 0.012) * (h - 0.012) / (width * width * 0.35));
  glow *= 1.0 - 0.75 * lane;

  // Navy blue night, a touch lighter around the band.
  vec3 col = mix(vec3(0.012, 0.02, 0.05), vec3(0.04, 0.06, 0.14), clamp(0.3 + 0.5 * halo + 0.12 * dir.y, 0.0, 1.0));
  vec3 glowCol = mix(vec3(0.42, 0.5, 0.74), vec3(0.92, 0.78, 0.68), clamp(core * 1.6, 0.0, 1.0));
  col += glowCol * (glow * 0.34 + halo * (0.04 + 0.06 * core) * n1);

  // A faint nebula in the section's accent colour, drifting slowly.
  float cloud = smoothstep(0.4, 0.85, fbm(dir * 1.6 + vec3(0.0, uTime * 0.006, uTime * 0.004)));
  col += uAccent * uAccentAmt * (cloud * 0.9 + band * 0.45) * 0.75;

  col *= uLevel;
  // Dither so the smooth glow never shows steps.
  col += (hash(vec3(gl_FragCoord.xy, fract(uTime))) - 0.5) * (2.0 / 255.0);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

/* ------------------------------------------------------------------
   Stars: crisp points. Far stars sit on a huge sphere (no parallax);
   band stars crowd the Milky Way; near stars drift past the camera.
------------------------------------------------------------------- */

export const starVertex = /* glsl */ `
attribute vec3 aPos;
attribute vec4 aInfo;     // size, brightness, warmth, phase
uniform mat4 uProj;
uniform mat4 uView;
uniform float uTime;
uniform float uScale;     // pixels per world unit at distance 1
uniform float uDpr;
uniform float uLevel;
varying vec3 vColor;
varying float vGlow;

void main() {
  vec4 mv = uView * vec4(aPos, 1.0);
  gl_Position = uProj * mv;
  float depth = max(-mv.z, 0.05);
  // Far stars have a fixed size in pixels; near stars are sized by distance.
  float far = step(200.0, length(aPos));
  float px = mix(aInfo.x * uScale / depth, aInfo.x, far);
  float bright = aInfo.y * clamp(px, 0.0, 1.0);
  // Near stars fade in from the distance and out as they pass the camera.
  bright *= mix(smoothstep(0.6, 2.0, depth) * smoothstep(40.0, 18.0, depth), 1.0, far);
  gl_PointSize = clamp(px, 1.0, mix(3.0, 9.0, far)) * uDpr;
  bright *= 0.82 + 0.18 * sin(uTime * (0.5 + aInfo.w * 2.0) + aInfo.w * 40.0);
  vec3 cold = vec3(0.8, 0.87, 1.0);
  vec3 warm = vec3(1.0, 0.86, 0.72);
  vColor = mix(cold, warm, aInfo.z) * bright * uLevel;
  vGlow = step(3.2, px) * far;
}
`;

export const starFragment = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vGlow;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  // Small stars keep a full centre; bright ones get a soft halo.
  float dot1 = 1.0 - smoothstep(0.18, 0.5, d);
  float halo = exp(-d * d * 16.0) * 0.6 + smoothstep(0.16, 0.03, d);
  // Alpha 0 with additive blending: the stars add light over the sky below.
  gl_FragColor = vec4(vColor * mix(dot1, halo, vGlow), 0.0);
}
`;

/** Small deterministic random, so the sky looks the same on every visit. */
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

type V3 = [number, number, number];
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** The Milky Way: the plane's normal, and the core's direction within it. */
export const BAND = norm([0.28, 0.93, 0.22]);
export const CORE = norm(cross(BAND, [0.15, 0.2, 1]));

/** How far the camera glides forward over the whole page (world units). */
const TRAVEL = 34;

/** Where the camera looks at page progress p (0 = top, 1 = bottom). */
export function lookAt(p: number) {
  return {
    yaw: 1.62 + p * 1.9 + 0.15 * Math.sin(p * 7),
    pitch: -0.2 + 0.28 * Math.sin(p * 5.3),
    roll: 0.22 + 0.12 * Math.sin(p * 4.1),
  };
}

/** The camera travels the way it looks: its position is the sum of its headings. */
const PATH: V3[] = (() => {
  const steps = 256;
  const out: V3[] = [[0, 0, 0]];
  for (let i = 1; i <= steps; i++) {
    const { yaw, pitch } = lookAt((i - 0.5) / steps);
    const k = TRAVEL / steps;
    const prev = out[i - 1];
    out.push([prev[0] + Math.sin(yaw) * Math.cos(pitch) * k, prev[1] + Math.sin(pitch) * k, prev[2] - Math.cos(yaw) * Math.cos(pitch) * k]);
  }
  return out;
})();

export function eyeAt(p: number): V3 {
  const x = Math.min(Math.max(p, 0), 1) * (PATH.length - 1);
  const i = Math.min(Math.floor(x), PATH.length - 2);
  const t = x - i;
  const a = PATH[i];
  const b = PATH[i + 1];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function buildStars(density: number) {
  const r = rng(11);
  const gauss = () => Math.sqrt(-2 * Math.log(Math.max(r(), 1e-6))) * Math.cos(2 * Math.PI * r());
  const pos: number[] = [];
  const info: number[] = [];
  const n = (count: number) => Math.round(count * density);
  const FAR = 600;
  const sizeFar = () => {
    const k = r();
    return k < 0.006 ? 4 + r() * 3 : k < 0.06 ? 1.8 + r() * 1.2 : 1 + r() * 0.9;
  };

  // Stars all over the sky.
  for (let i = 0; i < n(34000); i++) {
    const u = r() * 2 - 1;
    const a = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const size = sizeFar();
    pos.push(Math.cos(a) * s * FAR, u * FAR, Math.sin(a) * s * FAR);
    info.push(size, size > 3.5 ? 1.25 : 0.4 + Math.pow(r(), 1.6) * 0.9, r() < 0.18 ? 0.5 + r() * 0.5 : r() * 0.25, r());
  }

  // Stars crowding the Milky Way, densest towards the core.
  const side = norm(cross(BAND, CORE));
  for (let i = 0; i < n(18000); i++) {
    const a = r() < 0.6 ? gauss() * 0.6 : (r() * 2 - 1) * Math.PI;
    const off = gauss() * (0.04 + 0.05 * Math.exp(-a * a));
    const d = norm([
      CORE[0] * Math.cos(a) + side[0] * Math.sin(a) + BAND[0] * off,
      CORE[1] * Math.cos(a) + side[1] * Math.sin(a) + BAND[1] * off,
      CORE[2] * Math.cos(a) + side[2] * Math.sin(a) + BAND[2] * off,
    ]);
    const size = r() < 0.03 ? 1.6 + r() : 0.9 + r() * 0.6;
    pos.push(d[0] * FAR, d[1] * FAR, d[2] * FAR);
    info.push(size, 0.3 + Math.pow(r(), 2) * 0.7, r() < 0.3 ? 0.4 + r() * 0.5 : r() * 0.2, r());
  }

  // Near stars around the camera's path, for depth as you travel.
  for (let i = 0; i < n(3500); i++) {
    const at = eyeAt(r() * 1.1 - 0.02);
    const ahead = lookAt(0);
    const lead = 6 * r();
    pos.push(
      at[0] + (r() * 2 - 1) * 9 + Math.sin(ahead.yaw) * lead,
      at[1] + (r() * 2 - 1) * 6,
      at[2] + (r() * 2 - 1) * 9 - Math.cos(ahead.yaw) * lead,
    );
    info.push(0.01 + r() * 0.012, 0.35 + r() * 0.45, r() * 0.4, r());
  }

  return { pos: new Float32Array(pos), info: new Float32Array(info), count: info.length / 4 };
}

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const v = parseInt(h.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
};

/** Accent colours from the second reference: blue, crimson, moss, ember. */
const BLUE = hex("#2A4FB8");
const CRIMSON = hex("#D8321E");
const MOSS = hex("#4E7A34");
const EMBER = hex("#E0904A");
const NONE = hex("#000000");

export type Scene = { accent: RGB; amount: number; level: number };

/** One mood per section (data-form 0–11): pure night, or a faint accent nebula. */
export const SCENES: Scene[] = [
  { accent: NONE, amount: 0, level: 1 }, // 0 hero
  { accent: NONE, amount: 0, level: 0.92 }, // 1 idea
  { accent: BLUE, amount: 0.18, level: 0.92 }, // 2 theme
  { accent: BLUE, amount: 0, level: 0.88 }, // 3 rasas
  { accent: CRIMSON, amount: 0.17, level: 0.9 }, // 4 categories
  { accent: CRIMSON, amount: 0, level: 0.88 }, // 5 challenge
  { accent: MOSS, amount: 0.16, level: 0.9 }, // 6 live
  { accent: MOSS, amount: 0, level: 0.88 }, // 7 journey
  { accent: EMBER, amount: 0.16, level: 0.9 }, // 8 vision
  { accent: CRIMSON, amount: 0.18, level: 0.95 }, // 9 finale
  { accent: EMBER, amount: 0, level: 0.86 }, // 10 how to / selection
  { accent: BLUE, amount: 0.14, level: 0.88 }, // 11 attend
];

/* Minimal matrix helpers (column-major, as WebGL expects). */

export function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

/** Camera basis from yaw, pitch and roll: right, up and forward vectors. */
export function basis(yaw: number, pitch: number, roll: number) {
  const f: V3 = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)];
  const r0 = norm(cross(f, [0, 1, 0]));
  const u0 = cross(r0, f);
  const c = Math.cos(roll), s = Math.sin(roll);
  const r: V3 = [r0[0] * c + u0[0] * s, r0[1] * c + u0[1] * s, r0[2] * c + u0[2] * s];
  const u: V3 = [u0[0] * c - r0[0] * s, u0[1] * c - r0[1] * s, u0[2] * c - r0[2] * s];
  return { r, u, f };
}

/** View matrix for a camera at `eye` with the given basis. */
export function viewMatrix(eye: V3, b: { r: V3; u: V3; f: V3 }) {
  const { r, u, f } = b;
  const dot = (a: V3, v: V3) => a[0] * v[0] + a[1] * v[1] + a[2] * v[2];
  return new Float32Array([r[0], u[0], -f[0], 0, r[1], u[1], -f[1], 0, r[2], u[2], -f[2], 0, -dot(r, eye), -dot(u, eye), dot(f, eye), 1]);
}
