/**
 * NEXT_PUBLIC_STATIC_PREVIEW=1 builds a static export for hosted previews
 * (see scripts/build-preview.mjs). Assets get a placeholder prefix that the
 * script rewrites to relative paths. The normal build is unaffected.
 */
const staticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticPreview
    ? {
        output: "export",
        trailingSlash: true,
        assetPrefix: "/__VA_ROOT__",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
