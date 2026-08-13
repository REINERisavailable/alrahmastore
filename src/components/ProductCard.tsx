'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/supabase'
import { calcSavings, formatPrice } from '@/lib/utils'
import styles from './ProductCard.module.css'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)
  const savings = calcSavings(product.price, product.competitor_price)

  async function handleAdd() {
    setAdding(true)
    addItem(product)
    setTimeout(() => setAdding(false), 600)
  }

  return (
    <article className={`card ${styles.card}`} itemScope itemType="https://schema.org/Product">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className={styles.imageWrap} tabIndex={-1} aria-hidden>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.image}
            itemProp="image"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span></span>
          </div>
        )}
        {savings.pct > 0 && (
          <div className={styles.savingsBadge} aria-label={`وفّر ${savings.pct}%`}>
            وفّر {savings.pct}%
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className={styles.body}>
        <Link href={`/product/${product.id}`}>
          <h3 className={styles.name} itemProp="name">{product.name}</h3>
        </Link>

        <div className={styles.priceBlock} itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="MAD" />
          <meta itemProp="price" content={String(product.price)} />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <span className="price-our" itemProp="price">{formatPrice(product.price)}</span>
          {product.competitor_price && product.competitor_price > product.price && (
            <div className={styles.competitorRow}>
              <span className="price-competitor">{formatPrice(product.competitor_price)}</span>
              {savings.amount > 0 && (
                <span className={styles.savingsText}>
                  وفّر {formatPrice(savings.amount)}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          className={`btn btn-primary w-full ${styles.addBtn} ${adding ? styles.adding : ''}`}
          onClick={handleAdd}
          aria-label={`أضف ${product.name} إلى السلة`}
          id={`add-to-cart-${product.id}`}
        >
          {adding ? ' تمت الإضافة' : 'أضف للسلة '}
        </button>
      </div>
    </article>
  )
}
