import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/sessions";

// 1. DEFINE YOUR ROUTES

/**
 * Routes that are only for unauthenticated users (e.g., login, register).
 * Logged-in users will be redirected away from these.
 */
const authRoutes = ["/login", "/register"];

/**
 * The home/dashboard route for each user role.
 * Used for redirecting users after login or when they access wrong pages.
 */
const roleHomepages = {
  customer: "/dashboard/customer",
  provider: "/dashboard/provider",
  admin: "/admin",
};

/**
 * The protected route prefixes for each role.
 * This is crucial for access control.
 */
const protectedRoutePrefixes = {
  customer: "/dashboard/customer",
  provider: "/dashboard/provider",
  admin: "/admin",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. GET THE USER'S SESSION
  const cookie = (await cookies()).get("session")?.value;
  // The 'session' can be null if the cookie is invalid or not present
  const session = await decrypt(cookie);

  // 3. LOGGED-IN USER ON AN AUTH-ONLY ROUTE
  // If the user is logged in and tries to visit /login or /register,
  // redirect them to their respective dashboard homepage.
  if (session && authRoutes.includes(pathname)) {
    const homeUrl = roleHomepages[session?.role] || "/";
    return NextResponse.redirect(new URL(homeUrl, request.url));
  }

  // 4. PROTECTED ROUTE ACCESS CONTROL

  // Determine if the user is trying to access a protected area
  const isAccessingCustomerArea = pathname.startsWith(
    protectedRoutePrefixes.customer
  );
  const isAccessingProviderArea = pathname.startsWith(
    protectedRoutePrefixes.provider
  );
  const isAccessingAdminArea = pathname.startsWith(
    protectedRoutePrefixes.admin
  );
  const isAccessingProtectedRoute =
    isAccessingCustomerArea || isAccessingProviderArea || isAccessingAdminArea;

  if (isAccessingProtectedRoute) {
    // Case A: User is NOT logged in
    if (!session?.userId) {
      // Redirect unauthenticated users to the login page, but keep track of where they wanted to go.
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Case B: User IS logged in but is accessing the WRONG dashboard
    if (session.role === "customer" && !isAccessingCustomerArea) {
      return NextResponse.redirect(
        new URL(roleHomepages.customer, request.url)
      );
    }
    if (session.role === "provider" && !isAccessingProviderArea) {
      return NextResponse.redirect(
        new URL(roleHomepages.provider, request.url)
      );
    }
    if (session.role === "admin" && !isAccessingAdminArea) {
      return NextResponse.redirect(new URL(roleHomepages.admin, request.url));
    }
  }

  // 5. IF NONE OF THE ABOVE, PROCEED
  // This covers:
  // - Authenticated users accessing their correct dashboard.
  // - Any user (auth or not) accessing a truly public page (like /, /valorant, etc.).
  return NextResponse.next();
}

// Do not change this config
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)"],
};
