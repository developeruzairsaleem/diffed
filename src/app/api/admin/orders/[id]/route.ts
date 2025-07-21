import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, scheduledTime, completionTime, notes } = body;

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        notes,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        completionTime: completionTime ? new Date(completionTime) : null,
      },
      include: {
        orderUsers: {
          include: {
            User: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// delete endpoint function
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete all linked users (customers/providers)
    await prisma.orderUser.deleteMany({
      where: { orderId: params.id },
    });

    // Delete the actual order
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
