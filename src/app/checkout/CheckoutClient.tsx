'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import StorefrontLayout from '@/components/StorefrontLayout'
import { formatPrice, getShippingText, WHATSAPP_NUMBER } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function CheckoutClient() {
  const { items, subtotal, competitorTotal, totalSavings, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isFreeShipping = subtotal >= 100

  if (items.length === 0) {
    router.replace('/products')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
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

      const itemsList = items.map(({ product, qty }) => `• ${product.name} x${qty} = ${formatPrice(product.price * qty)}`).join('\n')
      const waMsg = `مرحبا  لقد أرسلت طلبًا من متجر الرحمة.\n\n الطلب:\n${itemsList}\n\n المجموع: ${formatPrice(subtotal)}\n${totalSavings > 0 ? ` وفّرت: ${formatPrice(totalSavings)}\n` : ''}\n العنوان: ${form.address}\n رقم الهاتف: ${form.phone}`

      clearCart()
      router.push(`/order-success?phone=${form.phone}&wa=${encodeURIComponent(waMsg)}&savings=${totalSavings.toFixed(2)}`)
    } catch (err) {
      setError('حدث خطأ. يرجى المحاولة مجددًا.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StorefrontLayout>
      <div className="container section" style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}> إتمام الطلب</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Order Summary */}
          <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>ملخص طلبك</h2>
            {items.map(({ product, qty }) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                <span>{product.name} × {qty}</span>
                <span style={{ fontWeight: 700 }}>{formatPrice(product.price * qty)}</span>
              </div>
            ))}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>المجموع</span>
                <span style={{ color: 'var(--color-primary)' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: isFreeShipping ? 'var(--color-savings)' : 'var(--color-text-muted)', fontWeight: 600 }}>
                {getShippingText(subtotal)}
              </div>
              {totalSavings > 0 && (
                <div style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-800))', color: 'white', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginTop: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>لو اشريتي من غيرنا</div>
                  <div style={{ textDecoration: 'line-through', opacity: 0.7 }}>{formatPrice(competitorTotal)}</div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', marginTop: '0.25rem' }}>وفّرت {formatPrice(totalSavings)} </div>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span></span>
              <span>سنتواصل معك على واتساب لتأكيد طلبك وتحديد رسوم التوصيل إن لزم</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="checkout-name">الاسم الكامل</label>
              <input id="checkout-name" className="form-input" type="text" placeholder="أدخل اسمك الكامل" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoComplete="name" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="checkout-phone">رقم الهاتف / واتساب</label>
              <input id="checkout-phone" className="form-input" type="tel" placeholder="مثال: 0612345678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required autoComplete="tel" dir="ltr" style={{ textAlign: 'right' }} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="checkout-address">العنوان الكامل</label>
              <textarea id="checkout-address" className="form-textarea" placeholder="المدينة، الحي، الشارع..." value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required rows={3} autoComplete="street-address" />
            </div>
            {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600 }}>{error}</div>}
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} id="submit-order-btn">
              {loading ? ' جارٍ الإرسال...' : ' إرسال الطلب'}
            </button>
          </form>
        </div>
      </div>
    </StorefrontLayout>
  )
}
