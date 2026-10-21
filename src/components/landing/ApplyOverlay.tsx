"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { edition, formatINR } from "@/content/edition";
import { lenisRef } from "@/components/motion/SmoothScroll";
import { ParticipantForm } from "@/components/forms/ParticipantForm";
import { StatusTag } from "@/components/ui/StatusTag";

const OPEN_EVENT = "va:apply";

/** Opens the participant application over the landing page. */
export function openApply() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** A button anywhere on the page that opens the application. */
export function ApplyButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={openApply} className={className}>
      {children}
    </button>
  );
}

/**
 * The participant registration journey, in a full-screen layer so the
 * visitor never leaves the landing page. Also opens from a "#apply" link.
 */
export function ApplyOverlay() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const show = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    const onHash = () => {
      if (window.location.hash === "#apply") show();
    };
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      window.removeEventListener(OPEN_EVENT, show);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenisRef.current?.start();
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  // Portalled to <body>: pinned scenes re-parent the page's sections, so nothing
  // may be inserted between them.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Participant registration"
      data-lenis-prevent
      className="apply-in fixed inset-0 z-[55] overflow-y-auto bg-black/95 backdrop-blur-2xl"
    >
      <div className="page-x mx-auto max-w-page">
        <div className="sticky top-0 z-10 flex h-[var(--header-h)] items-center justify-between bg-black/80 backdrop-blur-xl">
          <p className="font-display text-xl font-bold uppercase">Participant registration</p>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="pill py-2.5">
            Close
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>
        <div className="grid gap-12 pb-24 pt-8 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <h2 className="font-display text-[clamp(2.8rem,5.5vw,5rem)] font-bold uppercase leading-[0.86]">
              Make an idea wearable.
            </h2>
            {!edition.registrationOpen && (
              <StatusTag className="mt-6">{`Preview — opens ${edition.registrationOpensLabel}`}</StatusTag>
            )}
            <dl className="mt-10 grid gap-4 border-t border-white/12 pt-8 text-[0.95rem]">
              {[
                ["Students", formatINR(edition.fees.student)],
                ["Others", formatINR(edition.fees.others)],
                ["Eligibility", `${edition.eligibility.minAge}+`],
                ["Closing date", edition.registrationClosesLabel ?? "To be announced"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-mute">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-sm text-mute">
              You&rsquo;ll need a concept, a material plan and at least one proposal file. Your progress is saved on this
              device as you type.
            </p>
          </aside>
          <ParticipantForm />
        </div>
      </div>
    </div>,
    document.body,
  );
}
