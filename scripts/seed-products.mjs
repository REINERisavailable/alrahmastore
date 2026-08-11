#!/usr/bin/env node
/**
 * AlRahma Store — Product Image Upload + Seed Script
 * Usage: node scripts/seed-products.mjs
 * 
 * Reads all images from imgsprods/, extracts jemla price from filename,
 * uploads to Supabase Storage, and inserts product records.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local manually
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const [k, ...v] = line.split('=')
  if (k && v.length) env[k.trim()] = v.join('=').trim()
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY // use service role for uploads + inserts
)

const IMGS_DIR = join(__dirname, '..', 'imgsprods')

// Product catalog — derived from image names (jemla price = filename number)
// Selling prices set at ~2.5-3x jemla for small items, lower markup for expensive
const PRODUCT_CATALOG = [
  {
    filename: '0.66.png',
    name: 'قلم جاف Express Orica — علبة 50 قلم',
    description: 'علبة 50 قلم جاف من Express Orica — متوفر بثلاثة ألوان: أزرق، أخضر، أحمر. جودة ممتازة.',
    jemla_price: 0.66,
    price: 2.00,
    competitor_price: 4.00,
    has_variants: true,
    variants: [
      { label: 'أزرق', price: 2.00, jemla_price: 0.66, competitor_price: 4.00 },
      { label: 'أخضر', price: 2.00, jemla_price: 0.66, competitor_price: 4.00 },
      { label: 'أحمر', price: 2.00, jemla_price: 0.66, competitor_price: 4.00 },
    ]
  },
  {
    filename: '1.25.png',
    name: 'ممحاة لوح — قاعدة إسفنجية',
    description: 'ممحاة لوح مدرسي بقاعدة بلاستيكية خضراء وإسفنجة رمادية عالية الجودة.',
    jemla_price: 1.25,
    price: 3.50,
    competitor_price: 7.00,
  },
  {
    filename: '1.25 .png',
    name: 'علبة طباشير ملون — 20 قطعة',
    description: '20 قطعة طباشير ملون عالي الجودة. متعدد الألوان. مناسب للسبورة والرصيف.',
    jemla_price: 1.25,
    price: 3.50,
    competitor_price: 6.50,
  },
  {
    filename: '1.34.png',
    name: 'أقلام رصاص Maped Black Peps — علبة 12',
    description: 'علبة 12 قلم رصاص Maped Black Peps HB#2. معتمدة بيئيًا (40% معاد تدويره). مثالية للمدرسة.',
    jemla_price: 1.34,
    price: 4.00,
    competitor_price: 9.00,
  },
  {
    filename: '2.png',
    name: 'قلم تصحيح (Correcteur) Express',
    description: 'قلم تصحيح سريع الجفاف من Express. سعة 7ml. يمسح الأخطاء بسهولة.',
    jemla_price: 2.00,
    price: 5.00,
    competitor_price: 10.00,
  },
  {
    filename: '2.5.png',
    name: 'أداة رسم هندسي — طقم 3 قطع',
    description: 'طقم رسم هندسي Express 3 قطع: مسطرة 20سم، منقلة 180°، مثلثة 60°. مرن ومتين.',
    jemla_price: 2.50,
    price: 7.00,
    competitor_price: 15.00,
  },
  {
    filename: '2.5. .png',
    name: 'منتج مدرسي — جملة 2.5 درهم',
    description: 'منتج مدرسي عالي الجودة بسعر الجملة 2.5 درهم.',
    jemla_price: 2.50,
    price: 7.00,
    competitor_price: 14.00,
  },
  {
    filename: '2.5.  .png',
    name: 'منتج مدرسي B — جملة 2.5 درهم',
    description: 'منتج مدرسي عالي الجودة.',
    jemla_price: 2.50,
    price: 7.00,
    competitor_price: 14.00,
  },
  {
    filename: '2.5.   .png',
    name: 'منتج مدرسي C — جملة 2.5 درهم',
    description: 'منتج مدرسي عالي الجودة.',
    jemla_price: 2.50,
    price: 7.00,
    competitor_price: 14.00,
  },
  {
    filename: '2.5.    .png',
    name: 'منتج مدرسي D — جملة 2.5 درهم',
    description: 'منتج مدرسي عالي الجودة.',
    jemla_price: 2.50,
    price: 7.00,
    competitor_price: 14.00,
  },
  {
    filename: '2.5.               .png',
    name: 'منتج مدرسي E — جملة 2.5 درهم',
    description: 'منتج مدرسي عالي الجودة.',
    jemla_price: 2.50,
    price: 7.00,
    competitor_price: 14.00,
  },
  {
    filename: '2.5.                     .png',
    name: 'منتج مدرسي F — جملة 2.5 درهم',
    description: 'منتج مدرسي عالي الجودة.',
    jemla_price: 2.50,
    price: 7.00,
    competitor_price: 14.00,
  },
  {
    filename: '2.75.png',
    name: 'بركار مدرسي Express Junior (أخضر)',
    description: 'بركار مدرسي Express Junior مع قلم رصاص. علبة بلاستيكية شفافة. مثالي لدروس الهندسة.',
    jemla_price: 2.75,
    price: 8.00,
    competitor_price: 18.00,
  },
  {
    filename: '2.75 .png',
    name: 'بركار مدرسي — نوع ثاني',
    description: 'بركار مدرسي عالي الجودة.',
    jemla_price: 2.75,
    price: 8.00,
    competitor_price: 18.00,
  },
  {
    filename: '4.5.png',
    name: 'طقم بركار Maped Study',
    description: 'طقم بركار Maped Study مع مثلثة. جودة عالية. مناسب للمرحلة الإعدادية والثانوية.',
    jemla_price: 4.50,
    price: 12.00,
    competitor_price: 25.00,
  },
  {
    filename: '4.5 .png',
    name: 'طقم بركار — نوع ثاني',
    description: 'طقم بركار مدرسي عالي الجودة.',
    jemla_price: 4.50,
    price: 12.00,
    competitor_price: 25.00,
  },
  {
    filename: '9 or 11.5.png',
    name: 'ألوان الغواش — 10 أنابيب ملونة',
    description: '10 أنابيب غواش ملونة (10ml لكل أنبوب). مناسبة للرسم المدرسي والمشاريع الفنية.',
    jemla_price: 9.00, // or 11.5 — using lower
    price: 25.00,
    competitor_price: 50.00,
  },
  {
    filename: '12.png',
    name: 'أقلام تلوين Maped Color Peps Mini — 12 لون',
    description: 'علبة 12 قلم تلوين Maped Color Peps Mini Strong. خالية من الخشب. مقاومة للكسر.',
    jemla_price: 12.00,
    price: 30.00,
    competitor_price: 60.00,
  },
  {
    filename: ' 12 .png',
    name: 'بركار Deli Pioneer (وردي)',
    description: 'بركار Deli Pioneer G20102 بتصميم وردي أنيق. دقة عالية. مع أداة تحديد.',
    jemla_price: 12.00,
    price: 30.00,
    competitor_price: 60.00,
  },
  {
    filename: '14.png',
    name: 'لوح للكتابة A4 — ألوان متعددة',
    description: 'لوح للكتابة A4 قابل للمسح بالجانبين (أبيض ومربعات). إطار بلاستيكي ملون. ماركة Boost.',
    jemla_price: 14.00,
    price: 35.00,
    competitor_price: 70.00,
    has_variants: true,
    variants: [
      { label: 'أصفر', price: 35.00, jemla_price: 14.00, competitor_price: 70.00 },
      { label: 'أحمر', price: 35.00, jemla_price: 14.00, competitor_price: 70.00 },
    ]
  },
  {
    filename: '45.png',
    name: 'حقيبة مدرسية أطفال — شخصيات كرتونية (صغيرة)',
    description: 'حقائب مدرسية للأطفال بشخصيات كرتونية: Avengers، Ben10، Princess. مناسبة للابتدائي.',
    jemla_price: 45.00,
    price: 99.00,
    competitor_price: 180.00,
    has_variants: true,
    variants: [
      { label: 'Avengers', price: 99.00, jemla_price: 45.00, competitor_price: 180.00 },
      { label: 'Ben 10', price: 99.00, jemla_price: 45.00, competitor_price: 180.00 },
      { label: 'Princess', price: 99.00, jemla_price: 45.00, competitor_price: 180.00 },
    ]
  },
  {
    filename: '65.png',
    name: 'حقيبة مدرسية 3D — Kuromi / Stitch / Hello Kitty',
    description: 'حقيبة مدرسية 3D بتصاميم Kuromi، Stitch، Hello Kitty. مناسبة للمرحلة الابتدائية.',
    jemla_price: 65.00,
    price: 139.00,
    competitor_price: 250.00,
    has_variants: true,
    variants: [
      { label: 'Kuromi بنفسجي', price: 139.00, jemla_price: 65.00, competitor_price: 250.00 },
      { label: 'Kuromi وردي', price: 139.00, jemla_price: 65.00, competitor_price: 250.00 },
      { label: 'Hello Kitty', price: 139.00, jemla_price: 65.00, competitor_price: 250.00 },
      { label: 'Stitch', price: 139.00, jemla_price: 65.00, competitor_price: 250.00 },
    ]
  },
  {
    filename: '115.png',
    name: 'حقيبة مدرسية — Frozen / Spiderman / Kuromi',
    description: 'حقيبة مدرسية كبيرة بتصاميم Frozen، Spiderman، Kuromi، Carebears. مناسبة للابتدائي والإعدادي.',
    jemla_price: 115.00,
    price: 249.00,
    competitor_price: 450.00,
    has_variants: true,
    variants: [
      { label: 'Frozen', price: 249.00, jemla_price: 115.00, competitor_price: 450.00 },
      { label: 'Spiderman', price: 249.00, jemla_price: 115.00, competitor_price: 450.00 },
      { label: 'Kuromi', price: 249.00, jemla_price: 115.00, competitor_price: 450.00 },
      { label: 'Carebears', price: 249.00, jemla_price: 115.00, competitor_price: 450.00 },
    ]
  },
  {
    filename: '120.png',
    name: 'حقيبة مدرسية بنات بومبوم — ألوان متعددة',
    description: 'حقيبة مدرسية للبنات مع بومبوم وكيس صغير. ألوان: أزرق، بورجوندي، أخضر، بنفسجي. مواد ممتازة.',
    jemla_price: 120.00,
    price: 259.00,
    competitor_price: 480.00,
    has_variants: true,
    variants: [
      { label: 'أزرق فاتح', price: 259.00, jemla_price: 120.00, competitor_price: 480.00 },
      { label: 'بورجوندي', price: 259.00, jemla_price: 120.00, competitor_price: 480.00 },
      { label: 'أخضر', price: 259.00, jemla_price: 120.00, competitor_price: 480.00 },
      { label: 'بنفسجي', price: 259.00, jemla_price: 120.00, competitor_price: 480.00 },
    ]
  },
]

async function uploadImage(filepath, storagePath) {
  const fileContent = readFileSync(filepath)
  const { error } = await supabase.storage
    .from('image')
    .upload(storagePath, fileContent, {
      contentType: 'image/png',
      upsert: true,
    })
  if (error && !error.message.includes('already exists')) {
    throw error
  }
  const { data } = supabase.storage.from('image').getPublicUrl(storagePath)
  return data.publicUrl
}

async function seed() {
  console.log('🌿 AlRahma Store — Product Seed Script')
  console.log('=========================================\n')

  let successCount = 0
  let errorCount = 0

  for (const product of PRODUCT_CATALOG) {
    const imgPath = join(IMGS_DIR, product.filename)
    const storagePath = `products/${Date.now()}-${product.filename.replace(/ /g, '_')}`

    console.log(`📦 Processing: ${product.name}`)
    console.log(`   💰 Jemla: ${product.jemla_price} DH | Selling: ${product.price} DH | Margin: ${((product.price - product.jemla_price) / product.price * 100).toFixed(0)}%`)

    try {
      // Upload image
      let image_url = null
      try {
        image_url = await uploadImage(imgPath, storagePath)
        console.log(`   ✅ Image uploaded`)
      } catch (imgErr) {
        console.log(`   ⚠️  Image upload failed: ${imgErr.message}`)
      }

      // Insert product
      const { data: inserted, error: prodErr } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          competitor_price: product.competitor_price,
          jemla_price: product.jemla_price,
          image_url,
          has_variants: product.has_variants || false,
          is_active: true,
        })
        .select()
        .single()

      if (prodErr) throw prodErr

      // Insert variants if any
      if (product.variants && product.variants.length > 0) {
        const variantRows = product.variants.map(v => ({
          product_id: inserted.id,
          label: v.label,
          price: v.price,
          jemla_price: v.jemla_price,
          competitor_price: v.competitor_price,
          is_active: true,
        }))
        const { error: varErr } = await supabase.from('product_variants').insert(variantRows)
        if (varErr) console.log(`   ⚠️  Variants error: ${varErr.message}`)
        else console.log(`   ✅ ${product.variants.length} variants added`)
      }

      successCount++
      console.log(`   🎉 Done!\n`)
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200))
    } catch (err) {
      errorCount++
      console.log(`   ❌ Error: ${err.message}\n`)
    }
  }

  console.log('\n=========================================')
  console.log(`✅ Success: ${successCount} | ❌ Errors: ${errorCount}`)
  console.log('=========================================')
}

seed().catch(console.error)
