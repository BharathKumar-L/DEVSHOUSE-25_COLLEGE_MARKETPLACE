"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Bell, Lock, Mail, User, Shield, LogOut } from "lucide-react"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="min-h-screen bg-white">
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="brutal-card brutal-card-hover bg-yellow-50">
            <h1 className="brutal-heading-2 text-blue-900">Settings</h1>
            <p className="brutal-text mt-2 text-gray-700">
              Manage your account settings and preferences
            </p>

            {/* Tabs */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setActiveTab("account")}
                className={`brutal-button ${
                  activeTab === "account"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900"
                }`}
              >
                <User className="mr-2 h-5 w-5" />
                Account
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`brutal-button ${
                  activeTab === "notifications"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900"
                }`}
              >
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`brutal-button ${
                  activeTab === "security"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900"
                }`}
              >
                <Shield className="mr-2 h-5 w-5" />
                Security
              </button>
            </div>

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="mt-8">
                <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                  <h2 className="brutal-heading-3 text-blue-900">Profile Information</h2>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="brutal-text block text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="brutal-input mt-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="brutal-text block text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="brutal-input mt-1 w-full"
                      />
                    </div>
                    <button className="brutal-button-primary w-full">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="mt-8">
                <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                  <h2 className="brutal-heading-3 text-blue-900">Notification Preferences</h2>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="brutal-text font-bold text-blue-900">
                          Email Notifications
                        </h3>
                        <p className="brutal-text-sm text-gray-600">
                          Receive updates about your listings and messages
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="brutal-text font-bold text-blue-900">
                          Message Alerts
                        </h3>
                        <p className="brutal-text-sm text-gray-600">
                          Get notified when you receive new messages
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="mt-8">
                <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                  <h2 className="brutal-heading-3 text-blue-900">Security Settings</h2>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="brutal-text block text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="brutal-input mt-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="brutal-text block text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="brutal-input mt-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="brutal-text block text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="brutal-input mt-1 w-full"
                      />
                    </div>
                    <button className="brutal-button-primary w-full">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <div className="mt-8">
              <button
                onClick={logout}
                className="brutal-button-danger w-full flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 