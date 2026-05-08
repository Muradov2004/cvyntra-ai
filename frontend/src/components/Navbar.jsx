import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, Zap, FileText } from 'lucide-react'

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/analyze', label: 'Analyze' },
    { href: '/results', label: 'Results' },
  ]

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card px-6 py-3 flex items-center justify-between"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3585ff, #6366F1)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg">
              <span className="gradient-text">CVyntra</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium"> AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${location.pathname === link.href
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer
                bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/analyze" className="btn-primary text-sm py-2 px-4 hidden sm:flex">
              <FileText className="w-4 h-4" />
              Analyze CV
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}
