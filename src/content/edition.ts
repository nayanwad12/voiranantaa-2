/**
 * Edition-level facts that are expected to change. Everything that the
 * blueprint marks "to confirm" lives here so it can be updated (or moved to a
 * CMS) without touching page code.
 */
export const edition = {
  number: "01",
  label: "Edition 01",
  title: "Infinite Raga",
  strapline: "A wearable-art competition and live experience by VOIRTALES.",

  /** Flip to true once registrations are live and payment is connected. */
  registrationOpen: false,
  registrationOpensLabel: "First week of December 2026",
  /** Must be approved before the participant page goes live. */
  registrationClosesLabel: null as string | null,

  /** Do not publish Buy Ticket / Get Pass until these are confirmed. */
  ticketsLive: false,
  /** Set true once transactional email is connected (see README). Controls confirmation copy. */
  emailsConnected: false,
  /** Judges' profiles are published only after confirmation. */
  judgesConfirmed: false,

  show: {
    datesLabel: "Around 15–16 February 2027",
    tentative: true,
    venue: null as string | null,
    passes: null as string | null,
  },

  fees: {
    currency: "INR",
    student: 2000,
    others: 3500,
  },

  eligibility: {
    minAge: 18,
    audience: [
      "Designers",
      "Fashion designers",
      "Costume designers",
      "Artists",
      "Stylists",
      "Costume makers",
      "Sculptors",
      "Architects",
      "Performers",
      "Illustrators",
      "Makers",
      "Students",
      "Independent practitioners",
      "Creative professionals",
    ],
  },

  live: {
    minutes: 5,
    elements: ["movement", "music", "dance", "theatre", "light", "sound", "spoken word"],
  },

  selection: {
    finalistsPerCategory: 10,
    totalFinalists: 20,
    winners: 2,
    journey: [
      "Preliminary screening of eligible submissions",
      "Technical and safety review",
      "Finalist development and verification",
      "Announcement of 20 finalists",
      "Live presentation and category winners",
    ],
  },
} as const;

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/** Pending decisions (deck p.25). Shown in README; never presented as final on-site. */
export const openDecisions = {
  event: [
    "Exact registration opening + closing dates",
    "Final show date(s)",
    "Venue and capacity",
    "Free RSVP vs paid ticket",
    "Finalist announcement window",
  ],
  competition: [
    "Proposal-first vs finished-artwork submission",
    "95/5 measurement and verification",
    "AI / machine-use policy wording",
    "Fee and refund policy",
    "IP, image and publicity permissions",
    "Final safety specifications",
  ],
};
