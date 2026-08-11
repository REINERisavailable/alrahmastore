'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/lib/supabase'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار', confirmed: 'مؤكد', shipped: 'في الطريق',
  delivered: 'تم التسليم', cancelled: 'ملغي',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  const fetch = useCallback(async () => {
    setLoading(true)
    let query = (supabaseAdmin as any).from('orders').select('*, order_items(*, products(name))', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    if (search) query = query.or(`phone.ilike.%${search}%,customer_name.ilike.%${search}%`)

    const { data } = await query
    setOrders(data || [])
    setLoading(false)
  }, [search, statusFilter, page])

  useEffect(() => { fetch() }, [fetch])

  async function updateStatus(id: string, status: string) {
    await (supabaseAdmin as any).from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as Order['status'] } : o))
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>📦 الطلبات</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 240 }} placeholder="🔍 بحث باسم أو رقم هاتف..." value={search} onChange={e => setSearch(e.target.value)} id="orders-search" />
        <select className="form-select" style={{ maxWidth: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} id="orders-status-filter">
          <option value="all">جميع الحالات</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="stat-card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>⏳ جارٍ التحميل...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>لا توجد طلبات</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>المنتجات</th>
                <th>المجموع</th>
                <th>التوفير</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>واتساب</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{order.customer_name}</td>
                  <td dir="ltr" style={{ textAlign: 'right' }}>{order.phone}</td>
                  <td style={{ fontSize: '0.8rem', maxWidth: 200 }}>
                    {(order as any).order_items?.map((i: any) => `${i.products?.name} ×${i.quantity}`).join('، ')}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>{formatPrice(order.subtotal)}</td>
                  <td style={{ color: 'var(--color-savings)', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatPrice(order.total_savings || 0)}</td>
                  <td>
                    <select
                      className="form-select"
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      style={{ padding: '0.375rem 0.5rem', fontSize: '0.8rem', minWidth: 120 }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(order.created_at).toLocaleDateString('ar-MA')}
                  </td>
                  <td>
                    <a
                      href={`https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحبا ${order.customer_name}، شكرًا لطلبك من متجر الرحمة! سنقوم بتأكيد طلبك قريبًا.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                      style={{ background: '#25D366', color: 'white', whiteSpace: 'nowrap' }}
                    >
                      📱
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>السابق</button>
        <span style={{ padding: '0.5rem 0.875rem', fontWeight: 600 }}>صفحة {page + 1}</span>
        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p + 1)} disabled={orders.length < PAGE_SIZE}>التالي</button>
      </div>
    </div>
  )
}
