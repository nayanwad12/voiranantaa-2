"use client";

import { useRef } from "react";
import { rasas } from "@/content/rasas";
import { gsap, useSectionMotion } from "./motion";

const SWATCHES = ["var(--crimson)", "var(--mustard)", "var(--olive)", "var(--navy)", "var(--teal)"];

/** The nine rasas — a compact reference list, not a feature. */
export function RasaGallery() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    gsap.from(el.querySelectorAll(".rasa-item"), {
      opacity: 0,
      y: 24,
      stagger: 0.05,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: el.querySelector(".rasa-list"), start: "top 85%" },
    });
  });

  return (
    <section ref={ref} data-form="3" className="relative py-16 md:py-20">
      <div className="page-x mx-auto max-w-page">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="veil font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold uppercase leading-none">The nine rasas</h2>
          <p className="max-w-md text-sm text-mute">Interpret one — or a considered relationship between several.</p>
        </div>
        <ol className="rasa-list grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-9">
          {rasas.map((r, i) => (
            <li
              key={r.id}
              className="rasa-item relative flex min-h-[8.5rem] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-night/70 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-white/30"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px]" style={{ background: SWATCHES[i % SWATCHES.length] }} />
              <p className="font-sans text-[0.62rem] font-semibold tabular-nums tracking-[0.2em] text-mute">{String(i + 1).padStart(2, "0")}</p>
              <div>
                <h3 className="font-display text-xl font-bold uppercase leading-none">{r.name}</h3>
                <p className="mt-1.5 text-[0.74rem] leading-snug text-paper/70">{r.feeling}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
