import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import CpepDiagram from '../components/diagrams/CpepDiagram.jsx'
import {
  KeycloakLogo, EnvoyLogo, PythonLogo, OpaLogo, RedisLogo, CalicoLogo, CertLogo,
} from '../components/TechLogos.jsx'

const LIFECYCLE = [
  { title: 'The xApp asks for data', body: 'It issues an ordinary database command. The traffic is redirected to the Egress Ambassador sidecar listening on the pod’s own loopback interface.' },
  { title: 'The ambassador seals it', body: 'The raw command bytes are encoded and packed inside an ordinary web request, with the xApp’s cached Keycloak token attached as proof of who is asking.' },
  { title: 'It crosses the cluster', body: 'The sealed envelope travels over a mutually authenticated connection to one address: the gateway standing in front of the database.' },
  { title: 'The gateway opens the door only partly', body: 'Envoy verifies the caller’s certificate against the internal authority, then pauses and asks the policy engine sitting beside it — over the pod’s own loopback, so the question never crosses the network.' },
  { title: 'The policy engine unwraps everything', body: 'It verifies the token’s signature against Keycloak’s published keys, checks the expiry, decodes the encoded payload to recover the real database command, and evaluates the whole picture against its rules.' },
  { title: 'Translation back to the database', body: 'On approval, the envelope goes to a small translator service that strips the web layer away and reconstructs the original raw command.' },
  { title: 'Execution and return', body: 'The command reaches Redis over the pod’s internal interface — the database itself is never exposed to the cluster network. The reply travels back up the same chain and is unwrapped by the ambassador.' },
]

export default function Framework2() {
  return (
    <Page title="Framework 2 — Centralized PEP">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-teal">FRAMEWORK 2 · CENTRALIZED PEP (C-PEP)</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              One gate, <span className="accent">right in front of the data</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              The first of the three designs to be built. Rather than replicating enforcement into every pod, it
              fortifies the database itself: the checkpoint, the policy engine and the translator all live inside
              the database pod, and every xApp in the cluster passes through them.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Topology</span>
            <h2 className="section-title">A light client, a fortified database</h2>
            <p className="lead">
              The xApp side stays deliberately thin — a single small sidecar whose only job is to seal requests
              and attach identity. All the heavy lifting happens at the other end, where three security
              containers were added alongside Redis without altering the database itself.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <CpepDiagram />
            </div>
          </Reveal>
          <div className="grid-4" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><PythonLogo size={20} /> Egress Ambassador</h3>
              <p>A small custom Python sidecar in the xApp pod. Fetches and caches the identity token, catches the raw database traffic, and seals it into a web request.</p>
            </div></Reveal>
            <Reveal delay={0.07}><div className="card" style={{ height: '100%' }}>
              <h3><EnvoyLogo size={20} /> Envoy gateway</h3>
              <p>The single entrance to the database pod. Ends the mutually authenticated connection and refuses to forward anything before the policy engine has spoken.</p>
            </div></Reveal>
            <Reveal delay={0.14}><div className="card" style={{ height: '100%' }}>
              <h3><OpaLogo size={20} /> Policy engine, co-located</h3>
              <p>Runs in the same pod as the database — placing the decision point with the resource it protects. It decodes the payload and judges the real command.</p>
            </div></Reveal>
            <Reveal delay={0.21}><div className="card" style={{ height: '100%' }}>
              <h3><RedisLogo size={20} /> Protocol translator</h3>
              <p>Redis speaks its own protocol, not the web. This small service unwraps approved requests back into raw database traffic and hands them to Redis over localhost.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">The distinctive part</span>
            <h2 className="section-title">The decision point sits with the resource</h2>
            <p className="lead">
              This is the structural inversion of Framework 1. There, enforcement is spread across every pod while
              one shared policy engine answers all questions. Here, enforcement is concentrated at one gate — and
              the policy engine lives right beside the database it defends, answering over loopback rather than
              over the network.
            </p>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><KeycloakLogo size={20} /> Identity, shared with Framework 1</h3>
              <p>
                cert-manager issues each xApp a certificate; Keycloak matches the certificate's name against its
                registered clients and returns a short-lived token carrying that xApp's permitted namespaces and
                operations as claims.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><CalicoLogo size={20} /> Only one way in</h3>
              <p>
                Network policy narrows the database pod's reachable surface to the gateway's port alone. Trusted
                platform components keep their own direct paths, but an xApp has no route that avoids the gate.
              </p>
            </div></Reveal>
          </div>
          <div className="callout">
            <div>
              <strong>One place to look:</strong>&nbsp; because every request in the cluster passes the same
              checkpoint, there is a single place to log, a single policy to update, and a single surface to audit.
              That is a real operational advantage — and it is also the design's central weakness.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Request lifecycle</span>
            <h2 className="section-title">Seven steps from xApp to database</h2>
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
                  <li>The lightest memory footprint of the three — one shared gateway instead of a full proxy in every pod.</li>
                  <li>A single enforcement surface: one place to audit, log and update policy.</li>
                  <li>The database is entirely hidden from the cluster network; nothing reaches it except through the gate.</li>
                  <li>Deep inspection of the decoded command, so authorisation is about what was asked, not merely who asked.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card" style={{ height: '100%' }}>
                <h3>Trade-offs</h3>
                <ul className="procon cons">
                  <li>By far the slowest: a mean of 36.94 ms per request, roughly eight times Framework 1.</li>
                  <li>Timing is also the least predictable, because every request queues behind traffic from every other xApp.</li>
                  <li>The gateway becomes a bottleneck under load, with processor demand climbing steeply as xApps multiply.</li>
                  <li>It is a single point of failure — if the gate stops, all data access stops with it.</li>
                </ul>
              </div>
            </Reveal>
          </div>
          <div className="callout warn">
            <div>
              <strong>Why predictability matters here:</strong>&nbsp; the RIC's control loops must be dimensioned
              for the worst case, not the average. A request's delay in this design depends on how busy every
              other xApp happens to be at that instant — something the requesting xApp cannot influence or predict.
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
