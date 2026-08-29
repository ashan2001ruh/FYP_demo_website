import { Defs, NodeBox, Wire, WireLabel, FlowDot, fitWidth, fitHeight } from './svgKit.jsx'
import { PythonLogo, EnvoyLogo, OpaLogo, RedisLogo } from '../TechLogos.jsx'

const box = (o) => ({
  ...o,
  titleSize: 15,
  subSize: 10.5,
  w: fitWidth({ title: o.title, sub: o.sub, titleSize: 15, subSize: 10.5, logo: true }),
  h: fitHeight({ sub: o.sub, titleSize: 15, subSize: 10.5, padding: 14 }),
})

/* The enforcement pattern every framework shares: intercept, decide, then allow. */
const BOXES = [
  box({ title: 'xApp', sub: ['wants data'], stroke: 'var(--green)', logo: PythonLogo }),
  box({ title: 'Interception', sub: ['request is held'], stroke: 'var(--purple)', logo: EnvoyLogo }),
  box({ title: 'Identity check', sub: ['who is asking?'], stroke: 'var(--accent)', logo: PythonLogo }),
  box({ title: 'Policy check', sub: ['are they allowed?'], stroke: 'var(--amber)', logo: OpaLogo }),
  box({ title: 'Shared Data Layer', sub: ['the protected data'], stroke: 'var(--red)', logo: RedisLogo }),
]

const GAP = 46
const Y = 46
let cursor = 12
BOXES.forEach((b) => { b.x = cursor; b.y = Y; cursor += b.w + GAP })
const TOTAL = cursor - GAP + 12

const MID = Y + BOXES[0].h / 2

export default function HeroPipeline() {
  const first = BOXES[0]
  const last = BOXES[BOXES.length - 1]
  const fwd = `M${first.x + first.w} ${MID} L${last.x} ${MID}`

  return (
    <div className="diagram-frame" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
      <svg viewBox={`0 0 ${TOTAL} 160`} role="img" aria-label="How every framework works: a request is intercepted, the identity is checked, the policy is checked, and only then does data move" style={{ minWidth: 640 }}>
        <Defs prefix="hero" />

        <Wire d={fwd} stroke="var(--border)" width={2} />
        {BOXES.slice(0, -1).map((b, i) => (
          <Wire key={i} d={`M${b.x + b.w} ${MID} L${BOXES[i + 1].x} ${MID}`} stroke="var(--border)" width={2} marker="url(#hero-arrow-teal)" />
        ))}

        <FlowDot path={fwd} dur={5} begin="0s" />
        <FlowDot path={fwd} dur={5} begin="1.7s" color="var(--purple)" />
        <FlowDot path={fwd} dur={5} begin="3.4s" color="var(--blue)" r={3.5} />
        <FlowDot path={`M${last.x} ${MID + 24} L${first.x + first.w} ${MID + 24}`} dur={6} begin="2.5s" color="var(--green)" r={3.5} />

        {BOXES.map((b) => <NodeBox key={b.title} {...b} />)}

        <WireLabel x={TOTAL / 2} y={MID + 58} size={11} plate={false}>
          every request, every time — no exceptions
        </WireLabel>
      </svg>
    </div>
  )
}
