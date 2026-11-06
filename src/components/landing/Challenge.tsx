"use client";

import { useRef } from "react";
import { gsap, useSectionMotion, words } from "./motion";

const MATERIALS = ["Paper", "Metal", "Wire", "Wood", "Found objects", "Natural", "Recycled", "Experimental"];

const STATEMENT = "The material must become part of the idea. It should not simply decorate the garment";

/** THE CHALLENGE — 95 / 5 + human-made, counted out on one solid card. */
export function Challenge() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const count = el.querySelector<HTMLElement>(".ch-count");
    const n = { v: 0 };
    gsap.set(el.querySelectorAll(".ch-step"), { opacity: 0, y: 30 });
    const tl = gsap.timeline({
      scrollTrigger: c.desktop
        ? { trigger: el.querySelector(".ch-stage"), start: "top top", end: "+=220%", scrub: 1, pin: true }
        : { trigger: el.querySelector(".ch-stage"), start: "top 75%", end: "bottom 70%", scrub: 1 },
    });
    tl.to(n, {
      v: 95,
      duration: 1,
      ease: "power1.inOut",
      onUpdate: () => {
        if (count) count.textContent = String(Math.round(n.v));
      },
    })
      .fromTo(el.querySelectorAll(".ch-mat"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.1)
      .to(el.querySelectorAll(".ch-step"), { opacity: 1, y: 0, stagger: 0.35, duration: 0.3 }, 0.9)
      .to({}, { duration: 0.4 });
    const ws = el.querySelectorAll(".ch-statement .w");
    gsap.set(ws, { opacity: 0.12 });
    gsap.to(ws, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: el.querySelector(".ch-statement"), start: "top 80%", end: "bottom 45%", scrub: true },
    });
  });

  return (
    <section ref={ref} data-form="5" className="relative overflow-hidden">
      <div className="ch-stage page-x mx-auto flex min-h-[100svh] max-w-page items-center py-24">
        <div className="grid w-full gap-10 bg-teal p-7 text-paper sm:p-10 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-16 md:p-14">
          <div>
            <p className="label mb-6 text-paper/75">The challenge</p>
            <p className="font-display font-bold leading-none">
              <span className="ch-count text-[clamp(7rem,20vw,16rem)]">95</span>
              <span className="text-[clamp(3.5rem,9vw,7.5rem)] text-mustard">%</span>
            </p>
            <p className="mt-5 font-sans text-sm font-semibold uppercase tracking-[0.24em]">Unconventional material</p>
            <ul className="mt-5 flex max-w-lg flex-wrap gap-2">
              {MATERIALS.map((m) => (
                <li
                  key={m}
                  className="ch-mat rounded-full border border-paper/30 px-3 py-1 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-6">
            <li className="ch-step border-t border-paper/25 pt-4">
              <p className="font-display text-6xl font-bold leading-none text-mustard">5%</p>
              <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.22em]">Textile / fabric — no more</p>
            </li>
            <li className="ch-step border-t border-paper/25 pt-4">
              <p className="font-display text-6xl font-bold leading-none">100%</p>
              <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.22em]">Human-made</p>
              <p className="mt-2 text-sm text-paper/80">Human authorship, making and intervention.</p>
            </li>
            <li className="ch-step border-t border-paper/25 pt-4">
              <p className="font-display text-3xl font-bold uppercase leading-none">Safety review</p>
              <p className="mt-2 text-sm text-paper/80">Materials, structures, wearable components, props and performance meet the final safety rules.</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="page-x mx-auto max-w-page pb-32 pt-10">
        <p className="ch-statement max-w-6xl font-display text-[clamp(2.2rem,5.6vw,5.4rem)] font-bold uppercase leading-[0.95]">
          {words(STATEMENT, "w veil")}
        </p>
      </div>
    </section>
  );
}
