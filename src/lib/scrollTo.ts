import { lenisRef } from "@/components/motion/SmoothScroll";

/** Smoothly scrolls to a section anchor (e.g. "#partners") on the landing page. */
export function scrollToHash(hash: string, opts: { immediate?: boolean } = {}) {
  const id = hash.replace(/^#/, "");
  const target = id === "top" || id === "" ? 0 : document.getElementById(id);
  if (target === null) return false;
  const y = typeof target === "number" ? 0 : target.getBoundingClientRect().top + window.scrollY;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = lenisRef.current;
  if (lenis && !reduced && !opts.immediate) {
    lenis.start();
    const distance = Math.abs(y - window.scrollY) / window.innerHeight;
    lenis.scrollTo(y, { duration: Math.min(2.6, Math.max(1, distance * 0.12)), easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else {
    window.scrollTo({ top: y, behavior: "auto" });
  }
  try {
    history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`);
  } catch {
    /* sandboxed hosts may refuse history updates */
  }
  return true;
}
