import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const response = NextResponse.json(
      { message: "Logout successful", success: true },
      { status: 200 }
    );

    // Clear the session cookie by setting it to an empty value and expiring it immediately. [1, 9]
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "Something went wrong.", success: false },
      { status: 500 }
    );
  }
};
