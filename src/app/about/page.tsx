import type { Metadata } from 'next'
import StorefrontLayout from '@/components/StorefrontLayout'

export const metadata: Metadata = {
  title: 'من نحن — متجر الرحمة | أرخص متجر للأدوات المدرسية في المغرب',
  description: 'تعرف على قصة متجر الرحمة — أرخص متجر للأدوات المدرسية في المغرب. أسعار تبدأ من 3 دراهم، توصيل لجميع أنحاء المغرب، وفورات تصل لـ 70% مقارنة بالسوق.',
  alternates: { canonical: 'https://alrahma.store/about' },
  openGraph: {
    title: 'من نحن — متجر الرحمة',
    description: 'أرخص متجر للأدوات المدرسية في المغرب عبر الإنترنت.',
    url: 'https://alrahma.store/about',
    locale: 'ar_MA',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'متجر الرحمة',
  alternateName: 'AlRahma Store',
  url: 'https://alrahma.store',
  logo: 'https://alrahma.store/logo.png',
  description: 'أرخص متجر للأدوات المدرسية في المغرب. توصيل لجميع أنحاء المغرب.',
  areaServed: { '@type': 'Country', name: 'Morocco' },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+212603323433',
    contactType: 'customer service',
    availableLanguage: ['Arabic', 'French'],
  },
  sameAs: ['https://wa.me/212603323433'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'ما هو أرخص متجر للأدوات المدرسية في المغرب؟',
      acceptedAnswer: { '@type': 'Answer', text: 'متجر الرحمة هو أرخص متجر للأدوات المدرسية في المغرب عبر الإنترنت. أسعارنا تبدأ من 3 دراهم للمنتج الواحد.' },
    },
    {
      '@type': 'Question',
      name: 'هل يوصلون لجميع أنحاء المغرب؟',
      acceptedAnswer: { '@type': 'Answer', text: 'نعم، متجر الرحمة يوصل لجميع مدن وقرى المغرب. الطلبات فوق 100 درهم توصيل مجاني.' },
    },
    {
      '@type': 'Question',
      name: 'كيف يمكنني الطلب؟',
      acceptedAnswer: { '@type': 'Answer', text: 'يمكنك الطلب عبر الموقع، أو إرسال صورة لقائمة مستلزماتك عبر صفحة "اطلب بصورة". سنتواصل معك على واتساب لتأكيد الطلب.' },
    },
    {
      '@type': 'Question',
      name: 'كم هي رسوم التوصيل؟',
      acceptedAnswer: { '@type': 'Answer', text: 'توصيل مجاني للطلبات التي تتجاوز 100 درهم. للطلبات الأقل من ذلك، الرسوم بين 15 و35 درهم حسب المنطقة.' },
    },
    {
      '@type': 'Question',
      name: 'هل يمكنني الدفع عند الاستلام؟',
      acceptedAnswer: { '@type': 'Answer', text: 'نعم، نقبل الدفع عند الاستلام لجميع الطلبات في المغرب. لا حاجة لبطاقة بنكية.' },
    },
  ],
}

export default function AboutPage() {
  return (
    <StorefrontLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="container section" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏫</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '1rem' }}>من نحن</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
            متجر الرحمة — أرخص متجر للأدوات المدرسية في المغرب عبر الإنترنت
          </p>
        </div>

        {/* Story */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>قصتنا</h2>
          <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border)', lineHeight: 2, color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              أُسِّس متجر الرحمة بهدف واحد: <strong style={{ color: 'var(--color-primary)' }}>جعل الأدوات المدرسية في متناول كل أسرة مغربية</strong>. 
              لاحظنا أن أسعار الأدوات المدرسية في المتاجر التقليدية مرتفعة جداً، وكثير من الأسر تعاني في بداية كل موسم دراسي.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              قررنا أن نغير ذلك. عبر الشراء بكميات كبيرة مباشرة من الموردين، وتخفيض هامش الربح إلى أدنى مستوياته، أصبحنا نقدم نفس المنتجات <strong style={{ color: 'var(--color-primary)' }}>بخصومات تصل إلى 70%</strong> مقارنة بالأسعار العادية.
            </p>
            <p>
              نوصّل لجميع أنحاء المغرب، ونتواصل مع كل عميل مباشرة عبر واتساب لضمان تجربة تسوق مريحة وموثوقة.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              { num: '70%', label: 'توفير مقارنة بالسوق', icon: '💰' },
              { num: '3 دهـ', label: 'أدنى سعر للمنتج', icon: '🏷️' },
              { num: '12', label: 'مدن مغربية نوصّل إليها', icon: '🚚' },
              { num: '100%', label: 'دفع عند الاستلام', icon: '✅' },
            ].map(({ num, label, icon }) => (
              <div key={label} style={{ background: 'white', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '0.375rem' }}>{num}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Us */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>لماذا نحن الأرخص؟</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '📦', title: 'شراء بالجملة مباشرة', desc: 'نشتري مباشرة من الموردين بكميات كبيرة، مما يخفض التكلفة بشكل كبير.' },
              { icon: '🏪', title: 'لا تكاليف إيجار', desc: 'نعمل بالكامل عبر الإنترنت — لا محل فيزيائي، لا فواتير إيجار، التوفير ينعكس على أسعارك.' },
              { icon: '💚', title: 'هامش ربح منخفض', desc: 'هدفنا الحجم لا الهامش الكبير. نبيع بربح أقل لنصل لأكبر عدد من الأسر.' },
              { icon: '🤝', title: 'تواصل مباشر', desc: 'كل طلب يُتابَع شخصياً عبر واتساب. أنت لست مجرد طلب عندنا.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '1rem', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{icon}</div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>{title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>أسئلة شائعة</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {faqJsonLd.mainEntity.map((faq) => (
              <details key={faq.name} style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1rem 1.25rem', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.name} <span style={{ color: 'var(--color-primary)' }}>+</span>
                </summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>{faq.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--green-600), var(--green-800))', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', color: 'white' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem', color: 'white' }}>ابدأ التوفير الآن</h2>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>انضم لآلاف الأسر المغربية التي تتسوق بذكاء</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/products" className="btn" style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 800 }} id="about-shop-btn">🛍️ تسوق الآن</a>
            <a href={`https://wa.me/212603323433?text=${encodeURIComponent('مرحبا، أريد الاستفسار عن منتجاتكم')}`} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.5)' }} id="about-wa-btn">📞 تواصل واتساب</a>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  )
}
