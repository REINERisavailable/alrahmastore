'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatPrice, getShippingText } from '@/lib/utils'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, removeItem, updateQty,
    subtotal, competitorTotal, totalSavings, totalItems,
  } = useCart()

  if (!isOpen) return null

  const shippingText = getShippingText(subtotal)
  const isFreeShipping = subtotal >= 100

  return (
    <>
      {/* Overlay */}
      <div
        className="cart-drawer-overlay"
        onClick={closeCart}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className="cart-drawer"
        role="dialog"
        aria-label="سلة التسوق"
        aria-modal
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            🛒 سلة التسوق
            <span className={styles.count}>{totalItems}</span>
          </h2>
          <button
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label="إغلاق السلة"
          >
            ✕
          </button>
        </div>

        {/* Savings Banner */}
        {totalSavings > 0 && (
          <div className={styles.savingsBanner}>
            <span className={styles.savingsIcon}>💰</span>
            <div>
              <div className={styles.savingsMain}>
                أنت توفّر <strong>{formatPrice(totalSavings)}</strong>
              </div>
              <div className={styles.savingsSub}>
                لو اشريتي من غيرنا كنت دفعتي {formatPrice(competitorTotal)}
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🛒</span>
              <p>السلة فارغة</p>
              <button className="btn btn-primary" onClick={closeCart}>
                تصفح المنتجات
              </button>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className={styles.img}
                    />
                  ) : (
                    <span className={styles.imgPlaceholder}>📦</span>
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{product.name}</p>
                  <p className={styles.itemPrice}>{formatPrice(product.price * qty)}</p>
                  {product.competitor_price && product.competitor_price > product.price && (
                    <p className={styles.itemSaving}>
                      وفّرت {formatPrice((product.competitor_price - product.price) * qty)}
                    </p>
                  )}
                </div>
                <div className={styles.qtyControls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQty(product.id, qty - 1)}
                    aria-label="تقليل الكمية"
                  >−</button>
                  <span className={styles.qty}>{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQty(product.id, qty + 1)}
                    aria-label="زيادة الكمية"
                  >+</button>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(product.id)}
                  aria-label={`حذف ${product.name}`}
                >🗑</button>
              </div>
            ))
          )}
        </div>

        {/* Upsell: "أضف أكثر للتوفير" */}
        {items.length > 0 && (
          <div className={styles.upsell}>
            <p className={styles.upsellText}>
              {isFreeShipping
                ? '🎉 مبروك! التوصيل مجاني'
                : `أضف ${formatPrice(100 - subtotal)} للحصول على توصيل مجاني!`}
            </p>
            {!isFreeShipping && (
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                />
              </div>
            )}
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
                <span className={isFreeShipping ? styles.freeShipping : styles.shippingNote}>
                  {shippingText}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="btn btn-primary btn-lg w-full"
              onClick={closeCart}
              id="proceed-to-checkout"
            >
              متابعة الطلب ←
            </Link>
            <button
              className={`btn btn-ghost w-full ${styles.continueBtn}`}
              onClick={closeCart}
            >
              متابعة التسوق
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
