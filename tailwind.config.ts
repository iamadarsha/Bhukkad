import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme=\"dark\"]"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },

      // ── MD3 Color Tokens (mapped to CSS vars set by applyTheme) ──
      colors: {
        // MD3 primary palette
        "md-primary": "var(--md-sys-color-primary)",
        "md-on-primary": "var(--md-sys-color-on-primary)",
        "md-primary-container": "var(--md-sys-color-primary-container)",
        "md-on-primary-container": "var(--md-sys-color-on-primary-container)",
        // MD3 secondary
        "md-secondary": "var(--md-sys-color-secondary)",
        "md-on-secondary": "var(--md-sys-color-on-secondary)",
        "md-secondary-container": "var(--md-sys-color-secondary-container)",
        "md-on-secondary-container": "var(--md-sys-color-on-secondary-container)",
        // MD3 tertiary
        "md-tertiary": "var(--md-sys-color-tertiary)",
        "md-on-tertiary": "var(--md-sys-color-on-tertiary)",
        "md-tertiary-container": "var(--md-sys-color-tertiary-container)",
        "md-on-tertiary-container": "var(--md-sys-color-on-tertiary-container)",
        // MD3 error
        "md-error": "var(--md-sys-color-error)",
        "md-on-error": "var(--md-sys-color-on-error)",
        "md-error-container": "var(--md-sys-color-error-container)",
        "md-on-error-container": "var(--md-sys-color-on-error-container)",
        // MD3 surface system
        "md-surface": "var(--md-sys-color-surface)",
        "md-surface-dim": "var(--md-sys-color-surface-dim)",
        "md-surface-bright": "var(--md-sys-color-surface-bright)",
        "md-surface-lowest": "var(--md-sys-color-surface-container-lowest)",
        "md-surface-low": "var(--md-sys-color-surface-container-low)",
        "md-surface-container": "var(--md-sys-color-surface-container)",
        "md-surface-high": "var(--md-sys-color-surface-container-high)",
        "md-surface-highest": "var(--md-sys-color-surface-container-highest)",
        "md-on-surface": "var(--md-sys-color-on-surface)",
        "md-on-surface-variant": "var(--md-sys-color-on-surface-variant)",
        "md-outline": "var(--md-sys-color-outline)",
        "md-outline-variant": "var(--md-sys-color-outline-variant)",
        "md-inverse-surface": "var(--md-sys-color-inverse-surface)",
        "md-inverse-on-surface": "var(--md-sys-color-inverse-on-surface)",
        "md-inverse-primary": "var(--md-sys-color-inverse-primary)",

        // Legacy colors (backward compat)
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
        },
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
      },

      // ── MD3 Shape Tokens ──
      borderRadius: {
        none: "var(--md-sys-shape-corner-none)",
        "md3-xs": "var(--md-sys-shape-corner-extra-small)",
        "md3-sm": "var(--md-sys-shape-corner-small)",
        "md3-md": "var(--md-sys-shape-corner-medium)",
        "md3-lg": "var(--md-sys-shape-corner-large)",
        "md3-xl": "var(--md-sys-shape-corner-extra-large)",
        full: "var(--md-sys-shape-corner-full)",
        // Legacy
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },

      // ── MD3 Elevation Shadows ──
      boxShadow: {
        "elevation-0": "none",
        "elevation-1": "var(--md-sys-elevation-1)",
        "elevation-2": "var(--md-sys-elevation-2)",
        "elevation-3": "var(--md-sys-elevation-3)",
        "elevation-4": "var(--md-sys-elevation-4)",
        "elevation-5": "var(--md-sys-elevation-5)",
        // Legacy
        sm: "var(--md-sys-elevation-1)",
        md: "var(--md-sys-elevation-2)",
        lg: "var(--md-sys-elevation-3)",
        focus: "0 0 0 3px color-mix(in srgb, var(--md-sys-color-primary) 30%, transparent)",
      },

      // ── MD3 Type Scale (font sizes) ──
      fontSize: {
        "display-lg": ["57px", { lineHeight: "64px", letterSpacing: "-0.25px" }],
        "display-md": ["45px", { lineHeight: "52px", letterSpacing: "0px" }],
        "display-sm": ["36px", { lineHeight: "44px", letterSpacing: "0px" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "0px" }],
        "headline-md": ["28px", { lineHeight: "36px", letterSpacing: "0px" }],
        "headline-sm": ["24px", { lineHeight: "32px", letterSpacing: "0px" }],
        "title-lg": ["22px", { lineHeight: "28px", letterSpacing: "0px" }],
        "title-md": ["16px", { lineHeight: "24px", letterSpacing: "0.15px" }],
        "title-sm": ["14px", { lineHeight: "20px", letterSpacing: "0.1px" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.1px" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.5px" }],
        "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.5px" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "0.5px" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0.25px" }],
        "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.4px" }],
      },

      // ── Animation ──
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        urgentPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(179, 38, 30, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(179, 38, 30, 0)" },
        },
        countUp: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "urgent-pulse": "urgentPulse 2s ease-in-out infinite",
        "count-up": "countUp 0.3s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
