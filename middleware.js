import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const session = await getToken({ req: request });

  const loginPath = "/login";
  const signupPath = "/signup";
  const dashboardPrefix = "/dashboard";
  const quizPath = "/quiz";

  const pathname = request.nextUrl.pathname;

  if (session) {
    // If authenticated, redirect away from login or signup
    if (pathname === loginPath || pathname === signupPath) {
      return NextResponse.redirect(new URL("/dashboard/profile", request.url));
    }
  } else {
    // If not authenticated, restrict access to dashboard and quiz
    if (pathname.startsWith(dashboardPrefix) || pathname === quizPath) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*", "/quiz"],
};
