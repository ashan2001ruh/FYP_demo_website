import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const PHASES = ['unsigned', 'signing', 'signed']

/** Cycles: unsigned VC → DIDKit signing → proof block appears. */
export default function VcSigningAnimation() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState(reduced ? 2 : 0)

  useEffect(() => {
    if (reduced) return
    const durations = [2600, 2200, 3800]
    const t = setTimeout(() => setPhase((p) => (p + 1) % 3), durations[phase])
    return () => clearTimeout(t)
  }, [phase, reduced])

  const state = PHASES[phase]
  const border =
    state === 'signed' ? 'rgba(63,185,80,0.6)' : state === 'signing' ? 'rgba(0,212,200,0.6)' : 'var(--border)'

  return (
    <div className="diagram-frame" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
        <span className="svg-faint mono" style={{ fontSize: 12, color: 'var(--faint)' }}>
          didkit.issue_credential(vc, proof_options, issuer_jwk)
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={state}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mono"
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '3px 12px',
              borderRadius: 999,
              border: `1px solid ${border}`,
              color: state === 'signed' ? 'var(--green)' : state === 'signing' ? 'var(--accent)' : 'var(--faint)',
            }}
          >
            {state === 'unsigned' && 'UNSIGNED VC'}
            {state === 'signing' && 'signing · Ed25519Signature2020 …'}
            {state === 'signed' && 'SIGNED ✓ verified by DIDKit'}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
        animate={{ borderColor: border, boxShadow: state === 'signed' ? '0 0 28px rgba(63,185,80,0.12)' : '0 0 0 rgba(0,0,0,0)' }}
        transition={{ duration: 0.5 }}
        style={{
          border: '1px solid var(--border)',
          borderRadius: 10,
          background: '#0a0e14',
          padding: '16px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          lineHeight: 1.7,
          color: '#c9d5e1',
          overflowX: 'auto',
          position: 'relative',
        }}
      >
        <div>{'{'}</div>
        <div style={{ paddingLeft: 18 }}>
          <span style={{ color: 'var(--blue)' }}>"type"</span>: [<span style={{ color: 'var(--amber)' }}>"VerifiableCredential"</span>, <span style={{ color: 'var(--amber)' }}>"SDLAccessCredential"</span>],
        </div>
        <div style={{ paddingLeft: 18 }}>
          <span style={{ color: 'var(--blue)' }}>"issuer"</span>: <span style={{ color: 'var(--amber)' }}>"did:key:z6Mkm8GwKYg4W7zFzos9eK8RQNvgufA8ymvHfjdKW97irKZt"</span>,
        </div>
        <div style={{ paddingLeft: 18 }}>
          <span style={{ color: 'var(--blue)' }}>"credentialSubject"</span>: {'{'}
        </div>
        <div style={{ paddingLeft: 36 }}>
          <span style={{ color: 'var(--blue)' }}>"xapp_name"</span>: <span style={{ color: 'var(--amber)' }}>"ricxapp-sdl-xapp"</span>,{' '}
          <span style={{ color: 'var(--blue)' }}>"permissions"</span>: <span style={{ color: 'var(--amber)' }}>"[\"read\", \"write\"]"</span>,
        </div>
        <div style={{ paddingLeft: 36 }}>
          <span style={{ color: 'var(--blue)' }}>"allowed_namespaces"</span>: <span style={{ color: 'var(--amber)' }}>"[\"e2-metrics\", \"kpi-store\"]"</span>,
        </div>
        <div style={{ paddingLeft: 36 }}>
          <span style={{ color: 'var(--blue)' }}>"ric_issuer_sov_did"</span>: <span style={{ color: 'var(--amber)' }}>"KewdxLKBU9Fgu5aac8PH4R"</span>, …
        </div>
        <div style={{ paddingLeft: 18 }}>{'}'}{state === 'signed' ? ',' : ''}</div>

        <AnimatePresence>
          {state === 'signed' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ paddingLeft: 18, color: 'var(--green)' }}>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>"proof"</span>: {'{'}
              </div>
              <div style={{ paddingLeft: 36 }}>
                <span style={{ color: 'var(--blue)' }}>"type"</span>: <span style={{ color: 'var(--amber)' }}>"Ed25519Signature2020"</span>,
              </div>
              <div style={{ paddingLeft: 36 }}>
                <span style={{ color: 'var(--blue)' }}>"proofPurpose"</span>: <span style={{ color: 'var(--amber)' }}>"assertionMethod"</span>,
              </div>
              <div style={{ paddingLeft: 36 }}>
                <span style={{ color: 'var(--blue)' }}>"verificationMethod"</span>: <span style={{ color: 'var(--amber)' }}>"did:key:z6Mkm8…irKZt#z6Mkm8…irKZt"</span>,
              </div>
              <div style={{ paddingLeft: 36 }}>
                <span style={{ color: 'var(--blue)' }}>"proofValue"</span>: <span style={{ color: 'var(--green)' }}>"z••••••••••••••••••••••••"</span>
                <span style={{ color: 'var(--faint)' }}> // Ed25519 signature, multibase</span>
              </div>
              <div style={{ paddingLeft: 18 }}>{'}'}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <div>{'}'}</div>

        {/* signing sweep */}
        <AnimatePresence>
          {state === 'signing' && (
            <motion.div
              initial={{ x: '-110%' }}
              animate={{ x: '110%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(100deg, transparent 30%, rgba(0,212,200,0.12) 50%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <p className="diagram-caption">
        The provisioner signs each SDLAccessCredential with the persistent RIC issuer key, then re-verifies it before it ships.
      </p>
    </div>
  )
}
