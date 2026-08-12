import { useLenis } from "@/hooks/useLenis";
import CustomCursor from "@/components/cursor/CustomCursor";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ProgressBar from "@/components/ui/ProgressBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import GradientBlob from "@/components/ui/GradientBlob";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import LogoMarquee from "@/components/sections/LogoMarquee";
import About from "@/components/sections/About";
import CredentialWall from "@/components/sections/CredentialWall";
import ServicesOrbit from "@/components/sections/ServicesOrbit";
import PatientJourney from "@/components/sections/PatientJourney";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import ReviewUs from "@/components/sections/ReviewUs";
import Locations from "@/components/sections/Locations";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function App() {
  useLenis();

  return (
    <>
      <Preloader />
      <CustomCursor />
      <NoiseOverlay />
      <ProgressBar />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-void"
      >
        Skip to content
      </a>

      {/* Drifting background glows — teal-only, kept faint. */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <GradientBlob color="var(--accent-deep)" size={640} className="-left-40 top-[-10%]" parallax={180} />
        <GradientBlob color="var(--accent)" size={460} className="right-[-8%] top-[38%]" parallax={-140} />
        <GradientBlob color="var(--cyan)" size={420} className="left-[22%] top-[78%]" parallax={100} />
      </div>

      <Navbar />

      <main id="main">
        <Hero />
        <LogoMarquee />
        <About />
        <CredentialWall />
        <ServicesOrbit />
        <PatientJourney />
        <Stats />
        <Testimonials />
        <ReviewUs />
        <Locations />
        <FAQ />
        <Contact />
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}
