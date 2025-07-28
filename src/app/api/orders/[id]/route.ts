import { type NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/order.service";
import type {
  ApiResponse,
  OrderDetailDto,
  OrderUpdateRequest,
} from "@/types/order.dto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await OrderService.getOrderById(params.id);

    if (!order) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Order not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<OrderDetailDto> = {
      success: true,
      data: order,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching order:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch order",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: OrderUpdateRequest = await request.json();

    const updatedOrder = await OrderService.updateOrder(params.id, body);

    if (!updatedOrder) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Order not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<OrderDetailDto> = {
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating order:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update order",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await OrderService.deleteOrder(params.id);

    if (!success) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to delete order",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Order deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting order:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to delete order",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
