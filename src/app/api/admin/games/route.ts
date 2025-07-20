import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, image, isEloBased, ranks } = body;

    const game = await prisma.game.create({
      data: {
        name,
        icon,
        image,
        isEloBased,
        ranks: ranks || null,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
