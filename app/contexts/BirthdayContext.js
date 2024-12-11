'use client'

import { createContext, useContext, useState } from 'react'
import { apiService } from '../services/apiService'

const BirthdayContext = createContext()

export function BirthdayProvider({ children }) {
  const [birthdays, setBirthdays] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBirthdays = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/birthdays')
      setBirthdays(response.data)
      setError(null)
    } catch (error) {
      console.error('Failed to fetch birthdays:', error)
      setError('Failed to load birthdays')
    } finally {
      setLoading(false)
    }
  }

  const createBirthday = async (birthdayData) => {
    try {
      const response = await apiService.post('/birthdays', birthdayData)
      setBirthdays(prev => [...prev, response.data])
      return response.data
    } catch (error) {
      console.error('Failed to create birthday:', error)
      throw new Error(error.message || 'Failed to create birthday')
    }
  }

  const updateBirthday = async (id, birthdayData) => {
    try {
      const response = await apiService.put(`/birthdays/${id}`, birthdayData)
      setBirthdays(prev => prev.map(birthday => 
        birthday.id === id ? response.data : birthday
      ))
      return response.data
    } catch (error) {
      console.error('Failed to update birthday:', error)
      throw new Error(error.message || 'Failed to update birthday')
    }
  }

  const deleteBirthday = async (id) => {
    try {
      await apiService.delete(`/birthdays/${id}`)
      setBirthdays(prev => prev.filter(birthday => birthday.id !== id))
    } catch (error) {
      console.error('Failed to delete birthday:', error)
      throw new Error(error.message || 'Failed to delete birthday')
    }
  }

  const value = {
    birthdays,
    loading,
    error,
    fetchBirthdays,
    createBirthday,
    updateBirthday,
    deleteBirthday
  }

  return (
    <BirthdayContext.Provider value={value}>
      {children}
    </BirthdayContext.Provider>
  )
}

export function useBirthday() {
  const context = useContext(BirthdayContext)
  if (!context) {
    throw new Error('useBirthday must be used within a BirthdayProvider')
  }
  return context
} 