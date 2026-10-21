"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { gsap, useSectionMotion } from "./motion";

/** VOIRTALES and contact — the world behind the edition, and a way to reach it. */
export function Connect() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el) => {
    gsap.from(el.querySelectorAll(".cn-in"), {
      opacity: 0,
      y: 50,
      stagger: 0.12,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 75%" },
    });
  });

  return (
    <section ref={ref} data-form="8" data-element="4" className="relative">
      <span id="voirtales" aria-hidden="true" className="block h-0" />
      <div className="page-x mx-auto grid max-w-page gap-8 py-28 md:grid-cols-[1fr_1.2fr] md:gap-20 md:py-36">
        <div className="cn-in">
          <p className="label mb-6 text-mute">About {site.publisher}</p>
          <h2 className="font-display text-[clamp(2.6rem,5.5vw,5.5rem)] font-bold uppercase leading-[0.88]">
            The world behind {site.name}.
          </h2>
        </div>
        <div className="cn-in md:pt-12">
          <p className="text-xl font-light leading-relaxed text-paper/85 md:text-2xl">
            An independent magazine exploring fashion, lifestyle and culture through people, perspectives, ideas and
            experiences shaping how we see, live and express.
          </p>
          <p className="mt-6 text-mute">
            {site.name} is its annual initiative — Edition 01 / Infinite Raga is the first chapter.
          </p>
        </div>
      </div>

      <span id="contact" aria-hidden="true" className="block h-0" />
      <div className="page-x mx-auto grid max-w-page gap-12 pb-28 md:grid-cols-[1fr_1.3fr] md:gap-20">
        <div className="cn-in">
          <p className="label mb-6 text-mute">Contact</p>
          <h2 className="font-display text-[clamp(2.6rem,5.5vw,5.5rem)] font-bold uppercase leading-[0.88]">Say hello to the infinite.</h2>
          <dl className="mt-10 grid gap-6 border-t border-white/15 pt-8">
            <div>
              <dt className="label mb-1 text-mute">General</dt>
              <dd className="select-all text-lg">{site.email}</dd>
            </div>
            <div>
              <dt className="label mb-1 text-mute">Media enquiries</dt>
              <dd className="text-mute">Choose &ldquo;Media enquiry&rdquo; in the form and we&rsquo;ll route it to the right person.</dd>
            </div>
            <div>
              <dt className="label mb-1 text-mute">Follow</dt>
              <dd>
                <a href={site.socials[0].href} target="_blank" rel="noreferrer" className="text-lg hover:text-blue">
                  Instagram ↗
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="cn-in rounded-[1.6rem] border border-white/12 bg-night/80 p-6 backdrop-blur-xl md:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
