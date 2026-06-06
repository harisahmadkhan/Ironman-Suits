import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { panelVariants } from '@/lib/motion'

const STAT_LABELS = {
  durability:      'Durability',
  speed:           'Speed',
  firepower:       'Firepower',
  maneuverability: 'Maneuver',
  ai_systems:      'A.I. Systems',
  stealth:         'Stealth',
}

const STAT_COLORS = {
  durability:      '#00D4FF',
  speed:           '#00FF88',
  firepower:       '#FF4444',
  maneuverability: '#FFB800',
  ai_systems:      '#A855F7',
  stealth:         '#7A8FA6',
}

export default function StatsRadar({ stats, color }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const data = Object.entries(STAT_LABELS).map(([key, label]) => ({
    stat: label,
    value: stats?.[key] ?? 0,
    fullMark: 100,
  }))

  const fillColor = color || '#00D4FF'

  return (
    <motion.div
      ref={ref}
      custom={2}
      variants={panelVariants}
      initial="initial"
      animate="animate"
      className="rounded p-4"
      style={{
        background: 'rgba(10,15,24,0.82)',
        border: '1px solid rgba(0,212,255,0.2)',
        boxShadow: '0 0 20px rgba(0,212,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <p className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.25em] uppercase mb-4">
        — COMBAT STATISTICS —
      </p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ height: 240, minWidth: 0 }}
      >
        <ResponsiveContainer width="99%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid
              gridType="polygon"
              stroke="rgba(0,212,255,0.12)"
              strokeWidth={0.8}
            />
            <PolarAngleAxis
              dataKey="stat"
              tick={{
                fill: 'rgba(122,143,166,0.9)',
                fontSize: 9,
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: 1,
              }}
            />
            <Radar
              name={stats ? 'Stats' : ''}
              dataKey="value"
              stroke={fillColor}
              strokeWidth={1.5}
              fill={fillColor}
              fillOpacity={0.12}
              dot={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stat bars row */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-2 mt-3">
        {Object.entries(STAT_LABELS).map(([key, label]) => (
          <div key={key}>
            <div className="flex justify-between mb-0.5">
              <span className="font-mono-ui text-[8px] text-text-secondary uppercase tracking-wider">
                {label.split(' ')[0]}
              </span>
              <span
                className="font-mono-ui text-[8px]"
                style={{ color: STAT_COLORS[key] }}
              >
                {stats?.[key] ?? 0}
              </span>
            </div>
            <div
              className="h-[2px] rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: STAT_COLORS[key] }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${stats?.[key] ?? 0}%` } : { width: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
