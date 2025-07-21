import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await prisma.user.findFirst({
      where: {
        id: params.id,
        role: "provider",
      },
      include: {
        wallet: true,
        orderUsers: {
          include: {
            Order: true,
          },
        },
        _count: {
          select: {
            orderUsers: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("GET /api/provider/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { username, email, profileImage, status } = body;

    const updatedProvider = await prisma.user.update({
      where: { id: params.id },
      data: {
        username,
        email,
        profileImage,
        status, // optionally allow toggling active/suspended
      },
    });

    return NextResponse.json(updatedProvider);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete provider" },
      { status: 500 }
    );
  }
}
