"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider, useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-lg font-medium text-gray-700">Loading...</p>
    </div>
  )
}

function ClientWrapper({ children }) {
  const { loading } = useAuth()

  return loading ? <LoadingScreen /> : (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="brutal-scrollbar">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
