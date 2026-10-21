"use client";

import { useRef } from "react";
import { categories } from "@/content/categories";
import { cx } from "@/lib/cx";
import { gsap, useSectionMotion } from "./motion";

/** TWO CATEGORIES — two blocks of colour slide in and meet in the middle. */
export function Categories() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const [a, b] = Array.from(el.querySelectorAll<HTMLElement>(".cat-panel"));
    const qs = el.querySelectorAll(".cat-q .w-c");
    gsap.set(qs, { yPercent: 110 });
    if (c.desktop) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=160%", scrub: 1, pin: true } });
      tl.fromTo(a, { xPercent: -100 }, { xPercent: 0, ease: "power3.out", duration: 1 }, 0)
        .fromTo(b, { xPercent: 100 }, { xPercent: 0, ease: "power3.out", duration: 1 }, 0)
        .fromTo(el.querySelectorAll(".cat-in"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 }, 0.6)
        .to(qs, { yPercent: 0, stagger: 0.03, duration: 0.5, ease: "power3.out" }, 1.1)
        .to({}, { duration: 0.4 });
    } else {
      [a, b].forEach((panel, i) => {
        gsap.fromTo(
          panel,
          { xPercent: i ? 40 : -40, opacity: 0.4 },
          { xPercent: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: panel, start: "top bottom", end: "top 35%", scrub: 0.6 } },
        );
        gsap.to(panel.querySelectorAll(".cat-q .w-c"), {
          yPercent: 0,
          stagger: 0.03,
          scrollTrigger: { trigger: panel.querySelector(".cat-q"), start: "top 85%" },
        });
      });
    }
  });

  return (
    <section ref={ref} data-form="4" className="relative overflow-hidden md:h-[100svh]">
      <h2 className="sr-only">Two categories. Two approaches.</h2>
      <div className="grid h-full md:grid-cols-2">
        {categories.map((cat, i) => (
          <article
            key={cat.id}
            className={cx(
              "cat-panel relative flex min-h-[100svh] flex-col justify-between p-[var(--gutter)] pt-[calc(var(--header-h)+2rem)] md:min-h-0",
              i === 0 ? "bg-navy text-paper" : "bg-mustard text-black",
            )}
          >
            <div className="cat-in flex items-center justify-between font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em]">
              <span>Category {i + 1} / 2</span>
              <span>{cat.kicker}</span>
            </div>
            <div>
              <h3 className="cat-in font-display text-[clamp(3.6rem,8.5vw,9rem)] font-bold uppercase leading-[0.82]">
                {cat.name.split(" / ").map((part, k) => (
                  <span key={k} className="block">
                    {k ? `/ ${part}` : part}
                  </span>
                ))}
              </h3>
              <p className="cat-in mt-6 max-w-md text-lg leading-relaxed">{cat.summary}</p>
              <ul className="cat-in mt-6 flex max-w-lg flex-wrap gap-2">
                {cat.lenses.map((l) => (
                  <li key={l} className="rounded-full border border-[color:color-mix(in_srgb,currentColor_30%,transparent)] px-3 py-1 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em]">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <p className="cat-q font-display text-[clamp(1.8rem,3.2vw,3rem)] font-bold uppercase leading-[0.95]">
              {cat.question.split(" ").map((w, k) => (
                <span key={k} className="inline-block overflow-hidden align-bottom">
                  <span className="w-c inline-block">{w}&nbsp;</span>
                </span>
              ))}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
