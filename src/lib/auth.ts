import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'alrahma-store-super-secret-jwt-key-2026'
)
const COOKIE_NAME = 'alrahma_admin_session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CHANGE_ME'

export async function createAdminSession(): Promise<string> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  return token
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export async function getAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return false
    return verifyAdminSession(token)
  } catch {
    return false
  }
}

export { COOKIE_NAME }
