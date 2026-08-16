import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/session";

// Optimistic check only -- reads the cookie's signature, no DB round trip.
// The actual authoritative check (does this session still exist, hasn't
// been revoked) happens in lib/auth/dal.ts's getSession(), called from
// the protected pages themselves.
const protectedRoutes = ["/review"];
const authRoutes = ["/login", "/signup"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  const token = req.cookies.get("session")?.value;
  const session = await decrypt(token);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/review", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
