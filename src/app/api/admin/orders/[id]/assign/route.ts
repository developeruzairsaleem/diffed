import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { providerId } = body;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        providerId,
        status: "ASSIGNED",
      },
      include: {
        provider: true,
      },
    });

    // Update provider's total orders count
    if (providerId) {
      await prisma.provider.update({
        where: { id: providerId },
        data: {
          totalOrders: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to assign order" },
      { status: 500 }
    );
  }
}
