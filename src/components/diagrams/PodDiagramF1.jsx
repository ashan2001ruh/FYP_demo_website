import { Defs, NodeBox, Wire, WireLabel, FlowDot } from './svgKit.jsx'

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
        <rect x="36" y="58" width="336" height="250" rx="12" fill="rgba(0,212,200,0.03)" stroke="rgba(0,212,200,0.35)" />
        <text x="52" y="82" className="svg-sub" fontSize="12" fill="var(--accent)">xApp Pod · ricxapp namespace</text>

        <NodeBox x={58} y={96} w={132} h={58} title="xApp" sub="SDL API" stroke="var(--green)" />
        <NodeBox x={58} y={222} w={132} h={58} title="Envoy" sub="v1.28.0 sidecar" stroke="var(--purple)" />
        <NodeBox x={238} y={158} w={116} h={78} title="Auth Agent" sub={['auth-agent:v1', 'gRPC :50051']} stroke="var(--accent)" />

        {/* platform services */}
        <NodeBox x={480} y={70} w={230} h={62} title="Keycloak" sub={['ric-realm · mTLS client creds', ':8443 OpenID token']} stroke="var(--amber)" />
        <NodeBox x={480} y={196} w={230} h={62} title="Open Policy Agent" sub={['opa-service.ricplt :9191', 'Rego role table']} stroke="var(--amber)" />
        <NodeBox x={480} y={356} w={230} h={62} title="Redis · SDL DBaaS" sub="service-ricplt-dbaas-tcp :6379" stroke="var(--red)" />

        {/* (1) xApp -> Envoy */}
        <Wire d="M124 154 L124 222" stroke="var(--green)" marker="url(#f1-arrow-teal)" />
        <WireLabel x={112} y={192} anchor="end">1 · GET/SET → 127.0.0.1:6379</WireLabel>
        <FlowDot path="M124 154 L124 222" dur={2.4} color="var(--green)" r={3.5} />

        {/* (2) Envoy -> Auth Agent, (10) return */}
        <Wire d="M190 238 L238 214" stroke="var(--purple)" marker="url(#f1-arrow-purple)" />
        <WireLabel x={196} y={216}>2 · CheckRequest</WireLabel>
        <Wire d="M238 228 L190 254" stroke="var(--accent)" marker="url(#f1-arrow-teal)" dashed />
        <WireLabel x={222} y={262}>10 · ALLOW / DENY</WireLabel>

        {/* (4)(5) Auth Agent <-> Keycloak */}
        <Wire d="M354 172 C420 140 430 116 480 104" stroke="var(--border)" marker="url(#f1-arrow)" />
        <WireLabel x={402} y={118}>4 · token req · REST/mTLS</WireLabel>
        <Wire d="M480 118 C436 130 420 152 354 186" stroke="var(--border)" marker="url(#f1-arrow)" dashed />
        <WireLabel x={432} y={158}>5 · JWT (120 s)</WireLabel>
        <FlowDot path="M354 172 C420 140 430 116 480 104" dur={3.4} color="var(--amber)" r={3.5} begin="0.6s" />

        {/* (7)(8) Auth Agent <-> OPA */}
        <Wire d="M354 210 L480 218" stroke="var(--border)" marker="url(#f1-arrow)" />
        <WireLabel x={416} y={204}>7 · x-app-id / x-sdl-action</WireLabel>
        <Wire d="M480 236 L354 226" stroke="var(--border)" marker="url(#f1-arrow)" dashed />
        <WireLabel x={418} y={252}>8 · decision</WireLabel>
        <FlowDot path="M354 210 L480 218" dur={2.8} color="var(--accent)" r={3.5} begin="1.2s" />

        {/* (11) Envoy -> Redis */}
        <Wire d="M124 280 L124 388 L480 388" stroke="var(--red)" marker="url(#f1-arrow)" />
        <WireLabel x={300} y={378}>11 · authorized TCP proxy</WireLabel>
        <FlowDot path="M124 280 L124 388 L480 388" dur={4} color="var(--red)" r={3.5} begin="2s" />
      </svg>
      <p className="diagram-caption">Localized PEP — every SDL request is checked inside the xApp pod before it leaves.</p>
    </div>
  )
}
