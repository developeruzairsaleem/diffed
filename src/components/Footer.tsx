import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 60%, #58B9E3 100%)" }} />
      {/* SVG background (only on large screens) */}
      <div className="hidden lg:block absolute inset-0 z-10 bg-[url('/backgrounds/footer.svg')] bg-contain bg-no-repeat bg-right-bottom opacity-30" />
      {/* Content */}
      <div className="relative z-20 flex flex-col gap-[50px] items-start justify-center px-[20px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[60px] md:py-[80px]">
        <div className="flex flex-col items-start justify-center gap-[76px] lg:flex-row ">
          <div className="flex flex-col items-start justify-center gap-[11px]">
            <Link href="/">
              <Image
                src="/logo/logoFooter.svg"
                alt="logo"
                width={100}
                height={100}
                className="cursor-pointer"
              />
            </Link>
            <p className="max-w-[315px] text-[16px] font-[400] leading-[1.85] tracking-widest text-white">
              A well-designed gaming header often incorporates elements such as
              game characters, iconic symbols, vibrant colors, and dynamic visuals
              .
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-[40px] md:gap-[40px] lg:gap-[100px] items-start justify-start md:justify-center ">
            <div className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
              <h3 className="text-[20px] font-[700] leading-[1.3] tracking-wide text-white uppercase">
                Company
              </h3>
              <ul className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  Products
                </li>
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  Games
                </li>
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  Features
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
              <h3 className="text-[20px] font-[700] leading-[1.3] tracking-wide text-white uppercase">
                Help
              </h3>
              <ul className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  Support
                </li>
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  About
                </li>
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  Contact Us
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
              <h3 className="text-[20px] font-[700] leading-[1.3] tracking-wide text-white uppercase">
                Resources
              </h3>
              <ul className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  Youtube Playlist
                </li>
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  How to - Blog
                </li>
                <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white cursor-pointer">
                  Terms & Conditions
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-[20px] md:gap-[30px] lg:gap-[48px] items-center">
          <Image
            src="/images/brandIcons/Group.svg"
            alt="roblox"
            width={150}
            height={150}
          />
          <Image
            src="/images/brandIcons/Group-1.svg"
            alt="canon"
            width={150}
            height={150}
          />
          <Image
            src="/images/brandIcons/Vector-1.svg"
            alt="asus"
            width={150}
            height={150}
          />
          
          <Image
            src="/images/brandIcons/Vector.svg"
            alt="twitch"
            width={150}
            height={150}
          />
           <Image
            src="/images/brandIcons/microsoft.svg"
            alt="microsoft"
            width={150}
            height={150}
          />
        </div>

        <div className="flex flex-wrap gap-[50px] items-center md:justify-center">
          <div className="flex gap-[10px] justify-center items-center">
            <div>
              <Image
                src="/images/socialIcons/1.svg"
                alt="instagram"
                width={28}
                height={28}
                className="cursor-pointer"
              />
            </div>
            <div>
              <Image
                src="/images/socialIcons/2.svg"
                alt="twitter"
                width={28}
                height={28}
                className="cursor-pointer"
              />
            </div>
            <div>
              <Image
                src="/images/socialIcons/3.svg"
                alt="linkedin"
                width={28}
                height={28}
                className="cursor-pointer"
              />
            </div>
            <div>
              <Image
                src="/images/socialIcons/4.svg"
                alt="linkedin"
                width={28}
                height={20}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div>
            <p className="font-light text-[14px]">© Copyright 2023, All Rights Reserved by board</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
