import Page from '../components/Page.jsx'
import Reveal from '../components/Reveal.jsx'

const MEMBERS = [
  'Ashan Kasthuriarachchi',
  'Pasindu Hathurusinghe',
  'Asitha Kodithuwakku',
  'Shehana Hewage',
]

function Avatar({ name }) {
  const initials = name.split(' ').map((n) => n[0]).join('')
  return (
    <div
      aria-hidden="true"
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(14,116,144,0.14), rgba(124,58,237,0.12))',
        border: '1.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 18,
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
              Final year undergraduates of the Department of Electrical and Information Engineering,
              Faculty of Engineering, University of Ruhuna.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="grid-4">
            {MEMBERS.map((name, i) => (
              <Reveal key={name} delay={i * 0.08}>
                <div className="card" style={{ height: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar name={name} />
                  </div>
                  <h3 style={{ justifyContent: 'center' }}>{name}</h3>
                  <p style={{ fontSize: 13.5 }}>
                    Electrical &amp; Information Engineering
                    <br />
                    University of Ruhuna
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="table-scroll" style={{ marginTop: 30 }}>
              <table className="spec-table">
                <tbody>
                  <tr><th>Project</th><td style={{ fontFamily: 'var(--font-sans)' }}>Zero Trust Security Framework for O-RAN Shared Data Layer (SDL)</td></tr>
                  <tr><th>University</th><td style={{ fontFamily: 'var(--font-sans)' }}>University of Ruhuna · Faculty of Engineering</td></tr>
                  <tr><th>Department</th><td style={{ fontFamily: 'var(--font-sans)' }}>Electrical and Information Engineering</td></tr>
                  <tr><th>Module</th><td style={{ fontFamily: 'var(--font-sans)' }}>EE4801 — Final Year Project 2025/2026</td></tr>
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
                <strong>Grounded in a real testbed.</strong>&nbsp; Every architecture, flow and design
                decision shown on this site was implemented and demonstrated on the project's virtualised
                5G + O-RAN testbed, and is documented step-by-step in the repository above.
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
