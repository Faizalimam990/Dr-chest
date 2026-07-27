# Dekabyte

**We design, build & grow bold digital brands.**

An AWWWARDS-tier landing site for _Dekabyte_, a full-service digital agency —
web design, development, branding, SEO, digital marketing, and video. Fully
animated, custom-cursor, scroll-choreographed React SPA with:

- A cursor-reactive 3D hero: a WebGL orb with service chips orbiting a glowing
  core, tilting toward the pointer.
- A zig-zag services showcase where each service scales up and glows as it
  reaches the center of the viewport.
- A minimal footer with a cursor-reactive **liquid** wordmark (animated SVG
  turbulence + displacement + flowing gradient).

---

## Tech stack

| Concern              | Library                                                              |
| -------------------- | ------------------------------------------------------------------- |
| Framework / build    | React 18 · Vite · TypeScript                                        |
| Scroll & animation   | GSAP 3 (ScrollTrigger, Draggable) via `@gsap/react` · Lenis         |
| WebGL hero           | Three.js · @react-three/fiber · drei · @react-three/postprocessing  |
| UI motion            | Framer Motion (menus, tabs, FAQ accordion)                          |
| Styling              | Tailwind CSS (fully custom theme, default palette removed)          |
| Forms                | React Hook Form · Zod · `mailto:` (frontend-only, no backend)       |
| State                | Zustand (cursor variant, loader progress, nav state)               |
| Icons                | lucide-react                                                        |

Client-only SPA — no Next.js, no backend server.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (no env config required)
npm run dev               # → http://localhost:5173
```

Other scripts:

```bash
npm run build     # type-check + production build to /dist
npm run preview   # preview the production build
npm run lint      # tsc --noEmit type-check
```

---

## Contact form (mailto)

The contact form is fully frontend — **no backend, no API key, no third party.**
It validates with React Hook Form + Zod, then on submit opens the visitor's own
email client (`mailto:`) with the message pre-filled and addressed to the studio
inbox.

To change the recipient address, edit `TO` in `src/lib/sendMail.ts`.

---

## Fonts

Display type is **Clash Display** / **General Sans** and UI type is **Inter**,
loaded via the [Fontshare](https://www.fontshare.com) and Google Fonts CSS APIs
in `index.html`. To fully self-host, download the `.woff2` files from Fontshare,
drop them in `public/fonts/`, and replace the `<link>` tags with local
`@font-face` rules in `src/styles/globals.css`.

---

## Project structure

```
src/
  components/
    cursor/CustomCursor.tsx
    layout/    Navbar.tsx · MegaMenu.tsx · Footer.tsx
    ui/        MagneticButton.tsx · GradientBlob.tsx · NoiseOverlay.tsx · ProgressBar.tsx
    sections/  Preloader · Hero · HeroScene · LogoMarquee · ProductGrid (services)·
               Capabilities (process) · Stats · Testimonials · FAQ · Contact
  hooks/       useLenis · useMagnetic · useCursorVariant · useReveal
  store/       uiStore.ts (Zustand)
  lib/         gsap.ts · env.ts · content.ts · sendMail.ts
  styles/      tokens.css · globals.css
  App.tsx · main.tsx
```

---

## Accessibility & performance

- **`prefers-reduced-motion`** is respected everywhere — the custom cursor, the
  Three.js auto-rotate/parallax, marquee, and long entrance animations all fall
  back to simple opacity fades (or nothing).
- The Three.js hero is **lazy-loaded** (`React.lazy` + `Suspense`) and its pixel
  ratio is capped at `min(devicePixelRatio, 2)`. Post-processing (bloom/noise) is
  skipped on small screens.
- The **custom cursor is disabled** on touch / coarse-pointer devices; native
  cursor and focus states remain fully intact.
- Full keyboard navigability with a visible `:focus-visible` outline that is
  independent of the custom cursor.
- Service tiles use fixed-aspect containers to keep CLS ≈ 0.

---

## Design tokens

All brand colors live as CSS custom properties in `src/styles/tokens.css` and are
wired into `tailwind.config.js` (the default Tailwind palette is removed, so only
brand tokens are available as utilities like `bg-void`, `text-ink-muted`,
`bg-gradient-primary`, `text-acid`, etc.).
