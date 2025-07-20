"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface AddFundsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function AddFundsForm({ onSuccess, onCancel }: AddFundsFormProps) {
  // local state
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // stripe elements
  const stripe = useStripe();
  const elements = useElements();

  // getting userid from zustand
  const store = useStore();
  console.log("store", store);
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
      const result = await addFunds(amountNum, id);

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
        id
      );

      if (!confirmResult.success) {
        throw new Error(confirmResult.error);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add funds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full text-black max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Add Funds
        </CardTitle>
        <CardDescription>
          Add money to your wallet using a credit or debit card
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Card Details</Label>
            <div className="border rounded-md p-3 mt-1">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !stripe}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add ${amount || "0.00"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface AddFundsProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddFunds({ onSuccess, onCancel }: AddFundsProps) {
  return (
    <Elements stripe={stripePromise}>
      <AddFundsForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}
