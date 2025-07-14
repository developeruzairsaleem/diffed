import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest) {

    const cookieUserInfo = await verifyToken(request);
    const userProfile = await prisma.user.findUnique({
        where: { id: cookieUserInfo?.id }
    })
    return NextResponse.json(userProfile);
}
