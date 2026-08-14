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
  try {
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderErr || !order) {
      console.error('Error creating order:', orderErr)
      return { success: false, error: 'Order Error: ' + (orderErr?.message || 'Unknown DB error') }
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
      return { success: false, error: 'Items Error: ' + itemsErr.message }
    }

    return { success: true, order }
  } catch (e: any) {
    return { success: false, error: 'Server Catch: ' + e.message }
  }
}

// Public server action for creating a photo order
export async function createPhotoOrderAction(orderData: any) {
  try {
    const { data: photoOrder, error: dbErr } = await supabaseAdmin
      .from('photo_orders')
      .insert(orderData)
      .select()
      .single()

    if (dbErr) {
      console.error('Error creating photo order:', dbErr)
      return { success: false, error: 'PhotoOrder Error: ' + dbErr.message }
    }

    return { success: true, photoOrder }
  } catch (e: any) {
    return { success: false, error: 'Server Catch: ' + e.message }
  }
}
