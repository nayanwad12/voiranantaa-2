import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero, Section } from "@/components/ui/Section";
import { Arrow, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About VOIRTALES",
  description: `The world behind ${site.name}.`,
};

export default function VoirtalesPage() {
  return (
    <main id="main" data-scene="3.5" data-scene-dim="0.35">
      <PageHero
        label="About VOIRTALES"
        title={`The world behind ${site.name}.`}
        lede="An independent magazine exploring fashion, lifestyle and culture through people, perspectives, ideas and experiences shaping how we see, live and express."
      />
      <Section className="pt-0 pb-36">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <p data-reveal className="display-sm font-display font-semibold uppercase leading-[1.15]">
            {site.name} is an annual initiative by {site.publisher} — an invitation {site.tagline.toLowerCase()}.
          </p>
          <div data-reveal className="flex flex-col items-start gap-6">
            <p className="body-copy">
              Edition 01 / Infinite Raga is the first chapter: a wearable-art competition and live experience.
            </p>
            <div className="flex flex-wrap gap-6">
              <ButtonLink href="/">
                Explore Edition 01 <Arrow />
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Contact
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
