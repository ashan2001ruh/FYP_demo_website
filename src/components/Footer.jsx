export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong style={{ color: 'var(--muted)' }}>Zero Trust-Based IAM Framework for O-RAN Near-RT RIC</strong>
          <br />
          EE4801 — Final Year Project 2025/2026 · University of Ruhuna
        </div>
        <div>
          Ashan Kasthuriarachchi · Pasindu Janith
          <br />
          <a
            href="https://github.com/pasindu-janith/o-ran-sdl-security-documentation"
            target="_blank"
            rel="noreferrer"
          >
            Project documentation on GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
