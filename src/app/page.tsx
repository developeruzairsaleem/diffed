import Coaching from "@/components/Coaching";
import Navbar from "@/components/Navbar";
import Packages from "@/components/Packages";
import RankUp from "@/components/RankUp";
import Services from "@/components/Services";
import WhatYouGet from "@/components/WhatYouGet";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
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
  );
}
