import React from "react";
import Image from "next/image";

const Services = () => {
  return (
    <div className="py-12 flex flex-col items-center w-full gap-[67px]">
      <div className="text-center w-full ">
        <div className="section-title">
          <p className="gradient-text">Services</p>
          <p>Overview</p>
        </div>
      </div>

      <div className="flex flex-wrap px-[20px] lg:w-[912px] justify-center lg:justify-between items-center gap-[20px] ">
        {/* CARD 1 */}
        <div className="border-box max-w-[368px] flex flex-col border-[1px] border-white/20 rounded-lg px-[18px] pt-[20px] pb-[43px] backdrop-blur-[50px] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5">
          <div className="flex justify-center mb-[30px]">
            <Image
              src="/images/Maskgroup1.png"
              alt="service1"
              width={350}
              height={100}
            />
          </div>
          <div className="flex flex-col gap-[14px] mb-[47px] px-[7px]">
            <p className="text-[24px] font-[500] line-height-[111%] letter-spacing-[3.5%]">
              Coaching
            </p>
            <p className="text-[18px] font-[500] line-height-[86%] letter-spacing-[3.5%] capitalize">
              Learn from elite players and level <br /> up your skills fast.
            </p>
          </div>

          <button
            className="gradient-btn -skew-x-20 px-[7px]
           "
          >
            <p className="text-[16px] font-[700] letter-spacing-[4%] skew-x-20">
              exlore coaching
            </p>
          </button>
        </div>

        {/* CARD 2 */}
        <div className="border-box max-w-[368px] flex flex-col border-[1px] border-white/20 rounded-lg px-[18px] pt-[20px] pb-[43px] backdrop-blur-[50px] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5">
          <div className="flex justify-center mb-[30px]">
            <Image
              src="/images/Maskgroup.png"
              alt="service1"
              width={350}
              height={100}
            />
          </div>
          <div className="flex flex-col gap-[14px] mb-[47px] px-[7px]">
            <p className="text-[24px] font-[500] line-height-[111%] letter-spacing-[3.5%]">
            Boosting
            </p>
            <p className="text-[18px] font-[500] line-height-[86%] letter-spacing-[3.5%] capitalize">
            Get fast rank-ups from top-tier pros. <br />
            Safe, efficient, and secure.
            </p>
          </div>

          <button
            className="gradient-btn -skew-x-20 px-[7px]
           "
          >
            <p className="text-[16px] font-[700] letter-spacing-[4%] skew-x-20">
              exlore teammate
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
