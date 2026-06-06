import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'

export default function Compare() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="min-h-screen flex items-center justify-center">
      <p className="font-mono-ui text-text-mono">Compare — Phase 9</p>
    </motion.div>
  )
}
