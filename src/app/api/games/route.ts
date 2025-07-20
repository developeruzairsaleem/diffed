import { NextResponse } from "next/server";
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
      orderBy: { name: "asc" },
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
