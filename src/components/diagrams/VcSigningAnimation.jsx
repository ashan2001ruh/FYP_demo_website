import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { DidLogo, HyperledgerLogo } from '../TechLogos.jsx'

const PHASES = ['draft', 'signing', 'signed']

function Chip({ children, color = 'var(--accent)' }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12.5,
        fontWeight: 600,
        color,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: '2px 11px',
        marginRight: 6,
        background: 'rgba(255,255,255,0.6)',
      }}
    >
      {children}
    </span>
  )
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '9px 0', borderBottom: '1px dashed var(--border-soft)', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 150 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: 'var(--text)' }}>{children}</span>
    </div>
  )
}

/** The Verifiable Credential as a digital ID card: draft → signing → sealed. */
export default function VcSigningAnimation() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState(reduced ? 2 : 0)

  useEffect(() => {
    if (reduced) return
    const durations = [2400, 2100, 4200]
    const t = setTimeout(() => setPhase((p) => (p + 1) % 3), durations[phase])
    return () => clearTimeout(t)
  }, [phase, reduced])

  const state = PHASES[phase]
  const border = state === 'signed' ? 'var(--green)' : state === 'signing' ? 'var(--accent)' : 'var(--border)'

  return (
    <div className="diagram-frame" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--faint)', fontWeight: 500 }}>
          The RIC issues each xApp a digital identity card: a W3C Verifiable Credential
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={state}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '3px 12px',
              borderRadius: 999,
              border: `1.5px solid ${border}`,
              color: state === 'signed' ? 'var(--green)' : state === 'signing' ? 'var(--accent)' : 'var(--faint)',
              background: 'var(--panel)',
            }}
          >
            {state === 'draft' && 'DRAFT, NOT YET TRUSTED'}
            {state === 'signing' && 'SIGNING WITH THE RIC KEY…'}
            {state === 'signed' && 'SEALED ✓ TAMPER-EVIDENT'}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
        animate={{
          borderColor: border,
          boxShadow: state === 'signed' ? '0 12px 32px rgba(22,163,74,0.16)' : '0 4px 16px rgba(15,23,42,0.06)',
        }}
        transition={{ duration: 0.5 }}
        style={{
          border: '1.5px solid var(--border)',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #ffffff 0%, #f4f8fb 100%)',
          padding: '18px 22px',
          position: 'relative',
          maxWidth: 640,
          margin: '0 auto',
        }}
      >
        {/* card header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '2px solid var(--border-soft)' }}>
          <DidLogo size={30} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>SDL Access Credential</div>
            <div style={{ fontSize: 12.5, color: 'var(--faint)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <HyperledgerLogo size={13} /> issued by the RIC Identity Authority · anchored on Hyperledger Indy
            </div>
          </div>
        </div>

        <Row label="Holder">the xApp's decentralised identifier (DID)</Row>
        <Row label="SDL namespaces"><Chip>e2-metrics</Chip><Chip>kpi-store</Chip></Row>
        <Row label="Permissions"><Chip color="var(--green)">read</Chip><Chip color="var(--amber)">write</Chip></Row>
        <Row label="Validity">30 days from issuance</Row>

        {/* signature seal */}
        <div style={{ minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 12 }}>
          <AnimatePresence>
            {state === 'signed' && (
              <motion.div
                initial={{ opacity: 0, scale: 1.7, rotate: -14 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '2px solid var(--green)',
                  color: 'var(--green)',
                  borderRadius: 10,
                  padding: '8px 14px',
                  fontWeight: 700,
                  fontSize: 13,
                  background: 'rgba(22,163,74,0.05)',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                  <circle cx="13" cy="13" r="11.5" fill="none" stroke="var(--green)" strokeWidth="2" />
                  <path d="M8 13.5l3.4 3.4L18.5 9.5" fill="none" stroke="var(--green)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  Digitally signed by the RIC
                  <br />
                  <span style={{ fontWeight: 500, fontSize: 11.5 }}>Ed25519 signature; any edit breaks the seal</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {state !== 'signed' && (
            <span style={{ fontSize: 12.5, color: 'var(--faint)', fontStyle: 'italic' }}>
              {state === 'draft' ? 'awaiting signature…' : 'computing signature…'}
            </span>
          )}
        </div>

        {/* signing sweep */}
        <AnimatePresence>
          {state === 'signing' && (
            <motion.div
              initial={{ x: '-110%' }}
              animate={{ x: '110%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.7, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(100deg, transparent 30%, rgba(14,116,144,0.1) 50%, transparent 70%)',
                pointerEvents: 'none',
                borderRadius: 14,
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <p className="diagram-caption">
        Once sealed, the credential is verified before storage and re-verified by the Auth Agent at startup and on
        every request. Modifying a single field invalidates the signature.
      </p>
    </div>
  )
}
