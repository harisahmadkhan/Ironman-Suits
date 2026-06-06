import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const STAT_KEYS = [
  { key: 'durability',      label: 'Durability' },
  { key: 'speed',           label: 'Speed' },
  { key: 'firepower',       label: 'Firepower' },
  { key: 'maneuverability', label: 'Maneuver' },
  { key: 'ai_systems',      label: 'A.I.' },
  { key: 'stealth',         label: 'Stealth' },
]

const COLORS = ['#00D4FF', '#C0392B', '#FFB800', '#00FF88']

export default function OverlaidRadar({ suits }) {
  const data = STAT_KEYS.map(({ key, label }) => {
    const entry = { stat: label }
    suits.forEach(suit => {
      entry[suit.id] = suit.stats?.[key] ?? 0
    })
    return entry
  })

  return (
    <div
      className="rounded p-4"
      style={{
        background: 'rgba(10,15,24,0.82)',
        border: '1px solid rgba(0,212,255,0.2)',
        boxShadow: '0 0 20px rgba(0,212,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <p className="font-mono-ui text-[9px] text-[#00D4FF] tracking-[0.25em] uppercase mb-4">
        — STATS OVERLAY —
      </p>

      <div style={{ height: 260, minWidth: 0 }}>
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
            {suits.map((suit, i) => (
              <Radar
                key={suit.id}
                name={suit.designation}
                dataKey={suit.id}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={1.5}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.12}
                dot={false}
              />
            ))}
            <Legend
              wrapperStyle={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                paddingTop: '8px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
