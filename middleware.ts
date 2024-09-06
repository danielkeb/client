import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./app/lib/auth";

export default async function middleware(req: NextRequest) {
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/forgot-password") ||
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  let userRole;
  let verifiedToken;
  if (!isAuthRoute) {
    verifiedToken = await verifyAuth(req).catch((err) => {
      console.error(err.message);
    });

    userRole = verifiedToken?.role;
  }

  if (isAdminRoute) {
    // Admin routes
    if (userRole === "Admin") {
      // Authorized admin, continue
      return NextResponse.next();
    } else {
      // Unauthorized user, redirect to home
      return NextResponse.redirect(
        new URL(
          "/home?status=NOT_STARTED&time=BOTH&location=ALL",
          req.nextUrl.origin,
        ),
      );
    }
  } else if (isAuthRoute) {
    if (verifiedToken) {
      // Authenticated user trying to access auth pages, redirect to home
      return NextResponse.redirect(
        new URL(
          "/home?status=NOT_STARTED&time=BOTH&location=ALL",
          req.nextUrl.origin,
        ),
      );
    } else {
      return NextResponse.next();
    }
  } else {
    // Other routes
    if (verifiedToken) {
      if (userRole === "Admin" && !isAdminRoute) {
        return NextResponse.redirect(
          new URL("/admin/dashboard", req.nextUrl.origin),
        );
      }
      // Authenticated user, continue
      return NextResponse.next();
    } else {
      // Unauthenticated user, redirect to /sign-in
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
    }
  }
}

export const config = {
  matcher: [
    "/home",
    "/o/:path*",
    "/projects/:path*",
    "/v/:path*",
    "/forgot-password",
    "/sign-in",
    "/sign-up",
    "/admin/:path*",
  ],
};
