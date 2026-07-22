import { Hero } from "@/components/marketing/hero";
import {
  ProblemSection,
  HowItWorks,
  ReadinessSection,
} from "@/components/marketing/sections";
import { Pricing, CtaSection } from "@/components/marketing/pricing";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <ReadinessSection />
      <Pricing />
      <CtaSection />
    </>
  );
}
