import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        game: {
          select: {
            id: true,
            name: true,
            image: true,
            isEloBased: true,
          },
        },
        subpackages: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /services failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// post request for creating a service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, gameId } = body;

    if (!name || !description || !gameId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
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

    return NextResponse.json(service);
  } catch (error) {
    console.error("POST /services failed:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
