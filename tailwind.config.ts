import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "#141414",
        border: "#262626",
        accent: {
          DEFAULT: "#FF5A1F",
          hover: "#E64A0F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
