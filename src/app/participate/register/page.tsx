import type { Metadata } from "next";
import Link from "next/link";
import { edition, formatINR } from "@/content/edition";
import { ParticipantForm } from "@/components/forms/ParticipantForm";
import { StatusTag } from "@/components/ui/StatusTag";

export const metadata: Metadata = {
  title: "Participant registration",
  description: "Apply to Edition 01 / Infinite Raga.",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <main id="main" data-scene="3" data-scene-dim="0.75">
      <div className="page-x mx-auto grid max-w-page gap-14 pb-32 pt-[calc(var(--header-h)+4rem)] lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <p className="label mb-5">Participate / {edition.label}</p>
          <h1 className="display-lg">Make an idea wearable.</h1>
          {!edition.registrationOpen && <StatusTag className="mt-6">{`Preview — opens ${edition.registrationOpensLabel}`}</StatusTag>}
          <dl className="mt-10 grid gap-4 border-t border-line pt-8 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Students</dt>
              <dd className="text-paper">{formatINR(edition.fees.student)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Others</dt>
              <dd className="text-paper">{formatINR(edition.fees.others)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Eligibility</dt>
              <dd className="text-paper">{edition.eligibility.minAge}+</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mute">Closing date</dt>
              <dd className="text-paper">{edition.registrationClosesLabel ?? "To be announced"}</dd>
            </div>
          </dl>
          <p className="mt-8 text-sm text-mute">
            Before you start, read the{" "}
            <Link href="/rules" className="text-blue-soft underline underline-offset-4">
              rules & guidelines
            </Link>
            . You&rsquo;ll need a concept, a material plan and at least one proposal file.
          </p>
        </aside>
        <ParticipantForm />
      </div>
    </main>
  );
}
