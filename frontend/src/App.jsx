import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AnalyzePage from './pages/AnalyzePage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('cvyntra-dark') === 'true'
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('cvyntra-dark', darkMode)
  }, [darkMode])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className="min-h-screen bg-mesh transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analyze" element={<AnalyzePage showToast={showToast} />} />
          <Route path="/results" element={<ResultsPage showToast={showToast} />} />
        </Routes>
      </AnimatePresence>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
