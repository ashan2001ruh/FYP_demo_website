import { motion } from 'framer-motion'
import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import { KeycloakLogo, OpaLogo, HyperledgerLogo } from '../components/TechLogos.jsx'

const ROWS = [
  {
    criterion: 'Runtime dependency',
    f1: { text: 'Keycloak must be reachable for every token refresh' },
    f2: { text: 'Central gateway and Keycloak on the request path' },
    f3: { text: 'None — verification is local computation', win: true },
  },
  {
    criterion: 'Revocation speed',
    f1: { text: 'Takes effect when the current token expires (minutes)' },
    f2: { text: 'Token expiry, plus instant policy updates at one central point' },
    f3: { text: 'Immediate — a single ledger transaction', win: true },
  },
  {
    criterion: 'Offline verification',
    f1: { text: 'No — new tokens require the identity server' },
    f2: { text: 'No — gateway and identity server required' },
    f3: { text: 'Yes — proofs verify without any network call', win: true },
  },
  {
    criterion: 'Single point of failure',
    f1: { text: 'Enforcement is per-pod; only token refresh is centralised', win: true },
    f2: { text: 'The central gateway is a critical dependency for all SDL access' },
    f3: { text: 'No runtime SPOF; the ledger is needed only for onboarding and revocation', win: true },
  },
  {
    criterion: 'Resource overhead',
    f1: { text: 'Full sidecar pair in every xApp pod' },
    f2: { text: 'Lightest per-pod footprint — one small ambassador', win: true },
    f3: { text: 'Sidecar pair plus per-request cryptography' },
  },
  {
    criterion: 'Standards compliance',
    f1: { text: 'OIDC / OAuth2 — mature, universally tooled', win: true },
    f2: { text: 'OIDC identity with a custom transport envelope' },
    f3: { text: 'W3C DID / VC — open standards, still emerging' },
  },
  {
    criterion: 'Operational complexity',
    f1: { text: 'Moderate — an IAM server to run and clients to register' },
    f2: { text: 'Low-moderate — one enforcement surface to manage', win: true },
    f3: { text: 'Highest — ledger, identity agent and wallet lifecycle' },
  },
]

const PICKS = [
  {
    Logo: KeycloakLogo,
    title: 'Framework 1 fits when…',
    body: 'the operator wants proven, familiar IAM technology, per-pod isolation, and the lowest latency on the data path — and can accept the identity server as a runtime dependency.',
    to: '#/framework-1',
  },
  {
    Logo: OpaLogo,
    title: 'Framework 2 fits when…',
    body: 'command-level inspection, minimal per-pod overhead and a single auditable enforcement surface matter most — and the extra hop and central dependency are acceptable.',
    to: '#/framework-2',
  },
  {
    Logo: HyperledgerLogo,
    title: 'Framework 3 fits when…',
    body: 'removing the runtime identity server, instant revocation and tamper-evident credentials justify running a ledger and managing wallets.',
    to: '#/framework-3',
  },
]

export default function Comparison() {
  return (
    <Page title="Comparison">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="kicker">Side by side</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              Three frameworks, <span className="accent">seven criteria</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              All three frameworks secure the same SDL on the same testbed — but they optimise for
              different things. Each one wins on different criteria; the right choice depends on what an
              operator values most.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <Reveal delay={0.06}>
            <div className="table-scroll">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    <th>Framework 1 · Localized PEP</th>
                    <th>Framework 2 · Centralized PEP</th>
                    <th>Framework 3 · DID/VC</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => (
                    <motion.tr
                      key={r.criterion}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ type: 'spring', stiffness: 260, damping: 28, delay: i * 0.07 }}
                    >
                      <th>{r.criterion}</th>
                      <td className={r.f1.win ? 'win' : undefined}>{r.f1.win && '● '}{r.f1.text}</td>
                      <td className={r.f2.win ? 'win' : undefined}>{r.f2.win && '● '}{r.f2.text}</td>
                      <td className={r.f3.win ? 'win' : undefined}>{r.f3.win && '● '}{r.f3.text}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="diagram-caption" style={{ marginTop: 12 }}>
            ● marks where a framework is strongest on that criterion — no framework leads on all seven.
          </p>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Choosing between them</span>
            <h2 className="section-title">Different deployments, different winners</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            {PICKS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <a href={p.to} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <motion.div className="card" whileHover={{ y: -5 }} style={{ height: '100%' }}>
                    <h3><p.Logo size={20} /> {p.title}</h3>
                    <p>{p.body}</p>
                  </motion.div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
