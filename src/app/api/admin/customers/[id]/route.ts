import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // get the customer detail including basic profile, total orders, order details
    const customer = await prisma.user.findFirst({
      where: {
        id: params.id,
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
    console.error("GET /api/admin/customer/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// ------------------------
// deleting the customer
// --------------------------
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
    console.error("DELETE /api/admin/customer/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}

// ----------------------------
// updating the customer status
// -----------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const status = body?.status;

    // valid status for customers
    const validStatus = ["active", "inactive", "suspended"];

    // If status is not valid return error to the user
    if (!(status && validStatus.includes(status))) {
      return NextResponse.json(
        {
          error: "Please provider a valid status to update customer",
        },
        {
          status: 400,
        }
      );
    }

    // Check if customer exists and has customer role
    const existingCustomer = await prisma.user.findUnique({
      where: { id: params.id },
    });

    // if the customer is not valid return error 404
    if (!existingCustomer || existingCustomer?.role !== "customer") {
      return NextResponse.json(
        {
          error: "Customer not found or not a valid role",
        },
        {
          status: 404,
        }
      );
    }
    // Update customer status
    const updatedCustomer = await prisma.user.update({
      where: {
        id: params.id,
        role: "customer",
      },
      data: {
        status: status,
        updatedAt: new Date(),
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

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("UPDATE /api/admin/customer/[id]:", error);
    return NextResponse.json(
      { error: "Something went wrong updating" },
      { status: 500 }
    );
  }
}
