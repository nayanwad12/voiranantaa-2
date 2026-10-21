"use client";

import { useRef, useState } from "react";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { partnerTiers } from "@/content/partners";
import { gsap, useSectionMotion } from "./motion";

/** PARTNERS — six ways in, as large rows that light up on approach. */
export function Partners() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

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
    <section ref={ref} data-form="8" className="relative py-28 md:py-40">
      <div className="page-x mx-auto max-w-page">
        <div className="mb-16 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <h2 className="pt-h font-display text-[clamp(3.2rem,8.5vw,8.5rem)] font-bold uppercase leading-[0.84]">
            {["Build the", "infinite", "with us."].map((l) => (
              <span key={l} className="block overflow-hidden pb-[0.04em]">
                <span className="w-c veil inline-block">{l}</span>
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
        <div className="mt-12">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="partner-enquiry"
            className="pill pill-solid"
          >
            {open ? "Close the enquiry" : "Partner with us"}
            <span aria-hidden="true" className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
          <div
            id="partner-enquiry"
            className="grid transition-[grid-template-rows,opacity] duration-700 ease-out"
            style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
          >
            <div className="overflow-hidden">
              <div className="mt-8 grid gap-10 rounded-[1.6rem] border border-white/12 bg-night/80 p-6 backdrop-blur-xl md:grid-cols-[0.7fr_1.6fr] md:p-10">
                <div>
                  <p className="label mb-2 text-mustard">Partner enquiry</p>
                  <h3 className="font-display text-4xl font-bold uppercase leading-none">Tell us what you&rsquo;d bring.</h3>
                  <p className="mt-4 text-sm text-mute">We&rsquo;ll confirm by email and follow up personally.</p>
                </div>
                {open && <PartnerForm />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
