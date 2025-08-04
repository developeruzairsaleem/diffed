"use client";

import type React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard } from "lucide-react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { addFunds, confirmFundsAdded } from "@/actions/wallet";
import { useStore } from "@/store/useStore";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function AddFundsForm({
  handleAddShow,
  refreshWalletData,
}: {
  handleAddShow: (arg: boolean) => void;
  refreshWalletData: () => void;
}) {
  // local state
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // stripe elements
  const stripe = useStripe();
  const elements = useElements();

  // getting userid from zustand
  const store = useStore();
  const user = store.user;
  const id = user?.id;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const amountNum = Number.parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create payment intent
      const result = await addFunds(amountNum, id || "");

      // if something went wrong throw some error
      if (!result.success) {
        throw new Error(result.error);
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError } = await stripe.confirmCardPayment(
        result.clientSecret!,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Confirm funds added in our system
      const confirmResult = await confirmFundsAdded(
        result.paymentIntentId!,
        amountNum,
        id || ""
      );

      if (!confirmResult.success) {
        throw new Error(confirmResult.error);
      }
      handleSuccess("Funds added successfully!");
      refreshWalletData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add funds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ padding: "2px" }}
      className=" bg-gradient-to-r max-w-xl w-full rounded-xl from-pink-500 via-purple-500 to-cyan-400"
    >
      <div className="bg-[#3A0F2A] max-w-xl w-full rounded-xl">
        <Card className="w-full text-white  max-w-xl mx-auto">
          <CardHeader>
            {/* if the funds added successfully show the following message */}
            {showSuccess && (
              <Alert className="mb-6 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-500">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="h-7 w-7" />
              Add Funds
            </CardTitle>
            <CardDescription className="text-gray-200">
              Add money to your wallet using a credit or debit card
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="my-2" htmlFor="amount">
                  Amount (USD)
                </Label>
                <input
                  id="amount"
                  className="p-3 outline-none border border-white rounded-md w-full"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  value={amount}
                  autoComplete={"off"}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="my-2 mt-5">Card Details</Label>
                <div className="border rounded-md p-3 mt-1">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "white",
                          "::placeholder": {
                            color: "gray",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {error && (
                <Alert className="text-red-500" variant="destructive">
                  <AlertDescription className="text-red-500">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading || !stripe || !amount}
                  className="flex-1 cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add ${amount || "0.00"}
                </Button>
                <Button
                  className="cursor-pointer"
                  disabled={loading}
                  type="button"
                  variant="outline"
                  onClick={() => handleAddShow(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function FundsFormProvider({
  handleAddShow,
  refreshWalletData,
}: {
  handleAddShow: (arg: boolean) => void;
  refreshWalletData: () => void;
}) {
  return (
    <div
      onClick={() => handleAddShow(false)}
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
      }}
      className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center overflow-hidden"
    >
      <Elements stripe={stripePromise}>
        <AddFundsForm
          handleAddShow={handleAddShow}
          refreshWalletData={refreshWalletData}
        />
      </Elements>
    </div>
  );
}
