import React from "react";
import Image from "next/image";

const gameCards = [
    {
      image: "/images/games/league.svg",
      title: "League of Legends",
      des1: "290 recent teammates",
      des2: "1187 recent sessions",
    },
    {
      image: "/images/games/valorant.svg",
      title: "Valorant",
      des1: "290 recent teammates",
      des2: "1187 recent sessions",
    },
    {
      image: "/images/games/fortnite.svg",
      title: "Fortnite",
      des1: "290 recent teammates",
      des2: "1187 recent sessions",
    },
    {
      image: "/images/games/counter.svg",
      title: "CS2",
      des1: "290 recent teammates",
      des2: "1187 recent sessions",
    },
    {
      image: "/images/games/rivals.svg",
      title: "Marvel Rivals",
      des1: "290 recent teammates",
      des2: "1187 recent sessions",
    },
    {
      image: "/images/games/girls.svg",
      title: "Gamer Girl",
      des1: "290 recent teammates",
      des2: "1187 recent sessions",
    },
  ];

const Choose = () => {
    
  return (
    <div className="py-12 flex flex-col items-center w-full gap-[67px]">
      <div className="text-center w-full ">
        <p className="section-title">
          <p>Choose your</p>
          <span className="gradient-text">Favourite</span> Games
        </p>
      </div>

      <div className="flex flex-wrap px-[20px] justify-center items-center gap-[65px] ">

        {gameCards.map((card, index) => (
          <div className="max-w-[368px] flex flex-col  border-[1px] border-white/20 rounded-lg px-[18px] pt-[20px] pb-[21px] backdrop-blur-[50px] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5 capitalize">
          <div className="mb-[20px]">
            <Image
              src={card.image}
              alt="service1"
              width={350}
              height={100}
            />
          </div>
          <div className="mb-[44px]">
            <p className="text-[24px] font-[500] leading-[1.11] tracking-[0.035em]">
              {card.title}
            </p>
          </div>
          <div
            className="flex flex-col items-start text-left leading-[1.11]
           "
          >
            <p className="text-[15px] font-[500] leading-[1.3] tracking-wider ">
              {card.des1}
            </p>
            <p className="text-[15px] font-[500] leading-[1.3] tracking-wider ">
              {card.des2}
            </p>
          </div>
        </div>
        ))}
        

      </div>
    </div>
  );
};

export default Choose;
