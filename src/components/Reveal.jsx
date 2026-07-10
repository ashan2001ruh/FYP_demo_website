import { motion } from 'framer-motion'

/** Scroll-triggered reveal with optional stagger index. */
export default function Reveal({ children, delay = 0, y = 26, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 240, damping: 28, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
