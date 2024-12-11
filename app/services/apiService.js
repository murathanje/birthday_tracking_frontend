const API_URL = 'http://localhost:5050/api/v1'

async function handleResponse(response) {
  try {
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/auth/login'
      }
      throw new Error(data.message || 'Something went wrong')
    }
    
    return { data }
  } catch (error) {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    throw error
  }
}

async function fetchWithAuth(url, options = {}) {
  try {
    const token = localStorage.getItem('token')
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }

    const response = await fetch(`${API_URL}${url}`, config)
    return handleResponse(response)
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    throw error
  }
}

export const apiService = {
  get: (url) => fetchWithAuth(url),
  
  post: (url, data) => fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (url, data) => fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (url) => fetchWithAuth(url, {
    method: 'DELETE'
  })
} 