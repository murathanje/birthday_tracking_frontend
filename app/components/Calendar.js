'use client'

import { useState, useMemo } from 'react'
import { useBirthday } from '../contexts/BirthdayContext'

export default function Calendar({ onEditFriend }) {
  const { birthdays, loading } = useBirthday()
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [slideDirection, setSlideDirection] = useState('none')

  const calendar = useMemo(() => {
    const year = 2024
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    const totalDays = firstDayOfWeek + lastDay.getDate()
    const totalWeeks = Math.ceil(totalDays / 7)
    
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
    if (!date || !birthdays) return []
    return birthdays.filter(birthday => {
      const [month, day] = birthday.birth_date.split('-').map(Number)
      return day === date.getDate() && month === date.getMonth() + 1
    })
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

  const navigateMonth = (direction) => {
    setSlideDirection(direction > 0 ? 'left' : 'right')
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
    setTimeout(() => setSlideDirection('none'), 500)
  }

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50 flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  // Add empty state message if no birthdays
  if (!loading && (!birthdays || birthdays.length === 0)) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft border border-slate-200/50">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-black">Calendar</h2>
        </div>
        <div className="flex items-center justify-center h-[300px] sm:h-[500px]">
          <div className="text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-base sm:text-lg font-semibold text-black mb-2">Your Calendar is Empty</h3>
            <p className="text-sm sm:text-base text-black/60">Add your first birthday to see it on the calendar</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft border border-slate-200/50">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-black">Calendar</h2>
        <div className="flex items-center gap-2 sm:gap-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 sm:p-2 rounded-xl text-black hover:text-black hover:bg-slate-100 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm sm:text-lg font-medium text-black min-w-[80px] sm:min-w-[140px] text-center">
            {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 sm:p-2 rounded-xl text-black hover:text-black hover:bg-slate-100 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-black/60 mb-2 sm:mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-1">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center">
        {calendar.map((date, index) => {
          const birthdays = getBirthdaysForDate(date)
          const isToday = date && 
            new Date().getDate() === date.getDate() && 
            new Date().getMonth() === date.getMonth()
          
          return (
            <div
              key={index}
              className={`min-h-[60px] sm:min-h-[120px] border-b border-r border-slate-200/50 last:border-r-0 animate-fade-in ${
                getCalendarDayClass(date, isToday, birthdays)
              }`}
              style={{ animationDelay: `${index * 10}ms` }}
            >
              {date && (
                <div className="p-1 sm:p-2 h-full">
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs sm:text-sm transition-transform hover:scale-110 ${
                        isToday
                          ? 'bg-black text-white font-medium'
                          : 'text-black'
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    
                    {birthdays.length > 0 && (
                      <span
                        className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-slate-100 text-black rounded-full text-[10px] sm:text-xs font-medium animate-pop-in"
                      >
                        {birthdays.length}
                      </span>
                    )}
                  </div>

                  {birthdays.length > 0 && (
                    <div className="mt-1 sm:mt-2 space-y-1">
                      {birthdays.map((birthday, idx) => (
                        <div
                          key={birthday.id}
                          onClick={() => onEditFriend(birthday)}
                          className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-slate-100 text-black truncate hover:bg-slate-200 transition-all duration-200 hover:scale-102 cursor-pointer animate-slide-in"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span className="mr-1 text-xs sm:text-sm">🎂</span>
                          {birthday.name}
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
  )
} 