import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

export const POST = async (request: NextRequest) => {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const providerId = session.userId;

    const { amount } = await request.json();
    const payoutAmount = new Decimal(amount);

    if (!payoutAmount || payoutAmount.isNegative() || payoutAmount.isZero()) {
      return NextResponse.json(
        { error: "Invalid payout amount" },
        { status: 400 }
      );
    }

    // Use a Prisma transaction to ensure data integrity
    const newTransaction = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId: providerId as string },
      });

      if (!wallet) {
        throw new Error("Wallet not found.");
      }

      if (wallet.balance.lessThan(payoutAmount)) {
        throw new Error("Insufficient funds for payout.");
      }

      // Create a 'withdrawal' transaction with 'pending' status
      return await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: "withdrawal",
          amount: payoutAmount,
          description: "Payout Request",
          status: "pending", // An admin must approve this
        },
      });
    });

    return NextResponse.json({ success: true, data: newTransaction });
  } catch (error: any) {
    console.error("Error creating payout request:", error);
    if (
      error.message.includes("Insufficient funds") ||
      error.message.includes("Wallet not found")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create payout request." },
      { status: 500 }
    );
  }
};
