import type { Metadata } from "next";
import { partnerTiers } from "@/content/partners";
import { PageHero, Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Arrow, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Partners — Build the infinite with us",
  description: "Partnership opportunities for brands, institutions and collaborators.",
};

export default function PartnersPage() {
  return (
    <main id="main" data-scene="4" data-scene-dim="0.4">
      <PageHero
        label="Partners"
        title="Build the infinite with us."
        lede="We invite brands, institutions and collaborators to contribute to an experience that brings new ideas into public view."
      >
        <ButtonLink href="/partners/enquire">
          Partner enquiry <Arrow />
        </ButtonLink>
      </PageHero>

      <Section label="Opportunities" title="Ways to take part.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partnerTiers.map((t, i) => (
            <Card key={t.name} accent={t.accent} title={t.name} delay={(i % 3) * 0.08} className="min-h-[13rem]">
              {t.body}
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pb-36">
        <div data-reveal className="glass flex flex-col items-start justify-between gap-8 rounded-3xl p-8 sm:p-14 lg:flex-row lg:items-center">
          <div>
            <p className="label mb-4">Start a conversation</p>
            <p className="display-md max-w-2xl">Tell us what you would like to bring to Edition 01.</p>
          </div>
          <ButtonLink href="/partners/enquire" className="shrink-0">
            Partner enquiry <Arrow />
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
