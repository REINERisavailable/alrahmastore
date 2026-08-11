'use client'

import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  shipped: 'في الطريق',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#16a34a',
  shipped: '#3b82f6',
  delivered: '#059669',
  cancelled: '#ef4444',
}

interface DashboardData {
  kpis: {
    totalRevenue: number
    grossProfit: number
    totalOrders: number
    pendingOrders: number
    avgOrderValue: number
    totalSavingsForCustomers: number
    avgProductMargin: number
    activeProducts: number
  }
  statusCounts: Record<string, number>
  chartData: { date: string; revenue: number; orders: number }[]
  topProducts: { id: string; name: string; revenue: number; profit: number; qty: number }[]
  weekdayData: { day: string; orders: number }[]
  recentOrders: any[]
  photoOrdersPending: number
}

// Custom Stripe-style tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--color-text-secondary)' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.dataKey === 'revenue' ? formatPrice(p.value) : p.value}
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboardClient({ data }: { data: DashboardData }) {
  const { kpis, statusCounts, chartData, topProducts, weekdayData, recentOrders, photoOrdersPending } = data
  const grossMargin = kpis.totalRevenue > 0 ? ((kpis.grossProfit / kpis.totalRevenue) * 100).toFixed(1) : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>📊 لوحة التحكم</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {photoOrdersPending > 0 && (
          <Link href="/admin/photo-orders" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--green-500), var(--green-700))', color: 'white', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{photoOrdersPending}</span>
              📸 طلبات صور جديدة
            </div>
          </Link>
        )}
      </div>

      {/* KPI Grid — Stripe style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          {
            label: 'إجمالي الإيرادات',
            value: formatPrice(kpis.totalRevenue),
            sub: 'من الطلبات المؤكدة',
            icon: '💰',
            color: 'var(--green-700)',
          },
          {
            label: 'إجمالي الربح الصافي',
            value: formatPrice(kpis.grossProfit),
            sub: `هامش ${grossMargin}%`,
            icon: '📈',
            color: 'var(--green-600)',
          },
          {
            label: 'إجمالي الطلبات',
            value: kpis.totalOrders,
            sub: `${kpis.pendingOrders} قيد الانتظار`,
            icon: '📦',
            color: '#3b82f6',
          },
          {
            label: 'متوسط قيمة الطلب',
            value: formatPrice(kpis.avgOrderValue),
            sub: 'AOV',
            icon: '🧾',
            color: '#8b5cf6',
          },
          {
            label: 'توفير العملاء',
            value: formatPrice(kpis.totalSavingsForCustomers),
            sub: 'مقارنة بالسوق',
            icon: '🎉',
            color: '#f59e0b',
          },
          {
            label: 'هامش ربح المنتجات',
            value: `${kpis.avgProductMargin}%`,
            sub: `${kpis.activeProducts} منتج نشط`,
            icon: '🏷️',
            color: 'var(--green-800)',
          },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>{sub}</div>
            {/* Subtle green glow bar at top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.4 }} />
          </div>
        ))}
      </div>

      {/* Status Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} style={{ background: 'white', border: `2px solid ${STATUS_COLORS[status] || '#e5e7eb'}`, borderRadius: 'var(--radius-lg)', padding: '0.875rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: STATUS_COLORS[status] }}>{count}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>{STATUS_LABELS[status] || status}</div>
          </div>
        ))}
      </div>

      {/* Main Chart — Revenue Area + Orders */}
      <div className="stat-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>الإيرادات والطلبات — آخر 30 يوم</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>المساحة الخضراء = إيرادات | الأعمدة = عدد الطلبات</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="الإيرادات" stroke="#16a34a" strokeWidth={2.5} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 5, fill: '#16a34a' }} />
            <Bar yAxisId="orders" dataKey="orders" name="الطلبات" fill="#86efac" radius={[3, 3, 0, 0]} opacity={0.7} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Top Products */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>🏆 أفضل المنتجات مبيعًا</h2>
            <Link href="/admin/products" className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>الكل</Link>
          </div>
          {topProducts.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>لا توجد مبيعات بعد</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {topProducts.map((p, i) => {
                const maxRev = topProducts[0].revenue || 1
                return (
                  <div key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: i < 3 ? 'white' : 'var(--color-text-secondary)', flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                      </div>
                      <div style={{ textAlign: 'left', flexShrink: 0, marginRight: '0.5rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.875rem' }}>{formatPrice(p.revenue)}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-savings)' }}>ربح: {formatPrice(p.profit)}</div>
                      </div>
                    </div>
                    <div style={{ height: 5, background: 'var(--green-100)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--green-500), var(--green-300))', width: `${(p.revenue / maxRev) * 100}%`, borderRadius: 99, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Weekday distribution */}
        <div className="stat-card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>📅 الطلبات حسب اليوم</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekdayData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="طلبات" fill="var(--green-400)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders — Stripe table style */}
      <div className="stat-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>📋 آخر الطلبات</h2>
          <Link href="/admin/orders" className="btn btn-outline btn-sm">عرض الكل</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
            <p style={{ fontWeight: 600 }}>لا توجد طلبات بعد</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>ستظهر الطلبات هنا عند بدء المبيعات</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>الحالة</th>
                  <th>الإيراد</th>
                  <th>التوفير</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => {
                  const date = new Date(o.created_at)
                  return (
                    <tr key={o.id}>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                          fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.625rem',
                          borderRadius: 'var(--radius-full)',
                          background: `${STATUS_COLORS[o.status]}18`,
                          color: STATUS_COLORS[o.status],
                          border: `1px solid ${STATUS_COLORS[o.status]}40`,
                        }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[o.status] }} />
                          {STATUS_LABELS[o.status] || o.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{formatPrice(o.subtotal)}</td>
                      <td style={{ color: 'var(--color-savings)', fontWeight: 600 }}>{formatPrice(o.total_savings || 0)}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{date.toLocaleDateString('ar-MA')}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }} dir="ltr">{date.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
