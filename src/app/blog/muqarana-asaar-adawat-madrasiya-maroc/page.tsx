import type { Metadata } from 'next'
import StorefrontLayout from '@/components/StorefrontLayout'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'مقارنة أسعار الأدوات المدرسية في المغرب 2026 — أين تشتري؟ | متجر الرحمة',
  description: 'مقارنة تفصيلية لأسعار الأدوات المدرسية في مختلف المتاجر المغربية 2026 مقابل متجر الرحمة. الأرقام الحقيقية للسوق المغربي.',
  alternates: { canonical: 'https://alrahma.store/blog/muqarana-asaar-adawat-madrasiya-maroc' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'مقارنة أسعار الأدوات المدرسية في المغرب: أين تشتري؟',
  datePublished: '2026-08-08',
  author: { '@type': 'Organization', name: 'متجر الرحمة', url: 'https://alrahma.store' },
  publisher: { '@type': 'Organization', name: 'متجر الرحمة', url: 'https://alrahma.store' },
  url: 'https://alrahma.store/blog/muqarana-asaar-adawat-madrasiya-maroc',
  inLanguage: 'ar-MA',
}

const COMPARISON = [
  { product: 'قلم جاف (الوحدة)', market: 4, us: 2, note: 'Express Orica' },
  { product: 'أقلام رصاص Maped × 12', market: 18, us: 4, note: 'Black Peps HB2' },
  { product: 'طقم هندسة (3 قطع)', market: 15, us: 7, note: 'Express 3-piece kit' },
  { product: 'بركار مدرسي', market: 18, us: 8, note: 'Express Junior' },
  { product: 'قلم تصحيح', market: 10, us: 5, note: 'Express Correcteur' },
  { product: 'ممحاة لوح', market: 7, us: 3.5, note: 'بقاعدة بلاستيكية' },
  { product: 'أقلام تلوين Maped × 12', market: 60, us: 30, note: 'Color Peps Mini' },
  { product: 'حقيبة مدرسية (أطفال)', market: 180, us: 99, note: 'شخصيات كرتونية' },
  { product: 'حقيبة مدرسية 3D', market: 250, us: 139, note: 'Kuromi / Stitch' },
  { product: 'حقيبة كبيرة (Frozen)', market: 450, us: 249, note: 'مع جميع الأكياس' },
]

export default function Article3() {
  const totalMarket = COMPARISON.reduce((s, p) => s + p.market, 0)
  const totalUs = COMPARISON.reduce((s, p) => s + p.us, 0)
  const totalSaving = totalMarket - totalUs
  const pct = Math.round((totalSaving / totalMarket) * 100)

  return (
    <StorefrontLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container section" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>← العودة للمدونة</Link>
        </div>
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}></div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1.4, marginBottom: '1rem' }}>
            مقارنة أسعار الأدوات المدرسية في المغرب: أين تشتري؟
          </h1>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
            <time dateTime="2026-08-08">8 أغسطس 2026</time><span>• 6 دقائق للقراءة</span>
          </div>
        </header>

        <div style={{ lineHeight: 2, fontSize: '1.05rem', color: 'var(--color-text-secondary)' }}>
          <p style={{ marginBottom: '2rem', fontWeight: 500, color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
            الأرقام لا تكذب. قارنّا أسعار أكثر من 10 منتجات مدرسية شائعة بين متجر الرحمة والسوق المغربي العام. النتائج مفاجئة.
          </p>

          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'السعر الإجمالي عندنا', value: `${totalUs} دهـ`, color: 'var(--color-primary)' },
              { label: 'سعر السوق الإجمالي', value: `${totalMarket} دهـ`, color: '#9ca3af' },
              { label: 'إجمالي التوفير', value: `${totalSaving} دهـ (${pct}%)`, color: 'var(--color-savings)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: '1.3rem', color }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', marginBottom: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--green-700)', color: 'white' }}>
                  <th style={{ padding: '0.875rem', textAlign: 'right' }}>المنتج</th>
                  <th style={{ padding: '0.875rem', textAlign: 'center' }}> السوق</th>
                  <th style={{ padding: '0.875rem', textAlign: 'center' }}> الرحمة</th>
                  <th style={{ padding: '0.875rem', textAlign: 'center' }}>التوفير</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => {
                  const saving = row.market - row.us
                  const pct = Math.round((saving / row.market) * 100)
                  return (
                    <tr key={row.product} style={{ background: i % 2 === 0 ? 'white' : 'var(--green-50)', borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>{row.product}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{row.note}</div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', textDecoration: 'line-through', color: '#9ca3af' }}>{row.market} دهـ</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--color-primary)', fontWeight: 800 }}>{row.us} دهـ</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span style={{ background: 'var(--green-100)', color: 'var(--green-700)', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}>{pct}%</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--green-100)', fontWeight: 900 }}>
                  <td style={{ padding: '0.875rem' }}>الإجمالي</td>
                  <td style={{ padding: '0.875rem', textAlign: 'center', textDecoration: 'line-through', color: '#9ca3af' }}>{totalMarket} دهـ</td>
                  <td style={{ padding: '0.875rem', textAlign: 'center', color: 'var(--color-primary)', fontSize: '1.1rem' }}>{totalUs} دهـ</td>
                  <td style={{ padding: '0.875rem', textAlign: 'center', color: 'var(--color-savings)', fontSize: '1.1rem' }}>{pct}%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p style={{ marginBottom: '1.5rem' }}>
            <strong style={{ color: 'var(--color-primary)' }}>الخلاصة:</strong> لو اشتريت كل هذه المنتجات من السوق العادي دفعتَ {totalMarket} درهم. 
            في متجر الرحمة، ستدفع {totalUs} درهم فقط — <strong style={{ color: 'var(--color-savings)' }}>توفير {totalSaving} درهم</strong>.
          </p>

          <div style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-800))', color: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.75rem', color: 'white' }}>تحقق من المقارنة بنفسك</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link href="/savings" className="btn" style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 800 }} id="article3-savings-btn"> جدول المقارنة</Link>
              <Link href="/products" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.5)' }} id="article3-shop-btn">️ تسوق الآن</Link>
            </div>
          </div>
        </div>
      </article>
    </StorefrontLayout>
  )
}
