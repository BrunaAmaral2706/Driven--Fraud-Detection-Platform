import { useState, useEffect } from 'react'

export default function AnimatedCounter({ value = 0, duration = 700, formatter, className = '' }) {
  const [display, setDisplay] = useState(0)
  const target = Number(value) || 0

  useEffect(() => {
    let frame
    const start = performance.now()
    const from = 0

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (target - from) * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  const text = formatter ? formatter(display) : Math.round(display).toLocaleString('pt-BR')
  return <span className={className}>{text}</span>
}
