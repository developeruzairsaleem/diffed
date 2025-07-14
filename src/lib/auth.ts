
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secretKey);
    return payload as {
      id: string;
      email: string;
      role: string;
    };
  } catch (err) {
    return null;
  }
}

