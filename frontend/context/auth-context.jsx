"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const isAuthenticated = !!user

  useEffect(() => {
    // Check if user is already logged in (from cookies)
    const storedUser = Cookies.get('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing user data from cookie:", error)
        Cookies.remove('user')
      }
    }
    setLoading(false)
  }, [])

  const updateUser = (newUserData) => {
    try {
      const userDataString = JSON.stringify(newUserData)
      setUser(newUserData)
      Cookies.set('user', userDataString, { expires: 7 })
    } catch (error) {
      console.error("Error storing user data:", error)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      // In a real app, this would make an API call to update the profile
      const updatedUser = { ...user, ...profileData }
      updateUser(updatedUser)
      return true
    } catch (error) {
      throw new Error("Failed to update profile")
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    // This would make an API call in a real app
    return true
  }

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email })
      
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
        credentials: 'include'
      })

      console.log('Login response status:', response.status)
      
      // Get the raw response text first
      const responseText = await response.text()
      console.log('Raw login response:', responseText)

      if (!response.ok) {
        // Try to parse the error message
        let errorMessage = 'Login failed'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || 'Login failed'
        } catch (e) {
          console.error('Error parsing error response:', e)
        }
        throw new Error(errorMessage)
      }

      // Parse the successful response
      let data
      try {
        data = JSON.parse(responseText)
        console.log('Parsed login response:', data)
        
        // Ensure the college name is properly set
        if (data.college) {
          console.log('College name from login:', data.college)
        } else {
          console.warn('No college name in login response')
        }
      } catch (e) {
        console.error('Error parsing success response:', e)
        throw new Error('Invalid response from server')
      }

      // Update user state with the response data
      setUser(data)
      // Store user data in cookie
      Cookies.set('user', JSON.stringify(data), { expires: 7 })
      return data
    } catch (error) {
      console.error('Login error details:', error)
      throw error
    }
  }

  const signup = async (email, password, name, college) => {
    try {
      console.log('Attempting signup with:', { email, name, college })
      
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          name,
          college,
        }),
      })

      const responseText = await response.text()
      console.log('Raw signup response:', responseText)

      if (!response.ok) {
        let errorMessage = 'Signup failed'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || 'Signup failed'
        } catch (e) {
          console.error('Error parsing error response:', e)
        }
        throw new Error(errorMessage)
      }

      let data
      try {
        data = JSON.parse(responseText)
        console.log('Parsed signup response:', data)
      } catch (e) {
        console.error('Error parsing success response:', e)
        throw new Error('Invalid response from server')
      }

      // After successful signup, log the user in
      return await login(email, password)
    } catch (error) {
      console.error('Signup error details:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('user')
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    signup,
    updateProfile,
    changePassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 