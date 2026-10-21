"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";

const ELEMENTS = ["Sky", "Air", "Space", "Water", "Earth"];

/** Where you are in the descent — a compact, fixed indicator. */
export function ElementPill() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let cur = 0;
      document.querySelectorAll<HTMLElement>("[data-element]").forEach((el) => {
        if (el.getBoundingClientRect().top <= mid) cur = Number(el.dataset.element);
      });
      setActive(cur);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-blue" style={{ transform: `scaleX(${progress})` }} />
      <nav
        aria-label="Elements"
        className="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-xl md:flex"
      >
        <p className="w-[5.5rem] font-sans text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-paper" aria-live="polite">
          <span className="tabular-nums text-blue">{String(active + 1).padStart(2, "0")}</span> {ELEMENTS[active]}
        </p>
        <ol className="flex items-center gap-1.5">
          {ELEMENTS.map((name, i) => (
            <li key={name} aria-current={active === i ? "step" : undefined}>
              <span className="sr-only">{name}</span>
              <span
                aria-hidden="true"
                className={cx("block h-[3px] rounded-full transition-all duration-500", active === i ? "w-6 bg-blue" : i < active ? "w-2 bg-paper/60" : "w-2 bg-paper/20")}
              />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
