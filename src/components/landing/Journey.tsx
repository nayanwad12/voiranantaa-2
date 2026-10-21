"use client";

import { useRef } from "react";
import { timeline, toConfirm } from "@/content/timeline";
import { gsap, useSectionMotion } from "./motion";

/** THE JOURNEY — a light travels the timeline, waking each milestone. */
export function Journey() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const steps = Array.from(el.querySelectorAll<HTMLElement>(".jr-step"));
    const fill = el.querySelector<HTMLElement>(".jr-fill");
    const light = el.querySelector<HTMLElement>(".jr-light");
    gsap.set(steps, { opacity: 0.25 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el.querySelector(".jr-stage"),
        start: c.desktop ? "top top" : "top 60%",
        end: c.desktop ? "+=200%" : "bottom 60%",
        scrub: 1,
        pin: c.desktop,
      },
    });
    tl.fromTo(fill, c.desktop ? { scaleX: 0 } : { scaleY: 0 }, { ...(c.desktop ? { scaleX: 1 } : { scaleY: 1 }), ease: "none", duration: 1 }, 0);
    if (light) tl.fromTo(light, c.desktop ? { left: "0%" } : { top: "0%" }, { ...(c.desktop ? { left: "100%" } : { top: "100%" }), ease: "none", duration: 1 }, 0);
    steps.forEach((s, i) => {
      tl.to(s, { opacity: 1, duration: 0.08 }, (i / steps.length) * 0.95);
      tl.fromTo(s.querySelector(".jr-title"), { yPercent: 60 }, { yPercent: 0, duration: 0.15, ease: "power2.out" }, (i / steps.length) * 0.95);
    });
  });

  return (
    <section ref={ref} data-form="7" data-element="3" className="relative overflow-hidden">
      <div className="jr-stage page-x mx-auto flex min-h-[100svh] max-w-page flex-col justify-center py-24">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="veil font-display text-[clamp(2.8rem,6.5vw,6.5rem)] font-bold uppercase leading-[0.86]">
            The journey
            <br />
            to the stage.
          </h2>
          <span className="rounded-full border border-pink/50 px-4 py-1.5 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-pink">
            Tentative timeline
          </span>
        </div>

        <div className="relative pl-8 md:pl-0 md:pt-10">
          <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-white/15 md:bottom-auto md:right-0 md:top-0 md:h-px md:w-auto" />
          <div aria-hidden="true" className="jr-fill absolute bottom-0 left-0 top-0 w-px origin-top bg-mustard md:bottom-auto md:right-0 md:top-0 md:h-px md:w-auto md:origin-left" />
          <span aria-hidden="true" className="jr-light absolute left-0 top-0 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow-[0_0_24px_6px_rgba(226,190,34,.75)] md:block" />
          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {timeline.map((t, i) => (
              <li key={t.what} className="jr-step relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-8 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full md:-top-10 md:left-0 md:translate-x-0 md:-translate-y-1/2"
                  style={{ background: i === timeline.length - 1 ? "var(--pink)" : "var(--blue)" }}
                />
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sand">{t.when}</p>
                <div className="overflow-hidden">
                  <p className="jr-title veil mt-3 font-display text-[clamp(2rem,3.2vw,3.2rem)] font-bold uppercase leading-[0.92]">{t.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-16 text-sm text-mute">To be confirmed: {toConfirm.join(" · ").toLowerCase()}.</p>
      </div>
    </section>
  );
}
