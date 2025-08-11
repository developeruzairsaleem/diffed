import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const valid = ["pending", "completed", "failed", "cancelled"] as const;
    if (!status || !valid.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const existing = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: { wallet: { include: { user: true } } },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    const prevStatus = existing.status;
    const isWithdrawal = existing.type === "withdrawal";

    // Balance adjustment rules for withdrawals
    if (isWithdrawal) {
      // If marking failed/cancelled, re-credit wallet
      if ((status === "failed" || status === "cancelled") && prevStatus !== status) {
        await prisma.$transaction(async (tx) => {
          await tx.transaction.update({ where: { id: existing.id }, data: { status } });
        });
        const updated = await prisma.transaction.findUnique({ where: { id: existing.id } });
        return NextResponse.json({ success: true, data: updated });
      }
      // If marking completed, send Stripe transfer now and update status on success
      if (status === "completed" && prevStatus !== "completed") {
        const provider = existing.wallet?.user;
        if (!provider) {
          return NextResponse.json(
            { success: false, error: "Provider not found for wallet" },
            { status: 404 }
          );
        }
        const connectAccountId = provider.stripeCustId;
        if (!connectAccountId) {
          return NextResponse.json(
            { success: false, error: "Stripe account not connected for provider" },
            { status: 409 }
          );
        }
        try {
          const transfer = await stripe.transfers.create({
            amount: Math.round(Number(existing.amount) * 100),
            currency: "usd",
            destination: connectAccountId,
            metadata: {
              app_transaction_id: String(existing.id),
              app_user_id: String(provider.id),
            },
          });
          // On successful transfer, mark completed and decrement wallet balance
          const [updated] = await prisma.$transaction([
            prisma.transaction.update({
              where: { id: existing.id },
              data: { status: "completed", stripePaymentIntentId: transfer.id },
            }),
            prisma.wallet.update({
              where: { id: existing.walletId },
              data: { balance: { decrement: existing.amount } },
            }),
          ]);
          return NextResponse.json({ success: true, data: updated });
        } catch (e: any) {
          return NextResponse.json(
            { success: false, error: e?.message || "Stripe transfer failed" },
            { status: 400 }
          );
        }
      }
    }

    // Default: just update status
    const updated = await prisma.transaction.update({ where: { id: existing.id }, data: { status } });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update" },
      { status: 500 }
    );
  }
}


