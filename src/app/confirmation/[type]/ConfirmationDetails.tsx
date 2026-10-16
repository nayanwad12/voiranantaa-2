"use client";

import { useEffect, useState } from "react";
import { edition, formatINR } from "@/content/edition";
import { readNavState, STATIC_PREVIEW } from "@/lib/preview";
import { StatusTag } from "@/components/ui/StatusTag";

type Details = { reference?: string; fee?: number; preview: boolean };

const safeRef = (v?: string | null) => (v && /^[A-Z0-9-]{4,40}$/.test(v) ? v : undefined);

/**
 * Reference, fee and payment status for the confirmation page. Read on the
 * client (from the query string, or from session state in the static preview)
 * so the page itself can be prerendered.
 */
export function ConfirmationDetails({ type }: { type: "participant" | "partner" | "visitor" }) {
  const [d, setD] = useState<Details>({ preview: !edition.registrationOpen && type === "participant" });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const state = STATIC_PREVIEW ? readNavState() : null;
    const get = (k: string) => q.get(k) ?? state?.[k] ?? null;
    const fee = Number(get("fee"));
    setD({
      reference: safeRef(get("ref")),
      fee: Number.isFinite(fee) && fee > 0 ? fee : undefined,
      preview: get("preview") === "1" || STATIC_PREVIEW,
    });
  }, []);

  return (
    <>
      {d.reference && (
        <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-xl px-6 py-5">
          <span className="label text-mute">{type === "participant" ? "Application ID" : "Reference"}</span>
          <span className="font-mono text-lg tracking-wider text-paper">{d.reference}</span>
        </div>
      )}
      {type === "participant" && (
        <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-xl px-6 py-5">
          <span className="label text-mute">Payment status</span>
          <span className="flex items-center gap-3 text-paper">
            {d.fee ? formatINR(d.fee) : null}
            <StatusTag tone="pink">{d.preview ? "Preview — no payment taken" : "Pending"}</StatusTag>
          </span>
        </div>
      )}
      {d.preview && (
        <p className="body-copy order-last text-[1.05rem]">
          {STATIC_PREVIEW
            ? "This is a website preview — nothing was sent or stored."
            : `This was a preview submission — registration opens ${edition.registrationOpensLabel.replace(/^First/, "in the first")}.`}
        </p>
      )}
    </>
  );
}
