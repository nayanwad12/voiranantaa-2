import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Hex values (mirrors of the CSS tokens in globals.css) so opacity
        // modifiers such as bg-ink/60 work.
        ink: "#05070d",
        night: "#080b16",
        line: "rgba(160, 180, 220, 0.16)",
        blue: { DEFAULT: "#4c97ff", soft: "#8db8ff", deep: "#1b2a6b" },
        paper: "#f5f8fc",
        mute: "#9aa3b5",
        red: "#ff4b5d",
        green: "#beff4b",
        pink: "#ff74cc",
      },
      fontFamily: {
        display: ["var(--font-display)", "DIN Condensed", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-sans)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        label: "0.18em",
      },
      maxWidth: {
        page: "88rem",
      },
    },
  },
  plugins: [],
};

export default config;
