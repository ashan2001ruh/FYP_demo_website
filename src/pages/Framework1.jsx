import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import DpepDiagram from '../components/diagrams/DpepDiagram.jsx'
import {
  KeycloakLogo, EnvoyLogo, PythonLogo, CertLogo, KyvernoLogo, OpaLogo, CalicoLogo, WasmLogo,
} from '../components/TechLogos.jsx'

const LIFECYCLE = [
  { title: 'The xApp asks for data', body: 'It calls the Shared Data Layer exactly as it always has. The request is quietly redirected to the Envoy sidecar in the same pod, so the xApp never knows anything changed.' },
  { title: 'Envoy holds the connection', body: 'Nothing is forwarded yet. Envoy buffers the incoming byte stream and hands it to its WebAssembly filter for inspection.' },
  { title: 'WASM reads the actual command', body: 'The filter parses the raw Redis protocol and pulls out three things: which command was issued, which SDL namespace it targets, and which key it touches.' },
  { title: 'The identity is already cached', body: 'Separately and asynchronously, the filter has been fetching a short-lived token from Keycloak using the pod’s own certificate, and keeping it in Envoy’s shared memory.' },
  { title: 'One question to the policy engine', body: 'The command, namespace, key and token are bundled into a single JSON question and sent to the cluster’s Open Policy Agent.' },
  { title: 'The policy engine answers', body: 'OPA checks the token’s signature against Keycloak’s published keys, checks it has not expired, then tests the request against its Rego rules. The answer is allow or deny.' },
  { title: 'Allowed traffic is tunnelled out', body: 'Envoy wraps the approved command in a mutual-TLS tunnel and sends it to a second Envoy standing in front of the database. A denial ends the connection with 403 Forbidden instead.' },
  { title: 'The database sees plain traffic', body: 'The ingress Envoy proves both ends of the tunnel are who they claim to be, unwraps the command and passes it to Redis over the pod’s internal interface. The reply travels the same route back.' },
]

export default function Framework1() {
  return (
    <Page title="Framework 1: Localized PEP">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-teal">FRAMEWORK 1 · DECENTRALIZED PEP (D-PEP)</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              Every pod <span className="accent">guards its own door</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Instead of funnelling all traffic through one checkpoint, this design gives every xApp its own
              enforcement point. Decisions are made at the moment a request is born, inside the pod that
              created it, before a single byte reaches the cluster network.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Topology</span>
            <h2 className="section-title">Two proxies, no agent</h2>
            <p className="lead">
              The xApp pod holds just two containers: the application and an Envoy sidecar. A second Envoy sits
              in front of the database to terminate the encrypted tunnel. There is no separate authentication
              agent in this framework; the Envoy sidecar does that work itself, inside a WebAssembly sandbox.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <DpepDiagram />
            </div>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><PythonLogo size={20} /> xApp container</h3>
              <p>The application, completely untouched. Its data calls are transparently redirected to the sidecar, so developers write no security code at all.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><EnvoyLogo size={20} /> Envoy sidecar the PEP</h3>
              <p>Intercepts the data stream, holds it, asks for a decision, and either forwards it through an encrypted tunnel or refuses it outright.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card" style={{ height: '100%' }}>
              <h3><EnvoyLogo size={20} /> Envoy ingress proxy</h3>
              <p>The second proxy, standing in front of Redis. It ends the mutual-TLS tunnel, checks the caller's certificate, and hands plain traffic to the database.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">The distinctive part</span>
            <h2 className="section-title">A WebAssembly filter that understands the database</h2>
            <p className="lead">
              A proxy that only sees "a connection from pod X" cannot enforce meaningful rules. This framework
              extends Envoy with a custom filter compiled to WebAssembly, running in the sandbox Envoy provides
              for exactly this purpose, so the enforcement logic is not hard-coded into the proxy and can be
              changed without replacing it.
            </p>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><WasmLogo size={20} /> What the filter does</h3>
              <p>
                It reads the raw database protocol and extracts the command, the target namespace and the key.
                That is what turns "someone is connecting" into "this xApp wants to write to this namespace",
                a question the policy engine can actually answer.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><KeycloakLogo size={20} /> Where the identity comes from</h3>
              <p>
                The same filter fetches the xApp's token from Keycloak in the background and caches it in
                memory the proxy shares across its worker threads, so almost no request pays the cost of a
                token fetch.
              </p>
            </div></Reveal>
          </div>
          <div className="callout">
            <div>
              <strong>A real engineering detail:</strong>&nbsp; Envoy runs a multi-threaded event loop, and each
              thread has its own isolated WebAssembly instance. Several threads could try to refresh the cached
              token at once. The implementation uses atomic compare-and-swap operations to update the shared
              memory safely, so the token is refreshed once without ever pausing the data path.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Defence in depth</span>
            <h2 className="section-title">Closing the shortcut around the proxy</h2>
            <p className="lead">
              A Kubernetes cluster is flat by default: any pod can open a connection to any other. A
              compromised xApp could therefore ignore its own sidecar and talk to the database directly. Layer 7
              enforcement alone does not stop that, so the framework adds a network layer beneath it.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><CalicoLogo size={20} /> Calico network policy</h3>
              <p>
                Policies are compiled down into kernel-level packet rules. Traffic from the xApp namespace to the
                database's plain port is dropped outright; only the encrypted port is reachable, and only trusted
                platform components keep their direct paths.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><CertLogo size={20} /> Certificates on both ends</h3>
              <p>
                cert-manager issues every xApp a certificate signed by the internal root authority. Both ends of
                the tunnel present one, and the connection is pinned to modern TLS versions so it cannot be
                downgraded to something weaker.
              </p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card" style={{ height: '100%' }}>
              <h3><KyvernoLogo size={20} /> Kyverno injection</h3>
              <p>
                Kyverno intercepts each new pod at the Kubernetes admission stage and rewrites its specification
                to add the sidecar and mount the certificate, all before the pod is ever created.
              </p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Request lifecycle</span>
            <h2 className="section-title">What happens on a single data request</h2>
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
                  <li>The fastest of the three by a wide margin a mean of 4.65 ms per request, and the most consistent timing.</li>
                  <li>No shared checkpoint to queue behind, so performance holds up as the number of xApps grows.</li>
                  <li>Enforcement failure is contained: one compromised pod cannot weaken any other pod's protection.</li>
                  <li>Built on ordinary OpenID Connect, which operators already know how to run and audit.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card" style={{ height: '100%' }}>
                <h3>Trade-offs</h3>
                <ul className="procon cons">
                  <li>Highest memory footprint of the three: a full proxy plus its WebAssembly module is duplicated into every single pod.</li>
                  <li>Keycloak must be reachable for token refreshes, so a central identity service remains on the critical path.</li>
                  <li>The shared policy engine eventually becomes the limiting factor as request volume climbs.</li>
                  <li>A stolen token can be replayed until it expires exactly as in Framework 2, since both share the same Keycloak identity model. The short token lifetime is what bounds the damage.</li>
                </ul>
              </div>
            </Reveal>
          </div>
          <div className="callout">
            <div>
              <OpaLogo size={16} />&nbsp; <strong>Where the policy lives:</strong>&nbsp; enforcement is distributed
              into every pod, but the decision itself stays central: one Open Policy Agent serves the whole
              cluster. That is the exact mirror image of Framework 2, where enforcement is central and the policy
              engine sits next to the data.
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
