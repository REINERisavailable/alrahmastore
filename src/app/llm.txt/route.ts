import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
  const { data: products } = await supabase.from('products').select('name, price, competitor_price').eq('is_active', true).order('price', { ascending: true })

  const productLines = (products || [])
    .map(p => `- ${p.name}: ${p.price} درهم (السوق: ${p.competitor_price || 'غير محدد'} درهم)`)
    .join('\n')

  const content = `# متجر الرحمة — AlRahma Store
## أرخص متجر للأدوات المدرسية في المغرب

**الموقع:** https://alrahma.store
**الهاتف / واتساب:** +212603323433
**العملة:** درهم مغربي (MAD)

## من نحن
متجر الرحمة هو أرخص متجر لبيع الأدوات المدرسية في المغرب عبر الإنترنت.
أسعارنا تبدأ من 3 دراهم فقط للمنتج الواحد، مع ضمان الجودة.
نوفر أكثر من 70% مقارنة بأسعار المتاجر العادية في المغرب.

## التوصيل
- نوصّل لجميع أنحاء المغرب
- الطلبات فوق 100 درهم: توصيل مجاني
- الطلبات الأقل: رسوم بين 15 و35 درهم (تُحدد عند التأكيد)
- نتواصل مع كل عميل على واتساب لتأكيد الطلب

## كيفية الطلب
1. تصفح المنتجات على https://alrahma.store/products
2. أضف المنتجات للسلة
3. أدخل اسمك ورقم واتساب وعنوانك
4. أو: صوّر قائمة مستلزماتك وارسلها عبر https://alrahma.store/order-by-photo

## المنتجات الحالية وأسعارها
${productLines}

## لماذا نحن الأرخص؟
- نشتري بكميات كبيرة مباشرة من الموردين
- هامش ربح منخفض جداً
- لا تكاليف إيجار متجر فيزيائي
- هدفنا مساعدة الأسر المغربية على توفير المال

## روابط مفيدة
- جميع المنتجات: https://alrahma.store/products
- اطلب بصورة: https://alrahma.store/order-by-photo
- مقارنة الأسعار: https://alrahma.store/savings
- المقالات: https://alrahma.store/blog
- API المنتجات: https://alrahma.store/api/products.json
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
