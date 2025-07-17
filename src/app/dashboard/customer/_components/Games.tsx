import React, { useState } from "react";
import gamesData from "../../../../../gamedata.json";
import packagesData from "../../../../../services.json";
import { lato, orbitron } from "@/fonts/fonts";
import GradientBorder from "@/HOC/GradientBorder";

const GamesComponent = () => {
  const [selectedGame, setSelectedGame] = useState(gamesData[0]);
  const [activePackageIndex, setActivePackageIndex] = useState(0);
  const selectedPackages = packagesData.find(
    (pkg) => pkg.name === selectedGame.name
  ) || { packages: [] };

  // Reset active package index when game changes
  React.useEffect(() => {
    setActivePackageIndex(0);
  }, [selectedGame]);

  return (
    <div className="min-h-screen p-6 pt-0">
      <div className="max-w-7xl mx-auto">
        {/* Games Grid */}
        <div className="mb-2">
          <h2 className="text-3xl font-semibold text-white mb-12">
            Select Your Favourite Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {gamesData.map((game, index) => (
              <div
                key={index}
                onClick={() => setSelectedGame(game)}
                className={`relative group cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  selectedGame.name === game.name
                    ? "ring-4 ring-pink-800 shadow-2xl shadow-gray-500/50"
                    : "hover:shadow-xl shadow200-lg"
                }`}
              >
                <div className="relative overflow-hidden rounded-xl  transition-colors aspect-[5/4]">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Dark overlay with more space for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 group-hover:from-black/80 group-hover:via-black/40"></div>

                  {/* Game info overlay with better spacing */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                      {game.name}
                    </h3>
                    <p className="text-gray-200 text-base mb-4 drop-shadow">
                      {game.ranks.length} ranks available
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Game Packages */}
        <div
          className="my-16"
          // style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          // className=" backdrop-blur-sm mt-14 rounded-xl border border-gray-200 p-8"
        >
          <div className="flex items-center mb-8">
            <div className="relative w-20 h-20 mr-6 rounded-lg overflow-hidden">
              <img
                src={selectedGame.image}
                alt={selectedGame.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2
                className={`text-4xl font-semibold text-white mb-2 ${orbitron.className}`}
              >
                {selectedGame.name} Packages
              </h2>
              <p className="text-gray-200 text-lg">
                Choose from our available service packages
              </p>
            </div>
          </div>

          {selectedPackages.packages && selectedPackages.packages.length > 0 ? (
            <div>
              {/* Package Category Navigation */}

              <div
                className={` rounded-lg my-6`}
                style={{
                  padding: "2px",
                  background:
                    "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
                }}
              >
                {" "}
                <div
                  style={{
                    padding: "1px",
                    background:
                      "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
                  }}
                  className="h-full rounded-lg"
                >
                  {" "}
                  {/* middle card */}{" "}
                  <div className="rounded-lg  bg-[#b31d7c]">
                    <div className="">
                      <div className="flex flex-wrap gap-2 bg-gray-900/50 p-2 rounded-lg border border-gray-600">
                        {selectedPackages.packages.map(
                          (packageCategory, index) => (
                            <button
                              key={index}
                              onClick={() => setActivePackageIndex(index)}
                              className={`px-6 py-3 rounded-md m-2 font-semibold cursor-pointer transition-all duration-200 ${
                                activePackageIndex === index
                                  ? `group
                                    bg-gradient-to-r from-pink-500 gap-3 via-purple-500 to-cyan-400`
                                  : "text-gray-300 hover:text-white hover:bg-[rgba(255, 255, 255, 0.15)]"
                              }`}
                            >
                              {packageCategory.category}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Package Category */}
              {selectedPackages.packages[activePackageIndex] && (
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
                      className={` ${orbitron.className} text-white text-2xl font-bold mb-6`}
                    >
                      {selectedPackages.packages[activePackageIndex].category}
                    </h2>
                    <p className="my-2 text-gray-200 mb-6">
                      {
                        selectedPackages.packages[activePackageIndex]
                          .description
                      }
                    </p>

                    <div className="overflow-x-auto w-full">
                      <table
                        className="w-full min-w-[600px] text-left"
                        style={{
                          borderCollapse: "separate",
                          borderSpacing: 0,
                        }}
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
                              Package
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Duration
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Price
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                              Description
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg text-center">
                              QuickPay
                            </th>
                            <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg text-center">
                              Checkout
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPackages.packages[
                            activePackageIndex
                          ].items.map((item, itemIndex) => (
                            <tr key={itemIndex} className=" transition-colors">
                              <td
                                className={`py-5 px-4 text-[#E1E1E1] ${
                                  itemIndex !==
                                  selectedPackages.packages[activePackageIndex]
                                    .items.length -
                                    1
                                    ? "border-b border-white"
                                    : ""
                                }`}
                              >
                                <div className="font-semibold text-white text-lg">
                                  {item.name}
                                </div>
                              </td>
                              <td
                                className={`py-5 px-4 text-[#E1E1E1] ${
                                  itemIndex !==
                                  selectedPackages.packages[activePackageIndex]
                                    .items.length -
                                    1
                                    ? "border-b border-white"
                                    : ""
                                }`}
                              >
                                <span className="inline-flex items-center px-6 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                  {item?.duration || "Flexible"}
                                </span>
                              </td>
                              <td
                                className={`py-5 px-4 text-[#E1E1E1] ${
                                  itemIndex !==
                                  selectedPackages.packages[activePackageIndex]
                                    .items.length -
                                    1
                                    ? "border-b border-white"
                                    : ""
                                }`}
                              >
                                <span className="inline-flex items-center px-6 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                  ${item?.price}
                                </span>
                              </td>
                              <td
                                className={`py-5 px-4 text-[#E1E1E1] max-w-md ${
                                  itemIndex !==
                                  selectedPackages.packages[activePackageIndex]
                                    .items.length -
                                    1
                                    ? "border-b border-white"
                                    : ""
                                }`}
                              >
                                <p className="leading-relaxed">
                                  {item.description.length > 35
                                    ? item.description.substring(0, 35) + "..."
                                    : item.description}
                                </p>
                              </td>
                              <td
                                className={`py-5 px-4 text-center ${
                                  itemIndex !==
                                  selectedPackages.packages[activePackageIndex]
                                    .items.length -
                                    1
                                    ? "border-b border-white"
                                    : ""
                                }`}
                              >
                                <button
                                  className={` px-4 py-2 flex cursor-pointer items-center justify-center ${lato.className} relative cursor-pointer group
            bg-gradient-to-r from-pink-500 gap-3 via-purple-500 to-cyan-400
            transition-all
            hover:scale-105
            rounded-lg
          `}
                                >
                                  QuickPay
                                </button>
                              </td>
                              <td
                                className={`py-5 px-4 text-center ${
                                  itemIndex !==
                                  selectedPackages.packages[activePackageIndex]
                                    .items.length -
                                    1
                                    ? "border-b border-white"
                                    : ""
                                }`}
                              >
                                <button className="bg-gradient-to-r cursor-pointer from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-sm">
                                  Checkout
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-gray-400 text-lg">
                No packages available for this game yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesComponent;
