import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // 1. Get the logged-in provider's ID from the session
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in.", success: false },
        { status: 401 }
      );
    }

    const providerId = session.userId;

    // 2. Fetch reviews from OrderAssignments for the specific provider
    const reviews = await prisma.orderAssignment.findMany({
      where: {
        providerId: providerId,
        // Only include assignments that have been reviewed
        reviewRating: { not: null },
        reviewText: { not: null },
      },
      select: {
        id: true,
        reviewRating: true,
        reviewText: true,
        claimedAt: true, // You can use this for the date
        // Include related data to get customer and service info
        order: {
          select: {
            customer: {
              select: {
                username: true,
                profileImage: true,
              },
            },
            subpackage: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        claimedAt: "desc", // Show the most recent reviews first
      },
      take: 20, // Limit the number of reviews returned
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching provider reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews.", success: false },
      { status: 500 }
    );
  }
};
