import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Page({ title, children }) {
  useEffect(() => {
    document.title = title
      ? `${title} · Zero Trust IAM for O-RAN Near-RT RIC`
      : 'Zero Trust IAM for O-RAN Near-RT RIC'
  }, [title])

  return (
    <motion.main
      className="page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.8 }}
    >
      {children}
    </motion.main>
  )
}
