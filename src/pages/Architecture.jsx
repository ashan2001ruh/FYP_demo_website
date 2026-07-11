import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'
import StepFlow from '../components/StepFlow.jsx'
import TestbedDiagram from '../components/diagrams/TestbedDiagram.jsx'
import {
  DockerLogo, KubernetesLogo, RadioLogo, CoreLogo, RedisLogo,
} from '../components/TechLogos.jsx'

const LAYERS = [
  {
    Logo: CoreLogo,
    title: 'Layer 1 · 5G Core — Open5GS',
    body: 'A containerised Open5GS core (Docker) provides the AMF, SMF, UPF and UDM network functions — handling UE registration, session establishment and data routing for the simulated network.',
  },
  {
    Logo: RadioLogo,
    title: 'Layer 2 · Radio Access — srsRAN',
    body: 'A disaggregated gNodeB: srsCU (Central Unit) connects to the core over NGAP, srsDU (Distributed Unit) connects to the CU over the F1 interface, and srsUE simulates a real handset. Radio links run over ZeroMQ virtual interfaces — no RF hardware needed.',
  },
  {
    Logo: KubernetesLogo,
    title: 'Layer 3 · Near-RT RIC — OSC RIC',
    body: 'The O-RAN Software Community RIC runs on Kubernetes, connected to the CU and DU through the E2 interface. Platform components (E2 Manager, E2 Termination, App Manager, A1 Mediator, Subscription Manager) communicate over RMR, and the Redis DBaaS provides the Shared Data Layer.',
  },
  {
    Logo: RedisLogo,
    title: 'Layer 4 · Security Framework',
    body: 'The subject of this project. All three frameworks plug in at this layer, intercepting and authorising every xApp access to the SDL. The testbed below them is identical — making the comparison fair.',
  },
]

const DEMO_FLOW = [
  { title: 'UE attaches', body: 'srsUE registers with the network through the srsRAN CU/DU chain and the Open5GS core; a data session is established.' },
  { title: 'E2 metrics flow', body: 'The E2 agents on srsCU and srsDU stream performance metrics and service events to the RIC over the E2 interface.' },
  { title: 'xApps consume', body: 'xApps subscribe to E2 indications through the RIC platform and process the metrics in near-real time.' },
  { title: 'SDL writes are intercepted', body: 'When an xApp writes results to the Shared Data Layer, the security framework intercepts the request, authenticates the xApp, and authorises the exact operation before it reaches Redis.' },
]

export default function Architecture() {
  return (
    <Page title="Architecture">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="kicker">Complete testbed</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              A virtualised <span className="accent">end-to-end 5G network</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              The demonstration runs on a full four-layer stack: an Open5GS core, a disaggregated srsRAN
              radio network, an OSC Near-RT RIC on Kubernetes, and the Zero Trust security framework inside
              the RIC. This testbed is <strong>shared by all three frameworks</strong> — they are swapped in
              and out at Layer 4 while everything else stays identical.
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
              <strong>The E2 interface</strong> is the bridge between the radio network and the RIC: the E2
              agents on srsCU and srsDU report metrics and accept control from the RIC's E2 Termination.
              It is this live metric stream that gives the xApps something real to write into the SDL —
              which is exactly the traffic the security frameworks protect.
            </div>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Demo traffic flow</span>
            <h2 className="section-title">What happens during a demonstration</h2>
          </Reveal>
          <div style={{ marginTop: 26 }}>
            <StepFlow steps={DEMO_FLOW} />
          </div>
          <div className="grid-2" style={{ marginTop: 26 }}>
            <Reveal>
              <div className="card">
                <h3><DockerLogo size={20} /> Why virtualised?</h3>
                <p>
                  Running the core in Docker and the radio links over ZeroMQ makes the whole 5G network
                  reproducible on one Ubuntu host — every experiment across the three frameworks starts
                  from the same known-good baseline.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card">
                <h3><KubernetesLogo size={20} /> Where the frameworks live</h3>
                <p>
                  Each framework is deployed into the RIC cluster without touching xApp or Redis code:
                  Kyverno injects the sidecars, cert-manager issues certificates, and the enforcement path
                  changes per framework — visit the framework pages to see how.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Page>
  )
}
