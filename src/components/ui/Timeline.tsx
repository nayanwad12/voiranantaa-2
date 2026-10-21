import { timeline } from "@/content/timeline";
import { accentVar } from "@/lib/accent";

const d = (s: number) => ({ "--reveal-delay": `${s}s` }) as React.CSSProperties;

export function Timeline() {
  return (
    <ol className="relative mt-16 grid gap-0">
      {timeline.map((t, i) => (
        <li
          key={t.what}
          data-reveal
          style={d(i * 0.1)}
          className="relative grid gap-2 border-l border-line pb-14 pl-10 last:pb-0 sm:grid-cols-[18rem_1fr] sm:gap-10"
        >
          <span
            aria-hidden="true"
            className="absolute -left-[5px] top-2 h-[9px] w-[9px]"
            style={{ background: accentVar[t.accent], boxShadow: `0 0 18px ${accentVar[t.accent]}` }}
          />
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-blue-soft">{t.when}</p>
          <p className="font-display text-[clamp(1.8rem,3.4vw,3rem)] font-bold uppercase leading-none">{t.what}</p>
        </li>
      ))}
    </ol>
  );
}
