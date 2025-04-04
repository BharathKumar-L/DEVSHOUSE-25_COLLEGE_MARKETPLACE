"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Button, type ButtonProps, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogOut, Menu, MessageSquare, Package, ShieldAlert, User } from "lucide-react"

export function Header() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const navItems = [
    {
      name: "Marketplace",
      href: "/marketplace",
      icon: <Package className="h-4 w-4 mr-2" />,
    },
    {
      name: "Messages",
      href: "/chats",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      name: "Admin",
      href: "/admin",
      icon: <ShieldAlert className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            College Marketplace
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-gray-600 hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                ))}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{user?.name || "Account"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-gray-500">{user?.email}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/auth/signup")}>Sign Up</Button>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex-1 py-6">
                  {isAuthenticated ? (
                    <>
                      <div className="mb-6 pb-6 border-b">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.icon}
                            {item.name}
                          </Link>
                        ))}
                      </nav>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          router.push("/auth/login")
                          setIsMenuOpen(false)
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        className="justify-start"
                        onClick={() => {
                          router.push("/auth/signup")
                          setIsMenuOpen(false)
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start text-red-500"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

