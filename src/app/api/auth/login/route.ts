// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const secret = process.env.JWT_SECRET!;

// export async function POST(request: NextRequest) {
//   const body = await request.json();

//   try {
//     const user = await prisma.user.findUnique({
//       where: { email: body.email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found!" }, { status: 404 });
//     }

//     const comparePassword = await bcrypt.compare(body.password, user.password);

//     if (comparePassword) {
//       const token = jwt.sign(
//         {
//           id: user.id,
//           email: user.email,
//           role: user.role,
//           // customerId: user.customer?.id,
//           // providerId: user.provider?.id,
//         },
//         secret,
//         {
//           expiresIn: "7d",
//         }
//       );

//       const response = NextResponse.json({
//         message: "login successful",
//       });

//       response.cookies.set("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7,
//       });

//       return response;
//     } else {
//       return NextResponse.json({ error: "Invalid credentials!" }, { status: 401 });
//     }
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }











































// /api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secret = process.env.JWT_SECRET!;
const secretKey = new TextEncoder().encode(secret); // jose requires Uint8Array

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid credentials!" }, { status: 401 });
    }

    // Sign token with jose
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secretKey);

    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};