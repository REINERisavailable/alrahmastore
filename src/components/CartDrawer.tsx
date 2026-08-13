'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { formatPrice, getShippingText } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, removeItem, updateQty, addItem,
    subtotal, competitorTotal, totalSavings, totalItems, clearCart
  } = useCart()
  const router = useRouter()

  const [view, setView] = useState<'cart' | 'checkout'>('cart')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  
  // Checkout form state
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const shippingText = getShippingText(subtotal)
  const isFreeShipping = subtotal >= 100

  // Reset to cart view when opened
  useEffect(() => {
    if (isOpen) setView('cart')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || items.length === 0 || view === 'checkout') return
    const cartIds = items.map(i => i.product.id)
    const notInStr = `(${cartIds.join(',')})`
    supabase.from('products').select('*').eq('is_active', true)
      .not('id', 'in', notInStr)
      .limit(6)
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 3)
        setSuggestions(shuffled)
      })
  }, [isOpen, items.length, view])

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('يرجى ملء جميع الحقول')
      return
    }
    setLoading(true)
    try {
      const { data: order, error: orderErr } = await supabase.from('orders').insert({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        subtotal,
        shipping_fee: isFreeShipping ? 0 : null,
        total_savings: totalSavings,
        status: 'pending',
      }).select().single()

      if (orderErr || !order) throw new Error('فشل في إنشاء الطلب')

      const orderItems = items.map(({ product, qty }) => ({
        order_id: order.id,
        product_id: product.id,
        quantity: qty,
        unit_price: product.price,
        jemla_unit_price: product.jemla_price || null,
        competitor_unit_price: product.competitor_price,
      }))
      await supabase.from('order_items').insert(orderItems)

      const itemsList = items.map(({ product, qty }) => `- ${product.name} x${qty} = ${formatPrice(product.price * qty)}`).join('\n')
      const waMsg = `مرحبا لقد أرسلت طلبًا من متجر الرحمة.\n\nالطلب:\n${itemsList}\n\nالمجموع: ${formatPrice(subtotal)}\n${totalSavings > 0 ? `وفّرت: ${formatPrice(totalSavings)}\n` : ''}\nالعنوان: ${form.address}\nرقم الهاتف: ${form.phone}`

      clearCart()
      closeCart()
      router.push(`/order-success?phone=${form.phone}&wa=${encodeURIComponent(waMsg)}&savings=${totalSavings.toFixed(2)}`)
    } catch (err) {
      setError('حدث خطأ. يرجى المحاولة مجددًا.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="cart-drawer-overlay" onClick={closeCart} aria-hidden />

      <aside className="cart-drawer" role="dialog" aria-label={view === 'cart' ? 'سلة التسوق' : 'إتمام الطلب'} aria-modal="true" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            {view === 'checkout' && (
              <button onClick={() => setView('cart')} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', marginLeft: '0.5rem' }}>
                ←
              </button>
            )}
            <span>{view === 'cart' ? `سلتك (${totalItems})` : 'إتمام الطلب'}</span>
          </div>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="إغلاق السلة">✕</button>
        </div>

        {view === 'cart' ? (
          <>
            {totalSavings > 0 && (
              <div className={styles.savingsBanner}>
                <div className={styles.savingsText}>
                  <span> مدخراتك معنا</span>
                  <strong>{formatPrice(totalSavings)}</strong>
                </div>
                <div className={styles.competitorText}>
                  بدلاً من {formatPrice(competitorTotal)} في المتاجر الأخرى
                </div>
              </div>
            )}

            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <p className={styles.emptyText}>السلة فارغة</p>
                  <Link href="/products" className="btn btn-primary" onClick={closeCart}>
                    تصفح المنتجات
                  </Link>
                </div>
              ) : (
                items.map(({ product, qty }) => (
                  <div key={product.id} className={styles.item}>
                    <div className={styles.itemImage}>
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="56px" />
                      ) : (
                        <div className={styles.imagePlaceholder}></div>
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{product.name}</p>
                      <p className={styles.itemPrice}>{formatPrice(product.price * qty)}</p>
                      {product.competitor_price && product.competitor_price > product.price && (
                        <p className={styles.itemSaving}>
                          وفّرت {formatPrice((product.competitor_price - product.price) * qty)}
                        </p>
                      )}
                    </div>
                    <div className={styles.qtyControls}>
                      <button className={styles.qtyBtn} onClick={() => updateQty(product.id, qty - 1)}>−</button>
                      <span className={styles.qty}>{qty}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQty(product.id, qty + 1)}>+</button>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(product.id)}>✕</button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.upsell}>
                <p className={styles.upsellText}>
                  {isFreeShipping ? ' التوصيل مجاني' : `أضف ${formatPrice(100 - subtotal)} للحصول على توصيل مجاني!`}
                </p>
                {!isFreeShipping && (
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }} />
                  </div>
                )}
              </div>
            )}

            {suggestions.length > 0 && items.length > 0 && (
              <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--color-border)', background: 'var(--green-50)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.625rem' }}>
                  يشتري العملاء أيضاً
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {suggestions.map(prod => (
                    <div key={prod.id} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', background: 'white', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.625rem', border: '1px solid var(--color-border)' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--green-50)' }}>
                        {prod.image_url && <Image src={prod.image_url} alt={prod.name} fill style={{ objectFit: 'cover' }} sizes="40px" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>{formatPrice(prod.price)}</p>
                      </div>
                      <button
                        onClick={() => addItem(prod)}
                        style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0, fontFamily: 'var(--font-arabic)', whiteSpace: 'nowrap' }}
                      >+ أضف</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totals}>
                  <div className={styles.totalRow}>
                    <span>المجموع:</span>
                    <span className={styles.totalAmount}>{formatPrice(subtotal)}</span>
                  </div>
                  <div className={styles.shippingRow}>
                    <span className={isFreeShipping ? styles.freeShipping : styles.shippingNote}>{shippingText}</span>
                  </div>
                </div>
                <button className="btn btn-primary btn-lg w-full" onClick={() => setView('checkout')}>
                  متابعة الطلب ←
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                <span>المطلوب أداؤه:</span>
                <span style={{ color: 'var(--color-primary)' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: isFreeShipping ? 'var(--color-savings)' : 'var(--color-text-muted)', fontWeight: 600 }}>
                {getShippingText(subtotal)}
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">الاسم الكامل</label>
                <input className="form-input" type="text" placeholder="أدخل اسمك الكامل" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">رقم الهاتف / واتساب</label>
                <input className="form-input" type="tel" placeholder="مثال: 0612345678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required dir="ltr" style={{ textAlign: 'right' }} />
              </div>
              <div className="form-group">
                <label className="form-label">العنوان الكامل</label>
                <textarea className="form-textarea" placeholder="المدينة، الحي، الشارع..." value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required rows={3} />
              </div>
              
              {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>{error}</div>}
              
              <div style={{ marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                  {loading ? 'جارٍ الإرسال...' : 'تأكيد الطلب'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                  الدفع عند الاستلام. سنتصل بك لتأكيد الطلب.
                </p>
              </div>
            </form>
          </div>
        )}
      </aside>
    </>
  )
}
