import { motion } from 'framer-motion'
import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import AttackSimDiagram from '../components/diagrams/AttackSimDiagram.jsx'
import { CalderaLogo, CalicoLogo, KubernetesLogo, RedisLogo, DidLogo } from '../components/TechLogos.jsx'

const TECHNIQUES = [
  ['T1033', 'System owner and user discovery: who am I running as, and with what privilege?'],
  ['T1087.001', 'Local account discovery: which user accounts and service identities exist here?'],
  ['T1057', 'Process discovery: can I see what my neighbours are running?'],
  ['T1069.001', 'Local permission group discovery: what administrative rights are within reach?'],
  ['T1070.003', 'Clearing command history: can I erase the traces of what I just did?'],
  ['T1083', 'File and directory discovery: what is readable on this filesystem?'],
  ['T1046', 'Network service discovery: which services and ports can I reach from here?'],
]

const SCENARIOS = [
  {
    title: 'Reach another xApp’s data',
    body: 'Each xApp is confined to its own SDL namespaces. The attacker authenticated legitimately, then asked for data belonging to a namespace it was never granted.',
    outcome: 'Blocked in all three frameworks. The connection and the identity were both perfectly valid; the policy engine refused it purely on the namespace.',
    verdict: 'pass',
  },
  {
    title: 'Go around the proxy entirely',
    body: 'Rather than attacking the enforcement logic, open a direct connection to the database and skip the checkpoint altogether.',
    outcome: 'Initially succeeded at the transport layer: a plain connection to the database port completed. This was the single most valuable finding of the campaign.',
    verdict: 'fail',
  },
  {
    title: 'Scout the neighbourhood',
    body: 'Nineteen reconnaissance actions looking for user accounts, processes, privileges, files and reachable services.',
    outcome: 'Seventeen returned nothing at all. Two revealed only the attacker’s own container: its user and its groups. No neighbouring workload, host resource or cluster credential was exposed.',
    verdict: 'pass',
  },
  {
    title: 'Break out of the pod',
    body: 'Look for mounted host directories, visible neighbouring processes, and shared resources that would allow escape from the container.',
    outcome: 'No host directories were mounted and no neighbouring or host processes were visible, only five local ones. Kubernetes isolation held completely.',
    verdict: 'pass',
  },
  {
    title: 'Hunt for credentials',
    body: 'Assume the attacker already has code execution. What can it now steal from the filesystem: keys, tokens, certificates?',
    outcome: 'The container’s own root filesystem was writable and a Kubernetes service-account token was readable, which could have been used against the cluster API. Fixed by removing the token mount and hardening privileges.',
    verdict: 'fail',
  },
]

const HARDENING = [
  { title: 'Network policy at the kernel', body: 'Calico policies drop any packet from the xApp namespace aimed at the database’s plain port. The direct connection that succeeded earlier stopped completing, and a valid database command sent straight down that path never arrived no reply came back at all.' },
  { title: 'Dropped Linux capabilities', body: 'Containers now run without any elevated kernel capabilities, cannot escalate privilege, and no longer run as root. A discovered service becomes far less useful when the process that found it can do so little with it.' },
  { title: 'No cluster token by default', body: 'The service-account token is no longer mounted into xApp pods that have no need for it, removing the path from a compromised container to the cluster API.' },
  { title: 'Read-only root filesystem', body: 'With the container’s filesystem no longer writable, configuration that the identity framework relies on cannot be quietly rewritten by a compromised workload.' },
]

const RESP_TESTS = [
  ['Several commands in one packet', 'Each command is separated out and judged on its own, so a forbidden one cannot hide behind a permitted one.'],
  ['A command split across packets', 'Bytes are buffered until the command is complete. Nothing is ever evaluated half-read.'],
  ['Deliberately corrupted syntax', 'Rejected and the connection reset, never passed downstream on a permissive guess.'],
  ['A forbidden command inside a transaction', 'Every queued command is checked individually, and the whole transaction is refused before it can execute.'],
  ['A script reaching for foreign keys', 'The key references inside the script body are examined, not just the visible arguments.'],
  ['Wildcard and multi-key requests', 'The full set of keys the pattern would actually touch is resolved first. If any one falls outside the caller’s scope, the entire request is denied.'],
  ['Connecting with no certificate', 'The encrypted handshake fails outright, in all three frameworks.'],
  ['Using someone else’s identity', 'In Frameworks 1 and 2 the certificate’s name did not match the registered client, so it was rejected. In Framework 3 a captured proof was replayed and refused because its challenge no longer matched.'],
  ['Reading the sidecar’s secrets', 'Even sharing a pod, the application container cannot read material mounted only into the sidecar. The operating system refuses.'],
]

const CVSS = [
  { name: 'Reading the identity wallet', score: '0.0', level: 'none', note: 'The wallet is mounted only into the Auth Agent, never into the application container. There was nothing to find.' },
  { name: 'Services visible on the shared loopback', score: '8.4', level: 'high', note: 'Containers in a pod share a network namespace, so the database port was discoverable from inside. Contained afterwards by network policy and privilege hardening.' },
  { name: 'Tampering with resolution settings', score: '8.2', level: 'high', note: 'Local configuration naming the trusted verification services could be rewritten, which would let an attacker redirect trust checks. Closed by making the root filesystem read-only.' },
]

export default function SecurityTesting() {
  return (
    <Page title="Attack Testing">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="kicker">Adversary emulation</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              We attacked our own <span className="accent">defences</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              A security design that has only been reviewed on paper has not really been tested. Configuration
              scanners find misconfigurations, but they never ask how the system behaves when someone actually
              attacks it. So we put a real adversary inside the pod and let it try.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <Reveal>
            <span className="kicker">Method</span>
            <h2 className="section-title">The attacker starts inside the trust boundary</h2>
            <p className="lead">
              MITRE CALDERA is an open-source adversary emulation platform: a command-and-control server drives
              agents through attack behaviours drawn from the MITRE ATT&amp;CK knowledge base. Rather than
              scanning the cluster from outside, the agent was deployed as an extra container inside the xApp
              pod, which is exactly the position a genuinely compromised xApp would occupy.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: 26 }}>
              <AttackSimDiagram />
            </div>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><CalderaLogo size={20} /> A realistic vantage point</h3>
              <p>Sharing the pod means sharing its network, its lifecycle and its constraints. What the agent can see is precisely what a hijacked xApp would see not what an outside scanner would.</p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><KubernetesLogo size={20} /> A clean slate every run</h3>
              <p>The agent lives and dies with the pod. Each redeployment registers a fresh agent, so every campaign starts from an identical state and results stay comparable across frameworks.</p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card" style={{ height: '100%' }}>
              <h3><RedisLogo size={20} /> The same tests, three times</h3>
              <p>Identical scenarios were run against all three frameworks, so differences in outcome reflect the architectures rather than the testing.</p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Techniques</span>
            <h2 className="section-title">Catalogued attacker behaviours</h2>
            <p className="lead">
              Every action maps to a numbered technique in the MITRE ATT&amp;CK catalogue, so the results can be
              compared against published adversary behaviour rather than an ad-hoc checklist.
            </p>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            {TECHNIQUES.map((t, i) => (
              <Reveal key={t[0]} delay={i * 0.05}>
                <div className="tech-chip">
                  <code>{t[0]}</code>
                  <span>{t[1]}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">What we tried</span>
            <h2 className="section-title">Five ways to steal the data</h2>
            <p className="lead">
              Three attempts were stopped cold. Two succeeded on the first pass, and those are the interesting
              ones, because they are what the empirical testing was for.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gap: 16, marginTop: 26 }}>
            {SCENARIOS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <motion.div
                  className="card"
                  whileHover={{ y: -3 }}
                  style={{ borderLeft: `3px solid ${s.verdict === 'pass' ? 'var(--green)' : 'var(--amber)'}` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <h3 style={{ marginBottom: 4 }}>{s.title}</h3>
                    <span className={`verdict ${s.verdict === 'pass' ? 'pass' : 'warn'}`}>
                      {s.verdict === 'pass' ? '✓ held' : '! found a gap'}
                    </span>
                  </div>
                  <p style={{ marginBottom: 10 }}>{s.body}</p>
                  <p style={{ color: 'var(--text)', fontSize: 14.5 }}><strong>Result:</strong> {s.outcome}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">The fix</span>
            <h2 className="section-title">What the gaps taught us</h2>
            <p className="lead">
              Both weaknesses had the same shape: the application-layer enforcement was sound, but the layers
              beneath it were still open. Policy checks mean little if an attacker can simply refuse to use the
              path the policy sits on.
            </p>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            {HARDENING.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.07}>
                <div className="card" style={{ height: '100%' }}>
                  <h3>{i === 0 ? <CalicoLogo size={20} /> : <KubernetesLogo size={20} />} {h.title}</h3>
                  <p>{h.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="callout">
            <div>
              <strong>Measured, not asserted:</strong>&nbsp; exposure was scored as the proportion of internal
              services an attacker could discover. Before hardening, the shared pod network left roughly a
              quarter to two-thirds of the assessed internal communication visible depending on the framework.
              Discovery alone was never an executable attack path, but it is reconnaissance, and reconnaissance
              precedes everything else.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Protocol-level testing</span>
            <h2 className="section-title">Trying to fool the parser</h2>
            <p className="lead">
              All three frameworks decide what to allow by reading the database protocol itself. If that reader
              can be confused, the policy above it is worthless. These nine tests were run identically against
              every framework, and all nine behaved the same way in each.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gap: 12, marginTop: 26 }}>
            {RESP_TESTS.map((t, i) => (
              <Reveal key={t[0]} delay={i * 0.04}>
                <div className="card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span className="verdict pass">✓</span>
                    <strong style={{ fontSize: 15 }}>{t[0]}</strong>
                  </div>
                  <p style={{ marginTop: 6 }}>{t[1]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Scoring the identity layer</span>
            <h2 className="section-title">Severity of what remained</h2>
            <p className="lead">
              For the decentralized-identity framework, findings were scored with the industry-standard CVSS
              scale, where 0 means no impact and 10 means critical. Three identity-specific paths were assessed.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gap: 14, marginTop: 26 }}>
            {CVSS.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                    <h3 style={{ marginBottom: 0 }}><DidLogo size={18} /> {c.name}</h3>
                    <span className={`sev ${c.level === 'none' ? 'sev-none' : 'sev-high'}`}>
                      {c.score} {c.level === 'none' ? 'no impact' : 'high'}
                    </span>
                  </div>
                  <p style={{ marginTop: 10 }}>{c.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="callout">
            <div>
              <strong>The headline result:</strong>&nbsp; the private keys the one thing that would let an
              attacker impersonate an xApp were never reachable. The two high-severity findings were both
              about the platform around the identity layer, not the identity layer itself, and both were closed.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Conclusion</span>
            <h2 className="section-title">Where the three frameworks landed</h2>
            <p className="lead">
              After hardening, all three architectures blocked every unauthorised access attempt included in this assessment. They did not
              differ in whether they stopped the attacks they differed in how much infrastructure had to be
              trusted to do it. Framework 2 concentrates that trust in one gateway; Framework 1 distributes it
              across every pod; Framework 3 replaces trust in a server with trust in mathematics, and delivered
              the strongest identity assurance of the three.
            </p>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
