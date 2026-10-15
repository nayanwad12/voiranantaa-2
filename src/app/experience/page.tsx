import type { Metadata } from "next";
import { edition } from "@/content/edition";
import { PageHero, Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { StatusTag } from "@/components/ui/StatusTag";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { ScrubText } from "@/components/motion/ScrubText";

export const metadata: Metadata = {
  title: "The Experience — The garment is only half the story",
  description: "Five minutes on stage: the work, the idea and the experience as one live presentation.",
};

export default function ExperiencePage() {
  return (
    <main id="main" data-scene="2" data-scene-dim="0.3">
      <PageHero
        label="The experience / Live format"
        title="The garment is only half the story."
        lede="Every selected finalist presents the wearable artwork and its concept as one live experience."
      />

      <Section className="pt-0">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <p data-reveal className="font-display text-[clamp(7rem,20vw,17rem)] font-bold leading-[0.78] text-blue">
            {edition.live.minutes}
            <span className="ml-4 align-top text-[0.26em] leading-none text-blue-soft">minutes</span>
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            <Card accent="blue" title="The work">
              The wearable artwork.
            </Card>
            <Card accent="pink" title="The idea" delay={0.1}>
              What the work communicates.
            </Card>
            <Card accent="green" title="The experience" delay={0.2}>
              How it comes alive.
            </Card>
          </div>
        </div>
      </Section>

      <Section label="On stage" title="Possible elements.">
        <ul className="flex flex-wrap gap-3">
          {edition.live.elements.map((el, i) => (
            <li
              key={el}
              data-reveal
              style={{ "--reveal-delay": `${i * 0.05}s` } as React.CSSProperties}
              className="glass rounded-full px-6 py-3 font-display text-2xl font-semibold uppercase"
            >
              {el}
            </li>
          ))}
        </ul>
        <p data-reveal className="body-copy mt-10 max-w-2xl">
          Finalists decide how their work comes alive. Final stage and safety specifications will be
          published before registration opens.
        </p>
      </Section>

      <Section label="Selection" title="20 finalists. Two category winners.">
        <div className="grid gap-5 lg:grid-cols-3">
          <Card accent="blue" title={`${edition.selection.finalistsPerCategory} finalists`}>
            RAGA / FORM
          </Card>
          <Card accent="pink" title={`${edition.selection.finalistsPerCategory} finalists`} delay={0.1}>
            RAGA / VOICE
          </Card>
          <Card accent="green" title={`${edition.selection.winners} winners`} delay={0.2}>
            One per category
          </Card>
        </div>
        <ol className="mt-16 grid gap-0 border-t border-line">
          {edition.selection.journey.map((step, i) => (
            <li key={step} data-reveal className="flex items-baseline gap-6 border-b border-line py-5">
              <span className="label w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-lg text-paper">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="pb-36">
        <div data-reveal className="mb-6 flex flex-wrap items-center gap-4">
          <p className="label">The live experience</p>
          <StatusTag>Tentative</StatusTag>
        </div>
        <ScrubText
          as="h2"
          className="display-lg font-display font-bold uppercase"
          text={`Proposed for ${edition.show.datesLabel.replace(/^Around/, "around")}.`}
        />
        <p data-reveal className="body-copy mt-6">Venue and passes to be announced.</p>
        <div data-reveal className="mt-10 flex flex-wrap gap-6">
          <ButtonLink href="/attend">
            Attend the show <Arrow />
          </ButtonLink>
          <ButtonLink href="/participate" variant="ghost">
            Participate
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
