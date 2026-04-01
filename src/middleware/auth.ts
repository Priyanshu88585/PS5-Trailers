import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      const role = token?.role as string;
      if (role !== "admin" && role !== "superadmin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Rate limiting headers
    const res = NextResponse.next();
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    return res;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Public routes — no auth needed
        if (
          pathname === "/" ||
          pathname.startsWith("/video") ||
          pathname.startsWith("/category") ||
          pathname.startsWith("/search") ||
          pathname.startsWith("/api/videos") ||
          pathname.startsWith("/api/search") ||
          pathname.startsWith("/api/trending") ||
          pathname.startsWith("/api/comment") ||
          pathname.startsWith("/auth") ||
          pathname.startsWith("/_next") ||
          pathname.includes(".")
        ) {
          return true;
        }
        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|videos).*)",
  ],
};
