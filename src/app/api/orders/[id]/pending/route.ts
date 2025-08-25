// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch order with all related data
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        customer: {
          select: {
            id: true,
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
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        assignments: {
          include: {
            provider: {
              select: {
                id: true,
                username: true,
                profileImage: true,
                createdAt: true,
                // We'll need to calculate rating and completed orders separately
                // as they're not directly in the User model based on your schema
              },
            },
          },
          orderBy: {
            claimedAt: "desc",
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Calculate provider statistics
    const enrichedAssignments = await Promise.all(
      order.assignments.map(async (assignment: any) => {
        // Calculate completed orders for this provider
        const completedOrdersCount = await prisma.orderAssignment.count({
          where: {
            providerId: assignment.providerId,
            status: {
              in: ["COMPLETED", "VERIFIED"],
            },
          },
        });

        // Calculate average rating for this provider
        const ratingStats = await prisma.orderAssignment.aggregate({
          where: {
            providerId: assignment.providerId,
            reviewRating: { not: null },
          },
          _avg: {
            reviewRating: true,
          },
        });

        const avgRating = ratingStats._avg.reviewRating || 0;

        return {
          id: assignment.id,
          provider: {
            id: assignment.provider.id,
            username: assignment.provider.username,
            avatar: assignment.provider.profileImage || "/default-avatar.png",
            rating: Number(avgRating.toFixed(2)),
            completedOrders: completedOrdersCount,
            joinedAt: assignment.provider.createdAt.toISOString(),
          },
          status: assignment.status,
          assignedAt: assignment.claimedAt.toISOString(),
        };
      })
    );

    // Transform the order data to match your component's expected format
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      rerollsLeft: order.rerollsLeft,
      isInQueue: order.isInQueue,
      notes: order.notes,
      customerId: order.customerId,
      status: order.status,
      requiredCount: order.requiredCount,
      subpackage: {
        id: order.subpackage.id,
        name: order.subpackage.name,
        price: order.subpackage.price,
        requiredProviders: order.subpackage.requiredProviders,
        service: {
          id: order.subpackage.service.id,
          name: order.subpackage.service.name,
          game: {
            id: order.subpackage.service.game.id,
            name: order.subpackage.service.game.name,
            image: order.subpackage.service.game.image,
          },
        },
        dynamicPricing: order.subpackage.dynamicPricing,
        basePricePerELO: order.subpackage.basePricePerELO,
        minELO: order.subpackage.minELO,
        maxELO: order.subpackage.maxELO,
      },
      assignments: enrichedAssignments,
      updatedAt: order.updatedAt.toISOString(),
      gamesCount: (order as any)?.gamesCount ?? null,
      rank: (order as any)?.rank ?? null,
    };

    return NextResponse.json({
      success: true,
      data: transformedOrder,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// patch request for the order pending status
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (
      !["PENDING", "COMPLETED", "IN_PROGRESS", "CANCELLED"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update only the status field
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
