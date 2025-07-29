import { type NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/order.service";
import type { ApiResponse, AssignmentUpdateRequest } from "@/types/order.dto";

// Update the assignment status from customer point of view. only able to change to "replaced", "Approved" & "Verified"
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    const body: AssignmentUpdateRequest = await request.json();

    const success = await OrderService.updateAssignment(
      params.assignmentId,
      body
    );

    if (!success) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to update assignment",
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
