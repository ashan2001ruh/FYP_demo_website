export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong style={{ color: 'var(--muted)' }}>A Zero Trust-Based Security Framework for Open RAN Intelligent Controllers</strong>
          <br />
          EE7802 Final Year Project 2025/2026 · University of Ruhuna, Faculty of Engineering
        </div>
        <div>
          Ashan Kasthuriarachchi · Pasindu Hathurusinghe · Asitha Kodithuwakku · Shehana Hewage
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
