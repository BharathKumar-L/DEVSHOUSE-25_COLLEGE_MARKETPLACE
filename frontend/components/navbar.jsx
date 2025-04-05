"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, MessageCircle, LogOut, User, Settings, HelpCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { isAuthenticated, logout, user, collegeName } = useAuth()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm mb-16">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">
            {collegeName ? `${collegeName} Marketplace` : "College Marketplace"}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="font-medium text-gray-600 transition-colors hover:text-blue-600">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="font-medium text-gray-600 transition-colors hover:text-blue-600">
                Dashboard
              </Link>
              <Link 
                href="/sell" 
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
              >
                Sell Item
              </Link>
              <Link 
                href="/chat" 
                className="text-gray-600 transition-colors hover:text-blue-600"
              >
                <MessageCircle className="h-6 w-6" />
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-gray-600 transition-colors hover:text-blue-600"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:block">{user?.name || 'Profile'}</span>
                </button>
                
                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        My Profile
                      </div>
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </div>
                    </Link>
                    <Link
                      href="/help"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Help & Support
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsProfileOpen(false)
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link 
              href="/auth" 
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="container mx-auto border-t border-gray-200 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link 
              href="/" 
              className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100" 
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100" 
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/sell"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sell Item
                </Link>
                <Link 
                  href="/chat" 
                  className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100" 
                  onClick={() => setIsOpen(false)}
                >
                  Messages
                </Link>
                <Link 
                  href="/profile" 
                  className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100" 
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth" 
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700" 
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

