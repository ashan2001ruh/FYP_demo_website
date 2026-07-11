import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import TrustTriangle from '../components/diagrams/TrustTriangle.jsx'
import VonNetworkDiagram from '../components/diagrams/VonNetworkDiagram.jsx'
import VcSigningAnimation from '../components/diagrams/VcSigningAnimation.jsx'
import RuntimeFlowF3 from '../components/diagrams/RuntimeFlowF3.jsx'
import DidVcArchitecture from '../components/diagrams/DidVcArchitecture.jsx'
import { HyperledgerLogo, DockerLogo, PostgresLogo, PythonLogo, DidLogo, KyvernoLogo } from '../components/TechLogos.jsx'

const ONBOARDING = [
  { title: 'Developer pushes the xApp', body: 'The xApp image and its descriptor are published — no security code inside.' },
  { title: 'Onboarding pipeline triggered', body: 'The provisioning pipeline takes over; everything below happens before the pod exists.' },
  { title: 'Keypair and DID generated', body: 'ACA-Py, the RIC\'s identity agent, generates an Ed25519 keypair and a decentralised identifier (DID) for the xApp.' },
  { title: 'DID registered on the ledger', body: 'The xApp\'s DID is anchored on the Von Network Indy ledger — it now exists on the same root of trust as the RIC itself.' },
  { title: 'Presentation keypair generated', body: 'DIDKit generates a second signing keypair, used only for proving possession at runtime.' },
  { title: 'Credential signed', body: 'The RIC signs a Verifiable Credential encoding the xApp\'s allowed SDL namespaces and permissions.' },
  { title: 'Credential verified', body: 'The freshly signed credential is verified immediately — nothing invalid is ever stored.' },
  { title: 'Wallet stored', body: 'DID, private key, credential, issuer information and the ledger genesis file are packed into a Kubernetes Secret — the xApp\'s wallet.' },
  { title: 'xApp deployed', body: 'Only now is the xApp pod actually created.' },
  { title: 'Sidecars injected', body: 'Kyverno mutates the pod: Envoy and the Auth Agent appear beside the xApp, and the wallet is mounted into the Auth Agent.' },
  { title: 'Certificate issued', body: 'cert-manager issues the pod\'s X.509 certificate from the internal CA.' },
  { title: 'Startup verification', body: 'The Auth Agent opens the wallet and verifies the credential\'s signature and issuer before serving a single request.' },
  { title: 'Ready', body: 'The xApp is live — carrying a ledger-anchored identity it can prove without ever calling home.' },
]

const RUNTIME = [
  { title: 'SDL call', body: 'The xApp makes an ordinary SDL call towards Redis.' },
  { title: 'Interception', body: 'Envoy intercepts and buffers the request inside the pod.' },
  { title: 'Decision requested', body: 'Envoy asks the Auth Agent for an authorisation decision.' },
  { title: 'Wallet loaded', body: 'The Auth Agent reads the xApp\'s wallet from the mounted volume.' },
  { title: 'Presentation built', body: 'It wraps the credential in a Verifiable Presentation — a one-time envelope for showing the credential.' },
  { title: 'Bound to this request', body: 'The presentation is signed with the xApp\'s private key and bound to this specific request with a fresh nonce — it cannot be replayed.' },
  { title: 'Possession proven', body: 'DIDKit verifies the presentation: the caller really holds the private key behind the DID, not just a copy of the credential.' },
  { title: 'Issuance proven', body: 'DIDKit verifies the credential itself: it was signed by the RIC and has not been altered since.' },
  { title: 'Claims extracted', body: 'The verified namespaces and permissions are extracted as plain data.' },
  { title: 'Policy consulted', body: 'The claims go to OPA — the policy engine never touches cryptographic material.' },
  { title: 'Decision returned', body: 'OPA evaluates its rules and answers allow or deny.' },
  { title: 'Enforcement', body: 'Envoy forwards the request to Redis — or returns a 403 to the xApp.' },
]

const LIMITATIONS = [
  <><strong>The ledger runs on the host, not in Kubernetes.</strong> An in-cluster deployment was attempted first, but the four validators generate their genesis material at startup and pod scheduling timing made them race — the pool never reached consensus. Docker Compose on the Ubuntu host is deterministic and is the working configuration.</>,
  <><strong>DIDKit signs the credentials, not ACA-Py.</strong> The ACA-Py version used does not expose W3C credential signing, so the cryptographic signing step is delegated to DIDKit while ACA-Py manages identities and the ledger connection.</>,
  <><strong>Credential delivery is out-of-band.</strong> The full DIDComm issuer-to-holder exchange protocol is not implemented; credentials are delivered through the provisioning pipeline directly into the wallet Secret.</>,
  <><strong>More moving parts.</strong> A ledger, an identity agent, wallets and a signing library add operational complexity that Frameworks 1 and 2 simply don't have — the price of removing the runtime identity server.</>,
]

export default function Framework3() {
  return (
    <Page title="Framework 3 — DID/VC Zero Trust">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-teal">FRAMEWORK 3 · DID/VC Zero Trust</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              Identity <span className="accent">without an identity server</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              This framework replaces centralised token issuance with W3C Decentralised Identifiers and
              Verifiable Credentials anchored on a distributed ledger. The RIC issues each xApp a signed
              credential once, at onboarding; afterwards the xApp proves its identity cryptographically on
              every request — with no network call to any identity service.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Trust model</span>
            <h2 className="section-title">Issuer · Holder · Verifier</h2>
            <p className="lead">
              Trust is rooted in the Hyperledger Indy ledger — which anchors the identities — and in
              digital signatures, not in a live session with an identity server.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <TrustTriangle />
            </div>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3><HyperledgerLogo size={20} /> Von Network</h3>
              <p>A 4-node permissioned Indy ledger (Docker Compose on the host). It stores DID documents, credential schemas, credential definitions and revocation registries — the public facts everyone can verify against.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3><PostgresLogo size={20} /> ACA-Py identity agent</h3>
              <p>The RIC's identity agent, registered on the ledger with endorser rights. Its wallet persists in PostgreSQL, so the RIC's identity survives restarts.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card">
              <h3><PythonLogo size={20} /> DIDKit + Auth Agent</h3>
              <p>DIDKit performs the cryptography: signing credentials at onboarding, and verifying credentials and presentations inside the Auth Agent at runtime.</p>
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
              The ledger anchors trust from outside the cluster; identity management lives in the platform
              namespace; and verification happens locally inside every xApp pod. Dashed arrows run once at
              onboarding — solid arrows carry live traffic.
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
            <span className="kicker">The credential</span>
            <h2 className="section-title">A digital ID card for every xApp</h2>
            <p className="lead">
              A Verifiable Credential works like a sealed ID card: the RIC writes the xApp's privileges on
              it, signs it, and hands it over. Anyone can check the seal; nobody can alter the card without
              breaking it.
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
            <span className="kicker">The ledger</span>
            <h2 className="section-title">Von Network — the root of trust</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <VonNetworkDiagram />
            </div>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3><DockerLogo size={20} /> Why it lives on the host</h3>
              <p>The four validators must agree on shared genesis material before consensus can start. Kubernetes' scheduling timing made that a race, so the ledger runs as a Docker Compose stack on the Ubuntu host — outside the cluster, where startup order is deterministic.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3><DidLogo size={20} /> What it stores</h3>
              <p>Only public material: DID documents, credential schemas, credential definitions and revocation registries. Private keys never leave the wallets. Revoking an xApp is a single ledger transaction — effective immediately.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Onboarding — 13 steps</span>
            <h2 className="section-title">From image push to ledger-anchored identity</h2>
            <p className="lead">
              Everything happens in the provisioning pipeline, before the pod is ever scheduled — the xApp
              is born with its identity already in place.
            </p>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={ONBOARDING} interval={340} />
          </div>
          <div className="callout">
            <div>
              <KyvernoLogo size={16} /> <strong>Same zero-touch principle as the other frameworks:</strong>&nbsp;
              Kyverno injects the sidecars and mounts the wallet, cert-manager issues the certificate — the
              xApp developer never sees any of it.
            </div>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Runtime — 12 steps</span>
            <h2 className="section-title">Every request re-proves identity</h2>
            <p className="lead">
              The Auth Agent doesn't check a token — it demands a fresh cryptographic proof, bound to this
              one request, then hands only the verified claims to the policy engine.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <RuntimeFlowF3 />
            </div>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={RUNTIME} interval={340} />
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
                  <li>No runtime dependency on a central identity server — verification is local computation.</li>
                  <li>Credentials are tamper-evident: any modification breaks the signature.</li>
                  <li>Replay protection: each presentation is bound to exactly one request.</li>
                  <li>Revocation takes effect immediately via a single ledger transaction.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card" style={{ height: '100%' }}>
                <h3>Trade-offs</h3>
                <ul className="procon cons">
                  <li>Noticeably more infrastructure than Frameworks 1 and 2 — a ledger, an identity agent and wallet management.</li>
                  <li>Per-request cryptographic verification costs CPU in every pod.</li>
                  <li>Decentralised identity tooling is younger and less battle-tested than OIDC.</li>
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
