import { supabase } from '@/lib/supabase'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const [ordersRes, photoOrdersRes, productsRes, itemsRes] = await Promise.all([
    supabase.from('orders').select('id, subtotal, total_savings, status, created_at').order('created_at', { ascending: false }),
    supabase.from('photo_orders').select('id, status, created_at').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name, price, jemla_price, competitor_price, is_active'),
    supabase.from('order_items').select('product_id, quantity, unit_price, jemla_unit_price, competitor_unit_price, products(name)'),
  ])

  const orders = ordersRes.data || []
  const photoOrders = photoOrdersRes.data || []
  const products = productsRes.data || []
  const items = itemsRes.data || []

  // ---- KPIs ----
  const confirmedOrders = orders.filter(o => ['confirmed','shipped','delivered'].includes(o.status))
  const totalRevenue = confirmedOrders.reduce((s, o) => s + (o.subtotal || 0), 0)
  const grossProfit = items.reduce((s: number, i: any) => {
    const cost = i.jemla_unit_price || 0
    const revenue = i.unit_price * i.quantity
    const costTotal = cost * i.quantity
    return s + (revenue - costTotal)
  }, 0)
  const totalOrders = orders.length + photoOrders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const avgOrderValue = orders.length ? orders.reduce((s, o) => s + (o.subtotal || 0), 0) / orders.length : 0
  const totalSavingsForCustomers = orders.reduce((s, o) => s + (o.total_savings || 0), 0)
  const avgProductMargin = products.reduce((s: number, p: any) => {
    if (p.jemla_price && p.price > 0) return s + (p.price - p.jemla_price) / p.price
    return s
  }, 0) / Math.max(products.filter((p: any) => p.jemla_price).length, 1)

  // ---- Revenue + Profit by day (last 30 days) ----
  const now = Date.now()
  const dailyData: Record<string, { revenue: number; orders: number }> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86400000)
    const key = d.toISOString().split('T')[0]
    dailyData[key] = { revenue: 0, orders: 0 }
  }
  orders.forEach(o => {
    const key = o.created_at.split('T')[0]
    if (dailyData[key]) {
      dailyData[key].revenue += o.subtotal || 0
      dailyData[key].orders += 1
    }
  })
  const chartData = Object.entries(dailyData).map(([date, d]) => ({
    date: date.slice(5),
    revenue: Math.round(d.revenue * 100) / 100,
    orders: d.orders,
  }))

  // ---- Status breakdown ----
  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  // ---- Top products by revenue ----
  const productRevenue: Record<string, { name: string; revenue: number; profit: number; qty: number }> = {}
  items.forEach((item: any) => {
    const pid = item.product_id
    if (!productRevenue[pid]) productRevenue[pid] = { name: item.products?.name || 'منتج', revenue: 0, profit: 0, qty: 0 }
    const rev = item.unit_price * item.quantity
    const cost = (item.jemla_unit_price || 0) * item.quantity
    productRevenue[pid].revenue += rev
    productRevenue[pid].profit += rev - cost
    productRevenue[pid].qty += item.quantity
  })
  const topProducts = Object.entries(productRevenue)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(([id, d]) => ({ id, ...d }))

  // ---- Weekly cohort (orders by day of week) ----
  const byDayOfWeek = Array(7).fill(0)
  orders.forEach(o => { byDayOfWeek[new Date(o.created_at).getDay()]++ })
  const DAYS_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']
  const weekdayData = byDayOfWeek.map((count, i) => ({ day: DAYS_AR[i], orders: count }))

  // ---- Recent orders ----
  const recentOrders = orders.slice(0, 8)

  return {
    kpis: {
      totalRevenue,
      grossProfit,
      totalOrders,
      pendingOrders,
      avgOrderValue,
      totalSavingsForCustomers,
      avgProductMargin: Math.round(avgProductMargin * 100),
      activeProducts: products.filter((p: any) => p.is_active).length,
    },
    statusCounts,
    chartData,
    topProducts,
    weekdayData,
    recentOrders,
    photoOrdersPending: photoOrders.filter(o => o.status === 'pending_review').length,
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData()
  return <AdminDashboardClient data={data} />
}
