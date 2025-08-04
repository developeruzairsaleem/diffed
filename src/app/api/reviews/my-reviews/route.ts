import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // TODO: Get the current user ID from session/auth
    // For now, using a placeholder - replace with actual auth
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        {
          status: 401,
        }
      );
    }

    // currentUserId
    const currentUserId = session?.userId;

    // Fetch reviews given by the current customer
    const customerReviews = await prisma.orderAssignment.findMany({
      where: {
        order: {
          customerId: currentUserId,
        },
        reviewRating: {
          not: null,
        },
        reviewText: {
          not: null,
        },
      },
      include: {
        provider: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        order: {
          include: {
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
          },
        },
      },
    });

    // Transform the data for the frontend
    const formattedReviews = customerReviews.map((assignment: any) => ({
      id: assignment.id,
      rating: assignment.reviewRating,
      reviewText: assignment.reviewText,
      createdAt: assignment.updatedAt,
      provider: {
        id: assignment.provider.id,
        username: assignment.provider.username,
        profileImage: assignment.provider.profileImage,
      },
      service: {
        name: assignment.order.subpackage.service.name,
        subpackageName: assignment.order.subpackage.name,
        game: {
          name: assignment.order.subpackage.service.game.name,
          image: assignment.order.subpackage.service.game.image,
        },
      },
      order: {
        id: assignment.order.id,
        orderNumber: assignment.order.orderNumber,
      },
    }));

    // Calculate average rating
    const totalRating = formattedReviews.reduce(
      (sum: any, review: any) => sum + (review.rating || 0),
      0
    );
    const averageRating =
      formattedReviews.length > 0 ? totalRating / formattedReviews.length : 0;

    // Calculate rating breakdown
    const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => {
      const count = formattedReviews.filter(
        (review: any) => review.rating === rating
      ).length;
      const percentage =
        formattedReviews.length > 0
          ? (count / formattedReviews.length) * 100
          : 0;
      return {
        rating,
        count,
        percentage: Math.round(percentage),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        reviews: formattedReviews,
        stats: {
          totalReviews: formattedReviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingBreakdown,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
