import type { Config } from "tailwindcss";
import { tailwindConfig } from "@storefront-ui/react/tailwind-config";
import sfTypography from "@storefront-ui/typography";

const config: Config = {
  presets: [tailwindConfig],
  plugins: [sfTypography],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
    },
    extend: {
      sfTypography: () => ({
        "headline-40": {
          fontSize: "2.5rem",
          lineHeight: "1.1",
        },
      }),
      colors: {
        primary: {
          50: "#6bdb6b",
          100: "#57d657",
          200: "#42d142",
          300: "#31c831",
          400: "#2cb42c",
          500: "#228b22",
          600: "#1d771d",
          700: "#186218",
          800: "#134e13",
          900: "#0e390e",
        },
        brand: "rgb(var(--color-brand))",
        lightGreen: "#C5D9A7",
        "light-dark": "#171e2e",
        "sidebar-body": "#F8FAFC",
        body: "#fcfcfc",
        dark: "#0D1321",
        white01: "#E5E5E5",
        white02: "#E6E6E6",
        white03: "#F5F5F5",
        gray01: "#808080",
        gray02: "#F7F7F7",
        gray03: "#333333",
        gray04: "#4D4D4D",
        black01: "#1D1F22",
        gold01: "#D4AF37",
      },
      fontSize: {
        md: "1rem",
        "4.5xl": "40px",
      },
      height: {
        "15": "3.75rem",
      },
      padding: {
        "4.5": "1.125rem",
      },
      borderRadius: {
        large: "0.938rem",
        "4xl": "2rem",
      },
      boxShadow: {
        light: "0px 4px 4px rgba(0, 0, 0, 0.08)",
        large: "0px 8px 16px rgba(17, 24, 39, 0.1)",
        card: "0px 2px 6px rgba(0, 0, 0, 0.06)",
        transaction: "0px 8px 16px rgba(17, 24, 39, 0.06)",
        button:
          "0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)",
      },
      dropShadow: {
        main: "0px 4px 8px rgba(0, 0, 0, 0.08)",
      },
      animation: {
        blink: "blink 1.4s infinite both;",
        "move-up": "moveUp 500ms infinite alternate",
        "scale-up": "scaleUp 500ms infinite alternate",
        "drip-expand": "expand 500ms ease-in forwards",
        "drip-expand-large": "expand-large 600ms ease-in forwards",
        "move-up-small": "moveUpSmall 500ms infinite alternate",
        enter: "fadeInRight 300ms ease-out",
        leave: "fadeOutLeft 300ms ease-in forwards",
      },
      keyframes: {
        blink: {
          "0%": { opacity: "0.2" },
          "20%": { opacity: "1" },
          "100%": { opacity: "0.2" },
        },
        expand: {
          "0%": {
            opacity: "0",
            transform: "scale(1)",
          },
          "30%": {
            opacity: "1",
          },
          "80%": {
            opacity: "0.5",
          },
          "100%": {
            transform: "scale(30)",
            opacity: "0",
          },
        },
        "expand-large": {
          "0%": {
            opacity: "0",
            transform: "scale(1)",
          },
          "30%": {
            opacity: "1",
          },
          "80%": {
            opacity: "0.5",
          },
          "100%": {
            transform: "scale(96)",
            opacity: "0",
          },
        },
        moveUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-20px)" },
        },
        moveUpSmall: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-10px)" },
        },
        scaleUp: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        fadeInRight: {
          "0%": {
            opacity: "0",
            transform: "translate(2rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0)",
          },
        },
        fadeOutLeft: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
        "14": "repeat(14, minmax(0, 1fr))",
        "15": "repeat(15, minmax(0, 1fr))",
      },
    },
  },
};
export default config;
