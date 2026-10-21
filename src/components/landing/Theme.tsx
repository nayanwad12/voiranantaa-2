"use client";

import { useRef } from "react";
import { gsap, useSectionMotion, words } from "./motion";

const STATEMENT = "A raga unfolds. It changes with every phrase, every pause, every interpretation.";

/** THE THEME — the title streams past like a melody; the statement lights up word by word. */
export function Theme() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    gsap.fromTo(
      el.querySelector(".theme-row-a"),
      { xPercent: 0 },
      { xPercent: -35, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
    );
    gsap.fromTo(
      el.querySelector(".theme-row-b"),
      { xPercent: -35 },
      { xPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
    );
    const ws = el.querySelectorAll(".theme-statement .w");
    gsap.set(ws, { opacity: 0.12 });
    gsap.to(ws, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: el.querySelector(".theme-pin"),
        start: c.desktop ? "top top" : "top 70%",
        end: c.desktop ? "+=120%" : "bottom 40%",
        scrub: true,
        pin: c.desktop,
      },
    });
    gsap.from(el.querySelectorAll(".theme-body"), {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      scrollTrigger: { trigger: el.querySelector(".theme-body"), start: "top 85%" },
    });
  });

  const rowA = Array.from({ length: 4 }, () => "Infinite Raga ✦ ").join("");
  const rowB = Array.from({ length: 4 }, () => "A melody with no end — ").join("");

  return (
    <section ref={ref} data-form="2" className="relative overflow-hidden py-24 sm:py-32">
      <h2 className="sr-only">Infinite Raga — a melody with no end</h2>
      <div aria-hidden="true" className="select-none whitespace-nowrap font-display font-bold uppercase leading-[0.85]">
        <p className="theme-row-a outline-type whitespace-nowrap text-[clamp(5rem,17vw,16rem)]">{rowA}</p>
        <p className="theme-row-b veil-warm whitespace-nowrap text-[clamp(5rem,17vw,16rem)]">{rowB}</p>
      </div>

      <div className="theme-pin page-x mx-auto flex min-h-[100svh] max-w-page flex-col justify-center py-16">
        <p className="label mb-8 text-mute">The theme · Edition 01</p>
        <p className="theme-statement max-w-6xl font-display text-[clamp(2.4rem,6.4vw,6.2rem)] font-bold uppercase leading-[0.95]">
          {words(STATEMENT, "w veil")}
        </p>
      </div>

      <div className="page-x mx-auto grid max-w-page gap-10 pb-10 md:grid-cols-2 md:gap-24">
        <p className="theme-body text-xl font-light leading-relaxed text-paper/85 md:text-2xl">
          INFINITE RAGA takes this idea beyond sound and into the physical world.
        </p>
        <p className="theme-body text-lg font-light leading-relaxed text-mute">
          It invites designers and artists to translate emotion into wearable art through form, material,
          construction and performance — interpreting one rasa, or a considered relationship between several.
        </p>
      </div>
    </section>
  );
}
