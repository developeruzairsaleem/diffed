import { type NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/order.service";
import type {
  OrdersListRequest,
  ApiResponse,
  CustomerOrderListResponse,
} from "@/types/order.dto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: OrdersListRequest = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 10,
      status: (searchParams.get("status") as any) || undefined,
      customerId: searchParams.get("customerId") || undefined,
      gameId: searchParams.get("gameId") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
    };
    if (!params?.customerId) {
      console.error("Error fetching orders no customerId:");

      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to fetch orders without providing valid customerId",
      };

      return NextResponse.json(response, { status: 400 });
    }
    const result = await OrderService.getRecentOrdersCustomer(params);

    const response: ApiResponse<CustomerOrderListResponse> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching orders:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch orders",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
