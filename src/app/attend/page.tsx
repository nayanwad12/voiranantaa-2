import type { Metadata } from "next";
import { edition } from "@/content/edition";
import { PageHero, Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { StatusTag } from "@/components/ui/StatusTag";
import { Arrow, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Attend — Come see what art can become",
  description: "Twenty wearable artworks. A live experience shaped by material, movement and ideas.",
};

export default function AttendPage() {
  return (
    <main id="main" data-scene="0.25" data-scene-dim="0.3">
      <PageHero
        label="Attend the show"
        title="Come see what art can become."
        lede="Twenty wearable artworks. Twenty distinct interpretations. A live experience shaped by material, movement and ideas."
      >
        {/* No Buy Ticket / Get Pass until admission model, price, capacity and venue are confirmed. */}
        <div className="flex flex-wrap items-center gap-6">
          <ButtonLink href="/attend/register">
            Register your interest <Arrow />
          </ButtonLink>
          <p className="text-sm text-mute">Registering interest does not guarantee entry.</p>
        </div>
      </PageHero>

      <Section className="pt-0">
        <div className="grid gap-5 lg:grid-cols-3">
          <Card accent="blue" title="Proposed dates">
            <p className="text-lg text-paper">{edition.show.datesLabel}</p>
            {edition.show.tentative && <StatusTag className="mt-4">Tentative</StatusTag>}
          </Card>
          <Card accent="pink" title="Venue" delay={0.1}>
            <p className="text-lg text-paper">{edition.show.venue ?? "To be announced"}</p>
          </Card>
          <Card accent="green" title="Passes" delay={0.2}>
            <p className="text-lg text-paper">{edition.show.passes ?? "Details to be announced"}</p>
          </Card>
        </div>
      </Section>

      <Section label="What to expect" title="Five minutes. Twenty worlds.">
        <p data-reveal className="lede max-w-3xl">
          Each finalist presents their wearable artwork and its concept as one live experience — through
          movement, music, dance, theatre, light, sound or spoken word.
        </p>
        <div data-reveal className="mt-12 flex flex-wrap gap-6">
          <ButtonLink href="/attend/register">
            Register your interest <Arrow />
          </ButtonLink>
          <ButtonLink href="/experience" variant="ghost">
            The live format
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
