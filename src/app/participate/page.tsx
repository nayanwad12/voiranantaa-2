import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/content/categories";
import { edition, formatINR } from "@/content/edition";
import { PageHero, Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { StatusTag } from "@/components/ui/StatusTag";
import { ParticipateCTA } from "@/components/ui/ParticipateCTA";
import { Timeline } from "@/components/ui/Timeline";

export const metadata: Metadata = {
  title: "Participate — Make an idea wearable",
  description: "Eligibility, fees, categories and the participant registration journey for Edition 01 / Infinite Raga.",
};

const steps = [
  { title: "Read the brief", body: "Theme, categories, rules, fees and selection process.", href: "/rules" },
  { title: "Choose category", body: "RAGA / FORM or RAGA / VOICE.", href: "/categories" },
  { title: "Application", body: "Personal details, concept and material plan." },
  { title: "Declarations", body: "Age, authorship, material, safety and terms." },
  { title: "Payment", body: "Fee, payment status and receipt." },
  { title: "Confirmation", body: "Application ID and next-step email." },
];

export default function ParticipatePage() {
  return (
    <main id="main" data-scene="3" data-scene-dim="0.35">
      <PageHero label="Participate / Open call" title="Make an idea wearable." lede={edition.strapline}>
        <div className="max-w-md">
          <ParticipateCTA />
        </div>
      </PageHero>

      <Section id="eligibility" label="Eligibility & fees" title={`Open to individuals aged ${edition.eligibility.minAge}+`}>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <p data-reveal className="lede">
            {edition.eligibility.audience.join(" · ")}
          </p>
          <div className="grid grid-cols-2 gap-5">
            <Card accent="blue" title="Students">
              <p className="font-sans text-3xl font-light text-paper">{formatINR(edition.fees.student)}</p>
            </Card>
            <Card accent="pink" title="Others" delay={0.1}>
              <p className="font-sans text-3xl font-light text-paper">{formatINR(edition.fees.others)}</p>
            </Card>
            <p data-reveal className="col-span-2 text-sm text-mute">
              One fee per application. Registration does not guarantee selection.{" "}
              <Link href="/refund" className="text-blue-soft underline underline-offset-4">
                Refund policy
              </Link>{" "}
              to be published before registration opens.
            </p>
          </div>
        </div>
      </Section>

      <Section label="Categories" title="Two categories. Two approaches.">
        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((c, i) => (
            <Card key={c.id} accent={c.accent} delay={i * 0.1} className="p-8">
              <p className="label text-mute">{c.kicker}</p>
              <h3 className="display-md mt-2 text-paper">{c.name}</h3>
              <p className="mt-5 text-paper/85">{c.summary}</p>
              <p className="mt-8 font-display text-xl font-bold uppercase text-blue-soft">{c.question}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section label="How it works" title="Participant registration journey.">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Card accent={i % 2 ? "pink" : "blue"} index={String(i + 1).padStart(2, "0")} title={s.title} delay={(i % 3) * 0.08} className="h-full">
                {s.body}
                {s.href && (
                  <Link href={s.href} className="mt-3 block text-sm text-blue-soft underline-offset-4 hover:underline">
                    Read more →
                  </Link>
                )}
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div data-reveal className="mb-6 flex flex-wrap items-center gap-4">
          <p className="label">Timeline</p>
          <StatusTag>Tentative</StatusTag>
        </div>
        <h2 data-reveal className="display-lg">The journey to the stage.</h2>
        <Timeline />
        <div data-reveal className="mt-20 max-w-md">
          <ParticipateCTA />
        </div>
      </Section>
    </main>
  );
}
