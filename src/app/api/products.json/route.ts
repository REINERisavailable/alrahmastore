import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { data } = await supabase
    .from('products')
    .select('id, name, price, competitor_price, description, image_url')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return NextResponse.json(
    {
      store: 'متجر الرحمة',
      url: 'https://alrahma.store',
      description: 'أرخص متجر للأدوات المدرسية في المغرب',
      currency: 'MAD',
      delivery: 'لجميع أنحاء المغرب - مجاني فوق 100 درهم',
      products: data || [],
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
