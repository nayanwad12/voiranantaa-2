"use client";

import { useRef } from "react";
import { gsap, useSectionMotion, words } from "./motion";

/** THE IDEA — a statement, struck through, replaced by the truth. */
export function Idea() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, (el, c) => {
    const not = el.querySelectorAll(".idea-not .w");
    const strike = el.querySelector(".idea-strike");
    const is = el.querySelectorAll(".idea-is .w");
    const notBlock = el.querySelector(".idea-not");
    const isBlock = el.querySelector(".idea-is");
    const tail = el.querySelectorAll(".idea-tail");

    gsap.set(not, { z: -900, opacity: 0, filter: "blur(16px)" });
    gsap.set(strike, { scaleX: 0 });
    gsap.set(is, { scale: 2.6, opacity: 0, filter: "blur(20px)" });
    gsap.set(tail, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top top", end: c.desktop ? "+=260%" : "+=200%", scrub: 1, pin: true },
    });
    tl.to(not, { z: 0, opacity: 1, filter: "blur(0px)", stagger: 0.08, duration: 0.5, ease: "power3.out" })
      .to(strike, { scaleX: 1, duration: 0.3, ease: "power2.inOut" }, "+=0.1")
      .to(notBlock, { opacity: 0.12, y: c.desktop ? -170 : -120, scale: 0.6, filter: "blur(4px)", duration: 0.5 }, "+=0.15")
      .to(is, { scale: 1, opacity: 1, filter: "blur(0px)", stagger: 0.06, duration: 0.6, ease: "expo.out" }, "<0.1")
      .to(isBlock, { y: c.desktop ? 30 : 10, duration: 0.3 }, ">")
      .to(tail, { opacity: 1, y: 0, stagger: 0.1, duration: 0.3 }, "<")
      .to({}, { duration: 0.3 });
  });

  return (
    <section ref={ref} data-form="1" data-element="0" className="relative min-h-[100svh] overflow-hidden">
      <div className="idea-stage page-x mx-auto grid min-h-[100svh] max-w-page place-items-center gap-10 py-24 text-center [perspective:1000px]">
        <div className="idea-not relative">
          <p className="font-display text-[clamp(3rem,10.5vw,10rem)] font-bold uppercase leading-[0.88]">
            {words("This is not")}
            <br />
            <span className="relative inline-block">
              {words("a fashion show.")}
              <span aria-hidden="true" className="idea-strike absolute left-[-2%] top-1/2 h-[3px] w-[104%] origin-left bg-red" />
            </span>
          </p>
        </div>
        <div className="idea-is">
          <p className="font-display text-[clamp(3.4rem,12.5vw,12rem)] font-bold uppercase leading-[0.86]">
            {words("This is")}
            <br />
            <span className="text-blue">{words("wearable art.")}</span>
          </p>
          <p className="idea-tail mx-auto mt-10 max-w-xl text-lg font-light leading-relaxed text-paper/80">
            Emotion, translated into form, material, construction and performance — and brought to life on stage.
          </p>
        </div>
      </div>
    </section>
  );
}
