import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'

export default function SuitDetail() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="min-h-screen flex items-center justify-center">
      <p className="font-mono-ui text-text-mono">Suit Detail — Phase 8</p>
    </motion.div>
  )
}
