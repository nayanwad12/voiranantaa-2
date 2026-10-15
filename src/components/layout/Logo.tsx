import Link from "next/link";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";

/** Wordmark. Always the complete name — VOIRANANTAA. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${site.name} — home`}
      className={cx("font-display text-[1.55rem] font-bold uppercase leading-none tracking-[0.04em] text-paper", className)}
    >
      {site.name}
    </Link>
  );
}
