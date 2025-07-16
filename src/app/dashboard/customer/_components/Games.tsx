import React, { useState } from "react";
import gamesData from "../../../../../gamedata.json";
import packagesData from "../../../../../services.json";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Games Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Select Your Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {gamesData.map((game, index) => (
              <div
                key={index}
                onClick={() => setSelectedGame(game)}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedGame.name === game.name
                    ? "ring-4 ring-purple-400 shadow-2xl shadow-purple-500/50"
                    : "hover:shadow-xl shadow-lg"
                }`}
              >
                <div className="relative overflow-hidden rounded-xl border border-gray-700 hover:border-purple-500 transition-colors aspect-[5/4]">
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
                    <div className="flex justify-start">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                          game.isEloBased
                            ? "bg-blue-500/40 text-blue-200 border border-blue-400/60"
                            : "bg-purple-500/40 text-purple-200 border border-purple-400/60"
                        }`}
                      >
                        {game.isEloBased ? "ELO Based" : "Rank Based"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Game Packages */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
          <div className="flex items-center mb-8">
            <div className="relative w-20 h-20 mr-6 rounded-lg overflow-hidden">
              <img
                src={selectedGame.image}
                alt={selectedGame.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {selectedGame.name} Packages
              </h2>
              <p className="text-gray-400">
                Choose from our available service packages
              </p>
            </div>
          </div>

          {selectedPackages.packages && selectedPackages.packages.length > 0 ? (
            <div>
              {/* Package Category Navigation */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 bg-gray-900/50 p-2 rounded-lg border border-gray-600">
                  {selectedPackages.packages.map((packageCategory, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePackageIndex(index)}
                      className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                        activePackageIndex === index
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      {packageCategory.category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Package Category */}
              {selectedPackages.packages[activePackageIndex] && (
                <div className="bg-gray-900/50 rounded-xl border border-gray-600 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-750 p-6 border-b border-gray-600">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedPackages.packages[activePackageIndex].category}
                    </h3>
                    <p className="text-gray-300">
                      {
                        selectedPackages.packages[activePackageIndex]
                          .description
                      }
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/80">
                        <tr>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                            Package
                          </th>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                            Duration
                          </th>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                            Price
                          </th>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                            Description
                          </th>
                          <th className="text-center py-4 px-6 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {selectedPackages.packages[
                          activePackageIndex
                        ].items.map((item, itemIndex) => (
                          <tr
                            key={itemIndex}
                            className="hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="py-5 px-6">
                              <div className="font-semibold text-white text-lg">
                                {item.name}
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                {item?.duration || "Flexible"}
                              </span>
                            </td>
                            <td className="py-5 px-6">
                              <span className="text-green-400 font-bold text-xl">
                                ${item?.price}
                              </span>
                            </td>
                            <td className="py-5 px-6 text-gray-300 max-w-md">
                              <p className="leading-relaxed">
                                {item.description}
                              </p>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                                Select Package
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
