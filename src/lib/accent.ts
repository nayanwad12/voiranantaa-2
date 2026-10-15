export type Accent = "blue" | "red" | "green" | "pink";

export const accentVar: Record<Accent, string> = {
  blue: "var(--blue)",
  red: "var(--red)",
  green: "var(--green)",
  pink: "var(--pink)",
};
