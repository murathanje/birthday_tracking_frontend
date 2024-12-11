'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfileEdit from './ProfileEdit'

export default function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showProfileEdit, setShowProfileEdit] = useState(false)

  // Determine if we're on the landing page
  const isLandingPage = pathname === '/'
  // Determine if we're on an auth page
  const isAuthPage = pathname.startsWith('/auth/')
  // Determine if we're on the dashboard
  const isDashboard = pathname.startsWith('/dashboard')

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
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
                  href="/auth/login"
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
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowProfileEdit(true)}
                    className="px-6 py-2 rounded-full text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50 shadow-soft hover:shadow-soft-lg"
                  >
                    <span className="relative inline-flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {user?.name}
                    </span>
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-full text-slate-600 hover:text-slate-900 transition-all duration-300 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50 shadow-soft hover:shadow-soft-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <ProfileEdit onClose={() => setShowProfileEdit(false)} />
        </div>
      )}
    </>
  )
} 