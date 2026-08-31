import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import HeroPipeline from '../components/diagrams/HeroPipeline.jsx'
import {
  DockerLogo, KubernetesLogo, RedisLogo, PostgresLogo, PythonLogo, EnvoyLogo,
  HyperledgerLogo, KeycloakLogo, OpaLogo, RadioLogo, CoreLogo, CertLogo, KyvernoLogo,
  CalicoLogo, WasmLogo, CalderaLogo, DidLogo,
} from '../components/TechLogos.jsx'

const TECH = [
  { name: 'Kubernetes', Logo: KubernetesLogo },
  { name: 'Docker', Logo: DockerLogo },
  { name: 'Envoy Proxy', Logo: EnvoyLogo },
  { name: 'WebAssembly', Logo: WasmLogo },
  { name: 'Open Policy Agent', Logo: OpaLogo },
  { name: 'Calico', Logo: CalicoLogo },
  { name: 'Kyverno', Logo: KyvernoLogo },
  { name: 'cert-manager', Logo: CertLogo },
  { name: 'Keycloak', Logo: KeycloakLogo },
  { name: 'Hyperledger Indy', Logo: HyperledgerLogo },
  { name: 'W3C DID / VC', Logo: DidLogo },
  { name: 'Redis', Logo: RedisLogo },
  { name: 'PostgreSQL', Logo: PostgresLogo },
  { name: 'Python', Logo: PythonLogo },
  { name: 'srsRAN', Logo: RadioLogo },
  { name: 'Open5GS', Logo: CoreLogo },
  { name: 'MITRE CALDERA', Logo: CalderaLogo },
]

const FRAMEWORKS = [
  {
    to: '/framework-1',
    tag: 'FRAMEWORK 1 · D-PEP',
    title: 'Localized enforcement',
    Logo: EnvoyLogo,
    body: 'Every xApp pod carries its own checkpoint — an Envoy proxy extended with a WebAssembly filter that reads the actual database command and decides on the spot.',
    stat: '4.65 ms',
    statLabel: 'fastest of the three',
  },
  {
    to: '/framework-2',
    tag: 'FRAMEWORK 2 · C-PEP',
    title: 'Centralized enforcement',
    Logo: OpaLogo,
    body: 'One fortified gateway in front of the database handles every xApp in the cluster, with the policy engine sitting right beside the data it protects.',
    stat: 'Lowest',
    statLabel: 'memory footprint',
  },
  {
    to: '/framework-3',
    tag: 'FRAMEWORK 3 · DID/VC',
    title: 'Decentralized identity',
    Logo: HyperledgerLogo,
    body: 'No identity server on the request path. Each xApp carries a credential signed by the RIC and anchored on a ledger, and proves it holds the matching key on every request.',
    stat: 'Replay-proof',
    statLabel: 'strongest identity assurance',
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
            <span className="kicker">EE7802 · Final Year Project 2025/2026</span>
            <h1 className="hero-title">
              A Zero Trust security framework for <span className="accent">Open RAN intelligent controllers</span>
            </h1>
            <div className="hero-meta">
              <span>University of Ruhuna · Faculty of Engineering</span>
              <span className="sep">·</span>
              <span>Electrical &amp; Information Engineering</span>
            </div>
            <p className="lead">
              Modern mobile networks let third-party software plug into the heart of the radio network. Those
              programs all share one database — and nothing checks what any of them reads or writes. This project
              designs, builds and attacks three different ways to fix that.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
              <Link className="btn btn-primary" to="/testbed">
                Start with the testbed →
              </Link>
              <Link className="btn btn-ghost" to="/results">
                Jump to the results
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
            <h2 className="section-title">A shared database that trusts everyone</h2>
            <p className="lead" style={{ marginBottom: 16 }}>
              Open RAN breaks the traditional black-box base station into open, interchangeable pieces, and adds
              a controller where third-party applications — <em>xApps</em> — optimise the network in real time.
              Those xApps keep their working data in a shared store called the Shared Data Layer.
            </p>
            <p className="lead">
              The difficulty is that any xApp able to reach that store can read or overwrite <em>anyone's</em>
              &nbsp;data, not just its own. An xApp is written by a third party, and one that is trustworthy on
              the day it is installed may be compromised the next. Zero Trust says the answer is to stop assuming:
              check every single request, every time, no matter who it claims to come from.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 30 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3>Verify every request</h3>
              <p>Not every session, not every connection — every individual read and write is authenticated and authorised on its own merits.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3>Change nothing developers own</h3>
              <p>No xApp source code, no deployment charts, and no part of the database were modified. Security is injected around the workload, automatically.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card" style={{ height: '100%' }}>
              <h3>Prove it by attacking it</h3>
              <p>Each design was tested with a real adversary emulation agent running inside the xApp pod — the position a compromised xApp would actually hold.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      {/* ── framework cards ── */}
      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Three approaches</span>
            <h2 className="section-title">One problem, three architectures</h2>
            <p className="lead">
              All three were fully built and measured on the same testbed, and all three stopped every attack.
              They differ in where the checking happens, what identity is made of, and what it costs.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 30 }}>
            {FRAMEWORKS.map((f, i) => (
              <Reveal key={f.to} delay={i * 0.1}>
                <Link to={f.to} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <motion.div className="card" whileHover={{ y: -5 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span className="framework-tag tag-teal">{f.tag}</span>
                    <h3><f.Logo size={20} /> {f.title}</h3>
                    <p style={{ flex: 1 }}>{f.body}</p>
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-soft)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{f.stat}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--faint)' }}>{f.statLabel}</div>
                    </div>
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

      {/* ── headline findings ── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Headline findings</span>
            <h2 className="section-title">What the testing showed</h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><CalderaLogo size={20} /> Application checks were never the weak point</h3>
              <p>
                Not one attempt to read another xApp's data got through, in any framework. The two real gaps
                found were underneath the security logic entirely: an attacker could open a plain network
                connection straight to the database, and could read a cluster credential left lying in the
                container. Both were closed.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><EnvoyLogo size={20} /> Where you put the checkpoint decides everything</h3>
              <p>
                Enforcing locally in each pod was eight times faster than funnelling everything through one
                gateway, and far steadier — which matters more than raw speed when a control loop must be sized
                for its worst case. The gateway's advantage is memory: it does not duplicate a proxy into every pod.
              </p>
            </div></Reveal>
          </div>
          <div style={{ marginTop: 22 }}>
            <Reveal>
              <Link className="btn btn-primary" to="/security-testing">See how the attacks were run →</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── tech stack ── */}
      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Technology</span>
            <h2 className="section-title">Everything is open source and real</h2>
            <p className="lead">
              A virtualised end-to-end 5G network, an O-RAN controller on Kubernetes, and the security machinery
              layered inside it.
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
                transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.035 }}
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
