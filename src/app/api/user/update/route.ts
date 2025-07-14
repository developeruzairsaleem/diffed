import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  try {
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // EMAIL AND PASSWORD SHOULD BE UPDATED THROUGH VERIFIED ROUTES ONLY — NOT HERE!
    const { profileImage } = body; // other fields to be added with time
    const updatedUser = await prisma.user.update({
      where: { id: cookieUserInfo.id },
      data: {
        ...(profileImage && { profileImage }),
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
