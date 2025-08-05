import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const providerId = session.userId;

    // Find all assignments for this provider where the order is currently IN_PROGRESS
    const activeAssignments = await prisma.orderAssignment.findMany({
      where: {
        providerId: providerId,
        order: {
          status: "IN_PROGRESS",
        },
      },
      include: {
        // Include all the necessary related data
        order: {
          include: {
            customer: {
              select: {
                id: true,
                username: true,
                profileImage: true,
              },
            },
            subpackage: {
              select: {
                name: true,
                service: {
                  select: {
                    game: {
                      select: {
                        name: true,
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

    return NextResponse.json(activeAssignments);
  } catch (error) {
    console.error("Error fetching active clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch active clients." },
      { status: 500 }
    );
  }
};
