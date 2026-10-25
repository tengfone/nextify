import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Moved from pages/_middleware.js (Next.js 12.0 beta middleware) to the root
// middleware.js used by Next.js 12.2+.
export async function middleware(req) {
  // Token exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;
  // Allow request if following are true..
  // 1. Request for next auth session
  // 2. Token exist

  // Redirect if already logged in
  // if (pathname.includes("/login") && token) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect to login if no taken and requesting protect route
  if (!token && pathname !== "/login") {
    // Redirects need an absolute URL since Next.js 12.1
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  // Don't run on Next.js build assets (the old pages/_middleware never ran on them either)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
