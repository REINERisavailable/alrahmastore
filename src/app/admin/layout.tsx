'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin/dashboard',    icon: '', label: 'لوحة التحكم' },
  { href: '/admin/orders',       icon: '', label: 'الطلبات' },
  { href: '/admin/photo-orders', icon: '', label: 'طلبات الصور' },
  { href: '/admin/products',     icon: '', label: 'المنتجات' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '1.5rem 1rem 1rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', marginBottom: '0.25rem' }}> متجر الرحمة</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>لوحة الإدارة</div>
        </div>

        <nav style={{ flex: 1, padding: '0.5rem 0' }}>
          {NAV_ITEMS.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`admin-nav-link ${pathname.startsWith(href) ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem' }}>
          <Link
            href="/"
            style={{ display: 'block', padding: '0.625rem 0.875rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '0.5rem' }}
            target="_blank"
          >
             عرض المتجر
          </Link>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '0.625rem 0.875rem', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-arabic)', fontSize: '0.875rem', textAlign: 'right' }}
            id="admin-logout-btn"
          >
             خروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
