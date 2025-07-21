import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// the params id is orderid and the providerId is userId who is provider
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { providerId } = body;

    if (!providerId) {
      return NextResponse.json(
        { error: "Missing providerId" },
        { status: 400 }
      );
    }

    // Check if already assigned
    const existing = await prisma.orderUser.findFirst({
      where: {
        orderId: params.id,
        userId: providerId,
      },
    });

    if (!existing) {
      await prisma.orderUser.create({
        data: {
          orderId: params.id,
          userId: providerId,
        },
      });
    }

    // Mark order as assigned
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: "ASSIGNED",
      },
      include: {
        orderUsers: {
          include: { User: true },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to assign provider" },
      { status: 500 }
    );
  }
}
