export const partnerTiers = [
  { name: "Title / Founding", body: "Lead partnership across edition identity and key communications.", accent: "blue" },
  { name: "Category", body: "Support for RAGA / FORM or RAGA / VOICE.", accent: "pink" },
  { name: "Material", body: "Materials, tools, processes or expertise.", accent: "green" },
  { name: "Technology", body: "Projection, lighting, sound, digital or immersive technology.", accent: "blue" },
  { name: "Experience", body: "Stage, exhibition environment and audience experience.", accent: "pink" },
  { name: "Hospitality / Media", body: "Travel, hospitality, editorial and event coverage.", accent: "green" },
] as const;

export const partnerInterestOptions = partnerTiers.map((t) => t.name);
