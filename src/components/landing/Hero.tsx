"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { edition } from "@/content/edition";
import { gsap, useSectionMotion } from "./motion";
import { onIntroDone } from "./Intro";

/** ENTER — the name arrives, then breaks apart into depth as you scroll in. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const letters = el.querySelectorAll<HTMLElement>(".hero-l");
    const mid = (letters.length - 1) / 2;
    gsap.set(letters, { yPercent: 115 });
    gsap.set(el.querySelectorAll(".hero-fade"), { autoAlpha: 0, y: 24 });

    const stopIntro = onIntroDone(() => {
      gsap.to(letters, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: { each: 0.06, from: "center" } });
      gsap.to(el.querySelectorAll(".hero-fade"), { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.12, delay: 0.6 });
    });

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
      .to(el.querySelector(".hero-tag"), { letterSpacing: "1.2em", opacity: 0, ease: "power1.in" }, 0)
      .to(el.querySelectorAll(".hero-out"), { opacity: 0, y: -40, ease: "power1.in" }, 0);

    return stopIntro;
  });

  return (
    <section ref={ref} data-form="0" data-element="0" className="relative h-[100svh] overflow-hidden">
      <div className="page-x mx-auto flex h-full max-w-page flex-col justify-between pb-8 pt-[calc(var(--header-h)+1.5rem)]">
        <div className="hero-out hero-fade flex items-center justify-between font-sans text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-mute">
          <span>{edition.label}</span>
          <span className="hidden sm:inline">A wearable-art competition &amp; live experience</span>
          <span>{edition.title}</span>
        </div>

        <div className="text-center">
          <h1
            aria-label={site.name}
            className="font-display text-[clamp(3.7rem,16.4vw,17.5rem)] font-bold leading-[0.8] [perspective:900px]"
          >
            <span className="block overflow-hidden pb-[0.04em]" aria-hidden="true">
              {site.name.split("").map((ch, i) => (
                <span key={i} className="hero-l inline-block will-change-transform">
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-tag hero-fade mt-5 font-sans text-[clamp(0.8rem,1.6vw,1.25rem)] font-semibold uppercase tracking-[0.55em] text-blue">
            {site.tagline}
          </p>
        </div>

        <div className="hero-out hero-fade flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-sm text-[1.05rem] font-light leading-relaxed text-paper/80">
            Nine emotional worlds. Twenty finalists. One stage. A wearable-art competition and live experience by{" "}
            {site.publisher}.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#participate" className="pill pill-solid">
              Participate
            </a>
            <a href="#theme" className="pill">
              Explore the theme
            </a>
          </div>
        </div>
      </div>
      <div className="hero-out pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="label text-mute">Scroll to descend</span>
        <span className="scroll-line" />
      </div>
    </section>
  );
}
