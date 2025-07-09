import PlayerCard from "@/components/PlayerCard";
import QueueStatus from "@/components/QueueStatus";
import SessionCard from "@/components/Session";
import { lato, orbitron, poppins, roboto } from "@/fonts/fonts";

export default function Wallet() {
  const earningHistory = [
    {
      date: "June 15, 2025",
      service: "Tournament Bonus",
      amount: "$500.00",
      status: "Completed",
    },
    {
      date: "June 15, 2025",
      service: "Referral Reward",
      amount: "$500.00",
      status: "Pending",
    },
    {
      date: "June 15, 2025",
      service: "Match Earnings",
      amount: "$500.00",
      status: "Processing",
    },
    {
      date: "June 15, 2025",
      service: "Earning Amount",
      amount: "$500.00",
      status: "Paid Out",
    },
    {
      date: "June 15, 2025",
      service: "Earning Amount",
      amount: "$500.00",
      status: "Completed",
    },
  ];

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #1B1333 0%, #4E0D37 13%, #5D1A45 66%, #5E1043 70%, #341F71 100%)",
      }}
    >
      <div className="main mx-auto pb-60 px-4 max-w-[1024px] ">
        <div className="pt-20 pb-11 sm:flex-row flex-col-reverse flex justify-between">
          {/* left */}
          <div className="left md:pl-14">
            <ul
              className={`main_menu flex gap-8 ${poppins.className} text-[16px] sm:text-[18px] md:text-[24px]`}
            >
              <li className="font-semibold">Earnings</li>
              <li>Account</li>
            </ul>
          </div>
          <div className="right flex sm:justify-start justify-end mb-5 sm:mb-0 gap-8">
            <div>
              <h4
                className={`${roboto.className} text-[20px] font-bold sm:text-[24px] md:text-[30px] `}
              >
                Erica Sinclair
              </h4>
              <p
                className={`${roboto.className}  text-gray-200 text-[16px] sm:text-18px md:text-[20px]`}
              >
                @erica_sinclair
              </p>
            </div>
            <div className="sm:w-[70px] sm:h-[70px] w-[50px] h-[50px] md:w-[100px] md:h-[100px] bg-[#D7D6D4] rounded-full">
              <img
                src="/images/userprofile.png"
                className=" object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* second container */}

        <div className="flex md:flex-row flex-col gap-10">
          {/* left card */}
          <div
            style={{
              background:
                "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
            }}
            className={` ${orbitron.className}  rounded-lg lg:py-10 lg:px-20 md:py-5 md:px-8 pt-5 pb-24 px-8 font-bold text-[22px] lg:text-[27px] w-full md:w-1/2`}
          >
            <h3>TOTAL EARNING</h3>
            <h3 className="text-[30px] lg:text-[48px]">$12,547.32</h3>
          </div>

          {/* right card */}
          <div
            className={` ${orbitron.className} rounded-lg py-5 px-8 lg:py-10 lg:px-20 font-bold text-[22px] lg:text-[27px] w-full md:w-1/2`}
            style={{
              padding: "1px",
              background:
                "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
            }}
          >
            <div
              style={{
                padding: "1px",
                background:
                  "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
              }}
              className="h-full rounded-lg"
            >
              <div className="bg-[#61234A] py-5 px-8 lg:py-10 lg:px-20 rounded-lg">
                <h3>AVAILABLE</h3>
                <h3>BALANCE</h3>

                <button
                  style={{
                    background:
                      "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
                  }}
                  className={`mt-8 py-5 lg:ml-12 ml-8 text-xl lg:px-8 px-6 font-[400] rounded-lg ${poppins.className}`}
                >
                  Withdraw Earning
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="secondRow lg:grid lg:grid-cols-3 gap-8 mt-12">
          {/* Earning History Table (spans 2 columns) */}
          <div
            className="col-span-2 mb-14 lg:mb-0"
            style={{
              borderRadius: "16px",
              border: "2px solid transparent",
              background:
                "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
              padding: "2px",
            }}
          >
            <div className="bg-[#5E2047] rounded-[14px] p-8">
              <h2
                className="text-white text-2xl font-bold mb-6"
                style={{ fontFamily: orbitron.className }}
              >
                EARNING HISTORY
              </h2>
              <div className="overflow-x-auto w-full">
                <table
                  className="w-full min-w-[600px] text-left"
                  style={{ borderCollapse: "separate", borderSpacing: 0 }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "3px solid",
                        borderImage:
                          "linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%) 1",
                      }}
                    >
                      <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                        Date
                      </th>
                      <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                        Service Type
                      </th>
                      <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningHistory.map((row, idx) => (
                      <tr key={idx}>
                        <td
                          className={`py-3 px-4 text-[#E1E1E1] ${
                            idx !== earningHistory.length - 1
                              ? "border-b border-white"
                              : ""
                          }`}
                        >
                          {row.date}
                        </td>
                        <td
                          className={`py-3 px-4 text-[#E1E1E1] ${
                            idx !== earningHistory.length - 1
                              ? "border-b border-white"
                              : ""
                          }`}
                        >
                          {row.service}
                        </td>
                        <td
                          className={`py-3 px-4 text-[#E1E1E1] ${
                            idx !== earningHistory.length - 1
                              ? "border-b border-white"
                              : ""
                          }`}
                        >
                          {row.amount}
                        </td>
                        <td
                          className={`py-3 px-4 text-[#E1E1E1] ${
                            idx !== earningHistory.length - 1
                              ? "border-b border-white"
                              : ""
                          }`}
                        >
                          {row.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payout Method Card (spans 1 column) */}
          <div
            className="col-span-1 h-full"
            style={{
              borderRadius: "16px",
              border: "2px solid transparent",
              background:
                "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
              padding: "2px",
            }}
          >
            <div
              className={`bg-[#5E2047] rounded-[14px] p-8 flex flex-col items-center h-full`}
            >
              <h2
                className={`text-white text-2xl font-bold mb-8 font-bold ${orbitron.className}`}
              >
                PAYOUT METHOD
              </h2>
              <div
                className="w-full mb-6 rounded-lg py-4 px-6 text-white text-lg font-normal"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(238,44,129,0.15) 0%, rgba(254,15,208,0.15) 33%, rgba(88,185,227,0.15) 66%, rgba(247,159,197,0.15) 100%)",
                }}
              >
                Amount
              </div>
              <div
                className="w-full mb-8 rounded-lg py-4 px-6 text-white text-lg font-normal"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(238,44,129,0.15) 0%, rgba(254,15,208,0.15) 33%, rgba(88,185,227,0.15) 66%, rgba(247,159,197,0.15) 100%)",
                }}
              >
                Payment Method
              </div>
              <button
                className="w-full mt-auto py-4 rounded-lg text-white text-xl font-normal"
                style={{
                  background:
                    "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 50%, #58B9E3 100%)",
                }}
              >
                Payout Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
