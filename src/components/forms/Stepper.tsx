import { cx } from "@/lib/cx";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="grid grid-cols-3 gap-3" aria-label="Application progress">
      {steps.map((title, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li key={title} aria-current={state === "current" ? "step" : undefined} className="grid gap-3">
            <span
              aria-hidden="true"
              className={cx(
                "h-[2px] w-full transition-colors duration-500",
                state === "todo" ? "bg-line" : state === "current" ? "bg-mustard" : "bg-mustard/60",
              )}
            />
            <span
              className={cx(
                "font-sans text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
                state === "todo" ? "text-mute" : "text-paper",
              )}
            >
              <span className="text-sand">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden sm:inline"> / {title}</span>
              <span className="sr-only sm:hidden"> {title}</span>
              <span className="sr-only">{state === "done" ? " (completed)" : state === "current" ? " (current step)" : ""}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
