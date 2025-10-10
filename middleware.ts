import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ถ้าเป็นหน้า login ให้ผ่านได้
  if (pathname === "/") {
    return NextResponse.next()
  }

  // ตรวจสอบ session_cookie จาก backend
  const sessionCookie = request.cookies.get("session_cookie")
  
  console.log("Middleware - Path:", pathname)
  console.log("Middleware - All Cookies:", request.cookies.getAll())
  console.log("Middleware - Session Cookie:", sessionCookie?.value || "Not found")
  
  // ถ้าไม่มี session ให้ redirect ไป login
  if (!sessionCookie) {
    console.log("Middleware - Redirecting to login")
    return NextResponse.redirect(new URL("/", request.url))
  }

  // ให้ผ่านไป backend จะตรวจสอบ session ต่อ
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/account/:path*",
    "/dashboard/:path*",
    "/tasks/:path*",
    "/branches/:path*",
    "/department/:path*",
    "/phone/:path*",
    "/program/:path*",
    "/supervisor/:path*",
  ],
}