"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Mail, Lock, User, Key } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showOTP, setShowOTP] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    otp: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (isLogin) {
        // First check if user exists
        const checkResponse = await fetch("http://localhost:8080/check-email", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
          }),
        })
        
        // Log the raw response for debugging
        const responseText = await checkResponse.text()
        console.log('Raw response:', responseText)
        
        let checkData
        try {
          checkData = JSON.parse(responseText)
          console.log('Parsed response:', checkData)
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError)
          console.error('Response text:', responseText)
          throw new Error('Invalid response from server')
        }
        
        if (checkResponse.status === 404) {
          setError("Email not found. Please sign up first.")
          setIsLogin(false)
          return
        }
        
        if (!checkResponse.ok) {
          throw new Error(checkData.error || "Login failed")
        }

        // If user exists, proceed with login
        await login(formData.email, formData.password)
        router.push("/")
      } else {
        if (!showOTP) {
          // First step: Send signup request
          const response = await fetch("http://localhost:8080/signup", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              name: formData.name,
            }),
          })
          
          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.error || "Signup failed")
          }
          
          setSuccess("OTP sent to your email. Please check your inbox.")
          setShowOTP(true)
        } else {
          // Second step: Verify OTP
          const response = await fetch("http://localhost:8080/verify-otp", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: formData.email,
              otp: formData.otp,
            }),
          })
          
          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.error || "OTP verification failed")
          }
          
          setSuccess("Email verified successfully! Logging you in...")
          // After successful verification, log the user in
          await login(formData.email, formData.password)
          router.push("/")
        }
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="brutal-card brutal-card-hover bg-yellow-50">
            <h1 className="brutal-heading-2 text-blue-900">
              {isLogin ? "Welcome Back" : (showOTP ? "Verify Email" : "Create Account")}
            </h1>
            <p className="brutal-text mt-2 text-gray-700">
              {isLogin
                ? "Sign in to your account to continue"
                : showOTP
                ? "Enter the OTP sent to your email"
                : "Join the college marketplace community"}
            </p>

            {error && (
              <div className="brutal-message-error mt-4">
                <p className="brutal-text">{error}</p>
              </div>
            )}

            {success && (
              <div className="brutal-message-success mt-4">
                <p className="brutal-text">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {!isLogin && !showOTP && (
                <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                  <label htmlFor="name" className="brutal-text block text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 flex">
                    <span className="brutal-input inline-flex items-center rounded-l-md border-r-0 px-3">
                      <User className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="brutal-input w-full rounded-l-none"
                      required={!isLogin && !showOTP}
                    />
                  </div>
                </div>
              )}

              {!showOTP && (
                <div className="brutal-card brutal-card-hover bg-red-50 p-6">
                  <label htmlFor="email" className="brutal-text block text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 flex">
                    <span className="brutal-input inline-flex items-center rounded-l-md border-r-0 px-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="brutal-input w-full rounded-l-none"
                      required
                    />
                  </div>
                </div>
              )}

              {!showOTP && (
                <div className="brutal-card brutal-card-hover bg-green-50 p-6">
                  <label htmlFor="password" className="brutal-text block text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 flex">
                    <span className="brutal-input inline-flex items-center rounded-l-md border-r-0 px-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="brutal-input w-full rounded-l-none"
                      required
                    />
                  </div>
                </div>
              )}

              {showOTP && (
                <div className="brutal-card brutal-card-hover bg-purple-50 p-6">
                  <label htmlFor="otp" className="brutal-text block text-gray-700">
                    OTP
                  </label>
                  <div className="mt-1 flex">
                    <span className="brutal-input inline-flex items-center rounded-l-md border-r-0 px-3">
                      <Key className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="otp"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData({ ...formData, otp: e.target.value })
                      }
                      className="brutal-input w-full rounded-l-none"
                      required
                      placeholder="Enter the OTP sent to your email"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="brutal-button brutal-button-primary w-full"
              >
                {isLogin ? "Sign In" : (showOTP ? "Verify OTP" : "Sign Up")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setShowOTP(false)
                  setFormData({ email: "", password: "", name: "", otp: "" })
                  setError("")
                  setSuccess("")
                }}
                className="brutal-text text-blue-600 hover:text-blue-800"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}