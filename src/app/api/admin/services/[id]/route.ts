import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, gameId } = body;

    if (!name || !description || !gameId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: {
        name,
        description,
        gameId,
      },
      include: {
        game: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /services failed:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// delete route
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /services failed:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
