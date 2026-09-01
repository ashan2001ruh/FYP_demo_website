import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import TestbedDiagram from '../components/diagrams/TestbedDiagram.jsx'
import {
  DockerLogo, KubernetesLogo, RadioLogo, CoreLogo, RedisLogo, CalicoLogo, KyvernoLogo, CertLogo,
} from '../components/TechLogos.jsx'

const LAYERS = [
  {
    Logo: CoreLogo,
    title: 'Layer 1: the 5G core',
    body: 'Open5GS runs as a set of Docker containers providing the network functions that register a handset, set up its data session and route its traffic: access and mobility management, session management, the user-plane forwarder and the subscriber database.',
  },
  {
    Logo: RadioLogo,
    title: 'Layer 2: the radio network',
    body: 'srsRAN provides a base station split into two parts, exactly as O-RAN intends: a central unit talking to the core, and a distributed unit talking to the handset. A simulated handset completes the chain. The radio links run over virtual interfaces, so the whole network works with no radio hardware at all.',
  },
  {
    Logo: KubernetesLogo,
    title: 'Layer 3: the RIC',
    body: 'The O-RAN Software Community RIC runs on Kubernetes, connected to both radio units. Its platform services handle E2 connections, subscriptions, policy intent and xApp lifecycle, all communicating over an internal message bus, and the Redis-backed Shared Data Layer holds the data everything else depends on.',
  },
  {
    Logo: RedisLogo,
    title: 'Layer 4: the security framework',
    body: 'This is what the project builds. All three frameworks plug in here, intercepting and authorising every xApp access to the Shared Data Layer. The three layers beneath are identical in every experiment, which is what makes the comparison fair.',
  },
]

const DEMO_FLOW = [
  { title: 'The handset joins the network', body: 'The simulated device authenticates through the radio units to the core, and a data session is established end to end.' },
  { title: 'The radio starts reporting', body: 'Agents on both the central and distributed units stream live performance measurements to the RIC over the E2 interface.' },
  { title: 'xApps subscribe and process', body: 'An xApp asks the RIC for a feed of those measurements and begins acting on them in near-real time.' },
  { title: 'And then it writes to shared storage', body: 'The moment the xApp saves a result to the Shared Data Layer, the security framework steps in, checks who is asking, checks what they are asking for, and only then lets the write through.' },
]

export default function Testbed() {
  return (
    <Page title="Testbed">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="kicker">The complete testbed</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              A whole 5G network, <span className="accent">built in software</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              To test whether the security frameworks actually work, they needed something real to protect. So a
              complete mobile network was assembled in software: core, radio access, simulated handset and the
              intelligent controller on top, running on a single machine with no radio hardware anywhere.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <Reveal delay={0.08}>
            <TestbedDiagram />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">The four layers</span>
            <h2 className="section-title">From simulated handset to protected data</h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            {LAYERS.map((l, i) => (
              <Reveal key={l.title} delay={i * 0.07}>
                <div className="card" style={{ height: '100%' }}>
                  <h3><l.Logo size={20} /> {l.title}</h3>
                  <p>{l.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="callout" style={{ marginTop: 28 }}>
            <div>
              <strong>What the E2 interface is for:</strong>&nbsp; it is the link that lets the controller see and
              steer the radio network in near-real time. That live measurement stream is what gives the xApps
              something genuine to compute on, and what they write back into shared storage is exactly the
              traffic the security frameworks exist to protect.
            </div>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">A demonstration run</span>
            <h2 className="section-title">What happens end to end</h2>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={DEMO_FLOW} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Decisions along the way</span>
            <h2 className="section-title">Why this stack, and not another</h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><KubernetesLogo size={20} /> Two controllers were tried</h3>
              <p>
                A second open-source RIC, FlexRIC, was also deployed and validated: the radio connected, the
                handset attached, and sample xApps successfully collected live measurements. It was still set
                aside, because it has no standardised Shared Data Layer: each xApp keeps its own isolated data.
                With no shared store to protect, there was nothing for this project to secure.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><DockerLogo size={20} /> Why virtualise everything</h3>
              <p>
                Running the core in containers and the radio over virtual interfaces makes the entire network
                reproducible on one machine. Every experiment across the three frameworks starts from the same
                known-good baseline, so measured differences come from the frameworks and nothing else.
              </p>
            </div></Reveal>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Shared foundations</span>
            <h2 className="section-title">What all three frameworks have in common</h2>
            <p className="lead">
              Whichever framework is deployed, the same three pieces of automation sit underneath it, and none
              of them require an xApp developer to write a single line of security code.
            </p>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            <Reveal><div className="card" style={{ height: '100%' }}>
              <h3><KyvernoLogo size={20} /> Automatic injection</h3>
              <p>
                Kyverno inspects every new xApp pod at the moment Kubernetes admits it, and rewrites the pod's
                specification to add the security sidecars and mounts before the pod is created. Nothing in the
                developer's manifests changes.
              </p>
            </div></Reveal>
            <Reveal delay={0.08}><div className="card" style={{ height: '100%' }}>
              <h3><CertLogo size={20} /> Automatic certificates</h3>
              <p>
                cert-manager issues each xApp a unique X.509 certificate signed by the internal root authority,
                and renews and rotates it over time. That certificate is the pod's cryptographic passport.
              </p>
            </div></Reveal>
            <Reveal delay={0.16}><div className="card" style={{ height: '100%' }}>
              <h3><CalicoLogo size={20} /> A network floor</h3>
              <p>
                Kubernetes networks are flat by default: any pod can reach any other. Calico compiles network
                policies into kernel-level packet rules, so a compromised xApp cannot simply step around the
                proxy and talk to the database directly.
              </p>
            </div></Reveal>
          </div>
          <div className="callout">
            <div>
              <strong>The founding constraint:</strong>&nbsp; no xApp source code, no Helm chart, and no part of
              the database may be modified. Everything the frameworks do is added around the workload rather than
              inside it, which is what makes the approach usable with third-party xApps an operator did not write.
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
