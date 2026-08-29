import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import TrustTriangle from '../components/diagrams/TrustTriangle.jsx'
import VonNetworkDiagram from '../components/diagrams/VonNetworkDiagram.jsx'
import VcSigningAnimation from '../components/diagrams/VcSigningAnimation.jsx'
import RuntimeFlowF3 from '../components/diagrams/RuntimeFlowF3.jsx'
import DidVcArchitecture from '../components/diagrams/DidVcArchitecture.jsx'
import {
  HyperledgerLogo, DockerLogo, PostgresLogo, PythonLogo, DidLogo, KyvernoLogo, EnvoyLogo, OpaLogo,
} from '../components/TechLogos.jsx'

const ONBOARDING = [
  { title: 'The developer submits the xApp', body: 'An ordinary application image and its descriptor. No identity code inside it.' },
  { title: 'The platform installs it as usual', body: 'The RIC’s own onboarding tool runs untouched — the identity work is added around it, not inside it.' },
  { title: 'A ledger identity is created', body: 'The RIC’s identity agent generates a fresh key pair and a decentralised identifier for this xApp.' },
  { title: 'That identity is anchored publicly', body: 'The identifier is written to the Indy ledger as an ordinary, unprivileged entry — enough to be resolvable and revocable, with no authority to write anything itself.' },
  { title: 'A second, local signing key', body: 'A separate key is derived that needs no ledger lookup to verify. This is what will sign proofs at runtime, keeping requests inside the control loop’s time budget.' },
  { title: 'The RIC signs the credential', body: 'A verifiable credential is issued recording exactly which SDL namespaces and operations this xApp may use, valid for thirty days.' },
  { title: 'The credential is checked immediately', body: 'It is verified the moment it is signed, so nothing invalid is ever stored.' },
  { title: 'A rehearsal proof is run', body: 'A test presentation is built and verified end-to-end, catching any mismatch now rather than as a runtime outage later.' },
  { title: 'The wallet is sealed', body: 'Both identifiers, the private signing key, the signed credential, the issuer’s public key and the ledger genesis file are stored as a Kubernetes Secret.' },
  { title: 'The pod is created', body: 'Only now does the xApp actually start.' },
  { title: 'Sidecars and wallet are injected', body: 'Kyverno adds the Envoy proxy and the Auth Agent, and mounts the wallet read-only into the agent alone.' },
  { title: 'A certificate is issued', body: 'cert-manager provides the pod’s X.509 certificate from the internal authority.' },
  { title: 'The agent checks itself before serving', body: 'It confirms the credential came from the trusted RIC identity and was issued to this very xApp — and refuses to start if not, or if it finds issuer private keys that should never be in a holder’s wallet.' },
]

const RUNTIME = [
  { title: 'The xApp asks for data', body: 'An ordinary database command leaves the application container.' },
  { title: 'Envoy intercepts and reads it', body: 'The proxy buffers the stream and its WebAssembly filter extracts the command, namespace and key.' },
  { title: 'Envoy asks the Auth Agent', body: 'The parsed request context is handed to the Auth Agent sidecar for an authorisation decision.' },
  { title: 'The agent opens its wallet', body: 'It loads the credential and private key from the read-only volume mounted into it alone.' },
  { title: 'It collects a fresh challenge', body: 'The agent takes a single-use number from the separate VP Verifier service — the challenge comes from the party that needs convincing, not from the one being checked.' },
  { title: 'It builds and signs a presentation', body: 'The credential is wrapped in a presentation and signed with the xApp’s private key, mathematically bound to that specific challenge.' },
  { title: 'The verifier consumes the challenge', body: 'It rejects anything unknown, already used or expired. This is what makes a captured proof worthless a second time.' },
  { title: 'It proves the key is really held', body: 'The verifier holds no xApp private key, so a valid signature is genuine evidence of possession rather than a self-declaration.' },
  { title: 'It re-checks the credential itself', body: 'The credential’s own signature is verified against the pinned RIC issuer identity, confirming it was genuinely issued and never altered.' },
  { title: 'It confirms the holder matches', body: 'The presentation must be signed by the very identity the credential was issued to, so one xApp cannot present another’s credential. Validity dates are checked too.' },
  { title: 'Plain claims go to the policy engine', body: 'The verifier — not the agent — produces the authoritative claims, which are passed to OPA as ordinary data. The policy engine never handles cryptographic material.' },
  { title: 'The decision is enforced', body: 'OPA checks the namespace and operation against the rules. Envoy then forwards the request through the encrypted tunnel to Redis, or returns 403 Forbidden.' },
]

const LIMITATIONS = [
  <><strong>The ledger runs on the host, not in Kubernetes.</strong> An in-cluster deployment was attempted first. The four validators must agree on shared startup material before consensus can begin, and hand-written manifests bypassed the orchestration logic the ledger project relies on to sequence that agreement — so with independent pod IPs and restart timing, the nodes could not form consistent identities and fell into a crash-restart loop. Docker Compose on the host is the method the project is designed and tested for.</>,
  <><strong>The identity agent could not sign the credentials.</strong> Its issuing endpoints expect a separate holder agent reachable over a messaging protocol — but here the holder is a sidecar that does not exist yet at provisioning time. Responsibility was therefore split: the identity agent handles ledger-native key generation and anchoring, while a separate library performs the credential signing.</>,
  <><strong>Credentials are delivered out of band.</strong> The full issuer-to-holder exchange protocol is not implemented; the signed credential is written straight into the wallet by the provisioning pipeline. This is common practice when the holder is a software component rather than a person with a phone.</>,
  <><strong>The signing library fought the runtime.</strong> It embeds its own asynchronous engine written in Rust, which refused to initialise inside Python’s existing async runtime. Every call had to be dispatched onto its own thread — a conflict that appeared independently in both the provisioning script and the runtime agent.</>,
  <><strong>Von Network is a testbed ledger.</strong> It demonstrates that ledger-anchored identity works inside a RIC; it does not represent the resilience, governance or performance of a production Hyperledger Indy deployment.</>,
  <><strong>The heaviest option by every performance measure.</strong> Roughly five and a half times the delay of Framework 1, with more variation, and the steepest degradation as xApps multiply.</>,
]

export default function Framework3() {
  return (
    <Page title="Framework 3 — DID/VC">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-teal">FRAMEWORK 3 · DECENTRALIZED IDENTITY (DID/VC)</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              Proof instead of <span className="accent">a password</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Frameworks 1 and 2 both ask a central server "is this xApp allowed?". This one removes that server
              from the question entirely. The RIC signs each xApp a credential once, at onboarding — and from then
              on the xApp proves who it is with mathematics, freshly, on every single request.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">The idea</span>
            <h2 className="section-title">Issuer, holder, verifier</h2>
            <p className="lead">
              This is the same pattern as a passport. One authority issues it, the bearer carries it, and a
              checkpoint verifies it — without phoning the issuing office. Trust comes from the signature and
              from a public record anyone can check, not from a live connection to whoever issued it.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <TrustTriangle />
            </div>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><HyperledgerLogo size={20} /> The ledger</h3>
              <p>A four-node permissioned Hyperledger Indy network. It stores only public material — identifier documents, credential schemas and revocation records. It never issues or holds an identity itself.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><PostgresLogo size={20} /> The identity agent</h3>
              <p>The RIC's agent, holding the trust-anchor identity that is authorised to publish credential definitions. Its wallet persists in PostgreSQL so that identity survives restarts.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card" style={{ height: '100%' }}>
              <h3><DidLogo size={20} /> The verifier</h3>
              <p>A separate service that issues challenges and checks proofs. Crucially, it holds no xApp keys — which is what makes its verdict meaningful.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Architecture</span>
            <h2 className="section-title">How the pieces fit together</h2>
            <p className="lead">
              The ledger anchors trust from outside the cluster. Identity services live in the platform namespace.
              The proof itself is built inside the xApp pod but judged elsewhere. Dashed arrows run once at
              onboarding; solid arrows carry live traffic.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <DidVcArchitecture />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">A design correction worth telling</span>
            <h2 className="section-title">Why the verifier had to be moved out</h2>
            <p className="lead">
              The first version of this design let the Auth Agent do everything: generate the challenge, sign the
              proof, and check the proof — all in one process, holding the private key.
            </p>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%', borderLeft: '3px solid var(--amber)' }}>
              <h3>The flaw</h3>
              <p>
                That is not a challenge-response protocol at all. A challenge only means something when it comes
                from the party that needs convincing. When the same process invents the number, signs it and
                approves it, verification cannot fail for any reason an attacker controls — and the proof never
                crosses a channel where a replay could even occur. All it genuinely established was that the key
                in the wallet matched the credential.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%', borderLeft: '3px solid var(--green)' }}>
              <h3>The fix</h3>
              <p>
                Holder and verifier were split into separate processes with separate key material. A dedicated
                verifier now issues short-lived single-use challenges and produces the claims itself. Because the
                claims come from the verifier rather than the agent, a compromised Auth Agent cannot misrepresent
                who it is acting as — it can only act as the identity it can cryptographically prove it holds.
              </p>
            </div></Reveal>
          </div>
          <div className="callout">
            <div>
              <strong>And it costs one round trip, not two:</strong>&nbsp; asking for a challenge and then
              submitting a proof would mean two exchanges per request. The verifier returns the <em>next</em>
              &nbsp;challenge together with each successful result, so in steady state the agent already holds one
              and only a single exchange is needed.
            </div>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Two identifiers, on purpose</span>
            <h2 className="section-title">One for the record, one for the speed</h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><HyperledgerLogo size={20} /> The ledger identity</h3>
              <p>
                Written to the Indy ledger, this is the auditable and revocable identity. It carries no special
                role — an xApp needs only to be resolvable, never to write to the ledger. Revoking it is a single
                ledger transaction that takes effect immediately.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><DidLogo size={20} /> The signing identity</h3>
              <p>
                Verifiable purely by local computation, with no network lookup. This is what signs each request's
                proof. Consulting the ledger on every database call would blow straight through the RIC's
                sub-second control loop, so the fast identity does the per-request work.
              </p>
            </div></Reveal>
          </div>
          <div className="callout">
            <div>
              <strong>They cannot be separated.</strong>&nbsp; The credential's subject is the fast signing
              identity, while the ledger identity is carried inside it as a signed claim. Tearing the two apart
              would break the signature, so proving the one always proves the other.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">The credential</span>
            <h2 className="section-title">A sealed permit for every xApp</h2>
            <p className="lead">
              An SDL request says what an xApp is <em>trying</em> to do. The credential says what it is
              <em> permitted</em> to do — a decision made by an administrator at onboarding and then sealed
              beyond tampering.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <VcSigningAnimation />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">The root of trust</span>
            <h2 className="section-title">Why a permissioned ledger</h2>
            <p className="lead">
              A distributed file store can hold an identifier document, but offers no consensus on updates, no
              credential versioning and no revocation. A public blockchain has consensus but puts every identity
              action on display, and charges unpredictable fees inside what is otherwise a closed, operator-run
              network. Hyperledger Indy was built for this job rather than adapted to it.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <VonNetworkDiagram />
            </div>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><DockerLogo size={20} /> Deliberately outside the cluster</h3>
              <p>
                Keeping the ledger off the cluster separates it administratively from the workloads it serves and
                stops it competing for their resources — a distinct failure boundary between the identity
                substrate and the platform that depends on it.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><DidLogo size={20} /> What it holds — and does not</h3>
              <p>
                Only public artifacts: identifier documents, schemas, credential definitions and revocation
                records. Private keys never leave their wallets, and credentials themselves are exchanged
                directly rather than published.
              </p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Onboarding</span>
            <h2 className="section-title">Thirteen steps, all before the pod starts</h2>
            <p className="lead">
              Everything happens in the provisioning pipeline, so the xApp is born with its identity already in
              place and never has to fetch one.
            </p>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={ONBOARDING} interval={300} />
          </div>
          <div className="callout">
            <div>
              <KyvernoLogo size={16} />&nbsp; <strong>Same zero-touch principle as the other two frameworks:</strong>
              &nbsp; Kyverno injects the sidecars and mounts the wallet, cert-manager issues the certificate. The
              xApp developer sees none of it.
            </div>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Runtime</span>
            <h2 className="section-title">Twelve steps, on every single request</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <RuntimeFlowF3 />
            </div>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={RUNTIME} interval={300} />
          </div>
          <div className="callout">
            <div>
              <OpaLogo size={16} />&nbsp; <strong>A clean division of labour:</strong>&nbsp; the credential says
              <em> who</em> is asking; the policy engine decides <em>whether they may</em>. The credential's claims
              are passed to the policy as ordinary data — the enforcement decision always belongs to the policy,
              never to the credential.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Assessment</span>
            <h2 className="section-title">Strengths, trade-offs &amp; honest limitations</h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal>
              <div className="card" style={{ height: '100%' }}>
                <h3>Strengths</h3>
                <ul className="procon">
                  <li>No identity server on the request path — an xApp's authorisation travels with it from the moment it starts.</li>
                  <li>Replay is structurally prevented: every proof is bound to a single-use challenge and dies with it.</li>
                  <li>Credentials are tamper-evident; altering any field destroys the signature.</li>
                  <li>Revocation is immediate — one ledger transaction, with no need to reissue anything to anyone else.</li>
                  <li>The strongest identity assurance of the three, and the only one where a compromised agent still cannot fake who it is.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card" style={{ height: '100%' }}>
                <h3>Trade-offs</h3>
                <ul className="procon cons">
                  <li>Around five and a half times the delay of Framework 1, with noticeably more variation.</li>
                  <li>Degrades the fastest as xApps multiply — the cryptography is paid for on every request.</li>
                  <li>Substantially more infrastructure to run: a ledger, an identity agent, a verifier and a wallet lifecycle.</li>
                  <li>The tooling is younger and less battle-tested than mainstream identity standards.</li>
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ul className="limit-list" style={{ marginTop: 24 }}>
              {LIMITATIONS.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
