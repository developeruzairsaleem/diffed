import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId as string } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const accountId = user.stripeCustId || undefined;
    if (!accountId) {
      return NextResponse.json({ connected: false });
    }

    const account = await stripe.accounts.retrieve(accountId);
    const bankAccounts = await stripe.accounts.listExternalAccounts(accountId, {
      object: "bank_account",
      limit: 10,
    });

    const mapped = bankAccounts.data.map((ba: any) => ({
      id: ba.id as string,
      bankName: (ba.bank_name as string) || null,
      last4: (ba.last4 as string) || null,
      currency: (ba.currency as string) || null,
      country: (ba.country as string) || null,
      accountHolderName: (ba.account_holder_name as string) || null,
      defaultForCurrency: !!ba.default_for_currency,
    }));

    return NextResponse.json({
      connected: true,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      bankAccounts: mapped,
    });
  } catch (error: any) {
    console.error("Fetch payout method error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to fetch payout method" },
      { status: 500 }
    );
  }
}


