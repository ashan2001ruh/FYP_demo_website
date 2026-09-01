import { Defs, NodeBox, Wire, WireLabel, FlowDot, StepDot, Zone, fitWidth, fitHeight } from './svgKit.jsx'
import {
  KeycloakLogo, OpaLogo, RedisLogo, EnvoyLogo, PythonLogo, CalicoLogo, KubernetesLogo,
} from '../TechLogos.jsx'

const box = (o) => ({
  ...o,
  w: o.w ?? fitWidth({ title: o.title, sub: o.sub, titleSize: o.titleSize ?? 14, subSize: o.subSize ?? 10.5, logo: !!o.logo }),
  h: o.h ?? fitHeight({ sub: o.sub, titleSize: o.titleSize ?? 14, subSize: o.subSize ?? 10.5 }),
})

const XAPP = box({
  x: 54, y: 104, title: 'xApp Container', sub: ['unmodified application', 'SDL API'],
  stroke: 'var(--green)', logo: PythonLogo,
})
const AMB = box({
  x: 292, y: 96, title: 'Egress Ambassador', sub: ['lightweight Python sidecar', 'wraps RESP · attaches JWT'],
  stroke: 'var(--accent)', logo: PythonLogo,
})
const KC = box({
  x: 690, y: 84, title: 'Keycloak', sub: ['Identity Provider', 'ric-realm · issues JWT'],
  stroke: 'var(--amber)', logo: KeycloakLogo,
})
const GW = box({
  x: 92, y: 452, title: 'Envoy Gateway', sub: ['single entry point', 'port 8080 · mTLS'],
  stroke: 'var(--purple)', logo: EnvoyLogo,
})
const OPA = box({
  x: 92, y: 566, title: 'Open Policy Agent', sub: ['PDP inside the DB pod', 'decodes payload · Rego'],
  stroke: 'var(--amber)', logo: OpaLogo,
})
const TR = box({
  x: 400, y: 452, title: 'Protocol Translator', sub: ['Flask · port 9090', 'rebuilds raw RESP'],
  stroke: 'var(--blue)', logo: PythonLogo,
})
const REDIS = box({
  x: 706, y: 452, title: 'Redis · SDL', sub: ['Shared Data Layer', 'localhost 6379'],
  stroke: 'var(--red)', logo: RedisLogo,
})

export default function CpepDiagram() {
  const ambCx = AMB.x + AMB.w / 2
  const gwCx = GW.x + GW.w / 2

  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 1010 700" role="img" aria-label="Centralized policy enforcement architecture" style={{ minWidth: 780 }}>
        <Defs prefix="cpep" />

        <Zone x={20} y={30} w={968} h={652} label="RIC Cluster · Kubernetes" color="rgba(50,108,229,0.5)" labelFill="#326CE5" Logo={KubernetesLogo} />

        {/* xApp pod */}
        <Zone
          x={38} y={62} w={520} h={200}
          label="xApp Pod · ricxapp namespace: 2 containers"
          color="rgba(14,116,144,0.5)" labelFill="var(--accent)" fill="rgba(14,116,144,0.035)" dash="0"
        />
        <NodeBox {...XAPP} />
        <NodeBox {...AMB} />
        <NodeBox {...KC} />

        {/* DBaaS fortress pod */}
        <Zone
          x={62} y={402} w={904} h={258}
          label="DBaaS Pod · ricplt namespace: Redis plus 3 injected security containers"
          color="rgba(220,38,38,0.5)" labelFill="var(--red)" fill="rgba(220,38,38,0.03)" dash="0"
        />
        <NodeBox {...GW} />
        <NodeBox {...OPA} />
        <NodeBox {...TR} />
        <NodeBox {...REDIS} />

        {/* (1) xApp -> Ambassador */}
        <Wire d={`M${XAPP.x + XAPP.w} 140 L${AMB.x} 140`} stroke="var(--green)" width={1.8} marker="url(#cpep-arrow-green)" />
        <StepDot x={(XAPP.x + XAPP.w + AMB.x) / 2} y={118} n="1" color="var(--green)" />
        <WireLabel x={(XAPP.x + XAPP.w + AMB.x) / 2} y={162}>RESP</WireLabel>
        <FlowDot path={`M${XAPP.x + XAPP.w} 140 L${AMB.x} 140`} dur={2} color="var(--green)" r={3.5} />

        {/* (2)(3) Ambassador <-> Keycloak */}
        <Wire d={`M${AMB.x + AMB.w} 120 L${KC.x} 116`} stroke="var(--amber)" width={1.6} marker="url(#cpep-arrow)" />
        <StepDot x={(AMB.x + AMB.w + KC.x) / 2} y={96} n="2" color="var(--amber)" />
        <WireLabel x={624} y={140}>fetch JWT</WireLabel>
        <Wire d={`M${KC.x} 142 L${AMB.x + AMB.w} 152`} stroke="var(--amber)" width={1.6} dashed marker="url(#cpep-arrow)" />
        <StepDot x={(AMB.x + AMB.w + KC.x) / 2} y={176} n="3" color="var(--amber)" />
        <FlowDot path={`M${AMB.x + AMB.w} 120 L${KC.x} 116`} dur={3} begin="0.4s" color="var(--amber)" r={3.5} />

        {/* (4) Ambassador -> Envoy Gateway, across the cluster */}
        <Wire d={`M${ambCx} ${AMB.y + AMB.h} L${ambCx} 330 L${gwCx} 330 L${gwCx} ${GW.y}`} stroke="var(--accent)" width={2} marker="url(#cpep-arrow-teal)" />
        <StepDot x={ambCx} y={300} n="4" />
        <WireLabel x={ambCx - 4} y={322}>HTTP POST · Base64 body + JWT bearer, over mTLS</WireLabel>
        <FlowDot path={`M${ambCx} ${AMB.y + AMB.h} L${ambCx} 330 L${gwCx} 330 L${gwCx} ${GW.y}`} dur={3.2} begin="1s" r={3.5} />

        {/* (5)(8) Envoy <-> OPA inside the pod */}
        <Wire d={`M${GW.x + 40} ${GW.y + GW.h} L${GW.x + 40} ${OPA.y}`} stroke="var(--amber)" width={1.6} marker="url(#cpep-arrow)" />
        <StepDot x={GW.x + 40} y={(GW.y + GW.h + OPA.y) / 2} n="5" color="var(--amber)" />
        <Wire d={`M${GW.x + GW.w - 40} ${OPA.y} L${GW.x + GW.w - 40} ${GW.y + GW.h}`} stroke="var(--amber)" width={1.6} dashed marker="url(#cpep-arrow)" />
        <StepDot x={GW.x + GW.w - 40} y={(GW.y + GW.h + OPA.y) / 2} n="8" color="var(--amber)" />
        <WireLabel x={GW.x + GW.w + 96} y={548} anchor="middle">gRPC ext_authz over localhost</WireLabel>

        {/* (6)(7) OPA <-> Keycloak JWKS */}
        <Wire d={`M${OPA.x + OPA.w} 600 C 640 600 900 460 ${KC.x + KC.w - 30} ${KC.y + KC.h}`} stroke="var(--faint)" width={1.3} dashed marker="url(#cpep-arrow)" />
        <WireLabel x={640} y={620}>6 · JWKS fetch → 7 · public keys verify the token signature</WireLabel>

        {/* (9) Envoy -> Translator */}
        <Wire d={`M${GW.x + GW.w} 490 L${TR.x} 490`} stroke="var(--purple)" width={1.8} marker="url(#cpep-arrow-purple)" />
        <StepDot x={(GW.x + GW.w + TR.x) / 2} y={468} n="9" color="var(--purple)" />
        <WireLabel x={(GW.x + GW.w + TR.x) / 2} y={514}>approved HTTP</WireLabel>
        <FlowDot path={`M${GW.x + GW.w} 490 L${TR.x} 490`} dur={2} begin="2.6s" color="var(--purple)" r={3.5} />

        {/* (10) Translator -> Redis */}
        <Wire d={`M${TR.x + TR.w} 490 L${REDIS.x} 490`} stroke="var(--red)" width={1.8} marker="url(#cpep-arrow-red)" />
        <StepDot x={(TR.x + TR.w + REDIS.x) / 2} y={468} n="10" color="var(--red)" />
        <WireLabel x={(TR.x + TR.w + REDIS.x) / 2} y={514}>raw RESP</WireLabel>
        <FlowDot path={`M${TR.x + TR.w} 490 L${REDIS.x} 490`} dur={2} begin="3.6s" color="var(--red)" r={3.5} />

        {/* Calico */}
        <g transform="translate(600, 352)"><CalicoLogo size={17} /></g>
        <WireLabel x={742} y={365} fill="var(--red)">Calico allows DBaaS ingress on port 8080 only</WireLabel>
      </svg>
      <p className="diagram-caption">
        Framework 2: one enforcement point guards the database for the whole cluster. The policy engine sits beside Redis
        and inspects the decoded command itself, so every xApp is judged on what it actually asked for.
      </p>
    </div>
  )
}
