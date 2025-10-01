import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// เส้นทางที่ admin เท่านั้นเข้าได้
const adminOnlyPaths = ["/account"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ถ้าเป็นหน้า login ให้ผ่านได้
  if (pathname === "/") {
    return NextResponse.next()
  }

  // อ่าน user จาก cookie
  const userCookie = request.cookies.get("user")
  let user: { role?: string } | null = null
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie.value))
    } catch {}
  }

  // ถ้าไม่มี user ใน cookie ให้ผ่านไปก่อน (จะตรวจสอบใน client-side)
  if (!user?.role) {
    return NextResponse.next()
  }

  // ถ้าเป็น user ห้ามเข้า /account
  if (user.role === "user" && adminOnlyPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/reports", request.url))
  }

  // อื่นๆ เข้าได้ปกติ
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
