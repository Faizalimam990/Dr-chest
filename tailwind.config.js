/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Wipe the default palette — only brand tokens exist.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      void: "var(--void)",
      panel: {
        DEFAULT: "var(--panel)",
        raised: "var(--panel-raised)",
      },
      ink: {
        DEFAULT: "var(--ink)",
        muted: "var(--ink-muted)",
        faint: "var(--ink-faint)",
      },
      accent: {
        DEFAULT: "var(--accent)",
        deep: "var(--accent-deep)",
      },
      vital: "var(--vital)",
      line: "var(--line)",
      // Legacy aliases so pre-existing utility classes keep resolving.
      indigo: "var(--indigo)",
      cyan: "var(--cyan)",
      acid: "var(--acid)",
      coral: "var(--coral)",
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
