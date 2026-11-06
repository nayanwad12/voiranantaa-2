"use client";

import { useEffect, useRef, useState } from "react";
import {
  BAND,
  basis,
  buildStars,
  CORE,
  eyeAt,
  lookAt,
  perspective,
  SCENES,
  skyFragment,
  skyVertex,
  starFragment,
  starVertex,
  viewMatrix,
} from "./sky";
import skyStill from "./sky-still.jpg";

/**
 * The night sky behind the whole page. Scrolling pans the camera across the
 * sky and glides it forward through near stars; sections name their mood with
 * `data-form="0..11"`, which can tint the sky with a faint nebula colour.
 * Everything eases, so the sky always moves smoothly.
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function readTarget() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-form]"));
  if (!sections.length) return { from: 0, to: 0, mix: 0 };
  const mid = window.innerHeight * 0.5;
  let t = { from: Number(sections[0].dataset.form), to: Number(sections[0].dataset.form), mix: 0 };
  sections.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.top > mid) return;
    const from = Number(el.dataset.form);
    const next = sections[i + 1];
    const to = next ? Number(next.dataset.form) : from;
    const progress = clamp((mid - r.top) / Math.max(1, r.height), 0, 1);
    t = { from, to, mix: from === to ? 0 : smooth(0.3, 1, progress) };
  });
  return t;
}

export function Universe() {
  const skyRef = useRef<HTMLCanvasElement>(null);
  const starRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const skyCanvas = skyRef.current;
    const starCanvas = starRef.current;
    if (!skyCanvas || !starCanvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    // Only Save-Data opts out; core counts are unreliable (many browsers report 2 for privacy).
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const weak = nav.connection?.saveData;
    const opts = { antialias: false, depth: false, powerPreference: "high-performance" as const };
    const sky = weak ? null : (skyCanvas.getContext("webgl", { ...opts, alpha: false }) as WebGLRenderingContext | null);
    const stars = weak ? null : (starCanvas.getContext("webgl", { ...opts, alpha: true, premultipliedAlpha: true }) as WebGLRenderingContext | null);
    const skyProgram = sky && build(sky, skyVertex, skyFragment);
    const starProgram = stars && build(stars, starVertex, starFragment);
    if (!sky || !stars || !skyProgram || !starProgram) {
      setFallback(true);
      return;
    }

    // Sky layer: one full-screen triangle.
    sky.useProgram(skyProgram);
    sky.bindBuffer(sky.ARRAY_BUFFER, sky.createBuffer());
    sky.bufferData(sky.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), sky.STATIC_DRAW);
    const skyPos = sky.getAttribLocation(skyProgram, "aPos");
    sky.enableVertexAttribArray(skyPos);
    sky.vertexAttribPointer(skyPos, 2, sky.FLOAT, false, 0, 0);
    const su = (n: string) => sky.getUniformLocation(skyProgram, n);
    const SU = { res: su("uRes"), cam: su("uCam"), lens: su("uLens"), time: su("uTime"), accent: su("uAccent"), amount: su("uAccentAmt"), level: su("uLevel") };
    sky.uniform3fv(su("uBand"), BAND);
    sky.uniform3fv(su("uCore"), CORE);

    // Star layer: points, added over the sky.
    const field = buildStars(small ? 0.55 : 1);
    stars.useProgram(starProgram);
    const attr = (name: string, values: Float32Array, size: number) => {
      stars.bindBuffer(stars.ARRAY_BUFFER, stars.createBuffer());
      stars.bufferData(stars.ARRAY_BUFFER, values, stars.STATIC_DRAW);
      const loc = stars.getAttribLocation(starProgram, name);
      stars.enableVertexAttribArray(loc);
      stars.vertexAttribPointer(loc, size, stars.FLOAT, false, 0, 0);
    };
    attr("aPos", field.pos, 3);
    attr("aInfo", field.info, 4);
    const tu = (n: string) => stars.getUniformLocation(starProgram, n);
    const TU = { proj: tu("uProj"), view: tu("uView"), time: tu("uTime"), scale: tu("uScale"), dpr: tu("uDpr"), level: tu("uLevel") };
    stars.uniform3fv(tu("uBand"), BAND);
    stars.uniform3fv(tu("uCore"), CORE);
    stars.enable(stars.BLEND);
    stars.blendFunc(stars.ONE, stars.ONE);
    stars.clearColor(0, 0, 0, 0);

    const fov = (58 * Math.PI) / 180;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
    // The sky glow is soft by nature: render it smaller and let the browser upscale.
    const skyScale = small ? 0.45 : 0.6;
    let dirty = true;
    const resize = () => {
      const w = starCanvas.clientWidth;
      const h = starCanvas.clientHeight;
      skyCanvas.width = Math.max(2, Math.round(w * skyScale));
      skyCanvas.height = Math.max(2, Math.round(h * skyScale));
      sky.viewport(0, 0, skyCanvas.width, skyCanvas.height);
      sky.uniform2f(SU.res, skyCanvas.width, skyCanvas.height);
      sky.uniform2f(SU.lens, Math.tan(fov / 2) * (w / h), Math.tan(fov / 2));
      starCanvas.width = Math.max(2, Math.round(w * dpr));
      starCanvas.height = Math.max(2, Math.round(h * dpr));
      stars.viewport(0, 0, starCanvas.width, starCanvas.height);
      stars.uniformMatrix4fv(TU.proj, false, perspective(fov, w / h, 0.05, 2000));
      stars.uniform1f(TU.scale, h / (2 * Math.tan(fov / 2)));
      stars.uniform1f(TU.dpr, dpr);
      dirty = true;
    };

    // Everything visible eases towards where the scroll says it should be.
    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    const first = SCENES[readTarget().from] ?? SCENES[0];
    const cur = { p: progress(), accent: [...first.accent], amount: first.amount, level: first.level };
    const pointer = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    let time = 0;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = readTarget();
      const a = SCENES[target.from] ?? SCENES[0];
      const b = SCENES[target.to] ?? a;
      const m = target.mix;
      const ease = (rate: number) => (reduced ? 1 : 1 - Math.exp(-dt * rate));
      let changed = false;
      const approach = (v: number, to: number, rate: number) => {
        const next = v + (to - v) * ease(rate);
        if (Math.abs(next - v) > 1e-5) changed = true;
        return next;
      };
      cur.p = approach(cur.p, progress(), 2.2);
      for (let i = 0; i < 3; i++) cur.accent[i] = approach(cur.accent[i], lerp(a.accent[i], b.accent[i], m), 1.2);
      cur.amount = approach(cur.amount, lerp(a.amount, b.amount, m), 1.2);
      cur.level = approach(cur.level, lerp(a.level, b.level, m), 1.2);
      look.x = approach(look.x, pointer.x, 1.8);
      look.y = approach(look.y, pointer.y, 1.8);

      if (reduced) {
        if (!changed && !dirty) return;
      } else {
        time += dt;
      }
      dirty = false;

      const view = lookAt(cur.p);
      // A very slow drift over time, and a gentle tilt with the pointer.
      const cam = basis(view.yaw + time * 0.002 + look.x * 0.05, view.pitch - look.y * 0.035, view.roll);
      const eye = eyeAt(cur.p);

      sky.uniformMatrix3fv(SU.cam, false, new Float32Array([...cam.r, ...cam.u, ...cam.f]));
      sky.uniform1f(SU.time, time);
      sky.uniform3f(SU.accent, cur.accent[0], cur.accent[1], cur.accent[2]);
      sky.uniform1f(SU.amount, cur.amount);
      sky.uniform1f(SU.level, cur.level);
      sky.drawArrays(sky.TRIANGLES, 0, 3);

      stars.uniformMatrix4fv(TU.view, false, viewMatrix(eye, cam));
      stars.uniform1f(TU.time, time);
      stars.uniform1f(TU.level, cur.level);
      stars.clear(stars.COLOR_BUFFER_BIT);
      stars.drawArrays(stars.POINTS, 0, field.count);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") {
        last = performance.now();
        dirty = true;
        raf = requestAnimationFrame(frame);
      }
    };

    // If the browser drops the GPU context (common on phones), show the still sky instead.
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      setFallback(true);
    };
    skyCanvas.addEventListener("webglcontextlost", onLost);
    starCanvas.addEventListener("webglcontextlost", onLost);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      skyCanvas.removeEventListener("webglcontextlost", onLost);
      starCanvas.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-lvh w-full"
      // A still of the same sky shows before the 3D sky starts, and wherever it cannot run.
      style={{ background: `#03060f url(${skyStill.src}) center / cover no-repeat` }}
    >
      <canvas ref={skyRef} className="absolute inset-0 h-full w-full" style={{ opacity: fallback ? 0 : 1 }} />
      <canvas ref={starRef} className="absolute inset-0 h-full w-full" style={{ opacity: fallback ? 0 : 1 }} />
    </div>
  );
}

function build(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[sky]", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, vsSrc);
  const fs = sh(gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}
