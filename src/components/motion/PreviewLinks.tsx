"use client";

import { useEffect } from "react";
import { siteHref } from "@/lib/preview";

/**
 * Preview build only. Turns internal link clicks into full page loads of the
 * exported files, before Next's client router (which needs a server) sees them.
 */
export function PreviewLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const raw = a.getAttribute("href") ?? "";
      if (!raw || raw.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith("//")) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.assign(raw.startsWith("/") ? siteHref(raw) : a.href);
    };
    // Capture on window runs before React's listeners on the document.
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
