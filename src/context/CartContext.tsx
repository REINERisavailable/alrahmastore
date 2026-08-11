'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Product } from '@/lib/supabase'

export interface CartItem {
  product: Product
  qty: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  totalItems: number
  subtotal: number
  competitorTotal: number
  totalSavings: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Persist cart to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('alrahma_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('alrahma_cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { product, qty }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }, [])

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId))
    } else {
      setItems(prev =>
        prev.map(i => (i.product.id === productId ? { ...i, qty } : i))
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const competitorTotal = items.reduce(
    (sum, i) => sum + (i.product.competitor_price ?? i.product.price) * i.qty,
    0
  )
  const totalSavings = Math.max(0, competitorTotal - subtotal)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        totalItems,
        subtotal,
        competitorTotal,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
