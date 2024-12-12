'use client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()
  if (!response.ok) {
    // Get the error message from the response data or use a default message
    const errorMessage = data.error || data.message || 'Something went wrong'
    throw new Error(errorMessage)
  }
  return data
}

// Auth API
export const authApi = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      return handleResponse(response)
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      return handleResponse(response)
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  },
}

// User API
export const userApi = {
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return handleResponse(response)
  },

  updateProfile: async (token, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },

  deleteAccount: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return handleResponse(response)
  },
}

// Birthday API
export const birthdayApi = {
  getAllBirthdays: async (token) => {
    const response = await fetch(`${API_BASE_URL}/birthdays`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return handleResponse(response)
  },

  getBirthday: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/birthdays/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return handleResponse(response)
  },

  createBirthday: async (token, birthdayData) => {
    const response = await fetch(`${API_BASE_URL}/birthdays`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthdayData),
    })
    return handleResponse(response)
  },

  updateBirthday: async (token, id, birthdayData) => {
    const response = await fetch(`${API_BASE_URL}/birthdays/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthdayData),
    })
    return handleResponse(response)
  },

  deleteBirthday: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/birthdays/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return handleResponse(response)
  },
} 