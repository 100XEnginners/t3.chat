import { HydrateClient } from "@/trpc/server";
import Hero from "./_components/hero";
import PricingSection from "./_components/Prcing";
import TestimonialsSection from "./_components/TestingMonials";

export default async function Home() {
  
  return (
    <HydrateClient>
      <Hero />
      <PricingSection />
      <TestimonialsSection />
    </HydrateClient>
  );
}
