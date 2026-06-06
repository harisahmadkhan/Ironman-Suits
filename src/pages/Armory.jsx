import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'

export default function Armory() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="min-h-screen flex items-center justify-center">
      <p className="font-mono-ui text-text-mono">Armory — Phase 7</p>
    </motion.div>
  )
}
