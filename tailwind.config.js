/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Wipe the default palette — only brand tokens exist. Every colour is
    // written through its channel triplet so `/opacity` modifiers work:
    // a bare `var(--void)` would make `bg-void/70` compile to nothing.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "rgb(255 255 255 / <alpha-value>)",
      void: "rgb(var(--void-rgb) / <alpha-value>)",
      panel: {
        DEFAULT: "rgb(var(--panel-rgb) / <alpha-value>)",
        raised: "rgb(var(--panel-raised-rgb) / <alpha-value>)",
      },
      ink: {
        DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
        muted: "rgb(var(--ink-muted-rgb) / <alpha-value>)",
        faint: "rgb(var(--ink-faint-rgb) / <alpha-value>)",
      },
      accent: {
        DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
        deep: "rgb(var(--accent-deep-rgb) / <alpha-value>)",
      },
      vital: "rgb(var(--vital-rgb) / <alpha-value>)",
      line: "var(--line)",
      // Legacy aliases so pre-existing utility classes keep resolving.
      indigo: "rgb(var(--accent-deep-rgb) / <alpha-value>)",
      cyan: "rgb(var(--cyan-rgb) / <alpha-value>)",
      acid: "rgb(var(--accent-rgb) / <alpha-value>)",
      coral: "rgb(var(--vital-rgb) / <alpha-value>)",
      "glass-indigo": "var(--glass-indigo)",
      "glass-cyan": "var(--glass-cyan)",
      "glass-coral": "var(--glass-coral)",
    },
    extend: {
      fontFamily: {
        display: ["Figtree", "Inter", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
      },
      borderColor: {
        DEFAULT: "var(--line)",
      },
      fontSize: {
        // Fluid display sizes.
        "display-sm": "clamp(2.5rem, 6vw, 4rem)",
        "display-md": "clamp(2.75rem, 7vw, 5.25rem)",
        "display-lg": "clamp(2.6rem, 6.5vw, 5.5rem)",
      },
      maxWidth: {
        content: "1280px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scrollcue: {
          "0%": { transform: "translateY(-16px)", opacity: "0" },
          "40%": { opacity: "1" },
          "100%": { transform: "translateY(48px)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        // Slow inhale / exhale — drives ambient "breathing" scale on decor.
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "45%": { transform: "scale(1.06)", opacity: "0.9" },
        },
        // ECG trace sweeping left→right across a clipped strip.
        "ecg-sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        // Expanding locator ring for map pins.
        "pin-ping": {
          "0%": { transform: "scale(0.6)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 6s ease infinite",
        marquee: "marquee 28s linear infinite",
        scrollcue: "scrollcue 1.8s ease-in-out infinite",
        shake: "shake 0.4s ease",
        breathe: "breathe 5.2s ease-in-out infinite",
        "ecg-sweep": "ecg-sweep 3.2s linear infinite",
        "pin-ping": "pin-ping 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};
