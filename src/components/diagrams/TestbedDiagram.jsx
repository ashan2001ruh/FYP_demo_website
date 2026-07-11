import { useReducedMotion } from 'framer-motion'
import { Defs, NodeBox, Wire, WireLabel, FlowDot } from './svgKit.jsx'
import {
  RadioLogo, CoreLogo, DockerLogo, KubernetesLogo, RedisLogo, EnvoyLogo, PythonLogo,
} from '../TechLogos.jsx'

/** The complete virtualised 5G + O-RAN testbed shared by all three frameworks. */
export default function TestbedDiagram() {
  const reduced = useReducedMotion()
  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 980 810" role="img" aria-label="Complete testbed: Open5GS core, srsRAN, OSC Near-RT RIC and the security framework" style={{ minWidth: 760 }}>
        <Defs prefix="tb" />

        {/* ── layer captions ── */}
        <text x="20" y="30" className="svg-faint" fontSize="11.5">LAYER 2 · RADIO ACCESS NETWORK — srsRAN (ZeroMQ virtual radio, no RF hardware)</text>
        <text x="742" y="30" className="svg-faint" fontSize="11.5">LAYER 1 · 5G CORE</text>

        {/* ── RAN chain ── */}
        <NodeBox x={20} y={64} w={150} h={78} title="srsUE" sub={['simulated UE', 'registers + PDU session']} stroke="var(--amber)" logo={RadioLogo} titleSize={14} subSize={10} />
        <NodeBox x={256} y={64} w={168} h={78} title="srsDU" sub={['Distributed Unit', 'E2 agent enabled']} stroke="var(--amber)" logo={RadioLogo} titleSize={14} subSize={10} />
        <NodeBox x={510} y={64} w={168} h={78} title="srsCU" sub={['Central Unit', 'E2 agent enabled']} stroke="var(--amber)" logo={RadioLogo} titleSize={14} subSize={10} />

        {/* UE → DU → CU */}
        <Wire d="M170 103 L256 103" stroke="var(--amber)" width={1.8} marker="url(#tb-arrow)" />
        <WireLabel x={213} y={94}>ZeroMQ virtual RF</WireLabel>
        <Wire d="M424 103 L510 103" stroke="var(--amber)" width={1.8} marker="url(#tb-arrow)" />
        <WireLabel x={467} y={94}>F1 interface</WireLabel>
        <FlowDot path="M170 103 L256 103" dur={2.2} color="var(--amber)" r={3.5} />
        <FlowDot path="M424 103 L510 103" dur={2.2} begin="1.1s" color="var(--amber)" r={3.5} />

        {/* ── Open5GS core ── */}
        <rect x="742" y="44" width="218" height="216" rx="12" fill="rgba(11,114,97,0.04)" stroke="rgba(11,114,97,0.45)" />
        <g transform="translate(756, 56)"><CoreLogo size={16} /></g>
        <g transform="translate(778, 56)"><DockerLogo size={16} /></g>
        <text x="802" y="69" className="svg-sub" fontSize="11" fill="#0B7261">Open5GS · Docker</text>

        <NodeBox x={758} y={86} w={88} h={56} title="AMF" sub="access & mobility" stroke="#0B7261" titleSize={12.5} subSize={8.5} />
        <NodeBox x={858} y={86} w={88} h={56} title="SMF" sub="session mgmt" stroke="#0B7261" titleSize={12.5} subSize={8.5} />
        <NodeBox x={758} y={158} w={88} h={56} title="UPF" sub="user plane" stroke="#0B7261" titleSize={12.5} subSize={8.5} />
        <NodeBox x={858} y={158} w={88} h={56} title="UDM" sub="subscriber data" stroke="#0B7261" titleSize={12.5} subSize={8.5} />
        <text x="851" y="242" textAnchor="middle" className="svg-sub" fontSize="10">registration · sessions · routing</text>

        {/* CU → core */}
        <Wire d="M678 96 C716 92 720 100 758 108" stroke="#0B7261" width={1.8} marker="url(#tb-arrow)" />
        <WireLabel x={716} y={86}>NGAP (N2)</WireLabel>
        <Wire d="M678 120 C716 130 726 160 758 176" stroke="#0B7261" width={1.4} dashed />
        <WireLabel x={710} y={158}>user plane (N3)</WireLabel>
        <FlowDot path="M678 96 C716 92 720 100 758 108" dur={2.4} begin="2.2s" color="#0B7261" r={3.5} />

        {/* ── E2 interface down to the RIC ── */}
        <Wire d="M340 142 L340 300" stroke="var(--purple)" width={1.8} marker="url(#tb-arrow-purple)" />
        <Wire d="M594 142 C594 220 480 240 420 296" stroke="var(--purple)" width={1.8} marker="url(#tb-arrow-purple)" />
        <WireLabel x={310} y={230} fill="var(--purple)">E2 interface</WireLabel>
        <WireLabel x={560} y={220} fill="var(--purple)">E2 metrics / control</WireLabel>
        <FlowDot path="M340 142 L340 300" dur={2.6} color="var(--purple)" r={3.5} />
        <FlowDot path="M594 142 C594 220 480 240 420 296" dur={2.8} begin="1.3s" color="var(--purple)" r={3.5} />

        {/* ── Near-RT RIC cluster ── */}
        <rect x="20" y="300" width="940" height="486" rx="16" fill="rgba(50,108,229,0.025)" stroke="rgba(50,108,229,0.4)" strokeDasharray="10 7" strokeWidth="1.5" />
        <g transform="translate(36, 314)"><KubernetesLogo size={18} /></g>
        <text x="62" y="329" className="svg-sub" fontSize="12" fill="#326CE5">LAYER 3 · OSC Near-RT RIC · Kubernetes</text>

        {/* ricplt platform */}
        <rect x="40" y="346" width="900" height="196" rx="12" fill="none" stroke="var(--border)" />
        <text x="56" y="368" className="svg-faint" fontSize="11">ricplt namespace — platform components</text>

        <NodeBox x={60} y={382} w={130} h={62} title="E2 Termination" sub="SCTP endpoint" stroke="var(--purple)" titleSize={12} subSize={9.5} />
        <NodeBox x={206} y={382} w={122} h={62} title="E2 Manager" sub="node lifecycle" stroke="var(--blue)" titleSize={12} subSize={9.5} />
        <NodeBox x={344} y={382} w={132} h={62} title="Subscription Mgr" sub="E2 subscriptions" stroke="var(--blue)" titleSize={12} subSize={9.5} />
        <NodeBox x={492} y={382} w={118} h={62} title="A1 Mediator" sub="policy intent" stroke="var(--blue)" titleSize={12} subSize={9.5} />
        <NodeBox x={626} y={382} w={118} h={62} title="App Manager" sub="xApp deploy" stroke="var(--blue)" titleSize={12} subSize={9.5} />
        <NodeBox x={760} y={382} w={160} h={62} title="Redis DBaaS" sub={['Shared Data Layer', 'the protected asset']} stroke="var(--red)" logo={RedisLogo} titleSize={12} subSize={9.5} />

        {/* RMR bus */}
        <rect x="60" y="472" width="860" height="46" rx="9" fill="var(--panel-2)" stroke="var(--border)" />
        <text x="490" y="499" textAnchor="middle" className="svg-sub" fontSize="11.5">RMR — RIC Message Router (inter-component messaging bus)</text>
        {['E2', 'Mgr', 'Sub', 'A1', 'App'].map((_, i) => (
          <Wire key={i} d={`M${125 + i * 140} 444 L${125 + i * 140} 472`} stroke="var(--border)" width={1.3} />
        ))}

        {/* ricxapp */}
        <rect x="40" y="556" width="900" height="206" rx="12" fill="none" stroke="var(--border)" />
        <text x="56" y="578" className="svg-faint" fontSize="11">ricxapp namespace — xApps</text>

        {/* xApp pod */}
        <rect x="60" y="592" width="424" height="150" rx="12" fill="rgba(14,116,144,0.035)" stroke="rgba(14,116,144,0.45)" />
        <text x="76" y="613" className="svg-sub" fontSize="11" fill="var(--accent)">xApp Pod · 3 containers (sidecars auto-injected)</text>

        <NodeBox x={78} y={626} w={118} h={72} title="xApp" sub={['E2 metrics →', 'SDL writes']} stroke="var(--green)" logo={PythonLogo} titleSize={12.5} subSize={9.5} />
        <NodeBox x={214} y={626} w={118} h={72} title="Envoy" sub={['PEP proxy', 'intercepts SDL']} stroke="var(--purple)" logo={EnvoyLogo} titleSize={12.5} subSize={9.5} />
        <NodeBox x={350} y={626} w={118} h={72} title="Auth Agent" sub={['gRPC :50051', 'authorises']} stroke="var(--accent)" logo={PythonLogo} titleSize={12.5} subSize={9.5} />

        {/* RMR → xApp */}
        <Wire d="M272 518 L272 592" stroke="var(--blue)" width={1.5} marker="url(#tb-arrow)" />
        <WireLabel x={236} y={556} fill="var(--blue)">E2 indications</WireLabel>
        <FlowDot path="M272 518 L272 592" dur={2.4} begin="0.6s" color="var(--blue)" r={3.5} />

        {/* ── LAYER 4: security framework shield on the SDL path ── */}
        <g>
          <rect x="540" y="616" width="240" height="112" rx="14" fill="rgba(22,163,74,0.05)" stroke="var(--green)" strokeWidth="1.6" strokeDasharray="7 5" />
          <g className={reduced ? undefined : 'anim-pulse'}>
            <path d="M660 632 l16 6.5v10.5c0 9-6.6 17.3-16 20-9.4-2.7-16-11-16-20v-10.5l16-6.5z" fill="var(--green)" opacity="0.16" />
            <path d="M660 634 l14 5.7v9.6c0 8-5.8 15.4-14 17.9-8.2-2.5-14-9.9-14-17.9v-9.6l14-5.7z" fill="none" stroke="var(--green)" strokeWidth="1.7" />
            <path d="M653.5 649l4.5 4.5 8-8.5" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x="660" y="694" textAnchor="middle" className="svg-label" fontSize="12.5" fill="var(--green)">Zero Trust Security Framework</text>
          <text x="660" y="710" textAnchor="middle" className="svg-sub" fontSize="9.5">LAYER 4 · Frameworks 1 · 2 · 3 — every SDL access authorised</text>
        </g>

        {/* xApp pod → shield → Redis */}
        <Wire d="M468 662 L540 662" stroke="var(--accent)" width={1.8} marker="url(#tb-arrow-teal)" />
        <WireLabel x={504} y={653}>SDL call</WireLabel>
        <Wire d="M780 662 C830 660 838 500 840 444" stroke="var(--accent)" width={1.8} marker="url(#tb-arrow-teal)" />
        <WireLabel x={862} y={540}>authorised only</WireLabel>
        <FlowDot path="M468 662 L540 662" dur={1.8} begin="0.2s" r={3.5} />
        <FlowDot path="M780 662 C830 660 838 500 840 444" dur={2.6} begin="2.2s" color="var(--green)" r={3.5} />
      </svg>
      <p className="diagram-caption">
        The end-to-end virtualised testbed — one 5G network, one RIC, three interchangeable security frameworks at Layer 4.
      </p>
    </div>
  )
}
