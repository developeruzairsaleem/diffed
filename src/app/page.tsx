import Link from "next/link";
import Hero from "@/sections/hero";
import HowItWorks from "@/sections/howItWorks";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
    </div>
  );
}
