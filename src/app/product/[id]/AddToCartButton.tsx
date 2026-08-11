'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/supabase'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>الكمية:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--green-50)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}
            aria-label="تقليل"
          >−</button>
          <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: '1.05rem' }}>{qty}</span>
          <button
            onClick={() => setQty(q => q + 1)}
            style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}
            aria-label="زيادة"
          >+</button>
        </div>
      </div>
      <button
        className={`btn btn-primary btn-lg`}
        onClick={handleAdd}
        id={`add-to-cart-detail-${product.id}`}
        style={{ width: '100%', transition: 'all 0.25s' }}
      >
        {added ? '✅ تمت الإضافة للسلة!' : `أضف ${qty} للسلة 🛒`}
      </button>
    </div>
  )
}
