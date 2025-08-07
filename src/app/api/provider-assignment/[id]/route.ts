import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignmentId = params.id;
    const providerId = session.userId;

    // Fetch the specific assignment, but only if it belongs to the logged-in provider
    const assignment = await prisma.orderAssignment.findFirst({
      where: {
        id: assignmentId,
        providerId: providerId, // SECURITY: Ensures a provider can only access their own assignments
      },
      include: {
        // Include all the rich data we need for the UI
        order: {
          include: {
            customer: {
              select: {
                username: true,
                profileImage: true,
              },
            },
            subpackage: {
              include: {
                service: {
                  include: {
                    game: {
                      select: {
                        name: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
            chats: {
              orderBy: {
                sentAt: "asc",
              },
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found or you do not have access." },
        { status: 404 }
      );
    }
    // if (!["APPROVED", "COMPLETED", "VERIFIED"].includes(assignment.status)) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "Your assignment status does not allow you to view the order detail",
    //     },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Error fetching provider assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment data." },
      { status: 500 }
    );
  }
};
