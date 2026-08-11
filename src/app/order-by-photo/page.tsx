'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import StorefrontLayout from '@/components/StorefrontLayout'
import { supabase } from '@/lib/supabase'
import { WHATSAPP_NUMBER } from '@/lib/utils'

interface UploadedFile {
  file: File
  preview: string
  progress: number
  url?: string
}

export default function OrderByPhotoPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    const arr = Array.from(newFiles).slice(0, 5 - files.length)
    const mapped: UploadedFile[] = arr.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }))
    setFiles(prev => [...prev, ...mapped].slice(0, 5))
  }, [files.length])

  function removeFile(idx: number) {
    setFiles(prev => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  async function uploadFile(uf: UploadedFile, idx: number): Promise<string> {
    const ext = uf.file.name.split('.').pop() || 'jpg'
    const path = `photo-orders/${Date.now()}-${idx}.${ext}`
    const { error: upErr } = await supabase.storage
      .from('image')
      .upload(path, uf.file, { contentType: uf.file.type, upsert: false })
    if (upErr) throw upErr
    const { data } = supabase.storage.from('image').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('يرجى ملء جميع الحقول')
      return
    }
    if (files.length === 0) {
      setError('يرجى إضافة صورة واحدة على الأقل')
      return
    }
    setLoading(true)
    try {
      // Upload all images
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], i)
        urls.push(url)
        setFiles(prev => prev.map((f, j) => j === i ? { ...f, progress: 100 } : f))
      }

      // Save photo order
      const { error: dbErr } = await supabase.from('photo_orders').insert({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        image_urls: urls,
        status: 'pending_review',
      })
      if (dbErr) throw dbErr

      // WhatsApp redirect
      const waMsg = `مرحبا 👋 لقد أرسلت قائمة مستلزماتي المدرسية بالصورة من متجر الرحمة.\n\n📱 رقمي: ${form.phone}\n📍 عنواني: ${form.address}\n\nأنتظر التأكيد 🙏`
      router.push(`/order-success?phone=${form.phone}&wa=${encodeURIComponent(waMsg)}&savings=0`)
    } catch {
      setError('حدث خطأ أثناء رفع الصور. يرجى المحاولة مجددًا.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StorefrontLayout>
      <div className="container section" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📸</div>
          <h1 style={{ marginBottom: '0.75rem' }}>اطلب بصورة</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            صوّر قائمة مستلزماتك المدرسية (مكتوبة أو مطبوعة) وارسلها لنا. سنتواصل معك على واتساب بالأسعار والتفاصيل.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Image Upload */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
              📸 صور القائمة (حتى 5 صور)
            </label>
            <div
              className={`upload-zone ${dragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
              role="button"
              aria-label="منطقة رفع الصور"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📷</div>
              <p style={{ fontWeight: 700, marginBottom: '0.375rem' }}>اضغط لاختيار صور أو صوّر مباشرة</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>JPG, PNG, HEIC — حتى 10MB لكل صورة</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              style={{ display: 'none' }}
              onChange={e => addFiles(e.target.files)}
              aria-hidden
            />

            {/* Previews */}
            {files.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                {files.map((f, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--color-border)' }}>
                    <img src={f.preview} alt={`صورة ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {f.progress === 100 && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(22,163,74,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>✓</div>
                    )}
                    {!loading && (
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        style={{ position: 'absolute', top: 2, left: 2, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="حذف الصورة"
                      >✕</button>
                    )}
                  </div>
                ))}
                {files.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', border: '2px dashed var(--color-border-strong)', background: 'var(--green-50)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-primary)' }}
                    aria-label="إضافة صورة"
                  >+</button>
                )}
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="form-group">
            <label className="form-label" htmlFor="photo-name">الاسم الكامل</label>
            <input id="photo-name" className="form-input" type="text" placeholder="أدخل اسمك" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoComplete="name" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="photo-phone">رقم واتساب</label>
            <input id="photo-phone" className="form-input" type="tel" placeholder="0612345678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required autoComplete="tel" dir="ltr" style={{ textAlign: 'right' }} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="photo-address">العنوان</label>
            <textarea id="photo-address" className="form-textarea" placeholder="المدينة، الحي، الشارع..." value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required rows={3} autoComplete="street-address" />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.875rem' }}>{error}</div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} id="submit-photo-order-btn">
            {loading ? '⏳ جارٍ رفع الصور...' : '📸 إرسال القائمة'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            بعد الإرسال سنتواصل معك على واتساب بالأسعار والتفاصيل 🙏
          </div>
        </form>
      </div>
    </StorefrontLayout>
  )
}
