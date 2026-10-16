"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Static preview mode (NEXT_PUBLIC_STATIC_PREVIEW=1).
 *
 * The preview build is a static export hosted at an unknown sub-path with no
 * server. Pages are plain files (`rules/index.html`), so navigation is a full
 * page load to a relative file, forms resolve locally, and confirmation data
 * travels through sessionStorage. In the normal build none of this applies.
 */
export const STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

const STATE_KEY = "voiranantaa:nav-state";

/** "/rules#judging" → "rules/index.html#judging"; "/" → "home/index.html". */
export function fileFor(route: string) {
  const [path, hash] = route.split("#");
  const clean = path.replace(/^\/+|\/+$/g, "");
  return `${clean ? clean : "home"}/index.html${hash ? `#${hash}` : ""}`;
}

/** Relative path from the current page back to the preview root, e.g. "../". */
function siteRoot() {
  if (typeof document === "undefined") return "";
  return document.querySelector<HTMLMetaElement>('meta[name="va-root"]')?.content ?? "";
}

export function siteHref(route: string) {
  return new URL(siteRoot() + fileFor(route), window.location.href).href;
}

/** Current route as the site sees it ("/rules"), in both modes. */
export function useRoute() {
  const pathname = usePathname();
  if (STATIC_PREVIEW && typeof document !== "undefined") {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="va-route"]')?.content;
    if (meta) return meta;
  }
  return pathname;
}

/** Navigate to a site route, optionally carrying data for the next page. */
export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (route: string, params?: Record<string, string>) => {
      if (STATIC_PREVIEW) {
        try {
          if (params) window.sessionStorage.setItem(STATE_KEY, JSON.stringify(params));
        } catch {
          /* storage blocked — the next page falls back to generic copy */
        }
        window.location.assign(siteHref(route));
        return;
      }
      const q = params ? `?${new URLSearchParams(params)}` : "";
      router.push(route + q);
    },
    [router],
  );
}

/** Data handed over by `useNavigate` in preview mode. */
export function readNavState(): Record<string, string> | null {
  try {
    const raw = window.sessionStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch {
    return null;
  }
}
