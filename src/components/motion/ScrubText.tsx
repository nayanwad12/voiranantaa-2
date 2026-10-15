"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cx } from "@/lib/cx";

type Props = {
  text: string;
  as?: "p" | "h2" | "h3";
  className?: string;
};

/** A statement whose words light up one by one as it scrolls through view. */
export function ScrubText({ text, as: Tag = "p", className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".scrub-word"));
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "bottom 45%",
      onUpdate: (self) => {
        const lit = Math.round(self.progress * spans.length);
        spans.forEach((s, i) => s.classList.toggle("is-lit", i < lit));
      },
    });
    return () => st.kill();
  }, [text]);

  return (
    <Tag ref={ref as never} className={cx(className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="scrub-word">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
