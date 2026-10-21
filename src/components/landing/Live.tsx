"use client";

import { useRef } from "react";
import { edition } from "@/content/edition";
import { cx } from "@/lib/cx";
import { gsap, useSectionMotion } from "./motion";

const CARDS = [
  { title: "The work", body: "The wearable artwork.", tone: "bg-paper text-black" },
  { title: "The idea", body: "What the work communicates.", tone: "bg-blue text-black" },
  { title: "The experience", body: "How it comes alive.", tone: "bg-night text-paper border border-white/15" },
];

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** LIVE EXPERIENCE — five minutes on a clock; the three parts of a performance stack up. */
export function Live() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const clock = el.querySelector<HTMLElement>(".live-clock");
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".live-card"));
    const total = edition.live.minutes * 60;
    const setClock = (p: number) => {
      if (clock) clock.textContent = fmt(total * (1 - p));
    };
    if (c.desktop) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el.querySelector(".live-stage"),
          start: "top top",
          end: "+=240%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => setClock(self.progress),
        },
      });
      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.fromTo(card, { yPercent: 160, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1, ease: "power2.out" }, (i - 1) * 1.1);
        tl.to(cards[i - 1], { scale: 0.9, yPercent: -6, opacity: 0.55, duration: 1 }, (i - 1) * 1.1);
      });
      tl.to({}, { duration: 0.6 });
    } else {
      gsap.timeline({
        scrollTrigger: {
          trigger: el.querySelector(".live-stage"),
          start: "top 60%",
          end: "bottom 60%",
          scrub: true,
          onUpdate: (self) => setClock(self.progress),
        },
      });
      cards.forEach((card) =>
        gsap.from(card, { y: 60, opacity: 0, rotate: 3, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } }),
      );
    }

    const marquee = el.querySelector(".live-marquee");
    gsap.fromTo(
      marquee,
      { xPercent: 0 },
      { xPercent: -40, ease: "none", scrollTrigger: { trigger: marquee, start: "top bottom", end: "bottom top", scrub: 0.5 } },
    );
  });

  const elements = Array.from({ length: 3 }, () => edition.live.elements.map((e) => `${e} · `).join("")).join("");

  return (
    <section ref={ref} data-form="6" data-element="3" className="relative overflow-hidden">
      <div className="live-stage page-x mx-auto grid min-h-[100svh] max-w-page items-center gap-10 py-24 md:grid-cols-[1fr_1fr] md:gap-16">
        <div>
          <p className="label mb-6 text-mute">Live experience</p>
          <h2 className="font-display text-[clamp(2.6rem,5.6vw,5.6rem)] font-bold uppercase leading-[0.88]">
            The garment is only half the story.
          </h2>
          <p
            className="live-clock mt-8 font-display text-[clamp(5.5rem,15vw,13rem)] font-bold leading-none tabular-nums text-blue"
            aria-label={`${edition.live.minutes} minutes`}
          >
            {fmt(edition.live.minutes * 60)}
          </p>
          <p className="mt-4 max-w-md text-lg font-light leading-relaxed text-paper/80">
            Every selected finalist presents the wearable artwork and its concept as one live experience.
          </p>
        </div>
        <div className="live-cards relative grid gap-4 md:block md:h-[min(68vh,34rem)]">
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={cx(
                "live-card flex flex-col justify-between rounded-[1.6rem] p-7 md:absolute md:inset-0 md:p-10",
                card.tone,
              )}
              style={{ zIndex: i + 1 }}
            >
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                {i + 1} / {CARDS.length}
              </span>
              <div className="mt-16 md:mt-0">
                <h3 className="font-display text-[clamp(3rem,6vw,6rem)] font-bold uppercase leading-[0.85]">{card.title}</h3>
                <p className="mt-3 text-xl">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="overflow-hidden border-y border-white/10 py-6">
        <p className="live-marquee outline-type whitespace-nowrap font-display text-[clamp(3.5rem,10vw,9rem)] font-bold uppercase leading-none">
          {elements}
        </p>
      </div>
      <p className="sr-only">Possible elements: {edition.live.elements.join(", ")}.</p>
    </section>
  );
}
