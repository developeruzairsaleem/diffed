import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/sessions";

// Public routes accessible without auth
const publicRoutes = [
  "/",
  "/cs2",
  "/fornite",
  "/gamer-girl",
  "/league-of-legends",
  "/marvel-rivals",
  "/valorant",
  "/login",
  "/register",
];

const protectedRoutes = [
  "/dashboard",
  "/dashboard/customer",
  "/dashboard/provider",
  "/sample-page",
];

// Secret key for verifying token
// const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // check if the route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // the route is accessible to logged out users
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // redirect the user to login if the user is not authenticated
  if (isProtected && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // if is admin route than check for admin role
  if (pathname.startsWith("/admin")) {
    // if (session?.role === "admin") {
    return NextResponse.next();
    // } else {
    // return NextResponse.redirect("/login");
    // }
  }

  // Allow authenticated users to access protected routes with role-based restrictions
  if (isProtected && session?.userId) {
    // Prevent customers from accessing provider dashboard
    if (
      pathname.startsWith("/dashboard/provider") &&
      session.role === "customer"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard/customer", request.nextUrl)
      );
    }

    // Prevent providers from accessing customer dashboard
    if (
      pathname.startsWith("/dashboard/customer") &&
      session.role === "provider"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard/provider", request.nextUrl)
      );
    }

    return NextResponse.next();
  }

  // Redirect authenticated users from public routes to their dashboard
  if (
    isPublic &&
    session?.userId &&
    !request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    if (session.role === "customer") {
      return NextResponse.redirect(
        new URL("/dashboard/customer", request.nextUrl)
      );
    }
    if (session.role === "provider") {
      return NextResponse.redirect(
        new URL("/dashboard/provider", request.nextUrl)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)"],
};
