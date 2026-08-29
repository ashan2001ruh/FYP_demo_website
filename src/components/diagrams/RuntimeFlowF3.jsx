import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Defs, NodeBox, Wire, WireLabel, fitWidth, fitHeight } from './svgKit.jsx'
import { EnvoyLogo, PythonLogo, DidLogo, OpaLogo, RedisLogo } from '../TechLogos.jsx'

const box = (o) => ({
  ...o,
  w: o.w ?? fitWidth({ title: o.title, sub: o.sub, titleSize: 12.5, subSize: 9.5, logo: !!o.logo }),
  h: o.h ?? fitHeight({ sub: o.sub, titleSize: 12.5, subSize: 9.5, padding: 12 }),
  titleSize: 12.5,
  subSize: 9.5,
})

const Y = 150
const DUR = 7.2

const NODES = [
  box({ x: 16, title: 'xApp', sub: ['data request'], stroke: 'var(--green)', logo: PythonLogo }),
  box({ x: 150, title: 'Envoy', sub: ['parses command'], stroke: 'var(--purple)', logo: EnvoyLogo }),
  box({ x: 330, title: 'Auth Agent', sub: ['signs a proof'], stroke: 'var(--accent)', logo: PythonLogo }),
  box({ x: 512, title: 'VP Verifier', sub: ['checks the proof'], stroke: 'var(--green)', logo: DidLogo }),
  box({ x: 700, title: 'Policy Engine', sub: ['checks the rules'], stroke: 'var(--amber)', logo: OpaLogo }),
]
NODES.forEach((n) => { n.y = Y - n.h / 2 })

const LAST = NODES[NODES.length - 1]
const DECISION_X = LAST.x + LAST.w + 54

export default function RuntimeFlowF3() {
  const reduced = useReducedMotion()
  const [cycle, setCycle] = useState(0)
  const allow = cycle % 2 === 0

  const xs = [NODES[0].x + NODES[0].w, NODES[1].x, NODES[1].x + NODES[1].w, NODES[2].x,
    NODES[2].x + NODES[2].w, NODES[3].x, NODES[3].x + NODES[3].w, NODES[4].x,
    NODES[4].x + NODES[4].w, DECISION_X, 960]
  const ys = [Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, allow ? 62 : 244]
  const times = [0, 0.1, 0.16, 0.3, 0.38, 0.52, 0.6, 0.74, 0.82, 0.9, 1]

  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 1020 300" role="img" aria-label="Runtime authorization flow for the DID and VC framework" style={{ minWidth: 780 }}>
        <Defs prefix="rt" />

        {/* pipeline */}
        {NODES.slice(0, -1).map((n, i) => (
          <Wire key={i} d={`M${n.x + n.w} ${Y} L${NODES[i + 1].x} ${Y}`} stroke="var(--border)" width={2} marker="url(#rt-arrow-teal)" />
        ))}
        <Wire d={`M${LAST.x + LAST.w} ${Y} L${DECISION_X - 20} ${Y}`} stroke="var(--border)" width={2} />

        {/* branches */}
        <Wire d={`M${DECISION_X + 18} ${Y} C ${DECISION_X + 60} ${Y} ${DECISION_X + 60} 96 ${DECISION_X + 100} 90`} stroke="var(--green)" width={1.8} marker="url(#rt-arrow-green)" />
        <Wire d={`M${DECISION_X + 18} ${Y} C ${DECISION_X + 60} ${Y} ${DECISION_X + 60} 208 ${DECISION_X + 100} 214`} stroke="var(--red)" width={1.8} marker="url(#rt-arrow-red)" />

        {NODES.map((n) => <NodeBox key={n.title} {...n} />)}

        {/* decision diamond */}
        <g>
          <rect x={DECISION_X - 15} y={Y - 15} width="30" height="30" rx="6" transform={`rotate(45 ${DECISION_X} ${Y})`} fill="var(--panel)" stroke="var(--amber)" strokeWidth="1.6" />
          <text x={DECISION_X} y={Y + 4} textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill="var(--amber)">?</text>
        </g>

        {/* outcomes */}
        <NodeBox
          x={DECISION_X + 100} y={58} w={168} h={62}
          title="Redis · SDL" sub={['request goes through']}
          stroke="var(--green)" logo={RedisLogo} titleSize={12.5} subSize={9.5}
        />
        <NodeBox
          x={DECISION_X + 100} y={184} w={168} h={62}
          title="403 Forbidden" sub={['connection dropped']}
          stroke="var(--red)" titleSize={12.5} subSize={9.5}
        />

        {/* stage captions */}
        <WireLabel x={(NODES[1].x + NODES[2].x) / 2 + 20} y={Y - 30} plate={false}>which command?</WireLabel>
        <WireLabel x={(NODES[2].x + NODES[3].x) / 2 + 20} y={Y - 30} plate={false}>prove you hold the key</WireLabel>
        <WireLabel x={(NODES[3].x + NODES[4].x) / 2 + 20} y={Y - 30} plate={false}>verified claims only</WireLabel>

        {/* travelling packet */}
        {!reduced && (
          <motion.circle
            key={cycle}
            r="6.5"
            fill={allow ? 'var(--accent)' : 'var(--red)'}
            initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
            animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9] }}
            transition={{ duration: DUR, times, ease: 'easeInOut' }}
            onAnimationComplete={() => setCycle((c) => c + 1)}
          />
        )}

        <WireLabel x={510} y={288} size={11} plate={false}>
          {reduced
            ? 'A request is allowed only if the proof is fresh, the credential is genuine and the policy permits it.'
            : allow
              ? 'this pass: proof fresh · credential genuine · policy permits → data returned'
              : 'this pass: a check failed → request refused, nothing reaches the database'}
        </WireLabel>
      </svg>
      <p className="diagram-caption">
        Four independent things must hold before data moves: the command is understood, the key is proven, the
        credential is genuine, and the policy agrees.
      </p>
    </div>
  )
}
