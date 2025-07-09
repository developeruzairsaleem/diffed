import { lato, orbitron } from "@/fonts/fonts";
export default function QueueStatus() {
  return (
    <div
      style={{
        padding: "2px",
        background:
          "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
      }}
      className=" rounded-lg mt-20 mb-10"
    >
      <div className="bg-[#5E2047]   rounded-lg pb-8 py-5">
        <h3
          className={`uppercase font-bold text-[27px] ${orbitron.className} flex justify-center gap-4 from-[#EE2C81] to-[#FE0FD0]`}
        >
          <span className="bg-gradient-to-r from-[#EE2C81] to-[#FE0FD0] bg-clip-text text-transparent">
            Queue{" "}
          </span>
          <span> Status</span>
        </h3>

        {/* gardient circle */}
        <div className="flex flex-col items-center mt-8">
          <svg width="300" height="150" viewBox="0 0 300 150">
            <defs>
              <linearGradient
                id="gauge-gradient"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#EE2C81" />
                <stop offset="50%" stopColor="#FE0FD0" />
                <stop offset="75%" stopColor="#58B9E3" />
                <stop offset="100%" stopColor="#F79FC5" />
              </linearGradient>
            </defs>
            <path
              d="M 30 140 A 120 120 0 0 1 270 140"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeWidth="18"
            />
          </svg>
          <span
            className={`${orbitron.className} font-bold -mt-10 `}
            style={{
              fontSize: "32px",
              color: "white",

              letterSpacing: "2px",
            }}
          >
            32
          </span>
        </div>

        {/* Queue container with text */}
        <div className="mx-20 mt-4">
          <div
            className={`${lato.className} sm:text-2xl   flex sm:flex-row justify-center flex-col items-center sm:justify-between`}
          >
            <p>You're #2 in the queue</p>
            <p>3 - 5 minutes</p>
          </div>

          <div className="bg-white h-4 rounded-lg w-full mt-7"></div>
        </div>
      </div>
    </div>
  );
}
