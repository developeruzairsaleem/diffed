import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo || cookieUserInfo.role !== 'provider') {
      return NextResponse.json(
        { error: "User access unauthorized, please log in" },
        { status: 401 }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: cookieUserInfo.id },
    });

    // if (!provider) {
    //   return NextResponse.json(
    //     { error: "Provider profile not found." },
    //     { status: 404 }
    //   );
    // }

    const providerOrders = await prisma.order.findMany({
        where: { providerId: provider?.id },
        include: {
          customer: {
            include: {
              user: {
                select: {
                  email: true,
                  profileImage: true,
                },
              },
            },
          },
          providerService: {
            include: {
              service: true,
            },
          },
          game: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!providerOrders) {
      return NextResponse.json(
        { message: "No orders found for the current provider" },
        { status: 200 }
      );
    }

    return NextResponse.json(providerOrders, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
