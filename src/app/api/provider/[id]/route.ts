import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 🔒 Verify JWT from cookie
    const cookieUserInfo = await verifyToken(request);
    if (!cookieUserInfo) {
      return NextResponse.json(
        { error: "User access is unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 📦 Fetch provider profile linked to logged-in user
    const providerProfile = await prisma.provider.findUnique({
      where: { userId: cookieUserInfo.id },
      include: {
        services: true, // optional: include if you want to return associated services
      },
    });

    if (!providerProfile) {
      return NextResponse.json(
        { error: "No provider profile found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json(providerProfile, { status: 200 });
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
      games,
      currentRanks,
      peakRanks,
      experienceYears,
      availabilityStatus,
      bio,
    } = await request.json();

    const updatedProviderProfile = await prisma.provider.update({
      where: { userId: cookieUserInfo?.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(games && { games }),
        ...(currentRanks && { currentRanks }),
        ...(peakRanks && { peakRanks }),
        ...(typeof experienceYears === "number" && { experienceYears }),
        ...(availabilityStatus && { availabilityStatus }),
        ...(bio && { bio }),
      },
    });

    return NextResponse.json(updatedProviderProfile, {status: 200});
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
