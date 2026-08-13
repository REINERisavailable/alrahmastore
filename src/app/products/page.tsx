'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import StorefrontLayout from '@/components/StorefrontLayout'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/supabase'

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'savings'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('products').select('*').eq('is_active', true)

    if (debouncedSearch) {
      query = query.ilike('name', `%${debouncedSearch}%`)
    }

    if (sort === 'newest')     query = query.order('created_at', { ascending: false })
    if (sort === 'price_asc')  query = query.order('price', { ascending: true })
    if (sort === 'price_desc') query = query.order('price', { ascending: false })
    if (sort === 'savings') {
      // Sort by savings amount (competitor_price - price) desc
      query = query.order('competitor_price', { ascending: false })
    }

    const { data } = await query
    let results = data || []

    if (sort === 'savings') {
      results = results.sort((a, b) => {
        const savA = (a.competitor_price ?? a.price) - a.price
        const savB = (b.competitor_price ?? b.price) - b.price
        return savB - savA
      })
    }

    setProducts(results)
    setLoading(false)
  }, [debouncedSearch, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const sortLabels: Record<SortOption, string> = {
    newest:     'الأحدث',
    price_asc:  'الأرخص أولاً',
    price_desc: 'الأغلى أولاً',
    savings:    'الأكثر توفيرًا',
  }

  return (
    <StorefrontLayout>
      <div className="container section">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>️ جميع المنتجات</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {loading ? '...' : `${products.length} منتج`} — أرخص أدوات مدرسية في المغرب
          </p>
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              type="search"
              className="form-input"
              placeholder=" ابحث عن منتج..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="البحث عن منتج"
              id="product-search"
            />
          </div>
          <select
            className="form-select"
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            aria-label="ترتيب المنتجات"
            id="product-sort"
            style={{ minWidth: 160 }}
          >
            {(Object.entries(sortLabels) as [SortOption, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '0.8', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
            <p style={{ fontWeight: 600 }}>لا توجد نتائج لـ "{debouncedSearch}"</p>
            <button
              className="btn btn-outline"
              style={{ marginTop: '1rem' }}
              onClick={() => setSearch('')}
            >
              مسح البحث
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  )
}
