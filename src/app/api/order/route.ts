import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const cookieUserInfo = await verifyToken(request);

    if (!cookieUserInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { providerServiceId, gameId, scheduledDate, notes } = body;

    if (!providerServiceId || !gameId || !scheduledDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the customer
    const customer = await prisma.customer.findUnique({
      where: { userId: cookieUserInfo.id },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }

    // Fetch providerService to get providerId
    const providerService = await prisma.providerService.findUnique({
      where: { id: providerServiceId },
      include: { provider: true },
    });

    if (!providerService) {
      return NextResponse.json({ error: "Provider service not found" }, { status: 404 });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        providerId: providerService.providerId,
        providerServiceId,
        gameId,
        scheduledDate: new Date(scheduledDate),
        notes,
        // Default values for status and paymentStatus are used (pending, unpaid)
      },
      include: {
        provider: true,
        customer: true,
        providerService: true,
        game: true,
      }
    });

    // Optional: update customer's totalOrders
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalOrders: { increment: 1 },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("[ORDER CREATE ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
