import { site } from "@/content/site";
import { edition } from "@/content/edition";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { Rings } from "@/components/ui/Rings";

/** ENTER — a dark, cinematic opening. Name and tagline appear with restraint. */
export function Hero() {
  const letters = site.name.split("");
  return (
    <section className="page-x relative mx-auto flex min-h-[100svh] max-w-page flex-col justify-center pb-24 pt-[calc(var(--header-h)+3rem)]">
      <Rings className="pointer-events-none absolute right-[-18%] top-1/2 w-[min(78vw,46rem)] -translate-y-1/2 opacity-40 sm:right-[-6%] lg:opacity-70" />

      <p className="label enter-fade mb-8" style={{ animationDelay: "0.2s" }}>
        {edition.label} / {edition.title}
      </p>

      <h1 aria-label={site.name} className="font-display text-[clamp(3.6rem,16.8vw,15rem)] font-bold leading-[0.82] tracking-[0.005em]">
        {letters.map((ch, i) => (
          <span key={i} aria-hidden="true" className="enter-letter" style={{ animationDelay: `${0.45 + i * 0.07}s` }}>
            {ch}
          </span>
        ))}
      </h1>

      <p
        className="enter-fade mt-6 font-sans text-[clamp(1rem,2vw,1.5rem)] font-semibold uppercase tracking-[0.3em] text-blue-soft"
        style={{ animationDelay: "1.6s" }}
      >
        {site.tagline}
      </p>

      <p className="enter-fade lede mt-10 max-w-xl" style={{ animationDelay: "2.1s" }}>
        {edition.strapline}
      </p>

      <div className="enter-fade mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "2.4s" }}>
        <ButtonLink href="/participate">
          Participate <Arrow />
        </ButtonLink>
        <ButtonLink href="/infinite-raga" variant="text">
          Explore the theme
        </ButtonLink>
        <ButtonLink href="/partners" variant="text">
          Partner with us
        </ButtonLink>
      </div>

      <a
        href="#the-idea"
        className="enter-fade absolute bottom-8 left-[var(--gutter)] flex items-center gap-4 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-mute hover:text-paper"
        style={{ animationDelay: "3s" }}
      >
        <span aria-hidden="true" className="scroll-cue relative block h-10 w-px overflow-hidden bg-line" />
        Scroll to descend
      </a>
    </section>
  );
}
