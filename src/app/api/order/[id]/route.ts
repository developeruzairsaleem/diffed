import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@/generated/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, reason } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check ownership
    if (user.role === "provider") {
      const provider = await prisma.provider.findUnique({
        where: { userId: user.id },
      });
      if (!provider || provider.id !== order.providerId) {
        return NextResponse.json(
          { error: "Access denied: Not your order" },
          { status: 403 }
        );
      }
    } else if (user.role === "customer") {
      const customer = await prisma.customer.findUnique({
        where: { userId: user.id },
      });
      if (!customer || customer.id !== order.customerId) {
        return NextResponse.json(
          { error: "Access denied: Not your order" },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    // Validate allowed transitions
    const currentStatus = order.status;
    const role = user.role;
    const validTransitions: Record<string, string[]> = {
      provider: {
        pending: ["confirmed", "cancelled"],
        confirmed: ["in_progress"],
        in_progress: ["completed"],
      },
      customer: {
        pending: ["cancelled"],
        confirmed: ["cancelled"],
      },
    }[role];

    // if (!validTransitions || !validTransitions[currentStatus]?.includes(status)) {
    //   return NextResponse.json({ error: "Invalid transition" }, { status: 400 });
    // }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as OrderStatus,
        cancellationReason:
          status === "cancelled" && reason ? reason : undefined,
      },
    });

    const orderHistory = await prisma.orderStatusHistory.create({
      data: {
        orderId,
        previousStatus: order.status,
        newStatus: status as OrderStatus,
        changedByRole: user.role,
        reason: reason || null,
      }
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
