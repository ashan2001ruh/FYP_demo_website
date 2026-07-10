import { useReducedMotion } from 'framer-motion'
import { Defs, NodeBox, Wire, WireLabel } from './svgKit.jsx'

const NODES = [
  { cx: 180, cy: 110, label: 'Node 1' },
  { cx: 420, cy: 110, label: 'Node 2' },
  { cx: 180, cy: 270, label: 'Node 3' },
  { cx: 420, cy: 270, label: 'Node 4' },
]

/** 4-node Indy validator pool + webserver, pulsing consensus links. */
export default function VonNetworkDiagram() {
  const reduced = useReducedMotion()
  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 720 380" role="img" aria-label="Von Network Indy ledger" style={{ minWidth: 480 }}>
        <Defs prefix="von" />

        <rect x="20" y="16" width="560" height="348" rx="14" fill="rgba(247,120,186,0.02)" stroke="var(--border)" strokeDasharray="8 6" />
        <text x="40" y="44" className="svg-faint" fontSize="12">Ubuntu host · Docker Compose (outside the K8s cluster)</text>

        {/* consensus mesh */}
        {NODES.map((a, i) =>
          NODES.slice(i + 1).map((b, j) => (
            <line
              key={`${i}-${j}`}
              x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
              stroke="var(--pink)" strokeWidth="1"
              opacity="0.35"
              className={reduced ? undefined : 'anim-dash'}
              strokeDasharray="4 6"
            />
          )),
        )}

        {/* validator nodes */}
        {NODES.map((n, i) => (
          <g key={n.label}>
            {!reduced && (
              <circle cx={n.cx} cy={n.cy} r="34" fill="var(--pink)" opacity="0.12">
                <animate attributeName="r" values="30;40;30" dur="2.8s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.16;0.05;0.16" dur="2.8s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={n.cx} cy={n.cy} r="26" fill="var(--panel)" stroke="var(--pink)" strokeWidth="1.6" />
            <text x={n.cx} y={n.cy - 2} textAnchor="middle" className="svg-label" fontSize="11">{n.label}</text>
            <text x={n.cx} y={n.cy + 12} textAnchor="middle" className="svg-sub" fontSize="9">indy</text>
          </g>
        ))}

        <WireLabel x={300} y={196} size={11} fill="var(--pink)">Plenum consensus · :9701–9708</WireLabel>

        {/* webserver */}
        <NodeBox x={600} y={120} w={104} h={140} title="Ledger UI" sub={[':9000', '/genesis', '/register']} stroke="var(--pink)" titleSize={13} subSize={10.5} />
        <Wire d="M446 130 C540 130 560 150 600 160" stroke="var(--pink)" width={1.3} dashed />
        <Wire d="M446 250 C540 250 560 230 600 220" stroke="var(--pink)" width={1.3} dashed />
      </svg>
      <p className="diagram-caption">bcgov/von-network — 4 Indy validator nodes + web UI, run with ./manage start on the host.</p>
    </div>
  )
}
