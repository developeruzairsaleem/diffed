import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div
      className="flex flex-col gap-[50px] items-start justify-center px-[20px] sm:px-[40px] md:px-[60px] lg:px-[100px] py-[60px] md:py-[80px]"
      style={{
        background:
          "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 60%, #58B9E3 100%)",
      }}
    >
      <div className="flex flex-col items-start justify-center gap-[76px] lg:flex-row ">
        <div className="flex flex-col items-start justify-center gap-[11px]">
          <Image
            src="/logo/logoFooter.svg"
            alt="logo"
            width={100}
            height={100}
          />
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
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                Products
              </li>
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                Games
              </li>
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                Features
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
            <h3 className="text-[20px] font-[700] leading-[1.3] tracking-wide text-white uppercase">
              Help
            </h3>
            <ul className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                Support
              </li>
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                About
              </li>
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                Contact Us
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
            <h3 className="text-[20px] font-[700] leading-[1.3] tracking-wide text-white uppercase">
              Resources
            </h3>
            <ul className="flex flex-col items-start justify-center gap-[18px] md:gap-[32px]">
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                Youtube Playlist
              </li>
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                How to - Blog
              </li>
              <li className="text-[16px] font-[400] leading-[1.3] tracking-wide text-white">
                Terms & Conditions
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-[20px] md:gap-[30px] lg:gap-[48px] items-center">
        <Image
          src="/images/brandIcons/Group.svg"
          alt="email"
          width={150}
          height={150}
        />
        <Image
          src="/images/brandIcons/Group-1.svg"
          alt="email"
          width={150}
          height={150}
        />
        <Image
          src="/images/brandIcons/Vector-1.svg"
          alt="email"
          width={150}
          height={150}
        />
        <Image
          src="/images/brandIcons/Vector.svg"
          alt="email"
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
            />
          </div>
          <div>
            <Image
              src="/images/socialIcons/2.svg"
              alt="twitter"
              width={28}
              height={28}
            />
          </div>
          <div>
            <Image
              src="/images/socialIcons/3.svg"
              alt="linkedin"
              width={28}
              height={28}
            />
          </div>
          <div>
            <Image
              src="/images/socialIcons/4.svg"
              alt="linkedin"
              width={28}
              height={20}
            />
          </div>
        </div>
        <div>
          <p className="font-light text-[14px]">© Copyright 2023, All Rights Reserved by board</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
