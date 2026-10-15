"use client";

import { useState } from "react";
import { newsletterSchema } from "@/lib/schemas";
import { submitForm } from "@/components/forms/submit";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; message?: string }>({ status: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email, consent });
    if (!parsed.success) {
      setState({ status: "error", message: parsed.error.issues[0]?.message });
      return;
    }
    setState({ status: "sending" });
    const res = await submitForm("/api/newsletter", parsed.data);
    setState(
      res.ok
        ? { status: "done", message: "Almost there — check your inbox to confirm your subscription." }
        : { status: "error", message: res.message },
    );
  };

  if (state.status === "done") {
    return (
      <p role="status" className="text-paper">
        {state.message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4" aria-label="Newsletter">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-line bg-ink/60 px-4 py-3 font-sans text-paper placeholder:text-mute/70 focus:border-blue focus:outline-none"
        />
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="bg-blue px-6 py-3 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-paper disabled:opacity-60"
        >
          {state.status === "sending" ? "Sending…" : "Subscribe"}
        </button>
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-mute">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--blue)]"
        />
        <span>
          I&rsquo;d like occasional updates about VOIRANANTAA. I can unsubscribe at any time. See the{" "}
          <a href="/privacy" className="text-blue-soft underline underline-offset-4">
            privacy notice
          </a>
          .
        </span>
      </label>
      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm font-medium text-red">
          {state.message}
        </p>
      )}
    </form>
  );
}
