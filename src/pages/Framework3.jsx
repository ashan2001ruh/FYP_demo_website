import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import TrustTriangle from '../components/diagrams/TrustTriangle.jsx'
import VcSigningAnimation from '../components/diagrams/VcSigningAnimation.jsx'
import RuntimeFlowF3 from '../components/diagrams/RuntimeFlowF3.jsx'
import DidVcArchitecture from '../components/diagrams/DidVcArchitecture.jsx'
import { HyperledgerLogo, PostgresLogo, PythonLogo, DidLogo } from '../components/TechLogos.jsx'

const ONBOARDING = [
  { title: 'The developer submits the xApp', body: 'An ordinary application image, with no identity code inside it.' },
  { title: 'The platform installs it as usual', body: 'The RIC’s own onboarding tool runs untouched; the identity work is added around it.' },
  { title: 'A ledger identity is created', body: 'The RIC’s identity agent generates a key pair and a decentralised identifier for this xApp.' },
  { title: 'That identity is anchored publicly', body: 'It is written to the ledger as an unprivileged entry — resolvable and revocable, but with no authority to write anything itself.' },
  { title: 'A second, local signing key', body: 'A separate key is derived that needs no ledger lookup, so runtime proofs stay inside the control loop’s time budget.' },
  { title: 'The RIC signs the credential', body: 'It records exactly which SDL namespaces and operations this xApp may use, valid for thirty days.' },
  { title: 'The credential is checked immediately', body: 'Verified the moment it is signed, so nothing invalid is ever stored.' },
  { title: 'A rehearsal proof is run', body: 'A test presentation is verified end to end, catching mismatches now rather than as a runtime outage later.' },
  { title: 'The wallet is sealed', body: 'Both identifiers, the private key, the credential and the issuer’s public key are stored as a Kubernetes Secret.' },
  { title: 'The pod is created', body: 'Only now does the xApp actually start.' },
  { title: 'Sidecars and wallet are injected', body: 'Kyverno adds Envoy and the Auth Agent, mounting the wallet read-only into the agent alone.' },
  { title: 'A certificate is issued', body: 'cert-manager provides the pod’s certificate from the internal authority.' },
  { title: 'The agent checks itself before serving', body: 'It confirms the credential came from the trusted RIC and was issued to this xApp — and refuses to start otherwise.' },
]

const RUNTIME = [
  { title: 'The xApp asks for data', body: 'An ordinary database command leaves the application container.' },
  { title: 'Envoy intercepts and reads it', body: 'Its WebAssembly filter extracts the command, namespace and key.' },
  { title: 'Envoy asks the Auth Agent', body: 'The parsed request is handed to the Auth Agent sidecar for a decision.' },
  { title: 'The agent opens its wallet', body: 'It loads the credential and private key from its read-only volume.' },
  { title: 'It collects a fresh challenge', body: 'A single-use number from the separate verifier — the challenge comes from the party that needs convincing, not the one being checked.' },
  { title: 'It builds and signs a presentation', body: 'The credential is wrapped and signed with the xApp’s private key, bound to that specific challenge.' },
  { title: 'The verifier consumes the challenge', body: 'Anything unknown, already used or expired is rejected. This is what makes a captured proof worthless a second time.' },
  { title: 'It proves the key is really held', body: 'The verifier holds no xApp key, so a valid signature is real evidence of possession rather than a self-declaration.' },
  { title: 'It re-checks the credential itself', body: 'Verified against the pinned RIC issuer identity, confirming it was genuinely issued and never altered.' },
  { title: 'It confirms the holder matches', body: 'The signer must be the identity the credential was issued to, so one xApp cannot present another’s.' },
  { title: 'Plain claims go to the policy engine', body: 'The verifier — not the agent — produces the claims, and the policy engine never handles cryptographic material.' },
  { title: 'The decision is enforced', body: 'Envoy forwards the request through the encrypted tunnel to Redis, or returns 403 Forbidden.' },
]

const LIMITATIONS = [
  <><strong>The ledger runs on the host, not in Kubernetes.</strong> An in-cluster deployment was tried first, but the four validators must agree on shared startup material before consensus can begin. Hand-written manifests bypassed the logic that sequences that agreement, so the nodes never formed consistent identities and fell into a crash-restart loop.</>,
  <><strong>The identity agent could not sign the credentials.</strong> Its issuing endpoints expect a separate holder agent reachable over a messaging protocol, but here the holder is a sidecar that does not exist yet at provisioning time. Ledger anchoring and credential signing were split between two libraries.</>,
  <><strong>Credentials are delivered out of band.</strong> The full issuer-to-holder exchange protocol is not implemented; the credential is written straight into the wallet by the provisioning pipeline — normal practice when the holder is software rather than a person.</>,
  <><strong>Von Network is a testbed ledger.</strong> It demonstrates that ledger-anchored identity works inside a RIC; it does not represent the resilience, governance or performance of a production deployment.</>,
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
              <p>A four-node permissioned Hyperledger Indy network storing only public material — identifier documents, credential schemas and revocation records. It never issues or holds an identity itself.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><PostgresLogo size={20} /> The identity agent</h3>
              <p>The RIC's agent, holding the trust-anchor identity authorised to publish credential definitions. Its wallet persists in PostgreSQL so that identity survives restarts.</p>
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
          <div className="callout">
            <div>
              <strong>Each xApp carries two identifiers, on purpose.</strong>&nbsp; One is written to the ledger:
              auditable, revocable in a single transaction, and deliberately unprivileged. The other is verifiable
              by local computation alone and does the per-request signing, because consulting the ledger on every
              database call would blow straight through the RIC's sub-second control loop. They cannot be
              separated — the credential names the fast identity as its subject and carries the ledger identity
              inside it as a signed claim, so proving one always proves the other.
            </div>
          </div>
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
                from the party that needs convincing. When one process invents the number, signs it and approves
                it, verification cannot fail for any reason an attacker controls. All it genuinely established
                was that the key in the wallet matched the credential.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%', borderLeft: '3px solid var(--green)' }}>
              <h3>The fix</h3>
              <p>
                Holder and verifier were split into separate processes with separate keys. A dedicated verifier
                now issues single-use challenges and produces the claims itself, so a compromised Auth Agent
                cannot misrepresent who it is acting as. It costs only one exchange per request, not two: the
                verifier returns the next challenge along with each result.
              </p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">The credential</span>
            <h2 className="section-title">A sealed permit for every xApp</h2>
            <p className="lead">
              An SDL request says what an xApp is <em>trying</em> to do. The credential says what it is
              <em> permitted</em> to do — an administrator's decision at onboarding, sealed beyond tampering.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <VcSigningAnimation />
            </div>
          </Reveal>
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
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Runtime</span>
            <h2 className="section-title">Twelve steps, on every single request</h2>
            <p className="lead">
              The credential says <em>who</em> is asking; the policy engine decides <em>whether they may</em>.
              The claims reach the policy as ordinary data, so the enforcement decision always belongs to the
              policy and never to the credential.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <RuntimeFlowF3 />
            </div>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={RUNTIME} interval={300} />
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
                  <li>Revocation is immediate — one ledger transaction, with nothing to reissue to anyone else.</li>
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
                  <li>Substantially more infrastructure: a ledger, an identity agent, a verifier and a wallet lifecycle.</li>
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
