"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { edition } from "@/content/edition";
import { gsap, useSectionMotion } from "./motion";

/** ENTER — the name arrives over the galaxy, then breaks apart into depth as you scroll in. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const letters = el.querySelectorAll<HTMLElement>(".hero-l");
    const mid = (letters.length - 1) / 2;
    gsap.set(letters, { yPercent: 115 });
    gsap.set(el.querySelectorAll(".hero-fade"), { autoAlpha: 0, y: 24 });

    // The name rises in as soon as the page opens.
    gsap.to(letters, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: { each: 0.06, from: "center" }, delay: 0.15 });
    gsap.to(el.querySelectorAll(".hero-fade"), { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.12, delay: 0.7 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top top", end: c.desktop ? "+=130%" : "+=90%", scrub: 1, pin: true },
    });
    tl.to(
      letters,
      {
        z: (i) => 300 + Math.abs(i - mid) * 140,
        x: (i) => (i - mid) * (c.desktop ? 70 : 30),
        y: (i) => (i % 2 ? -1 : 1) * 40,
        rotateY: (i) => (i - mid) * -9,
        opacity: 0,
        ease: "power2.in",
        stagger: { each: 0.02, from: "center" },
      },
      0,
    )
      .to(el.querySelector(".hero-tag"), { letterSpacing: "1.2em", ease: "power1.in" }, 0)
      .to(el.querySelectorAll(".hero-out"), { opacity: 0, y: -40, ease: "power1.in" }, 0);
  });

  return (
    <section ref={ref} data-form="0" className="relative h-[100svh] overflow-hidden">
      <div className="page-x relative mx-auto flex h-full max-w-page flex-col justify-between pb-8 pt-[calc(var(--header-h)+1.5rem)]">
        {/* Wrappers (hero-out) leave on scroll; their contents (hero-fade) fade in on load. */}
        <div className="hero-out">
          <div className="hero-fade flex items-center justify-between font-sans text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-mute">
            <span>{edition.label}</span>
            <span>{edition.title}</span>
          </div>
        </div>

        <div className="text-center">
          <h1
            aria-label={site.name}
            className="font-display text-[clamp(3.7rem,16.4vw,17.5rem)] font-bold leading-[0.8] [perspective:900px]"
          >
            <span className="block overflow-hidden pb-[0.04em]" aria-hidden="true">
              {site.name.split("").map((ch, i, all) => (
                <span
                  key={i}
                  className="hero-l veil-warm inline-block will-change-transform"
                  style={{
                    backgroundSize: `140px 140px, ${all.length * 100}% 100%`,
                    backgroundPosition: `0 0, ${(i / (all.length - 1)) * 100}% 0`,
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <div className="hero-out">
            <p className="hero-tag hero-fade mt-5 font-sans text-[clamp(0.8rem,1.6vw,1.25rem)] font-semibold uppercase tracking-[0.55em] text-mustard">
              {site.tagline}
            </p>
            <p className="hero-fade mt-6 font-sans text-[clamp(0.68rem,1.1vw,0.85rem)] font-semibold uppercase tracking-[0.24em] text-paper/80">
              A wearable-art competition &amp; live experience
            </p>
          </div>
        </div>

        {/* Balances the top row so the name sits in the middle. */}
        <div aria-hidden="true" className="h-4" />
      </div>
    </section>
  );
}
