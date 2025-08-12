"use client";
import React, { useState, useEffect } from "react";
import SliderComponent from "@/components/slider/Slider";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "antd";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MatchMakingReview = () => {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params!.assignmentId as string;
  const orderId = params!.id as string;

  const [assignmentReview, setAssignmentReview] = useState<null | any>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [gamePlay, setGamePlay] = useState([50]);
  const [communication, setCommunication] = useState([50]);
  const [attitude, setAttitude] = useState([50]);
  const [tipAmount, setTipAmount] = useState(0);
  const [review, setReview] = useState<string>("");
  const [customAmount, setCustomAmount] = useState(0);
  const [providerId, setProviderId] = useState("");

  const fetchAssignment = async () => {
    try {
      const response = await fetch(
        `/api/orders/${orderId}/assignments/${assignmentId}/review`
      );
      const data = await response.json();
      if (data.success) {
        setAssignmentReview(data.data);
        setGamePlay([data.data.gamePlay]);
        setCommunication([data.data.communication]);
        setAttitude([data.data.attitude]);
        setProviderId(data.data.providerId);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  // const handleSave = async () => {
  //   try {
  //     setIsProcessing(true);
  //     const res = await fetch(`/api/orders/${orderId}/assignments/${assignmentId}/review`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         gamePlay: gamePlay[0],
  //         communication: communication[0],
  //         attitude: attitude[0],
  //         reviewText: review,
  //         tipAmount,
  //       })
  //     });
  //     const data = await res.json();

  //     if (data.success) {
  //       console.log('Saved successfully:', data);
  //     } else {
  //       console.error('Save failed:', data.error);
  //     }
  //   } catch (err) {
  //     console.error('Error saving')
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      if (review === "") {
        toast.error("Kindly write some review");
        return;
      }
      const res = await fetch(
        `/api/orders/${orderId}/assignments/${assignmentId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gamePlay: gamePlay[0],
            communication: communication[0],
            attitude: attitude[0],
            reviewText: review,
            tipAmount: customAmount > 0 ? customAmount : tipAmount,
            providerId,
          }),
        }
      );
      const data = await res.json();

      if (data.success) {
        toast.success(
          tipAmount || customAmount
            ? "Review and tip sent successfully!"
            : "Review updated successfully!"
        );
        router.push(`/dashboard/customer/orders/${orderId}`);
        router;
      } else {
        toast.error(data.error || "Failed to save review");
      }
    } catch (err) {
      console.error("Error saving:", err);
      toast.error("Error saving review");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // page
    <div className="w-full px-[1.25rem] sm:px-[1.875rem] md:px-[3.5625rem] py-[6.25rem] sm:py-[7.5rem] md:py-[9.375rem] lg:py-[4rem]">
      {/* main content container */}
      <div className="flex flex-col gap-[3rem] md:gap-[4.5rem] xl:gap-[6rem] justify-stretch items-center w-full">
        <div className="flex flex-col md:flex-row gap-[2.5rem] md:gap-[2rem] xl:gap-[4.75rem] w-full justify-center items-stretch">
          {/* RATE THE PRO */}
          <div className="w-full sm:min-w-[24.9375rem] h-fit md:h-auto gap-[1.25rem] md:w-[39.1875rem] flex flex-col  md:gap-[3.125rem] px-[0.9375rem] md:px-[2.1875rem] py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 backdrop-blur-[3.125rem] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5 text-center justify-between border-[3px] border-white/40 rounded-lg">
            <div>
              <p className="uppercase md:text-[1.6875rem] tracking-wide font-[700] font-[orbitron] ">
                <span className="bg-gradient-to-r from-[#EE2C81] via-[#FE0FD0] to-[#58B9E3] bg-clip-text text-transparent">
                  Rate{" "}
                </span>
                the pro
              </p>
            </div>

            {assignmentReview && (
              <div className="flex flex-col items-start text-left gap-[1.25rem] lg:gap-[1.9375rem] capitalize w-full">
                <div className="flex flex-col gap-[0.4rem] md:gap-[1rem] w-full">
                  <p className="text-[1.25rem] font-[700] ">Game Play</p>
                  <SliderComponent
                    value={gamePlay}
                    onChange={(val) => setGamePlay(val)}
                  />
                </div>

                <div className="flex flex-col gap-[0.4rem] md:gap-[1rem] w-full">
                  <p className="text-[1.25rem] font-[700] ">communication</p>
                  <SliderComponent
                    value={communication}
                    onChange={(val) => setCommunication(val)}
                  />
                </div>

                <div className="flex flex-col gap-[0.4rem] md:gap-[1rem] w-full">
                  <p className="text-[1.25rem] font-[700] ">attitude</p>
                  <SliderComponent
                    value={attitude}
                    onChange={(val) => setAttitude(val)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* TIP SECTION */}
          <div
            className="w-full sm:min-w-[24.9375rem] h-fit md:h-auto gap-[1.25rem] md:w-[39.1875rem] flex flex-col md:gap-[3.125rem] 
            px-[1rem] py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 sm:px-[1.5rem] md:px-[2.7rem] lg:px-[3.5rem] xl:px-[4.75rem] backdrop-blur-[3.125rem] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5 text-center justify-between border-[3px] border-white/40 rounded-lg"
          >
            <div>
              <p className="uppercase md:text-[1.6875rem] tracking-wide font-[700] font-[orbitron] ">
                <span className="bg-gradient-to-r from-[#EE2C81] via-[#FE0FD0] to-[#58B9E3] bg-clip-text text-transparent">
                  TIP{" "}
                </span>
                section
              </p>
            </div>

            <div className="grid grid-cols-2  gap-[0.625rem] md:gap-[1.25rem] xl:gap-[1.875rem] 2xl:gap-[2.5rem] capitalize w-full font-[poppins] justify-start">
              <div
                onClick={() => {
                  setTipAmount(1);
                  setCustomAmount(0);
                }}
                className={`px-[1.25rem] sm:px-[1.875rem] md:px-[3.125rem] lg:px-[4.375rem] xl:px-[5.9375rem] py-[0.375rem] sm:py-[0.5rem] md:py-[0.75rem] text-center ${
                  tipAmount === 1 ? `bg-[#1fa6c2] scale-[0.9]` : `bg-[#46D9F7] `
                }  rounded-[0.473125rem]`}
              >
                <p className="md:text-[2.5rem] font-[400]  ">1$</p>
              </div>
              <div
                onClick={() => {
                  setTipAmount(3);
                  setCustomAmount(0);
                }}
                className={`px-[1.25rem] sm:px-[1.875rem] md:px-[3.125rem] lg:px-[4.375rem] xl:px-[5.9375rem] py-[0.375rem] sm:py-[0.5rem] md:py-[0.75rem] text-center  ${
                  tipAmount === 3
                    ? `bg-[#c73474] scale-[0.97]`
                    : `bg-[#F54190] `
                } rounded-[0.473125rem]`}
              >
                <p className="md:text-[2.5rem] font-[400]  ">3$</p>
              </div>
              <div
                onClick={() => {
                  setTipAmount(4);
                  setCustomAmount(0);
                }}
                className={`px-[1.25rem] sm:px-[1.875rem] md:px-[3.125rem] lg:px-[4.375rem] xl:px-[5.9375rem] py-[0.375rem] sm:py-[0.5rem] md:py-[0.75rem] text-center  ${
                  tipAmount === 4
                    ? `bg-[#b030c7] scale-[0.97]`
                    : `bg-[#DF3FFC] `
                } rounded-[0.473125rem]`}
              >
                <p className="md:text-[2.5rem] font-[400]  ">4$</p>
              </div>
              <div
                onClick={() => {
                  setTipAmount(5);
                  setCustomAmount(0);
                }}
                className={`px-[1.25rem] sm:px-[1.875rem] md:px-[3.125rem] lg:px-[4.375rem] xl:px-[5.9375rem] py-[0.375rem] sm:py-[0.5rem] md:py-[0.75rem] text-center ${
                  tipAmount === 5
                    ? `bg-[#28bf76] scale-[0.97]`
                    : `bg-[#37FA9C] `
                } rounded-[0.473125rem]`}
              >
                <p className="md:text-[2.5rem] font-[400]  ">5$</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-[2.5rem] md:gap-[2rem] xl:gap-[4.75rem] w-full justify-center items-stretch">
          {/* REVIEW  */}
          <div className="flex flex-row justify-start items-start w-full sm:min-w-[24.9375rem] h-fit md:h-auto gap-[1.25rem] md:w-[39.1875rem]  gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
            <div className="relative flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mx-0">
              <Image
                src="/images/matchingReview.svg"
                alt="arrow-left"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, (max-width: 1024px) 80px, (max-width: 1280px) 96px, 112px"
                priority
              />
            </div>
            <div className="bg-[#232323] text-white w-full px-2 sm:px-4 md:px-6 rounded-xl font-normal">
              <textarea
                placeholder="Write a few words about your experience."
                className="bg-transparent border-none outline-none text-white w-full text-base sm:text-lg md:text-xl p-2 sm:p-3 font-normal resize-none min-h-[100px] sm:min-h-[120px] md:min-h-[150px]"
                style={{ minHeight: "100px" }}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </div>

          {/* custom account */}
          <div className="w-full sm:min-w-[24.9375rem] h-fit md:h-auto gap-[1.25rem] md:w-[39.1875rem]   flex flex-col gap-[1.25rem] md:gap-[3.75rem] px-4 py-4 sm:px-6 sm:py-6 md:px-[3.25rem] md:pb-[3.75rem] md:pt-[1.25rem] backdrop-blur-[3.125rem] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5 text-left border-[3px] border-white/40 rounded-lg">
            <div className="text-left">
              <p className="uppercase text-base sm:text-lg md:text-[1.6875rem] tracking-wide font-[700] font-[orbitron] text-left ">
                Loved your experience? Show some love and tip your pro!
              </p>
            </div>

            {/* <input alt='tip' type='number' className="px-4 py-2 sm:px-8 sm:py-3 md:px-[4.125rem] md:py-[1.125rem] capitalize text-white font-bold rounded-[0.473125rem] text-base sm:text-lg md:text-[1.5rem] font-[400] border border-white/30" placeholder="Enter custom amount" /> */}
            <input
              alt="tip"
              type="number"
              className="px-4 py-2 sm:px-8 sm:py-3 md:px-[4.125rem] md:py-[1.125rem] capitalize text-white font-bold rounded-[0.473125rem] text-base sm:text-lg md:text-[1.5rem] font-[400] border border-white/30"
              placeholder="Enter custom amount"
              value={customAmount === 0 ? "" : customAmount} // Bind input value to tipAmount, show empty string if 0
              onChange={(e) => {
                const value = e.target.value;
                setCustomAmount(value === "" ? 0 : parseFloat(value));
                setTipAmount(0);
                // Update tipAmount, handle empty input as 0
              }}
              min="0" // Prevent negative values
              style={{
                WebkitAppearance: "none", // For WebKit browsers
                MozAppearance: "textfield", // For Firefox
                appearance: "none", // Standard syntax
              }}
            />
          </div>
        </div>

        <div className="self-end">
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="relative shadow-lg pr-4 pl-2  py-2 sm:pr-8 sm:pl-4 md:pl-[2.5rem]  sm:py-3 md:pr-[4.125rem]  md:py-[1.125rem] capitalize bg-[linear-gradient(90deg,_#EE2C81_0%,_#FE0FD0_60%,_#58B9E3_100%)] text-white font-bold rounded-[0.473125rem] text-base sm:text-lg md:text-[1.5rem] font-[400] flex gap-2 items-center"
          >
            {isProcessing ? (
              <>
                <div className="absolute inset-0 bg-black/20 rounded-[0.473125rem]" />
                <Loader2 className="w-8 h-8 mr-2 animate-spin" />
              </>
            ) : (
              <Check className="w-8 h-8 mr-2" />
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchMakingReview;
