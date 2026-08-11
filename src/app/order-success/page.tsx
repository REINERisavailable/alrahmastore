'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import StorefrontLayout from '@/components/StorefrontLayout'
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/utils'

function OrderSuccessContent() {
  const params = useSearchParams()
  const savings = parseFloat(params.get('savings') || '0')
  const waMsg = params.get('wa') || 'مرحبا، لقد أرسلت طلبًا من متجر الرحمة'
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`

  return (
    <div className="container section" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'bounce 1s ease' }}>✅</div>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>تم إرسال طلبك!</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
        شكرًا لك! سنتواصل معك قريبًا على واتساب لتأكيد طلبك وتحديد رسوم التوصيل إن لزم.
      </p>

      {savings > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, var(--green-600), var(--green-800))',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2rem',
        }}>
          <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>🎉 مبروك! لقد وفّرت</div>
          <div style={{ fontSize: '3rem', fontWeight: 900 }}>{formatPrice(savings)}</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.5rem' }}>مقارنة بالمتاجر الأخرى</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg"
          id="whatsapp-contact-btn"
          style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.4)' }}
        >
          📱 تواصل معنا على واتساب
        </a>
        <Link href="/products" className="btn btn-outline btn-lg" id="continue-shopping-btn">
          🛍️ متابعة التسوق
        </Link>
      </div>

      <div style={{ marginTop: '2rem', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
        <p>📦 سيتم التواصل معك خلال ساعات قليلة</p>
        <p>🚚 التوصيل لجميع أنحاء المغرب</p>
        <p>📞 +{WHATSAPP_NUMBER}</p>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <StorefrontLayout>
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>جارٍ التحميل...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </StorefrontLayout>
  )
}
