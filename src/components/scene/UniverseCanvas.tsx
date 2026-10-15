"use client";

import { useEffect, useRef, useState } from "react";
import { fragmentShader, vertexShader } from "./shader";
import { elementWeights, readScenePosition } from "./position";

type Mode = "pending" | "webgl" | "fallback";

/**
 * A single, persistent night-time universe behind every page.
 * It lives in the root layout, so moving between pages blends worlds
 * instead of cutting to a new one.
 *
 * - WebGL fragment shader (no 3D library) at a reduced render scale.
 * - Pauses while the tab is hidden; lowers resolution if frames run slow.
 * - Reduced motion: time is frozen; the world only changes as you scroll.
 * - No WebGL / low-power / save-data: layered CSS gradients instead.
 */
export function UniverseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const dimRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const lowPower = (nav.hardwareConcurrency ?? 4) <= 2 || nav.connection?.saveData === true;

    const gl = lowPower
      ? null
      : (canvas.getContext("webgl", {
          antialias: false,
          alpha: false,
          depth: false,
          stencil: false,
          powerPreference: "low-power",
          preserveDrawingBuffer: false,
        }) as WebGLRenderingContext | null);

    const program = gl ? buildProgram(gl) : null;
    if (!gl || !program) {
      setMode("fallback");
      return;
    }
    setMode("webgl");

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      w: gl.getUniformLocation(program, "uW"),
      w4: gl.getUniformLocation(program, "uW4"),
      dim: gl.getUniformLocation(program, "uDim"),
      drift: gl.getUniformLocation(program, "uDrift"),
      pointer: gl.getUniformLocation(program, "uPointer"),
    };

    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    let scale = Math.min(window.devicePixelRatio || 1, 1.5) * (isSmall ? 0.6 : 0.75);
    const minScale = 0.4;

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(u.res, w, h);
      }
      dirty = true;
    };

    const start = readScenePosition();
    let eCur = start.e;
    let dimCur = start.dim;
    let drift = 0;
    let time = 7.3;
    let last = performance.now();
    let dirty = true;
    let raf = 0;
    let slowFrames = 0;
    const pointer = { x: 0, y: -0.2, tx: 0, ty: -0.2 };

    const onPointer = (ev: PointerEvent) => {
      const h = window.innerHeight;
      pointer.tx = ((ev.clientX - window.innerWidth / 2) / h) * 2;
      pointer.ty = -((ev.clientY - h / 2) / h) * 2;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Adaptive resolution: if we keep missing ~40fps, render smaller.
      if (dt > 0.025) slowFrames++;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 45 && scale > minScale) {
        scale = Math.max(minScale, scale * 0.8);
        slowFrames = 0;
        resize();
      }

      const target = readScenePosition();
      const k = reduced ? 1 : 1 - Math.exp(-dt * 3.5);
      const prevE = eCur;
      const prevDim = dimCur;
      eCur += (target.e - eCur) * k;
      dimCur += (target.dim - dimCur) * k;
      const targetDrift = window.scrollY / window.innerHeight;
      const prevDrift = drift;
      drift += (targetDrift - drift) * (reduced ? 1 : 1 - Math.exp(-dt * 5));

      if (reduced) {
        const moved =
          Math.abs(eCur - prevE) + Math.abs(dimCur - prevDim) + Math.abs(drift - prevDrift);
        if (!dirty && moved < 1e-4) return;
      } else {
        time += dt;
        pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 2));
        pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 2));
      }
      dirty = false;

      const w = elementWeights(eCur);
      gl.uniform1f(u.time, time);
      gl.uniform4f(u.w, w[0], w[1], w[2], w[3]);
      gl.uniform1f(u.w4, w[4]);
      gl.uniform1f(u.dim, dimCur);
      gl.uniform1f(u.drift, drift);
      gl.uniform2f(u.pointer, pointer.x, pointer.y);
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

    const onLost = (ev: Event) => {
      ev.preventDefault();
      cancelAnimationFrame(raf);
      setMode("fallback");
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  // Fallback after a lost context: start the CSS layers.
  useEffect(() => {
    if (mode !== "fallback") return;
    return runFallback(layersRef.current, dimRef.current);
  }, [mode]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-lvh w-full bg-ink">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-[1500ms]"
        style={{ opacity: mode === "webgl" ? 1 : 0 }}
      />
      {mode === "fallback" && (
        <>
          {FALLBACK_LAYERS.map((bg, i) => (
            <div
              key={i}
              ref={(el) => {
                layersRef.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ background: bg, opacity: 0 }}
            />
          ))}
          <div ref={dimRef} className="absolute inset-0 bg-ink" style={{ opacity: 0 }} />
        </>
      )}
    </div>
  );
}

const FALLBACK_LAYERS = [
  // Sky
  "radial-gradient(ellipse at 78% 18%, rgba(76,151,255,.20), transparent 45%), linear-gradient(to top, #0b1533, #05070d 70%)",
  // Air
  "radial-gradient(ellipse at 25% 70%, rgba(141,184,255,.14), transparent 50%), linear-gradient(to top, #091127, #05070d 80%)",
  // Space
  "radial-gradient(circle at 50% 50%, #05070d 0 12%, rgba(76,151,255,.30) 21%, rgba(5,7,13,0) 33%), #05070d",
  // Water
  "radial-gradient(ellipse at 50% 100%, rgba(141,184,255,.18), transparent 55%), linear-gradient(to top, #0c1a3d, #05070d 75%)",
  // Earth
  "radial-gradient(ellipse at 40% 30%, rgba(76,151,255,.10), transparent 50%), linear-gradient(to top, #12141b, #05070d 80%)",
];

function runFallback(layers: (HTMLDivElement | null)[], dim: HTMLDivElement | null) {
  let raf = 0;
  const update = () => {
    raf = 0;
    const { e, dim: d } = readScenePosition();
    const w = elementWeights(e);
    layers.forEach((el, i) => {
      if (el) el.style.opacity = String(w[i]);
    });
    if (dim) dim.style.opacity = String(d * 0.6);
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  // Route changes swap the [data-scene] node; watch the DOM lightly.
  const mo = new MutationObserver(schedule);
  mo.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
  return () => {
    cancelAnimationFrame(raf);
    mo.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

function buildProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[universe] shader compile failed", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, vertexShader);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn("[universe] program link failed", gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}
