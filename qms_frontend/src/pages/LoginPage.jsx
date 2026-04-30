import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'
import axios from 'axios'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/login', { username, password })
      const { token, role, userName } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ role, userName }))

      if (role === 'ADMIN') {
        window.location.href = '/admin/dashboard'
      } else if (role === 'INTERVIEWER') {
        window.location.href = '/interviewer/dashboard'
      } else {
        setError('Access denied: Unauthorized role')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 sm:p-6">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-100 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-50 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-black tracking-tight">QMS Portal</h1>
          <p className="text-gray-500 mt-2">Sign in as Admin or Interviewer</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="h-2 bg-teal-600 w-full" />

          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5 group">
              <div className="relative">
                <AnimatePresence>
                  {!username && (
                    <motion.label
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      htmlFor="username"
                      className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200"
                    >
                      Username or Email
                    </motion.label>
                  )}
                </AnimatePresence>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${username ? 'text-teal-600' : 'text-gray-400'}`}>
                  <User size={20} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-black focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all duration-300"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="relative">
                <AnimatePresence>
                  {!password && (
                    <motion.label
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      htmlFor="password"
                      className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200"
                    >
                      Password
                    </motion.label>
                  )}
                </AnimatePresence>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${password ? 'text-teal-600' : 'text-gray-400'}`}>
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-black focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all duration-300"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer hidden" />
                  <div className="w-5 h-5 border-2 border-gray-200 rounded-md bg-white peer-checked:bg-teal-600 peer-checked:border-teal-600 transition-all duration-200" />
                  <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg size={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-gray-400 mt-10 text-sm">
          Protected by SecureLayer 2.0 &bull; &copy; 2026 QMS Systems
        </p>
      </motion.div>
    </div>
  )
}
