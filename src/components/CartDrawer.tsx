'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice, getShippingText } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, removeItem, updateQty, addItem,
    subtotal, competitorTotal, totalSavings, totalItems,
  } = useCart()

  const [suggestions, setSuggestions] = useState<Product[]>([])

  const shippingText = getShippingText(subtotal)
  const isFreeShipping = subtotal >= 100

  useEffect(() => {
    if (!isOpen || items.length === 0) return
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
  }, [isOpen, items.length])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="cart-drawer-overlay" onClick={closeCart} aria-hidden />

      {/* Drawer */}
      <aside className={styles.drawer} role="dialog" aria-label="سلة التسوق" aria-modal="true">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.cartIcon}>🛒</span>
            <span>سلتك ({totalItems})</span>
          </div>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="إغلاق السلة">✕</button>
        </div>

        {/* Savings banner */}
        {totalSavings > 0 && (
          <div className={styles.savingsBanner}>
            <div className={styles.savingsText}>
              <span>💰 مدخراتك معنا</span>
              <strong>{formatPrice(totalSavings)}</strong>
            </div>
            <div className={styles.competitorText}>
              بدلاً من {formatPrice(competitorTotal)} في المتاجر الأخرى
            </div>
          </div>
        )}

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🛒</div>
              <p className={styles.emptyText}>السلة فارغة</p>
              <Link href="/products" className="btn btn-primary" onClick={closeCart} id="cart-browse-products">
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
                    <div className={styles.imagePlaceholder}>📦</div>
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{product.name}</p>
                  <p className={styles.itemPrice}>{formatPrice(product.price * qty)}</p>
                  {product.competitor_price && product.competitor_price > product.price && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-savings)', fontWeight: 600 }}>
                      وفّرت {formatPrice((product.competitor_price - product.price) * qty)}
                    </p>
                  )}
                </div>
                <div className={styles.qtyControls}>
                  <button className={styles.qtyBtn} onClick={() => updateQty(product.id, qty - 1)} aria-label="تقليل الكمية">−</button>
                  <span className={styles.qty}>{qty}</span>
                  <button className={styles.qtyBtn} onClick={() => updateQty(product.id, qty + 1)} aria-label="زيادة الكمية">+</button>
                </div>
                <button className={styles.removeBtn} onClick={() => removeItem(product.id)} aria-label={`حذف ${product.name}`}>🗑</button>
              </div>
            ))
          )}
        </div>

        {/* Shipping progress */}
        {items.length > 0 && (
          <div className={styles.upsell}>
            <p className={styles.upsellText}>
              {isFreeShipping ? '🎉 مبروك! التوصيل مجاني' : `أضف ${formatPrice(100 - subtotal)} للحصول على توصيل مجاني!`}
            </p>
            {!isFreeShipping && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }} />
              </div>
            )}
          </div>
        )}

        {/* "Customers also bought" recommendations */}
        {suggestions.length > 0 && items.length > 0 && (
          <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--color-border)', background: 'var(--green-50)' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.625rem' }}>
              👥 العملاء يشترون أيضاً
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {suggestions.map(prod => (
                <div key={prod.id} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', background: 'white', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.625rem', border: '1px solid var(--color-border)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--green-50)' }}>
                    {prod.image_url
                      ? <Image src={prod.image_url} alt={prod.name} fill style={{ objectFit: 'cover' }} sizes="40px" />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📦</div>
                    }
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

        {/* Footer */}
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
            <Link href="/checkout" className="btn btn-primary btn-lg w-full" onClick={closeCart} id="proceed-to-checkout">
              متابعة الطلب ←
            </Link>
            <button className={`btn btn-ghost w-full ${styles.continueBtn}`} onClick={closeCart}>
              متابعة التسوق
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
