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
  name: "Dr. Vijay Kumar Sharma",
  fullName: "Dr. Vijay Kumar Sharma",
  /** Short form for the tight spaces: nav on small screens, tab titles. */
  shortName: "Dr. Vijay",
  credentials: "MBBS, MD (Chest Medicine), FCC, DAA",
  /** Expanded qualification list for the places that can carry it in full. */
  credentialsLong:
    "MBBS · MD (Chest Medicine) · FCC (Clinical Cardiology) · DAA (CMC Vellore)",
  title: "Interventional Pulmonologist",
  /** Current academic appointment. */
  post: "Associate Professor, Department of Respiratory Medicine",
  email: "vijayk.sharma4u@gmail.com",
  phone: "+91 83490 31096",
  phoneHref: "+918349031096",
  registration: "DMC Reg. 61372 · MPMC Reg. 16135",
  experienceYears: 18,
};

/** Institutions, councils & academies behind the training — trust marquee. */
export const AFFILIATIONS = [
  "Max Hospital, Saket",
  "Fortis Hospital, Vasant Kunj",
  "LRS Institute (NITRD), New Delhi",
  "Maulana Azad Medical College",
  "Madhya Pradesh Medical Council",
  "Delhi Medical Council",
  "Gandhi Medical College, Bhopal",
  "Sri Aurobindo Institute of Medical Sciences",
  "CMC Vellore",
  "Indian Chest Society",
  "Bombay Hospital Institute of Medical Sciences",
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
  { value: 12000, suffix: "+", label: "patients treated" },
  { value: 18, suffix: "+ yrs", label: "specialist chest practice" },
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
      "I had been treated for asthma for six years. Dr. Sharma ran one proper lung function test and found it was never asthma at all.",
    name: "Rohan M.",
    role: "Patient since 2022",
    company: "Indiranagar clinic",
  },
  {
    quote:
      "He put my CT scan on the screen and explained every shadow on it. It was the first time anyone made my own lungs make sense to me.",
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

/** Training timeline for the About section — drawn from the framed record. */
export const CREDENTIALS: Credential[] = [
  { year: "2013", title: "MBBS", place: "Gandhi Medical College, Bhopal — Barkatullah University" },
  { year: "2014", title: "Permanent Registration", place: "Madhya Pradesh Medical Council" },
  {
    year: "2019",
    title: "MD — Chest Medicine",
    place: "MP Medical Science University, Jabalpur",
  },
  { year: "2019", title: "Registration", place: "Delhi Medical Council" },
  { year: "2020", title: "FCC — Fellowship in Clinical Cardiology", place: "Medvarsity" },
  { year: "", title: "DAA — Allergy & Asthma", place: "Christian Medical College, Vellore" },
];

export interface Posting {
  hospital: string;
  city: string;
}

/**
 * Hospitals worked at before the current post — confirmed by the practitioner.
 * No dates given, so the list is presented unordered rather than as a timeline.
 */
export const EXPERIENCE: Posting[] = [
  { hospital: "Max Hospital, Saket", city: "New Delhi" },
  { hospital: "Fortis Hospital, Vasant Kunj", city: "New Delhi" },
  { hospital: "Maulana Azad Medical College (MAMC)", city: "New Delhi" },
  { hospital: "LRS Institute of TB & Respiratory Diseases (NITRD)", city: "New Delhi" },
];

export interface Certificate {
  /** Basename of the pair in /public/certificates: `<slug>.jpg` + `<slug>-card.jpg`. */
  slug: string;
  title: string;
  issuer: string;
  year: string;
  /** Small-caps kicker on the card. */
  tag: string;
  orientation: "landscape" | "portrait";
}

/**
 * The wall, digitised — each frame photographed, deskewed and cropped from the
 * clinic's certificate wall. Order is the arc order, degrees first.
 */
export const CERTIFICATES: Certificate[] = [
  {
    slug: "mbbs-barkatullah",
    title: "Bachelor of Medicine & Surgery",
    issuer: "Barkatullah University, Bhopal",
    year: "2013",
    tag: "Degree",
    orientation: "portrait",
  },
  {
    slug: "md-chest-medicine",
    title: "MD — Chest Medicine",
    issuer: "MP Medical Science University, Jabalpur",
    year: "2019",
    tag: "Postgraduate",
    orientation: "portrait",
  },
  {
    slug: "delhi-medical-council",
    title: "Certificate of Registration",
    issuer: "Delhi Medical Council",
    year: "2019",
    tag: "Registration",
    orientation: "landscape",
  },
  {
    slug: "mp-medical-council",
    title: "Permanent Registration",
    issuer: "Madhya Pradesh Medical Council",
    year: "2014",
    tag: "Registration",
    orientation: "portrait",
  },
  {
    slug: "fcc-clinical-cardiology",
    title: "Fellowship in Clinical Cardiology",
    issuer: "Medvarsity",
    year: "2020",
    tag: "Fellowship",
    orientation: "landscape",
  },
  {
    slug: "basic-bronchoscopy",
    title: "Basic Bronchoscopy Course",
    issuer: "K. J. Somaiya & Bombay Hospital, Mumbai",
    year: "2018",
    tag: "Interventional",
    orientation: "landscape",
  },
  {
    slug: "interventional-pulmonology",
    title: "Interventional Pulmonology League",
    issuer: "S. L. Raheja Hospital, Mumbai",
    year: "2018",
    tag: "Interventional",
    orientation: "landscape",
  },
  {
    slug: "philips-sleep-coe",
    title: "Centre of Excellence — Level II",
    issuer: "Philips Sleep Medicine",
    year: "2018",
    tag: "Sleep medicine",
    orientation: "landscape",
  },
  {
    slug: "critical-care-sonography",
    title: "Critical Care Sonography",
    issuer: "Choithram Hospital & Research Centre, Indore",
    year: "2018",
    tag: "Critical care",
    orientation: "landscape",
  },
  {
    slug: "lung-cancer-consortium",
    title: "Lung Cancer Consortium Asia",
    issuer: "Faculty / delegate, Mumbai",
    year: "2018",
    tag: "Thoracic oncology",
    orientation: "landscape",
  },
  {
    slug: "echocardiography",
    title: "Echocardiography for All",
    issuer: "Buzz4health with CareNet",
    year: "2021",
    tag: "Cardiac imaging",
    orientation: "landscape",
  },
  {
    slug: "cardiology-conference",
    title: "15th International Conference on Cardiology",
    issuer: "Delegate / chairperson, Bhopal",
    year: "2017",
    tag: "Faculty",
    orientation: "landscape",
  },
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

/** Where the consultations happen — powers the map section. */
export const CLINICS: Clinic[] = [
  {
    name: "Bhopal Chest Allergy and Sleep Centre",
    area: "Hoshangabad Road, Bhopal",
    address:
      "15, E-Block, Surendra Landmark, Near Ashima Mall, Hoshangabad Road, Bhopal",
    hours: "OPD by appointment",
    phone: DOCTOR.phone,
    coords: [23.2035, 77.4372],
    bbox: "77.4272,23.1965,77.4472,23.2105",
    services: ["Consultation", "Spirometry", "Bronchoscopy", "Sleep study"],
  },
];
