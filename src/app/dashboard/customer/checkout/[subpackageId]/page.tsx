"use client";
import { lato, orbitron, poppins } from "@/fonts/fonts";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@radix-ui/react-form";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import WhiteLoader from "@/components/ui/WhiteLoader";
import OverlayLoader from "@/components/ui/OverlayLoader";
import { useStore } from "@/store/useStore";
import { Router } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { message } from "antd";

// schema for the order
const schema = z.object({
  username: z.string().min(1, "Enter your Discord Username is required"),
  discordTag: z.string().min(1, "Enter Discord tag"),
  notes: z.string().optional(),
  cardholderName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CheckoutFormProps {
  onPaymentSuccess?: (paymentMethodId: string) => void;
  subpackage: any;
  clientSecret: string;
}

function CheckoutForm({
  onPaymentSuccess,
  clientSecret,
  subpackage,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, submitCount, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched", // or "onChange" for live validation
    defaultValues: {
      username: "",
      discordTag: "",
      notes: "",
      cardholderName: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setCardError(null);
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      setLoading(false);
      return;
    }

    if (!clientSecret) {
      setError(
        "Payment could not be initialized. Please refresh and try again."
      );
      setLoading(false);
      return;
    }

    // Confirm the card payment
    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setCardError("Card number element not found");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: stripeError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: data.cardholderName,
          },
        },
      });

    if (stripeError) {
      console.log(stripeError);
      setCardError(stripeError.message || "Payment error");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, now create the order and transaction in your backend
      try {
        message.success("Payment succeeded");
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subpackageId: subpackage.id,
            paymentIntentId: paymentIntent.id,
            discordTag: data.discordTag,
            notes: data.notes,
            discordUsername: data.username,
          }),
        });
        const orderJson = await orderRes.json();
        if (!orderJson.success) {
          setError(
            orderJson.error || "Order creation failed. Please contact support."
          );
          setLoading(false);
          return;
        }
        console.log(orderJson);
        router.push(`/dashboard/customer/orders/${orderJson.data}`); // Redirect or show success
      } catch (err) {
        setError("Order creation failed. Please try again or contact support.");
        setLoading(false);
        message.error("Order Creation was not successful");
      }
    } else {
      setError("Payment was not successful. Please try again.");
      setLoading(false);
      message.error("Payment was not successful");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full block lg:p-8 rounded-lg "
    >
      <div className="">
        <h3 className={`${poppins.className} w-full text-[24px] mb-8`}>
          Contact information
        </h3>
        <FormField name="name" className="mb-6">
          <FormLabel className="block text-white mb-2 text-[16px] ">
            Name / Username (Discord)
          </FormLabel>
          <FormControl asChild>
            <input
              className={`w-full px-3 py-3 rounded  border border-white  text-[18px] text-white  focus:outline-none ${lato.className}`}
              {...register("username")}
            />
          </FormControl>
          {(touchedFields.username || submitCount > 0) &&
            errors.username?.message && (
              <FormMessage className="text-pink-500 text-sm mt-1">
                {errors.username.message}
              </FormMessage>
            )}
        </FormField>
        <FormField name="discordTag" className="mb-6">
          <FormLabel className="block mb-2 text-[16px] text-white">
            Discord Tag
          </FormLabel>
          <FormControl asChild>
            <input
              className={`w-full px-3 py-3 rounded border border-white text-[18px] text-white focus:outline-none  ${lato.className}`}
              type="text"
              {...register("discordTag")}
            />
          </FormControl>
          {(touchedFields.discordTag || submitCount > 0) &&
            errors.discordTag?.message && (
              <FormMessage className="text-pink-500 text-sm mt-1">
                {errors.discordTag.message}
              </FormMessage>
            )}
        </FormField>

        <FormField name="notes" className="mb-6">
          <FormLabel className="block mb-2 text-[16px] text-white">
            Preferences / Notes (Optional)
          </FormLabel>
          <FormControl asChild>
            <input
              className={`w-full px-3 py-3 rounded border border-white text-[18px] text-white focus:outline-none  ${lato.className}`}
              type="text"
              {...register("notes")}
            />
          </FormControl>
          {(touchedFields.notes || submitCount > 0) &&
            errors.notes?.message && (
              <FormMessage className="text-pink-500 text-sm mt-1">
                {errors.notes.message}
              </FormMessage>
            )}
        </FormField>
        {/* Card Number */}

        <h3 className={`${poppins.className} mt-24 text-[24px] mb-8`}>
          Payment method
        </h3>
        <div className="block mb-2 text-[18px] text-white">
          Card information
        </div>
        <div className="border border-white rounded-lg">
          <FormField name="cardNumber" className="">
            <FormControl asChild>
              <div className="w-full  border-b border-white text-[18px] text-white bg-transparent focus-within:ring-2 focus-within:ring-pink-500 px-5 py-5">
                <CardNumberElement
                  options={{
                    style: {
                      base: {
                        color: "#fff",
                        fontFamily: lato.className,
                        fontSize: "18px",
                        "::placeholder": { color: "#fff8" },
                      },
                      invalid: { color: "#ff6b81" },
                    },
                  }}
                  onChange={(e) => {
                    if (e.error) setCardError(e.error.message || "");
                    else setCardError(null);
                  }}
                />
              </div>
            </FormControl>
          </FormField>
          {/* Expiry */}
          <div className="flex w-full">
            <FormField name="cardExpiry" className="w-1/2">
              <FormControl asChild>
                <div
                  className={`w-full px-5 py-5 rounded text-[18px] text-white bg-transparent ${lato.className}`}
                >
                  <CardExpiryElement
                    options={{
                      style: {
                        base: {
                          color: "#fff",
                          fontFamily: lato.className,
                          fontSize: "18px",
                          "::placeholder": { color: "#fff8" },
                        },
                        invalid: { color: "#ff6b81" },
                      },
                    }}
                    onChange={(e) => {
                      if (e.error) setCardError(e.error.message || "");
                      else setCardError(null);
                    }}
                  />
                </div>
              </FormControl>
            </FormField>
            {/* CVC */}
            <FormField name="cardCvc" className="w-1/2">
              <FormControl asChild>
                <div className="w-full px-5 py-5 rounded text-[18px] text-white bg-transparent focus-within:ring-2 focus-within:ring-pink-500">
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          color: "#fff",
                          fontFamily: lato.className,
                          fontSize: "18px",
                          "::placeholder": { color: "#fff8" },
                        },
                        invalid: { color: "#ff6b81" },
                      },
                    }}
                    onChange={(e) => {
                      if (e.error) setCardError(e.error.message || "");
                      else setCardError(null);
                    }}
                  />
                </div>
              </FormControl>
            </FormField>
          </div>
        </div>
        {(error || cardError) && (
          <div className="text-pink-500 mb-4 text-sm">{error || cardError}</div>
        )}

        <FormField name="cardholderName" className="mb-6">
          <FormLabel className="block mb-3 mt-8 text-[16px] text-white">
            Cardholder name (Optional)
          </FormLabel>
          <FormControl asChild>
            <input
              className={`w-full px-3 py-3 rounded border border-white text-[18px] text-white focus:outline-none  ${lato.className}`}
              type="text"
              {...register("cardholderName")}
            />
          </FormControl>
          {(touchedFields.cardholderName || submitCount > 0) &&
            errors.cardholderName?.message && (
              <FormMessage className="text-pink-500 text-sm mt-1">
                {errors.cardholderName.message}
              </FormMessage>
            )}
        </FormField>
        <button
          type="submit"
          className="py-6 text-center w-full bg-gradient-to-r rounded-full  from-pink-500 via-purple-400  to-cyan-400 to- hover:scale-105 transition-all cursor-pointer text-white text-[24px] mt-16 disabled:opacity-50"
          disabled={!isValid || loading || isSubmitting}
        >
          {loading || isSubmitting ? "Processing..." : "Subscribe"}
        </button>
      </div>
    </Form>
  );
}
// --------------
// checkout Page
// --------------
export default function CheckoutPage() {
  const params = useParams();
  const subpackageId = params?.subpackageId;
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [subpackage, setSubpackage] = useState({});
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
        const response = await fetch(
          `/api/create-payment-intent?subpackageId=${subpackageId}&email=${store.user?.email}`,
          { method: "GET" }
        );
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
                <li>$0</li>
                {/* @ts-ignore */}
                <li>${subpackage.price}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="form w-full mt-20 lg:mt-0 lg:ml-10 lg:justify-self-start xl:justify-self-end ">
          {clientSecret && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                subpackage={subpackage}
                clientSecret={clientSecret}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
