import { NextResponse } from "next/server";
import { GameService } from "@/lib/game.service";
import type { ApiResponse, GameStatsDto } from "@/types/game.dto";

export async function GET() {
  try {
    const stats = await GameService.getGameStats();

    const response: ApiResponse<GameStatsDto> = {
      success: true,
      data: stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching game stats:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch game statistics",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
