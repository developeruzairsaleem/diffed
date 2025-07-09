import { lato, orbitron } from "@/fonts/fonts";
export default function SessionCard() {
  return (
    <div
      style={{
        padding: "2px",
        background:
          "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
      }}
      className=" rounded-lg mt-20 mb-10"
    >
      <div className="bg-[#5E2047]   rounded-lg pb-8 pt-10 px-10 lg:px-20 ">
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
              Session
            </span>
          </div>
          <span className="uppercase text-center text-white leading-tight">
            Countdown Level
          </span>
        </h3>

        {/* secondary heading */}
        <h3
          className={`uppercase font-bold text-[23px] ${orbitron.className} flex flex-col justify-center gap-1 from-[#EE2C81] to-[#FE0FD0] leading-tight`}
        >
          <span className="uppercase mt-20 text-center text-white leading-tight">
            SESSION STARTS IN
          </span>
        </h3>
        <div className="flex justify-center items-center mt-4">
          <button
            className={`${orbitron.className} font-bold text-4xl w-44 mx-auto text-center py-4 px-5 rounded`}
            style={{
              background:
                "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
              color: "white",
            }}
          >
            2:49
          </button>
        </div>

        <div className="flex justify-between md:flex-row flex-col mt-10 items-center">
          <div className="flex items-center w-full md:w-1/2  md:ml-2">
            <img
              src="/images/player2.svg"
              alt="Player"
              className="w-[53px] h-[53px] rounded"
              style={{ minWidth: 53, minHeight: 53 }}
            />
            <div
              className="ml-3 bg-[#232323] text-white text-xl lg:w-[400px] w-full px-6 rounded-xl font-normal"
              style={{ fontFamily: lato.className }}
            >
              <input
                type="text"
                placeholder="Hey! ready to go?"
                className="bg-transparent border-none outline-none text-white w-full text-xl p-3 font-normal"
                style={{ fontFamily: lato.className }}
              />
            </div>
          </div>
          <div className="flex md:mt-0 mt-5 w-full md:justify-end">
            <button className="bg-[#FF0B76]  w-full md:w-[250px] hover:bg-pink-500 text-white text-xl font-normal rounded-lg px-5 md:px-12 py-4">
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
