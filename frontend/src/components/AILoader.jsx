import { motion } from 'framer-motion'
import { Loader2, Brain, Cpu, Sparkles } from 'lucide-react'

const steps = [
  { icon: <Brain className="w-5 h-5" />, label: 'Reading your resume...' },
  { icon: <Cpu className="w-5 h-5" />, label: 'Running AI analysis...' },
  { icon: <Sparkles className="w-5 h-5" />, label: 'Generating suggestions...' },
]

export default function AILoader({ step = 0 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* Orbiting dots */}
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary-200 dark:border-primary-800"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-dashed border-accent/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3585ff, #6366F1)' }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
        </div>
        {/* Orbiting dot */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-primary-500"
          style={{ top: '50%', left: '50%', marginTop: -6, marginLeft: -6 }}
          animate={{
            x: [0, 40, 0, -40, 0],
            y: [-40, 0, 40, 0, -40],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: i <= step ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${i <= step
                ? 'glass-card text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-600'
              }`}
          >
            {i < step
              ? <span className="text-emerald-500">✓</span>
              : i === step
                ? <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                : s.icon
            }
            <span className="text-sm font-medium">{s.label}</span>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-gray-400 dark:text-gray-500 animate-pulse">
        This may take a few seconds...
      </p>
    </div>
  )
}
