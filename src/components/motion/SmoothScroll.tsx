"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToHash } from "@/lib/scrollTo";

/** Shared Lenis instance so overlays (menu) can pause scrolling. */
export const lenisRef: { current: Lenis | null } = { current: null };

/**
 * Smooth, weighted scroll — the storytelling device.
 * Disabled entirely for reduced-motion visitors (native scroll).
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // When content changes height (an accordion, a form confirmation), re-measure the scenes.
  useEffect(() => {
    let last = document.body.scrollHeight;
    let t = 0;
    let refreshing = false;
    const onRefreshInit = () => {
      refreshing = true;
    };
    const onRefresh = () => {
      refreshing = false;
      last = document.body.scrollHeight;
    };
    ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - last) > 2 && !refreshing) ScrollTrigger.refresh();
      }, 300);
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, []);

  // Every "#section" link on the page scrolls there smoothly, through the scenes.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      const href = a?.getAttribute("href") ?? "";
      if (!href.startsWith("#") || href === "#main") return;
      if (href !== "#top" && !document.getElementById(href.slice(1))) return;
      e.preventDefault();
      // Let overlays (the menu) close and release scrolling first.
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(href)));
    };
    document.addEventListener("click", onClick);
    // Arriving with a hash (e.g. a shared link to #partners).
    let t = 0;
    if (window.location.hash.length > 1) {
      t = window.setTimeout(() => scrollToHash(window.location.hash, { immediate: true }), 600);
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
