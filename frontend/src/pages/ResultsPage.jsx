import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle, XCircle, AlertTriangle, Lightbulb, Target, TrendingUp,
  Copy, Download, RotateCcw, Sparkles, ChevronDown, ChevronUp,
  FileText, Brain, ArrowLeft
} from 'lucide-react'
import ScoreRing from '../components/ScoreRing.jsx'
import AnimatedCard from '../components/AnimatedCard.jsx'
import { improveResume } from '../services/api.js'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

/* ── Tag chip ── */
function Tag({ children, color = 'blue' }) {
  const cls = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls[color]}`}>
      {children}
    </span>
  )
}

/* ── Collapsible Section ── */
function CollapsibleSection({ title, icon, children, defaultOpen = true, accent = '#3585ff' }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${accent}18` }}>
            <span style={{ color: accent }}>{icon}</span>
          </div>
          <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ */
export default function ResultsPage({ showToast }) {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [filename, setFilename] = useState('')
  const [improving, setImproving] = useState(false)
  const [improved, setImproved] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('cvyntra-result')
    const name = sessionStorage.getItem('cvyntra-filename')
    if (!stored) {
      navigate('/analyze')
      return
    }
    setResult(JSON.parse(stored))
    setFilename(name || 'resume')
  }, [navigate])

  if (!result) return null

  /* ── handlers ── */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    showToast('Copied to clipboard!', 'success')
  }

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cvyntra-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded!', 'success')
  }

  const handleReset = () => {
    sessionStorage.removeItem('cvyntra-result')
    sessionStorage.removeItem('cvyntra-filename')
    navigate('/analyze')
  }

  const handleImprove = async () => {
    setImproving(true)
    try {
      const res = await improveResume(result)
      setImproved(res)
      showToast('Resume improved by AI!', 'success')
    } catch {
      showToast('Could not improve resume. Try again.', 'error')
    }
    setImproving(false)
  }

  const scoreLabel = result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : result.score >= 40 ? 'Fair' : 'Needs Work'
  const scoreColor = result.score >= 80 ? '#10B981' : result.score >= 60 ? '#3585ff' : result.score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="section-container max-w-5xl">

        {/* Back + Actions bar */}
        <motion.div {...fade(0)} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/analyze" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors mb-1 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Back to Analyzer
            </Link>
            <h1 className="font-heading text-3xl font-black text-gray-900 dark:text-white">
              Analysis Results
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {filename}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={copyToClipboard} className="btn-secondary text-sm py-2 px-4 cursor-pointer">
              <Copy className="w-4 h-4" />
              Copy JSON
            </button>
            <button onClick={downloadJSON} className="btn-secondary text-sm py-2 px-4 cursor-pointer">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button onClick={handleReset} className="btn-secondary text-sm py-2 px-4 cursor-pointer">
              <RotateCcw className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </motion.div>

        {/* Score overview */}
        <motion.div {...fade(0.1)} className="glass-card p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* ATS Score ring */}
            <div className="flex flex-col items-center gap-2">
              <ScoreRing score={result.score} size={160} label="ATS Score" />
              <Tag color={result.score >= 80 ? 'green' : result.score >= 60 ? 'blue' : 'amber'}>
                {scoreLabel}
              </Tag>
            </div>

            {/* Job match ring */}
            {result.job_match_score != null && (
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={result.job_match_score} size={130} label="Job Match" strokeWidth={10} />
                <Tag color={result.job_match_score >= 70 ? 'green' : 'amber'}>
                  {result.job_match_score >= 70 ? 'Strong Match' : 'Moderate Match'}
                </Tag>
              </div>
            )}

            {/* Summary */}
            <div className="flex-1">
              <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary-500" />
                AI Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {result.summary_analysis || 'No summary available.'}
              </p>

              {/* quick score bars */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: 'ATS Score', val: result.score },
                  { label: 'Job Match', val: result.job_match_score ?? 0 },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">{label}</span>
                      <span className="font-semibold" style={{ color: scoreColor }}>{val}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #3585ff, #6366F1)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2-col grid for strengths / weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <AnimatedCard delay={0.15}>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Strengths
            </h3>
            {result.strengths?.length ? (
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {s}
                  </motion.li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-400">No strengths detected.</p>}
          </AnimatedCard>

          {/* Weaknesses */}
          <AnimatedCard delay={0.2}>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Weaknesses
            </h3>
            {result.weaknesses?.length ? (
              <ul className="space-y-3">
                {result.weaknesses.map((w, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    {w}
                  </motion.li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-400">No weaknesses found — great job!</p>}
          </AnimatedCard>
        </div>

        {/* Missing Skills */}
        <motion.div {...fade(0.25)} className="mb-6">
          <CollapsibleSection
            title="Missing Skills"
            icon={<AlertTriangle className="w-5 h-5" />}
            accent="#f59e0b"
          >
            {result.missing_skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Tag color="amber">{skill}</Tag>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No missing critical skills detected.</p>
            )}
          </CollapsibleSection>
        </motion.div>

        {/* Suggestions */}
        <motion.div {...fade(0.3)} className="mb-6">
          <CollapsibleSection
            title="AI Suggestions"
            icon={<Lightbulb className="w-5 h-5" />}
            accent="#3585ff"
          >
            {result.suggestions?.length ? (
              <ol className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #3585ff, #6366F1)' }}>
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s}</p>
                  </motion.li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-400">No suggestions — your resume looks great!</p>
            )}
          </CollapsibleSection>
        </motion.div>

        {/* Improved Summary from AI */}
        {(result.improved_summary || improved?.improved_summary) && (
          <motion.div {...fade(0.35)} className="mb-6">
            <CollapsibleSection
              title="AI-Improved Summary"
              icon={<Target className="w-5 h-5" />}
              accent="#10B981"
            >
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {improved?.improved_summary || result.improved_summary}
                </p>
              </div>
            </CollapsibleSection>
          </motion.div>
        )}

        {/* Improved Experience */}
        {(result.improved_experience?.length > 0 || improved?.improved_experience?.length > 0) && (
          <motion.div {...fade(0.4)} className="mb-6">
            <CollapsibleSection
              title="AI-Improved Experience Bullets"
              icon={<TrendingUp className="w-5 h-5" />}
              accent="#6366F1"
            >
              <ul className="space-y-3">
                {(improved?.improved_experience || result.improved_experience).map((exp, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-accent mt-0.5">▸</span>
                    {exp}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </motion.div>
        )}

        {/* Improve My Resume CTA */}
        <motion.div {...fade(0.45)} className="glass-card p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(53,133,255,0.05), rgba(99,102,241,0.05))',
            border: '1px solid rgba(53,133,255,0.12)',
          }}>
          <Sparkles className="w-10 h-10 text-primary-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-2">
            Improve My Resume with AI
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Let AI rewrite your summary and experience bullets to sound more compelling and professional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleImprove}
              disabled={improving}
              className={`btn-primary py-3 px-8 ${improving ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
            >
              {improving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Improve My Resume
                </>
              )}
            </button>
            <button onClick={handleReset} className="btn-secondary py-3 px-8 cursor-pointer">
              <RotateCcw className="w-4 h-4" />
              Analyze Another
            </button>
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
