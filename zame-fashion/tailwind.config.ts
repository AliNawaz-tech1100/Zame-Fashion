import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF6F1",
        blush: "#F5E6E0",
        champagne: "#E8DFD0",
        gold: "#C9A96E",
        "gold-dark": "#B08D55",
        charcoal: "#2D2D2D",
        "warm-gray": "#6B6B6B",
        "light-gray": "#F0EBE3",
        "soft-pink": "#E8B4B8",
        "soft-lavender": "#D4C4E0",
        "soft-mint": "#C8DDD4",
        "soft-yellow": "#F5E6A3",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(45, 45, 45, 0.06)",
        hover: "0 8px 30px rgba(45, 45, 45, 0.1)",
        card: "0 2px 12px rgba(45, 45, 45, 0.04)",
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
        image: "12px",
        input: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
