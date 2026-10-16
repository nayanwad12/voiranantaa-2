"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { journeys, menuNav, site } from "@/content/site";
import { useRoute } from "@/lib/preview";
import { accentVar } from "@/lib/accent";
import { cx } from "@/lib/cx";
import { lenisRef } from "@/components/motion/SmoothScroll";
import { Logo } from "./Logo";

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRoute();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lenisRef.current?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenisRef.current?.start();
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      id="site-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!open}
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/90 backdrop-blur-2xl"
    >
      <div className="page-x mx-auto flex min-h-full max-w-page flex-col">
        <div className="flex h-[var(--header-h)] items-center justify-between">
          <Logo onClick={onClose} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-3 border border-line px-4 py-2.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] hover:border-blue"
          >
            Close
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>

        <div className="grid flex-1 gap-14 py-10 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <nav aria-label="Menu">
            <ol className="grid gap-1">
              {menuNav.map((item, i) => {
                const active = item.href === "/" ? pathname === "/" : pathname === item.href;
                return (
                  <li key={item.href + item.label} className={open ? "menu-item" : undefined} style={{ animationDelay: `${i * 0.035}s` }}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "group flex items-baseline gap-5 py-1 font-display text-[clamp(1.9rem,4.4vw,3.4rem)] font-bold uppercase leading-[1.02] transition-colors",
                        active ? "text-blue" : "text-paper hover:text-blue-soft",
                      )}
                    >
                      <span className="label w-6 shrink-0 text-mute group-hover:text-blue-soft">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex flex-col gap-10 lg:pt-3">
            <div>
              <p className="label mb-5">Three journeys</p>
              <ul className="grid gap-3">
                {journeys.map((j) => (
                  <li key={j.href}>
                    <Link
                      href={j.href}
                      onClick={onClose}
                      className="glass relative flex items-center justify-between overflow-hidden rounded-xl px-5 py-4 font-sans text-sm font-semibold uppercase tracking-[0.16em] hover:border-blue"
                    >
                      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px]" style={{ background: accentVar[j.accent] }} />
                      {j.label}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-4">Connect</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-mute">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} onClick={onClose} className="hover:text-paper" {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                      {s.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${site.email}`} className="hover:text-paper">
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
            <p className="label mt-auto text-mute">{site.tagline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
