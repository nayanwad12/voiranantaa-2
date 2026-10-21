"use client";

import { useRef } from "react";
import { rasas } from "@/content/rasas";
import { RasaGlyph } from "@/components/ui/RasaGlyph";
import { gsap, useSectionMotion } from "./motion";

/** NINE EMOTIONAL WORLDS — a pinned, curved gallery that travels sideways as you scroll. */
export function RasaGallery() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const track = el.querySelector<HTMLElement>(".rasa-track");
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".rasa-card"));
    if (!track) return;
    const distance = () => track.scrollWidth - window.innerWidth + window.innerWidth * (c.desktop ? 0.08 : 0.06);
    const setters = cards.map((card) => ({
      rot: gsap.quickSetter(card, "rotateY", "deg"),
      z: gsap.quickSetter(card, "z", "px"),
      card,
    }));
    const curve = () => {
      const vw = window.innerWidth;
      setters.forEach(({ rot, z, card }) => {
        const r = card.getBoundingClientRect();
        const off = (r.left + r.width / 2 - vw / 2) / vw; // -1..1
        rot(off * -28);
        z(-Math.abs(off) * 260);
        card.classList.toggle("is-active", Math.abs(off) < 0.18);
      });
    };
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${distance()}`,
        scrub: 0.8,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: curve,
        onRefresh: curve,
      },
    });
    curve();
  });

  return (
    <section ref={ref} data-form="3" data-element="1" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16">
      <div className="page-x mx-auto mb-10 flex w-full max-w-page flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] font-bold uppercase leading-[0.86]">
          Nine
          <br />
          emotional worlds.
        </h2>
        <p className="max-w-sm text-base font-light leading-relaxed text-mute">
          The nine rasas. Interpret one — or a considered relationship between several. Abstract studies, never literal
          illustrations.
        </p>
      </div>
      <div className="rasa-scroller overflow-x-auto [perspective:1400px] [scrollbar-width:none]">
        <ol className="rasa-track flex w-max gap-4 pl-[var(--gutter)] pr-[30vw] [transform-style:preserve-3d] md:gap-6">
          {rasas.map((r, i) => (
            <li
              key={r.id}
              className="rasa-card group relative flex aspect-[3/4] w-[72vw] shrink-0 flex-col justify-between overflow-hidden rounded-[1.4rem] border border-white/10 bg-night p-6 [backface-visibility:hidden] sm:w-[46vw] md:w-[28vw] lg:w-[22vw]"
              style={{ "--accent": `var(--${r.accent})` } as React.CSSProperties}
            >
              <div className="flex items-start justify-between">
                <span className="outline-type font-display text-6xl font-bold leading-none">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
              </div>
              <RasaGlyph id={r.id} accent={r.accent} className="rasa-glyph mx-auto w-[70%]" />
              <div>
                <h3 className="font-display text-[clamp(2rem,3vw,2.8rem)] font-bold uppercase leading-none">{r.name}</h3>
                <p className="mt-2 text-sm text-mute">{r.feeling}</p>
              </div>
              <span aria-hidden="true" className="rasa-glow pointer-events-none absolute inset-0 rounded-[1.4rem] opacity-0 transition-opacity duration-500" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
