import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = await prisma.providerService.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo || cookieUserInfo.role !== 'provider') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.providerService.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Service deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
