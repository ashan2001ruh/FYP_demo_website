import { useReducedMotion } from 'framer-motion'
import { Defs, NodeBox, Wire, WireLabel, FlowDot, Zone, fitWidth, fitHeight } from './svgKit.jsx'
import {
  RadioLogo, CoreLogo, DockerLogo, KubernetesLogo, RedisLogo, EnvoyLogo, PythonLogo, CalicoLogo,
} from '../TechLogos.jsx'

const box = (o) => ({
  ...o,
  titleSize: o.titleSize ?? 12.5,
  subSize: o.subSize ?? 9.5,
  w: o.w ?? fitWidth({ title: o.title, sub: o.sub, titleSize: o.titleSize ?? 12.5, subSize: o.subSize ?? 9.5, logo: !!o.logo }),
  h: o.h ?? fitHeight({ sub: o.sub, titleSize: o.titleSize ?? 12.5, subSize: o.subSize ?? 9.5, padding: 13 }),
})

/* ── Layer 2: RAN ── */
const UE = box({ x: 30, y: 74, title: 'srsUE', sub: ['simulated handset'], stroke: 'var(--amber)', logo: RadioLogo })
const DU = box({ x: 250, y: 74, title: 'srsDU', sub: ['Distributed Unit', 'E2 agent enabled'], stroke: 'var(--amber)', logo: RadioLogo })
const CU = box({ x: 470, y: 74, title: 'srsCU', sub: ['Central Unit', 'E2 agent enabled'], stroke: 'var(--amber)', logo: RadioLogo })

/* ── Layer 1: core ── */
const AMF = box({ x: 754, y: 96, title: 'AMF', sub: ['registration'], stroke: '#0B7261' })
const SMF = box({ x: 878, y: 96, title: 'SMF', sub: ['sessions'], stroke: '#0B7261' })
const UPF = box({ x: 754, y: 168, title: 'UPF', sub: ['user data'], stroke: '#0B7261' })
const UDM = box({ x: 878, y: 168, title: 'UDM', sub: ['subscribers'], stroke: '#0B7261' })

/* ── Layer 3: RIC platform ── */
const PLT = [
  box({ x: 60, y: 400, titleSize: 11.5, subSize: 9, title: 'E2 Termination', sub: ['RAN endpoint'], stroke: 'var(--purple)' }),
  box({ x: 220, y: 400, titleSize: 11.5, subSize: 9, title: 'E2 Manager', sub: ['node lifecycle'], stroke: 'var(--blue)' }),
  box({ x: 356, y: 400, titleSize: 11.5, subSize: 9, title: 'Subscription Mgr', sub: ['metric feeds'], stroke: 'var(--blue)' }),
  box({ x: 530, y: 400, titleSize: 11.5, subSize: 9, title: 'A1 Mediator', sub: ['policy intent'], stroke: 'var(--blue)' }),
  box({ x: 668, y: 400, titleSize: 11.5, subSize: 9, title: 'App Manager', sub: ['xApp lifecycle'], stroke: 'var(--blue)' }),
]
const REDIS = box({ x: 806, y: 400, titleSize: 11.5, subSize: 9, title: 'Redis · SDL', sub: ['the protected data'], stroke: 'var(--red)', logo: RedisLogo })

/* ── xApp pod ── */
const XAPP = box({ x: 84, y: 654, title: 'xApp', sub: ['reads E2 metrics', 'writes to the SDL'], stroke: 'var(--green)', logo: PythonLogo })
const ENVOY = box({ x: 262, y: 654, title: 'Envoy Sidecar', sub: ['intercepts every', 'SDL request'], stroke: 'var(--purple)', logo: EnvoyLogo })

export default function TestbedDiagram() {
  const reduced = useReducedMotion()
  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 1020 800" role="img" aria-label="Complete testbed: Open5GS core, srsRAN radio access, OSC Near-RT RIC and the security framework" style={{ minWidth: 800 }}>
        <Defs prefix="tb" />

        {/* layer captions */}
        <text x="30" y="34" className="svg-faint" fontSize="11.5">LAYER 2 · RADIO ACCESS srsRAN over ZeroMQ virtual radio, no RF hardware</text>
        <text x="754" y="34" className="svg-faint" fontSize="11.5">LAYER 1 · 5G CORE</text>

        {/* RAN chain */}
        <NodeBox {...UE} />
        <NodeBox {...DU} />
        <NodeBox {...CU} />
        <Wire d={`M${UE.x + UE.w} 108 L${DU.x} 108`} stroke="var(--amber)" width={1.8} marker="url(#tb-arrow)" />
        <WireLabel x={(UE.x + UE.w + DU.x) / 2} y={62}>virtual radio</WireLabel>
        <Wire d={`M${DU.x + DU.w} 108 L${CU.x} 108`} stroke="var(--amber)" width={1.8} marker="url(#tb-arrow)" />
        <WireLabel x={(DU.x + DU.w + CU.x) / 2} y={62}>F1 interface</WireLabel>
        <FlowDot path={`M${UE.x + UE.w} 108 L${DU.x} 108`} dur={2.2} color="var(--amber)" r={3.5} />
        <FlowDot path={`M${DU.x + DU.w} 108 L${CU.x} 108`} dur={2.2} begin="1.1s" color="var(--amber)" r={3.5} />

        {/* Open5GS core */}
        <Zone x={738} y={52} w={254} h={210} label="Open5GS core" color="rgba(11,114,97,0.5)" labelFill="#0B7261" fill="rgba(11,114,97,0.03)" Logo={DockerLogo} />
        <NodeBox {...AMF} /><NodeBox {...SMF} /><NodeBox {...UPF} /><NodeBox {...UDM} />
        <text x="865" y="248" textAnchor="middle" className="svg-sub" fontSize="9.5">registration · sessions · data routing</text>
        <Wire d={`M${CU.x + CU.w} 100 C 700 96 710 104 ${AMF.x} 118`} stroke="#0B7261" width={1.7} marker="url(#tb-arrow)" />
        <WireLabel x={704} y={88}>NGAP</WireLabel>
        <FlowDot path={`M${CU.x + CU.w} 100 C 700 96 710 104 ${AMF.x} 118`} dur={2.4} begin="2.2s" color="#0B7261" r={3.5} />

        {/* E2 down to the RIC */}
        <Wire d={`M${DU.x + 50} ${DU.y + DU.h} L${DU.x + 50} 318`} stroke="var(--purple)" width={1.8} marker="url(#tb-arrow-purple)" />
        <Wire d={`M${CU.x + 50} ${CU.y + CU.h} C ${CU.x + 50} 240 ${DU.x + 160} 250 ${DU.x + 160} 318`} stroke="var(--purple)" width={1.8} marker="url(#tb-arrow-purple)" />
        <WireLabel x={332} y={228} fill="var(--purple)">E2 interface live RAN metrics and control</WireLabel>
        <FlowDot path={`M${DU.x + 50} ${DU.y + DU.h} L${DU.x + 50} 318`} dur={2.6} color="var(--purple)" r={3.5} />
        <FlowDot path={`M${CU.x + 50} ${CU.y + CU.h} C ${CU.x + 50} 240 ${DU.x + 160} 250 ${DU.x + 160} 318`} dur={2.8} begin="1.3s" color="var(--purple)" r={3.5} />

        {/* RIC cluster */}
        <Zone x={26} y={318} w={966} h={460} label="LAYER 3 · O-RAN Software Community Near-RT RIC · Kubernetes" color="rgba(50,108,229,0.5)" labelFill="#326CE5" Logo={KubernetesLogo} />

        {/* ricplt */}
        <Zone x={44} y={356} w={930} h={186} label="ricplt namespace: platform services" color="rgba(148,163,184,0.75)" labelFill="var(--faint)" dash="0" />
        {PLT.map((p) => <NodeBox key={p.title} {...p} />)}
        <NodeBox {...REDIS} />

        {/* RMR bus */}
        <rect x="60" y="484" width="912" height="40" rx="9" fill="var(--panel-2)" stroke="var(--border)" />
        <text x="516" y="509" textAnchor="middle" className="svg-sub" fontSize="11">RIC Message Router the internal messaging bus every component speaks over</text>
        {PLT.map((p) => (
          <Wire key={`w${p.title}`} d={`M${p.x + p.w / 2} ${p.y + p.h} L${p.x + p.w / 2} 484`} stroke="var(--border)" width={1.2} />
        ))}

        {/* ricxapp */}
        <Zone x={44} y={566} w={490} h={192} label="ricxapp namespace" color="rgba(14,116,144,0.5)" labelFill="var(--accent)" fill="rgba(14,116,144,0.03)" dash="0" />
        <rect x="64" y="616" width="410" height="126" rx="11" fill="rgba(14,116,144,0.05)" stroke="rgba(14,116,144,0.45)" />
        <text x="80" y="637" className="svg-sub" fontSize="10.5" fill="var(--accent)">xApp Pod sidecars injected automatically</text>
        <NodeBox {...XAPP} />
        <NodeBox {...ENVOY} />
        <Wire d={`M${XAPP.x + XAPP.w} 688 L${ENVOY.x} 688`} stroke="var(--green)" width={1.7} marker="url(#tb-arrow-green)" />
        <FlowDot path={`M${XAPP.x + XAPP.w} 688 L${ENVOY.x} 688`} dur={2} color="var(--green)" r={3.5} />

        {/* metrics into the xApp */}
        <Wire d={`M${XAPP.x + 40} 524 L${XAPP.x + 40} ${XAPP.y}`} stroke="var(--blue)" width={1.5} marker="url(#tb-arrow)" />
        <WireLabel x={XAPP.x + 132} y={592} fill="var(--blue)">RAN metrics arrive</WireLabel>
        <FlowDot path={`M${XAPP.x + 40} 524 L${XAPP.x + 40} ${XAPP.y}`} dur={2.4} begin="0.6s" color="var(--blue)" r={3.5} />

        {/* Layer 4 shield */}
        <Zone x={566} y={592} w={406} h={162} label="LAYER 4 · the Zero Trust security framework" color="var(--green)" labelFill="var(--green)" fill="rgba(22,163,74,0.05)" />
        <g className={reduced ? undefined : 'anim-pulse'}>
          <path d="M632 634 l19 7.6v12.4c0 10.6-7.8 20.4-19 23.6-11.2-3.2-19-13-19-23.6v-12.4l19-7.6z" fill="var(--green)" opacity="0.12" />
          <path d="M632 638 l16 6.4v10.6c0 9-6.6 17.3-16 20.1-9.4-2.8-16-11.1-16-20.1v-10.6l16-6.4z" fill="none" stroke="var(--green)" strokeWidth="1.8" />
          <path d="M624.5 655.5l5 5 9.5-10" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="678" y="648" className="svg-label" fontSize="12.5" fill="var(--green)">Every SDL request is</text>
        <text x="678" y="666" className="svg-label" fontSize="12.5" fill="var(--green)">authenticated and authorised</text>
        <text x="678" y="688" className="svg-sub" fontSize="9.5">Frameworks 1, 2 and 3 swap in here</text>
        <text x="678" y="702" className="svg-sub" fontSize="9.5">everything below is identical</text>
        <g transform="translate(678, 714)"><CalicoLogo size={14} /></g>
        <text x="700" y="726" className="svg-sub" fontSize="9.5">Calico closes the network shortcuts</text>

        {/* xApp -> shield -> Redis */}
        <Wire d={`M${ENVOY.x + ENVOY.w} 688 L566 688`} stroke="var(--accent)" width={1.8} marker="url(#tb-arrow-teal)" />
        <Wire d={`M950 ${592} C 966 560 962 470 ${REDIS.x + REDIS.w / 2} ${REDIS.y + REDIS.h}`} stroke="var(--accent)" width={1.8} marker="url(#tb-arrow-teal)" />
        <WireLabel x={905} y={566}>only if allowed</WireLabel>
        <FlowDot path={`M950 ${592} C 966 560 962 470 ${REDIS.x + REDIS.w / 2} ${REDIS.y + REDIS.h}`} dur={2.8} begin="2.4s" color="var(--green)" r={3.5} />
      </svg>
      <p className="diagram-caption">
        One 5G network, one RIC, three interchangeable security frameworks at Layer 4, so any difference measured
        between them comes from the framework itself, not from the environment.
      </p>
    </div>
  )
}
