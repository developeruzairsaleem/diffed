import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // Decrypt session to get the logged-in provider's ID
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const providerId = session.userId;

    // Fetch all assignments for this provider, including related order and subpackage data
    const assignments = await prisma.orderAssignment.findMany({
      where: {
        providerId: providerId,
      },
      orderBy: {
        claimedAt: "desc", // Show the newest assignments first
      },
      include: {
        order: {
          include: {
            customer: {
              select: {
                username: true, // Get customer's name
              },
            },
            subpackage: {
              include: {
                service: {
                  include: {
                    game: {
                      select: {
                        name: true, // Get the game name
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("Error fetching provider assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments." },
      { status: 500 }
    );
  }
};
