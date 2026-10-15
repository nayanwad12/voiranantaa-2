import Link from "next/link";
import { footerNav, legalNav, site } from "@/content/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink/70 backdrop-blur-xl">
      <div aria-hidden="true" className="gradient-band absolute inset-x-0 top-0 h-px opacity-60" />
      <div className="page-x mx-auto max-w-page pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div id="newsletter" className="scroll-mt-28">
            <p className="label mb-4">Newsletter</p>
            <p className="mb-6 max-w-sm text-paper/90">
              Dates, open-call updates and the live experience — only when there is something worth saying.
            </p>
            <NewsletterForm />
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="label mb-5">{col.title}</p>
                <ul className="grid gap-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[0.95rem] text-mute transition-colors hover:text-paper"
                        {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-24">
          <p
            aria-hidden="true"
            className="select-none font-display text-[clamp(3.4rem,15.5vw,16rem)] font-bold uppercase leading-[0.8] tracking-[0.01em] text-paper/[0.92]"
          >
            {site.name}
          </p>
          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="label">{site.tagline}</p>
            <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-paper">
              An annual initiative by {site.publisher}
            </p>
          </div>
        </div>

        <div className="hairline my-8" />
        <div className="flex flex-col gap-6 text-sm text-mute lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            © {new Date().getFullYear()} {site.publisher}. {site.name} — Edition 01 / Infinite Raga.
          </p>
        </div>
      </div>
    </footer>
  );
}
