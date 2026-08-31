import { Defs, NodeBox, Wire, WireLabel, FlowDot } from './svgKit.jsx'
import { HyperledgerLogo, PythonLogo, DidLogo } from '../TechLogos.jsx'

/** Framework 3 — issuer / holder / verifier trust triangle over the Indy ledger. */
export default function TrustTriangle() {
  return (
    <div className="diagram-frame">
      <svg viewBox="0 0 720 430" role="img" aria-label="DID/VC trust triangle" style={{ minWidth: 520 }}>
        <Defs prefix="tt" />

        <NodeBox x={250} y={26} w={220} h={76} title="Issuer — the RIC" sub={['ACA-Py identity agent', 'signs credentials']} stroke="var(--accent)" logo={HyperledgerLogo} />
        <NodeBox x={30} y={250} w={220} h={76} title="Holder — the xApp" sub={['wallet with DID + key', '+ signed credential']} stroke="var(--green)" logo={DidLogo} />
        <NodeBox x={470} y={250} w={220} h={76} title="Verifier — Auth Agent" sub={['checks every proof', 'locally, in the sidecar']} stroke="var(--purple)" logo={PythonLogo} />

        {/* ledger */}
        <g className="anim-pulse">
          <ellipse cx="360" cy="392" rx="150" ry="26" fill="rgba(219,39,119,0.06)" stroke="var(--pink)" strokeWidth="1.4" />
        </g>
        <g transform="translate(228, 380)"><HyperledgerLogo size={16} /></g>
        <text x="366" y="389" textAnchor="middle" className="svg-label" fontSize="13" fill="var(--pink)">Von Network · Hyperledger Indy</text>
        <text x="360" y="404" textAnchor="middle" className="svg-sub" fontSize="10.5">root of trust — anchors every identity</text>

        {/* issuer -> holder: issues VC */}
        <Wire d="M268 102 C190 150 160 200 148 250" stroke="var(--accent)" width={1.8} marker="url(#tt-arrow-teal)" />
        <WireLabel x={150} y={166}>issues signed credential</WireLabel>
        <WireLabel x={150} y={188}>(onboarding, once)</WireLabel>
        <FlowDot path="M268 102 C190 150 160 200 148 250" dur={3.2} color="var(--accent)" />

        {/* holder -> verifier: presents VP */}
        <Wire d="M250 296 L470 296" stroke="var(--green)" width={1.8} marker="url(#tt-arrow-teal)" />
        <WireLabel x={360} y={344}>presents fresh proof · every request</WireLabel>
        <FlowDot path="M250 296 L470 296" dur={2.6} begin="1s" color="var(--green)" />

        {/* verifier -> issuer trust */}
        <Wire d="M572 250 C560 180 520 130 452 102" stroke="var(--purple)" width={1.8} dashed marker="url(#tt-arrow-purple)" />
        <WireLabel x={572} y={168}>trusts the RIC's identity</WireLabel>

        {/* anchors to ledger */}
        <Wire d="M360 102 L360 366" stroke="var(--pink)" dashed width={1.2} />
        <Wire d="M140 326 C180 356 240 372 300 380" stroke="var(--pink)" dashed width={1.2} />
        <Wire d="M580 326 C540 356 480 372 420 380" stroke="var(--pink)" dashed width={1.2} />
      </svg>
      <p className="diagram-caption">No identity server in the runtime path — trust is rooted in the ledger and digital signatures.</p>
    </div>
  )
}
