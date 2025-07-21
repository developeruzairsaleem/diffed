import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const providers = await prisma.user.findMany({
      where: { role: "provider" },
      include: {
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
