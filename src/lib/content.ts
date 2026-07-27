import {
  Wind,
  Activity,
  Stethoscope,
  ScanLine,
  MoonStar,
  Syringe,
  HeartPulse,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/** Practice identity — single source of truth for the doctor's details. */
export const DOCTOR = {
  name: "Dr. Anya",
  fullName: "Dr. Anya Raghunathan",
  credentials: "MD, DM (Pulmonology), FCCP",
  title: "Consultant Chest Physician & Interventional Pulmonologist",
  email: "care@dranya.clinic",
  phone: "+91 80 4718 2200",
  phoneHref: "+918047182200",
  emergency: "+91 80 4718 2211",
  registration: "KMC Reg. 2011-58412",
  experienceYears: 14,
};

/** Hospital affiliations & accreditations for the trust marquee. */
export const AFFILIATIONS = [
  "Apollo Chest Institute",
  "European Respiratory Society",
  "American College of Chest Physicians",
  "Indian Chest Society",
  "NABH Accredited",
  "Manipal Sleep Lab",
  "Global TB Alliance",
  "Fleischner Society",
];

export interface Service {
  icon: LucideIcon;
  name: string;
  desc: string;
}

/** Clinical services — powers the radial "in orbit" selector. */
export const SERVICES: Service[] = [
  {
    icon: Stethoscope,
    name: "Chest Consultation",
    desc: "A full respiratory work-up — history, auscultation, and spirometry — with a plain-language explanation of what's happening in your lungs.",
  },
  {
    icon: Wind,
    name: "Asthma Care",
    desc: "Trigger mapping, inhaler technique coaching, and a written action plan that keeps you off rescue medication.",
  },
  {
    icon: Activity,
    name: "COPD Management",
    desc: "Staged treatment, pulmonary rehab, and oxygen assessment designed to slow decline and protect your exercise capacity.",
  },
  {
    icon: ScanLine,
    name: "Lung Function Testing",
    desc: "Spirometry, DLCO, and body plethysmography read on-site — objective numbers instead of guesswork.",
  },
  {
    icon: MoonStar,
    name: "Sleep Apnoea",
    desc: "Home and lab polysomnography, then CPAP titration and follow-up until your nights are genuinely restful.",
  },
  {
    icon: Syringe,
    name: "Bronchoscopy",
    desc: "Diagnostic and interventional bronchoscopy, EBUS-guided sampling, and airway stenting under sedation.",
  },
  {
    icon: HeartPulse,
    name: "Interstitial Lung Disease",
    desc: "Multidisciplinary HRCT review, antifibrotic therapy, and long-term monitoring for pulmonary fibrosis.",
  },
  {
    icon: ShieldCheck,
    name: "TB & Infections",
    desc: "Drug-sensitive and resistant TB, pneumonia, and post-COVID lung care with full adherence support.",
  },
];

/** Short labels used for the orbiting hero chips. */
export const SERVICE_TAGS = SERVICES.map((s) => s.name);

export interface Condition {
  title: string;
  tag: string;
  theme: "dark" | "raised" | "accent" | "light" | "plum" | "steel";
}

/** Conditions treated — rides the rotating arc. */
export const CONDITIONS: Condition[] = [
  { title: "Asthma", tag: "Airway disease", theme: "accent" },
  { title: "COPD", tag: "Obstructive", theme: "dark" },
  { title: "Sleep Apnoea", tag: "Sleep medicine", theme: "steel" },
  { title: "Pneumonia", tag: "Infection", theme: "light" },
  { title: "Fibrosis", tag: "Interstitial", theme: "plum" },
  { title: "Tuberculosis", tag: "Infection", theme: "raised" },
  { title: "Chronic Cough", tag: "Diagnostics", theme: "light" },
  { title: "Lung Nodules", tag: "Oncology screen", theme: "dark" },
];

export interface JourneyStep {
  no: string;
  title: string;
  headline: string;
  blurb: string;
  outcome: string;
  features: string[];
}

/** The patient pathway — pinned, scroll-scrubbed section. */
export const JOURNEY: JourneyStep[] = [
  {
    no: "01",
    title: "Listen",
    headline: "Your history, heard in full",
    blurb:
      "A 30-minute first consult with no clock-watching. How you breathe, sleep, work, and move all shape the diagnosis — so all of it gets asked about.",
    outcome: "No rushed appointments",
    features: ["30-minute first consult", "Symptom & exposure history", "Bedside chest examination"],
  },
  {
    no: "02",
    title: "Measure",
    headline: "Objective numbers, same visit",
    blurb:
      "Spirometry, oximetry, and imaging read on-site so you leave with data rather than a referral and a two-week wait.",
    outcome: "No guesswork",
    features: ["On-site spirometry & DLCO", "HRCT / X-ray review", "Blood gas & allergy panel"],
  },
  {
    no: "03",
    title: "Explain",
    headline: "You see your own lungs",
    blurb:
      "Your scans and flow-volume loops go up on screen, annotated. You leave able to explain your own diagnosis to your family.",
    outcome: "No jargon",
    features: ["Annotated scan walkthrough", "Written diagnosis summary", "Second-opinion friendly"],
  },
  {
    no: "04",
    title: "Treat",
    headline: "The smallest effective plan",
    blurb:
      "Evidence-led therapy tuned to your life, not the textbook — the fewest medicines, the right inhaler, technique checked in the room.",
    outcome: "No over-prescribing",
    features: ["Inhaler technique coaching", "Stepped medication plan", "Procedure only when indicated"],
  },
  {
    no: "05",
    title: "Follow",
    headline: "Care that keeps checking in",
    blurb:
      "Structured review, a written action plan for flare-ups, and a direct line to the clinic so a bad week never becomes an admission.",
    outcome: "No abandonment",
    features: ["Written flare-up action plan", "Pulmonary rehab referral", "Direct clinic helpline"],
  },
];

export interface Stat {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
}

export const STATS: Stat[] = [
  { value: 12000, suffix: "+", label: "patients treated since 2011" },
  { value: 14, suffix: " yrs", label: "specialist chest practice" },
  { value: 2400, suffix: "+", label: "bronchoscopies performed" },
  { value: 4.9, suffix: "/5", decimals: 1, label: "patient rating · 860+ reviews" },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

/** Patient stories. First names + initial only, as consent allows. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I had been treated for asthma for six years. Dr. Anya ran one proper lung function test and found it was never asthma at all.",
    name: "Rohan M.",
    role: "Patient since 2022",
    company: "Indiranagar clinic",
  },
  {
    quote:
      "She put my CT scan on the screen and explained every shadow on it. It was the first time anyone made my own lungs make sense to me.",
    name: "Sandhya K.",
    role: "Pulmonary fibrosis",
    company: "Referred from Apollo",
  },
  {
    quote:
      "Two winters without a single hospital admission. My COPD action plan is on the fridge and it has genuinely kept me out of the ward.",
    name: "Joseph D.",
    role: "COPD, stage III",
    company: "Whitefield clinic",
  },
  {
    quote:
      "The sleep study caught apnoea nobody had looked for. I have my energy back, and my wife finally sleeps through the night too.",
    name: "Aravind S.",
    role: "Sleep apnoea",
    company: "Manipal sleep lab",
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "What does a chest specialist treat?",
    a: "Anything affecting the lungs, airways, and breathing — asthma, COPD, chronic cough, pneumonia, tuberculosis, sleep apnoea, pulmonary fibrosis, and lung nodules found on a scan. If breathing is the problem, it belongs in a chest clinic.",
  },
  {
    q: "Do I need a referral to book?",
    a: "No. You can book directly. If you have been referred, bring the referral letter and any prior scans or reports — it saves repeating tests you have already had.",
  },
  {
    q: "What should I bring to my first appointment?",
    a: "Every inhaler and medicine you currently use (the actual devices, not a list), any previous chest X-rays, CT scans, or lung function reports, and a note of when your symptoms are worst.",
  },
  {
    q: "How long does the first consultation take?",
    a: "Plan for about an hour. The consultation itself is 30 minutes, with spirometry and any same-visit tests around it. You will not be sent away and asked to come back for basic testing.",
  },
  {
    q: "Is lung function testing uncomfortable?",
    a: "It is completely non-invasive. You breathe into a mouthpiece following coached instructions. It takes 10–15 minutes and the only side effect is feeling briefly out of breath.",
  },
  {
    q: "Should I stop my inhaler before testing?",
    a: "Usually yes, for a short window — typically 6 hours for reliever inhalers and 12–24 hours for long-acting ones. The clinic will confirm exact timings when you book. Never stop a medicine without being told to.",
  },
  {
    q: "Do you offer a second opinion on scans?",
    a: "Yes, and it is welcome. Send your HRCT or CT images and report ahead of the appointment and they will be reviewed before you arrive rather than during your slot.",
  },
  {
    q: "When should I go to emergency instead?",
    a: "Severe breathlessness at rest, chest pain, coughing blood, blue lips or fingertips, or a reliever inhaler that stops working — go to an emergency department immediately. Do not wait for a clinic appointment.",
  },
];

export interface MegaColumn {
  title: string;
  links: string[];
}

export const MEGA_MENU: MegaColumn[] = [
  {
    title: "Airway Disease",
    links: ["Asthma", "COPD", "Chronic Cough"],
  },
  {
    title: "Diagnostics",
    links: ["Lung Function Testing", "Bronchoscopy", "HRCT Review"],
  },
  {
    title: "Sleep & Breathing",
    links: ["Sleep Apnoea", "CPAP Titration", "Home Sleep Study"],
  },
  {
    title: "Infection & Fibrosis",
    links: ["Tuberculosis", "Pneumonia", "Interstitial Lung Disease"],
  },
];

export const NAV_LINKS = ["About", "Services", "Locations", "Contact"];

/** Options in the appointment form's "reason for visit" select. */
export const CONCERN_OPTIONS = [
  "Breathlessness",
  "Chronic cough",
  "Asthma review",
  "COPD review",
  "Snoring / suspected sleep apnoea",
  "Abnormal chest X-ray or CT",
  "Second opinion on a diagnosis",
  "Something else",
];

export interface Credential {
  year: string;
  title: string;
  place: string;
}

/** Training timeline for the About section. */
export const CREDENTIALS: Credential[] = [
  { year: "2006", title: "MBBS", place: "St. John's Medical College, Bangalore" },
  { year: "2011", title: "MD — Internal Medicine", place: "PGIMER, Chandigarh" },
  { year: "2014", title: "DM — Pulmonary Medicine", place: "AIIMS, New Delhi" },
  { year: "2016", title: "Fellowship — Interventional Pulmonology", place: "Royal Brompton, London" },
  { year: "2019", title: "FCCP", place: "American College of Chest Physicians" },
];

export interface Clinic {
  name: string;
  area: string;
  address: string;
  hours: string;
  phone: string;
  /** [lat, lng] — used for the map embed and the pin overlay. */
  coords: [number, number];
  /** Bounding box for the OpenStreetMap iframe: minLng,minLat,maxLng,maxLat */
  bbox: string;
  services: string[];
}

/** Clinic locations for the map section. */
export const CLINICS: Clinic[] = [
  {
    name: "Indiranagar Chest Clinic",
    area: "Indiranagar",
    address: "412, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    hours: "Mon–Fri · 9:00 – 17:00",
    phone: "+91 80 4718 2200",
    coords: [12.9719, 77.6412],
    bbox: "77.6262,12.9639,77.6562,12.9799",
    services: ["Consultation", "Spirometry", "Allergy panel"],
  },
  {
    name: "Whitefield Pulmonary Centre",
    area: "Whitefield",
    address: "2nd Floor, Prestige Shantiniketan, Whitefield Main Road, Bengaluru 560048",
    hours: "Mon, Wed, Fri · 14:00 – 19:00",
    phone: "+91 80 4718 2205",
    coords: [12.9959, 77.7278],
    bbox: "77.7128,12.9879,77.7428,13.0039",
    services: ["Consultation", "Bronchoscopy", "Pulmonary rehab"],
  },
  {
    name: "Jayanagar Sleep Lab",
    area: "Jayanagar",
    address: "18, 11th Main Road, 4th Block, Jayanagar, Bengaluru 560011",
    hours: "Tue & Thu · 10:00 – 16:00 · Sleep studies overnight",
    phone: "+91 80 4718 2208",
    coords: [12.9299, 77.5826],
    bbox: "77.5676,12.9219,77.5976,12.9379",
    services: ["Polysomnography", "CPAP titration", "Sleep consult"],
  },
];
