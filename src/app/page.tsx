import Link from "next/link";
import Hero from "@/sections/hero";
import HowItWorks from "@/sections/howItWorks";
import Services from "@/sections/services";
import Choose from "@/sections/choose";
import WhyUs from "@/sections/whyUs";
import Reviews from "@/sections/reviews";
import Faqs from "@/sections/faqs";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <Choose />
      <WhyUs />
      <Reviews />
      <Faqs />
    </div>
  );
}
