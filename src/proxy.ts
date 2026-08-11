import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession, COOKIE_NAME } from '@/lib/auth'

const PROTECTED_PATHS = ['/admin/dashboard', '/admin/orders', '/admin/products', '/admin/photo-orders']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminPath = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  if (!isAdminPath) return NextResponse.next()

  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  const valid = await verifyAdminSession(token)
  if (!valid) {
    const res = NextResponse.redirect(new URL('/admin', req.url))
    res.cookies.delete(COOKIE_NAME)
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
