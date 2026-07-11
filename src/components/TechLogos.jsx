/**
 * Simplified, correctly-coloured inline SVG marks for the technologies used
 * on the testbed. Each takes a `size` prop and renders a recognisable glyph.
 */

export function DockerLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Docker">
      {/* container squares */}
      <g fill="#1D63ED">
        <rect x="5.5" y="9.2" width="2.6" height="2.4" rx="0.3" />
        <rect x="8.6" y="9.2" width="2.6" height="2.4" rx="0.3" />
        <rect x="11.7" y="9.2" width="2.6" height="2.4" rx="0.3" />
        <rect x="8.6" y="6.4" width="2.6" height="2.4" rx="0.3" />
        <rect x="11.7" y="6.4" width="2.6" height="2.4" rx="0.3" />
        <rect x="11.7" y="3.6" width="2.6" height="2.4" rx="0.3" />
      </g>
      {/* whale body / wave */}
      <path
        d="M2 12.6h18.2c.9 0 1.9-.5 2.3-1.2.3.9.2 3-1 4.6-1.6 2.2-4.3 3.4-8.2 3.4-5.5 0-9.6-2.4-11.3-6.8z"
        fill="#1D63ED"
      />
      <circle cx="18.6" cy="10.4" r="1.5" fill="#1D63ED" />
    </svg>
  )
}

export function KubernetesLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Kubernetes">
      <path
        d="M12 1.6l8.8 4.2 2.2 9.5-6.1 7.6H7.1L1 15.3l2.2-9.5L12 1.6z"
        fill="#326CE5"
      />
      <g stroke="#fff" strokeWidth="1.15" fill="none" strokeLinecap="round">
        <circle cx="12" cy="12" r="3.1" />
        <path d="M12 8.9V4.8M14.4 10L18 7.6M14.9 12.7l4 1.3M13.2 14.8l1.6 3.8M10.8 14.8l-1.6 3.8M9.1 12.7l-4 1.3M9.6 10L6 7.6" />
      </g>
    </svg>
  )
}

export function RedisLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Redis">
      <g fill="#D82C20">
        <path d="M12 3.5L21 7l-9 3.5L3 7l9-3.5z" />
        <path d="M3 10.4l9 3.5 9-3.5v2.6l-9 3.5-9-3.5v-2.6z" opacity="0.85" />
        <path d="M3 15.4l9 3.5 9-3.5v2.1l-9 3.5-9-3.5v-2.1z" opacity="0.7" />
      </g>
    </svg>
  )
}

export function PostgresLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="PostgreSQL">
      {/* elephant-head silhouette (simplified slonik) */}
      <path
        d="M12 2.6c-4.6 0-7.6 3-7.6 7.7 0 3.6 1.7 6.8 3.6 8.6 1 .9 2 .7 2.3-.4.2-.8.2-1.7.4-2.5.9.4 1.7.4 2.6 0 .2.8.2 1.7.4 2.5.3 1.1 1.3 1.3 2.3.4 1.9-1.8 3.6-5 3.6-8.6 0-4.7-3-7.7-7.6-7.7z"
        fill="#336791"
      />
      <circle cx="9.4" cy="9" r="1" fill="#fff" />
      <path d="M13.3 13.6c1.2-.3 2.2-1.1 2.6-2.2" stroke="#fff" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function PythonLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Python">
      <path
        d="M11.9 2c-2.6 0-4.4.9-4.4 2.9v2.2h4.5v.8H5.2C3.2 7.9 2 9.6 2 12s1.2 4.1 3.2 4.1h1.9v-2.6c0-1.9 1.7-3.4 3.7-3.4h4.4c1.6 0 2.9-1.3 2.9-2.9V4.9C18.1 3 15.6 2 11.9 2zM9.7 4.1a1 1 0 110 2 1 1 0 010-2z"
        fill="#3776AB"
      />
      <path
        d="M12.1 22c2.6 0 4.4-.9 4.4-2.9v-2.2H12v-.8h6.8c2 0 3.2-1.7 3.2-4.1s-1.2-4.1-3.2-4.1h-1.9v2.6c0 1.9-1.7 3.4-3.7 3.4H8.8c-1.6 0-2.9 1.3-2.9 2.9v2.3C5.9 21 8.4 22 12.1 22zm2.2-2.1a1 1 0 110-2 1 1 0 010 2z"
        fill="#FFD43B"
      />
    </svg>
  )
}

export function EnvoyLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Envoy">
      <circle cx="12" cy="12" r="10" fill="#AC6199" />
      <path
        d="M7 12a5 5 0 015-5h4.6v2.4H12a2.6 2.6 0 000 5.2h4.6V17H12a5 5 0 01-5-5z"
        fill="#fff"
      />
      <circle cx="12" cy="12" r="1.5" fill="#fff" />
    </svg>
  )
}

export function HyperledgerLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Hyperledger">
      <path d="M12 1.8l9 5.2v10l-9 5.2-9-5.2V7l9-5.2z" fill="none" stroke="#2F3134" strokeWidth="1.7" />
      <path d="M8.5 8v8M15.5 8v8M8.5 12h7" stroke="#5BC2A7" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

export function KeycloakLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Keycloak">
      <path d="M6.4 4h11.2l4 8-4 8H6.4l-4-8 4-8z" fill="#4D4D4D" />
      <g fill="#00B8E3">
        <path d="M9.6 7.2h2.6L9.4 12l2.8 4.8H9.6L6.8 12l2.8-4.8z" />
        <path d="M14 7.2h2.6L13.8 12l2.8 4.8H14L11.2 12 14 7.2z" opacity="0.85" />
      </g>
    </svg>
  )
}

export function OpaLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Open Policy Agent">
      <path d="M12 2a8 8 0 00-8 8v7.5L7.3 21l2-2.2a7.9 7.9 0 005.4 0l2 2.2 3.3-3.5V10a8 8 0 00-8-8z" fill="#566366" />
      <circle cx="12" cy="10.5" r="4.2" fill="#7D9199" />
      <circle cx="12" cy="10.5" r="2" fill="#fff" />
    </svg>
  )
}

export function GrpcLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="gRPC">
      <rect x="2.5" y="7" width="19" height="10" rx="3" fill="#2DA6B0" />
      <text x="12" y="14.9" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="6.6" fill="#fff">gRPC</text>
    </svg>
  )
}

export function RadioLogo({ size = 18 }) {
  // srsRAN / radio access
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="srsRAN">
      <g stroke="#E4572E" strokeWidth="1.7" fill="none" strokeLinecap="round">
        <path d="M12 21V9.5" />
        <path d="M8.2 6.4a5.4 5.4 0 017.6 0" />
        <path d="M5.6 3.8a9.2 9.2 0 0112.8 0" />
      </g>
      <circle cx="12" cy="9" r="2" fill="#E4572E" />
      <path d="M8.5 21h7" stroke="#E4572E" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function CoreLogo({ size = 18 }) {
  // Open5GS core network
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Open5GS">
      <circle cx="12" cy="12" r="3" fill="#0B7261" />
      <g stroke="#0B7261" strokeWidth="1.5" fill="#fff">
        <circle cx="12" cy="4" r="2.1" />
        <circle cx="20" cy="12" r="2.1" />
        <circle cx="12" cy="20" r="2.1" />
        <circle cx="4" cy="12" r="2.1" />
      </g>
      <g stroke="#0B7261" strokeWidth="1.2">
        <path d="M12 7v2M17 12h-2M12 17v-2M7 12h2" />
      </g>
    </svg>
  )
}

export function CertLogo({ size = 18 }) {
  // cert-manager / X.509
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="cert-manager">
      <rect x="4" y="3" width="16" height="14" rx="2" fill="#fff" stroke="#326CE5" strokeWidth="1.6" />
      <path d="M7 7h10M7 10h7" stroke="#326CE5" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="15.5" cy="16.5" r="3.4" fill="#F2A900" stroke="#fff" strokeWidth="1" />
      <path d="M14 20.6l1.5-1 1.5 1v-2.4h-3v2.4z" fill="#F2A900" />
    </svg>
  )
}

export function KyvernoLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Kyverno">
      <path d="M12 2l8.5 3v6.2c0 4.9-3.4 9-8.5 10.8C6.9 20.2 3.5 16.1 3.5 11.2V5L12 2z" fill="#2A7FFF" />
      <path d="M8.3 12.2l2.6 2.6 5-5.3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DidLogo({ size = 18 }) {
  // W3C DID/VC mark
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="W3C DID">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="#fff" stroke="#7C3AED" strokeWidth="1.6" />
      <circle cx="8" cy="10.5" r="2.2" fill="#7C3AED" />
      <path d="M5.4 16.4c.5-1.7 1.5-2.5 2.6-2.5s2.1.8 2.6 2.5" fill="#7C3AED" />
      <path d="M13 9.5h6M13 12.5h6M13 15.5h4" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/** Small logo chip used inside SVG diagrams via <foreignObject>-free composition:
 *  renders as a plain positioned <g> wrapper around the logo svg content is not
 *  possible, so diagrams embed logos with <g transform> + the raw shapes.
 *  For HTML contexts (cards, badges) use the components above directly. */
export const LOGO_MAP = {
  docker: DockerLogo,
  kubernetes: KubernetesLogo,
  redis: RedisLogo,
  postgres: PostgresLogo,
  python: PythonLogo,
  envoy: EnvoyLogo,
  hyperledger: HyperledgerLogo,
  keycloak: KeycloakLogo,
  opa: OpaLogo,
  grpc: GrpcLogo,
  radio: RadioLogo,
  core: CoreLogo,
  cert: CertLogo,
  kyverno: KyvernoLogo,
  did: DidLogo,
}
