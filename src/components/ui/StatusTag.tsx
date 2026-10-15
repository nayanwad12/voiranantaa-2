import { cx } from "@/lib/cx";

/** Honest status markers: "Tentative", "To be announced", "Preview". */
export function StatusTag({ children, tone = "pink", className }: { children: string; tone?: "pink" | "green" | "red" | "blue"; className?: string }) {
  const color = { pink: "var(--pink)", green: "var(--green)", red: "var(--red)", blue: "var(--blue)" }[tone];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.16em]",
        className,
      )}
      style={{ borderColor: `color-mix(in srgb, ${color} 45%, transparent)`, color }}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}
