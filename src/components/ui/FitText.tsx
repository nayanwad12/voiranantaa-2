"use client";

import { useLayoutEffect, useRef } from "react";

/** One line of text scaled so it spans the full width of its container. */
export function FitText({ children, className }: { children: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const b = box.current;
    const t = text.current;
    if (!b || !t) return;
    const fit = () => {
      // Measure at a fixed size, then scale to the container's width.
      t.style.fontSize = "100px";
      const w = t.getBoundingClientRect().width;
      if (w > 0) t.style.fontSize = `${(100 * b.clientWidth) / w}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="w-full">
      <span ref={text} className={`inline-block whitespace-nowrap ${className ?? ""}`} style={{ fontSize: "15.5vw" }}>
        {children}
      </span>
    </div>
  );
}
