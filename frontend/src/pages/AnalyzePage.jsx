import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, X, Zap, AlertCircle, CheckCircle, File,
  ChevronRight, Brain
} from 'lucide-react'
import AILoader from '../components/AILoader.jsx'
import { analyzeCV } from '../services/api.js'

const ACCEPTED = '.pdf,.docx'
const MAX_MB = 5

export default function AnalyzePage({ showToast }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [jobDesc, setJobDesc] = useState('')
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState('idle') // idle | uploading | processing | error | success
  const [loaderStep, setLoaderStep] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  /* ── helpers ── */
  const acceptFile = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx'].includes(ext)) {
      setErrorMsg('Only PDF and DOCX files are supported.')
      setStatus('error')
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrorMsg(`File is too large. Max size is ${MAX_MB} MB.`)
      setStatus('error')
      return
    }
    setFile(f)
    setStatus('idle')
    setErrorMsg('')
  }

  /* ── drag events ── */
  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    acceptFile(e.dataTransfer.files[0])
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  /* ── analyze ── */
  const handleAnalyze = async () => {
    if (!file) {
      showToast('Please upload a resume first.', 'warning')
      return
    }
    setStatus('uploading')
    setLoaderStep(0)

    try {
      // Simulate multi-step progress
      const t1 = setTimeout(() => setLoaderStep(1), 1200)
      const t2 = setTimeout(() => setLoaderStep(2), 2800)

      const result = await analyzeCV(file, jobDesc)

      clearTimeout(t1); clearTimeout(t2)
      setStatus('success')

      // Store result and navigate
      sessionStorage.setItem('cvyntra-result', JSON.stringify(result))
      sessionStorage.setItem('cvyntra-filename', file.name)
      showToast('Analysis complete!', 'success')
      navigate('/results')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      showToast('Analysis failed. ' + (err.message || ''), 'error')
    }
  }

  const resetAll = () => {
    setFile(null)
    setStatus('idle')
    setErrorMsg('')
    setJobDesc('')
  }

  /* ── file icon ── */
  const fileColor = file?.name.endsWith('.pdf') ? 'text-rose-500' : 'text-blue-500'

  const isProcessing = status === 'uploading' || status === 'processing'

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="section-container max-w-3xl">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-medium
            bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400
            border border-primary-100 dark:border-primary-800">
            <Brain className="w-4 h-4" />
            AI Resume Analyzer
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Analyze Your <span className="gradient-text">Resume</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Upload your PDF or DOCX resume. Optionally add a job description for a targeted match analysis.
          </p>
        </motion.div>

        {/* AI Loader overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-8 mb-8"
            >
              <AILoader step={loaderStep} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isProcessing && (
          <>
            {/* Error banner */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20
                    border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drop zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card mb-6 overflow-hidden"
            >
              <div
                className={`drag-zone rounded-2xl m-1 p-12 flex flex-col items-center justify-center gap-5 cursor-pointer
                  ${dragging ? 'active' : ''}`}
                onClick={() => !file && inputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED}
                  className="hidden"
                  onChange={(e) => acceptFile(e.target.files[0])}
                />

                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file-preview"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center gap-4 w-full"
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${fileColor}`}>
                        <File className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {(file.size / 1024).toFixed(1)} KB &middot; {file.name.split('.').pop().toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Ready to analyze
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); resetAll() }}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400
                            hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload-prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(53,133,255,0.1), rgba(99,102,241,0.1))' }}>
                        <Upload className="w-8 h-8 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
                          Drag &amp; drop your resume here
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                          or click to browse &middot; PDF &amp; DOCX supported &middot; Max {MAX_MB}MB
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                          className="btn-secondary text-sm py-2 px-5 cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          Browse Files
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 mb-6"
            >
              <label className="block mb-3">
                <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  Job Description
                  <span className="text-xs text-gray-400 font-normal ml-1">(optional – for match scoring)</span>
                </span>
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={6}
                placeholder="Paste the job description here to get a tailored match score and relevant improvement suggestions..."
                className="w-full rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200
                  bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10
                  placeholder-gray-400 dark:placeholder-gray-600
                  focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                  transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                {jobDesc.length} characters &middot; Recommended: 100–2000 characters
              </p>
            </motion.div>

            {/* Analyze Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className={`flex-1 btn-primary text-base py-4 justify-center
                  ${!file ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              >
                <Brain className="w-5 h-5" />
                Analyze with AI
                <ChevronRight className="w-4 h-4" />
              </button>
              {file && (
                <button
                  onClick={resetAll}
                  className="btn-secondary text-base py-4 px-6 justify-center"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              )}
            </motion.div>

            {/* tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: '🔒', title: 'Private & Secure', desc: 'Files are processed and never stored.' },
                { icon: '⚡', title: 'Instant Results', desc: 'AI analysis completes in under 10 seconds.' },
                { icon: '📊', title: 'Detailed Report', desc: 'ATS score, gaps, suggestions and more.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/80 dark:bg-white/5">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">{title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.main>
  )
}
