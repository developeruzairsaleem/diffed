import { type NextRequest, NextResponse } from "next/server";
import { ProviderService } from "@/lib/provider.service";
import type {
  ProvidersListRequest,
  ApiResponse,
  ProvidersListResponse,
} from "@/types/provider.dto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: ProvidersListRequest = {
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
      hasAssignments: searchParams.get("hasAssignments")
        ? searchParams.get("hasAssignments") === "true"
        : undefined,
      minEarnings: searchParams.get("minEarnings")
        ? Number.parseFloat(searchParams.get("minEarnings")!)
        : undefined,
      maxEarnings: searchParams.get("maxEarnings")
        ? Number.parseFloat(searchParams.get("maxEarnings")!)
        : undefined,
      minRating: searchParams.get("minRating")
        ? Number.parseFloat(searchParams.get("minRating")!)
        : undefined,
      gameId: searchParams.get("gameId") || undefined,
      isAvailable: searchParams.get("isAvailable")
        ? searchParams.get("isAvailable") === "true"
        : undefined,
    };

    const result = await ProviderService.getProviders(params);

    const response: ApiResponse<ProvidersListResponse> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching providers:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch providers",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
