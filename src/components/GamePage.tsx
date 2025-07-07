import Coaching from "@/components/Coaching";
import Navbar from "@/components/Navbar";
import Packages from "@/components/Packages";
import RankUp from "@/components/RankUp";
import Services from "@/components/Services";
import WhatYouGet from "@/components/WhatYouGet";
import Image from "next/image";
import { GamePageData } from "@/app/valorant/page";
export default function GamePage({ data }: { data: GamePageData }) {
  return (
    <div>
      <Navbar />
      <div className="h-[700px] w-full relative">
        <Image
          src={data.image}
          alt="game background image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <Coaching />
      <Services />
      <Packages data={data} />
      <WhatYouGet />
      <RankUp />
    </div>
  );
}
