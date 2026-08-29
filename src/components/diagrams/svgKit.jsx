import { useReducedMotion } from 'framer-motion'

/* ------------------------------------------------------------------ *
 * Text metrics
 * SVG text cannot be measured at build time, so every box in every
 * diagram is sized from a conservative per-character width estimate.
 * These factors are deliberately generous — over-wide boxes are fine,
 * clipped labels are not.
 * ------------------------------------------------------------------ */
const SANS_FACTOR = 0.63 // Inter 600
const MONO_FACTOR = 0.62 // JetBrains Mono 400

export function sansWidth(text, size) {
  return String(text).length * size * SANS_FACTOR
}
export function monoWidth(text, size) {
  return String(text).length * size * MONO_FACTOR
}

/** Minimum box width that fits a title plus every subtitle line. */
export function fitWidth({ title = '', sub = [], titleSize = 14, subSize = 11, padding = 22, logo = false }) {
  const lines = Array.isArray(sub) ? sub : [sub]
  const widest = Math.max(
    sansWidth(title, titleSize) + (logo ? titleSize + 10 : 0),
    ...lines.map((l) => monoWidth(l, subSize)),
    0,
  )
  return Math.ceil(widest + padding * 2)
}

/** Minimum box height for a title plus n subtitle lines. */
export function fitHeight({ sub = [], titleSize = 14, subSize = 11, padding = 15 }) {
  const lines = Array.isArray(sub) ? sub : [sub]
  return Math.ceil(titleSize + lines.length * (subSize + 4) + padding * 2)
}

/** Animated packet travelling along an SVG path. Hidden under reduced motion. */
export function FlowDot({ path, dur = 4, begin = '0s', color = 'var(--accent)', r = 4.5 }) {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <g opacity="0">
      <circle r={r} fill={color} />
      <circle r={r * 2.1} fill={color} opacity="0.2" />
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

/**
 * Rounded node box. If `w`/`h` are omitted they are computed from the text,
 * guaranteeing nothing is clipped. A logo badge sits in the top-right corner.
 */
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
  align = 'center',
}) {
  const lines = (Array.isArray(sub) ? sub : [sub]).filter(Boolean)
  const boxW = w ?? fitWidth({ title, sub: lines, titleSize, subSize, logo: !!Logo })
  const boxH = h ?? fitHeight({ sub: lines, titleSize, subSize })
  const cx = align === 'start' ? x + 14 : x + boxW / 2
  const anchor = align === 'start' ? 'start' : 'middle'
  const contentH = titleSize + lines.length * (subSize + 4)
  const startY = y + boxH / 2 - contentH / 2 + titleSize - 2

  return (
    <g>
      <rect
        x={x} y={y} width={boxW} height={boxH} rx="10"
        fill={fill} stroke={stroke} strokeWidth="1.4"
        strokeDasharray={dashed ? '6 5' : undefined}
      />
      {Logo && (
        <g transform={`translate(${x + boxW - logoSize - 7}, ${y + 6})`}>
          <Logo size={logoSize} />
        </g>
      )}
      <text x={cx} y={startY} textAnchor={anchor} className="svg-label" fontSize={titleSize} fill={titleFill}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text
          key={i}
          x={cx}
          y={startY + (i + 1) * (subSize + 4) + 2}
          textAnchor={anchor}
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

/**
 * Label for a wire. Draws an opaque plate behind the text so it stays legible
 * where it crosses a line, and so its extent is explicit rather than guessed.
 */
export function WireLabel({
  x, y, children, size = 10.5, fill = 'var(--faint)', anchor = 'middle', plate = true,
}) {
  const text = String(children)
  const w = monoWidth(text, size) + 8
  const px = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x - 4
  return (
    <g>
      {plate && (
        <rect x={px} y={y - size + 1} width={w} height={size + 6} rx="3" fill="var(--panel)" opacity="0.94" />
      )}
      <text x={x} y={y} textAnchor={anchor} className="svg-faint" fontSize={size} fill={fill}>
        {text}
      </text>
    </g>
  )
}

/** Numbered step marker used to sequence a flow inside a diagram. */
export function StepDot({ x, y, n, color = 'var(--accent)', r = 9 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="var(--panel)" stroke={color} strokeWidth="1.4" />
      <text
        x={x} y={y + 3.4} textAnchor="middle"
        fontSize={r * 1.05} fontFamily="var(--font-mono)" fontWeight="600" fill={color}
      >
        {n}
      </text>
    </g>
  )
}

/** Dashed region used for namespaces / hosts / trust boundaries. */
export function Zone({ x, y, w, h, label, color = 'var(--border)', fill = 'none', labelFill, dash = '8 6', Logo = null }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="13" fill={fill} stroke={color} strokeDasharray={dash} strokeWidth="1.4" />
      {Logo && <g transform={`translate(${x + 14}, ${y + 9})`}><Logo size={15} /></g>}
      <text
        x={x + (Logo ? 36 : 15)} y={y + 21}
        className="svg-sub" fontSize="11.5" fill={labelFill || color}
      >
        {label}
      </text>
    </g>
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
      <marker id={`${prefix}-arrow-red`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="var(--red)" />
      </marker>
      <marker id={`${prefix}-arrow-green`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="var(--green)" />
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
