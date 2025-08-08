import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/sessions";
// You will need a session library like next-auth or iron-session
// to manage the login state. This example assumes a concept of creating a session.

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 1. Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 2. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 3. CRITICAL: Check if the user has the ADMIN role
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Access Denied: Not an administrator." },
        { status: 403 }
      );
    }
    // create the session
    await createSession(user.id, user.role);

    // 4. Login successful: Create a session/token for the user
    // The implementation details here depend on your auth library (e.g., NextAuth, JWT)
    // For this example, we'll just return a success message.
    // In a real app, you'd set a cookie or return a JWT here.

    return NextResponse.json(
      { message: "Login successful!", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
