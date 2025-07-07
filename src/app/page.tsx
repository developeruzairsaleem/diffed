import Coaching from "@/components/Coaching";
import Navbar from "@/components/Navbar";
import Packages from "@/components/Packages";
import RankUp from "@/components/RankUp";
import Services from "@/components/Services";
import WhatYouGet from "@/components/WhatYouGet";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="h-[700px] w-full relative">
        <Image
          src="/images/herobackground.png"
          alt="game background image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <Coaching />
      <Services />
      <Packages />
      <WhatYouGet />
      <RankUp />
    </div>
  );
}
