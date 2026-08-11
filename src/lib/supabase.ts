import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  competitor_price: number | null
  jemla_price: number | null        // Prix de gros / wholesale cost
  image_url: string | null
  video_url: string | null          // Optional video/GIF URL
  has_variants: boolean             // Whether this product has size/color/etc variants
  is_active: boolean
  created_at: string
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  label: string                     // e.g. "96 ورقة", "أزرق", "كبير"
  price: number                     // Selling price for this variant
  jemla_price: number | null        // Wholesale cost for this variant
  competitor_price: number | null
  stock: number | null
  is_active: boolean
}

export interface Order {
  id: string
  customer_name: string
  phone: string
  address: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping_fee: number | null
  total_savings: number
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  unit_price: number
  competitor_unit_price: number | null
  created_at: string
  products?: Product
  product_variants?: ProductVariant
}

export interface PhotoOrder {
  id: string
  customer_name: string
  phone: string
  address: string
  image_urls: string[]
  status: 'pending_review' | 'contacted' | 'confirmed' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
}
