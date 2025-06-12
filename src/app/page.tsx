import { HydrateClient } from "@/trpc/server";
import Hero from "./_components/hero";
import PricingSection from "./_components/Prcing";
import TestimonialsSection from "./_components/TestingMonials";
import Navbar from "./_components/Navbar";
import { Feedback } from "./_components/Feedback";
export default async function Home() {

  return (
    <HydrateClient>
      <Navbar />
      <Hero />
      <PricingSection />
      <TestimonialsSection />
      <Feedback />
    </HydrateClient>
  );
}
