# VOIRANANTAA — To See the Infinite

Website for **VOIRANANTAA Edition 01 / Infinite Raga**, a wearable-art competition and live experience by VOIRTALES.

Everything lives on **one landing page**: a single descent through a night-time universe, **Sky → Air → Space → Water → Earth**. A 3D particle universe behind the page re-forms into a new shape for each chapter. The nav bar and menu scroll to sections of the page. The forms open in place: the participant application in a full-screen layer, and the partner, visitor, contact and newsletter forms inline.

## Stack

- **Next.js 15** (App Router, TypeScript), **Tailwind CSS 3**
- **Lenis** for smooth scrolling, **GSAP ScrollTrigger** for pinned scenes and scroll-linked motion
- **Three.js** for the particle universe (`src/components/universe/`)
- **react-hook-form** + **zod** forms. The same schemas validate in the browser and in the API routes.
- Self-hosted fonts: **Barlow Condensed** (stand-in for DIN Condensed) and **Montserrat**

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

Deploy to Vercel (zero config) or to any Node host with `npm run build && npm start`.

## Static preview

```bash
npm run build:preview      # → out-preview/ (static, no server, works under any sub-path)
```

This build sets `NEXT_PUBLIC_STATIC_PREVIEW=1` (see `src/lib/preview.ts`):
- The landing page is exported as a static file.
- API routes are left out. Forms still validate in the browser, then show their confirmations with a `PREVIEW-` reference. Nothing is sent or stored.
- Asset paths are rewritten to be relative, so the folder can be hosted anywhere, including a claude.ai Artifact or any static host.

The normal `npm run build` is unchanged by this.

## Where things live

| What | Where |
| --- | --- |
| Brand, nav, menu and footer links (section anchors) | `src/content/site.ts` |
| Dates, fees, venue, status flags | `src/content/edition.ts` |
| Rasas, categories, rules, criteria, partner tiers, timeline | `src/content/*.ts` |
| Colour and type tokens | `src/app/globals.css` (`:root`) + `tailwind.config.ts` |
| Particle universe (shapes per chapter) | `src/components/universe/` |
| Landing page order and section anchors | `src/app/page.tsx` |
| Landing sections | `src/components/landing/` |
| Forms + validation | `src/components/forms/`, `src/lib/schemas.ts` |
| API stubs | `src/app/api/*/route.ts`, `src/lib/api.ts` |

All copy that is expected to change lives in `src/content/`. These files are typed and CMS-ready: swap their exports for CMS queries without touching page code.

### Status flags (`src/content/edition.ts`)

| Flag | Effect |
| --- | --- |
| `registrationOpen` | `false`: the participant CTA shows "Registration opens first week of December 2026", and the form runs as a labelled **preview**. References get a `PREVIEW-` prefix and no payment is taken. |
| `registrationClosesLabel` | Shown in the application. Must be approved before going live. |
| `ticketsLive` | Reserved. There is **no Buy Ticket / Get Pass button** anywhere until admission model, price, capacity and venue are confirmed. |
| `judgesConfirmed` | Reserved. The judges section shows "Panel to be announced" until profiles are approved. No placeholder people. |
| `emailsConnected` | Controls whether confirmations promise an email. |
| `show.venue`, `show.passes` | `null` renders "To be announced". |

## Brand rules applied

- The name is always the complete **VOIRANANTAA**: never split, never abbreviated, always with the double A. The Edition 01 deck's "VOIR ANANTA" was normalised to this.
- Tagline: **TO SEE THE INFINITE**.
- Black and blue lead and white gives clarity. Red, neon green and pink appear only as fine lines, accent bars, a light trail and mineral glints.
- One gradient banner, used for one statement only: "One theme. Nine emotional worlds. Infinite interpretations."
- The five cosmic elements organise the site. The nine rasas appear only as theme content (the rasa gallery and the form), never as the site structure.

## Motion and accessibility

- **Enter:** the hero name resolves letter by letter, then the tagline.
- **Transitions:** each chapter opens with its element's name flying through the camera while the universe re-forms.
- **Reveal:** kinetic type, scroll-linked marquees and word-by-word statements.
- **`prefers-reduced-motion`:** smooth scrolling, pins and animations are off, and the universe is frozen in time. The page shows its static layout.
- **No WebGL, ≤2 CPU cores or Save-Data:** a static gradient replaces the universe.
- The universe pauses while the tab is hidden.
- Skip link, keyboard-trappable menu with Esc to close, labelled form fields with linked errors, and visible focus states.

## Forms

| Journey | Where | API |
| --- | --- | --- |
| Participant (3 steps: About you / Your work / Checkout) | Full-screen layer from any "Preview the application" button | `POST /api/participant` (multipart) |
| Partner | Partners section → "Partner with us" | `POST /api/partner` |
| Visitor (interest only) | Attend section | `POST /api/visitor` |
| Contact | Contact section | `POST /api/contact` |
| Newsletter | Footer | `POST /api/newsletter` |

Each form shows its confirmation in place: the reference, payment status where relevant, and next steps.

- Participant uploads: PDF/JPG/PNG/WEBP, 10 MB each, up to 5 files. Checked in the browser and again on the server.
- Fee: ₹2,000 when status is *Student* and the student declaration is ticked, otherwise ₹3,500. The server computes it.
- Progress on the participant form is saved to `localStorage` on the device (files excluded) and cleared after a successful submit.
- Error, incomplete-form and upload-error states are recoverable. Nothing is lost on a failed submit.

### Connecting the backend

The API routes validate input, then call `persist()` in `src/lib/api.ts`, which currently only logs the reference. To go live:

1. **Storage / admin:** write records in `persist()` to a database, Airtable or CRM. Add an admin view with filters, status tracking and CSV export.
2. **Uploads:** stream `files` from `/api/participant` to private object storage (S3, R2 or GCS). Keep access controlled, and agree a retention period.
3. **Payment:** create a payment order, e.g. Razorpay, after saving the application. Redirect to checkout, then confirm through the provider's webhook. Update `paymentStatus` and show the receipt in the confirmation.
4. **Email:** send transactional confirmations from `persist()` (e.g. Resend or Postmark), then set `edition.emailsConnected = true`. The newsletter needs double opt-in and unsubscribe.
5. **Analytics:** track registration starts, step completion and submissions.

### Using licensed DIN Condensed

Put the `.woff2` files in `public/fonts/` and add an `@font-face` for `"DIN Condensed Web"` in `globals.css`. Then set `--font-display: "DIN Condensed Web";` in `:root`. Barlow Condensed stays as the fallback.

## Decisions required before registration opens

These come from the Edition 01 blueprint (p.25) and affect copy, form logic, payment and legal terms. They are also listed in `openDecisions` in `src/content/edition.ts`.

**Event details:** exact registration opening and closing dates · final show date(s) · venue and capacity · free RSVP vs paid ticket · finalist announcement window.

**Competition rules:** proposal-first vs finished-artwork submission · 95/5 measurement and verification · AI / machine-use policy wording · fee and refund policy · IP, image and publicity permissions · final safety specifications.

Privacy, terms, refund, participation-rules and accessibility pages will be added once their text is approved. Until then the footer lists them as "published before registration opens".
