import { type NextRequest, NextResponse } from "next/server";
import { GameService } from "@/lib/game.service";
import type {
  ApiResponse,
  GameDetailDto,
  GameUpdateRequest,
} from "@/types/game.dto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await GameService.getGameById(params.id);

    if (!game) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Game not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<GameDetailDto> = {
      success: true,
      data: game,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching game:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch game",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: GameUpdateRequest = await request.json();

    const updatedGame = await GameService.updateGame(params.id, body);

    if (!updatedGame) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Game not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<GameDetailDto> = {
      success: true,
      data: updatedGame,
      message: "Game updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating game:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update game",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await GameService.deleteGame(params.id);

    if (!success) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to delete game",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Game deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting game:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to delete game",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
