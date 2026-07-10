import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/framework-1', label: 'Framework 1' },
  { to: '/framework-2', label: 'Framework 2' },
  { to: '/framework-3', label: 'Framework 3' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/about', label: 'About' },
]

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="none" />
      <path
        d="M16 4l10 4.4v7.4c0 5.8-4.2 10.7-10 12.2-5.8-1.5-10-6.4-10-12.2V8.4L16 4z"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="14.5" r="3" fill="var(--accent)" />
      <path d="M16 17.5v5.5" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // close mobile menu on navigation
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="nav-brand" aria-label="Home">
            <Logo />
            <span>Zero Trust RIC IAM</span>
          </Link>

          <nav aria-label="Primary">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end}>
                    {({ isActive }) => (
                      <>
                        {l.label}
                        {isActive && (
                          <motion.span
                            className="nav-underline"
                            layoutId="nav-underline"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M4 4l12 12" />
                  <path d="M16 4L4 16" />
                </>
              ) : (
                <>
                  <path d="M3 5.5h14" />
                  <path d="M3 10h14" />
                  <path d="M3 14.5h14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <ul>
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
