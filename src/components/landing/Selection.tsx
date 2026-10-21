"use client";

import { useRef } from "react";
import { criteria } from "@/content/categories";
import { edition } from "@/content/edition";
import { site } from "@/content/site";
import { gsap, useSectionMotion } from "./motion";

const PERSPECTIVES = ["Fashion", "Art", "Design", "Material", "Performance", "Culture"];

/** SELECTION — from every entry to 20 finalists and two winners; the six lenses; the judges. */
export function Selection() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    el.querySelectorAll<HTMLElement>(".sel-n").forEach((n) => {
      const to = Number(n.dataset.to);
      const o = { v: 0 };
      gsap.to(o, {
        v: to,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          n.textContent = String(Math.round(o.v)).padStart(2, "0");
        },
        scrollTrigger: { trigger: n, start: "top 85%" },
      });
    });
    gsap.fromTo(
      el.querySelector(".sel-line"),
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { trigger: el.querySelector(".sel-journey"), start: "top 75%", end: "bottom 60%", scrub: true } },
    );
    gsap.from(el.querySelectorAll(".sel-stage"), {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      scrollTrigger: { trigger: el.querySelector(".sel-journey"), start: "top 75%" },
    });
    gsap.from(el.querySelectorAll(".lens"), {
      rotateY: -90,
      opacity: 0,
      transformOrigin: "0% 50%",
      stagger: 0.1,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el.querySelector(".lenses"), start: "top 80%" },
    });
    const pw = el.querySelectorAll(".persp");
    gsap.set(pw, { opacity: 0.12 });
    gsap.to(pw, {
      opacity: 1,
      stagger: 0.2,
      ease: "none",
      scrollTrigger: { trigger: el.querySelector(".persp-wrap"), start: "top 80%", end: "bottom 50%", scrub: true },
    });
  });

  return (
    <section ref={ref} data-form="4" className="relative py-28 md:py-36">
      <span id="selection" aria-hidden="true" className="block h-0" />
      <div className="page-x mx-auto max-w-page">
        <p className="label mb-6 text-mute">Selection process</p>
        <h2 className="veil max-w-5xl font-display text-[clamp(2.8rem,7vw,7rem)] font-bold uppercase leading-[0.86]">
          {edition.selection.totalFinalists} finalists. Two category winners.
        </h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[1.4rem] border border-white/12 bg-white/12 md:grid-cols-3">
          {[
            { n: edition.selection.finalistsPerCategory, label: "Finalists", sub: "RAGA / FORM" },
            { n: edition.selection.finalistsPerCategory, label: "Finalists", sub: "RAGA / VOICE" },
            { n: edition.selection.winners, label: "Winners", sub: "One per category", accent: true },
          ].map((s) => (
            <div key={s.sub} className="bg-black p-8">
              <p className="font-display text-[clamp(6rem,12vw,10rem)] font-bold leading-none">
                <span className={`sel-n ${s.accent ? "veil-warm" : "veil"}`} data-to={s.n}>
                  {String(s.n).padStart(2, "0")}
                </span>
              </p>
              <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.22em]">{s.label}</p>
              <p className="text-sm text-mute">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="sel-journey relative mt-20">
          <p className="label mb-8 text-mute">Selection journey</p>
          <span aria-hidden="true" className="absolute left-0 right-0 top-[3.6rem] hidden h-px bg-white/12 md:block" />
          <span aria-hidden="true" className="sel-line absolute left-0 right-0 top-[3.6rem] hidden h-px origin-left bg-mustard md:block" />
          <ol className="grid gap-8 md:grid-cols-5 md:gap-6">
            {edition.selection.journey.map((step, i) => (
              <li key={step} className="sel-stage relative pt-8">
                <span aria-hidden="true" className="absolute left-0 top-[0.35rem] h-2.5 w-2.5 rounded-full bg-mustard md:top-[0.45rem]" />
                <p className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mute">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-display text-2xl font-bold uppercase leading-tight">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <span id="judging" aria-hidden="true" className="block h-0" />
        <div className="mt-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h3 className="veil font-display text-[clamp(2.4rem,5.5vw,5.4rem)] font-bold uppercase leading-[0.88]">
              Six lenses.
              <br />
              One complete work.
            </h3>
            <p className="max-w-xs text-sm text-mute">Every finalist is judged through the same six lenses. Tap or hover a lens to read its question.</p>
          </div>
          <ul className="lenses grid grid-cols-2 gap-3 [perspective:1200px] md:grid-cols-3">
            {criteria.map((c, i) => (
              <li key={c.name} className="lens">
                <button
                  type="button"
                  onClick={(e) => e.currentTarget.classList.toggle("is-flipped")}
                  className="lens-card group relative block aspect-[4/3] w-full text-left [transform-style:preserve-3d]"
                  aria-label={`${c.name}: ${c.question}`}
                >
                  <span className="lens-face absolute inset-0 flex flex-col justify-between rounded-[1.2rem] border border-white/12 bg-night p-5 md:p-7">
                    <span className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[clamp(2rem,4vw,3.6rem)] font-bold uppercase leading-none">{c.name}</span>
                  </span>
                  <span
                    className="lens-back absolute inset-0 flex flex-col justify-between rounded-[1.2rem] p-5 text-black md:p-7"
                    style={{ background: `var(--${c.accent === "pink" ? "white" : "blue"})` }}
                  >
                    <span className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.22em]">{c.name}</span>
                    <span className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-bold uppercase leading-[0.95]">{c.question}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <span id="judges" aria-hidden="true" className="block h-0" />
        <div className="mt-28 grid gap-10 md:grid-cols-[1fr_1fr] md:gap-20">
          <div>
            <p className="label mb-6 text-mute">The judges</p>
            <h3 className="veil font-display text-[clamp(2.4rem,5.5vw,5.4rem)] font-bold uppercase leading-[0.88]">
              Meet the eyes behind {site.name}.
            </h3>
            <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-paper/80">
              The panel brings perspectives across fashion, art, design, material, performance and culture.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-pink/50 px-4 py-1.5 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-pink">
              <span className="h-1.5 w-1.5 rounded-full bg-pink" /> Panel to be announced
            </span>
            <p className="mt-3 text-sm text-mute">Profiles are published only once each judge has confirmed.</p>
          </div>
          <ul className="persp-wrap grid content-center gap-1" aria-label="Perspectives on the panel">
            {PERSPECTIVES.map((p) => (
              <li key={p} className="persp veil font-display text-[clamp(2.8rem,6.5vw,6rem)] font-bold uppercase leading-[0.92]">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
