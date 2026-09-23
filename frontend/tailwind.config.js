/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // pure-black + dark-gray hardcore base
        ink: {
          950: "#000000",
          900: "#0a0a0a",
          850: "#111111",
          800: "#191919",
          700: "#232323",
          600: "#2e2e2e",
        },
        accent: {
          DEFAULT: "#ff5a00", // neon orange
          soft: "#ff8a3d",
          dim: "#cc3d00",
        },
        silver: {
          DEFAULT: "#c0c4cc",
          soft: "#8b92a0",
          dark: "#5a6070",
        },
        safe: { DEFAULT: "#34d399", soft: "#10b981" },
        warn: { DEFAULT: "#fbbf24", soft: "#f59e0b" },
        danger: { DEFAULT: "#ff3b3b", soft: "#ef4444" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,90,0,0.25), 0 8px 40px -12px rgba(255,90,0,0.45)",
        "glow-danger": "0 0 0 1px rgba(255,59,59,0.25), 0 8px 40px -12px rgba(255,59,59,0.45)",
        silver: "0 0 0 1px rgba(192,196,204,0.2), 0 8px 30px -12px rgba(192,196,204,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
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
        "pulse-soft": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.75, transform: "scale(1.02)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -2%)" },
          "20%": { transform: "translate(-10%, 5%)" },
          "30%": { transform: "translate(-5%, -5%)" },
          "40%": { transform: "translate(-10%, 10%)" },
          "50%": { transform: "translate(5%, -10%)" },
          "60%": { transform: "translate(10%, 5%)" },
          "70%": { transform: "translate(15%, 0)" },
          "80%": { transform: "translate(10%, -5%)" },
          "90%": { transform: "translate(5%, 5%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-ring": "pulseRing 1.8s cubic-bezier(0.22,1,0.36,1) infinite",
        shimmer: "shimmer 1.5s infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        grain: "grain 18s steps(10) infinite",
      },
    },
  },
  plugins: [],
};