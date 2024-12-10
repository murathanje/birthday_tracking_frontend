'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // For development: directly redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-spotlight from-secondary-200/40 via-teal-200/30 to-transparent animate-spotlight"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-70"></div>
      </div>

      {/* Decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-candy from-secondary-200/40 via-teal-200/30 to-primary-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-candy from-teal-200/40 via-primary-200/30 to-secondary-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-8 space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-secondary-600 via-teal-600 to-primary-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Join us to start tracking special moments
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
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
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-secondary-500 via-teal-500 to-primary-500 hover:shadow-glow-multi transform hover:scale-102 transition-all duration-200"
              >
                Create Account
              </button>
            </div>
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
    </div>
  )
} 