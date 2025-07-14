import React from "react";
import Image from "next/image";

const whyUsContent = [
  {
    image: "/images/whyUsIcons/Group.svg",
    title: "Fast & Secure Service",
    des1: "Get Your Boost Fast With",
    des2: "Total Privacy.",
  },
  {
    image: "/images/whyUsIcons/Group-1.svg",
    title: "Handpicked Pro Players",
    des1: "Only The Top 1% Gamers",
    des2: "Make It To Our Roster.",
  },
  {
    image: "/images/whyUsIcons/Group-2.svg",
    title: "Reroll Up To 3 Times",
    des1: "Not Vibing With Your",
    des2: "Booster? Pick Again!",
  },
  {
    image: "/images/whyUsIcons/Group-3.svg",
    title: "Real-Time Order Tracking",
    des1: "Follow Every Step Of Your",
    des2: "Session Live.",
  },
  {
    image: "/images/whyUsIcons/Vector.svg",
    title: "Trusted By Thousands",
    des1: "Join A Growing Community",
    des2: "Of 10,000+ Happy Players.",
  },
];

const WhyUs = () => {
  return (
    <div id="why-us" className="pb-12 pt-[100px] lg:pt-[150px]  flex flex-col items-center w-full gap-[67px]">
      <div className="text-center w-full ">
        <p className="section-title">
          <span>Why </span>
          <span className="gradient-text">Choose</span>
          <span> Us?</span>
        </p>
      </div>

      <div className="flex flex-wrap px-[10px] lg:px-[20px] justify-center  items-center gap-[17px] ">
        {whyUsContent.map((item, index) => (
          <div key={index}  className="w-[278px] h-[200px] flex flex-col border-[1px] border-white/20 rounded-lg px-[18px] pt-[33px] pb-[25px] backdrop-blur-[50px] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5 text-center capitalize justify-between">
            <div className="flex justify-center  ">
              <Image
                src={item.image}
                alt="service1"
                width={55}
                height={55}
                className="drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
              />
            </div>
            <div className="flex flex-col gap-[14px] px-[7px]">
              <p className="text-[19px] font-[500] leading-[1.3] tracking-wider">
                {item.title}
              </p>
              <p className="text-[11px] font-[500] leading-[1.3] tracking-wider ">
                {item.des1} <br />
                {item.des2}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;
