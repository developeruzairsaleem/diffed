import { NextResponse } from "next/server";
import { ProviderService } from "@/lib/provider.service";
import type { ApiResponse, ProviderStatsDto } from "@/types/provider.dto";

export async function GET() {
  try {
    const stats = await ProviderService.getProviderStats();

    const response: ApiResponse<ProviderStatsDto> = {
      success: true,
      data: stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching provider stats:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch provider statistics",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
