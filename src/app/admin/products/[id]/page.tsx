'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Product } from '@/lib/supabase'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState({ name: '', description: '', price: '', competitor_price: '', is_active: true })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await (supabaseAdmin as any).from('products').select('*').eq('id', id).single()
      if (data) {
        setForm({
          name: data.name,
          description: data.description || '',
          price: String(data.price),
          competitor_price: data.competitor_price ? String(data.competitor_price) : '',
          is_active: data.is_active,
        })
        setCurrentImageUrl(data.image_url)
        setImagePreview(data.image_url)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let image_url = currentImageUrl

      if (imageFile) {
        const ext = imageFile.name.split('.').pop() || 'jpg'
        const path = `products/${Date.now()}.${ext}`
        const { error: upErr } = await (supabaseAdmin as any).storage.from('image').upload(path, imageFile, { contentType: imageFile.type })
        if (upErr) throw upErr
        const { data } = (supabaseAdmin as any).storage.from('image').getPublicUrl(path)
        image_url = data.publicUrl
      }

      const { error: dbErr } = await (supabaseAdmin as any).from('products').update({
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        competitor_price: form.competitor_price ? parseFloat(form.competitor_price) : null,
        image_url,
        is_active: form.is_active,
      }).eq('id', id)

      if (dbErr) throw dbErr
      router.push('/admin/products')
    } catch {
      setError('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>⏳ جارٍ التحميل...</div>

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>✏️ تعديل المنتج</h1>

      <form onSubmit={handleSubmit} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '2rem' }}>
        <div className="form-group">
          <label className="form-label">الصورة الحالية</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {imagePreview && (
              <div style={{ width: 100, height: 100, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <img src={imagePreview} alt="معاينة" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <label style={{ flex: 1, cursor: 'pointer' }}>
              <div className="upload-zone" style={{ padding: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>🔄 تغيير الصورة</p>
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                const file = e.target.files?.[0]
                if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
              }} />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-name">اسم المنتج *</label>
          <input id="edit-name" className="form-input" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-desc">الوصف</label>
          <textarea id="edit-desc" className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-price">سعرنا *</label>
            <input id="edit-price" className="form-input" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required dir="ltr" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-comp">سعر المنافس</label>
            <input id="edit-comp" className="form-input" type="number" step="0.01" min="0" value={form.competitor_price} onChange={e => setForm(f => ({ ...f, competitor_price: e.target.value }))} dir="ltr" />
          </div>
        </div>

        {form.price && form.competitor_price && parseFloat(form.competitor_price) > parseFloat(form.price) && (
          <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-md)', padding: '0.875rem', fontSize: '0.875rem' }}>
            ✅ العميل يوفّر <strong style={{ color: 'var(--color-primary)' }}>
              {(parseFloat(form.competitor_price) - parseFloat(form.price)).toFixed(2)} درهم
              ({Math.round(((parseFloat(form.competitor_price) - parseFloat(form.price)) / parseFloat(form.competitor_price)) * 100)}%)
            </strong>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input id="edit-active" type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
          <label htmlFor="edit-active" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>نشر المنتج</label>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }} id="update-product-btn">
            {saving ? '⏳ جارٍ الحفظ...' : '💾 حفظ التعديلات'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => router.back()}>إلغاء</button>
        </div>
      </form>
    </div>
  )
}
