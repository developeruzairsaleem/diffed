// /app/api/orders/customer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await verifyToken(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const customer = await prisma.customer.findUnique({
      where: { userId: user.id },
    });

    if (!customer) return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        provider: true,
        providerService: { include: { service: true } },
        game: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
