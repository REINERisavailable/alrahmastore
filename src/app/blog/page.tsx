import type { Metadata } from 'next'
import Link from 'next/link'
import StorefrontLayout from '@/components/StorefrontLayout'

export const metadata: Metadata = {
  title: 'مدونة متجر الرحمة — نصائح الادوات المدرسية والتوفير في المغرب',
  description: 'مقالات حول الأدوات المدرسية في المغرب: أسعار، مقارنات، نصائح للتوفير. متجر الرحمة — أرخص متجر أدوات مدرسية في المغرب.',
  alternates: { canonical: 'https://alrahma.store/blog' },
}

const ARTICLES = [
  {
    slug: 'adawat-madrasiya-rakhisa-maroc-2026',
    title: 'أفضل الأدوات المدرسية بأرخص الأسعار في المغرب 2026',
    excerpt: 'دليل شامل لأفضل وأرخص الأدوات المدرسية المتوفرة في المغرب لموسم 2026. قارن الأسعار ووفّر أكثر من 70%.',
    date: '2026-08-01',
    readTime: '5 دقائق',
    emoji: '📚',
  },
  {
    slug: 'tawfir-50-lazim-dirasa-maroc',
    title: 'كيف توفر أكثر من 50% على لوازم الدراسة في المغرب',
    excerpt: 'أسرار التسوق الذكي للأدوات المدرسية في المغرب. خطوات عملية لتخفيض فاتورة الدراسة لأكثر من النصف.',
    date: '2026-08-05',
    readTime: '7 دقائق',
    emoji: '💰',
  },
  {
    slug: 'muqarana-asaar-adawat-madrasiya-maroc',
    title: 'مقارنة أسعار الأدوات المدرسية في المغرب: أين تشتري؟',
    excerpt: 'مقارنة تفصيلية لأسعار الأدوات المدرسية في مختلف المتاجر المغربية مقابل متجر الرحمة. الأرقام تتحدث.',
    date: '2026-08-08',
    readTime: '6 دقائق',
    emoji: '📊',
  },
]

const blogListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'مدونة متجر الرحمة',
  url: 'https://alrahma.store/blog',
  description: 'نصائح وأدلة حول الأدوات المدرسية والتوفير في المغرب',
  blogPost: ARTICLES.map(a => ({
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    url: `https://alrahma.store/blog/${a.slug}`,
    author: { '@type': 'Organization', name: 'متجر الرحمة' },
  })),
}

export default function BlogPage() {
  return (
    <StorefrontLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }} />
      <div className="container section" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>📰 المدونة</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>نصائح وأدلة للتسوق الذكي في المغرب</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition-base)', cursor: 'pointer' }} className="blog-card-hover">
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '3rem', flexShrink: 0, lineHeight: 1 }}>{article.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                      <time dateTime={article.date} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        {new Date(article.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', background: 'var(--green-50)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                        ⏱ {article.readTime}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.625rem', lineHeight: 1.5 }}>{article.title}</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{article.excerpt}</p>
                    <div style={{ marginTop: '0.875rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>اقرأ المقال ←</div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </StorefrontLayout>
  )
}
