'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminSession } from '@/lib/auth'

async function checkAuth() {
  const isAuth = await getAdminSession()
  if (!isAuth) throw new Error('Unauthorized')
}

export async function toggleProductActiveAction(id: string, current: boolean) {
  await checkAuth()
  await supabaseAdmin.from('products').update({ is_active: !current }).eq('id', id)
}

export async function deleteProductAction(id: string) {
  await checkAuth()
  await supabaseAdmin.from('products').delete().eq('id', id)
}

export async function updateProductAction(id: string, productData: any, variants: any[], hasVariants: boolean) {
  await checkAuth()
  
  const { error } = await supabaseAdmin.from('products').update(productData).eq('id', id)
  if (error) throw error

  if (hasVariants && variants.length > 0) {
    await supabaseAdmin.from('product_variants').delete().eq('product_id', id)
    const variantRows = variants.filter((v: any) => v.label.trim()).map((v: any) => ({
      product_id: id,
      label: v.label,
      price: parseFloat(v.price) || productData.price,
      jemla_price: v.jemla_price ? parseFloat(v.jemla_price) : null,
      competitor_price: v.competitor_price ? parseFloat(v.competitor_price) : null,
      is_active: true,
    }))
    if (variantRows.length > 0) {
      await supabaseAdmin.from('product_variants').insert(variantRows)
    }
  } else {
    await supabaseAdmin.from('product_variants').delete().eq('product_id', id)
  }
}

export async function insertProductAction(productData: any, variants: any[], hasVariants: boolean) {
  await checkAuth()
  
  const { data: prod, error } = await supabaseAdmin.from('products').insert(productData).select().single()
  if (error) throw error

  if (hasVariants && variants.length > 0) {
    const variantRows = variants.filter((v: any) => v.label.trim()).map((v: any) => ({
      product_id: prod.id,
      label: v.label,
      price: parseFloat(v.price) || productData.price,
      jemla_price: v.jemla_price ? parseFloat(v.jemla_price) : null,
      competitor_price: v.competitor_price ? parseFloat(v.competitor_price) : null,
      is_active: true,
    }))
    if (variantRows.length > 0) {
      await supabaseAdmin.from('product_variants').insert(variantRows)
    }
  }
}

export async function uploadImageAction(formData: FormData) {
  await checkAuth()
  const file = formData.get('file') as File
  const path = formData.get('path') as string
  if (!file || !path) throw new Error('Missing file or path')

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  const { error } = await supabaseAdmin.storage.from('image').upload(path, buffer, {
    contentType: file.type,
    upsert: true
  })
  
  if (error) throw error
  
  const { data } = supabaseAdmin.storage.from('image').getPublicUrl(path)
  return data.publicUrl
}
