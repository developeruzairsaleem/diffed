import { type NextRequest, NextResponse } from "next/server";
import { GameService } from "@/lib/game.service";
import type {
  GamesListRequest,
  ApiResponse,
  GamesListResponse,
  GameCreateRequest,
} from "@/types/game.dto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: GamesListRequest = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 10,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
      isEloBased: searchParams.get("isEloBased")
        ? searchParams.get("isEloBased") === "true"
        : undefined,
      hasOrders: searchParams.get("hasOrders")
        ? searchParams.get("hasOrders") === "true"
        : undefined,
      minRevenue: searchParams.get("minRevenue")
        ? Number.parseFloat(searchParams.get("minRevenue")!)
        : undefined,
      maxRevenue: searchParams.get("maxRevenue")
        ? Number.parseFloat(searchParams.get("maxRevenue")!)
        : undefined,
    };

    const result = await GameService.getGames(params);

    const response: ApiResponse<GamesListResponse> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching games:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch games",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GameCreateRequest = await request.json();

    const game = await GameService.createGame(body);

    const response: ApiResponse<typeof game> = {
      success: true,
      data: game,
      message: "Game created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating game:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create game",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
