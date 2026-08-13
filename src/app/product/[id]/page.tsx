import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import StorefrontLayout from '@/components/StorefrontLayout'
import AddToCartButton from './AddToCartButton'
import { calcSavings, formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/supabase'

export const revalidate = 3600

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  if (!product) return { title: 'منتج غير موجود' }
  return {
    title: `${product.name} - متجر الرحمة`,
    description: `${product.name} بسعر ${product.price} درهم فقط. وفّر ${product.competitor_price ? product.competitor_price - product.price : 0} درهم مقارنة بالمتاجر الأخرى.`,
    alternates: { canonical: `https://alrahma.store/product/${id}` },
  }
}

async function getRelated(currentId: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .neq('id', currentId)
    .order('created_at', { ascending: false })
    .limit(4)
  return data || []
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const { data: product } = await supabase.from('products').select('*').eq('id', id).eq('is_active', true).single()
  if (!product) notFound()

  const related = await getRelated(id)
  const savings = calcSavings(product.price, product.competitor_price)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: product.image_url || 'https://alrahma.store/og-image.png',
    brand: { '@type': 'Brand', name: 'متجر الرحمة' },
    offers: {
      '@type': 'Offer',
      url: `https://alrahma.store/product/${id}`,
      priceCurrency: 'MAD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'متجر الرحمة' },
    },
    ...(product.competitor_price ? {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'المدخرات',
        value: `وفّر ${savings.amount.toFixed(2)} درهم (${savings.pct}%) مقارنة بالسعر العادي ${product.competitor_price} درهم`,
      },
    } : {}),
  }

  return (
    <StorefrontLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container section">
        {/* Breadcrumb */}
        <nav aria-label="مسار التنقل" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <a href="/">الرئيسية</a> / <a href="/products">المنتجات</a> / <span>{product.name}</span>
        </nav>

        {/* Product */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--green-50)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" priority />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}></div>
            )}
            {savings.pct > 0 && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-primary)', color: 'white', fontWeight: 800, padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}>
                وفّر {savings.pct}%
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h1 style={{ fontSize: '1.75rem' }}>{product.name}</h1>

            {product.description && (
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{product.description}</p>
            )}

            {/* Pricing */}
            <div className="savings-block">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="price-our" style={{ fontSize: '2rem' }}>{formatPrice(product.price)}</span>
                {product.competitor_price && product.competitor_price > product.price && (
                  <span className="price-competitor" style={{ fontSize: '1.1rem' }}>{formatPrice(product.competitor_price)}</span>
                )}
              </div>
              {savings.amount > 0 && (
                <p style={{ color: 'var(--color-savings)', fontWeight: 700, marginTop: '0.5rem', fontSize: '0.95rem' }}>
                   توفّر {formatPrice(savings.amount)} ({savings.pct}%) مقارنة بالمتاجر الأخرى
                </p>
              )}
            </div>

            {/* Add to cart */}
            <AddToCartButton product={product} />

            {/* Shipping info */}
            <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <p> <strong>التوصيل:</strong> لجميع أنحاء المغرب</p>
              <p style={{ marginTop: '0.375rem' }}> مجاني للطلبات فوق 100 درهم</p>
              <p style={{ marginTop: '0.375rem' }}> نتواصل معك لتأكيد الطلب</p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>قد يعجبك أيضًا</h2>
            <div className="products-grid">
              {related.map(p => (
                <a key={p.id} href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1rem' }}>
                    {p.image_url ? (
                      <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <Image src={p.image_url} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="200px" />
                      </div>
                    ) : (
                      <div style={{ aspectRatio: '1', background: 'var(--green-50)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '0.75rem' }}></div>
                    )}
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.375rem' }}>{p.name}</p>
                    <p className="price-our" style={{ fontSize: '1rem' }}>{formatPrice(p.price)}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  )
}
