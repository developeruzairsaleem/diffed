import { type NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/order.service";
import type { ApiResponse, AssignmentUpdateRequest } from "@/types/order.dto";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { prisma } from "@/lib/prisma";

// Update the assignment status from customer point of view. only able to change to approved
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    // get and verify ther user session

    // Decrypt the session from the cookie
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        {
          status: 401,
        }
      );
    }
    // Fetch the order and its assignments
    const order = await OrderService.getOrderById(params.id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Only allow if order.status is IN_PROGRESS
    if (order.status !== "IN_PROGRESS" && order.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Order is not in progress or active" },
        { status: 403 }
      );
    }

    if (order.rerollsLeft <= 0) {
      return NextResponse.json({
        error: "Already used available rerolls",
        success: false,
      });
    }
    // Check if user is the customer (order owner)
    const isCustomer = session?.userId === order.customerId;

    // Check if user is a provider on this order with status APPROVED, VERIFIED, or COMPLETED
    // const isProvider = order.assignments.some(
    //   (a: any) =>
    //     a.providerId === user.id &&
    //     ["APPROVED", "VERIFIED", "COMPLETED"].includes(a.status)
    // );

    if (!isCustomer) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Count assignments with status APPROVED, VERIFIED, or COMPLETED
    const approvedCount = order.assignments.filter((a: any) =>
      ["APPROVED", "VERIFIED", "COMPLETED"].includes(a.status)
    ).length;

    const success = await OrderService.updateAssignment(params.assignmentId, {
      status: "REPLACED",
    });

    if (!success) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to approve assignment",
      };
      console.log(
        "PUT ERROR response from /api/orders/[orderId]/assignments/[assignmentId]",
        response
      );
      return NextResponse.json(response, { status: 400 });
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        rerollsLeft: order.rerollsLeft - 1,
      },
    });

    const response: ApiResponse<never> = {
      success: true,
      message: "Assignment updated successfully",
    };
    console.log(
      "PUT SUCCESS response from /api/orders/[orderId]/assignments/[assignmentId]",
      response
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating assignment:", error);
    console.log(
      "PUT error response from /api/orders/[orderId]/assignments/[assignmentId]",
      error
    );
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update assignment",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
