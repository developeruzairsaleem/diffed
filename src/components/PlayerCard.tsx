import { lato, orbitron } from "@/fonts/fonts";
export default function PlayerCard() {
  return (
    <div
      style={{
        padding: "2px",
        background:
          "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
      }}
      className="rounded-lg mt-10 mb-10 overflow-hidden"
    >
      <div className="bg-[#5E2047] pt-10  rounded-lg pb-8 px-7 lg:px-20  ">
        <h3
          className={`uppercase font-bold text-[27px] ${orbitron.className} flex flex-col justify-center gap-1 from-[#EE2C81] to-[#FE0FD0] leading-tight`}
        >
          <div className="flex justify-center items-center">
            <span
              style={{
                background:
                  "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1.1,
              }}
            >
              ASSIGNED
            </span>
          </div>
          <span className="uppercase text-center text-white leading-tight">
            Player Card
          </span>
        </h3>
        <div className=" flex flex-col md:flex-row justify-between">
          <div className="left md:mt-0 mt-10 flex flex-col sm:flex-row items-center gap-5 justify-center">
            <img
              src="/images/player.svg"
              alt="Player Avatar"
              className="lg:w-60 sm:w-40 sm:h-40 w-3/4 h-3/4 sm:mx-0  mx-auto  lg:h-60 object-contain"
            />
            <div className={`${lato.className} sm:w-inherit w-3/4`}>
              <h3 className={`text-3xl sm:text-[29px]`}>Michael</h3>
              <div className="text-gray-50 letter">
                <p className="">Immortal 3</p>
                <p className="mb-4">2 Years Coaching</p>
                <p className="">Total Earnings - $3M</p>
                <p className="mb-4"> Total Games Played - 424 games</p>
                <div className="flex gap-2 items-center">
                  <button
                    style={{
                      background:
                        "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 50%, #58B9E3 100%)",
                    }}
                    className="text-white px-3 py-1 rounded-full font-bold text-xs mr-2"
                  >
                    PRO
                  </button>
                  <p>Verified</p>
                </div>

                <div className="flex gap-2 ">
                  {/* Star rating bar */}
                  <div className="flex gap-1 mt-4">
                    {/* Orange stars */}
                    <div className="w-6 h-6 bg-[#F79F1A] flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="white"
                      >
                        <polygon points="10,2 12.59,7.36 18.51,7.97 14,12.14 15.18,18.02 10,15.1 4.82,18.02 6,12.14 1.49,7.97 7.41,7.36" />
                      </svg>
                    </div>
                    <div className="w-6 h-6 bg-[#F79F1A] flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="white"
                      >
                        <polygon points="10,2 12.59,7.36 18.51,7.97 14,12.14 15.18,18.02 10,15.1 4.82,18.02 6,12.14 1.49,7.97 7.41,7.36" />
                      </svg>
                    </div>
                    {/* Gray stars */}
                    <div className="w-6 h-6 bg-[#E1E1E1] flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="white"
                      >
                        <polygon points="10,2 12.59,7.36 18.51,7.97 14,12.14 15.18,18.02 10,15.1 4.82,18.02 6,12.14 1.49,7.97 7.41,7.36" />
                      </svg>
                    </div>
                    <div className="w-6 h-6 bg-[#E1E1E1] flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="white"
                      >
                        <polygon points="10,2 12.59,7.36 18.51,7.97 14,12.14 15.18,18.02 10,15.1 4.82,18.02 6,12.14 1.49,7.97 7.41,7.36" />
                      </svg>
                    </div>
                    <div className="w-6 h-6 bg-[#E1E1E1] flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="white"
                      >
                        <polygon points="10,2 12.59,7.36 18.51,7.97 14,12.14 15.18,18.02 10,15.1 4.82,18.02 6,12.14 1.49,7.97 7.41,7.36" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 ml-4">2.59</div>
                </div>
              </div>
            </div>
          </div>
          <div className="right w-full md:w-1/2 flex flex-col  gap-6 items-center justify-center mt-16 md:mt-4">
            {/* Accept Button */}
            <button
              className="lg:w-[340px] justify-self-end w-4/5 py-6 rounded-xl text-white text-2xl font-normal"
              style={{
                background:
                  "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 50%, #58B9E3 100%)",
              }}
            >
              Accept
            </button>
            {/* Rerolls Button */}
            <div className="lg:w-[340px] justify-self-end w-4/5 rounded-xl bg-[#E1E1E1] flex flex-col items-center py-4">
              <span className="text-black text-2xl font-normal">
                Rerolls <span>(2Left)</span>
              </span>
              <span className=" text-gray-700 text-base mt-1">
                You can reroll up to 3 times
              </span>
            </div>
            {/* Choose Different Teammate Button */}
            <div className="lg:w-[340px] justify-self-end w-4/5 rounded-xl bg-[#E1E1E1] flex items-center justify-center py-5">
              <span className="text-black text-xl font-normal text-center">
                Choose a Different
                <br />
                <span className="text-gray-700">Teammate (optional)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
