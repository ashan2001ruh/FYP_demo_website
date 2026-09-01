import { Defs, NodeBox, Wire, WireLabel, FlowDot, StepDot, Zone, fitWidth, fitHeight } from './svgKit.jsx'
import {
  KeycloakLogo, OpaLogo, RedisLogo, EnvoyLogo, PythonLogo, CalicoLogo, WasmLogo, KubernetesLogo,
} from '../TechLogos.jsx'

/* Every box sizes itself from its own text, so nothing can be clipped. */
const box = (o) => ({
  ...o,
  w: o.w ?? fitWidth({ title: o.title, sub: o.sub, titleSize: o.titleSize ?? 14, subSize: o.subSize ?? 10.5, logo: !!o.logo }),
  h: o.h ?? fitHeight({ sub: o.sub, titleSize: o.titleSize ?? 14, subSize: o.subSize ?? 10.5 }),
})

const XAPP = box({
  x: 54, y: 104, title: 'xApp Container', sub: ['unmodified application', 'SDL API'],
  stroke: 'var(--green)', logo: PythonLogo,
})
const ENVOY = box({
  x: 292, y: 96, title: 'Envoy Sidecar', sub: ['PEP · WASM filter', 'parses RESP · caches JWT'],
  stroke: 'var(--purple)', logo: EnvoyLogo,
})
const KC = box({
  x: 664, y: 74, title: 'Keycloak', sub: ['Identity Provider', 'ric-realm · issues JWT'],
  stroke: 'var(--amber)', logo: KeycloakLogo,
})
const OPA = box({
  x: 664, y: 236, title: 'Open Policy Agent', sub: ['central PDP · one per cluster', 'Rego RBAC + ABAC'],
  stroke: 'var(--amber)', logo: OpaLogo,
})
const ING = box({
  x: 300, y: 468, title: 'Envoy Ingress Proxy', sub: ['mTLS termination', 'port 6380'],
  stroke: 'var(--purple)', logo: EnvoyLogo,
})
const REDIS = box({
  x: 616, y: 468, title: 'Redis · SDL', sub: ['Shared Data Layer', 'port 6379'],
  stroke: 'var(--red)', logo: RedisLogo,
})

export default function DpepDiagram() {
  const envoyCx = ENVOY.x + ENVOY.w / 2
  const ingCx = ING.x + ING.w / 2

  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 1010 620" role="img" aria-label="Decentralized policy enforcement architecture" style={{ minWidth: 780 }}>
        <Defs prefix="dpep" />

        <Zone x={20} y={30} w={968} h={572} label="RIC Cluster · Kubernetes" color="rgba(50,108,229,0.5)" labelFill="#326CE5" Logo={KubernetesLogo} />

        {/* xApp pod */}
        <Zone
          x={38} y={62} w={520} h={200}
          label="xApp Pod · ricxapp namespace: 2 containers"
          color="rgba(14,116,144,0.5)" labelFill="var(--accent)" fill="rgba(14,116,144,0.035)" dash="0"
        />
        <NodeBox {...XAPP} />
        <NodeBox {...ENVOY} />

        {/* platform services */}
        <NodeBox {...KC} />
        <NodeBox {...OPA} />

        {/* DBaaS pod */}
        <Zone
          x={278} y={430} w={520} h={140}
          label="DBaaS Pod · ricplt namespace: plaintext only inside the pod"
          color="rgba(220,38,38,0.45)" labelFill="var(--red)" fill="rgba(220,38,38,0.03)" dash="0"
        />
        <NodeBox {...ING} />
        <NodeBox {...REDIS} />

        {/* (1) xApp -> Envoy */}
        <Wire d={`M${XAPP.x + XAPP.w} 140 L${ENVOY.x} 140`} stroke="var(--green)" width={1.8} marker="url(#dpep-arrow-green)" />
        <StepDot x={(XAPP.x + XAPP.w + ENVOY.x) / 2} y={118} n="1" color="var(--green)" />
        <WireLabel x={(XAPP.x + XAPP.w + ENVOY.x) / 2} y={162}>RESP</WireLabel>
        <FlowDot path={`M${XAPP.x + XAPP.w} 140 L${ENVOY.x} 140`} dur={2} color="var(--green)" r={3.5} />

        {/* (2)(3) Envoy <-> Keycloak */}
        <Wire d={`M${ENVOY.x + ENVOY.w} 118 L${KC.x} 108`} stroke="var(--amber)" width={1.6} marker="url(#dpep-arrow)" />
        <StepDot x={(ENVOY.x + ENVOY.w + KC.x) / 2} y={92} n="2" color="var(--amber)" />
        <WireLabel x={608} y={132}>fetch JWT</WireLabel>
        <Wire d={`M${KC.x} 132 L${ENVOY.x + ENVOY.w} 146`} stroke="var(--amber)" width={1.6} dashed marker="url(#dpep-arrow)" />
        <StepDot x={(ENVOY.x + ENVOY.w + KC.x) / 2} y={166} n="3" color="var(--amber)" />
        <FlowDot path={`M${ENVOY.x + ENVOY.w} 118 L${KC.x} 108`} dur={3} begin="0.5s" color="var(--amber)" r={3.5} />

        {/* (4)(7) Envoy <-> OPA */}
        <Wire d={`M${ENVOY.x + ENVOY.w} 190 C 580 200 600 250 ${OPA.x} 262`} stroke="var(--accent)" width={1.7} marker="url(#dpep-arrow-teal)" />
        <StepDot x={572} y={224} n="4" />
        <WireLabel x={520} y={292}>action · namespace · key · JWT</WireLabel>
        <Wire d={`M${OPA.x} 292 C 600 300 580 250 ${ENVOY.x + ENVOY.w} 208`} stroke="var(--accent)" width={1.7} dashed marker="url(#dpep-arrow-teal)" />
        <StepDot x={604} y={314} n="7" />
        <WireLabel x={600} y={344}>ALLOW / DENY</WireLabel>
        <FlowDot path={`M${ENVOY.x + ENVOY.w} 190 C 580 200 600 250 ${OPA.x} 262`} dur={2.6} begin="1.2s" r={3.5} />

        {/* (5)(6) OPA <-> Keycloak JWKS */}
        <Wire d={`M${KC.x + KC.w - 40} 140 L${OPA.x + OPA.w - 40} ${OPA.y}`} stroke="var(--faint)" width={1.3} marker="url(#dpep-arrow)" />
        <WireLabel x={KC.x + KC.w + 6} y={190} anchor="start">5 · JWKS fetch</WireLabel>
        <WireLabel x={KC.x + KC.w + 6} y={210} anchor="start">6 · public keys</WireLabel>

        {/* (8) Envoy -> Envoy Ingress over mTLS */}
        <Wire d={`M${envoyCx} ${ENVOY.y + ENVOY.h} L${envoyCx} 380 L${ingCx} 380 L${ingCx} ${ING.y}`} stroke="var(--accent)" width={2} marker="url(#dpep-arrow-teal)" />
        <StepDot x={envoyCx} y={330} n="8" />
        <WireLabel x={envoyCx + 150} y={372}>authorized RESP inside an mTLS tunnel → port 6380</WireLabel>
        <FlowDot path={`M${envoyCx} ${ENVOY.y + ENVOY.h} L${envoyCx} 380 L${ingCx} 380 L${ingCx} ${ING.y}`} dur={3.2} begin="2s" r={3.5} />

        {/* (9) Ingress -> Redis */}
        <Wire d={`M${ING.x + ING.w} 508 L${REDIS.x} 508`} stroke="var(--red)" width={1.8} marker="url(#dpep-arrow-red)" />
        <StepDot x={(ING.x + ING.w + REDIS.x) / 2} y={486} n="9" color="var(--red)" />
        <WireLabel x={(ING.x + ING.w + REDIS.x) / 2} y={532}>RESP</WireLabel>
        <FlowDot path={`M${ING.x + ING.w} 508 L${REDIS.x} 508`} dur={2} begin="3.4s" color="var(--red)" r={3.5} />

        {/* Calico blocked direct path */}
        <Wire d={`M${XAPP.x + 40} ${XAPP.y + XAPP.h} C 90 340 120 470 ${REDIS.x - 30} 540`} stroke="var(--red)" width={1.5} dashed />
        <g transform="translate(148, 392)"><CalicoLogo size={17} /></g>
        <WireLabel x={258} y={404} fill="var(--red)">Calico blocks any direct hop to 6379</WireLabel>
        <g>
          <circle cx="171" cy="446" r="13" fill="var(--panel)" stroke="var(--red)" strokeWidth="2" />
          <path d="M163 438 L179 454 M179 438 L163 454" stroke="var(--red)" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* WASM callout */}
        <g transform={`translate(${ENVOY.x + 6}, ${ENVOY.y + ENVOY.h + 10})`}>
          <WasmLogo size={15} />
        </g>
        <WireLabel x={ENVOY.x + 132} y={ENVOY.y + ENVOY.h + 23} plate={false}>WASM parses every command</WireLabel>
      </svg>
      <p className="diagram-caption">
        Framework 1: enforcement happens inside the xApp pod. Two Envoy proxies: one as the local PEP, one terminating
        mTLS at the database. There is no Auth Agent in this design.
      </p>
    </div>
  )
}
