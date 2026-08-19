import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CalendarCheck, ChevronDown, Phone, Mail, ShieldCheck, Siren } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useCursorVariant } from "@/hooks/useCursorVariant";
import { sendAppointmentRequest } from "@/lib/sendMail";
import { CONCERN_OPTIONS, CLINICS, DOCTOR } from "@/lib/content";
import GradientBlob from "@/components/ui/GradientBlob";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(8, "Enter a phone number we can reach you on")
    .regex(/^[\d\s+()-]+$/, "Digits, spaces and + only"),
  clinic: z.string().min(1, "Choose a clinic"),
  concern: z.string().min(1, "Select a reason for the visit"),
  message: z.string().min(10, "A little more detail helps (10+ characters)"),
});

type FormValues = z.infer<typeof schema>;
type Status = "idle" | "submitting" | "success" | "error";

function SuccessCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <motion.path
        d="M4 12.5l5 5 11-11"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const magneticRef = useMagnetic<HTMLSpanElement>({ strength: 0.4, radius: 90 });
  const cursor = useCursorVariant("hover-magnetic");
  const linkCursor = useCursorVariant("hover-link");
  const buttonWrap = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  // Nudge the button on any error, validation or server.
  useGSAP(
    () => {
      if (status === "error" && buttonWrap.current) {
        gsap.fromTo(buttonWrap.current, { x: -6 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      }
    },
    { dependencies: [status] },
  );

  const onSubmit = async (data: FormValues) => {
    setStatus("submitting");
    setServerError("");
    try {
      await sendAppointmentRequest(data);
      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const inputCls = (err?: string) =>
    `w-full rounded-xl border bg-[rgba(234,246,248,0.03)] px-4 py-3.5 text-[15px] text-ink outline-none transition-all duration-300 placeholder:text-ink-faint ${
      err
        ? "border-vital/70 focus:border-vital"
        : "border-line hover:border-[rgba(234,246,248,0.18)] focus:border-[rgba(45,212,191,0.6)] focus:bg-[rgba(234,246,248,0.05)] focus:shadow-[0_0_0_4px_rgba(45,212,191,0.1)]"
    }`;

  return (
    <section ref={root} id="contact" className="relative overflow-hidden py-28">
      <GradientBlob color="var(--accent)" size={520} className="-left-40 top-10 -z-10" />
      <GradientBlob color="var(--cyan)" size={420} className="-right-32 bottom-0 -z-10" parallax={-80} />

      <div className="container-edge">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* ── left: reassurance + direct contact ── */}
          <div>
            <span data-reveal className="eyebrow">
              <span className="eyebrow-dot is-coral" />
              Book a consultation
            </span>
            <h2 data-reveal className="mt-5 font-display text-display-md font-semibold text-ink">
              Let's find out what's{" "}
              <em className="accent-serif text-gradient">really going on.</em>
            </h2>
            <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              Send a request and the clinic confirms your slot within one working day. No referral
              needed, and previous scans are always welcome.
            </p>

            <ul data-reveal className="mt-10 space-y-3 text-ink-muted">
              {[
                "Confirmation within one working day",
                "30-minute first consultation",
                "Lung function testing in the same visit",
              ].map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>

            <div data-reveal className="mt-10 flex flex-col gap-3">
              <a
                href={`tel:${DOCTOR.phoneHref}`}
                {...linkCursor}
                className="group flex items-center gap-3 text-ink transition-colors hover:text-accent"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="nums font-medium">{DOCTOR.phone}</span>
              </a>
              <a
                href={`mailto:${DOCTOR.email}`}
                {...linkCursor}
                className="group flex items-center gap-3 text-ink transition-colors hover:text-accent"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="font-medium">{DOCTOR.email}</span>
              </a>
            </div>

            {/* Emergency routing — deliberately separated from the booking flow. */}
            <div
              data-reveal
              className="mt-10 flex items-start gap-3 rounded-2xl border border-vital/40 bg-[rgba(251,113,133,0.06)] p-5"
            >
              <Siren className="mt-0.5 h-5 w-5 shrink-0 text-vital" />
              <p className="text-sm leading-relaxed text-ink-muted">
                <span className="font-semibold text-ink">This form is not for emergencies.</span> If
                you are severely breathless at rest, coughing blood, or your reliever inhaler has
                stopped working, go to an emergency department now or call the ambulance service on{" "}
                <a
                  href="tel:108"
                  className="nums font-semibold text-vital underline decoration-vital/40 underline-offset-2"
                >
                  108
                </a>
                .
              </p>
            </div>
          </div>

          {/* ── right: appointment request ── */}
          <form
            data-reveal
            noValidate
            onSubmit={handleSubmit(onSubmit, () => setStatus("error"))}
            className="relative rounded-3xl border border-line bg-panel-raised/60 p-7 backdrop-blur-xl sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-primary opacity-60" />

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.name?.message} required>
                  <input
                    {...register("name")}
                    className={inputCls(errors.name?.message)}
                    placeholder="Meera Krishnan"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field label="Phone" error={errors.phone?.message} required>
                  <input
                    {...register("phone")}
                    type="tel"
                    inputMode="tel"
                    className={inputCls(errors.phone?.message)}
                    placeholder="Your 10-digit mobile number"
                    autoComplete="tel"
                    aria-invalid={!!errors.phone}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Preferred clinic" error={errors.clinic?.message} required>
                  <div className="relative">
                    <select
                      {...register("clinic")}
                      className={`${inputCls(errors.clinic?.message)} appearance-none pr-10`}
                      defaultValue=""
                      aria-invalid={!!errors.clinic}
                    >
                      <option value="" disabled className="bg-panel">
                        Select…
                      </option>
                      {CLINICS.map((c) => (
                        <option key={c.name} value={c.name} className="bg-panel">
                          {c.area} — {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  </div>
                </Field>
                <Field label="Reason for visit" error={errors.concern?.message} required>
                  <div className="relative">
                    <select
                      {...register("concern")}
                      className={`${inputCls(errors.concern?.message)} appearance-none pr-10`}
                      defaultValue=""
                      aria-invalid={!!errors.concern}
                    >
                      <option value="" disabled className="bg-panel">
                        Select…
                      </option>
                      {CONCERN_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-panel">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  </div>
                </Field>
              </div>

              <Field
                label="What's been happening?"
                error={errors.message?.message}
                required
                hint="Symptoms, how long they've lasted, and any inhalers or medicines you use."
              >
                <textarea
                  {...register("message")}
                  rows={4}
                  className={`${inputCls(errors.message?.message)} resize-none`}
                  placeholder="Breathless climbing stairs for about three months, worse in the mornings…"
                  aria-invalid={!!errors.message}
                />
              </Field>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div ref={buttonWrap}>
                <span ref={magneticRef} className="inline-block will-change-transform">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    {...cursor}
                    className={`btn-gradient animate-gradient-shift relative inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all disabled:opacity-70 ${
                      status === "success" ? "!bg-none !bg-accent" : ""
                    }`}
                  >
                    <span className="pointer-events-none inline-flex items-center gap-2">
                      {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
                      {status === "success" && <SuccessCheck />}
                      {status !== "submitting" && status !== "success" && (
                        <CalendarCheck className="h-4 w-4" />
                      )}
                      {status === "submitting"
                        ? "Opening…"
                        : status === "success"
                          ? "Request ready to send"
                          : "Request appointment"}
                    </span>
                  </button>
                </span>
              </div>

              <AnimatePresence>
                {serverError && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-vital"
                  >
                    {serverError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-faint">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              Your details are used only to arrange this appointment. Nothing is shared with third
              parties.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${error ? "animate-shake" : ""}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-vital">
            *
          </span>
        )}
      </span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-ink-faint">{hint}</span>}
      <AnimatePresence>
        {error && (
          <motion.span
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-xs text-vital"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
