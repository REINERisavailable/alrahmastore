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

export async function updateOrderStatusAction(id: string, status: string) {
  await checkAuth()
  const { error } = await supabaseAdmin.from('orders').update({ status }).eq('id', id)
  if (error) {
    console.error('Error updating order status:', error)
    throw new Error('فشل تحديث حالة الطلب')
  }
}

export async function updatePhotoOrderAction(id: string, updates: any) {
  await checkAuth()
  const { error } = await supabaseAdmin.from('photo_orders').update(updates).eq('id', id)
  if (error) {
    console.error('Error updating photo order:', error)
    throw new Error('فشل تحديث الطلب')
  }
}

export async function getOrdersAction(page: number, pageSize: number, search?: string, statusFilter?: string) {
  await checkAuth()
  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*, products(name))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1)
  
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }
  if (search) {
    query = query.or(`phone.ilike.%${search}%,customer_name.ilike.%${search}%`)
  }

  const { data, count, error } = await query
  
  if (error) {
    console.error('Error fetching orders:', error)
    return { data: [], count: 0 }
  }
  return { data: data || [], count: count || 0 }
}

export async function getPhotoOrdersAction() {
  await checkAuth()
  const { data, error } = await supabaseAdmin
    .from('photo_orders')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching photo orders:', error)
    return { data: [] }
  }
  return { data: data || [] }
}

export async function getProductsAction() {
  await checkAuth()
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching products:', error)
    return { data: [] }
  }
  return { data: data || [] }
}

export async function getProductAction(id: string) {
  await checkAuth()
  const { data: prod, error: err1 } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
    
  if (err1 || !prod) {
    console.error('Error fetching product:', err1)
    return { prod: null, vars: [] }
  }

  const { data: vars } = await supabaseAdmin
    .from('product_variants')
    .select('*')
    .eq('product_id', id)

  return { prod, vars: vars || [] }
}
