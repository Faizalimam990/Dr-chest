import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Clock, Phone, Navigation, ArrowUpRight } from "lucide-react";
import { CLINICS } from "@/lib/content";
import { useReveal } from "@/hooks/useReveal";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import ClinicalPhoto from "@/components/ui/ClinicalPhoto";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Google Maps embed of the practice's own Business Profile listing. The keyless
 * `output=embed` endpoint is used deliberately — it needs no API key and no
 * billing account, and resolving by the listing's own address string lands the
 * pin on the clinic rather than on a neighbouring building.
 *
 * The dark treatment is a CSS filter over Google's light tiles, which keeps the
 * map on-palette without a paid custom style. It is kept lighter than the rest
 * of the page's washes so Google's own attribution and controls stay legible.
 */
function MapFrame({ index }: { index: number }) {
  const clinic = CLINICS[index];
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(
    clinic.mapQuery,
  )}&z=16&hl=en&output=embed`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-panel-raised">
      {/* Fallback texture, visible if the tiles are slow or blocked. */}
      <div aria-hidden className="scan-grid absolute inset-0 opacity-40" />

      <AnimatePresence mode="wait">
        <motion.iframe
          key={clinic.name}
          title={`Google map showing ${clinic.name}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute inset-0 h-full w-full border-0"
          style={{
            filter: "invert(0.9) hue-rotate(180deg) brightness(0.9) contrast(0.95) saturate(0.7)",
          }}
        />
      </AnimatePresence>

      {/* Teal wash so the map sits inside the palette rather than beside it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-color"
        style={{ background: "rgba(45,212,191,0.18)" }}
      />
      {/*
        Vignette to sink the tile edges into the panel. Kept off the bottom band
        so Google's attribution and the zoom controls are never dimmed.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, transparent 46%, rgba(4,9,12,0.3) 82%, rgba(4,9,12,0.5) 100%)",
        }}
      />

      {/* Locality HUD — the line a patient would give a driver. */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-3 rounded-full border border-line bg-void/75 px-4 py-2 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="nums font-display text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          {clinic.locality}
        </span>
      </div>
    </div>
  );
}

export default function Locations() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const linkCursor = useCursorVariant("hover-link");
  const [active, setActive] = useState(0);
  const clinic = CLINICS[active];

  return (
    <section ref={root} id="locations" className="relative overflow-hidden bg-panel py-28">
      <div className="container-edge">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span data-reveal className="eyebrow">
              <span className="eyebrow-dot" />
              Where to find us
            </span>
            <h2 data-reveal className="mt-5 font-display text-display-md font-semibold text-ink">
              Consulting at{" "}
              <em className="accent-serif text-gradient">
                Bhopal Chest Allergy and Sleep Centre.
              </em>
            </h2>
          </div>
          <p data-reveal className="max-w-xs text-sm leading-relaxed text-ink-faint">
            Consultations, lung function testing and bronchoscopy — 15, E-Block, Surendra Landmark,
            near Ashima Mall, Hoshangabad Road, Bhopal.
          </p>
        </div>

        <div data-reveal className="grid gap-8 lg:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
          {/* ── clinic selector ── */}
          <div className="flex flex-col gap-3">
            {CLINICS.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.name}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-colors duration-300 ${
                    isActive
                      ? "border-accent bg-[rgba(45,212,191,0.05)]"
                      : "border-line bg-panel-raised/50 hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-display text-[11px] uppercase tracking-[0.24em] text-accent">
                        {c.area}
                      </span>
                      <h3
                        className={`mt-2 font-display text-xl font-semibold transition-colors ${
                          isActive ? "text-ink" : "text-ink group-hover:text-accent"
                        }`}
                      >
                        {c.name}
                      </h3>
                    </div>
                    <span
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isActive
                          ? "border-transparent bg-accent text-void"
                          : "border-line text-ink-faint group-hover:border-accent group-hover:text-accent"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{c.address}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-faint">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {c.hours}
                    </span>
                  </div>

                  {/* Active indicator rail. */}
                  <span
                    className={`absolute inset-y-0 left-0 w-[2px] origin-top bg-gradient-primary transition-transform duration-500 ease-out-expo ${
                      isActive ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                </button>
              );
            })}

            {/* What the facility actually looks like, beside where to find it. */}
            <figure className="overflow-hidden rounded-2xl border border-line bg-panel-raised">
              <ClinicalPhoto
                src="/doctor/airway-procedure.webp"
                alt="Bronchoscopy under way in the procedure room, with the patient's vitals on the monitor"
                width={1000}
                height={896}
                aspect="aspect-square"
              />
              <figcaption className="border-t border-line bg-void/50 px-5 py-4 backdrop-blur-sm">
                <span className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">
                  On site
                </span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-muted">
                  Spirometry, sleep studies and diagnostic bronchoscopy are all done here — no
                  second appointment somewhere else for the basic tests.
                </span>
              </figcaption>
            </figure>
          </div>

          {/* ── map + active clinic detail ── */}
          <div className="flex flex-col gap-4">
            <div className="h-[380px] lg:h-[460px]">
              <MapFrame index={active} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={clinic.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="glass-card flex flex-wrap items-center justify-between gap-5 p-6"
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    {clinic.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-ink-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`tel:${clinic.phone.replace(/\s/g, "")}`}
                    {...linkCursor}
                    className="mt-4 inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="nums font-medium">{clinic.phone}</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      clinic.mapQuery,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...linkCursor}
                    className="group inline-flex items-center gap-2 rounded-full border border-accent/50 px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-void"
                  >
                    <Navigation className="h-4 w-4" />
                    Get directions
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>

                  <a
                    href={clinic.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...linkCursor}
                    className="group inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    Open in Google Maps
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
