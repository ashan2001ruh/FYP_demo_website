import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'

const MEMBERS = [
  { name: 'Ashan Kasthuriarachchi', id: 'RU/E/2021/4605' },
  { name: 'Pasindu Hathurusinghe', id: 'RU/E/2021/4545' },
  { name: 'Asitha Kodithuwakku', id: 'RU/E/2021/4614' },
  { name: 'Shehana Hewage', id: 'RU/E/2020/4017' },
]

const SUPERVISORS = [
  { name: 'Dr. Chatura Seneviratne', role: 'Supervisor', org: 'University of Ruhuna' },
  { name: 'Prof. Dr. An Braeken', role: 'Co-Supervisor', org: 'Vrije Universiteit Brussel, Belgium' },
  { name: 'Pramitha Fernando', role: 'Co-Supervisor', org: 'Vrije Universiteit Brussel, Belgium' },
]

function Avatar({ name }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  return (
    <div
      aria-hidden="true"
      style={{
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(14,116,144,0.14), rgba(124,58,237,0.12))',
        border: '1.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 19,
        color: 'var(--accent-strong)',
        marginBottom: 14,
      }}
    >
      {initials}
    </div>
  )
}

export default function Team() {
  return (
    <Page title="Team">
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="hero-bg" />
        <div className="container">
          <Reveal>
            <span className="kicker">The team</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px,4.6vw,44px)' }}>
              Four engineers, <span className="accent">one testbed</span>
            </h1>
            <p className="lead" style={{ marginTop: 16 }}>
              A final-year undergraduate research project in the Department of Electrical and Information
              Engineering, Faculty of Engineering, University of Ruhuna, Sri Lanka.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <Reveal>
            <span className="kicker">Contributors</span>
            <h2 className="section-title">Project team</h2>
          </Reveal>
          <div className="grid-4" style={{ marginTop: 26 }}>
            {MEMBERS.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="card" style={{ height: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar name={m.name} />
                  </div>
                  <h3 style={{ justifyContent: 'center', fontSize: 16.5 }}>{m.name}</h3>
                  <p className="mono" style={{ fontSize: 12.5, color: 'var(--faint)' }}>{m.id}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Reveal>
            <span className="kicker">Supervision</span>
            <h2 className="section-title">Academic supervisors</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 26 }}>
            {SUPERVISORS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08}>
                <div className="card" style={{ height: '100%' }}>
                  <span className="framework-tag tag-teal">{s.role.toUpperCase()}</span>
                  <h3 style={{ fontSize: 16.5 }}>{s.name}</h3>
                  <p style={{ fontSize: 14 }}>{s.org}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="kicker">Project details</span>
            <h2 className="section-title">About this work</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="table-scroll" style={{ marginTop: 26 }}>
              <table className="spec-table">
                <tbody>
                  <tr>
                    <th>Title</th>
                    <td style={{ fontFamily: 'var(--font-sans)', wordBreak: 'normal' }}>
                      A Zero Trust-Based Security Framework for Secure Data Access and Sharing in Open RAN
                      Intelligent Controllers
                    </td>
                  </tr>
                  <tr><th>Degree</th><td style={{ fontFamily: 'var(--font-sans)', wordBreak: 'normal' }}>BSc Engineering (Honours)</td></tr>
                  <tr><th>Department</th><td style={{ fontFamily: 'var(--font-sans)', wordBreak: 'normal' }}>Electrical and Information Engineering</td></tr>
                  <tr><th>Faculty</th><td style={{ fontFamily: 'var(--font-sans)', wordBreak: 'normal' }}>Faculty of Engineering, University of Ruhuna, Sri Lanka</td></tr>
                  <tr><th>Module</th><td style={{ fontFamily: 'var(--font-sans)', wordBreak: 'normal' }}>EE4801 — Final Year Project 2025/2026</td></tr>
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
                <strong>Everything here was built and measured.</strong>&nbsp; Every architecture, attack result
                and performance figure on this site comes from the project's own virtualised 5G and O-RAN
                testbed, and is documented step by step in the repository above.
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
