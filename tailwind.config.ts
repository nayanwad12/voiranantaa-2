import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Hex values (mirrors of the CSS tokens in globals.css) so opacity
        // modifiers such as bg-ink/60 work.
        ink: "#000000",
        night: "#0b0806",
        line: "rgba(232, 217, 196, 0.14)",
        navy: "#003e76",
        mustard: "#e2be22",
        olive: "#6e9d00",
        crimson: "#e31f14",
        teal: "#39664e",
        sand: "#e8d9c4",
        blue: { DEFAULT: "#3a6fb0", soft: "#e8d9c4", deep: "#003e76" },
        paper: "#f3ede6",
        mute: "#a99f94",
        red: "#ff5a48",
        green: "#6e9d00",
        pink: "#e31f14",
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
