'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiService } from '../services/apiService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await apiService.get('/users/me')
      setUser(response.data)
    } catch (error) {
      console.error('Auth check failed:', error.message)
      if (error.message.includes('Unable to connect to the server')) {
        // If it's a connection error, don't remove the token or redirect
        console.log('Server connection failed, will retry on next refresh')
      } else {
        // For other errors (like invalid token), remove token and redirect
        localStorage.removeItem('token')
        router.push('/auth/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await apiService.post('/login', { email, password })
      const { token } = response.data
      localStorage.setItem('token', token)
      await checkAuth()
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error.message)
      throw error
    }
  }

  const register = async ({ name, email, password }) => {
    try {
      // Register the user according to swagger.json format
      const registerData = {
        name,
        email,
        password
      }
      
      // Register user
      const response = await apiService.post('/register', registerData)
      
      // After successful registration, log them in
      await login(email, password)
      
      return response.data
    } catch (error) {
      console.error('Registration failed:', error.message)
      // Throw a more descriptive error based on the response
      if (error.message.includes('400')) {
        throw new Error('Invalid registration data. Please check your inputs.')
      } else if (error.message.includes('409')) {
        throw new Error('Email already exists. Please use a different email.')
      } else {
        throw new Error('Registration failed. Please try again.')
      }
    }
  }

  const updateProfile = async (updateData) => {
    try {
      const response = await apiService.put('/users/me', updateData)
      setUser(response.data)
      return response.data
    } catch (error) {
      console.error('Profile update failed:', error.message)
      throw new Error(error.message || 'Failed to update profile')
    }
  }

  const deleteAccount = async () => {
    try {
      await apiService.delete('/users/me')
      localStorage.removeItem('token')
      setUser(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Account deletion failed:', error.message)
      throw new Error(error.message || 'Failed to delete account')
    }
  }

  const logout = async () => {
    try {
      // No logout endpoint in the API, just clear local state
      localStorage.removeItem('token')
      setUser(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error.message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    deleteAccount,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 