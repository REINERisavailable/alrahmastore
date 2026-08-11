import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import StorefrontLayout from '@/components/StorefrontLayout'
import { formatPrice } from '@/lib/utils'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'مقارنة أسعار الأدوات المدرسية في المغرب — وفّر معنا | متجر الرحمة',
  description: 'مقارنة كاملة بين أسعار الأدوات المدرسية في متجر الرحمة وأسعار السوق في المغرب. وفّر أكثر من 70% على كل منتج.',
  alternates: { canonical: 'https://alrahma.store/savings' },
}

export default async function SavingsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .not('competitor_price', 'is', null)
    .order('price', { ascending: true })

  const items = products || []
  const totalOurCost = items.reduce((s, p) => s + p.price, 0)
  const totalMarketCost = items.reduce((s, p) => s + (p.competitor_price || p.price), 0)
  const totalSavings = totalMarketCost - totalOurCost

  return (
    <StorefrontLayout>
      <div className="container section">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 3rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>💰 وفّر معنا</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            مقارنة شاملة بين أسعارنا وأسعار السوق في المغرب. أرخص متجر للأدوات المدرسية عبر الإنترنت.
          </p>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { label: 'سعرنا الإجمالي', value: formatPrice(totalOurCost), color: 'var(--color-primary)', icon: '🏷️' },
            { label: 'سعر السوق', value: formatPrice(totalMarketCost), color: 'var(--color-competitor)', icon: '🏪' },
            { label: 'إجمالي التوفير', value: formatPrice(totalSavings), color: 'var(--color-savings)', icon: '💰' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ background: 'var(--green-700)', color: 'white', padding: '1.25rem 1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>جدول مقارنة الأسعار</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th style={{ color: 'var(--color-primary)' }}>سعرنا</th>
                  <th style={{ color: 'var(--color-competitor)' }}>سعر السوق</th>
                  <th style={{ color: 'var(--color-savings)' }}>التوفير</th>
                  <th>نسبة التوفير</th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => {
                  const savAmt = (p.competitor_price || p.price) - p.price
                  const savPct = p.competitor_price ? Math.round((savAmt / p.competitor_price) * 100) : 0
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{formatPrice(p.price)}</td>
                      <td style={{ color: 'var(--color-competitor)', textDecoration: 'line-through' }}>{p.competitor_price ? formatPrice(p.competitor_price) : '—'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-savings)' }}>{savAmt > 0 ? formatPrice(savAmt) : '—'}</td>
                      <td>{savPct > 0 ? <span className="badge badge-savings">{savPct}%</span> : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="/products" className="btn btn-primary btn-lg" id="savings-shop-now">
            🛍️ تسوق الآن وابدأ التوفير
          </a>
        </div>
      </div>
    </StorefrontLayout>
  )
}
