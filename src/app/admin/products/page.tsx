'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { formatPrice, calcSavings } from '@/lib/utils'
import type { Product } from '@/lib/supabase'

function calcMargin(price: number, jemla: number | null): string {
  if (!jemla || jemla <= 0 || price <= 0) return '—'
  return `${((price - jemla) / price * 100).toFixed(0)}%`
}

function calcProfit(price: number, jemla: number | null): string {
  if (!jemla || jemla <= 0 || price <= 0) return '—'
  return `+${(price - jemla).toFixed(2)}`
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRevenuePotential, setTotalRevenuePotential] = useState(0)
  const [totalProfitPotential, setTotalProfitPotential] = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const prods = data || []
    setProducts(prods)
    // Mini analytics
    const revPot = prods.reduce((s: number, p: Product) => s + p.price, 0)
    const profPot = prods.reduce((s: number, p: Product) => s + (p.jemla_price ? p.price - p.jemla_price : 0), 0)
    setTotalRevenuePotential(revPot)
    setTotalProfitPotential(profPot)
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const avgMargin = products.length > 0 && totalRevenuePotential > 0
    ? ((totalProfitPotential / totalRevenuePotential) * 100).toFixed(0)
    : '—'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}> المنتجات</h1>
        <Link href="/admin/products/new" className="btn btn-primary" id="add-product-btn">
          + إضافة منتج
        </Link>
      </div>

      {/* Mini profit overview */}
      {!loading && products.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'عدد المنتجات', value: products.length, icon: '' },
            { label: 'متوسط هامش الربح', value: `${avgMargin}%`, icon: '' },
            { label: 'ربح لكل وحدة مباعة', value: `${formatPrice(totalProfitPotential / Math.max(products.length, 1))}`, icon: '' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="stat-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>{icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="stat-card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}> جارٍ التحميل...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th> الجملة</th>
                <th>️ بيعنا</th>
                <th> ربح/وحدة</th>
                <th> المنافس</th>
                <th>توفير%</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>لا توجد منتجات — أضف أول منتج</td></tr>
              ) : products.map(product => {
                const savings = calcSavings(product.price, product.competitor_price)
                const margin = product.jemla_price ? ((product.price - product.jemla_price) / product.price * 100).toFixed(0) : null
                const profitPerUnit = product.jemla_price ? (product.price - product.jemla_price) : null

                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--green-50)', position: 'relative' }}>
                        {product.image_url
                          ? <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}></div>
                        }
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 160 }}>
                      {product.name}
                      {product.has_variants && <span style={{ marginRight: '0.375rem', fontSize: '0.7rem', background: 'var(--green-100)', color: 'var(--green-700)', padding: '0.1rem 0.3rem', borderRadius: 4 }}>خيارات</span>}
                      {product.video_url && <span style={{ marginRight: '0.25rem', fontSize: '0.7rem' }}></span>}
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {product.jemla_price ? formatPrice(product.jemla_price) : '—'}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>{formatPrice(product.price)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {profitPerUnit !== null ? (
                        <span style={{ color: profitPerUnit > 0 ? 'var(--color-savings)' : '#ef4444', fontWeight: 700 }}>
                          {profitPerUnit > 0 ? '+' : ''}{formatPrice(profitPerUnit)}
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>({margin}%)</span>
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ color: 'var(--color-competitor)', whiteSpace: 'nowrap' }}>
                      {product.competitor_price ? formatPrice(product.competitor_price) : '—'}
                    </td>
                    <td>
                      {savings.pct > 0 ? <span className="badge badge-savings">{savings.pct}%</span> : '—'}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(product.id, product.is_active)}
                        className={`badge ${product.is_active ? 'badge-status-confirmed' : 'badge-status-cancelled'}`}
                        style={{ cursor: 'pointer', border: 'none', fontFamily: 'var(--font-arabic)' }}
                      >
                        {product.is_active ? 'مفعّل' : 'مخفي'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <Link href={`/admin/products/${product.id}`} className="btn btn-outline btn-sm">️</Link>
                        <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#991b1b', border: 'none' }} onClick={() => deleteProduct(product.id, product.name)}></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
