import type { Metadata } from 'next'
import StorefrontLayout from '@/components/StorefrontLayout'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'أفضل الأدوات المدرسية بأرخص الأسعار في المغرب 2026 — متجر الرحمة',
  description: 'دليل شامل لأفضل وأرخص الأدوات المدرسية في المغرب لموسم 2026. قلم من 2 دراهم، دفتر من 3 دراهم، وفّر أكثر من 70% مقارنة بالمتاجر العادية.',
  alternates: { canonical: 'https://alrahma.store/blog/adawat-madrasiya-rakhisa-maroc-2026' },
  openGraph: { title: 'أفضل الأدوات المدرسية بأرخص الأسعار في المغرب 2026', description: 'وفّر أكثر من 70% على الأدوات المدرسية', locale: 'ar_MA' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'أفضل الأدوات المدرسية بأرخص الأسعار في المغرب 2026',
  datePublished: '2026-08-01',
  author: { '@type': 'Organization', name: 'متجر الرحمة', url: 'https://alrahma.store' },
  publisher: { '@type': 'Organization', name: 'متجر الرحمة', url: 'https://alrahma.store' },
  url: 'https://alrahma.store/blog/adawat-madrasiya-rakhisa-maroc-2026',
  description: 'دليل شامل لأفضل وأرخص الأدوات المدرسية في المغرب 2026',
  inLanguage: 'ar-MA',
  about: { '@type': 'Thing', name: 'الأدوات المدرسية في المغرب' },
}

export default function Article1() {
  return (
    <StorefrontLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container section" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>← العودة للمدونة</Link>
        </div>
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📚</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1.4, marginBottom: '1rem' }}>
            أفضل الأدوات المدرسية بأرخص الأسعار في المغرب 2026
          </h1>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
            <time dateTime="2026-08-01">1 أغسطس 2026</time>
            <span>• 5 دقائق للقراءة</span>
            <span>• متجر الرحمة</span>
          </div>
        </header>

        <div style={{ lineHeight: 2, fontSize: '1.05rem', color: 'var(--color-text-secondary)' }}>
          <p style={{ marginBottom: '1.5rem', fontWeight: 500, color: 'var(--color-text-primary)', fontSize: '1.15rem' }}>
            مع بداية كل موسم دراسي، تجد الأسر المغربية نفسها أمام فاتورة مدرسية ثقيلة. في هذا الدليل، نكشف لك عن أفضل الأدوات المدرسية بأرخص الأسعار في المغرب لعام 2026.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>🖊️ الأقلام: من 2 درهم للقلم</h2>
          <p style={{ marginBottom: '1rem' }}>القلم الجاف هو أساس كل حقيبة مدرسية. في المتاجر التقليدية، يتراوح سعر القلم الواحد بين 4 و8 دراهم. في <strong>متجر الرحمة</strong>، نبيع القلم الجاف Express Orica بـ <strong style={{ color: 'var(--color-primary)' }}>2 درهم فقط</strong>.</p>
          <p style={{ marginBottom: '1.5rem' }}>إذا احتاج طفلك 5 أقلام في الموسم، <strong style={{ color: 'var(--color-savings)' }}>توفر 10 إلى 30 درهم على الأقلام وحدها.</strong></p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>📐 أدوات الهندسة: طقم كامل من 7 دراهم</h2>
          <p style={{ marginBottom: '1.5rem' }}>طقم الهندسة (مسطرة + منقلة + مثلثة) يُباع في المتاجر بـ 15 إلى 25 درهم. عندنا <strong style={{ color: 'var(--color-primary)' }}>من 7 دراهم</strong> — نفس الجودة، ثمن مختلف تماماً.</p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>🎒 الحقائب: خيارات لكل ميزانية</h2>
          <p style={{ marginBottom: '1.5rem' }}>الحقيبة المدرسية هي أغلى مشتريات الموسم. نقدم ثلاث فئات:
          </p>
          <ul style={{ paddingRight: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem' }}><strong>الاقتصادية (99 درهم):</strong> حقائب بشخصيات كرتونية للمرحلة الابتدائية — السوق يبيعها بـ 180 درهم</li>
            <li style={{ marginBottom: '0.75rem' }}><strong>المتوسطة (139 درهم):</strong> حقائب 3D Kuromi/Stitch — السوق يبيعها بـ 250 درهم</li>
            <li style={{ marginBottom: '0.75rem' }}><strong>الممتازة (249-259 درهم):</strong> حقائب كبيرة عالية الجودة — السوق يبيعها بـ 450-480 درهم</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>💡 نصائح للتوفير في 2026</h2>
          <ol style={{ paddingRight: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>اطلب فوق 100 درهم للحصول على توصيل مجاني</li>
            <li style={{ marginBottom: '0.75rem' }}>اجمع طلب العائلة (أشقاء عدة) في طلب واحد لتوفير رسوم التوصيل</li>
            <li style={{ marginBottom: '0.75rem' }}>استخدم ميزة "اطلب بصورة" — صوّر قائمة المستلزمات وأرسلها وسنتولى الباقي</li>
            <li style={{ marginBottom: '0.75rem' }}>اشترِ أقلام الرصاص بعلبة (12 قلم من Maped بـ 4 دراهم بدل شراء أقلام فردية)</li>
          </ol>

          <div style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-800))', color: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center', marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.75rem', color: 'white' }}>ابدأ التوفير الآن</h3>
            <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>كل منتجاتنا بأسعار الجملة مباشرة لك</p>
            <Link href="/products" className="btn" style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 800 }} id="article1-shop-btn">🛍️ تسوق الآن</Link>
          </div>
        </div>
      </article>
    </StorefrontLayout>
  )
}
