import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo) {
      return NextResponse.json(
        { error: "User access is unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const customerProfile = await prisma.customer.findUnique({
      where: { userId: cookieUserInfo.id },
    });

    if (!customerProfile) {
      return NextResponse.json(
        { error: "No profile found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(customerProfile, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo) {
      return NextResponse.json(
        { error: "User access is unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const {
      firstName,
      lastName,
      customerType,
      gamingLevel,
      primaryGames,
      currentRanks,
      gamingGoals,
      budgetRange,
      preferredServiceTypes,
      activityPattern,
      learningStyle,
      communicationPreference,
      peakHours,
      riskTolerance,
    } = await request.json();

    const updatedCustomerProfile = await prisma.customer.update({
      where: { userId: cookieUserInfo.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(customerType && { customerType }),
        ...(gamingLevel && { gamingLevel }),
        ...(primaryGames && { primaryGames }),
        ...(currentRanks && { currentRanks }),
        ...(gamingGoals && { gamingGoals }),
        ...(budgetRange && { budgetRange }),
        ...(preferredServiceTypes && { preferredServiceTypes }),
        ...(activityPattern && { activityPattern }),
        ...(learningStyle && { learningStyle }),
        ...(communicationPreference && { communicationPreference }),
        ...(peakHours && { peakHours }),
        ...(riskTolerance && { riskTolerance }),
      },
    });

    return NextResponse.json(updatedCustomerProfile, {status: 200})

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
