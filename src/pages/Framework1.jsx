import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import PodDiagramF1 from '../components/diagrams/PodDiagramF1.jsx'
import { KeycloakLogo, EnvoyLogo, PythonLogo, CertLogo, KyvernoLogo, OpaLogo } from '../components/TechLogos.jsx'

const LIFECYCLE = [
  { title: 'Interception', body: 'The xApp issues an SDL operation. Its traffic is transparently redirected to the Envoy sidecar inside the same pod — the xApp never knows the difference.' },
  { title: 'Authorisation check', body: 'Envoy pauses the connection and asks the Auth Agent sidecar for a decision over gRPC.' },
  { title: 'Identity — certificate to token', body: 'The Auth Agent presents the pod\'s X.509 certificate (issued automatically by cert-manager) to Keycloak over mutual TLS. Keycloak matches the certificate\'s Common Name against its registered clients and returns a short-lived JWT carrying the xApp\'s authorisation claims.' },
  { title: 'Token caching', body: 'The token is cached and refreshed shortly before expiry, so most requests are authorised without any round-trip to Keycloak.' },
  { title: 'Policy decision', body: 'The Auth Agent forwards the xApp\'s identity and requested action to the Open Policy Agent, which evaluates its Rego rules — a role table mapping each xApp to the operations it may perform.' },
  { title: 'Enforcement', body: 'The decision returns to Envoy: allowed connections are proxied to the Redis SDL; denied connections are dropped before a single byte reaches the database.' },
]

export default function Framework1() {
  return (
    <Page title="Framework 1 — Localized PEP">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-teal">FRAMEWORK 1 · Localized PEP</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              Enforcement <span className="accent">inside every xApp pod</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              A classic identity-and-access-management approach done the Zero Trust way: each xApp pod
              carries its own Policy Enforcement Point, identities come from certificates, and short-lived
              tokens from Keycloak carry the authorisation claims.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Topology</span>
            <h2 className="section-title">Three containers per xApp pod</h2>
            <p className="lead">
              Kyverno automatically injects an Envoy proxy and an Auth Agent beside every xApp container.
              The xApp developer writes zero security code — the pod is secured the moment it is deployed.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <PodDiagramF1 />
            </div>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3><PythonLogo size={20} /> xApp container</h3>
              <p>The unmodified xApp and its SDL calls. Environment overrides point it at localhost, where the sidecars are listening.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3><EnvoyLogo size={20} /> Envoy sidecar — the PEP</h3>
              <p>Intercepts the raw SDL traffic and holds every new connection until the Auth Agent approves it. Connections are also aggressively recycled, so authorisation stays fresh.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card">
              <h3><PythonLogo size={20} /> Auth Agent sidecar</h3>
              <p>A custom Python gRPC service. It exchanges the pod's certificate for a Keycloak token, caches it, and consults OPA for every connection decision.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Identity chain</span>
            <h2 className="section-title">Certificate → token → decision</h2>
            <p className="lead">
              Identity is bootstrapped from PKI, not passwords. cert-manager mints an X.509 certificate for
              each xApp from the internal CA; Keycloak (backed by PostgreSQL) accepts that certificate as
              the client's credential and answers with a JWT that expires within minutes.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3><CertLogo size={20} /> cert-manager</h3>
              <p>Automated PKI: every xApp Deployment automatically receives a certificate signed by the internal root CA — the pod's cryptographic passport.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3><KeycloakLogo size={20} /> Keycloak</h3>
              <p>The IAM server validates the certificate's Common Name against its registered clients and issues a short-lived JWT with the xApp's authorisation claims.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card">
              <h3><OpaLogo size={20} /> Open Policy Agent</h3>
              <p>The Policy Decision Point. Rego rules map each xApp identity to allowed SDL operations — reader, writer or admin roles — and return allow or deny.</p>
            </div></Reveal>
          </div>
          <div className="callout">
            <div>
              <strong>Freshness by design:</strong>&nbsp; tokens live for around two minutes, and Envoy caps
              every database connection to just under the token lifetime — no connection can outlive the
              credential that authorised it.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Automation</span>
            <h2 className="section-title">Zero-touch onboarding</h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3><KyvernoLogo size={20} /> Kyverno policy engine</h3>
              <p>
                A single cluster policy watches the xApp namespace: when a Deployment appears it generates
                the certificate request, and when the pod is created it injects both sidecars and reroutes
                the SDL environment variables — all before the first packet flows.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3><EnvoyLogo size={20} /> Transparent to developers</h3>
              <p>
                From the xApp's point of view nothing changed: it still calls the SDL API it always used.
                Authentication, token refresh, policy checks and enforcement all happen in the injected
                containers around it.
              </p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Request lifecycle</span>
            <h2 className="section-title">What happens on every SDL call</h2>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={LIFECYCLE} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Assessment</span>
            <h2 className="section-title">Strengths &amp; trade-offs</h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal>
              <div className="card" style={{ height: '100%' }}>
                <h3>Strengths</h3>
                <ul className="procon">
                  <li>Enforcement sits right next to the workload — the lowest possible network hop count on the data path.</li>
                  <li>Per-pod isolation: one compromised pod cannot weaken enforcement for the others.</li>
                  <li>Built on standard OIDC/OAuth2 — widely understood, tooled and audited.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card" style={{ height: '100%' }}>
                <h3>Trade-offs</h3>
                <ul className="procon cons">
                  <li>Keycloak is a runtime dependency — every token refresh needs it to be up.</li>
                  <li>Sidecar resource overhead is multiplied across every xApp pod.</li>
                  <li>A stolen JWT can be replayed until it expires — the token lifetime bounds the damage window.</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Page>
  )
}
