import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "ghost" | "text";

const styles: Record<Variant, string> = {
  primary:
    "bg-mustard text-ink hover:bg-paper focus-visible:bg-paper px-6 py-3.5 shadow-[0_0_40px_-10px_var(--blue)]",
  ghost: "border border-line text-paper hover:border-mustard hover:text-mustard px-6 py-3.5",
  text: "text-sand hover:text-paper px-0 py-2 underline-offset-8 hover:underline",
};

const base =
  "inline-flex items-center justify-center gap-2 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: { href: string; variant?: Variant; className?: string; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className"
>) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      className={cx(base, styles[variant], className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...rest
}: { variant?: Variant } & ComponentProps<"button">) {
  return <button className={cx(base, styles[variant], className)} {...rest} />;
}

export function Arrow() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
      <path d="M1 5h12M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
