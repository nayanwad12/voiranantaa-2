"use client";

import { useRef } from "react";
import { gsap, useSectionMotion, words } from "./motion";

const MATERIALS = [
  { t: "Paper", x: 6, y: 12, s: 1.3, d: 0.4 },
  { t: "Metal", x: 46, y: 9, s: 1.1, d: 0.8 },
  { t: "Wire", x: 30, y: 20, s: 0.85, d: 1.2 },
  { t: "Wood", x: 50, y: 88, s: 1.2, d: 0.3 },
  { t: "Found objects", x: 8, y: 86, s: 0.95, d: 0.5 },
  { t: "Natural", x: 92, y: 10, s: 0.8, d: 0.9 },
  { t: "Recycled", x: 30, y: 94, s: 0.9, d: 0.2 },
  { t: "Experimental", x: 68, y: 16, s: 0.85, d: 1.1 },
];

const STATEMENT = "The material must become part of the idea. It should not simply decorate the garment.";

/** THE CHALLENGE — 95 / 5 + human-made, counted out under a sphere of light. */
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
      .fromTo(el.querySelectorAll(".ch-mat"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, stagger: 0.06, duration: 0.4 }, 0.1)
      .to(el.querySelectorAll(".ch-step"), { opacity: 1, y: 0, stagger: 0.35, duration: 0.3 }, 0.9)
      .to({}, { duration: 0.4 });
    el.querySelectorAll<HTMLElement>(".ch-mat").forEach((m) => {
      gsap.to(m, {
        y: () => -window.innerHeight * 0.35 * Number(m.dataset.depth),
        ease: "none",
        scrollTrigger: { trigger: el.querySelector(".ch-stage"), start: "top top", end: "+=220%", scrub: true },
      });
    });
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
      <div className="ch-stage relative flex min-h-[100svh] items-center">
        <div aria-hidden="true" className="absolute inset-0 hidden md:block">
          {MATERIALS.map((m) => (
            <span
              key={m.t}
              data-depth={m.d}
              className="ch-mat absolute whitespace-nowrap font-sans font-semibold uppercase tracking-[0.2em] text-paper/30"
              style={{ left: `${m.x}%`, top: `${m.y}%`, fontSize: `${m.s}rem` }}
            >
              {m.t}
            </span>
          ))}
        </div>
        <div className="page-x relative mx-auto grid w-full max-w-page gap-10 py-24 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <p className="label mb-4 text-mute">The challenge</p>
            <p className="font-display font-bold leading-[0.78]">
              <span className="ch-count veil-warm text-[clamp(9rem,30vw,26rem)]">95</span>
              <span className="text-[clamp(4rem,12vw,10rem)] text-mustard">%</span>
            </p>
            <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-[0.24em]">Unconventional material</p>
            <p className="mt-3 max-w-md text-sm text-mute md:hidden">Paper · metal · wire · wood · found objects · natural · recycled · experimental</p>
          </div>
          <ul className="grid gap-6">
            <li className="ch-step border-t border-white/15 pt-4">
              <p className="font-display text-6xl font-bold leading-none text-pink">5%</p>
              <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-[0.22em]">Textile / fabric — no more</p>
            </li>
            <li className="ch-step border-t border-white/15 pt-4">
              <p className="font-display text-6xl font-bold leading-none">100%</p>
              <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-[0.22em]">
                Human-made <span className="ml-2 inline-block h-[2px] w-8 align-middle bg-green" />
              </p>
              <p className="mt-2 text-sm text-mute">Human authorship, making and intervention.</p>
            </li>
            <li className="ch-step border-t border-white/15 pt-4">
              <p className="font-display text-3xl font-bold uppercase leading-none">Safety review</p>
              <p className="mt-2 text-sm text-mute">Materials, structures, wearable components, props and performance meet the final safety rules.</p>
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
