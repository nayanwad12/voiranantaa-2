import type { Metadata } from "next";
import Link from "next/link";
import { categories, requirements } from "@/content/categories";
import { PageHero, Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Arrow, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Categories — RAGA / FORM and RAGA / VOICE",
  description: "Two categories, two approaches: the experimental and the reflective.",
};

export default function CategoriesPage() {
  return (
    <main id="main" data-scene="1.35" data-scene-dim="0.4">
      <PageHero
        label="Categories"
        title="Two categories. Two approaches."
        lede="Every entry is a response to Infinite Raga. Choose the lens that fits your work."
      />

      {categories.map((c) => (
        <Section key={c.id} id={c.id} className="pt-0">
          <Card accent={c.accent} className="p-8 sm:p-14">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
              <div>
                <p className="label text-mute">{c.kicker}</p>
                <h2 className="display-lg mt-4 text-paper">{c.name}</h2>
                <p className="mt-10 font-display text-3xl font-bold uppercase text-blue-soft">{c.question}</p>
              </div>
              <div>
                <p className="lede">{c.summary}</p>
                <p className="label mt-10 text-mute">Judged through</p>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {c.lenses.map((l) => (
                    <li key={l} className="font-display text-2xl font-semibold uppercase text-paper">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </Section>
      ))}

      <Section label="Non-negotiable requirements" title="95 / 5 + human-made.">
        <div className="grid gap-5 sm:grid-cols-2">
          {requirements.map((r, i) => (
            <Card key={r.title} accent={r.accent} title={r.title} delay={(i % 2) * 0.1}>
              {r.body}
            </Card>
          ))}
        </div>
        <p data-reveal className="lede mt-14 max-w-3xl">
          The material must become part of the idea. It should not simply decorate the garment.
        </p>
        <div data-reveal className="mt-12 flex flex-wrap items-center gap-6">
          <ButtonLink href="/participate">
            How to participate <Arrow />
          </ButtonLink>
          <Link href="/rules" className="text-blue-soft underline-offset-8 hover:underline">
            Read the rules & guidelines
          </Link>
        </div>
      </Section>
    </main>
  );
}
