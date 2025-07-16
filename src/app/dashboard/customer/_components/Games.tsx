import React, { useState } from "react";
import gamesData from "../../../../../gamedata.json";
import packagesData from "../../../../../services.json";
const GamesComponent = () => {
  const [selectedGame, setSelectedGame] = useState(gamesData[0]);
  const selectedPackages = packagesData.find(
    (pkg) => pkg.name === selectedGame.name
  ) || { packages: [] };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Games Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Select Your Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="text-center">
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {game.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {game.ranks.length} ranks available
                    </p>
                    <div className="mt-3 flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          game.isEloBased
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
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
            <div className="text-4xl mr-4">{selectedGame.icon}</div>
            <h2 className="text-3xl font-bold text-white">
              {selectedGame.name} Packages
            </h2>
          </div>

          {selectedPackages.packages && selectedPackages.packages.length > 0 ? (
            <div className="space-y-8">
              {selectedPackages.packages.map(
                (packageCategory, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-gray-900/50 rounded-xl p-6 border border-gray-600"
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {packageCategory.category}
                      </h3>
                      <p className="text-gray-300">
                        {packageCategory.description}
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">
                              Package
                            </th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">
                              Duration
                            </th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">
                              Price
                            </th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">
                              Description
                            </th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {packageCategory.items.map((item, itemIndex) => (
                            <tr
                              key={itemIndex}
                              className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <div className="font-semibold text-white">
                                  {item.name}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-purple-400 font-medium">
                                  {item?.duration || "Flexible"}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-green-400 font-bold text-lg">
                                  ${item?.price}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-300 text-sm max-w-md">
                                {item.description}
                              </td>
                              <td className="py-4 px-4">
                                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                                  Select
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
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
