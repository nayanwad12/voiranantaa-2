"use client";

import { useRef } from "react";
import { ApplyButton } from "./ApplyOverlay";
import { edition, formatINR } from "@/content/edition";
import { gsap, useSectionMotion } from "./motion";

/** OPEN CALL — the screen floods blue through the ring; disciplines stream past. */
export function OpenCall() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    gsap.fromTo(
      el,
      { clipPath: "circle(6% at 50% 40%)" },
      { clipPath: "circle(150% at 50% 40%)", ease: "power2.in", scrollTrigger: { trigger: el, start: "top 95%", end: "top 5%", scrub: 0.8 } },
    );
    gsap.from(el.querySelectorAll(".oc-h .w-c"), {
      yPercent: 110,
      stagger: 0.05,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el.querySelector(".oc-h"), start: "top 80%" },
    });
    const rows = el.querySelectorAll<HTMLElement>(".oc-row");
    rows.forEach((row, i) =>
      gsap.fromTo(
        row,
        { xPercent: i % 2 ? -30 : 0 },
        { xPercent: i % 2 ? 0 : -30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 } },
      ),
    );
    gsap.from(el.querySelectorAll(".oc-fee"), {
      rotateX: -90,
      opacity: 0,
      transformOrigin: "50% 0%",
      stagger: 0.15,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el.querySelector(".oc-fees"), start: "top 85%" },
    });
  });

  const people = edition.eligibility.audience;
  const half = Math.ceil(people.length / 2);
  const row = (list: readonly string[]) => Array.from({ length: 3 }, () => list.map((p) => `${p} ✦ `).join("")).join("");

  return (
    <section ref={ref} data-form="8" className="relative overflow-hidden bg-crimson py-28 text-black md:py-36">
      <div className="page-x mx-auto max-w-page">
        <p className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.24em]">Open call · Edition 01</p>
        <h2 className="oc-h font-display text-[clamp(3.6rem,11vw,11rem)] font-bold uppercase leading-[0.82]">
          {["Make an idea", "wearable."].map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <span className="w-c inline-block">{line}</span>
            </span>
          ))}
        </h2>
        <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed">
          Open to individuals aged {edition.eligibility.minAge}+. If you make, shape, perform or imagine, this is for you.
        </p>
      </div>

      <div aria-hidden="true" className="my-14 select-none overflow-hidden border-y border-black/20 py-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold uppercase leading-[1.05]">
        <p className="oc-row whitespace-nowrap">{row(people.slice(0, half))}</p>
        <p className="oc-row whitespace-nowrap text-black/40">{row(people.slice(half))}</p>
      </div>
      <p className="sr-only">Open to: {people.join(", ")}.</p>

      <div className="page-x mx-auto grid max-w-page gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div className="oc-fees grid grid-cols-2 gap-4 [perspective:900px]">
          {[
            { label: "Students", fee: edition.fees.student },
            { label: "Others", fee: edition.fees.others },
          ].map((f) => (
            <div key={f.label} className="oc-fee rounded-[1.4rem] bg-black p-6 text-paper md:p-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-mustard">{f.label}</p>
              <p className="mt-6 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-bold leading-none">{formatINR(f.fee)}</p>
              <p className="mt-2 text-xs text-mute">Application fee</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          {edition.registrationOpen ? (
            <ApplyButton className="pill pill-dark justify-center py-5 text-sm">Register to participate →</ApplyButton>
          ) : (
            <>
              <div className="rounded-[1.4rem] border border-black/25 p-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em]">Registration opens</p>
                <p className="mt-2 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold uppercase leading-none">
                  {edition.registrationOpensLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#how-to-participate" className="pill pill-dark">
                  How to participate
                </a>
                <ApplyButton className="pill pill-outline-dark">Preview the application</ApplyButton>
              </div>
            </>
          )}
          <p className="text-sm">Registration does not guarantee selection. 20 finalists · 2 category winners.</p>
        </div>
      </div>
    </section>
  );
}
