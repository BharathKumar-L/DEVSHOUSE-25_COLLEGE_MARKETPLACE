"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import ProductCard from "@/components/product-card"

// Sample user data
const USER_LISTINGS = [
  {
    id: 1,
    title: "Engineering Textbook",
    price: 25,
    category: "Books",
    image: "/placeholder.svg?height=200&width=200",
    status: "Active",
    views: 120,
  },
  {
    id: 2,
    title: "Desk Lamp",
    price: 15,
    category: "Furniture",
    image: "/placeholder.svg?height=200&width=200",
    status: "Sold",
    views: 85,
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("listings")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-200"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || "User"}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("listings")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "listings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              My Listings
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "purchases"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Purchases
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "messages"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Messages
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === "listings" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Add New Listing
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {USER_LISTINGS.map((listing) => (
                <div key={listing.id} className="rounded-xl bg-white p-6 shadow-sm">
                  <ProductCard product={listing} />
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>Status: {listing.status}</span>
                    <span>{listing.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "purchases" && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Purchase History</h2>
            <p className="text-gray-600">No purchases yet.</p>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Messages</h2>
            <p className="text-gray-600">No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  )
} 