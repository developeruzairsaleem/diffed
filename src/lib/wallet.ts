import { TransactionType } from "@/generated/prisma";
import { prisma } from "./prisma";
import { Decimal } from "@prisma/client/runtime/library"; // or from "decimal.js" if you use that

export async function getWalletBalance(userId: string) {
  // get wallet balance from db
  const wallet = await prisma.wallet.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!wallet) throw Error("Wallet not found for balane extraction");
  return wallet?.balance || 0;
}

export async function updateWalletBalance(
  userId: string,
  amount: number,
  type: "add" | "subtract"
) {
  const currentBalance = await getWalletBalance(userId);

  const newBalance: Decimal =
    type === "add"
      ? (currentBalance as Decimal).add(amount)
      : (currentBalance as Decimal).sub(amount);

  if (newBalance.lessThan(0)) {
    throw new Error("Insufficient funds");
  }

  console.log("new balance", newBalance);

  const updatedWallet = await prisma.wallet.update({
    where: {
      userId: userId,
    },
    data: {
      balance: newBalance,
      updatedAt: new Date(),
    },
  });
  if (!updatedWallet) throw Error("Can't update wallet with new balance");
  return { success: true, wallet: updatedWallet };
}

export async function createTransaction(
  walletId: string,
  type: TransactionType,
  amount: number,
  description: string,
  stripePaymentIntentId?: string,
  metadata?: any
) {
  const newTransaction = await prisma.transaction.create({
    data: {
      walletId,
      type,
      amount,
      description,
      stripePaymentIntentId,
      metadata,
      status: "completed",
    },
  });

  if (!newTransaction) throw Error("Failed to create a transaction in db");
  return { data: newTransaction };
}

// creating a wallet for users
export async function createWallet(userId: string) {
  const userWallet = await prisma.wallet.create({
    data: { userId },
  });

  if (!userWallet) throw Error("Wallet creation failed");

  return userWallet;
}

// getting the user wallet

export async function getWallet(userId: string) {
  const wallet = await prisma.wallet.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!wallet) {
    throw Error("Cant find the wallet for current user");
  }

  return wallet;
}
