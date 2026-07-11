import { Defs, NodeBox, Wire, WireLabel, FlowDot } from './svgKit.jsx'
import { PythonLogo, EnvoyLogo, OpaLogo, RedisLogo } from '../TechLogos.jsx'

const BOXES = [
  { x: 20, title: 'xApp', sub: 'SDL client', stroke: 'var(--green)', logo: PythonLogo },
  { x: 210, title: 'Envoy', sub: 'PEP · intercepts', stroke: 'var(--purple)', logo: EnvoyLogo },
  { x: 400, title: 'Auth Agent', sub: 'authenticates', stroke: 'var(--accent)', logo: PythonLogo },
  { x: 590, title: 'OPA', sub: 'PDP · decides', stroke: 'var(--amber)', logo: OpaLogo },
  { x: 780, title: 'Redis · SDL', sub: 'protected data', stroke: 'var(--red)', logo: RedisLogo },
]
const W = 140
const Y = 52
const H = 64
const MID = Y + H / 2

export default function HeroPipeline() {
  const fwd = `M${20 + W} ${MID} L780 ${MID}`
  return (
    <div className="diagram-frame" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
      <svg viewBox="0 0 940 175" role="img" aria-label="Data flow: xApp to Envoy to Auth Agent to OPA to Redis" style={{ minWidth: 620 }}>
        <Defs prefix="hero" />

        {/* baseline wire */}
        <Wire d={fwd} stroke="var(--border)" width={2} />
        {BOXES.slice(0, -1).map((b, i) => (
          <Wire
            key={i}
            d={`M${b.x + W} ${MID} L${BOXES[i + 1].x} ${MID}`}
            stroke="var(--border)"
            width={2}
            marker="url(#hero-arrow-teal)"
          />
        ))}

        <WireLabel x={(20 + W + 210) / 2} y={MID - 14}>SDL request</WireLabel>
        <WireLabel x={(210 + W + 400) / 2} y={MID - 14}>authz check</WireLabel>
        <WireLabel x={(400 + W + 590) / 2} y={MID - 14}>identity claims</WireLabel>
        <WireLabel x={(590 + W + 780) / 2} y={MID - 14}>allow → proxy</WireLabel>

        <FlowDot path={fwd} dur={5} begin="0s" />
        <FlowDot path={fwd} dur={5} begin="1.7s" color="var(--purple)" />
        <FlowDot path={fwd} dur={5} begin="3.4s" color="var(--blue)" r={3.5} />
        <FlowDot
          path={`M780 ${MID + 22} L${20 + W} ${MID + 22}`}
          dur={6}
          begin="2.5s"
          color="var(--green)"
          r={3.5}
        />
        <WireLabel x={470} y={MID + 40}>response</WireLabel>

        {BOXES.map((b) => (
          <NodeBox key={b.title} x={b.x} y={Y} w={W} h={H} title={b.title} sub={b.sub} stroke={b.stroke} logo={b.logo} titleSize={15} subSize={11} />
        ))}
      </svg>
    </div>
  )
}
