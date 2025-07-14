import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.json(
      { message: "Sucessfully logged out!" },
      { status: 201 }
    );
    
    res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Logout failed!" }, { status: 500 });
  }
}
