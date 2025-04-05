"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [collegeName, setCollegeName] = useState("")
  const [loading, setLoading] = useState(true)
  const isAuthenticated = !!user

  useEffect(() => {
    // Check if user is already logged in (from cookies)
    const storedUser = Cookies.get('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setCollegeName(extractCollegeName(userData.email))
    }
    setLoading(false)
  }, [])

  const extractCollegeName = (email) => {
    if (!email) return ""
    const domain = email.split("@")[1]
    if (!domain) return ""
    const college = domain.split(".")[0]
    return college.charAt(0).toUpperCase() + college.slice(1)
  }

  const sendOTP = async (email) => {
    try {
      const response = await fetch('http://localhost:8080/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }
      return true
    } catch (error) {
      throw error
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch('http://localhost:8080/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP')
      }
      return true
    } catch (error) {
      throw error
    }
  }

  const signup = async (email, password, name, otp) => {
    try {
      // First verify the OTP
      await verifyOTP(email, otp)

      // If OTP is valid, proceed with registration
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, otp }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Registration successful, set user data
      const college = extractCollegeName(email)
      const userData = { email, name, yearOfStudy: "1st Year" }
      setCollegeName(college)
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      Cookies.set('user', JSON.stringify(userData), { expires: 7 })
      return true
    } catch (error) {
      throw error
    }
  }

  const login = async (email, password) => {
    // In a real app, this would make an API call to verify credentials
    const college = extractCollegeName(email)
    const userData = { email, name: "User", yearOfStudy: "1st Year" }
    setCollegeName(college)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    Cookies.set('user', JSON.stringify(userData), { expires: 7 })
    return true
  }

  const logout = () => {
    setUser(null)
    setCollegeName("")
    localStorage.removeItem('user')
    Cookies.remove('user')
  }

  const updateUser = (newUserData) => {
    setUser(newUserData)
    localStorage.setItem('user', JSON.stringify(newUserData))
    Cookies.set('user', JSON.stringify(newUserData), { expires: 7 })
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      collegeName, 
      isAuthenticated, 
      loading, 
      login, 
      signup, 
      logout, 
      updateUser,
      sendOTP,
      verifyOTP 
    }}>
      {children}
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