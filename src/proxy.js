import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (request.nextUrl.pathname === "/user-auth" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && request.nextUrl.pathname !== "/user-auth") {
    return NextResponse.redirect(new URL("/user-auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Niche na paths sivay badha routes protect thase:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder ni images (png, jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};

export default proxy;
