import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const filePath = '/Users/mhmdjmri/.gemini/antigravity/brain/77a5401e-53e8-433c-b155-ce000f92b46a/.tempmediaStorage/media_1786483721217.png'
  const fileBuffer = fs.readFileSync(filePath)
  
  const storagePath = `newprods/${Date.now()}_notebooks.png`
  
  const { data: uploadData, error: uploadErr } = await supabase.storage.from('image').upload(storagePath, fileBuffer, {
    contentType: 'image/png',
    upsert: true
  })
  
  if (uploadErr) {
    console.error('Upload Error:', uploadErr)
    return
  }
  
  const { data: publicUrlData } = supabase.storage.from('image').getPublicUrl(storagePath)
  
  const prod = {
    name: 'دفاتر مدرسية',
    description: 'دفاتر مدرسية بأحجام مختلفة',
    price: 1.5,
    jemla_price: 1.0,
    image_url: publicUrlData.publicUrl,
    is_active: true,
    has_variants: true
  }
  
  const { data: insertedProd, error: dbErr } = await supabase.from('products').insert(prod).select().single()
  if (dbErr) {
    console.error('DB Error:', dbErr)
    return
  }
  
  console.log('Added product:', insertedProd.id)

  const variants = [
    { product_id: insertedProd.id, label: '24 ورقة', price: 1.5, jemla_price: 1.0, competitor_price: 2.5, is_active: true },
    { product_id: insertedProd.id, label: '50 ورقة', price: 2.5, jemla_price: 1.8, competitor_price: 4.0, is_active: true },
    { product_id: insertedProd.id, label: '100 ورقة', price: 3.5, jemla_price: 2.5, competitor_price: 5.0, is_active: true }
  ]
  
  const { error: varErr } = await supabase.from('product_variants').insert(variants)
  if (varErr) {
    console.error('Variant Error:', varErr)
  } else {
    console.log('Added variants successfully.')
  }
}
run()
