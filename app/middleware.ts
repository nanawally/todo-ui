import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/tasks", "/trashcan", "/logout", "/about"];

export async function middleware(req: NextRequest) {
  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    const url = "http://localhost:8080/auth/check";
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });
    
    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*", "/trashcan/:path*", "/logout", "/about"],
};
