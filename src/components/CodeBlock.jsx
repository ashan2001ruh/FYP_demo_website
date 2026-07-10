import { useState } from 'react'

export default function CodeBlock({ title, children }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(children))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span>{title}</span>
        <button
          onClick={copy}
          style={{
            background: 'none',
            border: 'none',
            color: copied ? 'var(--accent)' : 'var(--faint)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  )
}
