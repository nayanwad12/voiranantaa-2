import { cx } from "@/lib/cx";

/** The edition's concentric-ring motif: blue, soft blue, pink. */
export function Rings({ className, animate = true }: { className?: string; animate?: boolean }) {
  const rings = [
    { r: 98, stroke: "var(--blue)", d: "0s" },
    { r: 80, stroke: "var(--blue-soft)", d: ".25s" },
    { r: 61, stroke: "var(--pink)", d: ".5s" },
  ];
  return (
    <svg viewBox="0 0 200 200" className={cx("overflow-visible", className)} aria-hidden="true">
      {rings.map((ring) => (
        <circle
          key={ring.r}
          cx="100"
          cy="100"
          r={ring.r}
          fill="none"
          stroke={ring.stroke}
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          className={animate ? "ring-draw" : undefined}
          style={{ animationDelay: ring.d }}
        />
      ))}
    </svg>
  );
}
