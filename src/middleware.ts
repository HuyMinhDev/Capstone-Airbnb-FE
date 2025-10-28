import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Nếu chưa có token và đi vào trang cấm
  if (
    !token &&
    pathname !== "/" &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register")
  ) {
    // ⚠️ Không redirect, cho qua để client-side xử lý popup
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
