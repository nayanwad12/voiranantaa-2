#!/usr/bin/env node
/**
 * Builds a static, server-free preview of the site into ./out-preview,
 * suitable for hosting at any sub-path (e.g. a claude.ai Artifact or any
 * static file host).
 *
 * - Builds a copy of the project with NEXT_PUBLIC_STATIC_PREVIEW=1
 *   (static export; API routes removed; forms resolve locally).
 * - Rewrites every asset and internal link to a relative path.
 * - Writes a small entry page (index.html) that opens home/index.html.
 *
 * Usage: npm run build:preview   (PREVIEW_WORKDIR=/some/dir to choose the build dir)
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(root, "out-preview");
const work = process.env.PREVIEW_WORKDIR
  ? path.resolve(process.env.PREVIEW_WORKDIR)
  : fs.mkdtempSync(path.join(os.tmpdir(), "voiranantaa-preview-"));
const PLACEHOLDER = "/__VA_ROOT__/";
const FONTS =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Montserrat:wght@300..700&display=swap";

// 1. Copy the project (without heavy or generated folders) and link node_modules.
const skip = new Set(["node_modules", ".next", ".git", "out", "out-preview"]);
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });
for (const entry of fs.readdirSync(root)) {
  if (skip.has(entry)) continue;
  fs.cpSync(path.join(root, entry), path.join(work, entry), { recursive: true });
}
fs.symlinkSync(path.join(root, "node_modules"), path.join(work, "node_modules"), "dir");
// Route handlers can't be statically exported; the preview forms don't call them.
fs.rmSync(path.join(work, "src/app/api"), { recursive: true, force: true });

// 2. Static export.
console.log(`Building preview in ${work}`);
execSync("node_modules/.bin/next build", {
  cwd: work,
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_STATIC_PREVIEW: "1", NEXT_TELEMETRY_DISABLED: "1" },
});

// 3. Post-process into ./out-preview.
fs.rmSync(outDir, { recursive: true, force: true });
fs.cpSync(path.join(work, "out"), outDir, { recursive: true });
fs.renameSync(path.join(outDir, "index.html"), path.join(outDir, "home-index.tmp"));
fs.mkdirSync(path.join(outDir, "home"), { recursive: true });
fs.renameSync(path.join(outDir, "home-index.tmp"), path.join(outDir, "home/index.html"));

// Static hosts often reserve "_"-prefixed names and dislike brackets in paths.
fs.renameSync(path.join(outDir, "_next"), path.join(outDir, "assets"));
const chunkDir = path.join(outDir, "assets/static/chunks/app/confirmation");
if (fs.existsSync(path.join(chunkDir, "[type]"))) fs.renameSync(path.join(chunkDir, "[type]"), path.join(chunkDir, "type"));
const renamePaths = (text) =>
  text
    .split(`${PLACEHOLDER}_next/`)
    .join(`${PLACEHOLDER}assets/`)
    .split("chunks/app/confirmation/[type]/")
    .join("chunks/app/confirmation/type/")
    .split("chunks/app/confirmation/%5Btype%5D/")
    .join("chunks/app/confirmation/type/");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });

const routeFile = (route) => {
  const clean = route.replace(/^\/+|\/+$/g, "");
  return `${clean || "home"}/index.html`;
};

for (const file of walk(outDir)) {
  const rel = path.relative(outDir, file);
  const ext = path.extname(file);

  // RSC payloads are only used for client-side navigation, which the preview replaces.
  if (ext === ".txt") {
    fs.rmSync(file);
    continue;
  }

  if (ext === ".html") {
    const depth = rel.split(path.sep).length - 1;
    const up = "../".repeat(depth);
    const route =
      rel === path.join("home", "index.html") ? "/" : "/" + path.dirname(rel).split(path.sep).join("/").replace(/^\.$/, "");
    let html = renamePaths(fs.readFileSync(file, "utf8"));
    html = html.split(PLACEHOLDER).join(up);
    // Internal links: /rules → ../rules/index.html, keeping #hash; files keep their path.
    html = html.replace(/href="\/(?!\/)([^"#]*)(#[^"]*)?"/g, (_, p, hash = "") => {
      if (/\.[a-z0-9]+(\?|$)/i.test(p)) return `href="${up}${p}${hash}"`;
      return `href="${up}${routeFile(p)}${hash}"`;
    });
    // Metadata assets referenced from Next's inline payload (e.g. the favicon).
    html = html.replace(/(\\?")\/(icon\.svg)/g, `$1${up}$2`);
    const head =
      `<meta name="va-root" content="${up}"><meta name="va-route" content="${route}">` +
      `<script>window.__VA_ROOT__=new URL(${JSON.stringify(up)},location.href).href;` +
      // Link prefetches ask for RSC payloads that a static host doesn't have; answer them empty.
      `(function(f){window.fetch=function(i,o){var u=String((i&&i.url)||i);` +
      `return /[?&]_rsc=/.test(u)?Promise.resolve(new Response(null,{status:204})):f.call(this,i,o)}})(window.fetch)</script>` +
      `<link rel="stylesheet" href="${FONTS}">`;
    html = html.replace(/<head>/, `<head>${head}`);
    fs.writeFileSync(file, html);
    continue;
  }

  if (ext === ".js") {
    let js = renamePaths(fs.readFileSync(file, "utf8"));
    // Asset URLs are resolved at runtime against the preview root.
    js = js.replace(/(["'`])\/__VA_ROOT__\//g, (_, q) => `window.__VA_ROOT__+${q}`);
    // Some hosts reject a literal U+FFFD; in Next's bundles it only occurs inside strings.
    js = js.replace(/\uFFFD/g, "\\uFFFD");
    fs.writeFileSync(file, js);
    continue;
  }

  if (ext === ".css") {
    let css = renamePaths(fs.readFileSync(file, "utf8"));
    // CSS lives in assets/static/css; fonts and media sit beside it.
    css = css.split(`${PLACEHOLDER}assets/static/`).join("../");
    fs.writeFileSync(file, css);
  }
}

// 4. Entry page: opens the homepage.
fs.writeFileSync(
  path.join(outDir, "index.html"),
  `<title>VOIRANANTAA</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
  :root { color-scheme: dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #05070d; color: #f5f8fc;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; text-align: center;
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  a { color: #8db8ff; letter-spacing: .18em; text-transform: uppercase; font-size: 13px; font-weight: 600; }
  h1 { font-family: "Arial Narrow", sans-serif; letter-spacing: .02em; font-size: clamp(40px, 12vw, 120px); margin: 0 0 12px; }
</style>
<main>
  <h1>VOIRANANTAA</h1>
  <p><a id="enter" href="home/index.html">Enter — To see the infinite</a></p>
</main>
<script>location.replace(document.getElementById("enter").href);</script>
`,
);

const files = walk(outDir);
const leftovers = files.filter((f) => {
  if (!/\.(html|js|css)$/.test(f)) return false;
  const text = fs.readFileSync(f, "utf8");
  return text.includes("__VA_ROOT__/") || /[^a-z]_next\/static/.test(text) || text.includes("[type]/page-");
});
console.log(`\nPreview ready: ${path.relative(root, outDir)}/ (${files.length} files)`);
if (leftovers.length) {
  console.warn("Unrewritten asset prefixes in:", leftovers.map((f) => path.relative(outDir, f)));
  process.exitCode = 1;
}
