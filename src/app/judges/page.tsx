import type { Metadata } from "next";
import { criteria } from "@/content/categories";
import { edition } from "@/content/edition";
import { site } from "@/content/site";
import { PageHero, Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { StatusTag } from "@/components/ui/StatusTag";
import { Rings } from "@/components/ui/Rings";

export const metadata: Metadata = {
  title: "The Judges",
  description: `Meet the eyes behind ${site.name}.`,
};

export default function JudgesPage() {
  return (
    <main id="main" data-scene="2.3" data-scene-dim="0.35">
      <PageHero
        label="The judges"
        title={`Meet the eyes behind ${site.name}.`}
        lede="The panel brings perspectives across fashion, art, design, material, performance and culture."
      />

      <Section className="pt-0">
        {edition.judgesConfirmed ? null : (
          <div data-reveal className="glass relative flex flex-col items-center overflow-hidden rounded-3xl px-6 py-20 text-center">
            <Rings className="absolute left-1/2 top-1/2 w-[28rem] max-w-[90%] -translate-x-1/2 -translate-y-1/2 opacity-30" />
            <StatusTag className="relative">To be announced</StatusTag>
            <p className="display-md relative mt-6">The panel will be revealed soon.</p>
            <p className="body-copy relative mt-4 max-w-md">
              Profiles are published only once each judge has confirmed.
            </p>
          </div>
        )}
      </Section>

      <Section label="Judging criteria" title="Six lenses. One complete work.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((c, i) => (
            <Card key={c.name} accent={c.accent} title={c.name} delay={(i % 3) * 0.08}>
              {c.question}
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
