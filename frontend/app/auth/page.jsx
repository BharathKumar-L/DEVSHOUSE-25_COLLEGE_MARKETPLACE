"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Mail, Lock, User, Key } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showOTP, setShowOTP] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    otp: "",
    college: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        router.push('/')
      } else {
        const data = await signup(formData.email, formData.password, formData.name, formData.college)
        if (data) {
          setShowOTP(true)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
                <>
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

                  <div className="brutal-card brutal-card-hover bg-purple-50 p-6">
                    <label htmlFor="college" className="brutal-text block text-gray-700">
                      College Name
                    </label>
                    <div className="mt-1 flex">
                      <span className="brutal-input inline-flex items-center rounded-l-md border-r-0 px-3">
                        <User className="h-5 w-5 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        id="college"
                        value={formData.college}
                        onChange={(e) =>
                          setFormData({ ...formData, college: e.target.value })
                        }
                        className="brutal-input w-full rounded-l-none"
                        required={!isLogin && !showOTP}
                        placeholder="Enter your college name"
                      />
                    </div>
                  </div>
                </>
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
                  setFormData({ email: "", password: "", name: "", otp: "", college: "" })
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