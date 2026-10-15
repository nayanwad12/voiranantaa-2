/** The nine rasas — theme content for Infinite Raga (not the site's organising framework). */
export type Rasa = { id: string; name: string; feeling: string; accent: "blue" | "pink" };

export const rasas: Rasa[] = [
  { id: "shringara", name: "Shringara", feeling: "Beauty · Love · Attraction", accent: "blue" },
  { id: "hasya", name: "Hasya", feeling: "Joy · Humour · Play", accent: "pink" },
  { id: "karuna", name: "Karuna", feeling: "Compassion · Sorrow", accent: "blue" },
  { id: "raudra", name: "Raudra", feeling: "Anger · Intensity", accent: "pink" },
  { id: "veera", name: "Veera", feeling: "Courage · Resolve", accent: "blue" },
  { id: "bhayanaka", name: "Bhayanaka", feeling: "Fear · Apprehension", accent: "pink" },
  { id: "bibhatsa", name: "Bibhatsa", feeling: "Disquiet · Aversion", accent: "blue" },
  { id: "adbhuta", name: "Adbhuta", feeling: "Wonder · Amazement", accent: "pink" },
  { id: "shanta", name: "Shanta", feeling: "Peace · Stillness", accent: "blue" },
];
