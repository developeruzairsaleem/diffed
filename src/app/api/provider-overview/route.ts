import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

export const GET = async () => {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const providerId = session.userId;

    // 1. Fetch provider's basic info
    const provider = await prisma.user.findUnique({
      where: { id: providerId as string },
      select: { username: true, profileImage: true },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // 2. Fetch all relevant assignments for this provider
    const assignments = await prisma.orderAssignment.findMany({
      where: {
        providerId: providerId,
        // We only care about assignments that are completed or verified
        status: { in: ["COMPLETED", "VERIFIED"] },
      },
      include: {
        order: {
          select: {
            price: true,
            subpackage: {
              select: {
                service: {
                  select: {
                    game: {
                      select: { name: true, image: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // 3. Process and aggregate the data on the server
    const overview = {
      totalCompleted: 0,
      totalVerified: 0,
      totalEarnings: new Decimal(0),
      gameStats: {} as any,
    };

    for (const assignment of assignments) {
      if (
        assignment.status === "COMPLETED" ||
        assignment.status === "VERIFIED"
      ) {
        overview.totalCompleted++;

        // Let's assume earnings are counted on VERIFIED status
        if (assignment.status === "VERIFIED") {
          overview.totalVerified++;
          overview.totalEarnings = overview.totalEarnings.add(
            assignment.order.price
          );
        }

        const game = assignment.order.subpackage.service.game;
        if (!overview.gameStats[game.name]) {
          overview.gameStats[game.name] = {
            gameName: game.name,
            gameImage: game.image,
            completed: 0,
            verified: 0,
            earnings: new Decimal(0),
          };
        }

        overview.gameStats[game.name].completed++;
        if (assignment.status === "VERIFIED") {
          overview.gameStats[game.name].verified++;
          overview.gameStats[game.name].earnings = overview.gameStats[
            game.name
          ].earnings.add(assignment.order.price);
        }
      }
    }

    const responsePayload = {
      provider,
      ...overview,
      // Convert the gameStats object to an array for easier mapping on the client
      gameStats: Object.values(overview.gameStats),
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error fetching provider overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview data." },
      { status: 500 }
    );
  }
};
