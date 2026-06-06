import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'

export default function Landing() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="grid-overlay min-h-screen flex items-center justify-center"
    >
      <div className="text-center">
        <p className="font-mono-ui text-text-mono text-sm mb-4">PHASE 6 — PENDING BUILD</p>
        <h1 className="font-display text-5xl text-text-primary tracking-widest">THE ARMORY</h1>
        <p className="text-text-secondary mt-4">Landing page — coming in Phase 6</p>
      </div>
    </motion.div>
  )
}
