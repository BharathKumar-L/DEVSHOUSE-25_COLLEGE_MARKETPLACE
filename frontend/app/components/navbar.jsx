"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Menu, X, User } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, collegeName, logout } = useAuth()

  return (
    <nav className="bg-white brutal-border-b brutal-shadow fixed top-0 left-0 right-0 z-50">
      <div className="brutal-container">
        <div className="flex h-20 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="brutal-heading-2">
                  {collegeName ? `${collegeName} Marketplace` : "College Marketplace"}
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="brutal-nav-link"
                >
                  Dashboard
                </Link>
                <Link
                  href="/sell"
                  className="brutal-nav-link"
                >
                  Sell Item
                </Link>
                <Link
                  href="/chat"
                  className="brutal-nav-link"
                >
                  Messages
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="brutal-button-secondary flex items-center gap-2"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 brutal-border bg-white p-3 brutal-shadow">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 brutal-text hover:bg-blue-50"
                      >
                        View Profile
                      </Link>
                      <Link
                        href="/help"
                        className="block px-4 py-2 brutal-text hover:bg-blue-50"
                      >
                        Help & Support
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2 brutal-text text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth"
                className="brutal-button-primary"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="brutal-button-secondary p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="brutal-border-t space-y-1 bg-white px-4 py-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 brutal-text"
                >
                  Dashboard
                </Link>
                <Link
                  href="/sell"
                  className="block px-4 py-2 brutal-text"
                >
                  Sell Item
                </Link>
                <Link
                  href="/chat"
                  className="block px-4 py-2 brutal-text"
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 brutal-text"
                >
                  Profile
                </Link>
                <Link
                  href="/help"
                  className="block px-4 py-2 brutal-text"
                >
                  Help & Support
                </Link>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 brutal-text text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="block px-4 py-2 brutal-text"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 