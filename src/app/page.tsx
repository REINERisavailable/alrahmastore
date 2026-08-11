import type { Metadata } from 'next'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import StorefrontLayout from '@/components/StorefrontLayout'
import CountdownTimer from '@/components/CountdownTimer'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/supabase'

export const revalidate = 3600 // ISR: re-generate every hour

export const metadata: Metadata = {
  title: 'متجر الرحمة | أرخص أدوات مدرسية في المغرب - أسعار من 3 دراهم',
  description:
    'اشتري أدواتك المدرسية بأرخص الأسعار في المغرب. دفاتر، أقلام، مقالم وأكثر. أسعار تبدأ من 3 دراهم فقط. توصيل لجميع أنحاء المغرب. وفّر أكثر من 70% مقارنة بالمتاجر الأخرى.',
  alternates: { canonical: 'https://alrahma.store' },
}

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return data || []
}

const FAQ_ITEMS = [
  {
    q: 'ما هو أرخص متجر للأدوات المدرسية في المغرب؟',
    a: 'متجر الرحمة هو الأرخص في المغرب. أسعارنا تبدأ من 3 دراهم فقط للمنتج الواحد، مع ضمان الجودة وتوصيل لجميع أنحاء المغرب.',
  },
  {
    q: 'كيف يعمل التوصيل؟',
    a: 'نوصّل لجميع أنحاء المغرب. الطلبات فوق 100 درهم التوصيل مجاني. الطلبات الأقل تتراوح رسوم التوصيل بين 15 و35 درهم تُحدد عند التأكيد.',
  },
  {
    q: 'كيف أؤكد طلبي؟',
    a: 'بعد إرسال طلبك، نتصل بك على رقم واتساب الذي أدخلته لتأكيد الطلب وتحديد رسوم التوصيل إذا لزم.',
  },
  {
    q: 'هل يمكنني إرسال صورة قائمة مستلزماتي؟',
    a: 'نعم! يمكنك تصوير قائمة مستلزماتك المدرسية وإرسالها لنا مباشرة من خلال صفحة "اطلب بصورة" ونتواصل معك بالأسعار.',
  },
  {
    q: 'ما الفرق بين أسعاركم وأسعار المتاجر الأخرى؟',
    a: 'أسعارنا أقل بنسبة 50% إلى 80% من أسعار المتاجر العادية في المغرب. مثلاً الدفتر المدرسي عندنا بـ3 دراهم بينما في المتاجر الأخرى بـ10 دراهم أو أكثر.',
  },
]

export default async function HomePage() {
  const products = await getFeaturedProducts()

  const totalSavingsExample = products.reduce((sum, p) => {
    if (p.competitor_price && p.competitor_price > p.price) {
      return sum + (p.competitor_price - p.price)
    }
    return sum
  }, 0)

  return (
    <StorefrontLayout>
      {/* ===== HERO ===== */}
      <section className="hero" aria-label="الصفحة الرئيسية">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'var(--green-100)',
              color: 'var(--green-800)',
              padding: '0.375rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              🔥 عروض حصرية — ينتهي قريبًا!
            </span>
          </div>

          <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            أرخص متجر للأدوات المدرسية<br />
            <span style={{ color: 'var(--green-800)' }}>في المغرب 🇲🇦</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            أسعار تبدأ من <strong style={{ color: 'var(--color-primary)' }}>3 دراهم فقط</strong> — وفّر أكثر من 70% مقارنة بالمتاجر الأخرى. توصيل لجميع أنحاء المغرب.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a href="/products" className="btn btn-primary btn-lg" id="shop-now-hero">
              🛍️ تسوق الآن
            </a>
            <a href="/order-by-photo" className="btn btn-outline btn-lg" id="order-by-photo-hero">
              📸 اطلب بصورة
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {[
              { icon: '🚚', text: 'توصيل لجميع المغرب' },
              { icon: '💰', text: 'وفّر أكثر من 70%' },
              { icon: '📞', text: 'تأكيد بواتساب' },
              { icon: '✅', text: 'جودة مضمونة' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Countdown */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
              ⏰ العروض تنتهي خلال:
            </p>
            <Suspense fallback={<div style={{ height: 80 }} />}>
              <CountdownTimer />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ===== SAVINGS PITCH ===== */}
      <section style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-900))', padding: '2rem 0', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            {[
              { value: 'من 3 دراهم', label: 'أدنى سعر في المغرب' },
              { value: '70%+', label: 'توفير مقارنة بالمتاجر' },
              { value: 'مجاني', label: 'توصيل فوق 100 درهم' },
              { value: '100%', label: 'نتواصل لتأكيد طلبك' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.375rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section" aria-label="أحدث المنتجات">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2>⭐ أحدث المنتجات</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                أرخص الأسعار في المغرب مع ضمان التوفير
              </p>
            </div>
            <a href="/products" className="btn btn-outline" id="view-all-products">
              عرض الكل ←
            </a>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              <p>سيتم إضافة المنتجات قريبًا</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href="/products" className="btn btn-primary btn-lg" id="browse-all-bottom">
              🛍️ تصفح جميع المنتجات
            </a>
          </div>
        </div>
      </section>

      {/* ===== PHOTO ORDER CTA ===== */}
      <section style={{ background: 'var(--green-50)', padding: '3rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
          <h2 style={{ marginBottom: '0.75rem' }}>عندك قائمة مدرسية؟</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            صوّر قائمة مستلزماتك المدرسية وارسلها لنا. سنتواصل معك بالأسعار والتفاصيل على واتساب.
          </p>
          <a href="/order-by-photo" className="btn btn-primary btn-lg" id="photo-order-section-cta">
            📸 اطلب بصورة الآن
          </a>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="section" aria-label="لماذا تشتري منا">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            لماذا متجر الرحمة؟
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '💸', title: 'الأسعار الأقل في المغرب', desc: 'نوفر لك أكثر من 70% مقارنة بأسعار السوق. دفتر بـ3 دراهم بدل 10.' },
              { icon: '🚚', title: 'توصيل لجميع أنحاء المغرب', desc: 'نوصّل لكل مدن المغرب. مجاني للطلبات فوق 100 درهم.' },
              { icon: '📱', title: 'تأكيد بواتساب', desc: 'نتصل بك على واتساب لتأكيد طلبك وضمان وصوله بأمان.' },
              { icon: '📸', title: 'اطلب بصورة', desc: 'صوّر قائمتك المدرسية وارسلها لنا. بدون تعقيد.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: 'var(--green-50)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ (JSON-LD injected) ===== */}
      <section className="section" style={{ background: 'var(--green-50)', borderTop: '1px solid var(--color-border)' }} aria-label="أسئلة شائعة">
        <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>أسئلة شائعة</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQ_ITEMS.map(({ q, a }) => (
              <details
                key={q}
                style={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                }}
              >
                <summary style={{ fontWeight: 700, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  {q}
                  <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginRight: '0.5rem' }}>+</span>
                </summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* FAQ JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            }),
          }}
        />
      </section>
    </StorefrontLayout>
  )
}
