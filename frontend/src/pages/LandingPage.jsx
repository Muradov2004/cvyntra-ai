import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FileText, Zap, Target, Lightbulb, Search, TrendingUp,
  ArrowRight, CheckCircle, ChevronRight, Star, Upload
} from 'lucide-react'

/* ── animation variants ───────────────────────────────── */
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
})

/* ── feature cards data ───────────────────────────────── */
const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: 'ATS Score Analysis',
    desc: `Instantly calculate your ATS compatibility score and understand how recruiters' systems see your resume.`,
    gradient: 'from-blue-500 to-cyan-400',
    tag: 'Core Feature',
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Job Match Analysis',
    desc: 'Compare your resume against any job description and get a detailed match percentage with actionable gaps.',
    gradient: 'from-violet-500 to-purple-400',
    tag: 'AI-Powered',
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'AI Suggestions',
    desc: 'Context-aware, personalized recommendations to improve every section of your resume.',
    gradient: 'from-amber-500 to-orange-400',
    tag: 'Smart',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Resume Improvement',
    desc: 'Let AI rewrite your summary and bullet points to sound compelling and professional.',
    gradient: 'from-emerald-500 to-teal-400',
    tag: 'Auto-rewrite',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Missing Skills Detection',
    desc: 'Identify critical missing technologies and keywords that are holding your application back.',
    gradient: 'from-rose-500 to-pink-400',
    tag: 'Detection',
  },
]

/* ── how it works steps ───────────────────────────────── */
const steps = [
  { num: '01', title: 'Upload Your CV', desc: 'Drag and drop your PDF or DOCX resume. We parse it instantly.' },
  { num: '02', title: 'Add Job Description', desc: 'Optionally paste the job description to get a tailored match score.' },
  { num: '03', title: 'AI Analyzes', desc: 'Our AI agent runs a multi-step analysis on your resume in seconds.' },
  { num: '04', title: 'Get Results', desc: 'Review your ATS score, suggestions, strengths and weaknesses.' },
]

/* ── stats ───────────────────────────────────────────── */
const stats = [
  { value: '95%', label: 'ATS Accuracy' },
  { value: '10×', label: 'Faster Analysis' },
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '4.9★', label: 'User Rating' },
]

/* ═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20">
        {/* decorative blobs */}
        <div className="absolute top-32 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3585ff, transparent)' }} />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }} />

        <div className="section-container w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                {...fade(0.1)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium
                  bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400
                  border border-primary-100 dark:border-primary-800"
              >
                <Zap className="w-4 h-4" />
                AI-Powered Resume Intelligence
              </motion.div>

              <motion.h1
                {...fade(0.2)}
                className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 text-gray-900 dark:text-white"
              >
                AI-Powered{' '}
                <span className="gradient-text block">Resume Analysis</span>
              </motion.h1>

              <motion.p
                {...fade(0.3)}
                className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Upload your CV and let our AI agent analyze ATS compatibility, detect missing skills,
                compare with job descriptions, and rewrite your resume to stand out.
              </motion.p>

              <motion.div {...fade(0.4)} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/analyze" className="btn-primary text-base py-3.5 px-8">
                  <Upload className="w-5 h-5" />
                  Upload CV &amp; Analyze
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/analyze" className="btn-secondary text-base py-3.5 px-8">
                  <Zap className="w-5 h-5" />
                  See How It Works
                </Link>
              </motion.div>

              {/* micro trust */}
              <motion.div {...fade(0.5)} className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['#3585ff', '#6366F1', '#10B981', '#f59e0b'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: c }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Join <strong className="text-gray-700 dark:text-gray-200">50,000+</strong> job seekers
                </p>
              </motion.div>
            </div>

            {/* Right hero card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex-1 max-w-md w-full"
            >
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                  style={{ background: 'radial-gradient(circle, #3585ff, transparent)' }} />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ATS Score</p>
                    <p className="text-4xl font-black font-heading text-emerald-500">85/100</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #10B981, #3d8c61)' }}>
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                {/* mini progress bars */}
                {[
                  { label: 'Structure', pct: 90 },
                  { label: 'Keywords', pct: 78 },
                  { label: 'Experience', pct: 85 },
                  { label: 'Skills Match', pct: 72 },
                ].map(({ label, pct }) => (
                  <div key={label} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{label}</span>
                      <span className="text-primary-500 font-semibold">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #3585ff, #6366F1)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, delay: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Great ATS compatibility! 3 improvements suggested.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* stats row */}
          <motion.div
            {...fade(0.5)}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map(({ value, label }, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <p className="text-3xl font-black font-heading gradient-text mb-1">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-24 section-container">
        <motion.div {...fade(0)} className="text-center mb-16">
          <p className="text-primary-500 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Land the Job
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-powered suite of tools covers every aspect of resume optimization from ATS scoring to full rewrites.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fade(i * 0.1)}
              className="feature-card group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-5
                group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-500 mb-2 block">{f.tag}</span>
              <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{f.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-primary-500 text-sm font-semibold group-hover:gap-2 transition-all">
                Learn more <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, rgba(53,133,255,0.04), rgba(99,102,241,0.04))' }}>
        <div className="section-container">
          <motion.div {...fade(0)} className="text-center mb-16">
            <p className="text-primary-500 font-semibold text-sm uppercase tracking-widest mb-3">Process</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* connector line – desktop */}
            <div className="hidden lg:block absolute top-10 left-24 right-24 h-px bg-gradient-to-r from-primary-200 via-accent/40 to-emerald-200 dark:from-primary-800 dark:to-emerald-800" />

            {steps.map((s, i) => (
              <motion.div key={i} {...fade(i * 0.15)} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                  style={{ background: 'linear-gradient(135deg, #3585ff, #6366F1)' }}>
                  <span className="font-heading font-black text-2xl text-white">{s.num}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 section-container">
        <motion.div
          {...fade(0)}
          className="glass-card p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(53,133,255,0.08), rgba(99,102,241,0.08))',
            border: '1px solid rgba(53,133,255,0.15)',
          }}
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: '#3585ff' }} />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: '#6366F1' }} />

          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">"Landed my dream job after CVyntra suggested 3 key improvements."</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Ready to Land Your{' '}
            <span className="gradient-text">Dream Job?</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Join thousands of job seekers who improved their ATS scores and got more interviews.
          </p>
          <Link to="/analyze" className="btn-primary text-lg py-4 px-10 inline-flex">
            <Upload className="w-5 h-5" />
            Start Free Analysis
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">No sign-up required · Instant results</p>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-white/5 py-8">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary-500" />
            <span className="font-heading font-bold text-gray-700 dark:text-gray-300">CVyntra AI</span>
          </div>
          <p className="text-sm text-gray-400">© 2025 CVyntra AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
