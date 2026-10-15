import type { ReactNode } from "react";
import { site } from "@/content/site";
import { StatusTag } from "./StatusTag";

/**
 * Legal / utility page shell. Content is intentionally an outline until the
 * approved text is supplied — nothing here should be read as final terms.
 */
export function DraftPage({ label, title, intro, outline, children }: { label: string; title: string; intro: string; outline: string[]; children?: ReactNode }) {
  return (
    <main id="main" data-scene="0" data-scene-dim="0.8">
      <article className="page-x mx-auto max-w-4xl pb-32 pt-[calc(var(--header-h)+5rem)]">
        <p className="label mb-5">{label}</p>
        <h1 className="display-lg">{title}</h1>
        <StatusTag className="mt-6">Draft — to be approved before launch</StatusTag>
        <p className="lede mt-10">{intro}</p>
        <h2 className="mt-14 text-2xl">What this page will cover</h2>
        <ul className="mt-6 grid gap-3">
          {outline.map((o) => (
            <li key={o} className="flex items-start gap-3 text-paper/90">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
              {o}
            </li>
          ))}
        </ul>
        {children}
        <p className="body-copy mt-14 border-t border-line pt-8">
          Questions in the meantime? Write to{" "}
          <a href={`mailto:${site.email}`} className="text-blue-soft underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      </article>
    </main>
  );
}
