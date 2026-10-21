"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export type MotionConditions = { motion: boolean; desktop: boolean; mobile: boolean };

/**
 * Scoped GSAP setup for one landing section. Runs `setup` inside
 * gsap.matchMedia so animations rebuild on resize between phone and
 * desktop, and are skipped entirely for reduced-motion visitors (who get
 * the static layout the markup already provides).
 */
export function useSectionMotion(
  ref: RefObject<HTMLElement | null>,
  setup: (el: HTMLElement, c: MotionConditions) => void | (() => void),
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
      },
      (ctx) => {
        const c = ctx.conditions as MotionConditions;
        if (!c.motion) return;
        el.classList.add("is-animated");
        const cleanup = setup(el, c);
        return () => {
          el.classList.remove("is-animated");
          if (typeof cleanup === "function") cleanup();
        };
      },
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Splits a string into word / letter spans for kinetic type. */
export function words(text: string, className = "w") {
  return text.split(" ").map((w, i, arr) => (
    <span key={i} className={`${className} inline-block`}>
      {w}
      {i < arr.length - 1 ? " " : ""}
    </span>
  ));
}
