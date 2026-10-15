import type { Metadata } from "next";
import { criteria, requirements } from "@/content/categories";
import { edition, formatINR } from "@/content/edition";
import { PageHero, Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { StatusTag } from "@/components/ui/StatusTag";
import { Arrow, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Rules & Guidelines",
  description: "Eligibility, material requirements, selection process and judging criteria for Edition 01.",
};

const toPublish = [
  "How the 95 / 5 ratio is measured and verified",
  "Whether applicants submit a concept proposal first or a completed artwork",
  "AI and machine-use policy",
  "Fee and refund policy",
  "IP, image and publicity permissions",
  "Final safety specifications",
  "Registration closing date",
];

export default function RulesPage() {
  return (
    <main id="main" data-scene="3.7" data-scene-dim="0.55">
      <PageHero
        label="Rules & guidelines"
        title="The rules of the infinite."
        lede="What every entry must meet, how work is selected and how it is judged."
      >
        <StatusTag>Draft — final rules publish before registration opens</StatusTag>
      </PageHero>

      <Section id="eligibility" label="01 / Eligibility" title="Who can enter.">
        <div className="grid gap-10 lg:grid-cols-2">
          <div data-reveal>
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-blue-soft">
              Open to individuals aged {edition.eligibility.minAge}+
            </p>
            <p className="lede mt-5">{edition.eligibility.audience.join(" · ")}</p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Card accent="blue" title="Students">
              <p className="text-2xl font-light text-paper">{formatINR(edition.fees.student)}</p>
              <p className="mt-2 text-sm">Valid student ID may be requested.</p>
            </Card>
            <Card accent="pink" title="Others" delay={0.1}>
              <p className="text-2xl font-light text-paper">{formatINR(edition.fees.others)}</p>
              <p className="mt-2 text-sm">All other participants.</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section id="materials" label="02 / Non-negotiable requirements" title="95 / 5 + human-made.">
        <div className="grid gap-5 sm:grid-cols-2">
          {requirements.map((r, i) => (
            <Card key={r.title} accent={r.accent} title={r.title} delay={(i % 2) * 0.1}>
              {r.body}
            </Card>
          ))}
        </div>
        <p data-reveal className="lede mt-12 max-w-3xl">
          The material must become part of the idea. It should not simply decorate the garment.
        </p>
      </Section>

      <Section id="selection" label="03 / Selection process" title="20 finalists. Two category winners.">
        <ol className="grid gap-0 border-t border-line">
          {edition.selection.journey.map((step, i) => (
            <li key={step} data-reveal className="flex items-baseline gap-6 border-b border-line py-5">
              <span className="label w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-lg text-paper">{step}</span>
            </li>
          ))}
        </ol>
        <p data-reveal className="body-copy mt-8">
          {edition.selection.finalistsPerCategory} finalists per category · one winner per category. Registration
          does not guarantee selection.
        </p>
      </Section>

      <Section id="judging" label="04 / Judging criteria" title="Six lenses. One complete work.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((c, i) => (
            <Card key={c.name} accent={c.accent} title={c.name} delay={(i % 3) * 0.08}>
              {c.question}
            </Card>
          ))}
        </div>
      </Section>

      <Section id="to-publish" label="05 / Still to be published" title="Details being finalised.">
        <p data-reveal className="body-copy mb-8 max-w-2xl">
          The following will be confirmed and published here before registration opens. Nothing on this page
          should be read as final until then.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {toPublish.map((t) => (
            <li key={t} data-reveal className="flex items-start gap-3 text-paper/90">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />
              {t}
            </li>
          ))}
        </ul>
        <div data-reveal className="mt-14">
          <ButtonLink href="/participate">
            How to participate <Arrow />
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
