'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { totalItems, openCart } = useCart()

  return (
    <nav className="navbar" role="navigation" aria-label="التنقل الرئيسي">
      <div className="container">
        <div className={styles.inner}>
          {/* Logo / Brand */}
          <Link href="/" className={styles.brand} aria-label="متجر الرحمة - الصفحة الرئيسية">
            <span className={styles.brandIcon}></span>
            <div>
              <span className={styles.brandName}>متجر الرحمة</span>
              <span className={styles.brandTagline}>أرخص أدوات مدرسية في المغرب</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className={styles.links}>
            <Link href="/products" className={styles.navLink}>
              جميع المنتجات
            </Link>
            <Link href="/order-by-photo" className={styles.navLinkPhoto}>
               اطلب بصورة
            </Link>
            <Link href="/savings" className={styles.navLink}>
              وفّر معنا
            </Link>
          </div>

          {/* Cart Button */}
          <button
            className={styles.cartBtn}
            onClick={openCart}
            aria-label={`سلة التسوق - ${totalItems} منتج`}
            id="cart-button"
          >
            <span className={styles.cartIcon}></span>
            <span className={styles.cartLabel}>السلة</span>
            {totalItems > 0 && (
              <span className={styles.cartBadge} aria-live="polite">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
