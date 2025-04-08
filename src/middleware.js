import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token;
    },
  },
});

export async function middleware(request) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  const loginPath = "/login";
  const signupPath = "/signup";
  const dashboardPrefix = "/dashboard";
  const pdfPath = "/dashboard/uploadPdf";
  const quizPath = "/quiz";
  const mockPath = "/mocktest";
  const bookPath = "/bookmark";

  const pathname = request.nextUrl.pathname;

  if (session) {
    if (pathname === pdfPath && session.email !== "abc@gmail.com") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname === loginPath || pathname === signupPath) {
      return NextResponse.redirect(new URL("/dashboard/profile", request.url));
    }
  } else {
    // If not authenticated, restrict access to dashboard and quiz
    if (
      pathname.startsWith(dashboardPrefix) ||
      pathname === quizPath ||
      pathname === mockPath ||
      pathname === bookPath
    ) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/quiz",
    "/mocktest",
    "/bookmark",
  ],
};
