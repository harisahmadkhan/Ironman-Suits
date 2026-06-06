import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="min-h-screen flex items-center justify-center">
      <div className="text-center font-mono-ui">
        <p className="text-status-destroyed text-6xl font-display mb-4">404</p>
        <p className="text-text-mono text-xl mb-2">SUIT NOT FOUND</p>
        <p className="text-text-secondary mb-8">INITIATING SEARCH PROTOCOL...</p>
        <Link to="/armory" className="border border-border-glow text-border-glow px-6 py-3 hover:bg-border-glow hover:text-bg-base transition-colors">
          RETURN TO ARMORY
        </Link>
      </div>
    </motion.div>
  )
}
