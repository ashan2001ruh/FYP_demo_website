import { useReducedMotion } from 'framer-motion'
import { Defs, NodeBox, Wire, WireLabel, FlowDot, StepDot, Zone, fitWidth, fitHeight } from './svgKit.jsx'
import {
  DockerLogo, KubernetesLogo, RedisLogo, PostgresLogo, PythonLogo, EnvoyLogo,
  HyperledgerLogo, OpaLogo, DidLogo, WasmLogo, CalicoLogo,
} from '../TechLogos.jsx'

const box = (o) => ({
  ...o,
  w: o.w ?? fitWidth({ title: o.title, sub: o.sub, titleSize: o.titleSize ?? 13, subSize: o.subSize ?? 10, logo: !!o.logo }),
  h: o.h ?? fitHeight({ sub: o.sub, titleSize: o.titleSize ?? 13, subSize: o.subSize ?? 10, padding: 13 }),
})

const XAPP = box({ x: 62, y: 128, title: 'xApp Container', sub: ['unmodified application'], stroke: 'var(--green)', logo: PythonLogo })
const ENVOY = box({ x: 62, y: 224, title: 'Envoy Sidecar', sub: ['WASM parses RESP'], stroke: 'var(--purple)', logo: EnvoyLogo })
const AGENT = box({ x: 62, y: 320, title: 'Auth Agent', sub: ['Holder · builds proofs'], stroke: 'var(--accent)', logo: PythonLogo })
const WALLET = box({ x: 262, y: 314, title: 'Wallet Secret', sub: ['DIDs · key · credential', 'mounted read-only'], stroke: 'var(--pink)', logo: DidLogo })

const ACAPY = box({ x: 540, y: 112, title: 'ACA-Py', sub: ['RIC Identity Agent'], stroke: 'var(--amber)', logo: HyperledgerLogo })
const PG = box({ x: 540, y: 194, title: 'PostgreSQL', sub: ['agent wallet store'], stroke: 'var(--blue)', logo: PostgresLogo })
const VERIF = box({ x: 540, y: 288, title: 'VP Verifier', sub: ['issues single-use nonce', 'verifies proofs'], stroke: 'var(--green)', logo: DidLogo })
const OPA = box({ x: 540, y: 396, title: 'Open Policy Agent', sub: ['central PDP'], stroke: 'var(--amber)', logo: OpaLogo })

const ING = box({ x: 96, y: 546, title: 'Envoy Ingress Proxy', sub: ['mTLS · port 6380'], stroke: 'var(--purple)', logo: EnvoyLogo })
const REDIS = box({ x: 420, y: 546, title: 'Redis · SDL', sub: ['Shared Data Layer'], stroke: 'var(--red)', logo: RedisLogo })

const VON_NODES = [
  { cx: 906, cy: 296 }, { cx: 996, cy: 296 },
  { cx: 906, cy: 372 }, { cx: 996, cy: 372 },
]

export default function DidVcArchitecture() {
  const reduced = useReducedMotion()
  const envoyCx = ENVOY.x + ENVOY.w / 2
  const ingCx = ING.x + ING.w / 2

  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 1070 660" role="img" aria-label="DID and Verifiable Credential framework architecture" style={{ minWidth: 820 }}>
        <Defs prefix="dvc" />

        {/* legend */}
        <g>
          <line x1="596" y1="34" x2="632" y2="34" stroke="var(--accent)" strokeWidth="2.4" />
          <text x="640" y="38" className="svg-sub" fontSize="11">runtime, every request</text>
          <line x1="800" y1="34" x2="836" y2="34" stroke="var(--purple)" strokeWidth="2.4" strokeDasharray="6 5" />
          <text x="844" y="38" className="svg-sub" fontSize="11">onboarding, once</text>
        </g>

        <Zone x={20} y={52} w={800} h={588} label="RIC Cluster · Kubernetes" color="rgba(50,108,229,0.5)" labelFill="#326CE5" Logo={KubernetesLogo} />

        {/* xApp pod */}
        <Zone
          x={40} y={86} w={420} h={318}
          label="xApp Pod · ricxapp: 3 containers"
          color="rgba(14,116,144,0.5)" labelFill="var(--accent)" fill="rgba(14,116,144,0.035)" dash="0"
        />
        <NodeBox {...XAPP} />
        <NodeBox {...ENVOY} />
        <NodeBox {...AGENT} />
        <NodeBox {...WALLET} />

        {/* ricplt services */}
        <Zone
          x={480} y={86} w={320} h={382}
          label="ricplt namespace"
          color="rgba(148,163,184,0.7)" labelFill="var(--faint)" dash="0"
        />
        <NodeBox {...ACAPY} />
        <NodeBox {...PG} />
        <NodeBox {...VERIF} />
        <NodeBox {...OPA} />
        <Wire d={`M${ACAPY.x + 30} ${ACAPY.y + ACAPY.h} L${ACAPY.x + 30} ${PG.y}`} stroke="var(--blue)" width={1.3} />

        {/* DBaaS pod */}
        <Zone
          x={40} y={506} w={620} h={116}
          label="DBaaS Pod · ricplt"
          color="rgba(220,38,38,0.5)" labelFill="var(--red)" fill="rgba(220,38,38,0.03)" dash="0"
        />
        <NodeBox {...ING} />
        <NodeBox {...REDIS} />

        {/* Von Network, outside the cluster */}
        <Zone
          x={838} y={196} w={214} h={230}
          label="Ubuntu host"
          color="rgba(219,39,119,0.5)" labelFill="var(--pink)" fill="rgba(219,39,119,0.02)" Logo={DockerLogo}
        />
        <text x="945" y="248" textAnchor="middle" className="svg-label" fontSize="12.5" fill="var(--pink)">Von Network · Indy</text>
        <text x="945" y="264" textAnchor="middle" className="svg-sub" fontSize="9.5">DID docs · schemas · revocation</text>
        {VON_NODES.map((a, i) =>
          VON_NODES.slice(i + 1).map((b, j) => (
            <line key={`${i}${j}`} x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} stroke="var(--pink)" strokeWidth="1" opacity="0.32" strokeDasharray="3 5" className={reduced ? undefined : 'anim-dash'} />
          )),
        )}
        {VON_NODES.map((n, i) => (
          <g key={i}>
            {!reduced && (
              <circle cx={n.cx} cy={n.cy} r="20" fill="var(--pink)" opacity="0.09">
                <animate attributeName="r" values="17;24;17" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={n.cx} cy={n.cy} r="15" fill="var(--panel)" stroke="var(--pink)" strokeWidth="1.5" />
            <text x={n.cx} y={n.cy + 4} textAnchor="middle" className="svg-sub" fontSize="9">N{i + 1}</text>
          </g>
        ))}
        <text x="945" y="410" textAnchor="middle" className="svg-sub" fontSize="9.5" fill="var(--pink)">4 validator nodes</text>

        {/* ── onboarding (dashed purple) ── */}
        <Wire d={`M${ACAPY.x + ACAPY.w} 138 C 760 138 800 200 ${VON_NODES[1].cx - 10} 272`} stroke="var(--purple)" width={1.6} dashed animated={!reduced} marker="url(#dvc-arrow-purple)" />
        <WireLabel x={748} y={96} fill="var(--purple)">anchor DIDs</WireLabel>
        <Wire d={`M${ACAPY.x} 150 C 430 200 400 270 ${WALLET.x + WALLET.w / 2} ${WALLET.y}`} stroke="var(--purple)" width={1.6} dashed animated={!reduced} marker="url(#dvc-arrow-purple)" />
        <WireLabel x={390} y={244} fill="var(--purple)">provision wallet</WireLabel>
        <Wire d={`M${WALLET.x} ${WALLET.y + WALLET.h / 2} L${AGENT.x + AGENT.w} ${AGENT.y + AGENT.h / 2}`} stroke="var(--pink)" width={1.5} marker="url(#dvc-arrow)" />

        {/* ── runtime (solid) ── */}
        {/* 1 xApp -> Envoy */}
        <Wire d={`M${XAPP.x + 34} ${XAPP.y + XAPP.h} L${XAPP.x + 34} ${ENVOY.y}`} stroke="var(--green)" width={1.8} marker="url(#dvc-arrow-green)" />
        <StepDot x={XAPP.x + 34} y={(XAPP.y + XAPP.h + ENVOY.y) / 2} n="1" color="var(--green)" />
        <WireLabel x={XAPP.x + 150} y={(XAPP.y + XAPP.h + ENVOY.y) / 2 + 4} anchor="start" plate={false}>RESP</WireLabel>

        {/* 2 Envoy -> Auth Agent */}
        <Wire d={`M${ENVOY.x + 34} ${ENVOY.y + ENVOY.h} L${ENVOY.x + 34} ${AGENT.y}`} stroke="var(--accent)" width={1.8} marker="url(#dvc-arrow-teal)" />
        <StepDot x={ENVOY.x + 34} y={(ENVOY.y + ENVOY.h + AGENT.y) / 2} n="2" />
        <WireLabel x={ENVOY.x + 150} y={(ENVOY.y + ENVOY.h + AGENT.y) / 2 + 4} anchor="start" plate={false}>parsed context</WireLabel>

        {/* 3 Auth Agent -> VP Verifier ; 4 back */}
        <Wire d={`M${AGENT.x + AGENT.w} 336 C 420 330 460 316 ${VERIF.x} 316`} stroke="var(--accent)" width={1.7} marker="url(#dvc-arrow-teal)" />
        <StepDot x={462} y={306} n="3" />
        <WireLabel x={368} y={280}>signed presentation + nonce</WireLabel>
        <Wire d={`M${VERIF.x} 344 C 470 356 430 372 ${AGENT.x + AGENT.w} 358`} stroke="var(--green)" width={1.7} dashed marker="url(#dvc-arrow-green)" />
        <StepDot x={462} y={372} n="4" color="var(--green)" />
        <WireLabel x={360} y={426} fill="var(--green)">verified claims + next nonce</WireLabel>
        <FlowDot path={`M${AGENT.x + AGENT.w} 336 C 420 330 460 316 ${VERIF.x} 316`} dur={2.4} r={3.5} />

        {/* 5 Auth Agent -> OPA */}
        <Wire d={`M${AGENT.x + 90} ${AGENT.y + AGENT.h} C 260 470 420 452 ${OPA.x} 428`} stroke="var(--amber)" width={1.7} marker="url(#dvc-arrow)" />
        <StepDot x={330} y={462} n="5" color="var(--amber)" />
        <WireLabel x={330} y={490}>plain claims only no cryptographic material</WireLabel>
        <FlowDot path={`M${AGENT.x + 90} ${AGENT.y + AGENT.h} C 260 470 420 452 ${OPA.x} 428`} dur={2.8} begin="1.4s" color="var(--amber)" r={3.5} />

        {/* 6 Envoy -> Ingress over mTLS */}
        <Wire d={`M${envoyCx + 40} ${ENVOY.y + ENVOY.h / 2} C 300 258 320 460 ${ingCx} ${ING.y}`} stroke="var(--accent)" width={2} marker="url(#dvc-arrow-teal)" />
        <StepDot x={312} y={486} n="6" />
        <WireLabel x={250} y={528}>authorized RESP · mTLS 6380</WireLabel>
        <FlowDot path={`M${envoyCx + 40} ${ENVOY.y + ENVOY.h / 2} C 300 258 320 460 ${ingCx} ${ING.y}`} dur={3.4} begin="2.2s" r={3.5} />

        {/* 7 Ingress -> Redis */}
        <Wire d={`M${ING.x + ING.w} 578 L${REDIS.x} 578`} stroke="var(--red)" width={1.8} marker="url(#dvc-arrow-red)" />
        <StepDot x={(ING.x + ING.w + REDIS.x) / 2} y={558} n="7" color="var(--red)" />
        <FlowDot path={`M${ING.x + ING.w} 578 L${REDIS.x} 578`} dur={1.8} begin="3.8s" color="var(--red)" r={3.5} />

        {/* badges */}
        <g transform={`translate(${ENVOY.x + ENVOY.w + 8}, ${ENVOY.y + 6})`}><WasmLogo size={15} /></g>
        <g transform="translate(596, 618)"><CalicoLogo size={16} /></g>
        <WireLabel x={712} y={630} fill="var(--red)">Calico blocks direct 6379</WireLabel>
      </svg>
      <p className="diagram-caption">
        Framework 3: the Auth Agent holds the credential but cannot vouch for itself. A separate VP Verifier issues the
        challenge and produces the claims, so a compromised agent cannot invent an identity.
      </p>
    </div>
  )
}
