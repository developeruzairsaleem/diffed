import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(providers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, avatar, bio, gameIds } = body;

    const provider = await prisma.provider.create({
      data: {
        name,
        email,
        avatar,
        bio,
        gameIds,
      },
    });

    return NextResponse.json(provider);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}
