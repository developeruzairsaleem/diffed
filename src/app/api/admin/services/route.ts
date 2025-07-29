import { type NextRequest, NextResponse } from "next/server";
import { GameService } from "@/lib/game.service";
import type {
  ServicesListRequest,
  ApiResponse,
  ServicesListResponse,
  ServiceCreateRequest,
} from "@/types/game.dto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: ServicesListRequest = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 10,
      gameId: searchParams.get("gameId") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
    };

    const result = await GameService.getServices(params);

    const response: ApiResponse<ServicesListResponse> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching services:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch services",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ServiceCreateRequest = await request.json();

    const service = await GameService.createService(body);

    const response: ApiResponse<typeof service> = {
      success: true,
      data: service,
      message: "Service created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create service",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
