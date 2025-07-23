import { NextResponse } from "next/server";
import { CustomerService } from "@/lib/customer.service";
import type { ApiResponse, CustomerStatsDto } from "@/types/customer.dto";

export async function GET() {
  try {
    const stats = await CustomerService.getCustomerStats();

    const response: ApiResponse<CustomerStatsDto> = {
      success: true,
      data: stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching customer stats:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch customer statistics",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
