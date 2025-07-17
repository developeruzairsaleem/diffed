import { createServerClient } from "./supabase";

export async function getWalletBalance(userId: string) {
  const supabase = createServerClient();

  const { data: wallet, error } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return wallet?.balance || 0;
}

export async function updateWalletBalance(
  userId: string,
  amount: number,
  type: "add" | "subtract"
) {
  const supabase = createServerClient();

  const currentBalance = await getWalletBalance(userId);
  const newBalance =
    type === "add" ? currentBalance + amount : currentBalance - amount;

  if (newBalance < 0) {
    throw new Error("Insufficient funds");
  }

  const { error } = await supabase
    .from("wallets")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) throw error;
  return newBalance;
}

export async function createTransaction(
  walletId: string,
  type: string,
  amount: number,
  description: string,
  stripePaymentIntentId?: string,
  metadata?: any
) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      wallet_id: walletId,
      type,
      amount,
      description,
      stripe_payment_intent_id: stripePaymentIntentId,
      metadata,
      status: "completed",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
