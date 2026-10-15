import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Section({
  id,
  label,
  title,
  lede,
  children,
  className,
  titleClassName,
}: {
  id?: string;
  label?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <section id={id} className={cx("page-x mx-auto max-w-page py-24 sm:py-32", className)}>
      {label && (
        <p data-reveal className="label mb-6">
          {label}
        </p>
      )}
      {title && (
        <h2 data-reveal className={cx("display-lg max-w-5xl", titleClassName)}>
          {title}
        </h2>
      )}
      {lede && (
        <div data-reveal style={{ "--reveal-delay": ".1s" } as React.CSSProperties} className="lede mt-8 max-w-3xl">
          {lede}
        </div>
      )}
      {children && <div className={cx(title || lede ? "mt-14" : "")}>{children}</div>}
    </section>
  );
}

/** Top-of-page hero for secondary pages. */
export function PageHero({
  label,
  title,
  lede,
  children,
}: {
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="page-x mx-auto flex min-h-[78svh] max-w-page flex-col justify-end pb-20 pt-[calc(var(--header-h)+4rem)]">
      <p data-reveal className="label mb-6">
        {label}
      </p>
      <h1 data-reveal style={{ "--reveal-delay": ".08s" } as React.CSSProperties} className="display-xl max-w-6xl">
        {title}
      </h1>
      {lede && (
        <div data-reveal style={{ "--reveal-delay": ".18s" } as React.CSSProperties} className="lede mt-10 max-w-3xl">
          {lede}
        </div>
      )}
      {children && (
        <div data-reveal style={{ "--reveal-delay": ".26s" } as React.CSSProperties} className="mt-10">
          {children}
        </div>
      )}
    </header>
  );
}
