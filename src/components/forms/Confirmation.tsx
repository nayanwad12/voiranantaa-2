import { edition, formatINR } from "@/content/edition";
import { STATIC_PREVIEW } from "@/lib/preview";
import { StatusTag } from "@/components/ui/StatusTag";

type Kind = "participant" | "partner" | "visitor";

const COPY: Record<Kind, { title: string; lines: string[] }> = {
  participant: {
    title: "Application received.",
    lines: [
      edition.emailsConnected
        ? "A confirmation email with your application ID and next steps is on its way."
        : "Keep your application ID for your records. We'll email you with next steps.",
      "Registration does not guarantee selection. Eligible submissions go through preliminary screening and a technical and safety review.",
    ],
  },
  partner: {
    title: "Enquiry received.",
    lines: [
      edition.emailsConnected ? "We've sent a confirmation to your work email." : "Keep this reference for your records.",
      "The VOIRTALES partnerships team will follow up by email to arrange a conversation.",
    ],
  },
  visitor: {
    title: "Interest recorded.",
    lines: [
      "We'll email you when dates, venue and passes are confirmed.",
      "Registering interest does not guarantee entry. Entry is confirmed only once a pass or ticket is issued.",
    ],
  },
};

/** Every action needs a clear ending — shown in place of the form. */
export function Confirmation({
  kind,
  reference,
  fee,
  preview,
  onReset,
}: {
  kind: Kind;
  reference: string;
  fee?: number;
  preview?: boolean;
  onReset?: () => void;
}) {
  const c = COPY[kind];
  return (
    <div role="status" className="grid gap-6">
      <h3 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-bold uppercase leading-[0.88]">{c.title}</h3>
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 px-5 py-4">
          <span className="label text-mute">{kind === "participant" ? "Application ID" : "Reference"}</span>
          <span className="font-mono text-lg tracking-wider">{reference}</span>
        </div>
        {kind === "participant" && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 px-5 py-4">
            <span className="label text-mute">Payment status</span>
            <span className="flex items-center gap-3">
              {fee ? formatINR(fee) : null}
              <StatusTag>{preview ? "Preview — no payment taken" : "Pending"}</StatusTag>
            </span>
          </div>
        )}
      </div>
      <div className="grid gap-2 text-[1.02rem] text-mute">
        {c.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        {STATIC_PREVIEW && <p>This is a website preview — nothing was sent or stored.</p>}
      </div>
      {onReset && (
        <button type="button" onClick={onReset} className="pill w-fit">
          Done
        </button>
      )}
    </div>
  );
}
