import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, icon, image, isEloBased, ranks } = body;

    const game = await prisma.game.update({
      where: { id: params.id },
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
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.game.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}
