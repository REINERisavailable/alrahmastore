'use client'

import { useState, useEffect } from 'react'
import { COUNTDOWN_END } from '@/lib/utils'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const end = new Date(COUNTDOWN_END).getTime()
  const now = Date.now()
  const diff = Math.max(0, end - now)

  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) {
    return (
      <div className="countdown">
        {['يوم', 'ساعة', 'دقيقة', 'ثانية'].map(label => (
          <div key={label} className="countdown-unit skeleton" style={{ minWidth: 64, height: 80 }} />
        ))}
      </div>
    )
  }

  const units = [
    { value: time.days,    label: 'يوم'   },
    { value: time.hours,   label: 'ساعة'  },
    { value: time.minutes, label: 'دقيقة' },
    { value: time.seconds, label: 'ثانية' },
  ]

  return (
    <div className="countdown" role="timer" aria-label="عد تنازلي للعروض">
      {units.map(({ value, label }) => (
        <div key={label} className="countdown-unit">
          <span className="countdown-number">
            {String(value).padStart(2, '0')}
          </span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  )
}
