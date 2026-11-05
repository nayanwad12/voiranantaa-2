/**
 * The hero's galaxy: a 3D field of white particles on black. A tilted vortex
 * of dotted rings and spiral arms turns slowly (inner orbits faster), a stream
 * of particles flows out of its centre, chains of glowing beads orbit with it,
 * and a deep starfield surrounds everything. All motion runs on the GPU; the
 * page only moves the camera.
 */

export const galaxyVertex = /* glsl */ `
attribute vec3 aPos;
attribute vec4 aData;     // kind, speed, size, phase
uniform mat4 uProj;
uniform mat4 uView;
uniform mat3 uTilt;       // orientation of the vortex disk
uniform float uTime;
uniform float uScale;     // pixels per world unit at distance 1
uniform float uDpr;
varying float vBright;
varying float vGlow;

const vec3 JET = vec3(0.98, 0.06, -0.2);
const vec3 JET_U = vec3(-0.06, 1.0, 0.0);
const vec3 JET_V = vec3(0.2, 0.0, 0.98);

vec3 spin(vec3 p, float a) {
  float c = cos(a), s = sin(a);
  return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
}

void main() {
  float kind = aData.x;
  float speed = aData.y;
  float phase = aData.w;
  vec3 p = aPos;
  float bright = 1.0;

  if (kind < 0.5) {
    // Stars: the whole sky turns very slowly.
    p = spin(p, uTime * 0.006);
  } else if (kind < 1.5) {
    // Vortex dust: orbits the disk's axis; speed falls off with radius.
    p = uTilt * spin(p, uTime * speed);
  } else if (kind < 2.5) {
    // Stream: flows out of the centre and widens, fading at both ends.
    float len = 3.6;
    float x = mod(p.x + uTime * speed, len);
    float spread = 0.025 + x * 0.085;
    p = JET * (x + 0.08) + JET_U * p.y * spread + JET_V * p.z * spread;
    bright = smoothstep(0.0, 0.35, x) * (1.0 - smoothstep(len * 0.55, len, x));
  } else {
    // Beads: glowing chains that orbit with the vortex.
    p = uTilt * spin(p, uTime * speed);
  }

  vec4 mv = uView * vec4(p, 1.0);
  float depth = max(-mv.z, 0.05);
  gl_Position = uProj * mv;

  float px = aData.z * uScale / depth;
  // Points thinner than a pixel stay one pixel and dim instead, so they never shimmer.
  bright *= clamp(px, 0.0, 1.0);
  gl_PointSize = clamp(px, 1.0, 90.0) * uDpr;

  // Dust brightens towards the core; stars and beads keep their own light.
  float gain = kind > 1.5 && kind < 2.5 ? 1.7 : kind > 0.5 && kind < 1.5 ? 1.5 * (1.35 - clamp(length(aPos.xz) * 0.3, 0.0, 0.9)) : kind > 2.5 ? 1.6 : 1.1;
  bright *= gain * (0.72 + 0.28 * sin(uTime * (0.8 + fract(phase * 7.31) * 2.2) + phase * 6.2831));
  bright *= smoothstep(24.0, 7.0, depth) * smoothstep(0.12, 0.7, depth);
  vBright = bright * fract(phase * 3.17 + 0.37) * 0.55 + bright * 0.45;
  vGlow = step(0.026, aData.z);
}
`;

export const galaxyFragment = /* glsl */ `
precision mediump float;
varying float vBright;
varying float vGlow;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float disc = smoothstep(0.5, 0.05, d);
  float halo = exp(-d * d * 14.0) * 0.75 + smoothstep(0.17, 0.04, d);
  float a = mix(disc * disc, halo, vGlow);
  gl_FragColor = vec4(vec3(1.0, 0.975, 0.94) * a * vBright, 1.0);
}
`;

/** Small deterministic random, so the galaxy looks the same on every visit. */
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

const STAR = 0;
const DUST = 1;
const STREAM = 2;
const BEAD = 3;

/** Builds every particle: position (xyz) and data (kind, speed, size, phase). */
export function buildGalaxy(density: number) {
  const r = rng(7);
  const gauss = () => {
    const u = Math.max(r(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
  };
  const pos: number[] = [];
  const data: number[] = [];
  const add = (x: number, y: number, z: number, kind: number, speed: number, size: number) => {
    pos.push(x, y, z);
    data.push(kind, speed, size, r());
  };
  const orbit = (rad: number) => 0.34 / (rad + 0.25);
  // The disk sinks towards its centre, like a funnel.
  const well = (rad: number) => -0.42 * Math.exp(-rad * 1.5);
  const n = (count: number) => Math.round(count * density);

  // Stars: a deep shell around the scene, a few of them large and glowing.
  for (let i = 0; i < n(2600); i++) {
    const u = r() * 2 - 1;
    const a = r() * Math.PI * 2;
    const d = 5 + r() * 11;
    const s = Math.sqrt(1 - u * u);
    const big = r() < 0.03;
    add(Math.cos(a) * s * d, u * d, Math.sin(a) * s * d, STAR, 0, big ? 0.09 + r() * 0.1 : 0.012 + r() * 0.018);
  }

  // Vortex rings: dotted, slightly uneven orbits.
  for (let k = 0; k < 34; k++) {
    const rad = 0.18 + k * 0.066;
    const count = n(60 + rad * 150);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + r() * 0.01;
      const rr = rad * (1 + 0.06 * Math.sin(3 * a + k)) + gauss() * 0.004;
      add(Math.cos(a) * rr, well(rr) + gauss() * 0.012, Math.sin(a) * rr, DUST, orbit(rr), 0.0055 + r() * 0.0045);
    }
  }

  // Spiral arms: curving filaments through the rings.
  for (let i = 0; i < n(3200); i++) {
    const rad = 0.2 + Math.pow(r(), 1.3) * 2.4;
    const arm = Math.floor(r() * 2);
    const a = arm * Math.PI + Math.log(rad) * 2.4 + gauss() * 0.14;
    add(Math.cos(a) * rad, well(rad) + gauss() * 0.04, Math.sin(a) * rad, DUST, orbit(rad), 0.006 + r() * 0.005);
  }

  // Halo: loose dust around the disk, gathering towards the core.
  for (let i = 0; i < n(3400); i++) {
    const rad = Math.pow(r(), 1.4) * 3.1;
    const a = r() * Math.PI * 2;
    add(Math.cos(a) * rad, gauss() * 0.35 * (0.3 + rad * 0.25), Math.sin(a) * rad, DUST, orbit(rad) * 0.6, 0.006 + r() * 0.006);
  }

  // Core: a dense, bright knot at the centre.
  for (let i = 0; i < n(1800); i++) {
    const rad = 0.04 + Math.pow(r(), 2) * 0.55;
    const a = r() * Math.PI * 2;
    add(Math.cos(a) * rad, gauss() * 0.05, Math.sin(a) * rad, DUST, orbit(rad), 0.006 + r() * 0.006);
  }

  // The stream out of the centre.
  for (let i = 0; i < n(3400); i++) {
    add(r() * 3.6, gauss(), gauss(), STREAM, 0.22 + r() * 0.12, 0.007 + r() * 0.006);
  }

  // Bead chains: glowing dots in short arcs, shrinking along each chain.
  const chains = [
    { rad: 2.05, y: 0.35, from: 2.2, beads: 8 },
    { rad: 0.5, y: -0.04, from: 4.1, beads: 6 },
    { rad: 1.55, y: -0.32, from: 5.4, beads: 7 },
  ];
  for (const c of chains) {
    for (let i = 0; i < c.beads; i++) {
      const a = c.from + i * 0.11;
      const t = i / (c.beads - 1);
      add(Math.cos(a) * c.rad, c.y + t * 0.05, Math.sin(a) * c.rad, BEAD, orbit(c.rad) * 0.5, 0.11 - t * 0.06);
    }
  }

  return { pos: new Float32Array(pos), data: new Float32Array(data), count: pos.length / 3 };
}

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
  const cx = Math.cos(ax), sx = Math.sin(ax), cz = Math.cos(az), sz = Math.sin(az);
  // Rz * Rx
  return new Float32Array([cz, sz, 0, -sz * cx, cz * cx, sx, sz * sx, -cz * sx, cx]);
}
