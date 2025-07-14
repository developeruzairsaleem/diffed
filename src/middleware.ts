import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes accessible without auth
const publicRoutes = [
  "/",
  "/cs2",
  "/fornite",
  "/gamer-girl",
  "/league-of-legends",
  "/marvel-rivals",
  "/valorant",
  // "/login",
  // "/register",
  "/api/auth/register",
  "/api/auth/login",
];

// Secret key for verifying token
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  let user: any = null;

  // Try verifying the JWT token
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      user = payload;
      // console.log("User from token:", user);
    } catch (err) {
      console.warn("Token verification failed:", err);
    }
  }

  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 🔒 Always block /admin unless logged in as admin
  if (pathname.startsWith("/admin")) {
    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If route is public, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If route is private and no user is found, redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
