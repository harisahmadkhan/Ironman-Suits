// Shared Framer Motion variant presets

export const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.25, ease: 'easeIn' } },
}

export const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } },
}

export const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export const statBarVariants = {
  initial: { width: 0 },
  animate: (value) => ({
    width: `${value}%`,
    transition: { duration: 0.8, ease: 'easeOut' },
  }),
}

export const panelVariants = {
  initial: { opacity: 0, x: 40 },
  animate: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.1 },
  }),
}

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}
