import { motion } from 'framer-motion'

/**
 * Horizontal bar chart. Values are rendered as labelled rows so no text is ever
 * clipped, and the bar grows on scroll-in.
 * rows: [{ label, value, display, color, note }]
 */
export default function BarChart({ rows, unit = '', max, caption, footnote }) {
  const peak = max ?? Math.max(...rows.map((r) => r.value))
  return (
    <figure className="chart">
      {caption && <figcaption className="chart-title">{caption}</figcaption>}
      <div className="chart-rows">
        {rows.map((r, i) => (
          <div className="chart-row" key={r.label}>
            <div className="chart-label">{r.label}</div>
            <div className="chart-track">
              <motion.div
                className="chart-bar"
                style={{ background: r.color || 'var(--accent)' }}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max((r.value / peak) * 100, 0.8)}%` }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 90, damping: 20, delay: i * 0.12 }}
              />
              <span className="chart-value">{r.display ?? `${r.value}${unit}`}</span>
            </div>
            {r.note && <div className="chart-note">{r.note}</div>}
          </div>
        ))}
      </div>
      {footnote && <p className="chart-foot">{footnote}</p>}
    </figure>
  )
}
