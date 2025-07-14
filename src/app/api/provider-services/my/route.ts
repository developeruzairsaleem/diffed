// GET ALL SERVICES OF A SPECIFIC PROVIDER
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: cookieUserInfo.id },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const myServices = await prisma.providerService.findMany({
      where: { providerId: provider.id },
      include: { service: true },
    });

    return NextResponse.json(myServices, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
