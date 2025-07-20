import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        provider: true,
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerName,
      customerEmail,
      gameId,
      serviceName,
      subpackageName,
      price,
      scheduledTime,
      notes,
    } = body;

    let finalCustomerId = customerId;

    // If no customerId provided, create or find customer
    if (!customerId && customerName && customerEmail) {
      let customer = await prisma.customer.findUnique({
        where: { email: customerEmail },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            email: customerEmail,
          },
        });
      }

      finalCustomerId = customer.id;
    }

    const order = await prisma.order.create({
      data: {
        customerId: finalCustomerId,
        gameId,
        serviceName,
        subpackageName,
        price,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        notes,
      },
      include: {
        provider: true,
        customer: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
