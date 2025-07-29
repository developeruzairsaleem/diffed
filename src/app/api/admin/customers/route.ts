import { type NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/customer.service";
import type {
  CustomersListRequest,
  ApiResponse,
  CustomersListResponse,
} from "@/types/customer.dto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: CustomersListRequest = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 10,
      status: (searchParams.get("status") as any) || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
      hasOrders: searchParams.get("hasOrders")
        ? searchParams.get("hasOrders") === "true"
        : undefined,
      minSpent: searchParams.get("minSpent")
        ? Number.parseFloat(searchParams.get("minSpent")!)
        : undefined,
      maxSpent: searchParams.get("maxSpent")
        ? Number.parseFloat(searchParams.get("maxSpent")!)
        : undefined,
    };

    const result = await CustomerService.getCustomers(params);

    const response: ApiResponse<CustomersListResponse> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching customers:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch customers",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
