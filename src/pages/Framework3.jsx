import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import StepFlow from '../components/StepFlow.jsx'
import TrustTriangle from '../components/diagrams/TrustTriangle.jsx'
import VonNetworkDiagram from '../components/diagrams/VonNetworkDiagram.jsx'
import VcSigningAnimation from '../components/diagrams/VcSigningAnimation.jsx'
import RuntimeFlowF3 from '../components/diagrams/RuntimeFlowF3.jsx'

const IDENTIFIERS = [
  ['RIC Endorser DID (did:sov)', 'KewdxLKBU9Fgu5aac8PH4R'],
  ['Credential schema', 'KewdxLKBU9Fgu5aac8PH4R:2:sdl-access-credential:1.0'],
  ['Credential definition', 'KewdxLKBU9Fgu5aac8PH4R:3:CL:8:sdl-access-v1'],
  ['RIC issuer DID (did:key)', 'did:key:z6Mkm8GwKYg4W7zFzos9eK8RQNvgufA8ymvHfjdKW97irKZt'],
  ['Auth Agent image', 'ashank2001/auth-agent:v2'],
  ['Identity agent', 'ACA-Py py3.9-0.10.4 · askar wallet on PostgreSQL 14'],
  ['VC signing library', 'DIDKit v0.3.3 (Ed25519Signature2020)'],
  ['Ledger', 'bcgov/von-network · 4 Indy validators + webserver :9000'],
  ['Credential type', 'SDLAccessCredential · 30-day validity'],
  ['VP proof options', 'proofPurpose: authentication · domain: ric.internal · per-request challenge'],
]

const ONBOARDING = [
  { title: 'Generate the xApp sov DID', body: 'The provisioner calls ACA-Py\'s /wallet/did/create (method: sov, key type: ed25519) to derive an Indy DID and verkey for the xApp.' },
  { title: 'Anchor it on the ledger', body: 'The DID/verkey pair is registered on Von Network via the webserver\'s /register endpoint — the xApp now exists on the same ledger that anchors the RIC.' },
  { title: 'Generate the did:key signing pair', body: 'DIDKit generates a separate Ed25519 keypair for the xApp, used only for signing Verifiable Presentations at runtime — kept distinct from the ledger identity.' },
  { title: 'Build and sign the VC', body: 'A W3C SDLAccessCredential embedding xapp_name, allowed_namespaces, permissions, schema_id, cred_def_id and both DIDs is signed with the RIC issuer\'s DIDKit key (Ed25519Signature2020, 30-day expiry).' },
  { title: 'Verify immediately', body: 'The signed VC is verified on the spot — fail fast if signing produced anything invalid.' },
  { title: 'Test a throwaway VP', body: 'A test Verifiable Presentation is constructed and verified end-to-end, catching verification-method mismatches before they become runtime outages.' },
  { title: 'Write the wallet Secret', body: 'did.json, vc.json, issuer.json (public data only) and genesis.txn are packed into the xapp-wallet-<name> Secret in ricxapp — before the pod is ever scheduled.' },
  { title: 'Install & inject', body: 'dms_cli installs the xApp; Kyverno mutates the pod, injecting Envoy + Auth Agent v2 and mounting the wallet read-only at /wallet.' },
]

const LIFECYCLE = [
  { title: 'Startup verification', body: 'On boot, the Auth Agent loads the wallet and verifies the VC\'s signature, issuer DID, RIC sov DID chain and xApp name. If anything fails, every request is denied without ever contacting OPA.' },
  { title: 'Interception', body: 'The xApp executes an SDL command; Envoy\'s ext_authz filter holds the TCP connection and sends a CheckRequest to the Auth Agent on :50051.' },
  { title: 'Claim extraction', body: 'The agent extracts allowed_namespaces and permissions from the verified VC and rejects the request if valid_until has passed.' },
  { title: 'Proof of possession', body: 'A fresh Verifiable Presentation is built over the VC and signed with the xApp\'s private JWK against a per-request challenge nonce and domain ric.internal — proving the sidecar holds the key, not just a copy of the VC JSON.' },
  { title: 'Local pre-check', body: 'A cheap namespace/permission check short-circuits obviously-denied requests before OPA is consulted.' },
  { title: 'ABAC decision', body: 'The agent forwards x-app-id and x-sdl-action (plus VC-derived headers) to OPA over gRPC; OPA evaluates the Rego role table and answers allow/deny.' },
  { title: 'Enforcement', body: 'The decision returns to Envoy as the CheckResponse: ALLOW proxies the connection to Redis, DENY drops it with 403 Forbidden.' },
]

const LIMITATIONS = [
  <><strong>Von Network runs outside Kubernetes.</strong> The native von-network-k8s.yaml deployment was abandoned: each node generates its genesis file at startup, and pod scheduling / DNS timing made generation race between the 4 validators, so the pool never reached consensus. Docker Compose on the host is the working testbed.</>,
  <><strong>DIDKit signs the VCs, not ACA-Py.</strong> ACA-Py 0.10.4 with the askar wallet does not expose the /vc/credentials/issue W3C endpoint, so W3C signing is done with DIDKit using a did:key issuer bound to the RIC's sov DID.</>,
  <><strong>The issuer keypair is testbed-fresh.</strong> ric-issuer.json is regenerated whenever deleted; production would persist it as the RIC's permanent signing identity and rotate it deliberately.</>,
  <><strong>Two DIDs per xApp, by design.</strong> The ledger-anchored did:sov proves registration; the separate did:key proves possession at runtime via VP signing.</>,
  <><strong>No DIDComm credential exchange.</strong> The signed VC is delivered out-of-band by writing it directly into the wallet Secret during provisioning, not via issuer-to-holder protocol messages.</>,
  <><strong>OPA still runs the JWT-era Rego.</strong> The policy is the same static xapp_roles / role_permissions table keyed on x-app-id and x-sdl-action. The VC-derived headers (x-vc-verified, x-permissions, x-allowed-namespaces, x-ric-sov-did) pass through unused — VC claims are enforced only by the agent's local pre-check. Making OPA evaluate them directly is future work.</>,
]

export default function Framework3() {
  return (
    <Page title="Framework 3 — DID/VC Zero Trust">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="framework-tag tag-amber">FRAMEWORK 3 · THE STAR</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              DID/VC Zero Trust — <span className="accent">decentralized identity for xApps</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              The centralized IdP disappears from the runtime path. The RIC issues each xApp a
              cryptographically signed W3C Verifiable Credential once, at onboarding; at runtime the sidecar
              proves possession with a signed Verifiable Presentation — no network round-trip to any
              identity server.
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
              Trust is rooted in the Hyperledger Indy ledger (which anchors the RIC's DID) and in Ed25519
              signatures — not in a live session with an identity server.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <TrustTriangle />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Ledger-anchored identifiers</span>
            <h2 className="section-title">The real values on the testbed</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="table-scroll" style={{ marginTop: 24 }}>
              <table className="spec-table">
                <tbody>
                  {IDENTIFIERS.map(([k, v]) => (
                    <tr key={k}>
                      <th>{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <CodeBlock title="Publishing the schema + credential definition via ACA-Py admin API">{`curl -X POST http://localhost:3001/schemas -H "Content-Type: application/json" -d '{
  "schema_name": "sdl-access-credential",
  "schema_version": "1.0",
  "attributes": [
    "xapp_name", "xapp_version", "allowed_namespaces", "permissions",
    "ric_realm", "ric_issuer_sov_did", "sov_did", "issued_at", "valid_until"
  ]
}'
# => schema_id: KewdxLKBU9Fgu5aac8PH4R:2:sdl-access-credential:1.0

curl -X POST http://localhost:3001/credential-definitions -d '{
  "schema_id": "KewdxLKBU9Fgu5aac8PH4R:2:sdl-access-credential:1.0",
  "tag": "sdl-access-v1",
  "support_revocation": false
}'
# => cred_def_id: KewdxLKBU9Fgu5aac8PH4R:3:CL:8:sdl-access-v1`}</CodeBlock>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Root of trust</span>
            <h2 className="section-title">Von Network — the Indy ledger</h2>
            <p className="lead">
              A 4-node Hyperledger Indy pool anchors every DID in the architecture. It runs as a Docker
              Compose stack on the Ubuntu host — outside the Kubernetes cluster — after the in-cluster
              deployment proved unable to reach consensus (genesis-file generation raced across pods).
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <VonNetworkDiagram />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <CodeBlock title="Bootstrapping the ledger and the RIC's endorser identity">{`# On the Ubuntu host (outside K8s)
git clone https://github.com/bcgov/von-network.git && cd von-network
./manage build && ./manage start --logs

# Fetch genesis transactions (mounted into ACA-Py, copied into every wallet)
curl http://<HOST_IP>:9000/genesis -o ric-genesis.txn

# Register ACA-Py's DID with ENDORSER role
curl -X POST http://<HOST_IP>:9000/register \\
  -H "Content-Type: application/json" \\
  -d '{"did": "KewdxLKBU9Fgu5aac8PH4R", "verkey": "<verkey>", "role": "ENDORSER"}'`}</CodeBlock>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Credential issuance</span>
            <h2 className="section-title">Signing the SDLAccessCredential</h2>
            <p className="lead">
              The RIC's DIDKit-generated did:key issuer identity — bound to its Indy sov DID and persisted as
              the <code>ric-issuer-secret</code> — signs every xApp credential with Ed25519Signature2020.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <VcSigningAnimation />
            </div>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card">
              <h3>What the credential asserts</h3>
              <p>
                The credentialSubject carries the xApp's did:key id, its <code>sov_did</code>, the{' '}
                <code>allowed_namespaces</code> and <code>permissions</code> it was onboarded with, the{' '}
                <code>ric_issuer_sov_did</code> trust anchor, the schema and cred-def ids, and a 30-day{' '}
                <code>valid_until</code> window.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card">
              <h3>Wallet Secret contents</h3>
              <p>
                <code>did.json</code> (xApp DIDs + private JWK) · <code>vc.json</code> (the signed credential)
                · <code>issuer.json</code> (public issuer data only — the agent refuses wallets containing an
                issuer private key) · <code>genesis.txn</code> (ledger genesis). Mounted read-only at{' '}
                <code>/wallet</code>.
              </p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Onboarding pipeline</span>
            <h2 className="section-title">One command, eight guarantees</h2>
            <p className="lead">
              <code>secure_xapp_onboard.sh</code> chains image build, dms_cli onboarding, wallet provisioning
              and install — provisioning always lands <em>before</em> the pod is scheduled.
            </p>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={ONBOARDING} interval={380} />
          </div>
          <Reveal delay={0.05}>
            <CodeBlock title="End-to-end onboarding">{`./secure_xapp_onboard.sh ~/custom-sdl-xapp ~/custom-sdl-xapp/descriptor \\
  sdl-xapp 1.0.1 ricxapp e2-metrics,kpi-store read,write

# provisioner output
# ║  xApp Name    : ricxapp-sdl-xapp
# ║  Wallet Secret: xapp-wallet-ricxapp-sdl-xapp
# ║  Proof        : Ed25519Signature2020 ✓ (real)`}</CodeBlock>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Runtime</span>
            <h2 className="section-title">Every request re-proves identity</h2>
            <p className="lead">
              Auth Agent v2 keeps the same ext_authz gRPC contract with Envoy as Framework 1 but replaces
              Keycloak verification with DID/VC verification — VC checks at startup, a fresh VP on every
              CheckRequest.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <RuntimeFlowF3 />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <CodeBlock title="agent.py — per-request proof of DID ownership (excerpt)">{`nonce = f"req-{XAPP_NAME}-{int(time.time())}"

proof_options = {
    "type": "Ed25519Signature2020",
    "verificationMethod": xapp_vm,          # did:key:...#fragment
    "proofPurpose": "authentication",
    "challenge": nonce,
    "domain": "ric.internal",
}

signed_vp = didkit.issue_presentation(vp, proof_options, xapp_jwk)
result = didkit.verify_presentation(signed_vp,
    {"challenge": nonce, "domain": "ric.internal"})
# errors => deny_response("DID ownership verification failed")`}</CodeBlock>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={LIFECYCLE} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Honest engineering</span>
            <h2 className="section-title">Known limitations &amp; testbed decisions</h2>
          </Reveal>
          <Reveal delay={0.06}>
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
