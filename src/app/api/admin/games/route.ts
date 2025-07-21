import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/game
export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        services: {
          include: {
            subpackages: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

// POST /api/game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image, isEloBased = false, ranks = null } = body;

    if (!name || !image) {
      return NextResponse.json(
        { error: "Missing required fields: name or image" },
        { status: 400 }
      );
    }

    const existingGame = await prisma.game.findUnique({
      where: { name },
    });

    if (existingGame) {
      return NextResponse.json(
        { error: "Game with this name already exists" },
        { status: 409 }
      );
    }

    const newGame = await prisma.game.create({
      data: {
        name,
        image,
        isEloBased,
        ranks,
      },
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error("Failed to create game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
