"use client"

import { useAuth } from "@/context/auth-context"

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-lg font-medium text-gray-700">Loading...</p>
    </div>
  )
}

export default function ClientLayout({ children }) {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return <>{children}</>
} 