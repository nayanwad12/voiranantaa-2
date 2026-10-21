"use client";

import { useRef } from "react";
import { gsap, useSectionMotion } from "./motion";

/**
 * A threshold between two elements. The element's name flies through the
 * camera while the universe re-forms behind it.
 */
export function Gate({
  index,
  name,
  subject,
  form,
}: {
  index: number;
  name: string;
  subject: string;
  form: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    const word = el.querySelector(".gate-word");
    const meta = el.querySelectorAll(".gate-meta");
    gsap.set(word, { scale: 0.35, opacity: 0, filter: "blur(12px)" });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top top", end: "+=110%", scrub: 0.8, pin: true },
    });
    tl.to(word, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out" })
      .from(meta, { opacity: 0, y: 20, duration: 0.25, stagger: 0.05 }, 0.15)
      .to(word, { scale: 9, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.55)
      .to(meta, { opacity: 0, duration: 0.2 }, 0.6);
  });

  return (
    <section
      ref={ref}
      data-form={form}
      data-element={index - 1}
      aria-label={`Chapter ${index}: ${name}`}
      className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden text-center"
    >
      <p className="gate-meta label mb-6 text-mute">
        {String(index).padStart(2, "0")} — 05
      </p>
      <p
        className={`gate-word ${["veil-warm", "veil-cool", "veil-olive", "veil-warm"][(index - 2) % 4]} font-display text-[clamp(6rem,30vw,26rem)] font-bold uppercase leading-[0.8]`}
      >
        {name}
      </p>
      <p className="gate-meta mt-8 font-sans text-sm font-semibold uppercase tracking-[0.3em] text-sand">{subject}</p>
    </section>
  );
}
