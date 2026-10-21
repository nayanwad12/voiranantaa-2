"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useSectionMotion } from "./motion";

const QUESTION = "What will you make wearable?";

/** The last question — letters gather out of the universe. */
export function Finale() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const letters = el.querySelectorAll<HTMLElement>(".fin-l");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el.querySelector(".fin-stage"), start: "top top", end: c.desktop ? "+=150%" : "+=110%", scrub: 1, pin: true },
    });
    tl.from(letters, {
      x: () => gsap.utils.random(-window.innerWidth * 0.6, window.innerWidth * 0.6),
      y: () => gsap.utils.random(-window.innerHeight * 0.6, window.innerHeight * 0.6),
      rotate: () => gsap.utils.random(-120, 120),
      scale: () => gsap.utils.random(0.2, 3),
      opacity: 0,
      stagger: { each: 0.015, from: "random" },
      duration: 1,
      ease: "power3.out",
    })
      .from(el.querySelectorAll(".fin-tile"), { yPercent: 60, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" }, 0.85)
      .to({}, { duration: 0.3 });
  });

  const tiles = [
    { href: "#participate", label: "Participate", note: "Designers, artists, makers and students", tone: "bg-crimson text-paper" },
    { href: "#partners", label: "Partner", note: "Brands, institutions and collaborators", tone: "bg-mustard text-black" },
    { href: "#attend", label: "Attend", note: "Register your interest in the live show", tone: "bg-navy text-paper" },
  ];

  return (
    <section ref={ref} data-form="9" className="relative">
      <div className="fin-stage page-x mx-auto flex min-h-[100svh] max-w-page flex-col justify-center py-24">
        <h2
          aria-label={QUESTION}
          className="text-center font-display text-[clamp(3.4rem,11vw,11rem)] font-bold uppercase leading-[0.84]"
        >
          {QUESTION.split(" ").map((w, wi) => (
            <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
              {w.split("").map((ch, i) => (
                <span key={i} className={`fin-l inline-block ${(wi + i) % 3 === 0 ? "veil-warm" : (wi + i) % 3 === 1 ? "veil" : "veil-cool"}`}>
                  {ch}
                </span>
              ))}
              &nbsp;
            </span>
          ))}
        </h2>
        <ul className="mt-14 grid gap-3 md:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.href} className="fin-tile">
              <a
                href={t.href}
                className={`group flex h-full flex-col justify-between gap-10 rounded-[1.4rem] p-6 transition-transform duration-500 hover:-translate-y-1 md:p-8 ${t.tone}`}
              >
                <span className="font-display text-5xl font-bold uppercase leading-none">{t.label}</span>
                <span className="flex items-end justify-between gap-4 text-sm">
                  {t.note}
                  <span aria-hidden="true" className="text-2xl transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-mustard">{site.tagline}</p>
      </div>
    </section>
  );
}
