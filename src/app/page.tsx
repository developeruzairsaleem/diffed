import Link from "next/link";
import Hero from "@/sections/hero";
import HowItWorks from "@/sections/howItWorks";
import Services from "@/sections/services";
import Choose from "@/sections/choose";
import WhyUs from "@/sections/whyUs";
import Reviews from "@/sections/reviews";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Services />
      <Choose />
      <WhyUs />
      <Reviews />

 <div className="max-w-6xl text-xl mx-auto my-20 flex gap-5 ">
      <Link className="hover:underline transition-all" href="/valorant">
        Valorant
      </Link>
      <Link
        className="hover:underline transition-all"
        href="/league-of-legends"
      >
        League of legends
      </Link>
      <Link className="hover:underline transition-all" href="/fortnite">
        Fornite
      </Link>
      <Link className="hover:underline transition-all" href="/marvel-rivals">
        Marvel Rivals
      </Link>
      <Link className="hover:underline transition-all" href="/cs2">
        CS2
      </Link>
      </div>
    </div>
  );
}
