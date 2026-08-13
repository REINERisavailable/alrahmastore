import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--green-900)',
      color: 'rgba(255,255,255,0.85)',
      padding: '3rem 0 1.5rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem' }}>
               متجر الرحمة
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.7', opacity: 0.75 }}>
              أرخص متجر للأدوات المدرسية في المغرب. أسعار تبدأ من 3 دراهم. توصيل لجميع أنحاء المغرب.
            </p>
            <a
              href="https://wa.me/212603323433"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                marginTop: '1rem', background: '#25D366', color: 'white',
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
              }}
            >
               واتساب
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.75rem' }}>روابط سريعة</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/products', label: 'جميع المنتجات' },
                { href: '/order-by-photo', label: ' اطلب بصورة' },
                { href: '/savings', label: 'مقارنة الأسعار' },
                { href: '/about', label: 'من نحن' },
                { href: '/blog', label: 'المقالات' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.15s' }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.75rem' }}>التوصيل</h4>
            <ul style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', opacity: 0.75 }}>
              <li> توصيل لجميع أنحاء المغرب</li>
              <li> مجاني للطلبات فوق 100 درهم</li>
              <li> 15 إلى 35 درهم للطلبات الأقل</li>
              <li> نتواصل معك لتأكيد الطلب</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.8rem',
          opacity: 0.6,
        }}>
          <p> {new Date().getFullYear()} متجر الرحمة — جميع الحقوق محفوظة</p>
          <p>alrahma.store</p>
        </div>
      </div>
    </footer>
  )
}
