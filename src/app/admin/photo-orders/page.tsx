'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { PhotoOrder } from '@/lib/supabase'
import { updatePhotoOrderAction } from '@/app/admin/actions'

const STATUS_OPTIONS = ['pending_review', 'contacted', 'confirmed', 'completed', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  pending_review: 'بانتظار المراجعة',
  contacted: 'تم التواصل',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغي',
}

export default function AdminPhotoOrdersPage() {
  const [orders, setOrders] = useState<PhotoOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PhotoOrder | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('photo_orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function updateStatus(id: string, status: string) {
    try {
      await updatePhotoOrderAction(id, { status })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as any } : o))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as PhotoOrder['status'] } : null)
    } catch {
      alert('فشل تحديث الحالة')
    }
  }

  async function saveNotes(id: string, notes: string) {
    try {
      await updatePhotoOrderAction(id, { notes })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, notes } : o))
    } catch {
      alert('فشل تحديث الملاحظات')
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}> طلبات الصور</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}> جارٍ التحميل...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          {/* Table */}
          <div className="stat-card" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الهاتف</th>
                  <th>الصور</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>لا توجد طلبات صور</td></tr>
                ) : orders.map(order => (
                  <tr
                    key={order.id}
                    style={{ cursor: 'pointer', background: selected?.id === order.id ? 'var(--green-50)' : undefined }}
                    onClick={() => setSelected(order)}
                  >
                    <td style={{ fontWeight: 600 }}>{order.customer_name}</td>
                    <td dir="ltr" style={{ textAlign: 'right' }}>{order.phone}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{order.image_urls.length} </td>
                    <td>
                      <span className={`badge badge-status-${order.status === 'pending_review' ? 'pending' : order.status === 'completed' ? 'delivered' : 'confirmed'}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(order.created_at).toLocaleDateString('ar-MA')}</td>
                    <td>
                      <a
                        href={`https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحبا ${order.customer_name}، شكرًا لإرسالك قائمتك المدرسية! سنراجعها ونتواصل معك بالأسعار.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ background: '#25D366', color: 'white', padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 700 }}
                      >
                        
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="stat-card" style={{ position: 'sticky', top: '80px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selected.customer_name}</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }} dir="ltr">{selected.phone}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{selected.address}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'var(--green-100)', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.375rem 0.75rem', cursor: 'pointer', fontWeight: 700 }}></button>
              </div>

              {/* Status */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.375rem' }}>الحالة</label>
                <select
                  className="form-select"
                  value={selected.status}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.375rem' }}>ملاحظات داخلية</label>
                <textarea
                  className="form-textarea"
                  defaultValue={selected.notes || ''}
                  onBlur={e => saveNotes(selected.id, e.target.value)}
                  placeholder="أضف ملاحظة..."
                  rows={2}
                />
              </div>

              {/* Images */}
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem' }}> الصور ({selected.image_urls.length})</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {selected.image_urls.map((url, i) => (
                    <div
                      key={i}
                      style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '2px solid var(--color-border)' }}
                      onClick={() => setLightboxImg(url)}
                    >
                      <img src={url} alt={`صورة ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحبا ${selected.customer_name}، شكرًا لإرسالك قائمتك المدرسية! سنراجعها ونتواصل معك بالأسعار.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full"
                style={{ marginTop: '1.25rem', background: '#25D366', color: 'white', justifyContent: 'center' }}
              >
                 تواصل على واتساب
              </a>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="صورة القائمة" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }} onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightboxImg(null)} style={{ position: 'fixed', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: 44, height: 44, fontSize: '1.25rem', cursor: 'pointer' }}></button>
        </div>
      )}
    </div>
  )
}
