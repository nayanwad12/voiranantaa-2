"use client";

import { useRef } from "react";
import { edition } from "@/content/edition";
import { cx } from "@/lib/cx";
import { gsap, useSectionMotion } from "./motion";

const CARDS = [
  {
    title: "The work",
    body: "The wearable artwork.",
    detail: "Form, material, construction and finish — made by hand, at least 95% from unconventional material.",
    tone: "bg-mustard text-black",
  },
  {
    title: "The idea",
    body: "What the work communicates.",
    detail: "The rasa you interpret, the thought behind it, and how clearly it reaches the audience.",
    tone: "bg-navy text-paper",
  },
  {
    title: "The experience",
    body: "How it comes alive.",
    detail: "Movement, music, dance, theatre, light, sound or spoken word — the work presented live on stage.",
    tone: "bg-crimson text-paper",
  },
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
  });

  return (
    <section ref={ref} data-form="6" className="relative overflow-hidden">
      <div className="live-stage page-x mx-auto grid min-h-[100svh] max-w-page items-center gap-10 py-24 md:grid-cols-[1fr_1fr] md:gap-16">
        <div>
          <p className="label mb-6 text-mute">Live experience</p>
          <h2 className="veil font-display text-[clamp(2.6rem,5.6vw,5.6rem)] font-bold uppercase leading-[0.88]">
            The garment is only half the story
          </h2>
          <p className="label mt-8 text-mustard">{edition.live.minutes} minutes on stage</p>
          <p
            className="live-clock veil-warm mt-2 font-display text-[clamp(5.5rem,15vw,13rem)] font-bold leading-none tabular-nums"
            aria-label={`${edition.live.minutes} minutes`}
          >
            {fmt(edition.live.minutes * 60)}
          </p>
          <p className="mt-4 max-w-md text-lg font-light leading-relaxed text-paper/80">
            Every selected finalist has {edition.live.minutes} minutes on stage to present the wearable artwork and its concept as one
            live experience.
          </p>
        </div>
        <div className="live-cards relative grid gap-4 md:block md:h-[min(68vh,34rem)]">
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={cx(
                "live-card flex flex-col justify-between p-7 md:absolute md:inset-0 md:p-10",
                card.tone,
              )}
              style={{ zIndex: i + 1 }}
            >
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                {i + 1} / {CARDS.length}
              </span>
              <div className="mt-16 md:mt-0">
                <h3 className="font-display text-[clamp(3rem,6vw,6rem)] font-bold uppercase leading-[0.85]">{card.title}</h3>
                <p className="mt-3 text-xl font-semibold">{card.body}</p>
                <p className="mt-2 max-w-md text-base leading-relaxed opacity-85">{card.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="page-x border-y border-white/10 py-8 text-center">
        <p className="label mb-4 text-mute">Possible elements</p>
        <p className="mx-auto max-w-page font-display text-[clamp(1.5rem,3.4vw,3rem)] font-bold uppercase leading-[1.1]">
          {edition.live.elements.map((e, i) => (
            <span key={e}>
              {i > 0 && (
                <span aria-hidden="true" className="px-[0.4em] text-mustard">
                  ·
                </span>
              )}
              <span className="veil whitespace-nowrap">{e}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
