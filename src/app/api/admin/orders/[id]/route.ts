import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, providerId, scheduledTime, completionTime, notes } = body;

    const updateData: any = {
      status,
      notes,
    };

    if (providerId !== undefined) {
      updateData.providerId = providerId;
      if (providerId && status === "ASSIGNED") {
        // Update provider's total orders count
        await prisma.provider.update({
          where: { id: providerId },
          data: {
            totalOrders: {
              increment: 1,
            },
          },
        });
      }
    }

    if (scheduledTime) {
      updateData.scheduledTime = new Date(scheduledTime);
    }

    if (completionTime) {
      updateData.completionTime = new Date(completionTime);
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        provider: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
