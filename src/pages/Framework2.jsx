import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import FortressDiagram from '../components/diagrams/FortressDiagram.jsx'
import { KeycloakLogo, EnvoyLogo, PythonLogo, OpaLogo, RedisLogo } from '../components/TechLogos.jsx'

const LIFECYCLE = [
  { title: 'Initiation', body: 'The xApp executes a database command exactly as it always has — it is unaware anything changed.' },
  { title: 'Interception', body: 'The Egress Ambassador sidecar catches the raw database traffic on the pod\'s local interface.' },
  { title: 'Encapsulation', body: 'The Ambassador seals the traffic into a signed envelope: the raw bytes are encoded into a message body and the xApp\'s cached Keycloak token is attached as proof of identity.' },
  { title: 'Gateway', body: 'The envelope travels across the cluster to the central enforcement point — an Envoy gateway running inside the DBaaS pod itself.' },
  { title: 'Deep inspection', body: 'Envoy hands the request to the co-located OPA, which opens the envelope: it decodes the token, decodes the actual database command, and checks that the operation requested matches the capabilities in the token\'s claims. Harmless protocol handshakes are permitted automatically.' },
  { title: 'Translation', body: 'Approved envelopes go to the Protocol Translator, which strips the wrapping and restores the original raw database traffic.' },
  { title: 'Execution', body: 'The command reaches Redis over the pod\'s internal interface — the database itself is never exposed to the cluster network. The response travels back up the same chain.' },
]

export default function Framework2() {
  return (
    <Page title="Framework 2 — Centralized PEP">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-teal">FRAMEWORK 2 · Centralized PEP</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              One enforcement surface, <span className="accent">at the data itself</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Instead of replicating enforcement into every xApp pod, this framework consolidates it at a
              single point directly in front of the database — enabling deep inspection of every actual
              database command, with no source-code changes to xApps or Redis.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Topology</span>
            <h2 className="section-title">The enforcement point moves to the DBaaS pod</h2>
            <p className="lead">
              The standard RIC database pod is extended with three security containers — Envoy, OPA and a
              protocol translator — running right beside Redis. On the client side, each xApp pod carries
              only a lightweight ambassador.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <FortressDiagram />
            </div>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3><PythonLogo size={20} /> Egress Ambassador (xApp side)</h3>
              <p>
                A small Python sidecar that intercepts the xApp's database traffic, obtains its identity
                token from Keycloak using the pod's certificate, and forwards each request — sealed and
                authenticated — to the central gateway.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3><RedisLogo size={20} /> The guarded database (DBaaS side)</h3>
              <p>
                Envoy is the only way in; OPA inspects what each caller is actually trying to do; the
                translator restores approved traffic; and Redis listens only on the pod's internal
                interface, unreachable from the cluster network.
              </p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">What makes it different</span>
            <h2 className="section-title">Command-level authorisation</h2>
            <p className="lead">
              Because the enforcement point sits in front of the database, the policy engine sees the
              real database operation — not just who is connecting. A caller whose token only grants read
              access is stopped the moment it attempts a write, even mid-connection.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3><KeycloakLogo size={20} /> Identity</h3>
              <p>Keycloak still issues short-lived tokens against certificate identities — the identity chain is shared with Framework 1.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3><OpaLogo size={20} /> Deep inspection</h3>
              <p>OPA decodes both the token and the wrapped database command, and requires the operation to match the caller's granted capabilities.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card">
              <h3><EnvoyLogo size={20} /> Single audit point</h3>
              <p>Every SDL access in the cluster passes one gateway — one place to log, one policy to update, one surface to audit.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Request lifecycle</span>
            <h2 className="section-title">Seven steps from xApp to Redis</h2>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={LIFECYCLE} />
          </div>
        </div>
      </section>

      <section className="section tint">
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
                  <li>Command-level ABAC: the policy sees the actual database operation, not just the connection.</li>
                  <li>Reduced per-pod overhead — xApps carry one lightweight ambassador instead of a full enforcement stack.</li>
                  <li>Single enforcement surface: easier to audit, log and update policy in one place.</li>
                  <li>The database is completely hidden from the cluster network.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card" style={{ height: '100%' }}>
                <h3>Trade-offs</h3>
                <ul className="procon cons">
                  <li>An additional network hop and translation step sit on every data-path request.</li>
                  <li>The central gateway can become a throughput bottleneck under load.</li>
                  <li>The enforcement point is a critical dependency — if it fails, all SDL access fails with it.</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Page>
  )
}
