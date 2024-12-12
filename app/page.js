'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from './components/Header'

// Custom hook for scroll animations
function useScrollAnimation() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          observer.unobserve(entry.target) // Stop observing once animated
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const animatedElements = document.querySelectorAll('.scroll-animation')

    animatedElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

// Predefined positions for decorative elements
const DECORATIVE_ELEMENTS = [
  { top: '20%', left: '15%', scale: '0.6', delay: '0s' },
  { top: '70%', left: '80%', scale: '0.7', delay: '0.2s' },
  { top: '40%', left: '25%', scale: '0.5', delay: '0.4s' },
  { top: '85%', left: '40%', scale: '0.8', delay: '0.6s' },
  { top: '15%', left: '75%', scale: '0.6', delay: '0.8s' }
]

export default function Home() {
  useScrollAnimation()

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-soft-light"></div>
      
      {/* Multiple gradient layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-spotlight from-secondary-200/40 via-teal-200/30 to-transparent animate-spotlight"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-cosmic animate-cosmic"></div>
        <div className="absolute inset-0 bg-gradient-radial from-secondary-100/20 via-transparent to-transparent"></div>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large orbs */}
        <div className="absolute -top-20 right-0 w-[800px] h-[800px] bg-gradient-candy from-secondary-200/50 via-teal-200/40 to-primary-200/50 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-[800px] h-[800px] bg-gradient-candy from-teal-200/50 via-primary-200/40 to-secondary-200/50 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-radial from-rose-200/40 to-transparent rounded-full blur-2xl animate-spotlight"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-radial from-primary-200/30 to-transparent rounded-full blur-xl animate-float"></div>
        
        {/* Small decorative shapes with predefined positions */}
        {DECORATIVE_ELEMENTS.map((element, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-white/30 rounded-full blur-sm animate-float"
            style={{
              top: element.top,
              left: element.left,
              transform: `scale(${element.scale})`,
              animationDelay: element.delay
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        .scroll-animation {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animation.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .scroll-animation-delay-1 {
          transition-delay: 0.2s;
        }

        .scroll-animation-delay-2 {
          transition-delay: 0.4s;
        }

        .scroll-animation-delay-3 {
          transition-delay: 0.6s;
        }

        .scroll-animation-fade {
          opacity: 0;
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animation-fade.animate-in {
          opacity: 1;
        }

        .scroll-animation-scale {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animation-scale.animate-in {
          opacity: 1;
          transform: scale(1);
        }

        .scroll-animation-left {
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animation-left.animate-in {
          opacity: 1;
          transform: translateX(0);
        }

        .scroll-animation-right {
          opacity: 0;
          transform: translateX(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animation-right.animate-in {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* Main content */}
      <div className="relative">
        <Header />

        {/* Hero section */}
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-12">
              {/* Animated logo */}
              <div className="scroll-animation scroll-animation-scale">
                <div className="animate-float inline-block">
                  <div className="relative">
                    <span className="text-7xl sm:text-8xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🎂</span>
                    <div className="absolute -inset-8 bg-gradient-radial from-secondary-300/30 to-transparent rounded-full blur-2xl animate-pulse-slow"></div>
                    <div className="absolute -inset-4 bg-gradient-radial from-teal-300/30 to-transparent rounded-full blur-xl animate-spotlight"></div>
                  </div>
                </div>
              </div>

              {/* Hero text */}
              <div className="space-y-8 relative">
                <div className="scroll-animation">
                  <h1 className="relative text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                    <span className="text-slate-800">Celebrate Every</span>
                    <span className="block mt-2 bg-gradient-to-r from-secondary-600 via-teal-600 to-primary-600 bg-clip-text text-transparent">
                      Special Moment
                    </span>
                  </h1>
                </div>
                <div className="scroll-animation scroll-animation-delay-1">
                  <p className="relative text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Never miss a birthday again! Keep track of your friends and family&apos;s special days with our intuitive reminder system.
                  </p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <div className="scroll-animation scroll-animation-left scroll-animation-delay-2">
                  <Link
                    href="/auth/register"
                    className="group relative px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-secondary-500 via-teal-500 to-primary-500 text-white shadow-soft hover:shadow-glow-multi transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="absolute inset-0 rounded-full bg-gradient-shine bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative inline-flex items-center">
                      Begin Your Journey
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </div>
                <div className="scroll-animation scroll-animation-right scroll-animation-delay-2">
                  <Link
                    href="/auth/login"
                    className="group px-8 py-4 text-lg font-medium rounded-full text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white/95 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50 shadow-soft hover:shadow-soft-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative">Sign In</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Features section */}
            <div className="mt-32 space-y-20">
              {/* Main features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  {
                    icon: '🎂',
                    title: 'Smart Reminders',
                    description: 'Never miss a birthday with intelligent notifications and timely reminders.',
                    gradient: 'from-secondary-500 via-teal-500 to-primary-500'
                  },
                  {
                    icon: '✨',
                    title: 'Beautiful Calendar',
                    description: 'View upcoming birthdays in an elegant, easy-to-read calendar interface.',
                    gradient: 'from-teal-500 via-primary-500 to-secondary-500'
                  },
                  {
                    icon: '🎯',
                    title: 'Personal Touch',
                    description: 'Add notes and gift ideas to make each celebration more meaningful.',
                    gradient: 'from-primary-500 via-secondary-500 to-teal-500'
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`scroll-animation scroll-animation-delay-${index + 1}`}
                  >
                    <div className="group relative backdrop-blur-sm rounded-2xl p-8 hover:transform hover:scale-102 transition-all duration-300">
                      <div className="absolute inset-0 rounded-2xl bg-white/80 shadow-soft group-hover:shadow-soft-lg transition-shadow duration-500"></div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-soft opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 rounded-2xl border border-slate-200/50 group-hover:border-slate-300/50 transition-colors duration-500"></div>
                      
                      <div className="relative space-y-4">
                        <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 group-hover:text-slate-700 transition-colors">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional features section */}
              <div className="text-center space-y-12">
                <div className="scroll-animation">
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-secondary-600 via-teal-600 to-primary-600 bg-clip-text text-transparent">
                    Why Choose Birthday Tracker?
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: '📱',
                      title: 'Mobile Friendly',
                      description: 'Access your birthday list anywhere, anytime.'
                    },
                    {
                      icon: '🔔',
                      title: 'Custom Alerts',
                      description: 'Set personalized reminders for each birthday.'
                    },
                    {
                      icon: '🎁',
                      title: 'Gift Registry',
                      description: 'Keep track of gift ideas year-round.'
                    },
                    {
                      icon: '🔒',
                      title: 'Secure & Private',
                      description: 'Your data is always safe and protected.'
                    }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`scroll-animation scroll-animation-delay-${index % 3 + 1}`}
                    >
                      <div className="group p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/50 shadow-soft hover:shadow-soft-lg transition-all duration-300 min-h-[200px]">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
