/**
 * Global brand + navigation content.
 * Brand rule: always the complete name VOIRANANTAA — never split, abbreviated
 * or missing the double A.
 */
export const site = {
  name: "VOIRANANTAA",
  tagline: "TO SEE THE INFINITE",
  publisher: "VOIRTALES",
  description:
    "VOIRANANTAA — To See the Infinite. Edition 01 / Infinite Raga: a wearable-art competition and live experience by VOIRTALES.",
  url: "https://voiranantaa.com",
  email: "hello@voiranantaa.com",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Magazine", href: "#voirtales" },
  ],
} as const;

export type NavItem = { label: string; href: string };

/**
 * Everything lives on one landing page; every link is a section of it.
 * Section ids are set by the anchors in src/app/page.tsx.
 */

/** Desktop header links (blueprint p.05). */
export const primaryNav: NavItem[] = [
  { label: "Edition 01", href: "#top" },
  { label: "Infinite Raga", href: "#theme" },
  { label: "Experience", href: "#experience" },
  { label: "Participate", href: "#participate" },
  { label: "Partners", href: "#partners" },
  { label: "Attend", href: "#attend" },
];

/** Full menu (blueprint p.05). */
export const menuNav: NavItem[] = [
  { label: "Edition 01", href: "#top" },
  { label: "Infinite Raga", href: "#theme" },
  { label: "The Experience", href: "#experience" },
  { label: "Categories", href: "#categories" },
  { label: "How to Participate", href: "#how-to-participate" },
  { label: "Rules & Guidelines", href: "#rules" },
  { label: "The Judges", href: "#judges" },
  { label: "Partners", href: "#partners" },
  { label: "Attend the Show", href: "#attend" },
  { label: "VOIRTALES", href: "#voirtales" },
  { label: "Contact", href: "#contact" },
];

/** Three journeys kept easy to reach on mobile. */
export const journeys = [
  { label: "Participate", href: "#participate", accent: "blue" },
  { label: "Partner", href: "#partners", accent: "red" },
  { label: "Attend", href: "#attend", accent: "green" },
] as const;

/** Global footer (blueprint p.22), as section links. */
export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Infinite Raga", href: "#theme" },
      { label: "The Experience", href: "#experience" },
      { label: "The Judges", href: "#judges" },
      { label: "About VOIRTALES", href: "#voirtales" },
    ],
  },
  {
    title: "Participate",
    links: [
      { label: "Categories", href: "#categories" },
      { label: "Eligibility & Fees", href: "#participate" },
      { label: "Rules", href: "#rules" },
      { label: "Register", href: "#how-to-participate" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Become a Partner", href: "#partners" },
      { label: "Attend the Show", href: "#attend" },
      { label: "Visitor Registration", href: "#attend" },
      { label: "Media Enquiries", href: "#contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "Magazine", href: "#voirtales" },
      { label: "Newsletter", href: "#newsletter" },
    ],
  },
];

/** Legal pages publish before registration opens; listed, not linked, until then. */
export const legalNotes = ["Privacy Policy", "Terms & Conditions", "Participation Rules", "Refund Policy", "Accessibility"];
