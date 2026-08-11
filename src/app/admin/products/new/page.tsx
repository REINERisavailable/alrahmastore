'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface Variant {
  label: string
  price: string
  jemla_price: string
  competitor_price: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', description: '', price: '', competitor_price: '',
    jemla_price: '', video_url: '', is_active: true, has_variants: false,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [variants, setVariants] = useState<Variant[]>([{ label: '', price: '', jemla_price: '', competitor_price: '' }])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

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

  // Profit margin preview
  const price = parseFloat(form.price) || 0
  const jemla = parseFloat(form.jemla_price) || 0
  const margin = price > 0 && jemla > 0 ? ((price - jemla) / price * 100).toFixed(0) : null
  const profitPerUnit = price > 0 && jemla > 0 ? (price - jemla).toFixed(2) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.price) { setError('يرجى ملء الاسم والسعر'); return }

    setUploading(true)
    try {
      let image_url: string | null = null
      if (imageFile) {
        const ext = imageFile.name.split('.').pop() || 'jpg'
        const path = `products/${Date.now()}.${ext}`
        const { error: upErr } = await (supabaseAdmin as any).storage.from('image').upload(path, imageFile, { contentType: imageFile.type })
        if (upErr) throw upErr
        const { data } = (supabaseAdmin as any).storage.from('image').getPublicUrl(path)
        image_url = data.publicUrl
      }

      const { data: prod, error: dbErr } = await (supabaseAdmin as any).from('products').insert({
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        competitor_price: form.competitor_price ? parseFloat(form.competitor_price) : null,
        jemla_price: form.jemla_price ? parseFloat(form.jemla_price) : null,
        video_url: form.video_url || null,
        image_url,
        has_variants: form.has_variants,
        is_active: form.is_active,
      }).select().single()

      if (dbErr) throw dbErr

      // Insert variants if any
      if (form.has_variants && variants.length > 0) {
        const variantRows = variants.filter(v => v.label.trim()).map(v => ({
          product_id: prod.id,
          label: v.label,
          price: parseFloat(v.price) || parseFloat(form.price),
          jemla_price: v.jemla_price ? parseFloat(v.jemla_price) : null,
          competitor_price: v.competitor_price ? parseFloat(v.competitor_price) : null,
          is_active: true,
        }))
        if (variantRows.length > 0) {
          await (supabaseAdmin as any).from('product_variants').insert(variantRows)
        }
      }

      router.push('/admin/products')
    } catch (err: any) {
      setError(`حدث خطأ: ${err.message || 'يرجى المحاولة مجددًا'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>+ إضافة منتج جديد</h1>

      <form onSubmit={handleSubmit} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
        {/* Image Upload */}
        <div className="form-group">
          <label className="form-label">صورة المنتج</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {imagePreview && (
              <div style={{ width: 100, height: 100, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--color-primary)', flexShrink: 0 }}>
                <img src={imagePreview} alt="معاينة" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <label style={{ flex: 1, cursor: 'pointer' }}>
              <div className="upload-zone" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>📷</div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>اختر صورة للمنتج</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Video URL */}
        <div className="form-group">
          <label className="form-label" htmlFor="prod-video">🎬 رابط فيديو أو GIF (اختياري)</label>
          <input id="prod-video" className="form-input" type="url" placeholder="https://... (MP4, GIF, YouTube)" value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} dir="ltr" />
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>يُعرض في صفحة المنتج بجانب الصورة</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prod-name">اسم المنتج *</label>
          <input id="prod-name" className="form-input" type="text" placeholder="مثال: دفتر مدرسي 100 ورقة" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prod-desc">الوصف (اختياري)</label>
          <textarea id="prod-desc" className="form-textarea" placeholder="وصف المنتج..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
        </div>

        {/* Pricing — 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-jemla">💰 سعر الجملة (ثمن التكلفة)</label>
            <input id="prod-jemla" className="form-input" type="number" step="0.01" min="0" placeholder="2.50" value={form.jemla_price} onChange={e => setForm(f => ({ ...f, jemla_price: e.target.value }))} dir="ltr" style={{ borderColor: 'var(--green-400)' }} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-price">🏷️ سعر البيع (لدينا) *</label>
            <input id="prod-price" className="form-input" type="number" step="0.01" min="0" placeholder="7.00" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required dir="ltr" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-comp">🏪 سعر المنافسين</label>
            <input id="prod-comp" className="form-input" type="number" step="0.01" min="0" placeholder="15.00" value={form.competitor_price} onChange={e => setForm(f => ({ ...f, competitor_price: e.target.value }))} dir="ltr" />
          </div>
        </div>

        {/* Profit preview */}
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
            <input id="prod-variants" type="checkbox" checked={form.has_variants} onChange={e => setForm(f => ({ ...f, has_variants: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
            <label htmlFor="prod-variants" className="form-label" style={{ margin: 0, cursor: 'pointer', fontWeight: 700 }}>
              🎨 هذا المنتج له خيارات (ألوان، أحجام، عدد أوراق...)
            </label>
          </div>

          {form.has_variants && (
            <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', padding: '1rem', border: '1px solid var(--color-border)' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>الخيارات المتاحة:</p>
              {variants.map((v, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input className="form-input" placeholder="اسم الخيار (مثل: 96 ورقة)" value={v.label} onChange={e => updateVariant(idx, 'label', e.target.value)} style={{ fontSize: '0.85rem' }} />
                  <input className="form-input" placeholder="السعر" type="number" step="0.01" value={v.price} onChange={e => updateVariant(idx, 'price', e.target.value)} dir="ltr" style={{ fontSize: '0.85rem' }} />
                  <input className="form-input" placeholder="الجملة" type="number" step="0.01" value={v.jemla_price} onChange={e => updateVariant(idx, 'jemla_price', e.target.value)} dir="ltr" style={{ fontSize: '0.85rem' }} />
                  <input className="form-input" placeholder="المنافس" type="number" step="0.01" value={v.competitor_price} onChange={e => updateVariant(idx, 'competitor_price', e.target.value)} dir="ltr" style={{ fontSize: '0.85rem' }} />
                  <button type="button" onClick={() => removeVariant(idx)} style={{ background: '#fee2e2', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.625rem', cursor: 'pointer', fontSize: '0.875rem' }}>✕</button>
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={addVariant} style={{ marginTop: '0.5rem' }}>+ إضافة خيار</button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input id="prod-active" type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
          <label htmlFor="prod-active" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>نشر المنتج (مرئي للعملاء)</label>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={uploading} id="save-product-btn" style={{ flex: 1 }}>
            {uploading ? '⏳ جارٍ الحفظ...' : '💾 حفظ المنتج'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => router.back()}>إلغاء</button>
        </div>
      </form>
    </div>
  )
}
