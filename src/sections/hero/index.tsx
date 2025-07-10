import React from 'react';
import Image from "next/image";

const Index = () => {
  return (
    <div className="py-[50px] flex flex-col items-center justify-center w-full ">
      <Image
        src="/backgrounds/herobg.svg"
        alt="Hero background"
        width={1000}
        height={1000}
        priority
        style={{ marginInline: "auto" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
      />

      <div className="flex flex-col items-center justify-center text-center w-full">
        <p className="section-title">
          <span className="gradient-text">Rank </span> Up. Level up.
        </p>
        <p className="section-title">Game On.</p>
      </div>

      <div className="mt-[20px]">
        <p
          className="
            font-lato 
            font-normal 
            fluid-text
            leading-[111%] 
            tracking-[0.04em] 
            text-center 
            capitalize
            px-4 md:px-[150px] lg:px-[200px]
          "
        >
          Play alongside top-tier pros in Valorant, LoL, Fortnite &amp; more.
          Rank up <br /> while having fun — all legit, all yours.
        </p>
      </div>

      <button className="gradient-btn uppercase -skew-x-12 hover:scale-105 transition-all  mt-[58px]">
        <div className="skew-x-12">
            get coaching, <br /> play with a teammate
        </div>
      </button>

    </div>
  )
}

export default Index;