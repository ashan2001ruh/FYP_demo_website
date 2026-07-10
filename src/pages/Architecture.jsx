import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import ArchitectureDiagram from '../components/diagrams/ArchitectureDiagram.jsx'

const COMPONENTS = [
  { title: 'Von Network (host)', body: '4 Hyperledger Indy validator nodes + a webserver (:9000) run via Docker Compose on the Ubuntu host, outside Kubernetes. The webserver serves the genesis file and a self-serve DID registration endpoint.' },
  { title: 'ACA-Py + PostgreSQL (ricplt)', body: 'The RIC Identity Agent (ACA-Py 0.10.4) holds the RIC Endorser DID and publishes the credential schema. Its askar wallet persists in PostgreSQL 14, so identities survive pod restarts.' },
  { title: 'OPA (ricplt)', body: 'The opa-pdp deployment answers ext_authz gRPC checks on :9191, evaluating the envoy.authz Rego policy as the final policy decision point.' },
  { title: 'Redis / SDL DBaaS (ricplt)', body: 'The Shared Data Layer itself — the protected asset. The standard OSC RIC DBaaS StatefulSet, reachable only through an authorized Envoy proxy path.' },
  { title: 'xApp pod (ricxapp)', body: 'Three containers: the unmodified xApp, an Envoy v1.28.0 sidecar intercepting SDL traffic, and Auth Agent v2 (DIDKit) verifying credentials. The xapp-wallet Secret is mounted read-only at /wallet.' },
  { title: 'Kyverno + cert-manager', body: 'Kyverno\'s touchless-xapp-security ClusterPolicy injects the sidecars and wallet mount into every ricxapp pod; cert-manager mints mTLS certificates from the smo-root-ca ClusterIssuer.' },
]

export default function Architecture() {
  return (
    <Page title="Architecture">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="kicker">System architecture</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              The complete <span className="accent">testbed topology</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              How the DID/VC framework's pieces fit together — the Indy ledger on the host, the identity
              plane in <code>ricplt</code>, and the enforcement plane inside every xApp pod. Dashed arrows
              are one-time onboarding; solid arrows carry live traffic.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <Reveal delay={0.08}>
            <ArchitectureDiagram />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Component guide</span>
            <h2 className="section-title">What each block does</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            {COMPONENTS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="card" style={{ height: '100%' }}>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="callout" style={{ marginTop: 30 }}>
            <div>
              <strong>Why the ledger lives outside the cluster:</strong>&nbsp; each Indy node generates its
              genesis file dynamically at startup, and the 4 validators must discover each other's genesis
              transactions before consensus. Kubernetes pod-scheduling and DNS-propagation timing made this a
              race the pool kept losing — Docker Compose on the host is deterministic, so that is the working
              testbed configuration.
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
