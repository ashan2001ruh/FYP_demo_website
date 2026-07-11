import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import HeroPipeline from '../components/diagrams/HeroPipeline.jsx'
import {
  DockerLogo, KubernetesLogo, RedisLogo, PostgresLogo, PythonLogo, EnvoyLogo,
  HyperledgerLogo, KeycloakLogo, OpaLogo, GrpcLogo, RadioLogo, CoreLogo, CertLogo, KyvernoLogo,
} from '../components/TechLogos.jsx'

const TECH = [
  { name: 'Kubernetes', Logo: KubernetesLogo },
  { name: 'Docker', Logo: DockerLogo },
  { name: 'Redis', Logo: RedisLogo },
  { name: 'Envoy Proxy', Logo: EnvoyLogo },
  { name: 'Open Policy Agent', Logo: OpaLogo },
  { name: 'Keycloak', Logo: KeycloakLogo },
  { name: 'Hyperledger Indy', Logo: HyperledgerLogo },
  { name: 'PostgreSQL', Logo: PostgresLogo },
  { name: 'Python', Logo: PythonLogo },
  { name: 'gRPC', Logo: GrpcLogo },
  { name: 'srsRAN', Logo: RadioLogo },
  { name: 'Open5GS', Logo: CoreLogo },
  { name: 'cert-manager', Logo: CertLogo },
  { name: 'Kyverno', Logo: KyvernoLogo },
]

const FRAMEWORKS = [
  {
    to: '/framework-1',
    tag: 'FRAMEWORK 1',
    title: 'Localized PEP',
    subtitle: 'Keycloak · JWT · per-pod enforcement',
    Logo: KeycloakLogo,
    body: 'Each xApp pod carries its own enforcement point. An Auth Agent obtains short-lived tokens from Keycloak using the pod\'s certificate identity, and Envoy enforces every decision locally — close to the workload.',
  },
  {
    to: '/framework-2',
    tag: 'FRAMEWORK 2',
    title: 'Centralized PEP',
    subtitle: 'single enforcement surface at the data',
    Logo: OpaLogo,
    body: 'Enforcement is consolidated at one central point guarding the database itself. Every xApp\'s traffic passes through the same gateway, where the actual database command is inspected against the caller\'s claims.',
  },
  {
    to: '/framework-3',
    tag: 'FRAMEWORK 3',
    title: 'DID/VC Zero Trust',
    subtitle: 'decentralised identity · Hyperledger Indy',
    Logo: HyperledgerLogo,
    body: 'Token servers are replaced with W3C Verifiable Credentials anchored on a distributed ledger. Each xApp proves its identity cryptographically on every request — verification is a local computation.',
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
              Zero Trust Security Framework for the <span className="accent">O-RAN Shared Data Layer</span>
            </h1>
            <div className="hero-meta">
              <span>University of Ruhuna · Faculty of Engineering</span>
              <span className="sep">·</span>
              <span>Electrical &amp; Information Engineering</span>
            </div>
            <p className="lead">
              Inside an O-RAN Near-RT RIC, every xApp reads and writes a shared Redis database — the SDL —
              with no access control of its own. This project designs, implements and compares three
              security frameworks that authenticate and authorise every single SDL access, with zero
              security code written by xApp developers.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
              <Link className="btn btn-primary" to="/architecture">
                See the testbed →
              </Link>
              <Link className="btn btn-ghost" to="/comparison">
                Compare the frameworks
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

      {/* ── the problem ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">The problem</span>
            <h2 className="section-title">A shared database with implicit trust</h2>
            <p className="lead">
              xApps run as Kubernetes pods and access the SDL directly — any pod that can reach the
              database can read or overwrite any other xApp's data. Under Zero Trust principles, no
              request should be trusted by default: every SDL access must be authenticated and authorised.
              All three frameworks achieve this transparently, by intercepting traffic with injected
              sidecars rather than modifying xApps or Redis.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── framework cards — equal prominence ── */}
      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Three approaches</span>
            <h2 className="section-title">One problem, three trust models</h2>
            <p className="lead">
              All three frameworks were fully implemented and evaluated on the same testbed. Each makes a
              different trade-off — none is universally better.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 30 }}>
            {FRAMEWORKS.map((f, i) => (
              <Reveal key={f.to} delay={i * 0.1}>
                <Link to={f.to} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <motion.div className="card" whileHover={{ y: -5 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span className="framework-tag tag-teal">{f.tag}</span>
                    <h3><f.Logo size={20} /> {f.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--faint)', marginBottom: 10 }}>{f.subtitle}</p>
                    <p style={{ flex: 1 }}>{f.body}</p>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14, marginTop: 14 }}>
                      Explore this framework →
                    </span>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── tech stack ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Technology stack</span>
            <h2 className="section-title">Built on real infrastructure</h2>
            <p className="lead">
              A virtualised end-to-end 5G network — Open5GS core, srsRAN radio access, OSC Near-RT RIC —
              with the security frameworks layered inside the RIC.
            </p>
          </Reveal>
          <div className="pill-row" style={{ marginTop: 24 }}>
            {TECH.map((t, i) => (
              <motion.span
                key={t.name}
                className="badge"
                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.04 }}
              >
                <t.Logo size={17} />
                {t.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
