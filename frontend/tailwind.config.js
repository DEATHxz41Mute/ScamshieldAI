/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // deep navy cybersecurity base
        ink: {
          950: "#05070f",
          900: "#080c17",
          850: "#0b1120",
          800: "#0f1729",
          700: "#16203a",
          600: "#1e2a4a",
        },
        accent: {
          DEFAULT: "#22d3ee", // cyan
          soft: "#38bdf8",
          violet: "#8b5cf6",
        },
        safe: { DEFAULT: "#34d399", soft: "#10b981" },
        warn: { DEFAULT: "#fbbf24", soft: "#f59e0b" },
        danger: { DEFAULT: "#fb7185", soft: "#ef4444" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.15), 0 8px 40px -12px rgba(34,211,238,0.25)",
        "glow-danger": "0 0 0 1px rgba(251,113,133,0.2), 0 8px 40px -12px rgba(251,113,133,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: 0.7 },
          "70%": { transform: "scale(1.6)", opacity: 0 },
          "100%": { opacity: 0 },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        "pulse-ring": "pulseRing 1.8s cubic-bezier(0.22,1,0.36,1) infinite",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
