import { Defs, NodeBox, Wire, WireLabel, FlowDot } from './svgKit.jsx'
import { KeycloakLogo, OpaLogo, RedisLogo, EnvoyLogo, PythonLogo, PostgresLogo } from '../TechLogos.jsx'

/** Framework 1 — Localized PEP: 3-container xApp pod, Keycloak, OPA, Redis. */
export default function PodDiagramF1() {
  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 760 470" role="img" aria-label="Localized PEP architecture" style={{ minWidth: 560 }}>
        <Defs prefix="f1" />

        {/* cluster boundary */}
        <rect x="12" y="14" width="736" height="442" rx="14" fill="none" stroke="var(--border)" strokeDasharray="8 6" />
        <text x="30" y="40" className="svg-faint" fontSize="12">RIC Cluster · Kubernetes</text>

        {/* xApp pod */}
        <rect x="36" y="58" width="336" height="250" rx="12" fill="rgba(14,116,144,0.035)" stroke="rgba(14,116,144,0.45)" />
        <text x="52" y="82" className="svg-sub" fontSize="12" fill="var(--accent)">xApp Pod · ricxapp namespace</text>

        <NodeBox x={58} y={96} w={132} h={58} title="xApp" sub="SDL client" stroke="var(--green)" logo={PythonLogo} />
        <NodeBox x={58} y={222} w={132} h={58} title="Envoy" sub="PEP sidecar" stroke="var(--purple)" logo={EnvoyLogo} />
        <NodeBox x={238} y={158} w={116} h={78} title="Auth Agent" sub={['token cache', 'gRPC :50051']} stroke="var(--accent)" logo={PythonLogo} />

        {/* platform services */}
        <NodeBox x={480} y={70} w={230} h={62} title="Keycloak · IAM" sub={['ric-realm · mTLS clients', 'PostgreSQL backend']} stroke="var(--amber)" logo={KeycloakLogo} />
        <g transform="translate(490, 76)"><PostgresLogo size={15} /></g>
        <NodeBox x={480} y={196} w={230} h={62} title="Open Policy Agent" sub={['PDP · Rego rules', 'gRPC decision API']} stroke="var(--amber)" logo={OpaLogo} />
        <NodeBox x={480} y={356} w={230} h={62} title="Redis · SDL DBaaS" sub="the protected data layer" stroke="var(--red)" logo={RedisLogo} />

        {/* (1) xApp -> Envoy */}
        <Wire d="M124 154 L124 222" stroke="var(--green)" marker="url(#f1-arrow-teal)" />
        <WireLabel x={112} y={192} anchor="end">1 · SDL request (localhost)</WireLabel>
        <FlowDot path="M124 154 L124 222" dur={2.4} color="var(--green)" r={3.5} />

        {/* (2) Envoy -> Auth Agent, (6) return */}
        <Wire d="M190 238 L238 214" stroke="var(--purple)" marker="url(#f1-arrow-purple)" />
        <WireLabel x={196} y={216}>2 · check</WireLabel>
        <Wire d="M238 228 L190 254" stroke="var(--accent)" marker="url(#f1-arrow-teal)" dashed />
        <WireLabel x={222} y={262}>6 · ALLOW / DENY</WireLabel>

        {/* (3) Auth Agent <-> Keycloak */}
        <Wire d="M354 172 C420 140 430 116 480 104" stroke="var(--border)" marker="url(#f1-arrow)" />
        <WireLabel x={402} y={118}>3 · mTLS certificate → JWT</WireLabel>
        <Wire d="M480 118 C436 130 420 152 354 186" stroke="var(--border)" marker="url(#f1-arrow)" dashed />
        <WireLabel x={432} y={158}>short-lived token</WireLabel>
        <FlowDot path="M354 172 C420 140 430 116 480 104" dur={3.4} color="var(--amber)" r={3.5} begin="0.6s" />

        {/* (4)(5) Auth Agent <-> OPA */}
        <Wire d="M354 210 L480 218" stroke="var(--border)" marker="url(#f1-arrow)" />
        <WireLabel x={416} y={204}>4 · identity + action</WireLabel>
        <Wire d="M480 236 L354 226" stroke="var(--border)" marker="url(#f1-arrow)" dashed />
        <WireLabel x={418} y={252}>5 · decision</WireLabel>
        <FlowDot path="M354 210 L480 218" dur={2.8} color="var(--accent)" r={3.5} begin="1.2s" />

        {/* (7) Envoy -> Redis */}
        <Wire d="M124 280 L124 388 L480 388" stroke="var(--red)" marker="url(#f1-arrow)" />
        <WireLabel x={300} y={378}>7 · authorised traffic only</WireLabel>
        <FlowDot path="M124 280 L124 388 L480 388" dur={4} color="var(--red)" r={3.5} begin="2s" />
      </svg>
      <p className="diagram-caption">Localized PEP — every SDL request is checked inside the xApp pod before it leaves.</p>
    </div>
  )
}
