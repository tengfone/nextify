import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;
  // Allow request if following are true..
  // 1. Request for next auth session
  // 2. Token exist

  // Redirect if already logged in
  // if (pathname.includes("/login") && token) {
  //   return NextResponse.redirect("/");
  // }

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect to login if no taken and requesting protect route
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
