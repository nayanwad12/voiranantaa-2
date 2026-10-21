"use client";

import { useEffect, useRef, useState } from "react";
import { lenisRef } from "@/components/motion/SmoothScroll";
import { fragmentShader, SCENES, vertexShader } from "./smear";

/**
 * Smeared colour drifting through black behind the whole page. Sections name
 * their mood with `data-form="0..9"`; the field blends from one mood to the
 * next as they scroll past, and scroll speed stretches the motion blur.
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
        : (canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" }) as WebGLRenderingContext | null);
    const program = gl && build(gl);
    if (!gl || !program) {
      setFallback(true);
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);
    const u = (n: string) => gl.getUniformLocation(program, n);
    const U = {
      res: u("uRes"),
      time: u("uTime"),
      drift: u("uDrift"),
      vel: u("uVel"),
      pal: u("uPal"),
      angle: u("uAngle"),
      density: u("uDensity"),
      focus: u("uFocus"),
      dim: u("uDim"),
    };

    // Soft by design: render small and let the browser upscale.
    const scale = small ? 0.32 : 0.38;
    const resize = () => {
      const w = Math.max(2, Math.round(canvas.clientWidth * scale));
      const h = Math.max(2, Math.round(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.res, w, h);
      dirty = true;
    };

    // The visible mood, eased towards the scroll-driven one. Easing the values
    // themselves (not the blend index) keeps chapter boundaries seamless.
    const first = SCENES[readTarget().from] ?? SCENES[0];
    const cur = {
      pal: Float32Array.from(first.pal.flat()),
      angle: first.angle,
      density: first.density,
      focus: [first.focus[0], first.focus[1]],
    };
    let time = 12;
    let drift = 0;
    let vel = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;
    let dirty = true;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = readTarget();
      const a = SCENES[target.from] ?? SCENES[0];
      const b = SCENES[target.to] ?? a;
      const m = target.mix;
      const ease = reduced ? 1 : 1 - Math.exp(-dt * 1.1);
      let changed = false;
      const approach = (curV: number, to: number) => {
        const next = curV + (to - curV) * ease;
        if (Math.abs(next - curV) > 1e-4) changed = true;
        return next;
      };
      for (let i = 0; i < 5; i++)
        for (let j = 0; j < 3; j++) cur.pal[i * 3 + j] = approach(cur.pal[i * 3 + j], lerp(a.pal[i][j], b.pal[i][j], m));
      cur.angle = approach(cur.angle, lerp(a.angle, b.angle, m));
      cur.density = approach(cur.density, lerp(a.density, b.density, m));
      cur.focus[0] = approach(cur.focus[0], lerp(a.focus[0], b.focus[0], m));
      cur.focus[1] = approach(cur.focus[1], lerp(a.focus[1], b.focus[1], m));

      const y = window.scrollY;
      const raw = lenisRef.current?.velocity ?? (y - lastY) / Math.max(dt, 1 / 120) / 60;
      lastY = y;
      // Scroll speed eases in and out slowly, so streaks lengthen gently.
      vel += (clamp(raw / 40, -1, 1) - vel) * (1 - Math.exp(-dt * 1.4));
      drift += ((y / window.innerHeight) * 0.6 - drift) * (1 - Math.exp(-dt * 1.2));

      if (reduced) {
        if (!changed && !dirty) return;
      } else {
        time += dt;
      }
      dirty = false;

      gl.uniform3fv(U.pal, cur.pal);
      gl.uniform1f(U.angle, cur.angle);
      gl.uniform1f(U.density, cur.density);
      gl.uniform2f(U.focus, cur.focus[0], cur.focus[1]);
      gl.uniform1f(U.time, time);
      gl.uniform1f(U.drift, drift);
      gl.uniform1f(U.vel, reduced ? 0 : vel);
      gl.uniform1f(U.dim, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
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
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-lvh w-full bg-black"
      style={
        fallback
          ? {
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(227,31,20,.35), transparent 45%), radial-gradient(ellipse at 75% 65%, rgba(0,62,118,.45), transparent 50%), radial-gradient(ellipse at 55% 20%, rgba(226,190,34,.18), transparent 40%), #000",
            }
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
  const vs = sh(gl.VERTEX_SHADER, vertexShader);
  const fs = sh(gl.FRAGMENT_SHADER, fragmentShader);
  if (!vs || !fs) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}
