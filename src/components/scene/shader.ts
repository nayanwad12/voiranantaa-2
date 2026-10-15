/**
 * One fragment shader, five elemental looks — Sky, Air, Space, Water, Earth.
 * The CPU passes a weight per element (only two are ever non-zero), so the
 * descent blends continuously from one world into the next.
 */

export const vertexShader = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec4 uW;      // sky, air, space, water
uniform float uW4;    // earth
uniform float uDim;   // 0..1 darken for text-heavy pages
uniform float uDrift; // slow scroll-linked parallax
uniform vec2 uPointer;

const vec3 BLACK = vec3(0.020, 0.027, 0.051);
const vec3 DEEP  = vec3(0.055, 0.090, 0.260);
const vec3 BLUE  = vec3(0.298, 0.592, 1.000);
const vec3 ICE   = vec3(0.780, 0.870, 1.000);
const vec3 PINK  = vec3(1.000, 0.455, 0.800);
const vec3 GREEN = vec3(0.745, 1.000, 0.294);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float stars(vec2 p, float scale, float density, float t) {
  vec2 g = p * scale;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash(id);
  vec2 off = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
  float d = length(f - off * 0.7);
  float size = mix(0.02, 0.09, h * h * h);
  float twinkle = 0.55 + 0.45 * sin(t * (0.6 + h * 2.4) + h * 40.0);
  return step(density, h) * (1.0 - smoothstep(0.0, size, d)) * twinkle;
}

float thinLine(float d, float px) {
  return 1.0 - smoothstep(0.0, px, abs(d));
}

// ---------------------------------------------------------------- 01 SKY
vec3 sky(vec2 p, float t, float px) {
  vec3 c = mix(DEEP * 0.42, BLACK, smoothstep(-1.0, 0.7, p.y));
  c += BLUE * 0.10 * exp(-abs(p.y + 1.0) * 2.6);
  c += BLUE * 0.10 * exp(-length(p - vec2(0.75, 0.55)) * 3.2);
  vec2 q = p + vec2(0.0, uDrift * 0.04);
  float s = stars(q, 26.0, 0.86, t) * 1.2
          + stars(q * 1.4 + 11.0, 60.0, 0.80, t) * 0.75
          + stars(q * 0.9 + 4.0, 130.0, 0.78, t) * 0.4;
  c += s * ICE;
  return c;
}

// ---------------------------------------------------------------- 02 AIR
vec3 air(vec2 p, float t, float px) {
  vec3 c = mix(DEEP * 0.30, BLACK, smoothstep(-1.2, 1.0, p.y));
  for (int i = 1; i <= 3; i++) {
    float k = float(i);
    float n = fbm(p * vec2(0.9, 2.2) * k + vec2(t * 0.025 * k + uDrift * 0.02, k * 7.0));
    c += mix(BLUE, ICE, 0.25 * k) * 0.065 * smoothstep(0.48, 0.9, n);
  }
  // Drifting particles.
  vec2 g = (p + vec2(t * 0.012, -t * 0.035 - uDrift * 0.03)) * 7.0;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash(id);
  vec2 off = vec2(hash(id + 1.7), hash(id + 9.2)) - 0.5;
  float d = length(f - off * 0.6);
  c += ICE * (1.0 - smoothstep(0.0, 0.05 + 0.08 * h, d)) * step(0.9, h) * 0.32;
  c += stars(p * 1.2 + 3.0, 70.0, 0.9, t) * ICE * 0.35;
  // A fine pink light trail — accent in a small dose.
  float y = 0.18 * sin(p.x * 1.4 + t * 0.18) - 0.32;
  float fade = smoothstep(-0.2, 1.0, sin(p.x * 1.6 - t * 0.45));
  c += PINK * thinLine(p.y - y, px * 1.4) * fade * 0.55;
  return c;
}

// ---------------------------------------------------------------- 03 SPACE
vec3 space(vec2 p, float t, float px) {
  vec2 q = p - vec2(0.0, 0.02);
  float r = length(q);
  float a = atan(q.y, q.x);
  float n = fbm(vec2(a * 1.5 + t * 0.04, r * 3.0 - t * 0.12));
  float wob = 0.07 * (n - 0.5) + 0.015 * sin(a * 3.0 + t * 0.3);
  float ringR = 0.46 + wob;
  float ring = exp(-pow((r - ringR) * 8.0, 2.0));
  float fibres = 0.5 + 0.5 * sin(a * 110.0 + n * 14.0 - t * 0.4);
  vec3 c = BLACK;
  c += DEEP * fbm(q * 1.8 + vec2(t * 0.015, -uDrift * 0.02)) * 0.9 * (1.0 - smoothstep(0.1, 1.5, r));
  c += BLUE * ring * (0.35 + 0.9 * fibres * n);
  c += ICE * pow(ring, 7.0) * 0.55 * smoothstep(0.35, 0.8, n);
  // Void at the centre.
  c *= 0.15 + 0.85 * smoothstep(0.08, 0.36, r);
  // The concentric ring motif — blue, soft blue, pink.
  c += BLUE * 0.30 * thinLine(r - 0.78, px * 1.2);
  c += ICE * 0.16 * thinLine(r - 0.68, px * 1.2);
  c += PINK * 0.22 * thinLine(r - 0.585, px * 1.2) * smoothstep(-1.0, 1.0, sin(a + t * 0.15));
  c += stars(p + 2.0, 80.0, 0.86, t) * ICE * 0.5;
  return c;
}

// ---------------------------------------------------------------- 04 WATER
float caustic(vec2 p, float t) {
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}

vec3 water(vec2 p, float t, float px) {
  vec3 c = mix(DEEP * 0.55, BLACK, smoothstep(-1.4, 1.0, p.y));
  vec2 cp = p * 2.4 + vec2(0.0, uDrift * 0.05);
  float k = caustic(mod(cp, 6.2831) - 6.2831 * 0.5 + 3.14, t * 0.22);
  c += mix(BLUE, ICE, 0.35) * clamp(k, 0.0, 1.0) * 0.30;
  // Ripples from the pointer.
  float dr = length(p - uPointer);
  c += BLUE * 0.07 * sin(dr * 38.0 - t * 1.8) * exp(-dr * 2.6);
  // Mirrored light on the surface.
  float shimmer = 0.012 * sin(p.x * 26.0 + t * 1.3) + 0.006 * sin(p.x * 61.0 - t * 2.1);
  c += ICE * exp(-abs(p.y + 0.42 + shimmer) * 70.0) * 0.18;
  c += ICE * exp(-abs(p.y + 0.55 - shimmer) * 120.0) * 0.07;
  c *= 0.6 + 0.4 * smoothstep(1.2, -0.4, p.y);
  return c;
}

// ---------------------------------------------------------------- 05 EARTH
vec3 earth(vec2 p, float t, float px) {
  vec2 q = p + vec2(0.0, uDrift * 0.05);
  float warp = fbm(q * 1.8 + vec2(0.0, t * 0.01));
  float n = fbm(q * 2.6 + warp * 1.6);
  float ridged = 1.0 - abs(2.0 * fbm(q * 4.5 + warp + 3.0) - 1.0);
  float veins = pow(ridged, 9.0);
  vec3 c = mix(BLACK, vec3(0.075, 0.085, 0.12), smoothstep(0.25, 0.85, n));
  c += BLUE * veins * 0.26;
  // Mineral glints — mostly ice-white, very occasionally neon green.
  vec2 g = floor(q * 150.0);
  float s = stars(q, 150.0, 0.93, t * 0.7);
  c += s * mix(ICE, GREEN, step(0.92, hash(g + 5.0))) * 0.7;
  c *= 0.55 + 0.6 * smoothstep(-1.2, 1.0, p.y);
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * 2.0;
  float px = 2.0 / uRes.y;
  float t = uTime;

  vec3 c = vec3(0.0);
  if (uW.x > 0.001) c += uW.x * sky(p, t, px);
  if (uW.y > 0.001) c += uW.y * air(p, t, px);
  if (uW.z > 0.001) c += uW.z * space(p, t, px);
  if (uW.w > 0.001) c += uW.w * water(p, t, px);
  if (uW4 > 0.001) c += uW4 * earth(p, t, px);

  c *= 1.0 - uDim * 0.6;
  vec2 v = uv - 0.5;
  c *= 1.0 - dot(v, v) * 0.9;
  c += (hash(gl_FragCoord.xy + fract(t) * 100.0) - 0.5) * 0.018;
  gl_FragColor = vec4(max(c, 0.0), 1.0);
}
`;
