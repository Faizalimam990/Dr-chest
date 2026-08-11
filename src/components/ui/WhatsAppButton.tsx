import { useEffect, useState } from "react";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { useUIStore } from "@/store/uiStore";
import { DOCTOR } from "@/lib/content";

/** wa.me wants digits only — country code, no "+" and no spaces. */
const WA_NUMBER = DOCTOR.phoneHref.replace(/\D/g, "");
const WA_MESSAGE = `Hello ${DOCTOR.shortName}, I would like to book a consultation.`;
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

/** WhatsApp glyph — lucide dropped brand marks, so it ships inline. */
function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable="false">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.9 2.41 1.02 2.58c.13.16 1.77 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

/**
 * Sticky WhatsApp call-to-action. Sits bottom-right from the moment the hero
 * scrolls away, and steps aside while the mobile nav sheet is open so it can't
 * float over the menu.
 */
export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const cursor = useCursorVariant("hover-link", "Chat");

  useEffect(() => {
    // Lenis drives native window scroll, so a plain listener stays in step.
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shown = visible && !mobileNavOpen;

  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${DOCTOR.name} on WhatsApp`}
      {...cursor}
      className={`group fixed bottom-6 right-6 z-[85] flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3.5 pr-3.5 text-void shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-all duration-300 hover:brightness-110 focus-visible:outline-acid sm:bottom-8 sm:right-8 md:hover:pr-5 ${
        shown
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Slow pulse ring — decorative, sits behind the disc. */}
      <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s] motion-reduce:hidden" />

      <WhatsAppGlyph className="h-7 w-7 shrink-0" />

      {/* Label unfurls on hover — pointer devices only, no room on a phone. */}
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 md:inline group-hover:max-w-[9rem] group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  );
}
