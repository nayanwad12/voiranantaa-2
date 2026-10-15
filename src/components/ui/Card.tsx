import type { ReactNode } from "react";
import { accentVar, type Accent } from "@/lib/accent";
import { cx } from "@/lib/cx";

/** Glass panel with a fine accent bar on the left edge — the deck's card. */
export function Card({
  accent = "blue",
  index,
  title,
  children,
  className,
  reveal = true,
  delay = 0,
}: {
  accent?: Accent;
  index?: string;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  reveal?: boolean;
  delay?: number;
}) {
  return (
    <div
      {...(reveal ? { "data-reveal": "" } : {})}
      style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}
      className={cx("glass relative overflow-hidden rounded-2xl p-6 sm:p-8", className)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: accentVar[accent] }}
      />
      {(index || title) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && <h3 className="text-2xl sm:text-[1.7rem]">{title}</h3>}
          {index && <span className="label shrink-0 pt-1">{index}</span>}
        </div>
      )}
      {children && <div className="body-copy">{children}</div>}
    </div>
  );
}
