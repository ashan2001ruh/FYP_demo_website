import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Defs, NodeBox, Wire, WireLabel } from './svgKit.jsx'

const Y = 168
const DUR = 6.4

/** Runtime decision path — a request packet branches to ALLOW (Redis) or DENY (403). */
export default function RuntimeFlowF3() {
  const reduced = useReducedMotion()
  const [cycle, setCycle] = useState(0)
  const allow = cycle % 2 === 0

  // keyframe positions along the pipeline, then branch
  const xs = [64, 196, 196, 368, 368, 560, 560, 664, allow ? 770 : 770]
  const ys = [Y, Y, Y, Y, Y, Y, Y, Y, allow ? 92 : 244]
  const times = [0, 0.14, 0.2, 0.42, 0.5, 0.68, 0.74, 0.85, 1]

  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 900 320" role="img" aria-label="Runtime authorization flow" style={{ minWidth: 640 }}>
        <Defs prefix="rt" />

        {/* pipeline wires */}
        <Wire d={`M124 ${Y} L900 ${Y}`} stroke="transparent" />
        <Wire d={`M124 ${Y} L616 ${Y}`} stroke="var(--border)" width={2} />
        <Wire d={`M616 ${Y} L664 ${Y}`} stroke="var(--border)" width={2} />
        {/* branch wires */}
        <Wire d={`M664 ${Y} C700 ${Y} 720 120 756 100`} stroke="var(--green)" width={1.6} marker="url(#rt-arrow)" />
        <Wire d={`M664 ${Y} C700 ${Y} 720 216 756 236`} stroke="var(--red)" width={1.6} marker="url(#rt-arrow)" />
        <WireLabel x={716} y={112} fill="var(--green)">ALLOW</WireLabel>
        <WireLabel x={716} y={232} fill="var(--red)">DENY</WireLabel>

        <NodeBox x={16} y={Y - 34} w={108} h={68} title="xApp" sub="SDL call" stroke="var(--green)" titleSize={13} />
        <NodeBox x={150} y={Y - 34} w={110} h={68} title="Envoy" sub="ext_authz" stroke="var(--purple)" titleSize={13} />
        <NodeBox x={296} y={Y - 52} w={150} h={104} title="Auth Agent v2" sub={['1 · VC claims + expiry', '2 · VP proof-of-DID', '3 · local pre-check']} stroke="var(--accent)" titleSize={13} subSize={10} />
        <NodeBox x={488} y={Y - 34} w={128} h={68} title="OPA" sub="Rego decision" stroke="var(--amber)" titleSize={13} />

        {/* decision diamond */}
        <g>
          <rect x={646} y={Y - 18} width={36} height={36} rx={7} transform={`rotate(45 664 ${Y})`} fill="var(--panel)" stroke="var(--amber)" strokeWidth="1.5" />
          <text x={664} y={Y + 4} textAnchor="middle" className="svg-sub" fontSize="10" fill="var(--amber)">?</text>
        </g>

        {/* outcomes */}
        <motion.g animate={allow && !reduced ? { opacity: [0.7, 0.7, 1] } : { opacity: 0.7 }} transition={{ duration: DUR, times: [0, 0.9, 1] }} key={`a${cycle}`}>
          <NodeBox x={756} y={56} w={128} h={64} title="Redis / SDL" sub="request proxied" stroke="var(--green)" titleSize={13} />
        </motion.g>
        <motion.g animate={!allow && !reduced ? { opacity: [0.7, 0.7, 1] } : { opacity: 0.7 }} transition={{ duration: DUR, times: [0, 0.9, 1] }} key={`d${cycle}`}>
          <NodeBox x={756} y={204} w={128} h={64} title="403 Forbidden" sub="connection dropped" stroke="var(--red)" titleSize={13} />
        </motion.g>

        {/* travelling packet */}
        {!reduced && (
          <motion.circle
            key={cycle}
            r="6"
            fill={allow ? 'var(--accent)' : 'var(--red)'}
            initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
            animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0.9] }}
            transition={{ duration: DUR, times, ease: 'easeInOut' }}
            onAnimationComplete={() => setCycle((c) => c + 1)}
            style={{ filter: 'url(#rt-glow)' }}
          />
        )}

        <WireLabel x={450} y={302} size={11}>
          {reduced
            ? 'Verified requests are proxied to Redis; failed VC/VP or policy checks are rejected with 403.'
            : allow
              ? 'cycle: VC valid · VP proven · OPA allow → proxied to Redis'
              : 'cycle: check failed → CheckResponse PERMISSION_DENIED · 403'}
        </WireLabel>
      </svg>
      <p className="diagram-caption">Every SDL request re-proves DID ownership before OPA is even consulted.</p>
    </div>
  )
}
