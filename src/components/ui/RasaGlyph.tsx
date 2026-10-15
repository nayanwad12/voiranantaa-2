import { accentVar, type Accent } from "@/lib/accent";

/**
 * Nine distinct abstract interpretations — fine-line studies, never literal
 * or stereotyped illustrations. Deterministic so server and client agree.
 */

const C = 50;
const pt = (r: number, a: number) => [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
const f = (n: number) => n.toFixed(2);

function paths(id: string): string[] {
  switch (id) {
    // Beauty · Love · Attraction — two forms drawn towards each other.
    case "shringara":
      return [0, 1, 2, 3, 4].flatMap((i) => {
        const r = 14 + i * 5;
        return [`M${f(38 + i * 1.6)} ${C} m-${r} 0 a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 -${r * 2} 0`, `M${f(62 - i * 1.6)} ${C} m-${r} 0 a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 -${r * 2} 0`];
      });
    // Joy · Humour · Play — light points bouncing along a line.
    case "hasya":
      return [
        `M8 70 ${Array.from({ length: 9 }, (_, i) => `Q${f(13 + i * 9.5)} ${i % 2 ? 78 : 30} ${f(18 + i * 9.5)} 70`).join(" ")}`,
        ...Array.from({ length: 9 }, (_, i) => {
          const x = 13 + i * 9.5;
          const y = i % 2 ? 76 : 34 + (i % 3) * 4;
          return `M${f(x)} ${f(y)} m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0`;
        }),
      ];
    // Compassion · Sorrow — slow descending lines, lengthening as they fall.
    case "karuna":
      return Array.from({ length: 13 }, (_, i) => {
        const x = 14 + i * 6;
        const len = 18 + Math.abs(Math.sin(i * 0.9)) * 52;
        return `M${f(x)} 12 L${f(x)} ${f(12 + len)}`;
      });
    // Anger · Intensity — a jagged pulse radiating outward.
    case "raudra":
      return [0, 1, 2].map((k) => {
        const n = 22;
        const d = Array.from({ length: n + 1 }, (_, i) => {
          const a = (i / n) * Math.PI * 2;
          const r = (i % 2 ? 18 : 30) + k * 9;
          const [x, y] = pt(r, a);
          return `${i ? "L" : "M"}${f(x)} ${f(y)}`;
        }).join(" ");
        return d + "Z";
      });
    // Courage · Resolve — rising chevrons that hold their line.
    case "veera":
      return Array.from({ length: 8 }, (_, i) => {
        const y = 84 - i * 9;
        const w = 34 - i * 2.4;
        return `M${f(C - w)} ${f(y + 10)} L${C} ${f(y)} L${f(C + w)} ${f(y + 10)}`;
      }).concat([`M${C} 8 L${C} 92`]);
    // Fear · Apprehension — broken, trembling rings.
    case "bhayanaka":
      return Array.from({ length: 6 }, (_, k) => {
        const r = 10 + k * 7;
        const segs = 6 + k * 2;
        return Array.from({ length: segs }, (_, i) => {
          const a0 = (i / segs) * Math.PI * 2 + k * 0.4;
          const a1 = a0 + (Math.PI * 2) / segs * 0.55;
          const j = Math.sin(i * 3.1 + k) * 1.6;
          const [x0, y0] = pt(r + j, a0);
          const [x1, y1] = pt(r - j, a1);
          return `M${f(x0)} ${f(y0)} A${r} ${r} 0 0 1 ${f(x1)} ${f(y1)}`;
        }).join(" ");
      });
    // Disquiet · Aversion — a grid pulled out of true.
    case "bibhatsa":
      return Array.from({ length: 9 }, (_, i) => {
        const y = 14 + i * 9;
        return `M10 ${y} ${Array.from({ length: 10 }, (_, j) => {
          const x = 10 + (j + 1) * 8;
          const warp = Math.sin(j * 1.3 + i * 0.7) * (4 + Math.abs(4 - i) * 1.4);
          return `L${f(x)} ${f(y + warp)}`;
        }).join(" ")}`;
      });
    // Wonder · Amazement — a burst of light from a single point.
    case "adbhuta":
      return Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const r0 = 6 + (i % 3) * 3;
        const r1 = 26 + ((i * 7) % 5) * 4.5;
        const [x0, y0] = pt(r0, a);
        const [x1, y1] = pt(r1, a);
        return `M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}`;
      });
    // Peace · Stillness — a horizon and slow, widening arcs.
    case "shanta":
    default:
      return [`M8 ${C} L92 ${C}`].concat(
        Array.from({ length: 6 }, (_, i) => {
          const r = 8 + i * 7;
          return `M${C - r} ${C} A${r} ${r * 0.55} 0 0 1 ${C + r} ${C}`;
        }),
      );
  }
}

export function RasaGlyph({ id, accent, className }: { id: string; accent: Accent; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
      {paths(id).map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i % 3 === 0 ? accentVar[accent] : "var(--white)"}
          strokeOpacity={i % 3 === 0 ? 0.95 : 0.55}
          strokeWidth="0.7"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
