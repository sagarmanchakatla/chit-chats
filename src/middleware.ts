import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");

  if (!authToken && !request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
