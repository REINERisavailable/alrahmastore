'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('كلمة المرور خاطئة')
      }
    } catch {
      setError('حدث خطأ. يرجى المحاولة مجددًا.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--green-50)', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: 400, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}></div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>لوحة الإدارة</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>متجر الرحمة — دخول المشرف</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">كلمة المرور</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} id="admin-login-btn">
            {loading ? ' جارٍ التحقق...' : 'دخول →'}
          </button>
        </form>
      </div>
    </div>
  )
}
