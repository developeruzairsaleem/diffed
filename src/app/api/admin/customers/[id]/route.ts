import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.user.findFirst({
      where: {
        id: params.id,
        role: "customer",
      },
      include: {
        wallet: true,
        orderUsers: {
          include: {
            Order: true,
          },
        },
        _count: {
          select: {
            orderUsers: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("GET /api/customer/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!customer || customer.role !== "customer") {
      return NextResponse.json(
        { error: "Customer not found or invalid role" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/customer/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
