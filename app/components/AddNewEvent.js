'use client'

import { useState, useEffect } from 'react'
import { useBirthday } from '../contexts/BirthdayContext'

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

export default function AddNewEvent({ onClose, editFriend = null }) {
  const { createBirthday, updateBirthday, deleteBirthday } = useBirthday()
  const [newFriend, setNewFriend] = useState({ 
    name: '', 
    birthday: {
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    category: 'friends',
    notes: ''
  })
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editFriend) {
      const [month, day] = editFriend.birth_date.split('-').map(Number)
      setNewFriend({
        name: editFriend.name,
        birthday: {
          month,
          day
        },
        category: editFriend.category,
        notes: editFriend.notes || ''
      })
    }
  }, [editFriend])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formattedMonth = String(newFriend.birthday.month).padStart(2, '0')
      const formattedDay = String(newFriend.birthday.day).padStart(2, '0')
      const birth_date = `${formattedMonth}-${formattedDay}`

      const birthdayData = {
        name: newFriend.name,
        birth_date,
        category: newFriend.category,
        notes: newFriend.notes || undefined // Only send notes if it's not empty
      }

      if (editFriend) {
        await updateBirthday(editFriend.id, birthdayData)
      } else {
        await createBirthday(birthdayData)
      }

      onClose()
    } catch (error) {
      setError(error.message || 'Failed to save birthday')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!editFriend) return

    const confirmDelete = window.confirm('Are you sure you want to delete this birthday?')
    if (!confirmDelete) return

    setLoading(true)
    try {
      await deleteBirthday(editFriend.id)
      onClose()
    } catch (error) {
      setError(error.message || 'Failed to delete birthday')
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (month) => {
    // Using 2024 as it's a leap year to handle February correctly
    return new Date(2024, month, 0).getDate()
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-black">
            {editFriend ? 'Edit Birthday' : 'Add New Birthday'}
          </h2>
          <p className="text-black/70 mt-1">
            {editFriend ? 'Update birthday information' : 'Add a new birthday to track'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-black/50 hover:text-black transition-colors p-2 rounded-lg hover:bg-slate-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-rose-100 text-rose-600 p-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black text-left hover:border-slate-300 relative font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">
                    {categoryIcons[newFriend.category]}
                  </span>
                  <span>
                    {newFriend.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {isSelectOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  <div className="max-h-60 overflow-y-auto scrollbar-thin">
                    {Object.entries(categoryIcons).filter(([key]) => key !== 'all').map(([category, icon]) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setNewFriend({ ...newFriend, category });
                          setIsSelectOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors duration-150
                          ${newFriend.category === category ? 'bg-slate-50 text-black font-medium' : 'text-black'}
                        `}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-sm font-medium">
                          {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                  value={newFriend.birthday.month}
                  onChange={(e) => {
                    const newMonth = parseInt(e.target.value)
                    const daysInNewMonth = getDaysInMonth(newMonth)
                    setNewFriend({
                      ...newFriend,
                      birthday: {
                        month: newMonth,
                        day: Math.min(newFriend.birthday.day, daysInNewMonth)
                      }
                    })
                  }}
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
                  value={newFriend.birthday.day}
                  onChange={(e) => setNewFriend({
                    ...newFriend,
                    birthday: {
                      ...newFriend.birthday,
                      day: parseInt(e.target.value)
                    }
                  })}
                  className="w-full pl-10 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black appearance-none"
                >
                  {Array.from(
                    { length: getDaysInMonth(newFriend.birthday.month) },
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

          <div>
            <label className="block text-sm font-medium text-black mb-2">Notes (Optional)</label>
            <textarea
              value={newFriend.notes}
              onChange={(e) => setNewFriend({ ...newFriend, notes: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 transition-all duration-200 bg-white text-black placeholder-black/30"
              rows="3"
              placeholder="Add any notes about this birthday"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl text-white bg-black hover:bg-black/90 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (editFriend ? 'Saving...' : 'Adding...') : (editFriend ? 'Save Changes' : 'Add Birthday')}
          </button>

          {editFriend && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 transition-all duration-200 hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 