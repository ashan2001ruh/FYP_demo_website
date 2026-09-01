import { motion } from 'framer-motion'
import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import BarChart from '../components/charts/BarChart.jsx'
import { EnvoyLogo, OpaLogo, HyperledgerLogo } from '../components/TechLogos.jsx'

const LATENCY = [
  { label: 'No security framework (baseline)', value: 0.56, display: '0.56 ms', color: 'var(--faint)', note: 'The unprotected RIC, for reference' },
  { label: 'Framework 1 · Localized PEP', value: 4.65, display: '4.65 ms', color: 'var(--green)', note: 'Enforcement inside the pod, nothing to queue behind' },
  { label: 'Framework 3 · DID/VC', value: 25.66, display: '25.66 ms', color: 'var(--purple)', note: 'A fresh cryptographic proof built and verified per request' },
  { label: 'Framework 2 · Centralized PEP', value: 36.94, display: '36.94 ms', color: 'var(--amber)', note: 'Protocol translation plus queuing at the shared gateway' },
]

const TAIL = [
  ['Framework 1 · Localized PEP', '4.65', '1.06', '6.10', '6.45', '7.23'],
  ['Framework 3 · DID/VC', '25.66', '4.09', '30.77', '32.87', '38.99'],
  ['Framework 2 · Centralized PEP', '36.94', '7.28', '44.40', '45.92', '48.08'],
]

const CPU = [
  { label: 'No security framework', value: 3000, display: '< 3,000 m', color: 'var(--faint)' },
  { label: 'Framework 1 · Localized PEP', value: 9000, display: '≈ 9,000 m', color: 'var(--green)', note: 'Rises near-linearly across the whole range' },
  { label: 'Framework 3 · DID/VC', value: 9500, display: '≈ 9,500 m', color: 'var(--purple)', note: 'Jumps early, then flattens out and handles concurrency well' },
  { label: 'Framework 2 · Centralized PEP', value: 10000, display: '> 10,000 m', color: 'var(--amber)', note: 'Passes this level before 50 xApps, then saturates' },
]

const MEM = [
  { label: 'No security framework', value: 8000, display: '≈ 8,000 MiB', color: 'var(--faint)' },
  { label: 'Framework 3 · DID/VC', value: 29000, display: '≈ 29,000 MiB', color: 'var(--purple)', note: 'Two extra containers per pod, caching credentials and keys' },
  { label: 'Framework 1 · Localized PEP', value: 36000, display: '≈ 36,000 MiB', color: 'var(--green)', note: 'A full proxy and its WebAssembly module duplicated into every pod' },
]

const ROWS = [
  {
    criterion: 'Where enforcement happens',
    f1: { text: 'In every xApp pod: an Envoy sidecar with a WebAssembly filter' },
    f2: { text: 'At one gateway in front of the database' },
    f3: { text: 'In every xApp pod: Envoy plus a dedicated Auth Agent' },
  },
  {
    criterion: 'Where the decision is made',
    f1: { text: 'One shared policy engine for the cluster' },
    f2: { text: 'A policy engine inside the database pod itself' },
    f3: { text: 'One shared policy engine, fed by a separate verifier' },
  },
  {
    criterion: 'How identity is proven',
    f1: { text: 'Short-lived token from Keycloak, cached in the proxy' },
    f2: { text: 'Short-lived token from Keycloak, attached to each envelope' },
    f3: { text: 'A signed proof built fresh for every request', win: true },
  },
  {
    criterion: 'Containers added to the xApp pod',
    f1: { text: 'One: the Envoy sidecar' },
    f2: { text: 'One: a lightweight ambassador', win: true },
    f3: { text: 'Two: Envoy and the Auth Agent' },
  },
  {
    criterion: 'Mean added delay',
    f1: { text: '4.65 ms, the fastest', win: true },
    f2: { text: '36.94 ms, the slowest' },
    f3: { text: '25.66 ms' },
  },
  {
    criterion: 'Predictability of timing',
    f1: { text: 'Tightest spread; delay depends only on local work', win: true },
    f2: { text: 'Widest spread; depends on how busy every other xApp is' },
    f3: { text: 'Moderate, with occasional spikes past 50 ms' },
  },
  {
    criterion: 'Behaviour as xApps multiply',
    f1: { text: 'Scales best; the shared policy engine is the eventual limit', win: true },
    f2: { text: 'The gateway becomes a bottleneck early' },
    f3: { text: 'Degrades fastest; cryptography is paid per request' },
  },
  {
    criterion: 'Memory cost',
    f1: { text: 'Highest: a full proxy in every pod' },
    f2: { text: 'Lowest: one shared gateway', win: true },
    f3: { text: 'High, though below Framework 1' },
  },
  {
    criterion: 'Runtime dependency on an identity server',
    f1: { text: 'Yes: Keycloak must be reachable to refresh tokens' },
    f2: { text: 'Yes: Keycloak, plus the gateway itself' },
    f3: { text: 'None: the credential travels with the xApp', win: true },
  },
  {
    criterion: 'Single point of failure',
    f1: { text: 'No enforcement bottleneck; per-pod isolation', win: true },
    f2: { text: 'The gateway: if it stops, all data access stops' },
    f3: { text: 'No runtime bottleneck; the ledger is needed only at onboarding', win: true },
  },
  {
    criterion: 'Effect of a stolen credential',
    f1: { text: 'Replayable until the token expires' },
    f2: { text: 'Replayable until the token expires' },
    f3: { text: 'Useless: each proof works exactly once', win: true },
  },
  {
    criterion: 'Revocation',
    f1: { text: 'Takes effect when the current token expires' },
    f2: { text: 'Token expiry, plus an instant central policy update', win: true },
    f3: { text: 'Ledger supports it, but this prototype checks expiry only, not the revocation registry' },
  },
  {
    criterion: 'Operational complexity',
    f1: { text: 'Moderate: an identity server and a policy engine' },
    f2: { text: 'Lowest: one enforcement surface to manage', win: true },
    f3: { text: 'Highest: ledger, identity agent, verifier and wallets' },
  },
]

const PICKS = [
  {
    Logo: EnvoyLogo,
    title: 'Choose Framework 1 when',
    body: 'latency and its predictability matter most. It was the fastest and steadiest by a wide margin, and it scales best, the right default for a near-real-time control loop, provided you can afford the memory.',
  },
  {
    Logo: OpaLogo,
    title: 'Choose Framework 2 when',
    body: 'memory is tight, the xApp count is modest, and a single auditable checkpoint is worth more than raw speed. Everything passes one place, which is genuinely easier to reason about and to log.',
  },
  {
    Logo: HyperledgerLogo,
    title: 'Choose Framework 3 when',
    body: 'identity assurance is the priority: multi-vendor deployments where no single identity server should be trusted, and where a captured credential must be impossible to replay.',
  },
]

export default function Results() {
  return (
    <Page title="Results">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="kicker">Measured outcomes</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              What security <span className="accent">actually costs</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Every framework stopped every unauthorised access attempt. What separates them is the price: how
              much delay they add, how steady that delay is, and how they behave when the cluster fills up with
              xApps. All figures below come from 500 consecutive database writes on the same testbed.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <Reveal>
            <span className="kicker">Latency</span>
            <h2 className="section-title">Delay added to a single data request</h2>
            <p className="lead">
              The unprotected baseline answers in about half a millisecond. Security is not free, but the gap
              between the three approaches is far larger than most people expect.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <BarChart
                caption="Mean round-trip time per SDL write request"
                rows={LATENCY}
                footnote="Measured over 500 successive write requests per configuration, on an Intel Xeon 16-core virtual machine running Ubuntu 20.04."
              />
            </div>
          </Reveal>
          <div className="callout" style={{ marginTop: 26 }}>
            <div>
              <strong>Why Framework 2 is eight times slower than Framework 1:</strong>&nbsp; every request has to
              leave its pod, be translated out of one protocol and back into another at the gateway, and wait
              behind requests from every other xApp. Framework 1 does its work locally, so nothing leaves the pod
              until the decision is already made.
            </div>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Consistency</span>
            <h2 className="section-title">The worst case matters more than the average</h2>
            <p className="lead">
              A near-real-time control loop has to be dimensioned for the slowest request it will ever see, not
              the typical one. The percentile columns show the delay that 90%, 95% and 99% of requests came in
              under.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="table-scroll" style={{ marginTop: 26 }}>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Framework</th>
                    <th>Mean</th>
                    <th>Variation</th>
                    <th>90% under</th>
                    <th>95% under</th>
                    <th>99% under</th>
                  </tr>
                </thead>
                <tbody>
                  {TAIL.map((r, i) => (
                    <motion.tr
                      key={r[0]}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ type: 'spring', stiffness: 260, damping: 28, delay: i * 0.1 }}
                    >
                      <th>{r[0]}</th>
                      <td className={i === 0 ? 'win' : undefined}>{r[1]} ms</td>
                      <td className={i === 0 ? 'win' : undefined}>± {r[2]} ms</td>
                      <td>{r[3]} ms</td>
                      <td>{r[4]} ms</td>
                      <td>{r[5]} ms</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <div className="callout">
            <div>
              <strong>Read the variation column:</strong>&nbsp; Framework 1 stays within about a millisecond of
              its average, so its worst case is close to its typical case. Framework 2 swings seven times wider,
              because each request's delay is set by whatever every other xApp happens to be doing at that
              instant, something the requesting xApp cannot control or predict.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Scale</span>
            <h2 className="section-title">Running 200 xApps at once</h2>
            <p className="lead">
              The frameworks were pushed from one xApp instance up to two hundred. Processor demand and memory
              use were recorded across the cluster; the figures below are what each framework reached at the top
              of that range.
            </p>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26, alignItems: 'start' }}>
            <Reveal>
              <BarChart
                caption="Cluster processor demand at 200 xApps"
                rows={CPU}
                footnote="Measured in millicores. Lower is better. Framework 2 saturates earliest, crossing 10,000 m before even 50 xApps are running."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <BarChart
                caption="Cluster memory use at 200 xApps"
                rows={MEM}
                footnote="Framework 2 uses the least memory of the three, because a single shared gateway replaces the per-pod proxies that Frameworks 1 and 3 duplicate into every xApp."
              />
            </Reveal>
          </div>
          <div className="callout">
            <div>
              <strong>The central trade-off in one sentence:</strong>&nbsp; putting a proxy in every pod costs
              memory but buys speed, predictability and headroom; concentrating everything at one gateway saves
              memory but pays for it in delay, jitter and an early ceiling.
            </div>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Side by side</span>
            <h2 className="section-title">Thirteen ways the frameworks differ</h2>
            <p className="lead">
              A green mark shows where a framework is strongest on that row. No framework leads on everything,
              which is precisely why all three were built and measured rather than one being assumed best.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="table-scroll" style={{ marginTop: 26 }}>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    <th>Framework 1 · Localized</th>
                    <th>Framework 2 · Centralized</th>
                    <th>Framework 3 · DID/VC</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => (
                    <motion.tr
                      key={r.criterion}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ type: 'spring', stiffness: 260, damping: 28, delay: Math.min(i, 8) * 0.05 }}
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Choosing</span>
            <h2 className="section-title">Different deployments, different winners</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            {PICKS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <motion.div className="card" whileHover={{ y: -5 }} style={{ height: '100%' }}>
                  <h3><p.Logo size={20} /> {p.title}</h3>
                  <p>{p.body}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
          <div className="callout" style={{ marginTop: 26 }}>
            <div>
              <strong>One combination stands out.</strong>&nbsp; The decentralized-identity model was built on
              top of the localized enforcement design rather than the centralized one, precisely because
              distributing the work across per-pod proxies keeps the processor cost manageable. The heavier the
              cryptography, the more it matters that the load is spread rather than funnelled.
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
