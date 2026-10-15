import Link from "next/link";
import { categories, requirements } from "@/content/categories";
import { edition, formatINR } from "@/content/edition";
import { partnerTiers } from "@/content/partners";
import { rasas } from "@/content/rasas";
import { site } from "@/content/site";
import { timeline, toConfirm } from "@/content/timeline";
import { accentVar } from "@/lib/accent";
import { ScrubText } from "@/components/motion/ScrubText";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GradientBanner } from "@/components/ui/GradientBanner";
import { StatusTag } from "@/components/ui/StatusTag";

const d = (s: number) => ({ "--reveal-delay": `${s}s` }) as React.CSSProperties;

/* ------------------------------------------------------------------ SKY */

/** 02 — THE IDEA. A moment of stillness: no motion beyond the words. */
export function Idea() {
  return (
    <section id="the-idea" className="page-x mx-auto flex min-h-[100svh] max-w-page scroll-mt-0 flex-col justify-center py-32">
      <p data-reveal className="label mb-10">
        The idea
      </p>
      <h2 className="display-lg max-w-5xl">
        <span data-reveal className="block text-mute">
          This is not a fashion show.
        </span>
        <span data-reveal style={d(0.25)} className="block">
          This is wearable art.
        </span>
      </h2>
      <p data-reveal style={d(0.4)} className="lede mt-12 max-w-2xl">
        Emotion, translated into form, material, construction and performance — and brought to life on
        stage.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ AIR */

/** 03 — THE THEME. */
export function Theme() {
  return (
    <section className="page-x mx-auto max-w-page py-28 sm:py-36">
      <p data-reveal className="label mb-6">
        The theme
      </p>
      <h2 data-reveal className="display-lg max-w-5xl">
        Infinite Raga
        <span className="block text-blue-soft">A melody with no end.</span>
      </h2>
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <ScrubText
          className="display-sm font-display font-semibold uppercase leading-[1.1]"
          text="A raga unfolds. It changes with every phrase, every pause, every interpretation."
        />
        <p data-reveal className="body-copy text-[1.05rem] lg:pt-2">
          INFINITE RAGA takes this idea beyond sound and into the physical world. It invites designers and
          artists to translate emotion into wearable art through form, material, construction and
          performance.
        </p>
      </div>

      <div className="mt-20">
        <GradientBanner>
          <p className="font-display text-[clamp(1.6rem,3.6vw,3rem)] font-bold uppercase leading-[1.02]">
            One theme. <span className="text-blue-soft">Nine emotional worlds.</span> Infinite interpretations.
          </p>
        </GradientBanner>
      </div>

      <ul data-reveal className="mt-12 flex flex-wrap gap-x-6 gap-y-3" aria-label="The nine rasas">
        {rasas.map((r, i) => (
          <li key={r.id} className="flex items-baseline gap-2">
            <span className="label text-mute">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-xl font-semibold uppercase tracking-[0.04em]">{r.name}</span>
          </li>
        ))}
      </ul>
      <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <p className="body-copy max-w-xl">Interpret one rasa — or a considered relationship between several.</p>
        <ButtonLink href="/infinite-raga" variant="text">
          Explore the nine rasas <Arrow />
        </ButtonLink>
      </div>
    </section>
  );
}

/** 04 — CATEGORIES. */
export function Categories() {
  return (
    <section className="page-x mx-auto max-w-page py-28 sm:py-36">
      <p data-reveal className="label mb-6">
        Categories
      </p>
      <h2 data-reveal className="display-lg max-w-4xl">
        Two categories. Two approaches.
      </h2>
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {categories.map((c, i) => (
          <Card key={c.id} accent={c.accent} delay={i * 0.12} className="flex flex-col p-8 sm:p-10">
            <p className="label mb-3 text-mute">{c.kicker}</p>
            <h3 className="display-md text-paper">{c.name}</h3>
            <p className="mt-6 text-[1.05rem] text-paper/85">{c.summary}</p>
            <p className="mt-6 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-mute">
              {c.lenses.join(" · ")}
            </p>
            <p className="mt-10 font-display text-2xl font-bold uppercase" style={{ color: "var(--blue-soft)" }}>
              {c.question}
            </p>
          </Card>
        ))}
      </div>
      <div data-reveal className="mt-10">
        <ButtonLink href="/categories" variant="text">
          Category details <Arrow />
        </ButtonLink>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ SPACE */

/** 05 — THE CHALLENGE. */
export function Challenge() {
  return (
    <section className="page-x mx-auto max-w-page py-28 sm:py-36">
      <p data-reveal className="label mb-6">
        The challenge
      </p>
      <div className="grid items-end gap-8 lg:grid-cols-2">
        <div data-reveal>
          <p className="font-display text-[clamp(6rem,22vw,19rem)] font-bold leading-[0.78] text-paper">95%</p>
          <p className="mt-4 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-blue-soft">
            Unconventional material
          </p>
        </div>
        <div data-reveal style={d(0.15)} className="lg:text-right">
          <p className="font-display text-[clamp(4rem,12vw,10rem)] font-bold leading-[0.8] text-paper/40">5%</p>
          <p className="mt-4 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-mute">Textile / fabric</p>
        </div>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {requirements.map((r, i) => (
          <Card key={r.title} accent={r.accent} title={r.title} delay={i * 0.08} className="p-6">
            <p className="text-[0.95rem]">{r.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-24 max-w-5xl">
        <ScrubText
          as="p"
          className="display-md font-display font-bold uppercase leading-[1.02]"
          text="The material must become part of the idea. It should not simply decorate the garment."
        />
      </div>
    </section>
  );
}

/** 06 — LIVE EXPERIENCE. */
export function LiveExperience() {
  const parts = [
    { title: "The work", body: "The wearable artwork.", accent: "blue" as const },
    { title: "The idea", body: "What the work communicates.", accent: "pink" as const },
    { title: "The experience", body: "How it comes alive.", accent: "green" as const },
  ];
  return (
    <section className="page-x mx-auto max-w-page py-28 sm:py-36">
      <p data-reveal className="label mb-6">
        Live experience
      </p>
      <h2 data-reveal className="display-lg max-w-5xl">
        The garment is only half the story.
      </h2>
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div data-reveal>
          <p className="font-display text-[clamp(5rem,13vw,11rem)] font-bold leading-[0.8] text-blue">
            {edition.live.minutes}
            <span className="ml-3 align-top text-[0.32em] leading-none text-blue-soft">minutes</span>
          </p>
          <p className="lede mt-8 max-w-md">
            Every selected finalist presents the wearable artwork and its concept as one live experience.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {parts.map((p, i) => (
            <Card key={p.title} accent={p.accent} title={p.title} delay={i * 0.1}>
              {p.body}
            </Card>
          ))}
        </div>
      </div>
      <p data-reveal className="body-copy mt-14 max-w-3xl">
        Possible elements: {edition.live.elements.join(" · ")}.
      </p>
      <div data-reveal className="mt-8">
        <ButtonLink href="/experience" variant="text">
          The live format <Arrow />
        </ButtonLink>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ WATER */

/** 07 — THE JOURNEY. Updated timeline, clearly marked tentative. */
export function Journey() {
  return (
    <section className="page-x mx-auto max-w-page py-28 sm:py-36">
      <div data-reveal className="mb-6 flex flex-wrap items-center gap-4">
        <p className="label">The journey</p>
        <StatusTag>Tentative timeline</StatusTag>
      </div>
      <h2 data-reveal className="display-lg max-w-4xl">
        The journey to the stage.
      </h2>
      <Timeline />
      <p data-reveal className="mt-10 text-sm text-mute">
        To be confirmed: {toConfirm.join(" · ").toLowerCase()}.
      </p>
    </section>
  );
}

export function Timeline() {
  return (
    <ol className="relative mt-16 grid gap-0">
      {timeline.map((t, i) => (
        <li
          key={t.what}
          data-reveal
          style={d(i * 0.1)}
          className="relative grid gap-2 border-l border-line pb-14 pl-10 last:pb-0 sm:grid-cols-[18rem_1fr] sm:gap-10"
        >
          <span
            aria-hidden="true"
            className="absolute -left-[5px] top-2 h-[9px] w-[9px]"
            style={{ background: accentVar[t.accent], boxShadow: `0 0 18px ${accentVar[t.accent]}` }}
          />
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-blue-soft">{t.when}</p>
          <p className="font-display text-[clamp(1.8rem,3.4vw,3rem)] font-bold uppercase leading-none">{t.what}</p>
        </li>
      ))}
    </ol>
  );
}

/** 08 — OPEN CALL. Eligibility, fee and participant CTA. */
export function OpenCall() {
  return (
    <section className="page-x mx-auto max-w-page py-28 sm:py-36">
      <p data-reveal className="label mb-6">
        Open call
      </p>
      <h2 data-reveal className="display-lg max-w-4xl">
        Make an idea wearable.
      </h2>
      <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div data-reveal>
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-blue-soft">
            Open to individuals aged {edition.eligibility.minAge}+
          </p>
          <p className="lede mt-6">{edition.eligibility.audience.join(" · ")}</p>
        </div>
        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-5">
            <Card accent="blue" title="Students" delay={0.05}>
              <p className="font-sans text-3xl font-light text-paper">{formatINR(edition.fees.student)}</p>
            </Card>
            <Card accent="pink" title="Others" delay={0.12}>
              <p className="font-sans text-3xl font-light text-paper">{formatINR(edition.fees.others)}</p>
            </Card>
          </div>
          <div data-reveal style={d(0.2)}>
            <ParticipateCTA />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ParticipateCTA() {
  if (edition.registrationOpen) {
    return (
      <ButtonLink href="/participate/register" className="w-full py-5 text-[0.85rem]">
        Register to participate <Arrow />
      </ButtonLink>
    );
  }
  return (
    <div className="grid gap-4">
      <div className="glass flex flex-col gap-1 rounded-xl px-6 py-5">
        <span className="label text-mute">Registration opens</span>
        <span className="font-display text-2xl font-bold uppercase">{edition.registrationOpensLabel}</span>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <ButtonLink href="/participate" variant="text">
          Read the brief <Arrow />
        </ButtonLink>
        <ButtonLink href="/participate/register" variant="text">
          Preview the application
        </ButtonLink>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ EARTH */

/** 09 — PARTNERS. */
export function Partners() {
  return (
    <section className="page-x mx-auto max-w-page py-28 sm:py-36">
      <p data-reveal className="label mb-6">
        Partners
      </p>
      <h2 data-reveal className="display-lg max-w-4xl">
        Build the infinite with us.
      </h2>
      <p data-reveal style={d(0.1)} className="lede mt-8 max-w-3xl">
        We invite brands, institutions and collaborators to contribute to an experience that brings new ideas
        into public view.
      </p>
      <ul className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {partnerTiers.map((t, i) => (
          <li key={t.name} data-reveal style={d(i * 0.06)} className="border-b border-line py-6 sm:pr-8">
            <span aria-hidden="true" className="mb-4 block h-px w-8" style={{ background: accentVar[t.accent] }} />
            <p className="font-display text-2xl font-bold uppercase">{t.name}</p>
            <p className="body-copy mt-2 text-[0.95rem]">{t.body}</p>
          </li>
        ))}
      </ul>
      <div data-reveal className="mt-12 flex flex-wrap gap-6">
        <ButtonLink href="/partners/enquire">
          Partner with us <Arrow />
        </ButtonLink>
        <ButtonLink href="/partners" variant="ghost">
          Partnership opportunities
        </ButtonLink>
      </div>
    </section>
  );
}

/** 10 — VOIRTALES, and a last question before the footer. */
export function Voirtales() {
  return (
    <>
      <section className="page-x mx-auto max-w-page py-28 sm:py-36">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <p data-reveal className="label mb-6">
              {site.publisher}
            </p>
            <h2 data-reveal className="display-lg">
              The world behind {site.name}.
            </h2>
          </div>
          <div data-reveal style={d(0.12)} className="lg:pt-16">
            <p className="lede">
              An independent magazine exploring fashion, lifestyle and culture through people, perspectives,
              ideas and experiences shaping how we see, live and express.
            </p>
            <div className="mt-8">
              <ButtonLink href="/voirtales" variant="text">
                About {site.publisher} <Arrow />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="page-x mx-auto flex min-h-[80svh] max-w-page flex-col items-start justify-center py-28">
        <p data-reveal className="label mb-8">
          {edition.label} / {edition.title}
        </p>
        <h2 data-reveal className="display-xl max-w-6xl">
          What will you make wearable?
        </h2>
        <div data-reveal style={d(0.2)} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href="/participate">
            Participate <Arrow />
          </ButtonLink>
          <ButtonLink href="/partners" variant="text">
            Partner
          </ButtonLink>
          <ButtonLink href="/attend" variant="text">
            Attend
          </ButtonLink>
        </div>
        <p data-reveal style={d(0.3)} className="mt-16 text-sm text-mute">
          An annual initiative by {site.publisher}.{" "}
          <Link href="/contact" className="text-blue-soft underline-offset-4 hover:underline">
            Get in touch
          </Link>
          .
        </p>
      </section>
    </>
  );
}
