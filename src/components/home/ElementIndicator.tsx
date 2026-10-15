"use client";

import { useEffect, useState } from "react";
import { ELEMENTS } from "@/components/scene/position";
import { cx } from "@/lib/cx";

/** Compact fixed index: where you are in the descent from Sky to Earth. */
export function ElementIndicator() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let current = 0;
      chapters.forEach((c) => {
        if (c.getBoundingClientRect().top <= mid) current = Number(c.dataset.chapter);
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      aria-label="Elements"
      className="glass fixed bottom-6 right-[var(--gutter)] z-30 hidden items-center gap-4 rounded-full py-2.5 pl-5 pr-4 md:flex"
    >
      <p className="w-[6.5rem] font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-paper" aria-live="polite">
        <span className="tabular-nums text-blue-soft">{String(active + 1).padStart(2, "0")}</span> / {ELEMENTS[active]}
      </p>
      <ol className="flex items-center gap-1.5">
        {ELEMENTS.map((name, i) => (
          <li key={name}>
            <a
              href={`#${name.toLowerCase()}`}
              aria-label={`${String(i + 1).padStart(2, "0")} ${name}`}
              aria-current={active === i ? "step" : undefined}
              className="flex h-5 items-center"
            >
              <span
                aria-hidden="true"
                className={cx("block h-px transition-all duration-500", active === i ? "w-7 bg-blue" : "w-3 bg-mute/50 hover:bg-paper")}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
