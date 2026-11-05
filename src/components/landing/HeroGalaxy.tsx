"use client";

import { useEffect, useRef } from "react";
import { buildGalaxy, galaxyFragment, galaxyVertex, lookAt, perspective, tilt } from "@/components/universe/galaxy";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * The hero's full-screen 3D galaxy. The camera drifts with the pointer and
 * turns slowly around the core as the hero scrolls away. Renders only while
 * the hero is on screen.
 */
export function HeroGalaxy() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "high-performance" });
    const program = gl && build(gl);
    if (!gl || !program) return;

    const g = buildGalaxy(small ? 0.55 : 1);
    const attr = (name: string, values: Float32Array, size: number) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    gl.useProgram(program);
    attr("aPos", g.pos, 3);
    attr("aData", g.data, 4);
    const u = (n: string) => gl.getUniformLocation(program, n);
    const U = { proj: u("uProj"), view: u("uView"), tilt: u("uTilt"), time: u("uTime"), scale: u("uScale"), dpr: u("uDpr") };
    gl.uniformMatrix3fv(U.tilt, false, tilt(0.95, -0.15));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    const fov = (55 * Math.PI) / 180;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(2, Math.round(w * dpr));
      canvas.height = Math.max(2, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniformMatrix4fv(U.proj, false, perspective(fov, w / h, 0.05, 60));
      gl.uniform1f(U.scale, h / (2 * Math.tan(fov / 2)));
      gl.uniform1f(U.dpr, dpr);
    };

    // Pointer and scroll are eased so the camera always glides.
    const pointer = { x: 0, y: 0 };
    const cam = { x: 0, y: 0, p: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // Close enough that the disk runs past every edge; portrait screens step back a little.
    const distance = () => (canvas.clientWidth < canvas.clientHeight ? 6.0 : 3.9);

    let time = 20;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    // dt = 0 snaps the camera into place (first frame, resize).
    const draw = (dt = 0) => {
      // The hero pins for about 130% of the viewport; over it the galaxy turns slowly.
      const progress = clamp(window.scrollY / (window.innerHeight * 1.3), 0, 1);
      const follow = (rate: number) => (reduced || dt === 0 ? 1 : 1 - Math.exp(-dt * rate));
      cam.p += (progress - cam.p) * follow(5);
      cam.x += (pointer.x - cam.x) * follow(2.5);
      cam.y += (pointer.y - cam.y) * follow(2.5);
      const fly = cam.p * cam.p * (3 - 2 * cam.p);
      const radius = distance() * (1 - fly * 0.1);
      const yaw = cam.x * 0.12 + fly * 0.45;
      const pitch = -cam.y * 0.08 + fly * 0.12;
      const eye = [Math.sin(yaw) * Math.cos(pitch) * radius, Math.sin(pitch) * radius, Math.cos(yaw) * Math.cos(pitch) * radius];
      // Always looking at the core, so it stays in the centre of the screen.
      gl.uniformMatrix4fv(U.view, false, lookAt(eye, [0, 0, 0], [0, 1, 0]));
      gl.uniform1f(U.time, time);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, g.count);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) time += dt;
      draw(dt);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!visible || document.visibilityState !== "visible") return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(canvas);
    const onResize = () => {
      resize();
      draw();
    };
    resize();
    draw();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

function build(gl: WebGLRenderingContext) {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[galaxy]", gl.getShaderInfoLog(s));
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
