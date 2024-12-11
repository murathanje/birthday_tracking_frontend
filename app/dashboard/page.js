'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useBirthday } from '../contexts/BirthdayContext'
import AddNewEvent from '../components/AddNewEvent'
import Calendar from '../components/Calendar'
import Overview from '../components/Overview'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { birthdays, loading: birthdaysLoading, fetchBirthdays } = useBirthday()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingFriend, setEditingFriend] = useState(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login')
      } else {
        fetchBirthdays()
      }
    }
  }, [user, authLoading])

  const categories = [
    'all',
    'family',
    'friends',
    'colleagues',
    'classmates',
    'relatives',
    'childhood_friends',
    'neighbors',
    'mentors',
    'clients',
    'partners',
    'others'
  ]

  const calculateDaysUntilBirthday = (birth_date) => {
    if (!birth_date) return 0
    
    const today = new Date()
    const [month, day] = birth_date.split('-').map(Number)
    const bDay = new Date(today.getFullYear(), month - 1, day)
    
    if (today > bDay) {
      bDay.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = bDay - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleEditFriend = (friend) => {
    setEditingFriend(friend)
    setActiveTab('add')
  }

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    { 
      id: 'calendar', 
      label: 'Calendar',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'add', 
      label: 'Add Birthday',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    }
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-slate-50 p-6 pt-24 space-y-6">
      {/* Header Section with Animation */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-slate-200/50">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-black mb-2 animate-fade-in">
            Welcome {user.name}
          </h1>
          <p className="text-lg text-black/70 max-w-2xl animate-fade-in animation-delay-100">
            Keep track of your friends&apos; special days and never miss a celebration
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              {
                label: 'Total Events',
                value: birthdays.length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                label: 'Upcoming Events',
                value: birthdays.filter(birthday => {
                  const daysUntil = calculateDaysUntilBirthday(birthday.birth_date)
                  return daysUntil >= 0 && daysUntil <= 30
                }).length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                label: 'This Month',
                value: birthdays.filter(birthday => {
                  const [month] = birthday.birth_date.split('-').map(Number)
                  return month === new Date().getMonth() + 1
                }).length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                label: 'Categories',
                value: [...new Set(birthdays.map(b => b.category))].length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                )
              }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="relative group bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:border-black/5 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/5 text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-black">
                      {stat.value}
                    </div>
                    <div className="text-sm text-black/60 group-hover:text-black/80 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/[0.03] to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/20 via-emerald-500/20 to-yellow-500/20 blur-3xl opacity-20 animate-pulse animation-delay-500" />
      </div>

      {/* Tabs Section */}
      <div className="flex space-x-2 px-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white shadow-soft text-black'
                : 'text-black/70 hover:bg-white/50 hover:text-black'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <Overview 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onEditFriend={handleEditFriend}
            categories={categories}
            calculateDaysUntilBirthday={calculateDaysUntilBirthday}
          />
        )}

        {activeTab === 'calendar' && (
          <Calendar onEditFriend={handleEditFriend} />
        )}

        {activeTab === 'add' && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <AddNewEvent 
              onClose={() => {
                setActiveTab('overview')
                setEditingFriend(null)
              }}
              editFriend={editingFriend}
            />
          </div>
        )}
      </div>
    </div>
  )
} 