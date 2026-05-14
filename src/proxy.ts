import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/get-session";

export async function proxy(request: NextRequest) {
  const session = await getSession();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/checkout/:path*", "/admin/:path*"],
};
