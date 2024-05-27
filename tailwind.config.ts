import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
    themes: [
      "light", "dark", "corporate",
      {
        mytheme: {

          "primary": "#6500E4",
          "primary-content": "#FFFFFF",
          "secondary": "#00CAF0",

          "accent": "#1C002F",

          "neutral": "#EDEBEE",
          "neutral-content": "#D3C9DF",

          "base-100": "#FFFFFF",

          "info": "#6500E4",

          "success": "#00D223",

          "warning": "#FFCC00",

          "error": "#CB014A",
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require("daisyui")],
};
export default config;
