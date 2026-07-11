import { useReducedMotion } from 'framer-motion'

/** Animated packet travelling along an SVG path. Hidden entirely when the
 *  user prefers reduced motion. */
export function FlowDot({ path, dur = 4, begin = '0s', color = 'var(--accent)', r = 4.5 }) {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <g opacity="0">
      <circle r={r} fill={color} />
      <circle r={r * 2.1} fill={color} opacity="0.22" />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.07;0.93;1"
        dur={`${dur}s`}
        begin={begin}
        repeatCount="indefinite"
      />
      <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" path={path} />
    </g>
  )
}

/** Rounded node box with a title, optional mono subtitle lines, and an
 *  optional technology logo badge in the top-right corner. */
export function NodeBox({
  x, y, w, h,
  title,
  sub = [],
  stroke = 'var(--border)',
  fill = 'var(--panel)',
  titleFill = 'var(--text)',
  titleSize = 14,
  subSize = 11,
  dashed = false,
  logo: Logo = null,
  logoSize = 16,
}) {
  const lines = Array.isArray(sub) ? sub : [sub]
  const cx = x + w / 2
  const contentH = titleSize + lines.length * (subSize + 4)
  const startY = y + h / 2 - contentH / 2 + titleSize - 2
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx="10"
        fill={fill} stroke={stroke} strokeWidth="1.4"
        strokeDasharray={dashed ? '6 5' : undefined}
      />
      {Logo && (
        <g transform={`translate(${x + w - logoSize - 7}, ${y + 6})`}>
          <Logo size={logoSize} />
        </g>
      )}
      <text x={cx} y={startY} textAnchor="middle" className="svg-label" fontSize={titleSize} fill={titleFill}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text
          key={i}
          x={cx}
          y={startY + (i + 1) * (subSize + 4) + 2}
          textAnchor="middle"
          className="svg-sub"
          fontSize={subSize}
        >
          {l}
        </text>
      ))}
    </g>
  )
}

/** Connection line (optionally dashed / animated dash). */
export function Wire({ d, stroke = 'var(--border)', width = 1.6, dashed = false, animated = false, marker }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeDasharray={dashed ? '6 6' : undefined}
      className={animated ? 'anim-dash' : undefined}
      markerEnd={marker}
    />
  )
}

/** Small mono label positioned on the diagram. */
export function WireLabel({ x, y, children, size = 10.5, fill = 'var(--faint)', anchor = 'middle' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="svg-faint" fontSize={size} fill={fill}>
      {children}
    </text>
  )
}

/** Shared defs: arrowheads + soft glow. Give each diagram a unique prefix. */
export function Defs({ prefix }) {
  return (
    <defs>
      <marker id={`${prefix}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="var(--faint)" />
      </marker>
      <marker id={`${prefix}-arrow-teal`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="var(--accent)" />
      </marker>
      <marker id={`${prefix}-arrow-purple`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="var(--purple)" />
      </marker>
      <filter id={`${prefix}-glow`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}
