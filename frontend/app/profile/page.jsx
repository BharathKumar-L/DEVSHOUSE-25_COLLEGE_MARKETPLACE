"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { User, Mail, Building2, Settings, Edit2, X, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, collegeName, updateUser } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newName, setNewName] = useState(user?.name || "")
  const [newYearOfStudy, setNewYearOfStudy] = useState(user?.yearOfStudy || "1st Year")

  const handleNameUpdate = () => {
    if (newName.trim()) {
      updateUser({ ...user, name: newName.trim(), yearOfStudy: newYearOfStudy })
      setIsEditModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Profile Header */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name || "User"}</h1>
                  <p className="text-gray-600">{collegeName} Student</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Edit Name Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700">
                      Year of Study
                    </label>
                    <select
                      id="yearOfStudy"
                      value={newYearOfStudy}
                      onChange={(e) => setNewYearOfStudy(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNameUpdate}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">College</p>
                  <p className="text-gray-900">{collegeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Year of Study</p>
                  <p className="text-gray-900">{user?.yearOfStudy || "1st Year"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Account Settings</h2>
            <div className="space-y-4">
              <Link
                href="/settings"
                className="flex items-center justify-between rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">Account Settings</span>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <Link
                href="/privacy"
                className="flex items-center justify-between rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-gray-900">Privacy Settings</span>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Activity Section */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-gray-600">No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 