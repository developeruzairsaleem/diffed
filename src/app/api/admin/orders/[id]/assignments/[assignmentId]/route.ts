import { type NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/order.service";
import type { ApiResponse, AssignmentUpdateRequest } from "@/types/order.dto";

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
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Assignment updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating assignment:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update assignment",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
