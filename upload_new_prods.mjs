import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const dir = path.join(process.cwd(), 'imgsprods/newimgs')
  const files = fs.readdirSync(dir)
  for (const file of files) {
    if (!file.endsWith('.png') && !file.endsWith('.jpg') && !file.endsWith('.jpeg')) continue
    const jemlaStr = file.replace('.png', '').replace('.jpg', '').replace('.jpeg', '').trim()
    const jemla = parseFloat(jemlaStr)
    const sellingPrice = isNaN(jemla) ? 15 : Math.ceil(jemla * 1.5)
    
    console.log(`Processing ${file} (Jemla: ${jemla}, Price: ${sellingPrice})`)
    
    const filePath = path.join(dir, file)
    const fileBuffer = fs.readFileSync(filePath)
    
    const storagePath = `newprods/${Date.now()}_${file.replace(/\s+/g, '_')}`
    
    const { data: uploadData, error: uploadErr } = await supabase.storage.from('image').upload(storagePath, fileBuffer, {
      contentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
      upsert: true
    })
    
    if (uploadErr) {
      console.error('Upload Error:', uploadErr)
      continue
    }
    
    const { data: publicUrlData } = supabase.storage.from('image').getPublicUrl(storagePath)
    
    const prod = {
      name: `منتج جديد - ${jemlaStr}`,
      description: 'منتج جديد بأسعار مميزة',
      price: sellingPrice,
      jemla_price: isNaN(jemla) ? null : jemla,
      image_url: publicUrlData.publicUrl,
      is_active: true,
      has_variants: false
    }
    
    const { error: dbErr } = await supabase.from('products').insert(prod)
    if (dbErr) {
      console.error('DB Error:', dbErr)
    } else {
      console.log('Added product successfully.')
    }
  }
}
run()
