'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  // Determine if we're on the landing page
  const isLandingPage = pathname === '/'
  // Determine if we're on an auth page
  const isAuthPage = pathname.startsWith('/auth/')
  // Determine if we're on the dashboard
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 ${!isLandingPage ? 'bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-soft' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-secondary-600 via-teal-600 to-primary-600 bg-clip-text text-transparent"
          >
            Celebry
          </Link>
          
          <div className="flex items-center space-x-4">
            {isLandingPage && (
              <Link 
                href="/dashboard"
                className="group px-6 py-2 rounded-full text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50 shadow-soft hover:shadow-soft-lg"
              >
                <span className="relative inline-flex items-center">
                  Sign In
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )}

            {isAuthPage && (
              <Link 
                href="/"
                className="px-6 py-2 rounded-full text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50 shadow-soft hover:shadow-soft-lg"
              >
                Back to Home
              </Link>
            )}

            {isDashboard && (
              <Link 
                href="/"
                className="px-6 py-2 rounded-full text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50 shadow-soft hover:shadow-soft-lg"
              >
                Logout
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 