"use server";

import { stripe, formatAmountForStripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { updateWalletBalance, createTransaction } from "@/lib/wallet";
import { revalidatePath } from "next/cache";

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export async function addFunds(amount: number) {
  try {
    const supabase = createServerClient();

    // Get wallet ID
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", DEMO_USER_ID)
      .single();

    if (!wallet) throw new Error("Wallet not found");

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount),
      currency: "usd",
      metadata: {
        type: "wallet_deposit",
        user_id: DEMO_USER_ID,
        wallet_id: wallet.id,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Add funds error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add funds",
    };
  }
}

export async function confirmFundsAdded(
  paymentIntentId: string,
  amount: number
) {
  try {
    const supabase = createServerClient();

    // Get wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", DEMO_USER_ID)
      .single();

    if (!wallet) throw new Error("Wallet not found");

    // Update wallet balance
    await updateWalletBalance(DEMO_USER_ID, amount, "add");

    // Create transaction record
    await createTransaction(
      wallet.id,
      "deposit",
      amount,
      `Funds added via Stripe`,
      paymentIntentId
    );

    revalidatePath("/wallet");
    return { success: true };
  } catch (error) {
    console.error("Confirm funds error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to confirm funds",
    };
  }
}

export async function withdrawFunds(
  amount: number,
  accountNumber: string,
  routingNumber: string
) {
  try {
    const supabase = createServerClient();

    // Get wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", DEMO_USER_ID)
      .single();

    if (!wallet) throw new Error("Wallet not found");

    // Update wallet balance (subtract)
    await updateWalletBalance(DEMO_USER_ID, amount, "subtract");

    // Create transaction record
    await createTransaction(
      wallet.id,
      "withdrawal",
      amount,
      `Withdrawal to account ending in ${accountNumber.slice(-4)}`,
      undefined,
      { accountNumber: accountNumber.slice(-4), routingNumber }
    );

    revalidatePath("/wallet");
    return { success: true };
  } catch (error) {
    console.error("Withdraw funds error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to withdraw funds",
    };
  }
}

export async function processCheckout(
  items: any[],
  paymentMethod: "wallet" | "card",
  cardPaymentIntentId?: string
) {
  try {
    const supabase = createServerClient();

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Get wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", DEMO_USER_ID)
      .single();

    if (!wallet) throw new Error("Wallet not found");

    if (paymentMethod === "wallet") {
      // Pay with wallet balance
      await updateWalletBalance(DEMO_USER_ID, total, "subtract");

      await createTransaction(
        wallet.id,
        "payment",
        total,
        `Purchase: ${items.map((i) => i.name).join(", ")}`,
        undefined,
        { items, paymentMethod: "wallet" }
      );
    } else {
      // Pay with card - payment already processed via Stripe
      await createTransaction(
        wallet.id,
        "payment",
        total,
        `Purchase: ${items.map((i) => i.name).join(", ")}`,
        cardPaymentIntentId,
        { items, paymentMethod: "card" }
      );
    }

    revalidatePath("/wallet");
    return { success: true };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process checkout",
    };
  }
}

export async function createCheckoutPaymentIntent(amount: number) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount),
      currency: "usd",
      metadata: {
        type: "checkout_payment",
        user_id: DEMO_USER_ID,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Create checkout payment intent error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create payment intent",
    };
  }
}
