import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// เส้นทางที่ admin เท่านั้นเข้าได้
const adminOnlyPaths = ["/account", "/management/summary"]

export function middleware(request: NextRequest) {
  // อ่าน user จาก cookie (ควรเซ็ต cookie หลัง login)
  const userCookie = request.cookies.get("user")
  let user: { role?: string } | null = null
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie.value))
    } catch {}
  }

  const { pathname } = request.nextUrl

  // ถ้าไม่ login redirect ไปหน้า login
  if (!user?.role) {
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // ถ้าเป็น user ห้ามเข้า /account หรือ /management/summary
  if (user.role === "user" && adminOnlyPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/management", request.url))
  }

  // อื่นๆ เข้าได้ปกติ
  return NextResponse.next()
}

export const config = {
  matcher: ["/account", "/management/:path*"],
}
