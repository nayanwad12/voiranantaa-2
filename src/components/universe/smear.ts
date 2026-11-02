/**
 * Soft, defocused light on black, like an out-of-focus photograph: a few
 * large pools of colour drift slowly through darkness, with one broad sweep
 * of light across them. Each chapter has its element's colours (sky, air,
 * fire, water, earth). Rendered at a low resolution (it is meant to be soft)
 * and upscaled; film grain sits on top as a separate overlay.
 */

export const vertexShader = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const fragmentShader = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uDrift;     // scroll position, nudges the lights along their paths
uniform vec3 uPal[5];     // deep, main, second, light, accent
uniform float uAngle;     // direction of the sweep of light
uniform vec2 uFocus;      // where the light gathers
uniform float uLevel;     // overall brightness, kept low enough for text
uniform float uDim;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
// Few, low octaves: shapes stay soft, never detailed.
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v / 0.875;
}
vec2 orbit(vec2 base, float speed, float phase, float t) {
  return base + vec2(sin(t * speed + phase), cos(t * speed * 0.8 + phase * 1.7)) * 0.28;
}
float pool(vec2 p, vec2 c, float r) {
  vec2 d = p - c;
  return exp(-dot(d, d) / (r * r));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.05 + uDrift * 0.04;

  // A slow liquid warp keeps the edges organic.
  vec2 w = p + (vec2(fbm(p * 0.7 + vec2(t, 0.0)), fbm(p * 0.7 + vec2(3.1, -t))) - 0.5) * 0.5;
  vec2 f = uFocus;

  float g1 = pool(w, orbit(f + vec2(-0.65, 0.2), 0.9, 0.0, t), 0.65);
  float g2 = pool(w, orbit(f + vec2(0.7, -0.15), 0.7, 2.1, t), 0.7);
  float g3 = pool(w, orbit(f + vec2(0.05, -0.5), 0.5, 4.2, t), 0.55);

  // One broad, soft sweep of light across the pools.
  vec2 dir = vec2(cos(uAngle), sin(uAngle));
  vec2 q = w - f - vec2(sin(t * 0.6), cos(t * 0.5)) * 0.12;
  float across = dot(q, vec2(-dir.y, dir.x));
  float along = dot(q, dir);
  float sweep = exp(-across * across / 0.07) * exp(-along * along / 0.9);

  vec3 col = uPal[0];
  col = mix(col, uPal[4], g3 * 0.9);
  col = mix(col, uPal[1], g1);
  col = mix(col, uPal[2], g2 * 0.9);
  col = mix(col, uPal[3], sweep * 0.5);

  // Darkness between the lights (a smooth union, so the pools never crease).
  float light = 1.0 - (1.0 - g1) * (1.0 - g2 * 0.9) * (1.0 - g3 * 0.8) * (1.0 - sweep);
  col *= mix(0.2, 1.0, smoothstep(0.0, 0.75, light));
  col *= uLevel;

  vec2 uv = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - dot(uv, uv) * 1.2;
  col *= 1.0 - uDim * 0.55;
  // Dither so the smooth gradients never show steps.
  col += (hash(gl_FragCoord.xy + fract(uTime) * 17.0) - 0.5) * (2.0 / 255.0);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Element colours, leaning on the brand swatches (navy, mustard). */
const C = {
  black: hex("#000000"),
  // hero: night blue with red, blue and olive light
  night: hex("#02060F"),
  scarlet: hex("#E3281A"),
  glow: hex("#2C63C0"),
  moss: hex("#4E7A1E"),
  // sky: black and purple
  plum: hex("#3B1466"),
  violet: hex("#6A2FA0"),
  lavender: hex("#B49AD8"),
  indigo: hex("#1C0F3A"),
  // air: light blue and lemon yellow
  airBlue: hex("#9ED3F5"),
  lemon: hex("#F0E64A"),
  mist: hex("#F4F6D8"),
  steel: hex("#5E9BD1"),
  airDeep: hex("#05080C"),
  // fire: yellow and orange
  orange: hex("#E8661A"),
  mustard: hex("#E2BE22"),
  flame: hex("#FFE9A0"),
  ember: hex("#A8320C"),
  fireDeep: hex("#0A0300"),
  // water: blue and black
  navy: hex("#003E76"),
  blue: hex("#1E5FA8"),
  foam: hex("#8FB8E0"),
  abyss: hex("#001428"),
  // earth: brown, orange and black
  brown: hex("#5A3216"),
  clay: hex("#C8641E"),
  sand: hex("#D9A46A"),
};

export type Scene = { pal: [RGB, RGB, RGB, RGB, RGB]; angle: number; focus: [number, number]; level: number };

/** One mood per section (data-form 0–11), grouped by the chapter's element. */
export const SCENES: Scene[] = [
  // 0 hero — red at the left, blue at the right, olive below, on night blue
  { pal: [C.night, C.scarlet, C.blue, C.glow, C.moss], angle: 0.6, focus: [0.05, 0.0], level: 0.95 },
  // 1 idea — sky
  { pal: [C.black, C.violet, C.indigo, C.lavender, C.black], angle: -0.6, focus: [-0.25, -0.05], level: 0.8 },
  // 2 theme — air
  { pal: [C.airDeep, C.airBlue, C.lemon, C.mist, C.steel], angle: 0.8, focus: [0.2, 0.1], level: 0.75 },
  // 3 rasas — air
  { pal: [C.airDeep, C.lemon, C.airBlue, C.mist, C.steel], angle: -0.5, focus: [-0.2, -0.1], level: 0.72 },
  // 4 categories — fire
  { pal: [C.fireDeep, C.orange, C.mustard, C.flame, C.ember], angle: 1.1, focus: [0.0, -0.1], level: 0.88 },
  // 5 challenge — fire
  { pal: [C.fireDeep, C.mustard, C.orange, C.flame, C.ember], angle: -0.7, focus: [0.3, 0.05], level: 0.88 },
  // 6 live — water
  { pal: [C.black, C.navy, C.blue, C.foam, C.black], angle: 0.6, focus: [-0.2, 0.1], level: 0.9 },
  // 7 journey — water
  { pal: [C.black, C.blue, C.abyss, C.foam, C.black], angle: -0.8, focus: [0.25, -0.05], level: 0.9 },
  // 8 vision — earth
  { pal: [C.black, C.brown, C.clay, C.sand, C.black], angle: 0.9, focus: [0.0, 0.0], level: 0.8 },
  // 9 finale — earth
  { pal: [C.black, C.clay, C.brown, C.sand, C.black], angle: -0.5, focus: [0.1, 0.1], level: 0.82 },
  // 10 how to / selection — earth
  { pal: [C.black, C.brown, C.clay, C.sand, C.black], angle: 0.4, focus: [-0.25, 0.0], level: 0.76 },
  // 11 attend — earth
  { pal: [C.black, C.clay, C.brown, C.sand, C.black], angle: -0.9, focus: [0.2, -0.1], level: 0.8 },
];
