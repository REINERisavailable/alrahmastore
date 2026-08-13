'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import StorefrontLayout from '@/components/StorefrontLayout'
import { formatPrice, getShippingText } from '@/lib/utils'

export default function CartClient() {
  const { items, updateQty, removeItem, subtotal, competitorTotal, totalSavings, totalItems } = useCart()
  const shippingText = getShippingText(subtotal)
  const isFreeShipping = subtotal >= 100

  if (totalItems === 0) {
    return (
      <StorefrontLayout>
        <div className="container section" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}></div>
          <h1 style={{ marginBottom: '1rem' }}>السلة فارغة</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>أضف منتجات لتبدأ التسوق</p>
          <Link href="/products" className="btn btn-primary btn-lg">️ تصفح المنتجات</Link>
        </div>
      </StorefrontLayout>
    )
  }

  return (
    <StorefrontLayout>
      <div className="container section">
        <h1 style={{ marginBottom: '2rem' }}> سلتك ({totalItems} منتج)</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(({ product, qty }) => (
              <div key={product.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--color-border)' }}>
                <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'white' }}>
                  {product.image_url
                    ? <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="80px" />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}></div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, marginBottom: '0.375rem' }}>{product.name}</p>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.05rem' }}>{formatPrice(product.price * qty)}</p>
                  {product.competitor_price && product.competitor_price > product.price && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-savings)', fontWeight: 600 }}>
                      وفّرت {formatPrice((product.competitor_price - product.price) * qty)}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                  <button onClick={() => updateQty(product.id, qty - 1)} style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: 700 }}>−</button>
                  <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                  <button onClick={() => updateQty(product.id, qty + 1)} style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: 700 }}>+</button>
                </div>
                <button onClick={() => removeItem(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem', flexShrink: 0 }}></button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', position: 'sticky', top: '80px', height: 'fit-content' }}>
            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>ملخص الطلب</h2>
            {totalSavings > 0 && (
              <div style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-800))', color: 'white', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.25rem' }}>لو اشريتي من غيرنا كنت دفعتي</div>
                <div style={{ textDecoration: 'line-through', fontSize: '1.1rem', opacity: 0.8 }}>{formatPrice(competitorTotal)}</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>أنت توفّر</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{formatPrice(totalSavings)} </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>المجموع</span>
                <span style={{ fontWeight: 700 }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>التوصيل</span>
                <span style={{ fontWeight: 600, color: isFreeShipping ? 'var(--color-savings)' : 'var(--color-text-muted)', fontSize: '0.875rem' }}>{shippingText}</span>
              </div>
              {!isFreeShipping && (
                <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-md)', padding: '0.625rem 0.875rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                   أضف {formatPrice(100 - subtotal)} للحصول على توصيل مجاني!
                </div>
              )}
            </div>
            <Link href="/checkout" className="btn btn-primary btn-lg w-full" id="cart-checkout-btn">متابعة الطلب ←</Link>
            <Link href="/products" className="btn btn-ghost w-full" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>متابعة التسوق</Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  )
}
