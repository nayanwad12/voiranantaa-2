import type { Metadata } from "next";
import { site } from "@/content/site";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${site.name} team.`,
};

export default function ContactPage() {
  return (
    <main id="main" data-scene="0.4" data-scene-dim="0.7">
      <div className="page-x mx-auto grid max-w-page gap-14 pb-32 pt-[calc(var(--header-h)+4rem)] lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <aside>
          <p className="label mb-5">Contact</p>
          <h1 className="display-lg">Say hello to the infinite.</h1>
          <div className="mt-10 grid gap-8 border-t border-line pt-8">
            <div>
              <p className="label mb-2 text-mute">General</p>
              <a href={`mailto:${site.email}`} className="text-lg text-paper hover:text-blue-soft">
                {site.email}
              </a>
            </div>
            <div id="media" className="scroll-mt-32">
              <p className="label mb-2 text-mute">Media enquiries</p>
              <p className="body-copy">Choose &ldquo;Media enquiry&rdquo; in the form and we&rsquo;ll route it to the right person.</p>
            </div>
            <div>
              <p className="label mb-2 text-mute">Follow</p>
              <ul className="flex gap-6">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="text-paper hover:text-blue-soft" {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <ContactForm />
      </div>
    </main>
  );
}
