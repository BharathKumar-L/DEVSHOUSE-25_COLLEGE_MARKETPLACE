"use client"

import { useState } from "react"
import ProductCard from "@/components/product-card"
import FilterSidebar from "@/components/filter-sidebar"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

// Sample product data
const PRODUCTS = [
  {
    id: 1,
    title: "Engineering Textbook",
    price: 25,
    category: "Textbooks",
    condition: "Like New",
    image: "/placeholder.svg?height=200&width=200",
    seller: "John D.",
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Desk Lamp",
    price: 15,
    category: "Furniture",
    condition: "Good",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Sarah M.",
    postedDate: "5 days ago",
  },
  {
    id: 3,
    title: "Scientific Calculator",
    price: 30,
    category: "Electronics",
    condition: "New",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Mike T.",
    postedDate: "1 week ago",
  },
  {
    id: 4,
    title: "Study Notes",
    price: 10,
    category: "Study Materials",
    condition: "Good",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Emma K.",
    postedDate: "3 days ago",
  },
  {
    id: 5,
    title: "Lab Coat",
    price: 20,
    category: "Lab Equipment",
    condition: "Fair",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Alex P.",
    postedDate: "Just now",
  },
  {
    id: 6,
    title: "Desk Chair",
    price: 50,
    category: "Furniture",
    condition: "Good",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Lisa R.",
    postedDate: "4 days ago",
  },
]

export default function Home() {
  const { user, collegeName } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS)

  const handleFilterChange = (filters) => {
    let filtered = [...PRODUCTS]

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      )
    }

    // Apply condition filter
    if (filters.conditions.length > 0) {
      filtered = filtered.filter((product) =>
        filters.conditions.includes(product.condition)
      )
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.priceRange.min &&
          product.price <= filters.priceRange.max
      )
    }

    // Apply search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.seller.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {collegeName ? `${collegeName} Marketplace` : "College Marketplace"}
              </h1>
              <p className="mt-4 text-lg text-blue-100">Connect with your college community to buy and sell items</p>
            </div>
            {!user && (
              <Link 
                href="/auth" 
                className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      {!user && (
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">Buy Items</h3>
              <p className="mt-2 text-gray-600">Browse through verified listings from your college community</p>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">Sell Items</h3>
              <p className="mt-2 text-gray-600">List your items and connect with potential buyers</p>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">Secure Transactions</h3>
              <p className="mt-2 text-gray-600">Safe and verified transactions within your college network</p>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured Items</h2>
          <div className="flex items-center gap-4">
            {!user && (
              <Link 
                href="/auth" 
                className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                Login to Sell
              </Link>
            )}
            <button 
              className="rounded-lg bg-gray-200 p-2 text-gray-700 transition-all hover:bg-gray-300 md:hidden" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Filter Sidebar - Mobile */}
          {showFilters && (
            <div className="md:hidden">
              <FilterSidebar onFilterChange={handleFilterChange} onClose={() => setShowFilters(false)} />
            </div>
          )}

          {/* Filter Sidebar - Desktop */}
          <div className="hidden md:block md:w-1/4">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

