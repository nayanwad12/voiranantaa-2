/** Updated timeline — every entry is tentative until confirmed. */
export const timeline = [
  { when: "First week / Dec 2026", what: "Registrations open", accent: "blue" },
  { when: "First week / Jan 2027", what: "Preliminary screening", accent: "blue" },
  { when: "First week / Feb 2027", what: "Technical + safety review", accent: "blue" },
  { when: "Around 15–16 Feb 2027", what: "Proposed live experience", accent: "pink" },
] as const;

export const toConfirm = [
  "Registration closing date",
  "Exact show date",
  "Venue",
  "Finalist announcement window",
];
