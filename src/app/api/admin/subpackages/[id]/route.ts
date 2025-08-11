import { type NextRequest, NextResponse } from "next/server";
import { GameService } from "@/lib/game.service";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, SubpackageUpdateRequest } from "@/types/game.dto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subpackage = await prisma.subpackage.findUnique({
      where: { id: params.id },
      include: {
        service: {
          include: {
            game: {
              select: {
                id: true,
                name: true,
                image: true,
                isEloBased: true,
                ranks: true,
              },
            },
          },
        },
        orders: {
          include: {
            customer: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
            assignments: {
              select: {
                id: true,
                reviewRating: true,
                reviewText: true,
                status: true,
                provider: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!subpackage) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Subpackage not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Calculate statistics
    const ordersCount = subpackage.orders.length;
    const totalRevenue = subpackage.orders.reduce(
      (sum, order) => sum + order.price,
      0
    );
    const completedOrders = subpackage.orders.filter(
      (order) => order.status === "COMPLETED"
    ).length;
    const completionRate =
      ordersCount > 0 ? (completedOrders / ordersCount) * 100 : 0;

    const ratings = subpackage.orders.flatMap((order) =>
      order.assignments
        .filter((a) => a.reviewRating)
        .map((a) => a.reviewRating!)
    );
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    const subpackageDetail = {
      id: subpackage.id,
      name: subpackage.name,
      description: subpackage.description,
      price: subpackage.price,
      requiredProviders: (subpackage as any).requiredProviders ?? 1,
      duration: subpackage.duration,
      dynamicPricing: subpackage.dynamicPricing,
      basePricePerELO: subpackage.basePricePerELO,
      minELO: subpackage.minELO,
      maxELO: subpackage.maxELO,
      serviceId: subpackage.serviceId,
      service: subpackage.service,
      createdAt: subpackage.createdAt,
      updatedAt: subpackage.updatedAt,
      orders: subpackage.orders.map((order) => ({
        id: order.id,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt,
        customer: order.customer,
        assignments: order.assignments,
      })),
      stats: {
        ordersCount,
        totalRevenue,
        completedOrders,
        completionRate,
        averageRating,
        averageOrderValue: ordersCount > 0 ? totalRevenue / ordersCount : 0,
      },
    };

    const response: ApiResponse<typeof subpackageDetail> = {
      success: true,
      data: subpackageDetail,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching subpackage:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch subpackage",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: SubpackageUpdateRequest = await request.json();

    const updatedSubpackage = await GameService.updateSubpackage(
      params.id,
      body
    );

    if (!updatedSubpackage) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Subpackage not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof updatedSubpackage> = {
      success: true,
      data: updatedSubpackage,
      message: "Subpackage updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating subpackage:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update subpackage",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await GameService.deleteSubpackage(params.id);

    if (!success) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to delete subpackage",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Subpackage deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting subpackage:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to delete subpackage",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
