'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'

// Public server action for uploading images without checking admin auth
export async function uploadPublicImageAction(formData: FormData) {
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

// Public server action for creating a normal order and its items
export async function createOrderAction(orderData: any, orderItems: any[]) {
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (orderErr || !order) {
    console.error('Error creating order:', orderErr)
    throw new Error('فشل في إنشاء الطلب')
  }

  const itemsToInsert = orderItems.map(item => ({
    ...item,
    order_id: order.id
  }))

  const { error: itemsErr } = await supabaseAdmin
    .from('order_items')
    .insert(itemsToInsert)

  if (itemsErr) {
    console.error('Error inserting order items:', itemsErr)
    throw new Error('فشل في حفظ المنتجات في الطلب')
  }

  return order
}

// Public server action for creating a photo order
export async function createPhotoOrderAction(orderData: any) {
  const { data: photoOrder, error: dbErr } = await supabaseAdmin
    .from('photo_orders')
    .insert(orderData)
    .select()
    .single()

  if (dbErr) {
    console.error('Error creating photo order:', dbErr)
    throw new Error('فشل في إنشاء الطلب بالصورة')
  }

  return photoOrder
}
