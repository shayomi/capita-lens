import { Hero } from "@/components/marketing/hero";
import {
  ProblemSection,
  CapitalReadinessSection,
  LenderViewSection,
  HowItWorks,
} from "@/components/marketing/sections";
import { DashboardProof, Differentiation } from "@/components/marketing/proof";
import { WaitlistSection } from "@/components/marketing/waitlist";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <CapitalReadinessSection />
      <LenderViewSection />
      <HowItWorks />
      <DashboardProof />
      <Differentiation />
      <WaitlistSection />
    </>
  );
}
