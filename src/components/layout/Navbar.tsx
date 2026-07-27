import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, Activity } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useUIStore } from "@/store/uiStore";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { NAV_LINKS, DOCTOR } from "@/lib/content";
import { scrollToId } from "@/hooks/useLenis";
import MegaMenu from "./MegaMenu";
import MagneticButton from "@/components/ui/MagneticButton";

const LINK_TARGET: Record<string, string> = {
  About: "about",
  Services: "services",
  Locations: "locations",
  Contact: "contact",
};

/** Wordmark with a rolling-letter hover and a pulsing vitals glyph. */
function Logo() {
  const letters = DOCTOR.name.split("");
  return (
    <a
      href="#hero"
      onClick={(e) => {
        e.preventDefault();
        scrollToId("hero");
      }}
      className="group relative flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight text-ink"
      aria-label={`${DOCTOR.fullName} — home`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/40 bg-[rgba(45,212,191,0.08)]">
        <Activity className="h-4 w-4 text-accent" strokeWidth={2.2} />
      </span>
      <span className="relative flex overflow-hidden">
        {letters.map((l, i) => (
          <span
            key={i}
            className="inline-block whitespace-pre transition-transform duration-300 ease-out-expo group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {l}
          </span>
        ))}
        {/* Second copy rolls up into view. */}
        <span aria-hidden className="absolute left-0 flex">
          {letters.map((l, i) => (
            <span
              key={i}
              className="inline-block whitespace-pre translate-y-full text-accent transition-transform duration-300 ease-out-expo group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {l}
            </span>
          ))}
        </span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const scrolled = useUIStore((s) => s.scrolled);
  const setScrolled = useUIStore((s) => s.setScrolled);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const [servicesOpen, setServicesOpen] = useState(false);
  const linkCursor = useCursorVariant("hover-link");

  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: "top -80",
      onUpdate: (self) => setScrolled(self.scroll() > 80),
    });
    return () => st.kill();
  }, []);

  const go = (label: string) => {
    setMobileNavOpen(false);
    scrollToId(LINK_TARGET[label] ?? "hero");
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-panel/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
        onMouseLeave={() => setServicesOpen(false)}
      >
        <nav className="container-edge flex h-[var(--nav-h)] items-center justify-between">
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((label) => (
              <li key={label} onMouseEnter={() => setServicesOpen(label === "Services")}>
                <button
                  {...linkCursor}
                  onClick={() => go(label)}
                  className="relative py-2 text-sm text-ink-muted transition-colors hover:text-ink"
                  data-magnetic
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`tel:${DOCTOR.phoneHref}`}
              {...linkCursor}
              className="nums flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
            >
              <Phone className="h-3.5 w-3.5" />
              {DOCTOR.phone}
            </a>
            <MagneticButton onClick={() => scrollToId("contact")}>Book appointment</MagneticButton>
          </div>

          {/* Mobile toggle */}
          <button
            className="text-ink lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>

        {/* Services mega menu */}
        <AnimatePresence>
          {servicesOpen && (
            <div className="hidden lg:block">
              <MegaMenu />
            </div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex flex-col bg-void/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-edge flex h-[var(--nav-h)] items-center justify-between">
              <Logo />
              <button className="text-ink" aria-label="Close menu" onClick={() => setMobileNavOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="container-edge mt-8 flex flex-1 flex-col justify-center gap-2">
              {NAV_LINKS.map((label, i) => (
                <li key={label} className="overflow-hidden">
                  <motion.button
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => go(label)}
                    className="block font-display text-5xl font-semibold text-ink"
                  >
                    {label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <div className="container-edge flex flex-col gap-3 pb-10">
              <a
                href={`tel:${DOCTOR.phoneHref}`}
                className="nums flex items-center justify-center gap-2 rounded-full border border-line py-3.5 text-sm font-medium text-ink"
              >
                <Phone className="h-4 w-4 text-accent" />
                {DOCTOR.phone}
              </a>
              <MagneticButton onClick={() => go("Contact")} className="w-full">
                Book appointment
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
