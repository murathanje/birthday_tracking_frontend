'use client'

import Header from '../components/Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Background effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-spotlight from-secondary-200/30 via-teal-200/20 to-transparent animate-spotlight"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-60"></div>
      </div>

      {/* Decorative orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-candy from-secondary-200/30 via-teal-200/20 to-primary-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-candy from-teal-200/30 via-primary-200/20 to-secondary-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative">
        <Header />
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 