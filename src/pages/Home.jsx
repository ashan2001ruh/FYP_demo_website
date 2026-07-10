import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import HeroPipeline from '../components/diagrams/HeroPipeline.jsx'

const TECH = [
  'Kubernetes v1.28.11', 'OSC Near-RT RIC', 'Envoy v1.28.0', 'Open Policy Agent',
  'Keycloak', 'cert-manager v1.13.2', 'Kyverno', 'Hyperledger Indy',
  'ACA-Py 0.10.4', 'DIDKit 0.3.3', 'Von Network', 'PostgreSQL',
  'Redis (SDL DBaaS)', 'Python · gRPC', 'Docker Compose', 'Helm 3.14.4',
]

const FRAMEWORKS = [
  {
    to: '/framework-1',
    tag: 'FRAMEWORK 1',
    tagClass: 'tag-teal',
    title: 'Localized PEP — Keycloak / JWT',
    body: 'An Envoy + Auth Agent sidecar pair inside every xApp pod. The agent fetches short-lived JWTs from Keycloak over mTLS and gates each SDL connection through OPA. The database is left untouched.',
    foot: 'Envoy ext_authz · Keycloak client-credentials · OPA Rego',
  },
  {
    to: '/framework-2',
    tag: 'FRAMEWORK 2',
    tagClass: 'tag-purple',
    title: 'Centralized PEP — the Fortress',
    body: 'The enforcement point moves into the DBaaS pod itself: Envoy, OPA and a protocol translator run beside Redis, inspecting every Base64-wrapped RESP command against the JWT claims that carried it.',
    foot: 'DBaaS StatefulSet patch · deep payload inspection · ABAC',
  },
  {
    to: '/framework-3',
    tag: 'FRAMEWORK 3 · THE STAR',
    tagClass: 'tag-amber',
    title: 'DID/VC Zero Trust — Decentralized Identity',
    body: 'No identity server in the runtime path at all. The RIC issues each xApp a W3C Verifiable Credential anchored on a Hyperledger Indy ledger; the sidecar proves possession cryptographically on every request.',
    foot: 'W3C DID/VC · Ed25519 · ACA-Py + DIDKit · Von Network',
  },
]

export default function Home() {
  return (
    <Page title="Home">
      {/* ── hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          >
            <span className="kicker">EE4801 · Final Year Project 2025/2026</span>
            <h1 className="hero-title">
              Zero Trust-Based <span className="accent">IAM Framework</span> for O-RAN Near-RT RIC
            </h1>
            <div className="hero-meta">
              <span>University of Ruhuna · Faculty of Engineering</span>
              <span className="sep">·</span>
              <span>Electrical &amp; Information Engineering</span>
              <span className="sep">·</span>
              <span>Ashan Kasthuriarachchi · Pasindu Janith</span>
            </div>
            <p className="lead">
              Three progressively decentralized architectures that secure the Shared Data Layer (SDL) of the
              O-RAN Near-Real-Time RIC — from centralized JWTs to ledger-anchored verifiable credentials.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
              <Link className="btn btn-primary" to="/framework-3">
                Explore the DID/VC framework →
              </Link>
              <Link className="btn btn-ghost" to="/architecture">
                System architecture
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 26, delay: 0.15 }}
            style={{ marginTop: 48 }}
          >
            <HeroPipeline />
          </motion.div>
        </div>
      </section>

      {/* ── what is this ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">The project</span>
            <h2 className="section-title">Securing the RIC's shared memory</h2>
            <p className="lead">
              In the O-RAN architecture, every xApp reads and writes the Shared Data Layer — a Redis-backed
              database with no identity or access control of its own. This project designs, implements and
              compares three Zero Trust IAM frameworks on a real OSC Near-RT RIC testbed, enforcing
              per-request authentication and attribute-based authorization without modifying a single line
              of xApp or Redis source code.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── tech stack ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Technology stack</span>
            <h2 className="section-title">Built on real infrastructure</h2>
          </Reveal>
          <div className="pill-row" style={{ marginTop: 24 }}>
            {TECH.map((t, i) => (
              <motion.span
                key={t}
                className="badge"
                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.04 }}
              >
                <span className="dot" />
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── framework cards ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Three frameworks</span>
            <h2 className="section-title">One problem, three trust models</h2>
            <p className="lead">
              Each framework was fully implemented and tested on the same RIC cluster. Every page documents
              the real components, manifests and identifiers used.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 30 }}>
            {FRAMEWORKS.map((f, i) => (
              <Reveal key={f.to} delay={i * 0.1}>
                <Link to={f.to} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <motion.div className="card" whileHover={{ y: -5 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span className={`framework-tag ${f.tagClass}`}>{f.tag}</span>
                    <h3>{f.title}</h3>
                    <p style={{ flex: 1 }}>{f.body}</p>
                    <p className="mono" style={{ fontSize: 12, color: 'var(--faint)', marginTop: 14 }}>{f.foot}</p>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14, marginTop: 10 }}>
                      Read the full design →
                    </span>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
