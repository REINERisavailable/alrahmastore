import type { Metadata } from 'next'
import StorefrontLayout from '@/components/StorefrontLayout'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'كيف توفر أكثر من 50% على لوازم الدراسة في المغرب — متجر الرحمة',
  description: 'أسرار التسوق الذكي للأدوات المدرسية في المغرب 2026. خطوات عملية لتخفيض فاتورة الدراسة لأكثر من النصف مع متجر الرحمة.',
  alternates: { canonical: 'https://alrahma.store/blog/tawfir-50-lazim-dirasa-maroc' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'كيف توفر أكثر من 50% على لوازم الدراسة في المغرب',
  datePublished: '2026-08-05',
  author: { '@type': 'Organization', name: 'متجر الرحمة', url: 'https://alrahma.store' },
  publisher: { '@type': 'Organization', name: 'متجر الرحمة', url: 'https://alrahma.store' },
  url: 'https://alrahma.store/blog/tawfir-50-lazim-dirasa-maroc',
  inLanguage: 'ar-MA',
}

export default function Article2() {
  return (
    <StorefrontLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container section" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>← العودة للمدونة</Link>
        </div>
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💰</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1.4, marginBottom: '1rem' }}>
            كيف توفر أكثر من 50% على لوازم الدراسة في المغرب
          </h1>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
            <time dateTime="2026-08-05">5 أغسطس 2026</time><span>• 7 دقائق للقراءة</span>
          </div>
        </header>

        <div style={{ lineHeight: 2, fontSize: '1.05rem', color: 'var(--color-text-secondary)' }}>
          <p style={{ marginBottom: '1.5rem', fontWeight: 500, color: 'var(--color-text-primary)', fontSize: '1.15rem' }}>
            الأسرة المغربية تنفق في المتوسط بين 500 و1500 درهم على اللوازم المدرسية لكل طفل. هذا المبلغ يمكن تخفيضه إلى النصف أو أقل بخطوات بسيطة.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>الخطوة 1: اكتب القائمة قبل التسوق</h2>
          <p style={{ marginBottom: '1.5rem' }}>التسوق بدون قائمة = إنفاق زائد. اكتب قائمة المستلزمات المطلوبة بالضبط وانضبط بها. بعض المدارس المغربية ترسل قائمة جاهزة — استغلها.</p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>الخطوة 2: اشترِ عبر الإنترنت</h2>
          <p style={{ marginBottom: '1.5rem' }}>المتاجر الإلكترونية كـ<strong>متجر الرحمة</strong> توفر أسعاراً أقل بكثير من المتاجر الفيزيائية — لأنها لا تتحمل تكاليف الإيجار والموظفين. الفرق يصل إلى <strong style={{ color: 'var(--color-savings)' }}>70%</strong> في بعض المنتجات.</p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>الخطوة 3: اجمع الطلبات مع الجيران</h2>
          <p style={{ marginBottom: '1.5rem' }}>إذا كان لديك جيران أو أقارب يحتاجون أيضاً للمستلزمات المدرسية، اجمعوا طلباتكم في طلب واحد فوق 100 درهم. <strong style={{ color: 'var(--color-savings)' }}>التوصيل يصبح مجاناً</strong> وتوفرون رسوم الشحن.</p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>الخطوة 4: اشترِ بالكميات</h2>
          <p style={{ marginBottom: '1rem' }}>الأقلام والممحيات والأوراق — اشترِها بكميات أكبر. السعر أقل لكل وحدة، وتوفر رحلات التسوق المتكررة.</p>
          <p style={{ marginBottom: '1.5rem' }}>مثال: علبة 12 قلم رصاص Maped بـ <strong style={{ color: 'var(--color-primary)' }}>4 دراهم</strong> بدل شراء 12 قلم مفرد بـ 1.5 درهم للقلم = <strong style={{ color: 'var(--color-savings)' }}>توفير 14 درهم</strong>.</p>

          <div style={{ background: 'var(--green-50)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary)' }}>💡 مثال حساب حقيقي</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--green-200)' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>المنتج</th>
                  <th style={{ padding: '0.5rem' }}>السوق</th>
                  <th style={{ padding: '0.5rem', color: 'var(--color-primary)' }}>الرحمة</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['قلم جاف × 5', '20 دهـ', '10 دهـ'],
                  ['أقلام رصاص × 12', '18 دهـ', '4 دهـ'],
                  ['حقيبة مدرسية', '250 دهـ', '139 دهـ'],
                  ['طقم هندسة', '25 دهـ', '7 دهـ'],
                  ['بركار', '18 دهـ', '8 دهـ'],
                ].map(([item, market, us]) => (
                  <tr key={item} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.5rem' }}>{item}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', textDecoration: 'line-through', color: '#9ca3af' }}>{market}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--color-primary)', fontWeight: 800 }}>{us}</td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--green-100)', fontWeight: 900 }}>
                  <td style={{ padding: '0.5rem' }}>الإجمالي</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', textDecoration: 'line-through', color: '#9ca3af' }}>331 دهـ</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--color-savings)', fontSize: '1.1rem' }}>168 دهـ</td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'center', marginTop: '0.75rem', fontWeight: 800, color: 'var(--color-savings)', fontSize: '1.1rem' }}>✅ توفير 163 درهم = 49%</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-800))', color: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.75rem', color: 'white' }}>جرّب الحساب بنفسك</h3>
            <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>أضف منتجاتك وشاهد التوفير تلقائياً</p>
            <Link href="/savings" className="btn" style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 800 }} id="article2-savings-btn">📊 صفحة المقارنة</Link>
          </div>
        </div>
      </article>
    </StorefrontLayout>
  )
}
