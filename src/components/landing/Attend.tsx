"use client";

import { useRef } from "react";
import { edition } from "@/content/edition";
import { VisitorForm } from "@/components/forms/VisitorForm";
import { gsap, useSectionMotion } from "./motion";

/** ATTEND — the live show: what's known, what's coming, and a place to register interest. */
export function Attend() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    gsap.from(el.querySelectorAll(".at-h .w-c"), {
      yPercent: 110,
      stagger: 0.06,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });
    gsap.from(el.querySelectorAll(".at-row"), {
      opacity: 0,
      x: 60,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el.querySelector(".at-rows"), start: "top 80%" },
    });
    gsap.from(el.querySelector(".at-form"), {
      opacity: 0,
      y: 80,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el.querySelector(".at-form"), start: "top 85%" },
    });
  });

  const rows = [
    { k: "Proposed dates", v: edition.show.datesLabel, tag: edition.show.tentative ? "Tentative" : undefined },
    { k: "Venue", v: edition.show.venue ?? "To be announced" },
    { k: "Passes", v: edition.show.passes ?? "Details to be announced" },
  ];

  return (
    <section ref={ref} data-form="0" className="relative py-28 md:py-36">
      <div className="page-x mx-auto max-w-page">
        <p className="label mb-6 text-mute">Attend the show</p>
        <h2 className="at-h font-display text-[clamp(3.2rem,9vw,9rem)] font-bold uppercase leading-[0.84]">
          {["Come see what", "art can become."].map((l) => (
            <span key={l} className="block overflow-hidden pb-[0.04em]">
              <span className="w-c veil inline-block">{l}</span>
            </span>
          ))}
        </h2>
        <p className="mt-8 max-w-2xl text-xl font-light leading-relaxed text-paper/85">
          Twenty wearable artworks. Twenty distinct interpretations. A live experience shaped by material, movement and ideas.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <dl className="at-rows border-t border-white/15">
            {rows.map((r) => (
              <div key={r.k} className="at-row flex flex-wrap items-baseline justify-between gap-4 border-b border-white/15 py-6">
                <dt className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-mute">{r.k}</dt>
                <dd className="flex items-center gap-3 font-display text-[clamp(1.6rem,2.8vw,2.6rem)] font-bold uppercase leading-none">
                  {r.v}
                  {r.tag && (
                    <span className="rounded-full border border-pink/50 px-3 py-1 font-sans text-[0.6rem] font-semibold tracking-[0.2em] text-pink">
                      {r.tag}
                    </span>
                  )}
                </dd>
              </div>
            ))}
            <p className="pt-6 text-sm text-mute">
              Passes go on sale only once the admission model, price, capacity and venue are confirmed.
            </p>
          </dl>

          <div className="at-form rounded-[1.6rem] border border-white/12 bg-night/80 p-6 backdrop-blur-xl md:p-10">
            <p className="label mb-2 text-mustard">Visitor registration</p>
            <h3 className="mb-8 font-display text-4xl font-bold uppercase leading-none">Register your interest</h3>
            <VisitorForm />
          </div>
        </div>
      </div>
    </section>
  );
}
