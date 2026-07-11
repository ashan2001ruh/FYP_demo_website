import { useReducedMotion } from 'framer-motion'
import { Defs, NodeBox, Wire, WireLabel, FlowDot } from './svgKit.jsx'
import {
  DockerLogo, KubernetesLogo, RedisLogo, PostgresLogo, PythonLogo, EnvoyLogo,
  HyperledgerLogo, OpaLogo, KyvernoLogo, CertLogo, DidLogo,
} from '../TechLogos.jsx'

const VON_NODES = [
  { cx: 94, cy: 430 },
  { cx: 204, cy: 430 },
  { cx: 94, cy: 530 },
  { cx: 204, cy: 530 },
]

/** Framework 3 architecture — Von Network on the host, DID/VC PEP inside the RIC cluster. */
export default function DidVcArchitecture() {
  const reduced = useReducedMotion()
  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 1000 780" role="img" aria-label="DID/VC framework architecture" style={{ minWidth: 760 }}>
        <Defs prefix="arch" />

        {/* ───── legend ───── */}
        <g>
          <line x1="700" y1="24" x2="740" y2="24" stroke="var(--accent)" strokeWidth="2" />
          <text x="748" y="28" className="svg-sub" fontSize="11">runtime flow</text>
          <line x1="850" y1="24" x2="890" y2="24" stroke="var(--purple)" strokeWidth="2" strokeDasharray="6 5" />
          <text x="898" y="28" className="svg-sub" fontSize="11">onboarding flow</text>
        </g>

        {/* ───── operator / provisioner ───── */}
        <NodeBox
          x={24} y={56} w={250} h={110}
          title="Onboarding Pipeline"
          sub={['creates identities & wallets', 'operator-run provisioning', 'before pod deployment']}
          stroke="var(--purple)"
          logo={DidLogo}
        />

        {/* ───── Ubuntu host with Von Network ───── */}
        <rect x="24" y="286" width="250" height="330" rx="14" fill="rgba(219,39,119,0.015)" stroke="var(--border)" strokeDasharray="8 6" />
        <g transform="translate(40, 298)"><DockerLogo size={15} /></g>
        <text x="61" y="310" className="svg-faint" fontSize="11">Ubuntu host · Docker Compose</text>

        <NodeBox x={44} y={326} w={210} h={50} title="Von Network Ledger" sub="genesis · DID registration" stroke="var(--pink)" logo={HyperledgerLogo} titleSize={12.5} subSize={10} />

        {/* validator mesh */}
        {VON_NODES.map((a, i) =>
          VON_NODES.slice(i + 1).map((b, j) => (
            <line key={`${i}${j}`} x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} stroke="var(--pink)" strokeWidth="1" opacity="0.3" strokeDasharray="3 5" className={reduced ? undefined : 'anim-dash'} />
          )),
        )}
        {VON_NODES.map((n, i) => (
          <g key={i}>
            {!reduced && (
              <circle cx={n.cx} cy={n.cy} r="24" fill="var(--pink)" opacity="0.08">
                <animate attributeName="r" values="20;28;20" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={n.cx} cy={n.cy} r="18" fill="var(--panel)" stroke="var(--pink)" strokeWidth="1.5" />
            <text x={n.cx} y={n.cy + 4} textAnchor="middle" className="svg-sub" fontSize="9.5">N{i + 1}</text>
          </g>
        ))}
        <text x="149" y="590" textAnchor="middle" className="svg-sub" fontSize="10.5" fill="var(--pink)">4× Indy validator nodes</text>

        {/* ───── Kubernetes cluster ───── */}
        <rect x="304" y="40" width="672" height="700" rx="16" fill="none" stroke="var(--accent)" strokeOpacity="0.4" strokeDasharray="10 7" strokeWidth="1.5" />
        <g transform="translate(322, 52)"><KubernetesLogo size={17} /></g>
        <text x="346" y="66" className="svg-sub" fontSize="12" fill="var(--accent)">Kubernetes cluster · O-RAN Near-RT RIC</text>

        {/* ricplt namespace */}
        <rect x="328" y="82" width="624" height="252" rx="12" fill="rgba(37,99,235,0.02)" stroke="var(--border)" />
        <text x="344" y="104" className="svg-faint" fontSize="11.5">ricplt namespace</text>

        <NodeBox x={348} y={116} w={180} h={80} title="ACA-Py" sub={['RIC identity agent', 'holds the Endorser DID']} stroke="var(--amber)" logo={HyperledgerLogo} titleSize={13} subSize={10.5} />
        <NodeBox x={560} y={116} w={170} h={80} title="PostgreSQL" sub={['wallet storage', 'survives restarts']} stroke="var(--blue)" logo={PostgresLogo} titleSize={13} subSize={10.5} />
        <NodeBox x={760} y={116} w={172} h={80} title="Trusted Identifiers" sub={['issuer DID · schema', 'credential definition']} stroke="var(--faint)" logo={DidLogo} titleSize={13} subSize={10.5} />
        <NodeBox x={560} y={230} w={170} h={80} title="Redis · SDL" sub={['the protected', 'Shared Data Layer']} stroke="var(--red)" logo={RedisLogo} titleSize={13} subSize={10.5} />
        <NodeBox x={760} y={230} w={172} h={80} title="OPA" sub={['policy decision point', 'sees claims, not crypto']} stroke="var(--amber)" logo={OpaLogo} titleSize={13} subSize={10.5} />

        {/* ACA-Py <-> PostgreSQL */}
        <Wire d="M528 156 L560 156" stroke="var(--blue)" width={1.4} />

        {/* ricxapp namespace */}
        <rect x="328" y="374" width="624" height="252" rx="12" fill="rgba(14,116,144,0.02)" stroke="var(--border)" />
        <text x="344" y="396" className="svg-faint" fontSize="11.5">ricxapp namespace</text>

        {/* xApp pod */}
        <rect x="348" y="410" width="430" height="190" rx="12" fill="rgba(14,116,144,0.04)" stroke="rgba(14,116,144,0.45)" />
        <text x="364" y="432" className="svg-sub" fontSize="11.5" fill="var(--accent)">xApp Pod · 3 containers</text>

        <NodeBox x={368} y={446} w={110} h={74} title="xApp" sub="SDL client" stroke="var(--green)" logo={PythonLogo} titleSize={12.5} subSize={10} />
        <NodeBox x={508} y={446} w={110} h={74} title="Envoy" sub={['PEP proxy', 'intercepts']} stroke="var(--purple)" logo={EnvoyLogo} titleSize={12.5} subSize={10} />
        <NodeBox x={648} y={446} w={110} h={74} title="Auth Agent" sub={['DIDKit verify', 'VC + VP']} stroke="var(--accent)" logo={PythonLogo} titleSize={12.5} subSize={10} />

        {/* wallet secret */}
        <NodeBox x={808} y={446} w={124} h={74} title="Wallet Secret" sub={['DID · private key', 'credential · genesis']} stroke="var(--pink)" logo={DidLogo} titleSize={12.5} subSize={9.5} />
        <Wire d="M808 483 L758 483" stroke="var(--pink)" width={1.5} marker="url(#arch-arrow)" />
        <WireLabel x={783} y={474} size={9.5}>mounted</WireLabel>

        {/* Kyverno + cert-manager */}
        <NodeBox x={560} y={664} w={180} h={56} title="Kyverno" sub="injects sidecars + wallet" stroke="var(--purple)" logo={KyvernoLogo} titleSize={12.5} subSize={10} />
        <NodeBox x={764} y={664} w={188} h={56} title="cert-manager" sub="X.509 certificates" stroke="var(--purple)" logo={CertLogo} titleSize={12.5} subSize={10} />

        {/* ───── onboarding flows (dashed purple) ───── */}
        <Wire d="M274 100 C310 100 320 120 348 136" stroke="var(--purple)" dashed animated={!reduced} marker="url(#arch-arrow-purple)" />
        <WireLabel x={306} y={92} size={9.5} fill="var(--purple)">generate xApp DID</WireLabel>

        <Wire d="M149 166 L149 326" stroke="var(--purple)" dashed animated={!reduced} marker="url(#arch-arrow-purple)" />
        <WireLabel x={143} y={250} size={9.5} fill="var(--purple)" anchor="end">register DIDs</WireLabel>

        <Wire d="M274 156 C480 340 760 350 866 446" stroke="var(--purple)" dashed animated={!reduced} marker="url(#arch-arrow-purple)" />
        <WireLabel x={520} y={330} size={9.5} fill="var(--purple)">deliver wallet (signed credential)</WireLabel>

        <Wire d="M348 176 C310 220 280 270 258 326" stroke="var(--purple)" dashed marker="url(#arch-arrow-purple)" />
        <WireLabel x={286} y={266} size={9.5} fill="var(--purple)">anchor issuer · schema</WireLabel>

        <Wire d="M628 664 L590 600" stroke="var(--purple)" dashed animated={!reduced} marker="url(#arch-arrow-purple)" />
        <WireLabel x={578} y={638} size={9.5} fill="var(--purple)">inject sidecars</WireLabel>
        <Wire d="M846 664 C840 636 790 620 740 604" stroke="var(--purple)" dashed marker="url(#arch-arrow-purple)" />
        <WireLabel x={830} y={638} size={9.5} fill="var(--purple)">mTLS certs</WireLabel>

        {/* ───── runtime flows (solid teal + particles) ───── */}
        <Wire d="M478 483 L508 483" stroke="var(--accent)" width={1.8} marker="url(#arch-arrow-teal)" />
        <Wire d="M618 483 L648 483" stroke="var(--accent)" width={1.8} marker="url(#arch-arrow-teal)" />
        <FlowDot path="M420 483 L700 483" dur={3} r={3.5} />

        <Wire d="M703 446 L840 310" stroke="var(--accent)" width={1.6} marker="url(#arch-arrow-teal)" />
        <WireLabel x={800} y={388} size={9.5}>verified claims</WireLabel>
        <FlowDot path="M703 446 L840 310" dur={2.6} begin="1.2s" r={3.5} />

        <Wire d="M563 446 L640 310" stroke="var(--accent)" width={1.6} marker="url(#arch-arrow-teal)" />
        <WireLabel x={556} y={388} size={9.5}>authorised traffic</WireLabel>
        <FlowDot path="M563 446 L640 310" dur={2.6} begin="2s" r={3.5} color="var(--red)" />

        <Wire d="M676 520 C600 680 400 720 240 560" stroke="var(--accent)" width={1.5} marker="url(#arch-arrow-teal)" />
        <WireLabel x={430} y={716} size={9.5}>DID resolution · ledger trust root</WireLabel>
        <FlowDot path="M676 520 C600 680 400 720 240 560" dur={4.2} begin="0.6s" r={3.5} color="var(--pink)" />
      </svg>
      <p className="diagram-caption">
        DID/VC framework — the ledger anchors trust from outside the cluster; verification happens locally in every pod.
      </p>
    </div>
  )
}
