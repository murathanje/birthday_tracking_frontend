'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    setLoading(true)

    try {
      await register(formData)
      router.push('/dashboard')
    } catch (error) {
      setError(error.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {/* Background effects */}
      <div className="fixed inset-0 min-h-[150vh]">
        <div className="absolute inset-0 bg-gradient-spotlight from-secondary-200/40 via-teal-200/30 to-transparent animate-spotlight"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-70"></div>
      </div>

      {/* Decorative orbs */}
      <div className="fixed inset-0 min-h-[150vh] overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-0 w-[600px] h-[600px] bg-gradient-candy from-secondary-200/40 via-teal-200/30 to-primary-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-[80vh] -left-32 w-[500px] h-[500px] bg-gradient-candy from-teal-200/40 via-primary-200/30 to-secondary-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Content */}
      <main className="relative flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-24 sm:py-32">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 sm:p-8 space-y-6 sm:space-y-8">
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-2xl backdrop-blur-sm -z-10"></div>
            <div>
              <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-secondary-600 via-teal-600 to-primary-600 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="mt-2 text-center text-sm text-slate-600">
                Join us to start tracking special moments
              </p>
            </div>

            {error && (
              <div className="bg-rose-100 text-rose-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 focus:z-10 sm:text-sm"
                    placeholder="Password (min. 6 characters)"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-secondary-500 via-teal-500 to-primary-500 hover:shadow-glow-multi transform hover:scale-102 transition-all duration-200"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 