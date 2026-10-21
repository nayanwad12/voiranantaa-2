import { site } from "@/content/site";
import { cx } from "@/lib/cx";

/** Wordmark. Always the complete name — VOIRANANTAA. Returns to the top. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <a
      href="#top"
      onClick={onClick}
      aria-label={`${site.name} — back to top`}
      className={cx("font-display text-[1.55rem] font-bold uppercase leading-none tracking-[0.04em] text-paper", className)}
    >
      {site.name}
    </a>
  );
}
