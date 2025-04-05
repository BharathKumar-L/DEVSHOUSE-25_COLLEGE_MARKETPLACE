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

  const updateUser = (newUserData) => {
    setUser(newUserData)
    localStorage.setItem('user', JSON.stringify(newUserData))
    Cookies.set('user', JSON.stringify(newUserData), { expires: 7 })
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
    try {
      // In a real app, this would make an API call to change the password
      // For now, we'll just simulate a successful password change
      return true
    } catch (error) {
      throw new Error("Failed to change password")
    }
  }

  const login = async (email, password) => {
    // In a real app, this would make an API call to verify credentials
    const college = extractCollegeName(email)
    const userData = { email, name: "User", yearOfStudy: "1st Year" }
    setCollegeName(college)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }) // Store for 7 days
    return true
  }

  const signup = async (email, password, name) => {
    // In a real app, this would make an API call to create a new user
    const college = extractCollegeName(email)
    const userData = { email, name, yearOfStudy: "1st Year" }
    setCollegeName(college)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }) // Store for 7 days
    return true
  }

  const logout = () => {
    setUser(null)
    setCollegeName("")
    localStorage.removeItem('user')
    Cookies.remove('user')
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
      updateProfile,
      changePassword
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