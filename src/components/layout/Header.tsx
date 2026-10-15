"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/content/site";
import { cx } from "@/lib/cx";
import { Logo } from "./Logo";
import { MenuOverlay } from "./MenuOverlay";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-b border-line bg-ink/55 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="page-x mx-auto flex h-[var(--header-h)] max-w-page items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cx(
                      "font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                      isActive(item.href) ? "text-paper" : "text-mute hover:text-paper",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/participate"
              className="hidden bg-blue px-5 py-2.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-paper sm:inline-flex"
            >
              Participate
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group inline-flex items-center gap-3 border border-line px-4 py-2.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:border-blue"
            >
              Menu
              <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 bg-current transition-all group-hover:w-full" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
