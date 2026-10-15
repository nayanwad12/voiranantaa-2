import type { Metadata } from "next";
import { edition } from "@/content/edition";
import { VisitorForm } from "@/components/forms/VisitorForm";
import { StatusTag } from "@/components/ui/StatusTag";

export const metadata: Metadata = {
  title: "Register your interest",
  description: "Be first to hear when dates, venue and passes for Edition 01 are confirmed.",
};

export default function VisitorRegisterPage() {
  return (
    <main id="main" data-scene="0.25" data-scene-dim="0.75">
      <div className="page-x mx-auto grid max-w-page gap-14 pb-32 pt-[calc(var(--header-h)+4rem)] lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <p className="label mb-5">Attend / Visitor registration</p>
          <h1 className="display-lg">Come see what art can become.</h1>
          <p className="body-copy mt-8">
            Register your interest and we&rsquo;ll let you know as soon as the venue and pass details are confirmed.
          </p>
          <dl className="mt-8 grid gap-3 border-t border-line pt-6 text-[0.95rem]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <dt className="text-mute">Proposed dates</dt>
              <dd className="flex items-center gap-3 text-paper">
                {edition.show.datesLabel}
                {edition.show.tentative && <StatusTag>Tentative</StatusTag>}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Venue</dt>
              <dd className="text-paper">{edition.show.venue ?? "To be announced"}</dd>
            </div>
          </dl>
        </aside>
        <VisitorForm />
      </div>
    </main>
  );
}
