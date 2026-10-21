/**
 * Smeared light on black — motion-blurred colour drifting through darkness,
 * like a long exposure of a moving body. One fragment shader, rendered at a
 * low resolution (it is meant to be soft) and upscaled; film grain sits on
 * top as a separate overlay.
 */

export const vertexShader = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const fragmentShader = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uDrift;     // scroll position, slowly pushes the smears
uniform float uVel;       // scroll speed, stretches the motion blur
uniform vec3 uPal[5];     // main, second, third, highlight, deep
uniform float uAngle;     // direction of motion
uniform float uDensity;   // how much of the frame stays black
uniform vec2 uFocus;      // where the light gathers
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
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.035;

  // Domain warp: liquid, folding colour.
  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t)), fbm(p * 1.1 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.5 + 3.2 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.5 + 3.2 * q + vec2(8.3, 2.8) - t));

  // Motion blur: noise stretched along the direction of travel.
  float stretch = 9.0 + abs(uVel) * 4.0;
  vec2 s = rot(uAngle) * (p + r * 0.4);
  float streak = fbm(vec2(s.x * 0.55, s.y * stretch) + vec2(t * 3.5 + uDrift * 0.12, 0.0));
  float streak2 = fbm(vec2(s.x * 0.9, s.y * stretch * 1.6) + vec2(-t * 2.0 + uDrift * 0.07, 4.0));

  float field = fbm(p * 0.9 + 2.6 * r);

  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.25, 0.7, field));
  col = mix(col, uPal[2], smoothstep(0.5, 0.85, r.x) * 0.85);
  col = mix(col, uPal[4], smoothstep(0.55, 0.9, q.y) * 0.7);

  // Most of the frame is darkness; light gathers around the focus.
  float energy = field * 0.55 + streak * 0.6 + streak2 * 0.25;
  float m = smoothstep(uDensity + 0.03, uDensity + 0.4, energy);
  float focus = smoothstep(1.5, 0.05, length((p - uFocus) * vec2(0.8, 1.0)));
  m *= 0.25 + 0.95 * focus;

  vec3 c = col * m * (0.45 + 0.75 * streak);
  // Bright cores of the streaks pick up the highlight colour.
  float core = pow(smoothstep(0.58, 0.95, streak2 * 0.6 + streak * 0.6), 2.5);
  c += mix(col, uPal[3], 0.6) * core * m * 0.9;
  // A faint warm haze so blacks are never dead.
  c += uPal[4] * 0.035 * focus;

  vec2 uv = gl_FragCoord.xy / uRes - 0.5;
  c *= 1.0 - dot(uv, uv) * 1.1;
  c *= 1.0 - uDim * 0.55;
  gl_FragColor = vec4(max(c, 0.0), 1.0);
}
`;

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Brand swatches + the deep reds and browns of the reference imagery. */
const C = {
  navy: hex("#003E76"),
  mustard: hex("#E2BE22"),
  olive: hex("#6E9D00"),
  red: hex("#E31F14"),
  teal: hex("#39664E"),
  ember: hex("#6D2818"),
  oxblood: hex("#5B0D07"),
  bone: hex("#CCC4BD"),
  sky: hex("#3A6FB0"),
};

export type Scene = { pal: [RGB, RGB, RGB, RGB, RGB]; angle: number; density: number; focus: [number, number] };

/** One mood per chapter shape (data-form 0–9). */
export const SCENES: Scene[] = [
  // 0 hero — embers around the name
  { pal: [C.red, C.ember, C.mustard, C.bone, C.oxblood], angle: 0.25, density: 0.42, focus: [0.0, 0.0] },
  // 1 idea — red against deep blue, diagonal motion
  { pal: [C.red, C.navy, C.sky, C.bone, C.oxblood], angle: -0.55, density: 0.44, focus: [0.25, -0.05] },
  // 2 theme — a melody: olive and amber, horizontal
  { pal: [C.olive, C.red, C.mustard, C.bone, C.ember], angle: 0.05, density: 0.43, focus: [-0.2, 0.05] },
  // 3 rasas — every colour
  { pal: [C.red, C.sky, C.olive, C.mustard, C.oxblood], angle: 0.4, density: 0.42, focus: [0.0, 0.1] },
  // 4 categories — blue and teal
  { pal: [C.navy, C.teal, C.red, C.bone, C.oxblood], angle: -0.2, density: 0.45, focus: [0.0, 0.0] },
  // 5 challenge — material heat
  { pal: [C.red, C.mustard, C.ember, C.bone, C.oxblood], angle: 0.7, density: 0.42, focus: [-0.3, 0.0] },
  // 6 live — stage light
  { pal: [C.navy, C.red, C.sky, C.bone, C.oxblood], angle: -0.9, density: 0.44, focus: [0.3, 0.1] },
  // 7 journey / how to — teal and olive
  { pal: [C.teal, C.olive, C.mustard, C.bone, C.ember], angle: 0.15, density: 0.45, focus: [0.0, -0.1] },
  // 8 earth — mineral warmth
  { pal: [C.ember, C.mustard, C.olive, C.bone, C.oxblood], angle: 0.5, density: 0.44, focus: [0.0, -0.25] },
  // 9 finale — everything at once
  { pal: [C.red, C.navy, C.olive, C.mustard, C.oxblood], angle: -0.35, density: 0.4, focus: [0.0, 0.0] },
];
