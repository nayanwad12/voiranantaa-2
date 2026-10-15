import type { ReactNode } from "react";
import { ELEMENTS } from "@/components/scene/position";

/**
 * One of the five cosmic elements. The universe canvas reads
 * `data-chapter` to know which world to show while this is on screen.
 */
export function Chapter({ index, children }: { index: 0 | 1 | 2 | 3 | 4; children: ReactNode }) {
  const name = ELEMENTS[index];
  return (
    <div data-chapter={index} id={name.toLowerCase()} className="relative scroll-mt-0" aria-label={`Chapter ${index + 1}: ${name}`} role="region">
      {index > 0 && (
        <div className="page-x mx-auto max-w-page pt-24">
          <div data-reveal className="flex items-center gap-5">
            <span className="label text-paper">
              {String(index + 1).padStart(2, "0")} / {name}
            </span>
            <span className="hairline flex-1" />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
