import { Defs, NodeBox, Wire, WireLabel, FlowDot, Zone, fitWidth, fitHeight } from './svgKit.jsx'
import {
  CalderaLogo, PythonLogo, EnvoyLogo, RedisLogo, CalicoLogo, KubernetesLogo,
} from '../TechLogos.jsx'

const box = (o) => ({
  ...o,
  w: o.w ?? fitWidth({ title: o.title, sub: o.sub, titleSize: o.titleSize ?? 13, subSize: o.subSize ?? 10, logo: !!o.logo }),
  h: o.h ?? fitHeight({ sub: o.sub, titleSize: o.titleSize ?? 13, subSize: o.subSize ?? 10, padding: 13 }),
})

const XAPP = box({ x: 66, y: 132, title: 'xApp Container', sub: ['the legitimate workload'], stroke: 'var(--green)', logo: PythonLogo })
const ENVOY = box({ x: 66, y: 218, title: 'Envoy Sidecar', sub: ['the enforcement point'], stroke: 'var(--purple)', logo: EnvoyLogo })
const AGENT = box({ x: 66, y: 304, title: 'CALDERA Agent', sub: ['the simulated attacker'], stroke: 'var(--red)', logo: CalderaLogo })
const C2 = box({ x: 62, y: 452, title: 'CALDERA C2 Server', sub: ['adversary profiles', 'MITRE ATT&CK techniques'], stroke: 'var(--red)', logo: CalderaLogo })
const REDIS = box({ x: 660, y: 292, title: 'Redis · SDL', sub: ['the target data'], stroke: 'var(--red)', logo: RedisLogo })

const BLOCKED = [
  { y: 168, label: 'read the sidecar’s keys', note: 'OS permission denied' },
  { y: 226, label: 'other namespace via the PEP', note: 'denied by OPA policy' },
  { y: 350, label: 'raw TCP straight to Redis', note: 'dropped by Calico' },
  { y: 408, label: 'discover neighbour processes', note: 'hidden by PID namespace' },
]

function Blocked({ y }) {
  return (
    <g>
      <circle cx="576" cy={y} r="13" fill="var(--panel)" stroke="var(--red)" strokeWidth="2" />
      <path d={`M568 ${y - 8} L584 ${y + 8} M584 ${y - 8} L568 ${y + 8}`} stroke="var(--red)" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  )
}

export default function AttackSimDiagram() {
  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 980 570" role="img" aria-label="CALDERA adversary agent deployed as a sidecar inside the xApp pod" style={{ minWidth: 720 }}>
        <Defs prefix="atk" />

        <Zone x={20} y={40} w={940} h={510} label="RIC Cluster · Kubernetes" color="rgba(50,108,229,0.45)" labelFill="#326CE5" Logo={KubernetesLogo} />

        <Zone
          x={40} y={92} w={330} h={306}
          label="xApp Pod — attacker runs inside"
          color="rgba(220,38,38,0.55)" labelFill="var(--red)" fill="rgba(220,38,38,0.04)" dash="0"
        />
        <NodeBox {...XAPP} />
        <NodeBox {...ENVOY} />
        <NodeBox {...AGENT} />
        <NodeBox {...C2} />
        <NodeBox {...REDIS} />

        {/* C2 link */}
        <Wire d={`M${AGENT.x + 60} ${AGENT.y + AGENT.h} L${AGENT.x + 60} ${C2.y}`} stroke="var(--red)" width={1.6} dashed marker="url(#atk-arrow-red)" />
        <WireLabel x={AGENT.x + 190} y={430} fill="var(--red)">registers on every pod restart</WireLabel>
        <FlowDot path={`M${AGENT.x + 60} ${AGENT.y + AGENT.h} L${AGENT.x + 60} ${C2.y}`} dur={2.4} color="var(--red)" r={3.5} />

        {/* attempted attacks, all blocked */}
        {BLOCKED.map((b, i) => (
          <g key={b.label}>
            <Wire
              d={`M${AGENT.x + AGENT.w} ${AGENT.y + 22} C 460 ${AGENT.y + 22} 480 ${b.y} 562 ${b.y}`}
              stroke="var(--red)" width={1.4} dashed
            />
            <Blocked y={b.y} />
            <text x="600" y={b.y - 2} className="svg-label" fontSize="12" fill="var(--text)">{b.label}</text>
            <text x="600" y={b.y + 14} className="svg-sub" fontSize="10" fill="var(--faint)">{b.note}</text>
          </g>
        ))}

        {/* the only permitted path */}
        <Wire d={`M${ENVOY.x + ENVOY.w} 244 C 420 244 500 300 ${REDIS.x} 316`} stroke="var(--green)" width={2} marker="url(#atk-arrow-green)" />
        <WireLabel x={470} y={280} fill="var(--green)">the one authorized path</WireLabel>
        <FlowDot path={`M${ENVOY.x + ENVOY.w} 244 C 420 244 500 300 ${REDIS.x} 316`} dur={3} color="var(--green)" r={4} />

        <g transform="translate(636, 470)"><CalicoLogo size={16} /></g>
        <WireLabel x={772} y={482} fill="var(--red)">network policy closes the transport-layer shortcut</WireLabel>
      </svg>
      <p className="diagram-caption">
        The adversary emulation agent is injected as a third container in the xApp pod, so it starts with exactly the
        access a genuinely compromised xApp would have — inside the trust boundary, not outside it.
      </p>
    </div>
  )
}
