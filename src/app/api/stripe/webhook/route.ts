import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // ensure Node runtime for raw body

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event;
  const rawBody = await request.text();
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "transfer.created": {
        const transfer: any = event.data.object;
        const appTransactionId = transfer?.metadata?.app_transaction_id as string | undefined;
        if (appTransactionId) {
          await prisma.transaction.update({
            where: { id: appTransactionId },
            data: {
              status: "completed",
              stripePaymentIntentId: transfer.id,
            },
          });
        }
        break;
      }
      case "transfer.reversed": {
        const transfer: any = event.data.object;
        const appTransactionId = transfer?.metadata?.app_transaction_id as string | undefined;
        if (appTransactionId) {
          const trx = await prisma.transaction.findUnique({ where: { id: appTransactionId } });
          if (trx) {
            await prisma.$transaction(async (tx) => {
              await tx.transaction.update({
                where: { id: appTransactionId },
                data: { status: "failed" },
              });
              // re-credit wallet balance
              await tx.wallet.update({
                where: { id: trx.walletId },
                data: {
                  balance: { increment: trx.amount },
                },
              });
            });
          }
        }
        break;
      }
      // Optionally observe connected account bank payouts
      case "payout.paid": {
        // For auditing: bank payout succeeded on connected account
        break;
      }
      case "payout.failed": {
        // For auditing: bank payout failed on connected account
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}


