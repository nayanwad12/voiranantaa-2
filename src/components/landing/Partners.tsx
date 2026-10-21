"use client";

import { useRef } from "react";
import Link from "next/link";
import { partnerTiers } from "@/content/partners";
import { gsap, useSectionMotion } from "./motion";

/** PARTNERS — six ways in, as large rows that light up on approach. */
export function Partners() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    gsap.from(el.querySelectorAll(".pt-h .w-c"), {
      yPercent: 110,
      stagger: 0.06,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });
    el.querySelectorAll<HTMLElement>(".pt-row").forEach((row) => {
      gsap.from(row, { opacity: 0, x: -60, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 90%" } });
    });
  });

  return (
    <section ref={ref} data-form="8" data-element="4" className="relative py-28 md:py-40">
      <div className="page-x mx-auto max-w-page">
        <div className="mb-16 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <h2 className="pt-h font-display text-[clamp(3.2rem,8.5vw,8.5rem)] font-bold uppercase leading-[0.84]">
            {["Build the", "infinite", "with us."].map((l) => (
              <span key={l} className="block overflow-hidden pb-[0.04em]">
                <span className="w-c inline-block">{l}</span>
              </span>
            ))}
          </h2>
          <p className="max-w-md text-lg font-light leading-relaxed text-paper/80">
            We invite brands, institutions and collaborators to contribute to an experience that brings new ideas into public view.
          </p>
        </div>
        <ul className="border-t border-white/15">
          {partnerTiers.map((t, i) => (
            <li key={t.name} className="pt-row group relative overflow-hidden border-b border-white/15">
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                style={{ background: `var(--${t.accent})` }}
              />
              <div className="relative grid gap-2 py-6 transition-colors duration-300 group-hover:text-black md:grid-cols-[5rem_1fr_1.2fr] md:items-center md:py-8">
                <span className="font-sans text-xs font-semibold tabular-nums tracking-[0.2em] text-mute group-hover:text-black/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold uppercase leading-none">{t.name}</h3>
                <p className="text-base text-mute group-hover:text-black/80 md:text-lg">{t.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/partners/enquire" className="pill pill-solid">
            Partner with us
          </Link>
          <Link href="/partners" className="pill">
            All opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}
