import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Retrieve the session token using getToken
  const session = await getToken({ req: request });

  // Define paths for login, signup, and dashboard
  const loginPath = "/login";
  const signupPath = "/signup";
  const dashboardPath = "/dashboard";

  // Check if user is authenticated
  if (session) {
    // If authenticated, redirect from login/signup to dashboard
    if (
      request.nextUrl.pathname === loginPath ||
      request.nextUrl.pathname === signupPath
    ) {
      return NextResponse.redirect(new URL("/dashboard/profile", request.url));
    }
  } else {
    // If not authenticated, restrict access to dashboard
    if (request.nextUrl.pathname === dashboardPath) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  // Allow the request to proceed if none of the conditions matched
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard"], // Specify protected routes
};
