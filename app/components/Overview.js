'use client'

import { useMemo } from 'react'
import { useBirthday } from '../contexts/BirthdayContext'

export default function Overview({ 
  searchQuery, 
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onEditFriend,
  categories
}) {
  const { birthdays, loading, error } = useBirthday()
  
  const calculateDaysUntilBirthday = (birth_date) => {
    if (!birth_date) return 0
    
    const today = new Date()
    const [month, day] = birth_date.split('-').map(Number)
    const thisYear = today.getFullYear()
    
    // Create dates for this year and next year
    const birthdayThisYear = new Date(thisYear, month - 1, day)
    const birthdayNextYear = new Date(thisYear + 1, month - 1, day)
    
    // Calculate differences
    const diffThisYear = birthdayThisYear - today
    const diffNextYear = birthdayNextYear - today
    
    // Convert to days and round
    const daysUntilThisYear = Math.ceil(diffThisYear / (1000 * 60 * 60 * 24))
    const daysUntilNextYear = Math.ceil(diffNextYear / (1000 * 60 * 60 * 24))
    
    // If this year's birthday has passed, return negative days
    if (daysUntilThisYear < 0) {
      return daysUntilThisYear
    }
    
    // Otherwise return days until next occurrence
    return daysUntilThisYear
  }
  
  const sortedAndFilteredFriends = useMemo(() => {
    if (!birthdays) return []
    
    let filtered = [...birthdays]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(friend => 
        friend.name.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(friend => 
        friend.category === selectedCategory
      )
    }

    // Separate upcoming and past birthdays
    const upcoming = []
    const past = []

    filtered.forEach(friend => {
      const daysUntil = calculateDaysUntilBirthday(friend.birth_date)
      if (daysUntil >= 0) {
        upcoming.push({ ...friend, daysUntil })
      } else {
        past.push({ ...friend, daysUntil })
      }
    })

    // Sort upcoming by closest first
    upcoming.sort((a, b) => a.daysUntil - b.daysUntil)
    // Sort past by most recently passed
    past.sort((a, b) => b.daysUntil - a.daysUntil)

    // Combine with upcoming first, then past
    return [...upcoming, ...past]

  }, [birthdays, searchQuery, selectedCategory])

  const categoryIcons = {
    all: '👥',
    family: '👨‍👩‍👦',
    friends: '🤝',
    colleagues: '💼',
    classmates: '🎓',
    relatives: '👨‍👩‍👦',
    childhood_friends: '🧸',
    neighbors: '🏠',
    mentors: '🎯',
    clients: '🤝',
    partners: '🤝',
    others: '✨'
  }

  const formatDaysText = (daysUntil) => {
    if (daysUntil === 0) return 'Today!'
    
    if (daysUntil > 0) {
      return `${daysUntil} day${daysUntil === 1 ? '' : 's'} left`
    } else {
      // For past birthdays, calculate days since last birthday
      const daysPassed = Math.abs(daysUntil)
      return `${daysPassed} day${daysPassed === 1 ? '' : 's'} past`
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50 flex items-center justify-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-black mb-2">Error loading birthdays</h3>
            <p className="text-black/60">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search friends..."
              className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black placeholder-black/30"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-10" />
            <div className="overflow-x-auto pb-3 -mb-3 scrollbar-thin scroll-smooth mx-2">
              <div className="flex gap-3 px-4">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`
                      group relative shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out
                      ${selectedCategory === category
                        ? 'bg-gradient-to-r from-black to-slate-800 text-white shadow-lg scale-105'
                        : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:text-black hover:bg-white hover:scale-105 hover:shadow-md'
                      }
                      border border-slate-200/50 hover:border-slate-300
                    `}
                  >
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      <span className="text-lg">{categoryIcons[category]}</span>
                      {category === 'all' ? 'All Categories' : category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {sortedAndFilteredFriends.map((friend) => {
            const daysUntil = calculateDaysUntilBirthday(friend.birth_date)
            const isUpcoming = daysUntil <= 7 && daysUntil >= 0
            const isPast = daysUntil < 0

            return (
              <div
                key={friend.id}
                onClick={() => onEditFriend(friend)}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer ${
                  isUpcoming ? 'ring-2 ring-black/20' : 'border border-slate-200/50'
                } ${isPast ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-black group-hover:text-black/70">
                      {friend.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-black/60">
                        {new Date(2024, parseInt(friend.birth_date.split('-')[0]) - 1, parseInt(friend.birth_date.split('-')[1])).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-black/70 capitalize flex items-center gap-1.5">
                        <span>{categoryIcons[friend.category]}</span>
                        {friend.category}
                      </span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isUpcoming ? 'bg-black text-white' : 'bg-slate-100 text-black/70'
                  }`}>
                    {formatDaysText(daysUntil)}
                  </div>
                </div>
              </div>
            )
          })}

          {sortedAndFilteredFriends.length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-slate-200/50">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-black mb-2">No birthdays found</h3>
              <p className="text-black/60">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 