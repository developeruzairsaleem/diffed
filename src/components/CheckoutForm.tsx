"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@radix-ui/react-form";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { poppins, lato } from "@/fonts/fonts";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  discordTag: z.string().optional(),
  preferences: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CheckoutFormProps {
  onPaymentSuccess?: (paymentMethodId: string) => void;
  subpackageId: string | string[] | undefined;
}

export default function CheckoutForm({
  onPaymentSuccess,
  subpackageId,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Remove CardElement usage and add refs for each Stripe element
  const [cardError, setCardError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setCardError("Card number element not found");
      setLoading(false);
      return;
    }
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: data.name,
          email: data.email,
        },
      });
    if (stripeError) {
      setCardError(stripeError.message || "Payment error");
      setLoading(false);
      return;
    }
    setLoading(false);
    if (onPaymentSuccess && paymentMethod) {
      onPaymentSuccess(paymentMethod.id);
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
            Name / Username
          </FormLabel>
          <FormControl asChild>
            <input
              className={`w-full px-3 py-3 rounded  border border-white  text-[18px] text-white  focus:outline-none ${lato.className}`}
              {...register("name")}
            />
          </FormControl>
          <FormMessage className="text-pink-500 text-sm mt-1">
            {errors.name?.message}
          </FormMessage>
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
          <FormMessage className="text-pink-500 text-sm mt-1">
            {errors.discordTag?.message}
          </FormMessage>
        </FormField>

        <FormField name="preferences" className="mb-6">
          <FormLabel className="block mb-2 text-[16px] text-white">
            Preferences / Notes (Optional)
          </FormLabel>
          <FormControl asChild>
            <input
              className={`w-full px-3 py-3 rounded border border-white text-[18px] text-white focus:outline-none  ${lato.className}`}
              type="text"
              {...register("preferences")}
            />
          </FormControl>
          <FormMessage className="text-pink-500 text-sm mt-1">
            {errors.preferences?.message}
          </FormMessage>
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
            Cardholder name
          </FormLabel>
          <FormControl asChild>
            <input
              className={`w-full px-3 py-3 rounded border border-white text-[18px] text-white focus:outline-none  ${lato.className}`}
              type="text"
              {...register("preferences")}
            />
          </FormControl>
          <FormMessage className="text-pink-500 text-sm mt-1">
            {errors.preferences?.message}
          </FormMessage>
        </FormField>
        <button
          type="submit"
          className=" py-6 text-center w-full rounded bg-gradient-to-r from-[#EE2C81]  via-[#58B9E3] to-[#F79FC5] hover:scale-105 transition-all cursor-pointer text-white text-[24px] mt-16 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : "Subscribe"}
        </button>
      </div>
    </Form>
  );
}
