"use client";

import { useEffect, useRef, useState } from "react";
import { buildParticles, galaxyFragment, galaxyVertex, lookAt, perspective, SCENES, tilt } from "./galaxy";

/**
 * The particle universe behind the whole page. Sections name their mood with
 * `data-form="0..11"`; each mood sets a shape (vortex, air, fire, water,
 * earth), colours and a camera. Everything eases towards the mood in view, so
 * scrolling travels through one continuous space: shapes scatter and
 * re-form between chapters while the camera surges forward.
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const gl =
      (nav.hardwareConcurrency ?? 4) <= 2 || nav.connection?.saveData
        ? null
        : (canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "high-performance" }) as WebGLRenderingContext | null);
    const program = gl && build(gl);
    if (!gl || !program) {
      setFallback(true);
      return;
    }

    const parts = buildParticles(small ? 0.55 : 1);
    gl.useProgram(program);
    const attr = (name: string, values: Float32Array, size: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    attr("aA", parts.a, 4);
    attr("aB", parts.b, 4);
    attr("aInfo", parts.info, 2);
    const u = (n: string) => gl.getUniformLocation(program, n);
    const U = {
      proj: u("uProj"),
      view: u("uView"),
      tilt: u("uTilt"),
      time: u("uTime"),
      scale: u("uScale"),
      dpr: u("uDpr"),
      w: u("uW"),
      colA: u("uColA"),
      colB: u("uColB"),
      level: u("uLevel"),
    };
    gl.uniformMatrix3fv(U.tilt, false, tilt(0.95, -0.15));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    const fov = (55 * Math.PI) / 180;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
    let portrait = false;
    let dirty = true;
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      portrait = w < h;
      canvas.width = Math.max(2, Math.round(w * dpr));
      canvas.height = Math.max(2, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniformMatrix4fv(U.proj, false, perspective(fov, w / h, 0.05, 60));
      gl.uniform1f(U.scale, h / (2 * Math.tan(fov / 2)));
      gl.uniform1f(U.dpr, dpr);
      dirty = true;
    };

    // The visible mood, eased towards the scroll-driven one. Easing the values
    // themselves (not the blend index) keeps chapter boundaries seamless.
    const first = SCENES[readTarget().from] ?? SCENES[0];
    const cur = {
      w: Float32Array.from({ length: 5 }, (_, i) => (i === first.shape ? 1 : 0)),
      colA: [...first.colA],
      colB: [...first.colB],
      level: first.level,
      yaw: first.yaw,
      pitch: first.pitch,
      dist: first.dist,
    };
    const pointer = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    let time = 20;
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
      const ease = reduced ? 1 : 1 - Math.exp(-dt * 1.4);
      let changed = false;
      const approach = (v: number, to: number) => {
        const next = v + (to - v) * ease;
        if (Math.abs(next - v) > 1e-4) changed = true;
        return next;
      };
      for (let i = 0; i < 5; i++) cur.w[i] = approach(cur.w[i], lerp(i === a.shape ? 1 : 0, i === b.shape ? 1 : 0, m));
      for (let i = 0; i < 3; i++) {
        cur.colA[i] = approach(cur.colA[i], lerp(a.colA[i], b.colA[i], m));
        cur.colB[i] = approach(cur.colB[i], lerp(a.colB[i], b.colB[i], m));
      }
      cur.level = approach(cur.level, lerp(a.level, b.level, m));
      cur.yaw = approach(cur.yaw, lerp(a.yaw, b.yaw, m));
      cur.pitch = approach(cur.pitch, lerp(a.pitch, b.pitch, m));
      cur.dist = approach(cur.dist, lerp(a.dist, b.dist, m));
      const follow = reduced ? 1 : 1 - Math.exp(-dt * 2.5);
      look.x += (pointer.x - look.x) * follow;
      look.y += (pointer.y - look.y) * follow;

      if (reduced) {
        if (!changed && !dirty) return;
      } else {
        time += dt;
      }
      dirty = false;

      // Between shapes the camera surges forward through the scattering dust.
      const between = clamp((1 - Math.max(...cur.w)) * 2, 0, 1);
      const surge = between * between * (3 - 2 * between);
      // A slow turn tied to the whole page keeps the journey continuous.
      const drift = (window.scrollY / window.innerHeight) * 0.035;
      const radius = cur.dist * (portrait ? 1.55 : 1) * (1 - surge * 0.28);
      const yaw = cur.yaw + drift + look.x * 0.12;
      const pitch = cur.pitch - look.y * 0.08;
      const eye = [Math.sin(yaw) * Math.cos(pitch) * radius, Math.sin(pitch) * radius, Math.cos(yaw) * Math.cos(pitch) * radius];
      gl.uniformMatrix4fv(U.view, false, lookAt(eye, [0, 0, 0], [0, 1, 0]));
      gl.uniform1fv(U.w, cur.w);
      gl.uniform3f(U.colA, cur.colA[0], cur.colA[1], cur.colA[2]);
      gl.uniform3f(U.colB, cur.colB[0], cur.colB[1], cur.colB[2]);
      gl.uniform1f(U.level, cur.level);
      gl.uniform1f(U.time, time);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, parts.count);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") {
        last = performance.now();
        dirty = true;
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-lvh w-full bg-black"
      style={
        fallback
          ? { background: "radial-gradient(ellipse at 50% 50%, rgba(214,220,255,.08), transparent 60%), #000" }
          : undefined
      }
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ opacity: fallback ? 0 : 1 }} />
    </div>
  );
}

function build(gl: WebGLRenderingContext) {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[universe]", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, galaxyVertex);
  const fs = sh(gl.FRAGMENT_SHADER, galaxyFragment);
  if (!vs || !fs) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}
