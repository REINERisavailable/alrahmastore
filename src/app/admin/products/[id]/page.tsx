'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'

interface Variant {
  id?: number
  label: string
  price: string
  jemla_price: string
  competitor_price: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState({
    name: '', description: '', price: '', competitor_price: '',
    jemla_price: '', video_url: '', is_active: true, has_variants: false,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data: prod, error: err1 } = await supabase.from('products').select('*').eq('id', id).single()
        if (err1) throw err1
        
        if (prod) {
          setForm({
            name: prod.name,
            description: prod.description || '',
            price: String(prod.price),
            competitor_price: prod.competitor_price ? String(prod.competitor_price) : '',
            jemla_price: prod.jemla_price ? String(prod.jemla_price) : '',
            video_url: prod.video_url || '',
            is_active: prod.is_active,
            has_variants: prod.has_variants || false,
          })
          setCurrentImageUrl(prod.image_url)
          setImagePreview(prod.image_url)

          if (prod.has_variants) {
            const { data: vars } = await supabase.from('product_variants').select('*').eq('product_id', id)
            if (vars && vars.length > 0) {
              setVariants(vars.map((v: any) => ({
                id: v.id,
                label: v.label,
                price: String(v.price),
                jemla_price: v.jemla_price ? String(v.jemla_price) : '',
                competitor_price: v.competitor_price ? String(v.competitor_price) : ''
              })))
            } else {
              setVariants([{ label: '', price: String(prod.price), jemla_price: prod.jemla_price ? String(prod.jemla_price) : '', competitor_price: prod.competitor_price ? String(prod.competitor_price) : '' }])
            }
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function addVariant() {
    setVariants(v => [...v, { label: '', price: form.price, jemla_price: form.jemla_price, competitor_price: form.competitor_price }])
  }

  function removeVariant(idx: number) {
    setVariants(v => v.filter((_, i) => i !== idx))
  }

  function updateVariant(idx: number, field: keyof Variant, value: string) {
    setVariants(v => v.map((vr, i) => i === idx ? { ...vr, [field]: value } : vr))
  }

  const price = parseFloat(form.price) || 0
  const jemla = parseFloat(form.jemla_price) || 0
  const margin = price > 0 && jemla > 0 ? ((price - jemla) / price * 100).toFixed(0) : null
  const profitPerUnit = price > 0 && jemla > 0 ? (price - jemla).toFixed(2) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let image_url = currentImageUrl

      if (imageFile) {
        const ext = imageFile.name.split('.').pop() || 'jpg'
        const path = `products/${Date.now()}.${ext}`
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('path', path)
        const { uploadImageAction } = await import('@/app/admin/actions')
        image_url = await uploadImageAction(formData)
      }

      const productData = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        competitor_price: form.competitor_price ? parseFloat(form.competitor_price) : null,
        jemla_price: form.jemla_price ? parseFloat(form.jemla_price) : null,
        video_url: form.video_url || null,
        image_url,
        has_variants: form.has_variants,
        is_active: form.is_active,
      }

      const { updateProductAction } = await import('@/app/admin/actions')
      await updateProductAction(id, productData, variants, form.has_variants)

      router.push('/admin/products')
    } catch {
      setError('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}> جارٍ التحميل...</div>

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>️ تعديل المنتج</h1>

      <form onSubmit={handleSubmit} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
        <div className="form-group">
          <label className="form-label">صورة المنتج</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {imagePreview && (
              <div style={{ width: 100, height: 100, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <img src={imagePreview} alt="معاينة" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <label style={{ flex: 1, cursor: 'pointer' }}>
              <div className="upload-zone" style={{ padding: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}> تغيير الصورة</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-video"> رابط فيديو أو GIF (اختياري)</label>
          <input id="edit-video" className="form-input" type="url" placeholder="https://..." value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} dir="ltr" />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-name">اسم المنتج *</label>
          <input id="edit-name" className="form-input" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-desc">الوصف</label>
          <textarea id="edit-desc" className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-jemla"> سعر الجملة</label>
            <input id="edit-jemla" className="form-input" type="number" step="0.01" min="0" value={form.jemla_price} onChange={e => setForm(f => ({ ...f, jemla_price: e.target.value }))} dir="ltr" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-price">️ سعرنا *</label>
            <input id="edit-price" className="form-input" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required dir="ltr" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-comp"> سعر المنافس</label>
            <input id="edit-comp" className="form-input" type="number" step="0.01" min="0" value={form.competitor_price} onChange={e => setForm(f => ({ ...f, competitor_price: e.target.value }))} dir="ltr" />
          </div>
        </div>

        {margin !== null && (
          <div style={{ background: Number(margin) >= 40 ? 'var(--green-50)' : '#fef3c7', border: `1px solid ${Number(margin) >= 40 ? 'var(--green-200)' : '#fcd34d'}`, borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{margin}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>هامش الربح</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-savings)' }}>{profitPerUnit} دهـ</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ربح لكل وحدة</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{(price / jemla).toFixed(1)}x</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>مضاعف الجملة</div>
            </div>
          </div>
        )}

        {/* Variants toggle */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input id="edit-variants" type="checkbox" checked={form.has_variants} onChange={e => setForm(f => ({ ...f, has_variants: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
            <label htmlFor="edit-variants" className="form-label" style={{ margin: 0, cursor: 'pointer', fontWeight: 700 }}>
               هذا المنتج له خيارات (ألوان، أحجام...)
            </label>
          </div>

          {form.has_variants && (
            <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--color-border)' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>الخيارات المتاحة:</p>
              {variants.map((v, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input className="form-input" placeholder="اسم الخيار" value={v.label} onChange={e => updateVariant(idx, 'label', e.target.value)} style={{ fontSize: '0.85rem' }} />
                  <input className="form-input" placeholder="السعر" type="number" step="0.01" value={v.price} onChange={e => updateVariant(idx, 'price', e.target.value)} dir="ltr" style={{ fontSize: '0.85rem' }} />
                  <input className="form-input" placeholder="الجملة" type="number" step="0.01" value={v.jemla_price} onChange={e => updateVariant(idx, 'jemla_price', e.target.value)} dir="ltr" style={{ fontSize: '0.85rem' }} />
                  <input className="form-input" placeholder="المنافس" type="number" step="0.01" value={v.competitor_price} onChange={e => updateVariant(idx, 'competitor_price', e.target.value)} dir="ltr" style={{ fontSize: '0.85rem' }} />
                  <button type="button" onClick={() => removeVariant(idx)} style={{ background: '#fee2e2', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.625rem', cursor: 'pointer', fontSize: '0.875rem' }}></button>
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={addVariant} style={{ marginTop: '0.5rem' }}>+ إضافة خيار</button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input id="edit-active" type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
          <label htmlFor="edit-active" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>نشر المنتج</label>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }} id="update-product-btn">
            {saving ? ' جارٍ الحفظ...' : ' حفظ التعديلات'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => router.back()}>إلغاء</button>
        </div>
      </form>
    </div>
  )
}
