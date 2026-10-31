/**
 * Smeared light on black — colour drifting through darkness, drawn as one of
 * five elements per chapter (sky, air, fire, water, earth). One fragment
 * shader, rendered at a low resolution (it is meant to be soft) and upscaled;
 * film grain sits on top as a separate overlay.
 */

export const vertexShader = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const fragmentShader = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uDrift;     // scroll position, slowly pushes the field
uniform float uVel;       // scroll speed, stretches the motion blur
uniform vec3 uPal[5];     // main, second, third, highlight, deep
uniform float uAngle;     // direction of motion
uniform float uDensity;   // how much of the frame stays black
uniform vec2 uFocus;      // where the light gathers
uniform float uEl[5];     // how much of each element shows: sky, air, fire, water, earth
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
float fbm3(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v / 0.875;
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float gather(vec2 p) { return smoothstep(1.6, 0.1, length((p - uFocus) * vec2(0.75, 1.0))); }

// SKY: smeared light and a few stars, like a long exposure of the night.
vec3 sky(vec2 p, float t) {
  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t)), fbm(p * 1.1 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.5 + 3.2 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.5 + 3.2 * q + vec2(8.3, 2.8) - t));
  float stretch = 9.0 + abs(uVel) * 4.0;
  vec2 s = rot(uAngle) * (p + r * 0.4);
  float streak = fbm(vec2(s.x * 0.55, s.y * stretch) + vec2(t * 3.5 + uDrift * 0.12, 0.0));
  float streak2 = fbm(vec2(s.x * 0.9, s.y * stretch * 1.6) + vec2(-t * 2.0 + uDrift * 0.07, 4.0));
  float field = fbm(p * 0.9 + 2.6 * r);

  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.25, 0.7, field));
  col = mix(col, uPal[2], smoothstep(0.5, 0.85, r.x) * 0.85);
  col = mix(col, uPal[4], smoothstep(0.55, 0.9, q.y) * 0.7);

  float energy = field * 0.55 + streak * 0.6 + streak2 * 0.25;
  float m = smoothstep(uDensity + 0.03, uDensity + 0.4, energy);
  float focus = gather(p);
  m *= 0.25 + 0.95 * focus;

  vec3 c = col * m * (0.45 + 0.75 * streak);
  float core = pow(smoothstep(0.58, 0.95, streak2 * 0.6 + streak * 0.6), 2.5);
  c += mix(col, uPal[3], 0.6) * core * m * 0.9;
  c += uPal[4] * 0.035 * focus;

  vec2 g = p * 55.0 + vec2(uDrift * 1.5, 0.0);
  vec2 id = floor(g);
  float h = hash(id);
  float star = step(0.975, h) * smoothstep(0.42, 0.0, length(fract(g) - 0.5));
  star *= 0.55 + 0.45 * sin(uTime * (0.8 + h * 2.5) + h * 40.0);
  return c + vec3(0.95, 0.92, 0.86) * star * (1.0 - m) * 0.85;
}

// AIR: thin currents of wind curling across the dark.
vec3 air(vec2 p, float t) {
  float sw = fbm3(p * 0.7 + vec2(t * 0.5, -t * 0.2));
  vec2 w = rot((sw - 0.5) * 2.4) * p;
  vec2 flow = vec2(t * 1.6 + uDrift * 0.1, t * 0.4);
  float n = fbm(w * vec2(0.8, 2.4) + flow);
  float n2 = fbm3(w * vec2(1.6, 4.0) - flow * 1.3 + 5.0);
  float lines = pow(1.0 - abs(sin((n * 9.0 + w.y * 2.0) * 3.14159)), 12.0);
  float lines2 = pow(1.0 - abs(sin((n2 * 7.0 - w.y * 1.5) * 3.14159)), 18.0);
  float veil = smoothstep(uDensity, uDensity + 0.42, n);

  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.3, 0.8, n2));
  col = mix(col, uPal[2], smoothstep(0.55, 0.9, sw) * 0.6);
  vec3 c = col * veil * 0.5;
  c += mix(col, uPal[3], 0.5) * (lines * 0.9 + lines2 * 0.6) * (0.3 + 0.7 * veil);
  return c * (0.35 + 0.8 * gather(p));
}

// FIRE: flame rising from below, with embers drifting up.
vec3 fire(vec2 p, float t) {
  float rise = t * 7.0;
  vec2 q = p;
  q.x += (fbm3(vec2(p.y * 1.5 - rise * 0.6, t)) - 0.5) * 0.35;
  float n1 = fbm(vec2(q.x * 3.2, q.y * 1.0 - rise));
  float n2 = fbm(vec2(q.x * 6.0 + n1 * 2.0, q.y * 2.0 - rise * 1.5) + 3.7);
  float flame = n1 * 0.65 + n2 * 0.75 - (q.y + 0.55) * 0.85;
  float body = smoothstep(0.05, 0.55, flame);
  float core = smoothstep(0.3, 0.85, flame);

  vec3 col = mix(uPal[4], uPal[0], body);
  col = mix(col, uPal[1], core);
  col = mix(col, uPal[3], pow(core, 3.0) * 0.6);
  vec3 c = col * body * (0.6 + 0.6 * n2);

  vec2 g = vec2(p.x, p.y - rise * 0.25) * 22.0;
  vec2 id = floor(g);
  float h = hash(id);
  vec2 off = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
  float ember = step(0.93, h) * smoothstep(0.24, 0.0, length(fract(g) - 0.5 - off * 0.5));
  ember *= 0.5 + 0.5 * sin(uTime * 4.0 + h * 50.0);
  c += mix(uPal[1], uPal[3], 0.3) * ember * smoothstep(0.9, -0.3, p.y) * 0.9;
  c += uPal[4] * smoothstep(0.6, -0.6, p.y) * 0.18;
  return c * 0.9;
}

// WATER: slow swell, long currents and caustic light near the surface.
vec3 water(vec2 p, float t) {
  vec2 q = p * vec2(1.0, 1.3);
  float swell = fbm(q * 0.8 + vec2(t * 1.2 + uDrift * 0.08, t * 0.3));
  float swell2 = fbm3(q * 1.6 - vec2(t * 0.9, -t * 0.4) + 2.0);
  vec2 cp = (q + vec2(swell, swell2) * 0.6) * 5.0;
  float r1 = 1.0 - abs(noise(cp + vec2(t * 2.0, 0.0)) * 2.0 - 1.0);
  float r2 = 1.0 - abs(noise(cp * 1.3 + vec2(-t * 1.6, t) + 4.0) * 2.0 - 1.0);
  float caustic = pow(r1 * r2, 5.0);
  float current = fbm(vec2(q.x * 0.5 - t * 2.5, q.y * 7.0 + swell * 2.0));
  float depth = smoothstep(-0.7, 0.6, p.y);

  vec3 col = mix(uPal[4], uPal[0], smoothstep(0.3, 0.75, swell));
  col = mix(col, uPal[1], smoothstep(0.5, 0.85, swell2) * 0.7);
  float m = smoothstep(uDensity - 0.2, uDensity + 0.25, swell * 0.7 + swell2 * 0.4);
  m *= 0.45 + 0.7 * gather(p);
  vec3 c = col * m * (0.6 + 0.9 * current) * (0.7 + 0.6 * depth) * 0.62;
  c += mix(uPal[2], uPal[3], 0.4) * caustic * m * (0.6 + 0.7 * depth) * 1.0;
  return c;
}

// EARTH: layered strata, folded slowly, with bright mineral veins.
vec3 earth(vec2 p, float t) {
  float n = fbm(p * 1.1 + vec2(t * 0.35 + uDrift * 0.05, 0.0));
  float warp = fbm(p * 0.7 + n * 1.6 + vec2(0.0, t * 0.2));
  float y = p.y * 7.0 + warp * 3.0 + n * 1.0;
  float bands = 0.5 + 0.5 * sin(y * 2.4);
  float fine = 0.5 + 0.5 * sin(y * 7.0 + n * 6.0);
  float vein = pow(1.0 - abs(sin(y * 1.3 + warp * 4.0)), 16.0);
  float m = smoothstep(uDensity - 0.25, uDensity + 0.3, warp * 0.7 + bands * 0.35);
  m *= 0.45 + 0.7 * gather(p);

  vec3 col = mix(uPal[4], uPal[0], smoothstep(0.2, 0.9, bands));
  col = mix(col, uPal[1], fine * smoothstep(0.45, 0.8, n) * 0.55);
  col = mix(col, uPal[2], smoothstep(0.55, 0.85, warp) * 0.5);
  vec3 c = col * m * (0.45 + 0.55 * fine) * 0.62;
  return c + uPal[3] * vein * m * 0.3;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.035;

  // Only the elements in view are drawn; chapters cross-fade between two.
  vec3 c = vec3(0.0);
  if (uEl[0] > 0.002) c += sky(p, t) * uEl[0];
  if (uEl[1] > 0.002) c += air(p, t) * uEl[1];
  if (uEl[2] > 0.002) c += fire(p, t) * uEl[2];
  if (uEl[3] > 0.002) c += water(p, t) * uEl[3];
  if (uEl[4] > 0.002) c += earth(p, t) * uEl[4];

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

/** Brand swatches + the deep reds, browns and blues of the reference imagery. */
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
  abyss: hex("#00182E"),
};

/** The element each mood is drawn as (index into uEl). */
const [SKY, AIR, FIRE, WATER, EARTH] = [0, 1, 2, 3, 4];

export type Scene = { el: number; pal: [RGB, RGB, RGB, RGB, RGB]; angle: number; density: number; focus: [number, number] };

/** One mood per section (data-form 0–11), grouped by the chapter's element. */
export const SCENES: Scene[] = [
  // 0 hero — embers around the name
  { el: SKY, pal: [C.red, C.ember, C.mustard, C.bone, C.oxblood], angle: 0.25, density: 0.42, focus: [0.0, 0.0] },
  // 1 idea — red against deep blue, diagonal motion
  { el: SKY, pal: [C.red, C.navy, C.sky, C.bone, C.oxblood], angle: -0.55, density: 0.44, focus: [0.25, -0.05] },
  // 2 theme — wind in pale blue and amber
  { el: AIR, pal: [C.sky, C.teal, C.mustard, C.bone, C.navy], angle: 0.05, density: 0.43, focus: [-0.2, 0.05] },
  // 3 rasas — wind through olive and blue
  { el: AIR, pal: [C.olive, C.sky, C.mustard, C.bone, C.teal], angle: 0.4, density: 0.42, focus: [0.1, 0.1] },
  // 4 categories — the fire is lit
  { el: FIRE, pal: [C.red, C.ember, C.mustard, C.bone, C.oxblood], angle: -0.2, density: 0.45, focus: [0.0, 0.0] },
  // 5 challenge — material heat
  { el: FIRE, pal: [C.red, C.mustard, C.ember, C.bone, C.oxblood], angle: 0.7, density: 0.42, focus: [-0.3, 0.0] },
  // 6 live — deep water under stage light
  { el: WATER, pal: [C.navy, C.teal, C.sky, C.bone, C.abyss], angle: -0.9, density: 0.44, focus: [0.3, 0.1] },
  // 7 journey — teal currents
  { el: WATER, pal: [C.teal, C.navy, C.sky, C.bone, C.abyss], angle: 0.15, density: 0.45, focus: [0.0, -0.1] },
  // 8 vision — mineral warmth
  { el: EARTH, pal: [C.ember, C.mustard, C.olive, C.bone, C.oxblood], angle: 0.5, density: 0.44, focus: [0.0, -0.25] },
  // 9 finale — everything at once
  { el: EARTH, pal: [C.red, C.olive, C.mustard, C.bone, C.oxblood], angle: -0.35, density: 0.4, focus: [0.0, 0.0] },
  // 10 how to / selection — olive strata
  { el: EARTH, pal: [C.olive, C.ember, C.mustard, C.bone, C.oxblood], angle: 0.2, density: 0.45, focus: [0.2, 0.0] },
  // 11 attend — clay and teal
  { el: EARTH, pal: [C.ember, C.teal, C.mustard, C.bone, C.oxblood], angle: -0.1, density: 0.44, focus: [-0.2, 0.1] },
];
