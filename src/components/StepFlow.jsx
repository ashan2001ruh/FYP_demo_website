import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Numbered lifecycle steps that illuminate one-by-one once scrolled into view.
 * steps: [{ title, body }]
 */
export default function StepFlow({ steps, interval = 420 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  const [lit, setLit] = useState(reduced ? steps.length : 0)

  useEffect(() => {
    if (!inView || reduced) return
    if (lit >= steps.length) return
    const t = setTimeout(() => setLit((n) => n + 1), lit === 0 ? 200 : interval)
    return () => clearTimeout(t)
  }, [inView, lit, steps.length, interval, reduced])

  return (
    <div className="flow-steps" ref={ref}>
      {steps.map((s, i) => (
        <div key={i} className={`flow-step${i < lit ? ' lit' : ''}`}>
          <div className="flow-step-num">{i + 1}</div>
          <div>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
