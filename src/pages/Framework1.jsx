import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import StepFlow from '../components/StepFlow.jsx'
import PodDiagramF1 from '../components/diagrams/PodDiagramF1.jsx'

const LIFECYCLE = [
  { title: 'Interception', body: 'The xApp issues an SDL GET/SET. Kyverno has rewritten DBAAS_SERVICE_HOST to 127.0.0.1, so the raw Redis TCP connection lands on the Envoy sidecar listener at 127.0.0.1:6379.' },
  { title: 'Authorization check', body: 'Envoy\'s network-level ext_authz filter pauses the connection and sends a gRPC CheckRequest to the Auth Agent on localhost:50051.' },
  { title: 'Token enforcement', body: 'The Auth Agent checks its cached JWT. If missing or within 10 s of expiry, it requests a fresh token from Keycloak\'s ric-realm using the client-credentials grant, authenticated with the xApp\'s cert-manager-issued mTLS certificate.' },
  { title: 'Policy query', body: 'The agent builds a synthetic HTTP context — headers x-app-id and x-sdl-action — and forwards it to OPA\'s gRPC endpoint at opa-service.ricplt.svc.cluster.local:9191.' },
  { title: 'ABAC decision', body: 'OPA evaluates the Rego role table (reader / writer / admin) for the xApp identity and requested action, returning ALLOW or DENY.' },
  { title: 'Enforcement', body: 'The decision travels back as the CheckResponse. On ALLOW, Envoy\'s tcp_proxy forwards the connection to service-ricplt-dbaas-tcp.ricplt.svc.cluster.local:6379; on DENY the connection is dropped.' },
]

export default function Framework1() {
  return (
    <Page title="Framework 1 — Localized PEP">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-teal">FRAMEWORK 1</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              Localized PEP — <span className="accent">Keycloak / JWT sidecars</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              The Policy Enforcement Point lives inside every xApp pod. Sidecars are injected automatically —
              the xApp code and the DBaaS pod are never modified.
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
              Kyverno mutates every pod created in <code>ricxapp</code>, adding an Envoy proxy and an Auth
              Agent beside the xApp container.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <PodDiagramF1 />
            </div>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3>xApp container</h3>
              <p>Hosts the unmodified xApp logic and its SDL API calls. It believes it is talking directly to the DBaaS — the environment override points it at localhost instead.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3>Envoy sidecar</h3>
              <p>envoyproxy/envoy:v1.28.0. Data-plane traffic manager: intercepts the raw SDL TCP stream on 127.0.0.1:6379 and gates it behind an ext_authz check before proxying to Redis.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card">
              <h3>Auth Agent</h3>
              <p>pasindujanith/auth-agent:v1 — a Python gRPC server on :50051. Fetches and caches Keycloak JWTs (2-minute lifetime) and consults OPA for every connection decision.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Phase 1 · PKI</span>
            <h2 className="section-title">cert-manager as the identity mint</h2>
            <p className="lead">
              cert-manager v1.13.2 is the automated PKI engine. An SMO root CA is stored as a cluster secret
              and exposed through a ClusterIssuer, so every xApp Deployment automatically receives an X.509
              mTLS certificate — Zero-Touch identity provisioning.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <CodeBlock title="smo-issuer.yaml — ClusterIssuer backed by the SMO root CA">{`apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: smo-root-ca
spec:
  ca:
    secretName: smo-root-ca-secret`}</CodeBlock>
          </Reveal>
          <div className="callout">
            <div>
              <strong>Zero-Touch chain:</strong>&nbsp; deploy xApp → Kyverno generates a Certificate resource →
              cert-manager mints <code>&lt;xapp&gt;-certs</code> → the Secret is mounted at{' '}
              <code>/etc/xapp-certs</code> → the Auth Agent uses it to authenticate to Keycloak. No developer
              involvement at any step.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Phase 2 · Data plane</span>
            <h2 className="section-title">Envoy interception &amp; token freshness</h2>
            <p className="lead">
              The Envoy listener captures SDL traffic and holds it until the Auth Agent approves. Two timing
              controls keep authorization fresh at the TCP level:
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <CodeBlock title="envoy.yaml — tcp_proxy timing (zerotrust-sidecar-configs ConfigMap)">{`- name: envoy.filters.network.tcp_proxy
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.network.tcp_proxy.v3.TcpProxy
    stat_prefix: egress_tcp
    cluster: real_sdl_cluster
    # Safely drops connection during micro-pauses between loops
    idle_timeout: 0.5s
    # Hard limit to ensure Keycloak token refresh cycles every ~2 mins
    max_downstream_connection_duration: 115s`}</CodeBlock>
          </Reveal>
          <div className="grid-2">
            <Reveal><div className="card">
              <h3>idle_timeout · 0.5 s</h3>
              <p>Long-lived idle Redis connections would let a once-authorized xApp keep access forever. Dropping idle connections forces re-authorization on the next command burst.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3>max_downstream_connection_duration · 115 s</h3>
              <p>Slightly shorter than the 120 s JWT lifetime, guaranteeing no TCP connection outlives the token that authorized it.</p>
            </div></Reveal>
          </div>
          <Reveal delay={0.1}>
            <CodeBlock title="agent.py — Keycloak token fetch (client credentials + mTLS)">{`KEYCLOAK_URL = "https://keycloak.keycloak.svc.cluster.local:8443/realms/ric-realm/protocol/openid-connect/token"
OPA_GRPC_URL = "opa-service.ricplt.svc.cluster.local:9191"
CERT, KEY = "/etc/xapp-certs/tls.crt", "/etc/xapp-certs/tls.key"

res = requests.post(
    KEYCLOAK_URL,
    data={'grant_type': 'client_credentials', 'client_id': XAPP_NAME},
    cert=(CERT, KEY), verify=False)
self.token = res.json().get("access_token")
self.expiry = time.time() + 120   # cached for 2 minutes`}</CodeBlock>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Phase 3 · Control plane</span>
            <h2 className="section-title">Kyverno automation &amp; the OPA role table</h2>
            <p className="lead">
              A single ClusterPolicy, <code>touchless-xapp-security</code>, does all the wiring: it generates
              the mTLS Certificate for each Deployment and injects both sidecars into each pod.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <CodeBlock title="kyverno-automation.yaml — sidecar injection (excerpt)">{`- name: inject-sidecars
  match:
    any:
    - resources:
        kinds: [Pod]
        namespaces: [ricxapp]
  mutate:
    patchStrategicMerge:
      spec:
        containers:
          - (name): "?*"
            env:
              - name: DBAAS_SERVICE_HOST
                value: "127.0.0.1"      # reroute SDL to the sidecar
              - name: DBAAS_SERVICE_PORT
                value: "6379"
          - name: envoy-proxy
            image: envoyproxy/envoy:v1.28.0
          - name: auth-agent
            image: pasindujanith/auth-agent:v1`}</CodeBlock>
          </Reveal>
          <Reveal delay={0.12}>
            <CodeBlock title="policy.rego — the ABAC role table OPA evaluates">{`package envoy.authz
import rego.v1

xapp_roles = {
    "ricxapp-sdl-xapp": ["writer"],
    "ts": ["reader"],
    "rx": ["admin"]
}

role_permissions = {
    "reader": ["GET", "EXISTS"],
    "writer": ["GET", "SET", "DEL"],
    "admin":  ["GET", "SET", "DEL", "FLUSHALL"]
}

default allow := false

allow if {
    xapp_id := input.attributes.request.http.headers["x-app-id"]
    action  := input.attributes.request.http.headers["x-sdl-action"]
    roles := xapp_roles[xapp_id]
    role  := roles[_]
    perms := role_permissions[role]
    perms[_] == action
}`}</CodeBlock>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Request lifecycle</span>
            <h2 className="section-title">What happens on every SDL call</h2>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={LIFECYCLE} />
          </div>
          <div className="callout warn">
            <div>
              <strong>Known limitation:</strong>&nbsp; authorization is connection-level — the agent defaults{' '}
              <code>x-sdl-action</code> to <code>SET</code> when querying OPA. True per-command authorization
              requires inspecting the Redis protocol itself, which is exactly what Framework 2 does.
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
