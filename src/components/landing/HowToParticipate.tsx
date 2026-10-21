"use client";

import { useRef } from "react";
import { edition, formatINR } from "@/content/edition";
import { UPLOAD_RULES } from "@/lib/schemas";
import { cx } from "@/lib/cx";
import { gsap, useSectionMotion } from "./motion";
import { ApplyButton } from "./ApplyOverlay";

const STEPS = [
  { title: "Read the brief", body: "Theme, categories, rules, fees and selection process — everything on this page." },
  { title: "Choose category", body: "RAGA / FORM or RAGA / VOICE." },
  { title: "Application", body: "Personal details, concept and material plan." },
  { title: "Declarations", body: "Age, authorship, material, safety and terms." },
  { title: "Payment", body: "Fee, payment status and receipt." },
  { title: "Confirmation", body: "Application ID and next-step email." },
];

const FIELDS = [
  {
    title: "About you",
    items: ["Full name", "Age eligibility", "Email + phone", "City / country", "Institution, if relevant", "Status / discipline", "Portfolio link"],
  },
  {
    title: "Your work",
    items: ["Category", "Artwork title", "Concept statement", "Rasa explored", "Materials proposed", "95 / 5 explanation", "Performance approach", "Proposal uploads"],
  },
  {
    title: "Checkout",
    items: ["Originality / authorship declaration", "Material and safety acceptance", "Terms + privacy", "Student-fee eligibility", "Payment", "Receipt + application ID"],
  },
];

const RULES = [
  {
    q: "Who can enter?",
    a: `Individuals aged ${edition.eligibility.minAge} and over: ${edition.eligibility.audience.join(", ").toLowerCase()}.`,
  },
  {
    q: "What does it cost?",
    a: `${formatINR(edition.fees.student)} for students (valid student ID may be requested) and ${formatINR(edition.fees.others)} for everyone else. One fee per application. The refund policy is published before registration opens.`,
  },
  {
    q: "What is the 95 / 5 rule?",
    a: "At least 95% of the work must be unconventional material — paper, metal, wire, wood, found objects, natural, recycled or experimental materials. No more than 5% may be textile or fabric. How the ratio is measured and verified is published before registration opens.",
  },
  {
    q: "Does it have to be human-made?",
    a: "Yes — 100%. The final work must demonstrate human authorship, making and intervention. The AI and machine-use policy is published before registration opens.",
  },
  {
    q: "What about safety?",
    a: "Materials, structures, wearable components, props and performance must meet the final safety rules. Every finalist goes through a technical and safety review.",
  },
  {
    q: "Do I submit a proposal or a finished piece?",
    a: "The submission format — a concept proposal first, or a completed artwork — is confirmed before registration opens, along with the closing date.",
  },
  {
    q: "What about IP and images?",
    a: "IP, image and publicity permissions are set out in the terms, published before registration opens.",
  },
  {
    q: "Does registering guarantee a place?",
    a: `No. Registration does not guarantee selection. ${edition.selection.totalFinalists} finalists are selected — ${edition.selection.finalistsPerCategory} per category.`,
  },
];

/** HOW TO PARTICIPATE — the registration journey, step by step, then what you'll need and the rules. */
export function HowToParticipate() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const items = Array.from(el.querySelectorAll<HTMLElement>(".ht-step"));
    const num = el.querySelector<HTMLElement>(".ht-num");
    const bar = el.querySelector<HTMLElement>(".ht-bar");
    let current = -1;
    const setActive = (i: number) => {
      if (i === current) return;
      current = i;
      items.forEach((it, k) => it.classList.toggle("is-active", k === i));
      items.forEach((it, k) => it.classList.toggle("is-done", k < i));
      if (num) {
        gsap.fromTo(num, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
        num.textContent = String(i + 1).padStart(2, "0");
      }
    };
    setActive(0);
    if (c.desktop) {
      gsap.timeline({
        scrollTrigger: {
          trigger: el.querySelector(".ht-stage"),
          start: "top top",
          end: "+=260%",
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
            if (bar) bar.style.transform = `scaleY(${self.progress})`;
          },
        },
      });
    } else {
      items.forEach((it, i) =>
        gsap.from(it, {
          opacity: 0,
          x: -40,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: it, start: "top 88%", onEnter: () => setActive(i) },
        }),
      );
    }
    gsap.from(el.querySelectorAll(".ht-col"), {
      y: 60,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el.querySelector(".ht-cols"), start: "top 80%" },
    });
  });

  return (
    <section ref={ref} data-form="7" data-element="4" className="relative">
      <div className="ht-stage page-x mx-auto grid min-h-[100svh] max-w-page items-center gap-10 py-24 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <p className="label mb-6 text-mute">How to participate</p>
          <h2 className="veil font-display text-[clamp(2.8rem,6vw,6rem)] font-bold uppercase leading-[0.86]">
            Participant registration journey.
          </h2>
          <p aria-hidden="true" className="ht-num veil-warm mt-6 hidden font-display text-[clamp(8rem,18vw,16rem)] font-bold leading-none md:block">
            01
          </p>
        </div>
        <div className="relative">
          <span aria-hidden="true" className="absolute bottom-0 left-[0.55rem] top-0 hidden w-px bg-white/12 md:block" />
          <span aria-hidden="true" className="ht-bar absolute bottom-0 left-[0.55rem] top-0 hidden w-px origin-top scale-y-0 bg-mustard md:block" />
          <ol className="grid gap-2">
            {STEPS.map((s, i) => (
              <li key={s.title} className="ht-step group relative rounded-2xl py-4 pl-10 pr-4 transition-colors duration-500">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-6 h-[1.15rem] w-[1.15rem] rounded-full border border-white/30 bg-black transition-colors duration-500 group-[.is-active]:border-mustard group-[.is-active]:bg-mustard group-[.is-done]:border-mustard"
                />
                <p className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mute">Step {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-display text-[clamp(1.8rem,3vw,2.8rem)] font-bold uppercase leading-none text-paper/45 transition-colors duration-500 group-[.is-active]:text-paper group-[.is-done]:text-paper/70">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-md text-[0.98rem] text-mute md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-500 md:group-[.is-active]:max-h-24 md:group-[.is-active]:opacity-100">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="page-x mx-auto max-w-page pb-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h3 className="veil font-display text-[clamp(2.2rem,4.5vw,4.2rem)] font-bold uppercase leading-[0.9]">
            What the application asks for.
          </h3>
          <p className="max-w-sm text-sm text-mute">
            Secure uploads — {UPLOAD_RULES.label}. Progress saves on your device. Works on your phone.
          </p>
        </div>
        <div className="ht-cols grid gap-4 md:grid-cols-3">
          {FIELDS.map((f, i) => (
            <div
              key={f.title}
              className={cx(
                "ht-col rounded-[1.4rem] p-7",
                i === 0 ? "bg-mustard text-black" : i === 1 ? "bg-navy text-paper" : "bg-teal text-paper",
              )}
            >
              <p className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.22em] opacity-70">Step {String(i + 1).padStart(2, "0")}</p>
              <h4 className="mt-2 font-display text-4xl font-bold uppercase leading-none">{f.title}</h4>
              <ul className="mt-6 grid gap-2 text-[0.98rem]">
                {f.items.map((it) => (
                  <li key={it} className="flex gap-3 border-t border-current/15 pt-2" style={{ borderColor: "color-mix(in srgb, currentColor 15%, transparent)" }}>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 rounded-[1.4rem] border border-white/12 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div>
            <p className="label text-mute">{edition.registrationOpen ? "Registration is open" : "Registration opens"}</p>
            <p className="mt-1 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold uppercase leading-none">
              {edition.registrationOpen ? edition.registrationClosesLabel ?? "Apply now" : edition.registrationOpensLabel}
            </p>
          </div>
          <ApplyButton className="pill pill-solid">{edition.registrationOpen ? "Register to participate" : "Preview the application"}</ApplyButton>
        </div>
      </div>

      <span id="rules" aria-hidden="true" className="block h-0" />
      <div className="page-x mx-auto grid max-w-page gap-10 py-24 md:grid-cols-[0.8fr_1.4fr] md:gap-20">
        <div>
          <p className="label mb-6 text-mute">Rules &amp; guidelines</p>
          <h3 className="veil font-display text-[clamp(2.4rem,5vw,4.6rem)] font-bold uppercase leading-[0.88]">The fine print, plainly.</h3>
          <p className="mt-6 max-w-sm text-sm text-mute">
            Final rules, terms and policies are published before registration opens. Nothing here should be read as final until then.
          </p>
        </div>
        <div className="border-t border-white/15">
          {RULES.map((r) => (
            <details key={r.q} className="rule group border-b border-white/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[clamp(1.4rem,2.4vw,2.1rem)] font-bold uppercase leading-tight transition-colors hover:text-mustard [&::-webkit-details-marker]:hidden">
                {r.q}
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-[1.02rem] leading-relaxed text-mute">{r.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
