import React from "react";
import Image from "next/image";

const HowItWorks = () => {
  return (
    <div className="py-12 flex flex-col items-center w-full gap-[67px]">
      <div className="text-center w-full ">
        <p className="section-title">
          <span className="gradient-text">how </span> it works
        </p>
      </div>

      <div className="flex flex-col gap-1 md:gap-2 w-full ">
        {/* Step 1 */}
        <div className="bg-[#671348DE] bg-opacity-[87%] flex items-start gap-2 md:gap-6 shadow-md px-[50px] sm:px-[80px] md:px-[100px] lg:px-[175px] py-3 sm:py-6 md:py-8 lg:py-[33px] ">
          <img
            src="/images/step1.svg"
            alt="Choose Game"
            className="w-[50px] sm:w-[70px] md:w-[90px] lg:w-[110px]"
          />

          <p className="font-semibold text-lg sm:text-2xl md:text-3xl lg:text-[28px]">
            1. Choose Game
          </p>
        </div>

        <div className="relative bottom-[50px] sm:bottom-[70px] md:bottom-[90px] lg:bottom-[110px] z-10 ml-4 sm:ml-8 md:ml-12 lg:ml-[100px] h-[0px]">
          <Image
            src="/images/arrow.png"
            alt="arrow"
            width={40}
            height={80}
            className="opacity-50 w-8 h-[100px] sm:w-10 sm:h-[150px] md:w-12 md:h-[200px] lg:w-16 lg:h-56"
            sizes="(max-width: 640px) 2rem, (max-width: 768px) 2.5rem, (max-width: 1024px) 3rem, 4rem"
          />
        </div>

        {/* Step 2 */}
        <div className="bg-[#671348DE] bg-opacity-[87%] flex items-start gap-2 md:gap-6 shadow-md px-[50px] sm:px-[80px] md:px-[100px] lg:px-[175px] py-3 sm:py-6 md:py-8 lg:py-[33px]">
          <img
            src="/images/step2.svg"
            alt="Choose Game"
            className="w-[50px] sm:w-[70px] md:w-[90px] lg:w-[110px]"
          />

          <p className="font-semibold text-lg sm:text-2xl md:text-3xl lg:text-[28px]">
            2. Select Service
          </p>
        </div>

        <div className="relative bottom-[50px] sm:bottom-[70px] md:bottom-[90px] lg:bottom-[110px] z-10 ml-4 sm:ml-8 md:ml-12 lg:ml-[100px] h-[0px]">
          <Image
            src="/images/arrow.png"
            alt="arrow"
            width={40}
            height={80}
            className="opacity-50 w-8 h-[100px] sm:w-10 sm:h-[150px] md:w-12 md:h-[200px] lg:w-16 lg:h-56"
            sizes="(max-width: 640px) 2rem, (max-width: 768px) 2.5rem, (max-width: 1024px) 3rem, 4rem"
          />
        </div>

        {/* Step 3 */}
        <div className="bg-[#671348DE] bg-opacity-[87%] flex items-start gap-2 md:gap-6 shadow-md px-[50px] sm:px-[80px] md:px-[100px] lg:px-[175px] py-3 sm:py-6 md:py-8 lg:py-[33px]">
          <img
            src="/images/step3.svg"
            alt="Choose Game"
            className="w-[50px] sm:w-[70px] md:w-[90px] lg:w-[110px]"
          />

          <p className="font-semibold text-lg sm:text-2xl md:text-3xl lg:text-[28px]">
            3. Get Matched with a Pro
          </p>
        </div>

        <div className="relative bottom-[50px] sm:bottom-[70px] md:bottom-[90px] lg:bottom-[110px] z-10 ml-4 sm:ml-8 md:ml-12 lg:ml-[100px] h-[0px]">
          <Image
            src="/images/arrow.png"
            alt="arrow"
            width={40}
            height={80}
            className="opacity-50 w-8 h-[100px] sm:w-10 sm:h-[150px] md:w-12 md:h-[200px] lg:w-16 lg:h-56"
            sizes="(max-width: 640px) 2rem, (max-width: 768px) 2.5rem, (max-width: 1024px) 3rem, 4rem"
          />
        </div>

        {/* Step 4 */}
        <div className="bg-[#671348DE] bg-opacity-[87%] flex items-start gap-2 md:gap-6 shadow-md px-[50px] sm:px-[80px] md:px-[100px] lg:px-[175px] py-3 sm:py-6 md:py-8 lg:py-[33px]">
          <img
            src="/images/step4.svg"
            alt="Choose Game"
            className="w-[50px] sm:w-[70px] md:w-[90px] lg:w-[110px]"
          />

          <p className="font-semibold text-lg sm:text-2xl md:text-3xl lg:text-[28px]">
            4. Rank Up & Leave a Review
          </p>
        </div>

        {/* Add more steps here similarly */}
      </div>
    </div>
  );
};

export default HowItWorks;
