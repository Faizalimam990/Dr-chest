import { useRef } from "react";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { DOCTOR, GOOGLE } from "@/lib/content";
import { useReveal } from "@/hooks/useReveal";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import MagneticButton from "@/components/ui/MagneticButton";
import ClinicalPhoto from "@/components/ui/ClinicalPhoto";

/**
 * The review ask. `GOOGLE.review` is the write-a-review deep link off the
 * Business Profile, so the button drops the patient straight into the composer
 * rather than the listing page they would then have to hunt through.
 *
 * The five stars are deliberately an invitation, not a claim — the clinic's
 * live rating is not mirrored here, so nothing on this panel asserts a score.
 */
export default function ReviewUs() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const linkCursor = useCursorVariant("hover-link");

  return (
    <section ref={root} id="reviews" className="relative overflow-hidden py-24">
      <div className="container-edge">
        <div data-reveal className="glass-card overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,36%)]">
            {/* ── the ask ── */}
            <div className="p-7 sm:p-10 lg:p-14">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Patient feedback
              </span>

              <h2 className="mt-5 font-display text-display-sm font-semibold leading-[1.05] text-ink">
                We&rsquo;d love your <em className="accent-serif text-gradient">feedback.</em>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                Had a good experience with us? Your feedback helps the clinic improve — and it helps
                the next patient searching for a chest specialist find somewhere they can trust.
              </p>

              {/* Invitation to rate, not a rating. */}
              <div className="mt-8 flex items-center gap-3">
                <span aria-hidden className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" strokeWidth={1.5} />
                  ))}
                </span>
                <span className="font-display text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                  Rate your visit
                </span>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                <MagneticButton
                  href={GOOGLE.review}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Write a Google review for ${DOCTOR.name}`}
                >
                  <Star className="h-4 w-4" />
                  Review us on Google
                </MagneticButton>

                <MagneticButton
                  variant="ghost"
                  href={GOOGLE.place}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4" />
                  See our listing
                  <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
              </div>

              <p className="mt-7 max-w-md text-[13px] leading-relaxed text-ink-faint">
                The button opens Google in a new tab and takes about a minute. Please leave clinical
                details out of a public review — for anything about your own treatment,{" "}
                <a
                  href={`tel:${DOCTOR.phoneHref}`}
                  {...linkCursor}
                  className="nums text-accent underline decoration-accent/40 underline-offset-2"
                >
                  {DOCTOR.phone}
                </a>{" "}
                reaches the clinic directly.
              </p>
            </div>

            {/* ── the room the visit happened in ── */}
            <div className="relative min-h-[240px] border-t border-line sm:min-h-[300px] lg:min-h-0 lg:border-l lg:border-t-0">
              <ClinicalPhoto
                src="/doctor/consulting-room.jpg"
                alt={`${DOCTOR.name} at his consulting desk beneath his framed qualifications`}
                width={738}
                height={925}
                /*
                  Below lg the photo is a short band, so it is biased down the
                  frame to hold the desk and the doctor rather than cropping to
                  the certificate wall above them. From lg it fills a tall
                  column, where the top of the frame is the right anchor.
                */
                position="object-[50%_42%] lg:object-top"
                grade="saturate(0.7) contrast(1.06) brightness(0.62)"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
