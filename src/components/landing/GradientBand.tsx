"use client";

import { useRef } from "react";
import { gsap, useSectionMotion } from "./motion";

/** The one gradient banner — conference-stage colour, opened like a curtain. */
export function GradientBand() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    gsap.fromTo(
      el.querySelector(".band"),
      { clipPath: "inset(0% 48% 0% 48%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.inOut",
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 25%", scrub: 0.8 },
      },
    );
  });

  return (
    <section ref={ref} data-form="3" className="relative py-16">
      <div className="band gradient-band flex justify-center overflow-hidden px-[var(--gutter)] py-8 md:py-10">
        <h2 className="text-center font-display text-[clamp(1.5rem,3.2vw,3rem)] font-bold uppercase leading-[1.05] text-black">
          One theme <span aria-hidden="true">·</span> Nine emotional worlds <span aria-hidden="true">·</span> Infinite interpretations
        </h2>
      </div>
    </section>
  );
}
