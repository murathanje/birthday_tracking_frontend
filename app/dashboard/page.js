'use client'

import { useState, useMemo } from 'react'

export default function DashboardPage() {
  const [friends, setFriends] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      birthday: '1990-05-15',
      category: 'family' 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      birthday: '1995-12-25',
      category: 'colleagues' 
    },
  ])

  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFriend, setNewFriend] = useState({ 
    name: '', 
    birthday: {
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    category: 'friends'
  })

  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [slideDirection, setSlideDirection] = useState('none')
  const [editingFriend, setEditingFriend] = useState(null)

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

  const calculateDaysUntilBirthday = (birthdayString) => {
    const today = new Date()
    const birthday = new Date(birthdayString)
    const nextBirthday = new Date(
      today.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    )

    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1)
    }

    const diffTime = nextBirthday - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calendar = useMemo(() => {
    const year = 2024
    const month = currentMonth.getMonth()
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1)
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0)
    
    // Get the day of week for the first day (0-6)
    const firstDayOfWeek = firstDay.getDay()
    
    // Calculate total days needed in the calendar (including padding)
    const totalDays = firstDayOfWeek + lastDay.getDate()
    const totalWeeks = Math.ceil(totalDays / 7)
    
    // Create calendar array
    const calendarDays = []
    let currentDate = 1
    
    for (let i = 0; i < totalWeeks * 7; i++) {
      if (i < firstDayOfWeek || currentDate > lastDay.getDate()) {
        calendarDays.push(null)
      } else {
        calendarDays.push(new Date(year, month, currentDate++))
      }
    }
    
    return calendarDays
  }, [currentMonth])

  const getBirthdaysForDate = (date) => {
    if (!date) return []
    return friends.filter(friend => {
      const bDay = new Date(friend.birthday)
      return bDay.getDate() === date.getDate() && bDay.getMonth() === date.getMonth()
    })
  }

  const sortedAndFilteredFriends = useMemo(() => {
    let filtered = [...friends]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(friend => 
        friend.name.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(friend => 
        friend.category === selectedCategory
      )
    }

    // Sort by upcoming birthday
    return filtered.sort((a, b) => {
      const daysUntilA = calculateDaysUntilBirthday(a.birthday)
      const daysUntilB = calculateDaysUntilBirthday(b.birthday)
      return daysUntilA - daysUntilB
    })
  }, [friends, searchQuery, selectedCategory])

  const formatBirthday = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAddFriend = (e) => {
    e.preventDefault()
    const currentYear = new Date().getFullYear()
    const birthdayString = `${currentYear}-${String(newFriend.month).padStart(2, '0')}-${String(newFriend.day).padStart(2, '0')}`
    
    setFriends([
      ...friends,
      {
        id: friends.length + 1,
        name: newFriend.name,
        birthday: birthdayString,
        category: newFriend.category
      }
    ])
    
    setNewFriend({
      name: '',
      category: 'friends',
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    })
    setActiveTab('overview')
  }

  const handleDeleteFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id))
  }

  const isUpcoming = (birthday) => {
    const days = calculateDaysUntilBirthday(birthday)
    return days <= 7
  }

  const navigateMonth = (direction) => {
    setSlideDirection(direction > 0 ? 'left' : 'right')
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
    // Reset slide direction after animation
    setTimeout(() => setSlideDirection('none'), 500)
  }

  const getCalendarDayClass = (date, isToday, birthdays) => {
    if (!date) return 'bg-white/40'
    
    let classes = 'bg-white relative group hover:bg-slate-50 transition-all duration-200'
    
    if (isToday) {
      classes += ' ring-2 ring-primary-500/50'
    } else if (birthdays.length > 0) {
      classes += ' ring-1 ring-secondary-500/20'
    }
    
    return classes
  }

  const handleEditFriend = (friend) => {
    setEditingFriend({
      ...friend,
      birthday: formatBirthday(friend.birthday)
    })
    setActiveTab('edit')
  }

  const handleUpdateFriend = (e) => {
    e.preventDefault()
    const currentYear = new Date().getFullYear()
    const birthdayString = `${currentYear}-${String(editingFriend.birthday.month).padStart(2, '0')}-${String(editingFriend.birthday.day).padStart(2, '0')}`
    
    setFriends(friends.map(f => 
      f.id === editingFriend.id 
        ? { ...editingFriend, birthday: birthdayString }
        : f
    ))
    setEditingFriend(null)
    setActiveTab('overview')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                        ${selectedCategory === category
                          ? 'bg-black text-white shadow-lg hover:shadow-xl'
                          : 'bg-white text-black hover:bg-black/5'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {/* Category Icons */}
                        {category === 'all' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        )}
                        {category === 'family' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        )}
                        {category === 'friends' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                        {category === 'colleagues' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {category === 'classmates' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        )}
                        {category === 'mentors' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        )}
                        {category === 'clients' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M19.5 10c.5-2.5-2.5-3-4.5-3C13.5 7 12 7.5 12 8.5c0 1.5 2 2 4 3 2.5 1.5 3 4.5 1.5 6.5M12 12c-2-.5-4-1-4-2.5C8 8 9.5 7 11.5 7c2 0 4.5.5 4 3-1 1.5-3 2-4 2z" />
                          </svg>
                        )}
                        {category === 'partners' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        )}
                        {/* Default icon for other categories */}
                        {!['all', 'family', 'friends', 'colleagues', 'classmates', 'mentors', 'clients', 'partners'].includes(category) && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        )}
                        {category === 'all' ? 'All Categories' : category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </div>
                      {selectedCategory === category && (
                        <div className="absolute inset-0 bg-gradient-to-r from-black/[0.03] to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {sortedAndFilteredFriends.map((friend) => {
                const daysUntil = calculateDaysUntilBirthday(friend.birthday)
                const isUpcoming = daysUntil <= 7 && daysUntil >= 0
                const isPast = daysUntil < 0

                return (
                  <div
                    key={friend.id}
                    onClick={() => handleEditFriend(friend)}
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
                            {new Date(friend.birthday).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-black/70 capitalize">
                            {friend.category}
                          </span>
                        </div>
                      </div>
                      <div className={`text-sm px-3 py-1 rounded-full ${
                        isUpcoming 
                          ? 'bg-black text-white'
                          : isPast
                          ? 'bg-slate-100 text-black/60'
                          : 'bg-slate-100 text-black'
                      }`}>
                        {daysUntil === 0
                          ? "Today! 🎉"
                          : daysUntil === 1
                          ? "Tomorrow! 🎈"
                          : daysUntil < 0
                          ? `${Math.abs(daysUntil)} days ago`
                          : `${daysUntil} days left`}
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
        )

      case 'calendar':
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-black">
                Calendar
              </h2>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-xl text-black hover:text-black hover:bg-slate-100 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-lg font-medium text-black min-w-[140px] text-center">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-xl text-black hover:text-black hover:bg-slate-100 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200/50">
              {/* Calendar header */}
              <div className="grid grid-cols-7 bg-slate-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div 
                    key={day}
                    className="p-3 text-center text-sm font-medium text-black border-b border-slate-200/50 animate-fade-in-down"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div 
                className={`grid grid-cols-7 bg-slate-50/50 transition-transform duration-500 ${
                  slideDirection === 'left' ? 'animate-slide-left' : 
                  slideDirection === 'right' ? 'animate-slide-right' : ''
                }`}
              >
                {calendar.map((date, index) => {
                  const birthdays = getBirthdaysForDate(date)
                  const isToday = date && 
                    new Date().getDate() === date.getDate() && 
                    new Date().getMonth() === date.getMonth()
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] border-b border-r border-slate-200/50 last:border-r-0 animate-fade-in ${
                        getCalendarDayClass(date, isToday, birthdays)
                      }`}
                      style={{ animationDelay: `${index * 10}ms` }}
                    >
                      {date && (
                        <div className="p-2 h-full">
                          <div className="flex items-start justify-between">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm transition-transform hover:scale-110 ${
                                isToday
                                  ? 'bg-black text-white font-medium'
                                  : 'text-black'
                              }`}
                            >
                              {date.getDate()}
                            </span>
                            
                            {birthdays.length > 0 && (
                              <span
                                className="flex items-center justify-center w-5 h-5 bg-slate-100 text-black rounded-full text-xs font-medium animate-pop-in"
                              >
                                {birthdays.length}
                              </span>
                            )}
                          </div>
                          
                          {birthdays.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {birthdays.map((friend, idx) => (
                                <div
                                  key={friend.id}
                                  onClick={() => handleEditFriend(friend)}
                                  className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-black truncate hover:bg-slate-200 transition-all duration-200 hover:scale-102 cursor-pointer animate-slide-in"
                                  style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                  <span className="mr-1">🎂</span>
                                  {friend.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      
      case 'add':
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-black">
                  Add New Event
                </h2>
                <p className="text-black/70 mt-1">
                  Add a new birthday to track
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-black/50 hover:text-black transition-colors p-2 rounded-lg hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddFriend} className="space-y-6">
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-200/50">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={newFriend.name}
                      onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                      placeholder="Enter name"
                      className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black placeholder-black/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <select
                      value={newFriend.category}
                      onChange={(e) => setNewFriend({ ...newFriend, category: e.target.value })}
                      className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black"
                    >
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Birthday</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <select
                        value={newFriend.month}
                        onChange={(e) => setNewFriend({ ...newFriend, month: parseInt(e.target.value) })}
                        className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black appearance-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <select
                        value={newFriend.day}
                        onChange={(e) => setNewFriend({ ...newFriend, day: parseInt(e.target.value) })}
                        className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black appearance-none"
                      >
                        {Array.from(
                          { length: new Date(2000, newFriend.month, 0).getDate() },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-xl text-white bg-black hover:bg-black/90 transition-all duration-200 hover:shadow-lg"
              >
                Add Birthday
              </button>
            </form>
          </div>
        )
      
      case 'edit':
        if (!editingFriend) return null
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-black">
                  Edit Event
                </h2>
                <p className="text-black/70 mt-1">
                  Update birthday information
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingFriend(null)
                  setActiveTab('overview')
                }}
                className="text-black/50 hover:text-black transition-colors p-2 rounded-lg hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateFriend} className="space-y-6">
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-200/50">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={editingFriend.name}
                      onChange={(e) => setEditingFriend({ ...editingFriend, name: e.target.value })}
                      className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black placeholder-black/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Category</label>
                  <select
                    value={editingFriend.category}
                    onChange={(e) => setEditingFriend({ ...editingFriend, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Birthday</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <select
                        value={editingFriend.birthday.month}
                        onChange={(e) => setEditingFriend({
                          ...editingFriend,
                          birthday: {
                            ...editingFriend.birthday,
                            month: parseInt(e.target.value)
                          }
                        })}
                        className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black appearance-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <select
                        value={editingFriend.birthday.day}
                        onChange={(e) => setEditingFriend({
                          ...editingFriend,
                          birthday: {
                            ...editingFriend.birthday,
                            day: parseInt(e.target.value)
                          }
                        })}
                        className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black appearance-none"
                      >
                        {Array.from(
                          { length: new Date(2000, editingFriend.birthday.month, 0).getDate() },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl text-white bg-black hover:bg-black/90 transition-all duration-200 hover:shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this birthday?')) {
                      handleDeleteFriend(editingFriend.id)
                      setEditingFriend(null)
                      setActiveTab('overview')
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 transition-all duration-200 hover:border-transparent"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        )
    }
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
      label: 'Add Event',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-slate-50 p-6 pt-24 space-y-6">
      {/* Header Section with Animation */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-slate-200/50">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-black mb-2 animate-fade-in">
            Dashboard
          </h1>
          <p className="text-lg text-black/70 max-w-2xl animate-fade-in animation-delay-100">
            Keep track of your friends&apos; special days and never miss a celebration
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              {
                label: 'Total Events',
                value: friends.length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                label: 'Upcoming Events',
                value: friends.filter(friend => {
                  const daysUntil = calculateDaysUntilBirthday(friend.birthday)
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
                value: friends.filter(friend => {
                  const birthday = new Date(friend.birthday)
                  return birthday.getMonth() === new Date().getMonth()
                }).length,
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                label: 'Categories',
                value: [...new Set(friends.map(f => f.category))].length,
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

      {/* Content Section */}
      {renderTabContent()}
    </div>
  )
} 