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
    <header className="fixed top-0 z-50 w-full border-b-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-24">
      <div className="brutal-container">
        <div className="flex h-24 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 border-2 border-black bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <ShoppingBag className="h-8 w-8 text-black" />
            </div>
            <span className="brutal-heading-2 tracking-tight">
              {collegeName ? `${collegeName} Marketplace` : "College Marketplace"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="brutal-nav-link hover:bg-yellow-50">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="brutal-nav-link hover:bg-yellow-50">
                  Dashboard
                </Link>
                <Link 
                  href="/sell" 
                  className="brutal-button-primary hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  Sell Item
                </Link>
                <Link 
                  href="/chat" 
                  className="brutal-nav-link hover:bg-yellow-50"
                >
                  <MessageCircle className="h-6 w-6" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="brutal-nav-link hover:bg-yellow-50"
                  >
                    <User className="h-6 w-6" />
                    <span className="hidden md:block">{user?.name || 'Profile'}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 border-2 border-black bg-white p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <Link
                        href="/profile"
                        className="brutal-nav-link hover:bg-yellow-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          My Profile
                        </div>
                      </Link>
                      <Link
                        href="/settings"
                        className="brutal-nav-link hover:bg-yellow-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Settings
                        </div>
                      </Link>
                      <Link
                        href="/help"
                        className="brutal-nav-link hover:bg-yellow-50"
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
                        className="brutal-button-danger w-full hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
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
                className="brutal-button-primary hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="brutal-button md:hidden hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hidden">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="brutal-nav-link hover:bg-yellow-50" 
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="brutal-nav-link hover:bg-yellow-50" 
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/sell"
                  className="brutal-button-primary hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  onClick={() => setIsOpen(false)}
                >
                  Sell Item
                </Link>
                <Link 
                  href="/chat" 
                  className="brutal-nav-link hover:bg-yellow-50" 
                  onClick={() => setIsOpen(false)}
                >
                  Messages
                </Link>
                <Link 
                  href="/profile" 
                  className="brutal-nav-link hover:bg-yellow-50" 
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="brutal-button-danger hover:shadow-[6px_6px_0px_0px_rgba(0px,0px,0px,1)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth" 
                className="brutal-button-primary hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
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

