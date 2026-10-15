export type Category = {
  id: "form" | "voice";
  name: string;
  kicker: string;
  summary: string;
  lenses: string[];
  question: string;
  accent: "blue" | "pink";
};

export const categories: Category[] = [
  {
    id: "form",
    name: "RAGA / FORM",
    kicker: "The Experimental",
    summary:
      "For unconventional interpretations of form, material, structure, silhouette and movement.",
    lenses: ["Form", "Material", "Structure", "Silhouette", "Movement", "Imagination"],
    question: "How far can you take the form?",
    accent: "blue",
  },
  {
    id: "voice",
    name: "RAGA / VOICE",
    kicker: "The Reflective",
    summary:
      "For wearable art carrying a thought, cause, social issue, cultural question or human experience.",
    lenses: ["Idea", "Message", "Emotion", "Relevance", "Reflection", "Impact"],
    question: "What do you want your art to say?",
    accent: "pink",
  },
];

export const requirements = [
  {
    title: "95% Unconventional Material",
    body: "Paper · metal · wire · wood · found objects · natural · recycled · experimental materials",
    accent: "blue",
  },
  {
    title: "5% Textile / Fabric",
    body: "How the ratio is measured and verified will be published before registration opens.",
    accent: "red",
  },
  {
    title: "100% Human-Made",
    body: "Final work must demonstrate human authorship, making and intervention.",
    accent: "green",
  },
  {
    title: "Safety Review",
    body: "Materials, structures, wearable components, props and performance must meet final safety rules.",
    accent: "blue",
  },
] as const;

export const criteria = [
  { name: "Vision", question: "Is the idea distinctive?", accent: "blue" },
  { name: "Concept", question: "Is the thought clearly expressed?", accent: "pink" },
  { name: "Material", question: "How creatively is material explored?", accent: "blue" },
  { name: "Craft", question: "How well is it constructed?", accent: "pink" },
  { name: "Experience", question: "How effectively does it come alive?", accent: "blue" },
  { name: "Relevance", question: "Does it leave something to think about?", accent: "pink" },
] as const;
