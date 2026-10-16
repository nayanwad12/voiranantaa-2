import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { edition } from "@/content/edition";
import { site } from "@/content/site";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Rings } from "@/components/ui/Rings";
import { ConfirmationDetails } from "./ConfirmationDetails";

export const metadata: Metadata = { title: "Confirmation", robots: { index: false } };

type Params = Promise<{ type: string }>;
type Kind = "participant" | "partner" | "visitor";

export function generateStaticParams() {
  return [{ type: "participant" }, { type: "partner" }, { type: "visitor" }];
}

export const dynamicParams = false;

export default async function ConfirmationPage({ params }: { params: Params }) {
  const { type } = await params;
  if (!["participant", "partner", "visitor"].includes(type)) notFound();

  const content = {
    participant: {
      label: "Participant",
      title: "Application received.",
      lines: [
        edition.emailsConnected
          ? "A confirmation email with your application ID and next steps is on its way."
          : "Keep your application ID for your records. We'll email you with next steps.",
        "Registration does not guarantee selection. Eligible submissions go through preliminary screening and a technical and safety review.",
      ],
      next: { href: "/rules", label: "Read the rules again" },
    },
    partner: {
      label: "Partner",
      title: "Enquiry received.",
      lines: [
        edition.emailsConnected
          ? "We've sent a confirmation to your work email."
          : "Keep this reference for your records.",
        "The VOIRTALES partnerships team will follow up by email to arrange a conversation.",
      ],
      next: { href: "/infinite-raga", label: "Explore the theme" },
    },
    visitor: {
      label: "Visitor",
      title: "Interest recorded.",
      lines: [
        "We'll email you when dates, venue and passes are confirmed.",
        "Please note: registering interest does not guarantee entry. Entry is confirmed only once a pass or ticket is issued.",
      ],
      next: { href: "/experience", label: "The live format" },
    },
  }[type as Kind];

  return (
    <main id="main" data-scene="2" data-scene-dim="0.45">
      <section className="page-x relative mx-auto flex min-h-[100svh] max-w-page flex-col justify-center pb-24 pt-[calc(var(--header-h)+3rem)]">
        <Rings className="pointer-events-none absolute right-[-10%] top-1/2 w-[min(70vw,36rem)] -translate-y-1/2 opacity-40" />
        <p className="label mb-6">
          {content.label} / {edition.label}
        </p>
        <h1 className="display-xl max-w-5xl">{content.title}</h1>

        <div className="mt-12 grid max-w-2xl gap-4">
          <ConfirmationDetails type={type as Kind} />
          <div className="mt-4 grid gap-3">
            {content.lines.map((l) => (
              <p key={l} className="body-copy text-[1.05rem]">
                {l}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-6">
          <ButtonLink href="/">
            Back to {site.name} <Arrow />
          </ButtonLink>
          <ButtonLink href={content.next.href} variant="ghost">
            {content.next.label}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
