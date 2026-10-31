"use client";

import { useRef } from "react";
import { gsap, useSectionMotion } from "./motion";

/** The one gradient banner — conference-stage colour, opened like a curtain. */
export function GradientBand() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    gsap.fromTo(
      el.querySelector(".band"),
      { clipPath: "inset(0% 48% 0% 48% round 999px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "power2.inOut",
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 25%", scrub: 0.8 },
      },
    );
  });

  return (
    <section ref={ref} data-form="3" className="relative py-16">
      <div className="band gradient-band flex justify-center overflow-hidden px-[var(--gutter)] py-6 md:py-8">
        {/* A black panel keeps the line readable over every colour of the band. */}
        <h2 className="rounded-2xl bg-black px-6 py-4 text-center font-display text-[clamp(1.5rem,3.2vw,3rem)] font-bold uppercase leading-[1.05] text-paper md:px-10">
          One theme <span aria-hidden="true" className="text-mustard">·</span> Nine emotional worlds{" "}
          <span aria-hidden="true" className="text-mustard">·</span> Infinite interpretations
        </h2>
      </div>
    </section>
  );
}
