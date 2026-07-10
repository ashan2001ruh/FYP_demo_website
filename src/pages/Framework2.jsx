import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import StepFlow from '../components/StepFlow.jsx'
import FortressDiagram from '../components/diagrams/FortressDiagram.jsx'

const LIFECYCLE = [
  { title: 'Initiation', body: 'The xApp executes a database command (e.g. MSET) against what it believes is the DBaaS.' },
  { title: 'Interception', body: 'Traffic is routed to 127.0.0.1:6379, where the Egress Ambassador — a Python sidecar — catches the raw RESP bytes.' },
  { title: 'Encapsulation', body: 'The Ambassador retrieves its cached Keycloak JWT (obtained via client credentials + mTLS), Base64-encodes the TCP payload into an HTTP POST body, and sends it to secure-dbaas-service.ricplt.svc.cluster.local:8080.' },
  { title: 'Authorization', body: 'Envoy — running inside the DBaaS pod — intercepts the request and issues an ext_authz gRPC check to the co-located OPA on localhost:9191, forwarding the request body for inspection.' },
  { title: 'ABAC validation', body: 'OPA decodes the JWT and the Base64 Redis payload. It verifies the requested operation matches the sdl_ops and x_sdl_action claims in the token. Handshake commands (PING, HELLO, COMMAND, INFO, QUIT) are permitted for any valid token.' },
  { title: 'Translation', body: 'On a 200 OK from OPA, Envoy routes the envelope to the Flask Protocol Translator on :9090, which strips the HTTP layer and recovers the raw TCP payload.' },
  { title: 'Execution', body: 'The Translator pushes the bytes to Redis on the pod\'s own 127.0.0.1:6379. The response travels back up the same chain to the xApp.' },
]

export default function Framework2() {
  return (
    <Page title="Framework 2 — Centralized PEP">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-purple">FRAMEWORK 2</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              Centralized PEP — <span style={{ color: 'var(--purple)' }}>the Zero Trust Fortress</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Enforcement moves to the data. The Policy Enforcement Point is injected directly into the
              DBaaS pod, enabling deep packet inspection of every Redis command — with no source-code
              changes to xApps or Redis.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Topology</span>
            <h2 className="section-title">The Fortress pattern</h2>
            <p className="lead">
              The standard OSC RIC DBaaS StatefulSet is patched to run three security containers alongside
              Redis. On the client side, each xApp pod carries only a lightweight Egress Ambassador.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <FortressDiagram />
            </div>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3>Egress Ambassador (xApp side)</h3>
              <p>pasindujanith/egress-ambassador:v2. Intercepts raw RESP traffic on 127.0.0.1:6379, wraps it into a Base64 HTTP envelope, attaches the cached Keycloak JWT as a Bearer token, and ships it across the cluster network.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3>Fortress containers (DBaaS side)</h3>
              <p>Envoy v1.28.0 gateway on :8080 → OPA 0.61.0-envoy on :9191 → Flask Protocol Translator (pasindujanith/redis-translator:v1) on :9090 → Redis on localhost:6379. Four containers, one pod: <code>statefulset-ricplt-dbaas-server-0&nbsp;&nbsp;4/4&nbsp;&nbsp;Running</code>.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Policy</span>
            <h2 className="section-title">Deep payload inspection in Rego</h2>
            <p className="lead">
              Unlike Framework 1, OPA sees the actual database command. The policy decodes both the JWT and
              the Base64-wrapped RESP payload, then requires the operation inside the payload to match the
              token's claims.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <CodeBlock title="fortress-opa-policy.yaml — policy.rego (excerpt)">{`package envoy.authz

# 1. Decode JWT from the Authorization header
decoded_token = payload {
    auth_header := input.attributes.request.http.headers.authorization
    startswith(auth_header, "Bearer ")
    jwt := substring(auth_header, 7, -1)
    [_, payload, _] := io.jwt.decode(jwt)
}

# 2. Decode the Base64-wrapped Redis payload
redis_payload = decoded_body {
    raw_body := input.attributes.request.http.body
    decoded_body := base64.decode(raw_body)
}

# RULE 1: Redis handshakes allowed for any valid token
allow {
    decoded_token
    handshake_commands := ["PING", "HELLO", "COMMAND", "INFO", "QUIT"]
    contains(upper_payload, handshake_commands[_])
}

# RULE 2: ABAC write — claim AND payload must both say write
allow {
    contains(token_ops, "write")
    contains(token_action, "SET")
    contains(upper_payload, "SET")
}

# RULE 3: ABAC read — GET or MGET
allow {
    contains(token_ops, "read")
    is_read_command(upper_payload)
}`}</CodeBlock>
          </Reveal>
          <Reveal delay={0.1}>
            <CodeBlock title="fortress-envoy-config — request body forwarded to OPA">{`http_filters:
- name: envoy.filters.http.ext_authz
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.ext_authz.v3.ExtAuthz
    transport_api_version: V3
    grpc_service:
      envoy_grpc:
        cluster_name: opa_grpc_cluster
    with_request_body:
      max_request_bytes: 16384
      allow_partial_message: false
      pack_as_bytes: true`}</CodeBlock>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Deployment</span>
            <h2 className="section-title">Patching the fortress into place</h2>
            <p className="lead">
              Rather than editing the OSC RIC manifests, the three containers are merged into the running
              StatefulSet with a strategic patch, and a new Service routes ambassadors to Envoy instead of
              Redis directly.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <CodeBlock title="Applying the fortress">{`# New service: selects the DBaaS StatefulSet but targets Envoy :8080
sudo kubectl apply -f secure-dbaas-service.yaml

# Merge Envoy + OPA + Translator into the running StatefulSet
sudo kubectl patch statefulset statefulset-ricplt-dbaas-server \\
  -n ricplt --patch-file statefulset-patch.yaml

# Verify all 4 containers are up
sudo kubectl get pods -n ricplt | grep dbaas
# statefulset-ricplt-dbaas-server-0   4/4   Running`}</CodeBlock>
          </Reveal>
          <Reveal delay={0.1}>
            <CodeBlock title="Kyverno — ambassador injection (excerpt)">{`- name: egress-ambassador
  image: pasindujanith/egress-ambassador:v2
  env:
    - name: XAPP_NAME
      valueFrom:
        fieldRef:
          fieldPath: metadata.labels['app']
    # TARGET THE NEW SECURE SERVICE
    - name: TARGET_GATEWAY_URL
      value: "http://secure-dbaas-service.ricplt.svc.cluster.local:8080/redis"`}</CodeBlock>
          </Reveal>
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
          <div className="callout">
            <div>
              <strong>Why "centralized"?</strong>&nbsp; One enforcement point guards the data for every xApp
              in the cluster. The trade-off versus Framework 1: per-command ABAC granularity and a single
              policy surface, at the cost of putting an HTTP round-trip and translation hop on the data path.
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
