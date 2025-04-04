"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, MessageCircle, LogOut, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header className="fixed top-0 z-50 w-full bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-8 w-8" />
          <span className="text-xl font-black">COLLEGE MARKETPLACE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="font-bold hover:text-neo-blue">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="font-bold hover:text-neo-blue">
                Dashboard
              </Link>
              <Link href="/sell" className="neo-brutalism-button bg-neo-yellow">
                Sell Item
              </Link>
              <Link href="/chat" className="font-bold hover:text-neo-blue">
                <MessageCircle className="h-6 w-6" />
              </Link>
              <Link href="/profile" className="font-bold hover:text-neo-blue">
                <User className="h-6 w-6" />
              </Link>
              <button
                onClick={logout}
                className="neo-brutalism-button bg-neo-red text-white"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </>
          ) : (
            <Link href="/auth" className="neo-brutalism-button bg-neo-blue text-white">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="container mx-auto px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="neo-brutalism-button w-full text-center" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="neo-brutalism-button w-full text-center" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link
                  href="/sell"
                  className="neo-brutalism-button w-full bg-neo-yellow text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sell Item
                </Link>
                <Link href="/chat" className="neo-brutalism-button w-full text-center" onClick={() => setIsOpen(false)}>
                  Messages
                </Link>
                <Link href="/profile" className="neo-brutalism-button w-full text-center" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="neo-brutalism-button w-full bg-neo-red text-center text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth" className="neo-brutalism-button w-full bg-neo-blue text-center text-white" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

