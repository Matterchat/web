import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req: any) => {
  const isLoggedIn = !!req.auth;
  const isPublicRoute = !req.nextUrl.pathname.startsWith("/app");

  if (isLoggedIn || isPublicRoute) return NextResponse.next();

  const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

  return NextResponse.redirect(signInUrl);
});

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
