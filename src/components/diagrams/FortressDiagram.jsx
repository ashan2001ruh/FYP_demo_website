import { Defs, NodeBox, Wire, WireLabel, FlowDot } from './svgKit.jsx'

/** Framework 2 — Centralized PEP ("Fortress"): PEP lives inside the DBaaS pod. */
export default function FortressDiagram() {
  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 760 520" role="img" aria-label="Centralized PEP fortress architecture" style={{ minWidth: 560 }}>
        <Defs prefix="f2" />

        {/* Keycloak — external identity */}
        <NodeBox x={470} y={30} w={250} h={58} title="Keycloak" sub="Identity Provider · ric-realm" stroke="var(--amber)" />

        {/* xApp pod */}
        <rect x="30" y="30" width="360" height="180" rx="12" fill="rgba(0,212,200,0.03)" stroke="rgba(0,212,200,0.35)" />
        <text x="46" y="54" className="svg-sub" fontSize="12" fill="var(--accent)">xApp Pod · ricxapp namespace</text>

        <NodeBox x={52} y={70} w={140} h={62} title="xApp" sub="client · SDL API" stroke="var(--green)" />
        <NodeBox x={228} y={110} w={144} h={76} title="Egress Ambassador" sub={['Python sidecar', 'egress-ambassador:v2']} stroke="var(--accent)" />

        {/* DBaaS fortress pod */}
        <rect x="30" y="270" width="690" height="222" rx="12" fill="rgba(248,81,73,0.03)" stroke="rgba(248,81,73,0.4)" />
        <text x="46" y="294" className="svg-sub" fontSize="12" fill="var(--red)">DBaaS StatefulSet Pod · ricplt namespace · 4 containers</text>

        <NodeBox x={52} y={314} w={150} h={70} title="Envoy Gateway" sub={[':8080 HTTP', 'ext_authz filter']} stroke="var(--purple)" />
        <NodeBox x={52} y={406} w={150} h={64} title="OPA" sub={['0.61.0-envoy · :9191', 'JWT + payload Rego']} stroke="var(--amber)" />
        <NodeBox x={296} y={314} w={170} h={70} title="Protocol Translator" sub={['Flask · :9090', 'redis-translator:v1']} stroke="var(--blue)" />
        <NodeBox x={540} y={314} w={150} h={70} title="Redis" sub="localhost :6379" stroke="var(--red)" />

        {/* 1: xApp -> Ambassador */}
        <Wire d="M192 110 C214 118 218 126 228 134" stroke="var(--green)" marker="url(#f2-arrow-teal)" />
        <WireLabel x={186} y={104}>1 · raw RESP → 127.0.0.1:6379</WireLabel>
        <FlowDot path="M192 110 C214 118 218 126 228 134" dur={2} color="var(--green)" r={3.5} />

        {/* 2: Ambassador <-> Keycloak (dashed) */}
        <Wire d="M372 132 C420 116 430 84 470 68" stroke="var(--border)" dashed marker="url(#f2-arrow)" />
        <WireLabel x={452} y={106}>2 · JWT · client creds + mTLS</WireLabel>

        {/* 3: Ambassador -> Envoy (cluster network) */}
        <Wire d="M300 186 L300 240 L127 240 L127 314" stroke="var(--accent)" marker="url(#f2-arrow-teal)" />
        <WireLabel x={214} y={232}>3 · HTTP POST /redis · Base64 body + Bearer JWT</WireLabel>
        <FlowDot path="M300 186 L300 240 L127 240 L127 314" dur={3.4} begin="0.8s" />

        {/* 4: Envoy <-> OPA */}
        <Wire d="M127 384 L127 406" stroke="var(--amber)" marker="url(#f2-arrow)" />
        <Wire d="M148 406 L148 384" stroke="var(--amber)" marker="url(#f2-arrow)" dashed />
        <WireLabel x={218} y={400}>4 · ext_authz gRPC (localhost)</WireLabel>

        {/* 5: Envoy -> Translator */}
        <Wire d="M202 349 L296 349" stroke="var(--purple)" marker="url(#f2-arrow-purple)" />
        <WireLabel x={249} y={340}>5 · allowed POST</WireLabel>
        <FlowDot path="M202 349 L296 349" dur={2.2} begin="2.4s" color="var(--purple)" r={3.5} />

        {/* 6: Translator -> Redis */}
        <Wire d="M466 349 L540 349" stroke="var(--red)" marker="url(#f2-arrow)" />
        <WireLabel x={503} y={340}>6 · raw TCP</WireLabel>
        <FlowDot path="M466 349 L540 349" dur={2} begin="3.4s" color="var(--red)" r={3.5} />
      </svg>
      <p className="diagram-caption">
        Zero Trust Fortress — the PEP is injected into the database pod itself; xApps only carry an ambassador.
      </p>
    </div>
  )
}
