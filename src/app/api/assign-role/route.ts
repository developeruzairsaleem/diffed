import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// Assuming you use NextAuth.js
// import { authOptions } from "@/lib/auth"; // Your NextAuth options
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  // 1. Authenticate the user making the request
  // This is a placeholder for your actual auth logic (e.g., NextAuth.js)
  // const session = await getServerSession(authOptions);
  const session = (await cookies()).get("session")?.value;
  const userSession = await decrypt(session);
  // 2. Authorize the request: Only an ADMIN can assign roles.
  if (userSession?.role !== "admin") {
    return NextResponse.json(
      {
        error: "Forbidden: You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  try {
    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "userId and newRole are required." },
        { status: 400 }
      );
    }

    // Ensure the role is a valid one from our Enum
    if (!["customer", "provider", "admin"].includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role specified." },
        { status: 400 }
      );
    }

    // 3. Update the user's role in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, email: true, role: true }, // Don't return the password
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error assigning role:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
