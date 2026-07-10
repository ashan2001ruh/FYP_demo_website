import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'

export default function About() {
  return (
    <Page title="About">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="kicker">About the project</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              The team behind the <span className="accent">research</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="grid-2">
            <Reveal>
              <div className="card" style={{ height: '100%' }}>
                <span className="framework-tag tag-teal">RESEARCHER</span>
                <h3>Ashan Kasthuriarachchi</h3>
                <p>
                  Department of Electrical and Information Engineering, Faculty of Engineering, University of
                  Ruhuna. Docker Hub: <code>ashank2001</code> (Auth Agent v2 — DIDKit).
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card" style={{ height: '100%' }}>
                <span className="framework-tag tag-teal">RESEARCHER</span>
                <h3>Pasindu Janith</h3>
                <p>
                  Department of Electrical and Information Engineering, Faculty of Engineering, University of
                  Ruhuna. Docker Hub: <code>pasindujanith</code> (Auth Agent v1, Egress Ambassador, Redis
                  Translator).
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="table-scroll" style={{ marginTop: 26 }}>
              <table className="spec-table">
                <tbody>
                  <tr><th>Project</th><td>Zero Trust-Based IAM Framework for O-RAN Near-RT RIC</td></tr>
                  <tr><th>University</th><td>University of Ruhuna · Faculty of Engineering</td></tr>
                  <tr><th>Department</th><td>Electrical and Information Engineering</td></tr>
                  <tr><th>Module</th><td>EE4801 — Final Year Project 2025/2026</td></tr>
                  <tr>
                    <th>Documentation</th>
                    <td>
                      <a href="https://github.com/pasindu-janith/o-ran-sdl-security-documentation" target="_blank" rel="noreferrer">
                        github.com/pasindu-janith/o-ran-sdl-security-documentation
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="callout" style={{ marginTop: 26 }}>
              <div>
                <strong>Everything on this site is real.</strong>&nbsp; Every DID, schema id, image tag,
                manifest excerpt and design decision documented here was produced on the project's OSC
                Near-RT RIC testbed and is traceable to the step-by-step documentation repository above.
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
