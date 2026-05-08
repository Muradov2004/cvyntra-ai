import { motion } from 'framer-motion'

/**
 * Reusable animated card with fade-in-up effect
 */
export default function AnimatedCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
