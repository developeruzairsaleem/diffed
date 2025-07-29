import { type NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/order.service";
import type { ApiResponse, AssignmentUpdateRequest } from "@/types/order.dto";

// Update the assignment status from customer point of view. only able to change to approved
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    // Fetch the order and its assignments
    const order = await OrderService.getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Count assignments with status APPROVED, VERIFIED, or COMPLETED
    const approvedCount = order.assignments.filter((a: any) =>
      ["APPROVED", "VERIFIED", "COMPLETED"].includes(a.status)
    ).length;

    if (approvedCount >= order.requiredCount) {
      return NextResponse.json({
        success: false,
        error: "Required count already fulfilled. Cannot approve more assignments."
      }, { status: 400 });
    }

    const success = await OrderService.updateAssignment(params.assignmentId, {
      status: "APPROVED",
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
