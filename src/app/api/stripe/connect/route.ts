import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { stripe } from "@/lib/stripe";

function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

export async function GET(request: NextRequest) {
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

    const connectId = user.stripeCustId || undefined; // Reusing field for demo
    if (!connectId) {
      return NextResponse.json({ connected: false });
    }

    const account = await stripe.accounts.retrieve(connectId);
    return NextResponse.json({
      connected: true,
      accountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (error: any) {
    console.error("Stripe connect GET error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to fetch connect status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    let accountId = user.stripeCustId || undefined; // Reusing field for demo

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email ?? undefined,
        business_type: "individual",
      });

      accountId = account.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustId: account.id },
      });
    }

    const baseUrl = getBaseUrl(request);
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/dashboard/provider`,
      return_url: `${baseUrl}/dashboard/provider`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url, accountId });
  } catch (error: any) {
    console.error("Stripe connect POST error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to create onboarding link" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId as string } });
    if (!user || !user.stripeCustId) {
      return NextResponse.json({ error: "Stripe account not connected" }, { status: 404 });
    }

    const baseUrl = getBaseUrl(request);
    const account = await stripe.accounts.retrieve(user.stripeCustId);
    let link;
    try {
      // Try update link first if account supports it
      link = await stripe.accountLinks.create({
        account: user.stripeCustId,
        refresh_url: `${baseUrl}/dashboard/provider`,
        return_url: `${baseUrl}/dashboard/provider`,
        type: "account_update",
      });
    } catch (err) {
      // Fallback to onboarding which also supports updating details for Express
      link = await stripe.accountLinks.create({
        account: user.stripeCustId,
        refresh_url: `${baseUrl}/dashboard/provider`,
        return_url: `${baseUrl}/dashboard/provider`,
        type: "account_onboarding",
      });
    }

    return NextResponse.json({ url: link.url });
  } catch (error: any) {
    console.error("Stripe connect UPDATE link error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to create update link" },
      { status: 500 }
    );
  }
}


