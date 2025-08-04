import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { _success } from "zod/v4/core";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    const orderId = params.id;
    const appliedAssignment = await prisma.orderAssignment.findFirst({
      where: {
        orderId,
        providerId: session?.userId as string,
      },
    });

    if (appliedAssignment) {
      return NextResponse.json(
        {
          success: false,
          error: "already have assignment for this order",
        },
        { status: 400 }
      );
    }

    const createdAssignment = await prisma.orderAssignment.create({
      data: {
        orderId,
        providerId: session?.userId as string,
      },
      include: {
        provider: true,
      },
    });

    // completed order for the provider who is applying for the order
    const completedOrdersCount = await prisma.orderAssignment.count({
      where: {
        providerId: session?.userId,
        status: {
          in: ["COMPLETED", "VERIFIED"],
        },
      },
    });

    // Calculate average rating for this provider
    const ratingStats = await prisma.orderAssignment.aggregate({
      where: {
        providerId: session?.userId,
        reviewRating: { not: null },
      },
      _avg: {
        reviewRating: true,
      },
    });

    const avgRating = ratingStats._avg.reviewRating || 0;

    const actualResponse = {
      id: createdAssignment.id,
      provider: {
        id: createdAssignment?.providerId,
        username: createdAssignment?.provider.username,
        avatar:
          createdAssignment?.provider.profileImage || "/default-avatar.png",
        rating: Number(avgRating.toFixed(2)),
        completedOrders: completedOrdersCount,
        joinedAt: createdAssignment.provider.createdAt.toISOString(),
      },
      status: createdAssignment.status,
      assignedAt: createdAssignment.claimedAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: actualResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("something went wrong", error);
    return NextResponse.json(
      { error: "Something went wrong on the server", success: false },
      {
        status: 500,
      }
    );
  }
}
