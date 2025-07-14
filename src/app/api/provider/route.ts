// REGISTER PROVIDER DETAILS

import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieUserInfo = await verifyToken(request);
    if(!cookieUserInfo) {
        return NextResponse.json({error: 'user access is unauthorized, log in!'}, {status: 401})
    };

    const existingProvider = await prisma.provider.findUnique({
        where: { userId: cookieUserInfo.id },
      });

      if (existingProvider) {
        return NextResponse.json(
          { error: "You already have a provider profile!" },
          { status: 400 }
        );
      }

    const body = await request.json();
    const provider = await prisma.provider.create({
        data: {
            ...body,
            user: {connect: {id: cookieUserInfo.id} }   // Connect user to provider
        }
    });

    return NextResponse.json(provider, {status: 201});
    
  } catch (err: any) {
    return NextResponse.json({error: err.message}, {status: 500})
  }
}