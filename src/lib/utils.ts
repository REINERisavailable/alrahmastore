// Savings calculation utilities
export function calcSavings(ourPrice: number, competitorPrice: number | null) {
  if (!competitorPrice || competitorPrice <= ourPrice) {
    return { amount: 0, pct: 0 }
  }
  const amount = competitorPrice - ourPrice
  const pct = Math.round((amount / competitorPrice) * 100)
  return { amount, pct }
}

export function calcCartTotals(
  items: { price: number; competitor_price: number | null; qty: number }[]
) {
  let ourTotal = 0
  let competitorTotal = 0

  for (const item of items) {
    ourTotal += item.price * item.qty
    competitorTotal += (item.competitor_price ?? item.price) * item.qty
  }

  const totalSavings = Math.max(0, competitorTotal - ourTotal)
  const shippingFee = ourTotal >= 100 ? 0 : null // null = TBD (15-35dh)

  return { ourTotal, competitorTotal, totalSavings, shippingFee }
}

export function formatPrice(price: number): string {
  return `${price.toFixed(2)} درهم`
}

export function getShippingText(subtotal: number): string {
  if (subtotal >= 100) return 'توصيل مجاني '
  return 'رسوم التوصيل: 15 إلى 35 درهم (يُحدد عند التأكيد)'
}

export function getWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212603323433'
export const COUNTDOWN_END = process.env.NEXT_PUBLIC_COUNTDOWN_END || '2026-10-09T00:00:00Z'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alrahma.store'
