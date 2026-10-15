import type { Metadata } from "next";
import { rasas } from "@/content/rasas";
import { categories } from "@/content/categories";
import { PageHero, Section } from "@/components/ui/Section";
import { GradientBanner } from "@/components/ui/GradientBanner";
import { RasaGlyph } from "@/components/ui/RasaGlyph";
import { ScrubText } from "@/components/motion/ScrubText";
import { Arrow, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Infinite Raga — A melody with no end",
  description: "Edition 01 theme: one theme, nine emotional worlds, infinite interpretations.",
};

export default function InfiniteRagaPage() {
  return (
    <main id="main" data-scene="1" data-scene-dim="0.35">
      <PageHero
        label="Edition 01 / The theme"
        title={
          <>
            Infinite Raga
            <span className="block text-blue-soft">A melody with no end.</span>
          </>
        }
        lede="A raga unfolds. It changes with every phrase, every pause, every interpretation."
      />

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <ScrubText
            className="display-sm font-display font-semibold uppercase leading-[1.12]"
            text="INFINITE RAGA takes this idea beyond sound and into the physical world."
          />
          <p data-reveal className="lede text-paper/85">
            It invites designers and artists to translate emotion into wearable art through form, material,
            construction and performance.
          </p>
        </div>
      </Section>

      <div className="page-x mx-auto max-w-page">
        <GradientBanner>
          <p className="font-display text-[clamp(1.6rem,3.6vw,3rem)] font-bold uppercase leading-[1.02]">
            One theme. <span className="text-blue-soft">Nine emotional worlds.</span> Infinite interpretations.
          </p>
        </GradientBanner>
      </div>

      <Section
        id="rasas"
        label="The nine rasas"
        title="Nine emotional worlds."
        lede="Interpret one rasa — or a considered relationship between multiple rasas. The studies below are abstract starting points, not prescriptions."
      >
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rasas.map((r, i) => (
            <li
              key={r.id}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 0.08}s` } as React.CSSProperties}
              className="glass group relative overflow-hidden rounded-2xl p-7"
            >
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px]" style={{ background: `var(--${r.accent})` }} />
              <div className="flex items-start justify-between">
                <h3 className="text-3xl">{r.name}</h3>
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <RasaGlyph
                id={r.id}
                accent={r.accent}
                className="mx-auto my-6 aspect-square w-full max-w-[13rem] transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06] group-hover:rotate-[4deg]"
              />
              <p className="body-copy">{r.feeling}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="Two ways in" title="Choose your approach.">
        <div className="grid gap-6 lg:grid-cols-2">
          {categories.map((c) => (
            <div key={c.id} data-reveal className="border-t border-line pt-8">
              <p className="label text-mute">{c.kicker}</p>
              <h3 className="display-md mt-3">{c.name}</h3>
              <p className="body-copy mt-5 max-w-lg">{c.summary}</p>
              <p className="mt-6 font-display text-xl font-bold uppercase text-blue-soft">{c.question}</p>
            </div>
          ))}
        </div>
        <div data-reveal className="mt-14 flex flex-wrap gap-6">
          <ButtonLink href="/participate">
            How to participate <Arrow />
          </ButtonLink>
          <ButtonLink href="/categories" variant="ghost">
            Category details
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
