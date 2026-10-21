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
    gsap.fromTo(
      el.querySelector(".band-text"),
      { xPercent: 0 },
      { xPercent: -30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 } },
    );
  });

  const line = Array.from({ length: 3 }, () => "One theme · Nine emotional worlds · Infinite interpretations · ").join("");
  return (
    <section ref={ref} data-form="3" data-element="1" className="relative py-16">
      <h2 className="sr-only">One theme. Nine emotional worlds. Infinite interpretations.</h2>
      <div className="band gradient-band overflow-hidden py-8 md:py-12" aria-hidden="true">
        <p className="band-text whitespace-nowrap font-display text-[clamp(3rem,9vw,8.5rem)] font-bold uppercase leading-none text-black">
          {line}
        </p>
      </div>
    </section>
  );
}
