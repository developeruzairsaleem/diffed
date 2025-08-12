import React, { useEffect, useState } from "react";
import { lato, orbitron } from "@/fonts/fonts";
import { message } from "antd";
import SafeImage from "@/components/ui/SafeImage";
import { useRouter } from "next/navigation";
import SkeletonLoader from "@/components/ui/SkeletonLoader"; // 1. Import the skeleton

const GamesComponent = () => {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [loading, setLoading] = useState(true); // 2. Set initial loading to true
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubpackage, setSelectedSubpackage] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [currentELO, setCurrentELO] = useState<number>(0);
  const [targetELO, setTargetELO] = useState<number>(0);
  const router = useRouter();

  // Reset active package index when game changes
  useEffect(() => {
    setSelectedServiceIndex(0);
  }, [selectedGame]);

  // Reset ELO values when subpackage changes
  useEffect(() => {
    if (selectedSubpackage) {
      setCurrentELO(selectedSubpackage.minELO || 0);
      setTargetELO(selectedSubpackage.maxELO || 1000);
    }
  }, [selectedSubpackage]);

  // Calculate total price for dynamic pricing
  const calculateTotalPrice = () => {
    if (!selectedSubpackage) return 0;

    if (
      selectedSubpackage.dynamicPricing &&
      selectedSubpackage.basePricePerELO
    ) {
      const eloDifference = Math.abs(targetELO - currentELO);
      const eloCost = eloDifference * selectedSubpackage.basePricePerELO;
      return selectedSubpackage.price + eloCost;
    }

    return selectedSubpackage.price;
  };

  // fetching games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // setLoading is already true, no need to set it again
        const response = await fetch("/api/games");
        if (!response.ok) {
          message.error("Can't fetch the games please reload to retry");
          // Keep loading false so user can see error and maybe a retry button
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (!data || data?.error) {
          message.error(
            data?.error || "something went wrong during games fetching"
          );
          setLoading(false); // Stop loading on error
          return;
        }

        setGames(data);
        if (data.length > 0) {
          setSelectedGame(data[0]);
        }
      } catch (error) {
        console.error("error fetching", error);
        message.error("Failed to fetch games.");
      } finally {
        setLoading(false); // Stop loading after success or failure
      }
    };

    fetchGames();
  }, []);

  const handleQuickPay = (subpackage: any) => {
    setSelectedSubpackage(subpackage);
    setIsModalOpen(true);
  };

  const handleCheckout = (subpackage: any) => {
    setSelectedSubpackage(subpackage);
    setIsCheckoutModalOpen(true);
  };
  const confirmCheckout = () => {
    if (!selectedSubpackage) return;
    if (!currentELO || !targetELO) {
      router.push(`/dashboard/customer/checkout/${selectedSubpackage.id}`);
    } else {
      router.push(
        `/dashboard/customer/checkout/${selectedSubpackage.id}?currentELO=${currentELO}&targetELO=${targetELO}`
      );
    }
  };
  const confirmQuickPay = async () => {
    if (!selectedSubpackage) return;

    setIsPaying(true);
    try {
      const response = await fetch("/api/quick-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subpackageId: selectedSubpackage.id,
          currentELO: selectedSubpackage.dynamicPricing
            ? currentELO
            : undefined,
          targetELO: selectedSubpackage.dynamicPricing ? targetELO : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        message.success("Payment successful! Redirecting to your order.");
        router.push(`/dashboard/customer/orders/${result.data.id}/pending`);
      } else {
        message.error(result.error || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Quick pay error:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsPaying(false);
      setIsModalOpen(false);
    }
  };

  // 3. Render the SkeletonLoader when loading is true
  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen p-6 pt-0">
      <div className="max-w-7xl h-full mx-auto">
        {/* Games Grid */}
        <div className="mb-2">
          <h2 className="text-3xl font-semibold text-white mb-12">
            Select Your Favourite Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {games.map((game, index) => (
              <div
                key={index}
                onClick={() => setSelectedGame(game)}
                className={`relative group cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  selectedGame?.name === game.name
                    ? "ring-4 ring-pink-800 shadow-2xl shadow-gray-500/50"
                    : "hover:shadow-xl shadow200-lg"
                }`}
              >
                <div className="relative overflow-hidden rounded-xl transition-colors aspect-[5/4]">
                  <SafeImage
                    src={game.image}
                    alt={game.name}
                    placeholder="/images/placeholder.png"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Dark overlay with more space for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 group-hover:from-black/80 group-hover:via-black/40"></div>

                  {/* Game info overlay with better spacing */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                      {game.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Game Packages */}
        {selectedGame && (
          <div className="my-16">
            <div className="flex items-center mb-8">
              <div className="relative w-20 h-20 mr-6 rounded-lg overflow-hidden">
                <SafeImage
                  src={selectedGame.image}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover"
                  placeholder="/images/placeholder.png"
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

            {selectedGame?.services && selectedGame?.services.length > 0 ? (
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
                  <div
                    style={{
                      padding: "1px",
                      background:
                        "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
                    }}
                    className="h-full rounded-lg"
                  >
                    <div className="rounded-lg  bg-[#b31d7c]">
                      <div className="">
                        <div className="flex flex-wrap gap-2 bg-gray-900/50 p-2 rounded-lg border border-gray-600">
                          {selectedGame?.services.map(
                            (service: any, index: any) => (
                              <button
                                key={index}
                                onClick={() => setSelectedServiceIndex(index)}
                                className={`px-6 py-3 rounded-md m-2 font-semibold cursor-pointer transition-all duration-200 ${
                                  selectedServiceIndex === index
                                    ? `group
                                    bg-gradient-to-r from-pink-500 gap-3 via-purple-500 to-cyan-400`
                                    : "text-gray-300 hover:text-white hover:bg-[#rgba(255, 255, 255, 0.15)]"
                                }`}
                              >
                                {service.name}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Package Category */}
                {selectedGame?.services[selectedServiceIndex] && (
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
                        {selectedGame?.services[selectedServiceIndex]?.name}
                      </h2>
                      <p className="my-2 text-gray-200 mb-6">
                        {
                          selectedGame?.services[selectedServiceIndex]
                            ?.description
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
                                Type
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
                            {selectedGame?.services[
                              selectedServiceIndex
                            ]?.subpackages.map((item: any, itemIndex: any) => (
                              <tr
                                key={itemIndex}
                                className=" transition-colors"
                              >
                                <td
                                  className={`py-5 px-4 text-[#E1E1E1] ${
                                    itemIndex !==
                                    selectedGame?.services[selectedServiceIndex]
                                      .subpackages.length -
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
                                    selectedGame?.services[selectedServiceIndex]
                                      .subpackages.length -
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
                                    selectedGame?.services[selectedServiceIndex]
                                      .subpackages.length -
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
                                  className={`py-5 px-4 text-center ${
                                    itemIndex !==
                                    selectedGame?.services[selectedServiceIndex]
                                      .subpackages.length -
                                      1
                                      ? "border-b border-white"
                                      : ""
                                  }`}
                                >
                                  {item?.dynamicPricing ? (
                                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                      <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                                      ELO-Based
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                      Fixed
                                    </span>
                                  )}
                                </td>
                                <td
                                  className={`py-5 px-4 text-[#E1E1E1] max-w-md ${
                                    itemIndex !==
                                    selectedGame?.services[selectedServiceIndex]
                                      .subpackages.length -
                                      1
                                      ? "border-b border-white"
                                      : ""
                                  }`}
                                >
                                  <p className="leading-relaxed">
                                    {item.description}
                                  </p>
                                </td>
                                <td
                                  className={`py-5 px-4 text-center ${
                                    itemIndex !==
                                    selectedGame?.services[selectedServiceIndex]
                                      .subpackages.length -
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
                                    onClick={() => handleQuickPay(item)}
                                  >
                                    QuickPay
                                  </button>
                                </td>
                                <td
                                  className={`py-5 px-4 text-center ${
                                    itemIndex !==
                                    selectedGame?.services[selectedServiceIndex]
                                      .subpackages.length -
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
                                    onClick={() => handleCheckout(item)}
                                  >
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
        )}
      </div>

      {/* Custom QuickPay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md mx-4">
            <div
              className="rounded-2xl p-1"
              style={{
                background:
                  "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
              }}
            >
              <div className="bg-[#5E2047] rounded-2xl p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3
                    className={`${orbitron.className} text-2xl font-bold text-white mb-2`}
                  >
                    Confirm Quick Pay
                  </h3>
                  <div
                    className="w-16 h-1 mx-auto rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%)",
                    }}
                  />
                </div>

                {/* Package Details */}
                {selectedSubpackage && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-600/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-300 text-sm">Package</span>
                        <span className="text-white font-semibold">
                          {selectedSubpackage.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-300 text-sm">
                          Base Price
                        </span>
                        <span className="text-green-400 font-bold text-lg">
                          ${selectedSubpackage.price}
                        </span>
                      </div>

                      {/* Dynamic Pricing ELO Sliders */}
                      {selectedSubpackage.dynamicPricing &&
                        selectedSubpackage.basePricePerELO && (
                          <div className="space-y-4 pt-3 border-t border-gray-600/50">
                            <div className="text-center">
                              <span className="text-cyan-400 text-sm font-medium">
                                Dynamic Pricing: +$
                                {selectedSubpackage.basePricePerELO}/ELO
                              </span>
                            </div>

                            {/* Current ELO Slider */}
                            <div>
                              <div className="flex justify-between text-sm text-gray-300 mb-2">
                                <span>Current ELO</span>
                                <span className="text-white font-semibold">
                                  {currentELO}
                                </span>
                              </div>
                              <input
                                type="range"
                                min={selectedSubpackage.minELO || 0}
                                max={selectedSubpackage.maxELO || 1000}
                                value={currentELO}
                                onChange={(e) =>
                                  setCurrentELO(Number(e.target.value))
                                }
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%)`,
                                }}
                              />
                            </div>

                            {/* Target ELO Slider */}
                            <div>
                              <div className="flex justify-between text-sm text-gray-300 mb-2">
                                <span>Target ELO</span>
                                <span className="text-white font-semibold">
                                  {targetELO}
                                </span>
                              </div>
                              <input
                                type="range"
                                min={selectedSubpackage.minELO || 0}
                                max={selectedSubpackage.maxELO || 1000}
                                value={targetELO}
                                onChange={(e) =>
                                  setTargetELO(Number(e.target.value))
                                }
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%)`,
                                }}
                              />
                            </div>

                            {/* ELO Difference and Additional Cost */}
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">
                                  ELO Difference
                                </span>
                                <span className="text-cyan-400 font-semibold">
                                  {Math.abs(targetELO - currentELO)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                  Additional Cost
                                </span>
                                <span className="text-cyan-400 font-semibold">
                                  $
                                  {(
                                    Math.abs(targetELO - currentELO) *
                                    selectedSubpackage.basePricePerELO
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Total Price */}
                      <div className="pt-3 border-t border-gray-600/50">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">
                            Total Price
                          </span>
                          <span className="text-green-400 font-bold text-xl">
                            ${calculateTotalPrice().toFixed(2)}
                          </span>
                        </div>
                        <div className="text-center text-gray-400 text-xs mt-1">
                          This amount will be deducted from your wallet balance
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmQuickPay}
                    disabled={isPaying}
                    className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
                    }}
                  >
                    {isPaying ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processing...
                      </div>
                    ) : (
                      "Confirm & Pay"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* modal for continue to checkout */}
      {/* Custom QuickPay Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCheckoutModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md mx-4">
            <div
              className="rounded-2xl p-1"
              style={{
                background:
                  "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
              }}
            >
              <div className="bg-[#5E2047] rounded-2xl p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3
                    className={`${orbitron.className} text-2xl font-bold text-white mb-2`}
                  >
                    Continue to Checkout
                  </h3>
                  <div
                    className="w-16 h-1 mx-auto rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%)",
                    }}
                  />
                </div>

                {/* Package Details */}
                {selectedSubpackage && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-600/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-300 text-sm">Package</span>
                        <span className="text-white font-semibold">
                          {selectedSubpackage.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-300 text-sm">
                          Base Price
                        </span>
                        <span className="text-green-400 font-bold text-lg">
                          ${selectedSubpackage.price}
                        </span>
                      </div>

                      {/* Dynamic Pricing ELO Sliders */}
                      {selectedSubpackage.dynamicPricing &&
                        selectedSubpackage.basePricePerELO && (
                          <div className="space-y-4 pt-3 border-t border-gray-600/50">
                            <div className="text-center">
                              <span className="text-cyan-400 text-sm font-medium">
                                Dynamic Pricing: +$
                                {selectedSubpackage.basePricePerELO}/ELO
                              </span>
                            </div>

                            {/* Current ELO Slider */}
                            <div>
                              <div className="flex justify-between text-sm text-gray-300 mb-2">
                                <span>Current ELO</span>
                                <span className="text-white font-semibold">
                                  {currentELO}
                                </span>
                              </div>
                              <input
                                type="range"
                                min={selectedSubpackage.minELO || 0}
                                max={selectedSubpackage.maxELO || 1000}
                                value={currentELO}
                                onChange={(e) =>
                                  setCurrentELO(Number(e.target.value))
                                }
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%)`,
                                }}
                              />
                            </div>

                            {/* Target ELO Slider */}
                            <div>
                              <div className="flex justify-between text-sm text-gray-300 mb-2">
                                <span>Target ELO</span>
                                <span className="text-white font-semibold">
                                  {targetELO}
                                </span>
                              </div>
                              <input
                                type="range"
                                min={selectedSubpackage.minELO || 0}
                                max={selectedSubpackage.maxELO || 1000}
                                value={targetELO}
                                onChange={(e) =>
                                  setTargetELO(Number(e.target.value))
                                }
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%)`,
                                }}
                              />
                            </div>

                            {/* ELO Difference and Additional Cost */}
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">
                                  ELO Difference
                                </span>
                                <span className="text-cyan-400 font-semibold">
                                  {Math.abs(targetELO - currentELO)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                  Additional Cost
                                </span>
                                <span className="text-cyan-400 font-semibold">
                                  $
                                  {(
                                    Math.abs(targetELO - currentELO) *
                                    selectedSubpackage.basePricePerELO
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Total Price */}
                      <div className="pt-3 border-t border-gray-600/50">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">
                            Total Price
                          </span>
                          <span className="text-green-400 font-bold text-xl">
                            ${calculateTotalPrice().toFixed(2)}
                          </span>
                        </div>
                        <div className="text-center text-gray-400 text-xs mt-1">
                          This amount will be deducted on the checkout
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCheckout}
                    disabled={isPaying}
                    className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
                    }}
                  >
                    {isPaying ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processing...
                      </div>
                    ) : (
                      "Continue to Checkout"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(90deg, #00c3ff 0%, #ffff1c 100%);
          cursor: pointer;
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(90deg, #00c3ff 0%, #ffff1c 100%);
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default GamesComponent;
