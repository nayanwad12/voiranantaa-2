import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { edition, formatINR } from "@/content/edition";
import { site } from "@/content/site";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Rings } from "@/components/ui/Rings";
import { StatusTag } from "@/components/ui/StatusTag";

export const metadata: Metadata = { title: "Confirmation", robots: { index: false } };

type Params = Promise<{ type: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const safeRef = (v?: string) => (v && /^[A-Z0-9-]{4,40}$/.test(v) ? v : undefined);

export function generateStaticParams() {
  return [{ type: "participant" }, { type: "partner" }, { type: "visitor" }];
}

export default async function ConfirmationPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { type } = await params;
  const q = await searchParams;
  const reference = safeRef(one(q.ref));
  if (!["participant", "partner", "visitor"].includes(type)) notFound();

  const fee = Number(one(q.fee));
  const preview = one(q.preview) === "1";

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
  }[type as "participant" | "partner" | "visitor"];

  return (
    <main id="main" data-scene="2" data-scene-dim="0.45">
      <section className="page-x relative mx-auto flex min-h-[100svh] max-w-page flex-col justify-center pb-24 pt-[calc(var(--header-h)+3rem)]">
        <Rings className="pointer-events-none absolute right-[-10%] top-1/2 w-[min(70vw,36rem)] -translate-y-1/2 opacity-40" />
        <p className="label mb-6">
          {content.label} / {edition.label}
        </p>
        <h1 className="display-xl max-w-5xl">{content.title}</h1>

        <div className="mt-12 grid max-w-2xl gap-4">
          {reference && (
            <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-xl px-6 py-5">
              <span className="label text-mute">{type === "participant" ? "Application ID" : "Reference"}</span>
              <span className="font-mono text-lg tracking-wider text-paper">{reference}</span>
            </div>
          )}
          {type === "participant" && (
            <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-xl px-6 py-5">
              <span className="label text-mute">Payment status</span>
              <span className="flex items-center gap-3 text-paper">
                {Number.isFinite(fee) && fee > 0 ? formatINR(fee) : null}
                <StatusTag tone="pink">{preview ? "Preview — no payment taken" : "Pending"}</StatusTag>
              </span>
            </div>
          )}
          <div className="mt-4 grid gap-3">
            {content.lines.map((l) => (
              <p key={l} className="body-copy text-[1.05rem]">
                {l}
              </p>
            ))}
            {preview && (
              <p className="body-copy text-[1.05rem]">
                This was a preview submission — registration opens {edition.registrationOpensLabel.replace(/^First/, "in the first")}.
              </p>
            )}
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
