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
    { label: "Magazine", href: "/voirtales" },
  ],
} as const;

export type NavItem = { label: string; href: string };

/** Desktop header links (deck p.05). */
export const primaryNav: NavItem[] = [
  { label: "Edition 01", href: "/" },
  { label: "Infinite Raga", href: "/infinite-raga" },
  { label: "Experience", href: "/experience" },
  { label: "Participate", href: "/participate" },
  { label: "Partners", href: "/partners" },
  { label: "Attend", href: "/attend" },
];

/** Full hamburger menu (deck p.05). */
export const menuNav: NavItem[] = [
  { label: "Edition 01", href: "/" },
  { label: "Infinite Raga", href: "/infinite-raga" },
  { label: "The Experience", href: "/experience" },
  { label: "Categories", href: "/categories" },
  { label: "How to Participate", href: "/participate" },
  { label: "Rules & Guidelines", href: "/rules" },
  { label: "The Judges", href: "/judges" },
  { label: "Partners", href: "/partners" },
  { label: "Attend the Show", href: "/attend" },
  { label: "VOIRTALES", href: "/voirtales" },
  { label: "Contact", href: "/contact" },
];

/** Three journeys kept easy to reach on mobile. */
export const journeys = [
  { label: "Participate", href: "/participate", accent: "blue" },
  { label: "Partner", href: "/partners", accent: "red" },
  { label: "Attend", href: "/attend", accent: "green" },
] as const;

/** Global footer (deck p.22). */
export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Infinite Raga", href: "/infinite-raga" },
      { label: "The Experience", href: "/experience" },
      { label: "The Judges", href: "/judges" },
      { label: "About VOIRTALES", href: "/voirtales" },
    ],
  },
  {
    title: "Participate",
    links: [
      { label: "Categories", href: "/categories" },
      { label: "Eligibility & Fees", href: "/participate#eligibility" },
      { label: "Rules", href: "/rules" },
      { label: "Register", href: "/participate/register" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Become a Partner", href: "/partners/enquire" },
      { label: "Attend the Show", href: "/attend" },
      { label: "Visitor Registration", href: "/attend/register" },
      { label: "Media Enquiries", href: "/contact#media" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "Magazine", href: "/voirtales" },
      { label: "Newsletter", href: "#newsletter" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Participation Rules", href: "/rules" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Accessibility", href: "/accessibility" },
];
