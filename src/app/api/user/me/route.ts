import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    //-------------------------------------------
    // getting the user profile for the dashboard
    //-------------------------------------------

    // Decrypt the session from the cookie
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Invalid session " },
        {
          status: 401,
        }
      );
    }

    const userProfile = await prisma.user.findFirst({
      where: { id: session?.userId },
    });

    // format the data for the frontend
    console.log("user profile", userProfile);

    return NextResponse.json(userProfile);
  } catch (error) {
    console.log("something went wrong");
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong retrieving user profile" },
      {
        status: 400,
      }
    );
  }
}
