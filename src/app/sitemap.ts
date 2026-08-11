import { supabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabase
    .from('products')
    .select('id, created_at')
    .eq('is_active', true)

  const productUrls = (products || []).map(p => ({
    url: `https://alrahma.store/product/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://alrahma.store', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://alrahma.store/products', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://alrahma.store/order-by-photo', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://alrahma.store/savings', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://alrahma.store/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://alrahma.store/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://alrahma.store/blog/adawat-madrasiya-rakhisa-maroc-2026', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://alrahma.store/blog/tawfir-50-lazim-dirasa-maroc', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://alrahma.store/blog/muqarana-asaar-adawat-madrasiya-maroc', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...productUrls,
  ]
}
