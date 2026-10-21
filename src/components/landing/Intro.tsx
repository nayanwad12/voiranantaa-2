"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "./motion";
import { lenisRef } from "@/components/motion/SmoothScroll";

const SEEN_KEY = "voiranantaa:intro-seen";

declare global {
  interface Window {
    __vaIntroDone?: boolean;
  }
}

function finish() {
  window.__vaIntroDone = true;
  window.dispatchEvent(new Event("va:intro-done"));
}

/**
 * A short cinematic opening: a counter climbs to 100 while the three rings
 * draw, then the curtain opens onto the universe. Once per session; skipped
 * for reduced motion.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked: show the intro */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setGone(true);
      finish();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const stopLenis = window.setTimeout(() => lenisRef.current?.stop(), 0);
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        lenisRef.current?.start();
        setGone(true);
      },
    });
    tl.to(counter, {
      v: 100,
      duration: 1.9,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to(el.querySelectorAll(".intro-ring"), { strokeDashoffset: 0, duration: 1.6, stagger: 0.15, ease: "power3.inOut" }, 0)
      .to(el.querySelectorAll(".intro-fade"), { opacity: 1, duration: 0.6, stagger: 0.1 }, 0.2)
      .to(el.querySelector(".intro-rings"), { scale: 6, opacity: 0, duration: 1.1, ease: "power3.in" }, 1.95)
      .to(el.querySelectorAll(".intro-fade, .intro-count"), { opacity: 0, duration: 0.4 }, 1.95)
      .call(finish, [], 2.3)
      .to(el, { clipPath: "inset(50% 0% 50% 0%)", duration: 0.9, ease: "expo.inOut" }, 2.2);

    return () => {
      window.clearTimeout(stopLenis);
      tl.kill();
      document.documentElement.style.overflow = "";
      lenisRef.current?.start();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={ref}
      className="intro fixed inset-0 z-[60] flex items-center justify-center bg-black"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="intro-rings w-[min(60vw,22rem)] overflow-visible">
        {[
          { r: 96, c: "var(--blue)" },
          { r: 78, c: "var(--blue-soft)" },
          { r: 60, c: "var(--pink)" },
        ].map((ring) => (
          <circle
            key={ring.r}
            className="intro-ring"
            cx="100"
            cy="100"
            r={ring.r}
            fill="none"
            stroke={ring.c}
            strokeWidth="0.8"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
        ))}
      </svg>
      <p className="intro-fade label absolute left-[var(--gutter)] top-8 opacity-0">VOIRANANTAA</p>
      <p className="intro-fade label absolute right-[var(--gutter)] top-8 opacity-0">To see the infinite</p>
      <p className="intro-fade label absolute bottom-10 right-[var(--gutter)] text-mute opacity-0">Edition 01 / Infinite Raga</p>
      <span
        ref={countRef}
        className="intro-count veil-warm absolute bottom-6 left-[var(--gutter)] font-display text-[clamp(4rem,14vw,11rem)] font-bold leading-none tabular-nums"
      >
        000
      </span>
    </div>
  );
}

/** Runs `cb` once the intro has opened (or immediately if it was skipped). */
export function onIntroDone(cb: () => void) {
  if (window.__vaIntroDone) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("va:intro-done", h, { once: true });
  return () => window.removeEventListener("va:intro-done", h);
}
