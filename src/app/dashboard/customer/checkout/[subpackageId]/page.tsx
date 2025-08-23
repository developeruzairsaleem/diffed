"use client";
import { lato, orbitron, poppins } from "@/fonts/fonts";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import WhiteLoader from "@/components/ui/WhiteLoader";
import OverlayLoader from "@/components/ui/OverlayLoader";
import { useStore } from "@/store/useStore";
import SafeImage from "@/components/ui/SafeImage";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subpackageId = params?.subpackageId;
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [currentELO, setCurrentELO] = useState(0);
  const [targetELO, setTargetELO] = useState(0);
  const [subpackage, setSubpackage] = useState({});
  const [finalPrice, setFinalPrice] = useState(0);
  const router = useRouter();
  const store = useStore();
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  // Improved loading and fetch logic
  useEffect(() => {
    // Only fetch if email is available just checking for loggedin status
    if (!store.user?.email) return;

    async function fetchPackageAndCreateIntent() {
      setLoading(true);
      try {
        const currentELO = Number(searchParams?.get("currentELO"));
        const targetELO = Number(searchParams?.get("targetELO"));
        let response;
        if (!currentELO && !targetELO) {
          response = await fetch(
            `/api/create-payment-intent?subpackageId=${subpackageId}&email=${store.user?.email}`,
            { method: "GET" }
          );
        } else {
          response = await fetch(
            `/api/create-payment-intent?subpackageId=${subpackageId}&email=${store.user?.email}&currentELO=${currentELO}&targetELO=${targetELO}`,
            { method: "GET" }
          );
        }
        const intentResponse = await response.json();
        if (!intentResponse?.success) {
          setPageError(
            intentResponse?.error || "Server responded with an error"
          );
          setLoading(false);
          return;
        }
        setClientSecret(intentResponse.data.clientSecret);
        setSubpackage(intentResponse.data.subpackage);
        if (intentResponse.data.currentELO || intentResponse.data.targetELO) {
          setCurrentELO(intentResponse.data.currentELO);
          setTargetELO(intentResponse.data.targetELO);
          setFinalPrice(intentResponse.data.finalPrice);
        }
      } catch (error) {
        console.error(error);
        setPageError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchPackageAndCreateIntent();
  }, [store.user?.email, subpackageId]);

  // Show loader if loading or email is not yet available
  if (loading || !store.user?.email) {
    return <OverlayLoader />;
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl text-white font-bold mb-4">
          Something went wrong
        </h1>
        <p className="mb-6 text-gray-100">Please try again or go back.</p>
        <button
          onClick={() => router.back()}
          className="px-8 py-3 bg-gradient-to-r  from-pink-500 via-purple-400 to-cyan-400 transition-all text-white rounded hover:scale-105"
        >
          Go Back
        </button>
      </div>
    );
  }

  //-----------------------------
  // rendering the return response
  //---------------------------
  return (
    <div className="Checkout p-8 max-w-[1300px] justify-between mx-auto w-full ">
      <div className="flex items-center xs:gap-14 gap-4 ">
        <img
          width={"20px"}
          src="/images/leftarrow.png"
          alt="back icon"
          onClick={() => router.back()}
        />
        <h2
          className={`uppercase text-[30px] ${orbitron.className} font-bold text-3xl`}
        >
          Diffed.gg
        </h2>
      </div>

      <div className="w-full lg:grid lg:grid-cols-2">
        <div className="data mt-20">
          {/* card for package info */}
          <div
            className="card w-full mx-auto xl:w-[90%] rounded-lg min-h-[370px] overflow-hidden relative"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          >
            <SafeImage
              // @ts-ignore
              src={subpackage.service.game.image as string | undefined}
              placeholder="/images/placeholder.png"
              alt="Checkout subpackage image"
              className="absolute top-0 w-full h-full -z-1 right-0  fade-mask-ltr object-cover"
            />
            <div className="pl-4 mt-16">
              <h3
                className={`bg-gradient-to-r uppercase font-bold text-[27px] inline from-[#EE2C81] via-[#FE0FD0] to-[#58B9E3] bg-clip-text text-transparent tracking-wide leading-tight ${orbitron.className}`}
              >
                {/* @ts-ignore */}
                {subpackage?.service?.game?.name}
              </h3>
              <h3
                className={`${orbitron.className} uppercase text-[27px] text-white font-bold tracking-wide leading-tight`}
              >
                Subscription
              </h3>
            </div>
            <div
              className={`benifits mt-5 pl-4 text-[24px] list-disc list-inside ${lato.className} font-[400]`}
              style={{ lineHeight: "200%" }}
            >
              {/* @ts-ignore */}
              <div>{subpackage.name}</div>
            </div>
          </div>

          {(currentELO || targetELO) && (
            <div className="sm:pl-6 text-[22px] my-7">
              <div className="mb-4">Current ELO: {currentELO}</div>
              <div>Target ELO: {targetELO}</div>
            </div>
          )}

          {/* Price breakdown info */}
          <div className="sm:pl-6 text-[24px] mt-12">
            <h4 className="mb-6">Price Breakdown:</h4>
            <div className="flex justify-between w-[20rem]">
              <ul className="pl-5 list-disc" style={{ lineHeight: "230%" }}>
                <li>Base Service:</li>
                <li>Add-Ons:</li>
                <li>Total:</li>
              </ul>
              <ul style={{ lineHeight: "230%" }}>
                {/* @ts-ignore */}
                <li>${subpackage.price}</li>
                <li>
                  {/* @ts-ignore */}$
                  {currentELO || targetELO ? finalPrice - subpackage.price : 0}
                </li>
                <li>
                  {/* @ts-ignore */}$
                  {currentELO || targetELO ? finalPrice : subpackage.price}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="form w-full mt-20 lg:mt-0 lg:ml-10 lg:justify-self-start xl:justify-self-end ">
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
              currency: "USD",
            }}
          >
            {clientSecret && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  currentELO={currentELO}
                  targetELO={targetELO}
                  subpackage={subpackage}
                  finalPrice={finalPrice}
                  clientSecret={clientSecret}
                />
              </Elements>
            )}
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}
