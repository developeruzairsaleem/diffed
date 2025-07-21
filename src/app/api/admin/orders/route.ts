import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderUsers: {
          include: {
            User: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, subPackageId, price, scheduledTime, notes } = body;

    const order = await prisma.order.create({
      data: {
        subPackageId,
        price,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        notes,
        orderUsers: {
          create: [
            {
              userId: customerId,
            },
          ],
        },
      },
      include: {
        orderUsers: {
          include: {
            User: true,
          },
        },
        subpackage: {
          include: {
            service: {
              include: {
                game: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
