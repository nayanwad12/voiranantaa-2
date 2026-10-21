"use client";

import { useRef } from "react";
import { rasas } from "@/content/rasas";
import { RasaGlyph } from "@/components/ui/RasaGlyph";
import { gsap, useSectionMotion } from "./motion";

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
    <section ref={ref} data-form="3" data-element="1" className="relative py-16 md:py-20">
      <div className="page-x mx-auto max-w-page">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="veil font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold uppercase leading-none">The nine rasas</h2>
          <p className="max-w-md text-sm text-mute">Interpret one — or a considered relationship between several.</p>
        </div>
        <ol className="rasa-list grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-9">
          {rasas.map((r, i) => (
            <li
              key={r.id}
              className="rasa-item group flex items-center gap-3 rounded-xl border border-white/10 bg-night/70 px-3 py-3 transition-colors hover:border-white/30 lg:flex-col lg:items-start lg:gap-2"
            >
              <RasaGlyph id={r.id} accent={r.accent} className="h-8 w-8 shrink-0 opacity-80 transition-transform duration-700 group-hover:rotate-12" />
              <div className="min-w-0">
                <p className="font-sans text-[0.6rem] font-semibold tabular-nums tracking-[0.2em] text-mute">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-lg font-bold uppercase leading-tight">{r.name}</h3>
                <p className="text-[0.72rem] leading-snug text-mute">{r.feeling}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
