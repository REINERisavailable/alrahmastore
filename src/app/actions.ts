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
