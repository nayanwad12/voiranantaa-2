"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { lenisRef } from "@/components/motion/SmoothScroll";
import { buildUniverse, FORMATION_COUNT } from "./formations";

/**
 * The night-time universe behind every page: one cloud of points that
 * re-forms into a different shape for each chapter as the visitor scrolls.
 *
 * Sections mark their shape with `data-form="0..9"`. Pages without sections
 * set `<main data-scene="0..4">` (Sky … Earth) instead.
 */

const vertex = /* glsl */ `
uniform float uTime;
uniform float uW[${FORMATION_COUNT}];
uniform float uMorph;     // 0..1 progress of the current transition
uniform float uTravel;    // tunnel flight distance
uniform float uVel;       // scroll velocity, for light streaks
uniform float uSize;
uniform float uPixelRatio;
${Array.from({ length: FORMATION_COUNT }, (_, i) => `attribute vec3 aF${i};`).join("\n")}
attribute vec3 aColor;
attribute float aSeed;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 tunnel = aF1;
  tunnel.z = mod(tunnel.z + 52.0 + uTravel * (0.6 + aSeed), 60.0) - 52.0;

  vec3 strings = aF2;
  strings.y += sin(strings.x * 1.35 + uTime * 1.7 + strings.y * 4.0) * 0.16 * (0.6 + 0.4 * sin(uTime * 0.7 + strings.y));

  vec3 ratio = aF5;
  vec3 halves = aF4;
  halves *= 1.0 + 0.04 * sin(uTime * 1.2 + aSeed * 6.0) * step(0.0, aF4.x);

  vec3 p = aF0 * uW[0] + tunnel * uW[1] + strings * uW[2] + aF3 * uW[3] + halves * uW[4]
         + ratio * uW[5] + aF6 * uW[6] + aF7 * uW[7] + aF8 * uW[8] + aF9 * uW[9];

  // Between shapes the points scatter, then gather again.
  vec3 dir = normalize(vec3(sin(aSeed * 91.0), cos(aSeed * 57.0), sin(aSeed * 33.0)) + 1e-4);
  p += dir * sin(uMorph * 3.14159) * (0.6 + aSeed * 1.6);

  // Slow drift.
  p += vec3(sin(uTime * 0.31 + aSeed * 40.0), cos(uTime * 0.27 + aSeed * 30.0), sin(uTime * 0.22 + aSeed * 20.0)) * 0.035;

  // Light streaks on fast scroll.
  p.z += uVel * (0.2 + aSeed) * 0.9;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float twinkle = 0.75 + 0.25 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 50.0);
  gl_PointSize = uSize * uPixelRatio * (0.45 + aSeed * 0.9) * twinkle * (9.0 / max(0.5, -mv.z));
  vColor = aColor;
  vAlpha = clamp(1.4 - (-mv.z) / 40.0, 0.15, 1.0);
}
`;

const fragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float core = smoothstep(0.5, 0.0, d);
  float glow = smoothstep(0.5, 0.15, d) * 0.6;
  float a = (core * core + glow * 0.4) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor * (0.65 + core * 0.7), a);
}
`;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Subpages: Sky, Air, Space, Water, Earth → a representative shape. */
const SCENE_TO_FORM = [0, 2, 5, 7, 8];

type Target = { from: number; to: number; mix: number };

function readTarget(): Target {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-form]"));
  if (sections.length === 0) {
    const main = document.querySelector<HTMLElement>("[data-scene]");
    const e = clamp(parseFloat(main?.dataset.scene ?? "0") || 0, 0, 4);
    const i = Math.floor(e);
    return { from: SCENE_TO_FORM[i], to: SCENE_TO_FORM[Math.min(4, i + 1)], mix: e - i };
  }
  const mid = window.innerHeight * 0.5;
  let t: Target = { from: Number(sections[0].dataset.form), to: Number(sections[0].dataset.form), mix: 0 };
  sections.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.top > mid) return;
    const from = Number(el.dataset.form);
    const next = sections[i + 1];
    const to = next ? Number(next.dataset.form) : from;
    const progress = clamp((mid - r.top) / Math.max(1, r.height), 0, 1);
    t = { from, to, mix: from === to ? 0 : smooth(0.62, 1, progress) };
  });
  return t;
}

export function Universe() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if ((nav.hardwareConcurrency ?? 4) <= 2 || nav.connection?.saveData) {
      setFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      setFallback(true);
      return;
    }
    const pixelRatio = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 1);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
    camera.position.set(0, 0, 9);

    const data = buildUniverse(small ? 7000 : 16000);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(data.positions[0], 3));
    data.positions.forEach((arr, i) => geometry.setAttribute(`aF${i}`, new THREE.BufferAttribute(arr, 3)));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(data.colors, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(data.seeds, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 80);

    const weights = new Array(FORMATION_COUNT).fill(0);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 3 },
        uW: { value: weights },
        uMorph: { value: 0 },
        uTravel: { value: 0 },
        uVel: { value: 0 },
        uSize: { value: small ? 2.6 : 2.2 },
        uPixelRatio: { value: pixelRatio },
      },
    });
    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Keep shapes inside narrow screens.
      camera.position.z = w / h < 0.8 ? 9 / Math.max(0.5, (w / h) * 1.15) : 9;
      camera.updateProjectionMatrix();
    };
    resize();

    const state = { from: 0, to: 0, mix: 0, shown: 0 };
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let lastY = window.scrollY;
    let vel = 0;
    let time = 3;
    let travel = 0;
    let last = performance.now();
    let raf = 0;
    let needsRender = true;

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const t = readTarget();
      const changed = t.from !== state.from || t.to !== state.to || Math.abs(t.mix - state.mix) > 1e-4;
      state.from = t.from;
      state.to = t.to;
      // Ease the visible mix towards the scroll-driven one.
      state.mix += (t.mix - state.mix) * (reduced ? 1 : 1 - Math.exp(-dt * 6));

      const y = window.scrollY;
      const rawVel = lenisRef.current?.velocity ?? (y - lastY) / Math.max(dt, 1 / 120) / 60;
      lastY = y;
      vel += (clamp(rawVel, -60, 60) / 60 - vel) * (1 - Math.exp(-dt * 8));

      if (reduced) {
        if (!changed && !needsRender) return;
      } else {
        time += dt;
        travel += dt * 2.2 + Math.abs(vel) * dt * 30;
        pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 2.5));
        pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 2.5));
      }
      needsRender = false;

      weights.fill(0);
      weights[state.from] += 1 - state.mix;
      weights[state.to] += state.mix;
      material.uniforms.uMorph.value = state.from === state.to ? 0 : state.mix;
      material.uniforms.uTime.value = time;
      material.uniforms.uTravel.value = travel;
      material.uniforms.uVel.value = reduced ? 0 : vel;

      const spin = weights[0] + weights[9] + weights[6];
      group.rotation.y = pointer.x * 0.18 + Math.sin(time * 0.08) * 0.12 * (1 - spin);
      group.rotation.x = pointer.y * 0.1 + weights[8] * 0.12;
      group.rotation.z = (weights[0] + weights[9]) * Math.sin(time * 0.05) * 0.15;
      camera.position.x = pointer.x * 0.35;
      camera.position.y = -pointer.y * 0.25 + weights[8] * 0.6;
      camera.lookAt(0, weights[8] * -0.8, 0);

      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") {
        last = performance.now();
        needsRender = true;
        raf = requestAnimationFrame(frame);
      }
    };

    window.addEventListener("resize", resize);
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-lvh w-full bg-black"
      style={
        fallback
          ? {
              background:
                "radial-gradient(circle at 50% 45%, rgba(0,0,0,1) 0 18%, rgba(76,151,255,.22) 26%, rgba(0,0,0,0) 38%), radial-gradient(ellipse at 50% 120%, rgba(76,151,255,.12), transparent 60%), #000",
            }
          : undefined
      }
    />
  );
}
