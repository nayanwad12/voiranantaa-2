"use client";

import { useEffect, useState } from "react";
import { primaryNav } from "@/content/site";
import { cx } from "@/lib/cx";
import { Logo } from "./Logo";
import { MenuOverlay } from "./MenuOverlay";

/** Which section anchor sits above the middle of the screen. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.45;
      let cur = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) cur = id;
      });
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ids]);
  return active;
}

const NAV_IDS = primaryNav.map((n) => n.href.slice(1));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500",
          scrolled ? "border-b border-white/10 bg-black/55 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="page-x mx-auto flex h-[var(--header-h)] max-w-page items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Sections" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {primaryNav.map((item) => {
                const isActive = active === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "location" : undefined}
                      className={cx(
                        "relative font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                        isActive ? "text-paper" : "text-mute hover:text-paper",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute -bottom-2 left-0 h-px w-full origin-left bg-mustard transition-transform duration-500",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#participate" className="pill pill-solid hidden py-2.5 sm:inline-flex">
              Participate
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="pill group py-2.5"
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
