import type { ReactNode } from "react";

/**
 * The one conference-stage colour band. Reserved for selected statements —
 * never every section.
 */
export function GradientBanner({ children }: { children: ReactNode }) {
  return (
    <div data-reveal className="relative overflow-hidden rounded-2xl p-[1px]">
      <div aria-hidden="true" className="gradient-band absolute inset-0 opacity-90" />
      <div className="relative rounded-[15px] bg-ink/85 px-6 py-10 text-center backdrop-blur-md sm:px-12 sm:py-14">
        <div aria-hidden="true" className="gradient-band absolute inset-x-0 top-0 h-px opacity-80" />
        {children}
      </div>
    </div>
  );
}
