"use client"

import { useState } from "react"
import ProductCard from "@/components/product-card"
import FilterSidebar from "@/components/filter-sidebar"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

interface Filters {
  category?: string
  priceRange?: { min: number; max: number }
  condition?: string
}

// Sample product data
const PRODUCTS = [
  {
    id: 1,
    title: "Engineering Textbook",
    price: 25,
    category: "Books",
    image: "/placeholder.svg?height=200&width=200",
    seller: "John D.",
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Desk Lamp",
    price: 15,
    category: "Furniture",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Sarah M.",
    postedDate: "5 days ago",
  },
  {
    id: 3,
    title: "Scientific Calculator",
    price: 30,
    category: "Electronics",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Mike T.",
    postedDate: "1 week ago",
  },
  {
    id: 4,
    title: "Dorm Room Fridge",
    price: 80,
    category: "Appliances",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Emma K.",
    postedDate: "3 days ago",
  },
  {
    id: 5,
    title: "Wireless Headphones",
    price: 45,
    category: "Electronics",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Alex P.",
    postedDate: "Just now",
  },
  {
    id: 6,
    title: "Desk Chair",
    price: 50,
    category: "Furniture",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Lisa R.",
    postedDate: "4 days ago",
  },
]

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS)

  const handleFilterChange = (filters: Filters) => {
    // In a real app, this would filter based on the selected criteria
    console.log("Filters applied:", filters)
    // For demo purposes, we're just using the original products
    setFilteredProducts(PRODUCTS)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with Login Button */}
      <div className="mb-12 flex flex-col items-center justify-between gap-8 rounded-lg bg-neo-blue p-8 text-black md:flex-row">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black">COLLEGE MARKETPLACE</h1>
          <p className="mt-4 text-lg">Buy and sell items within your college community</p>
        </div>
        {!isAuthenticated && (
          <Link 
            href="/auth" 
            className="neo-brutalism-button bg-white px-8 py-3 text-lg font-bold text-black hover:bg-gray-100 transition-colors duration-200"
          >
            Login to Get Started
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      {!isAuthenticated && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-neo">
            <h3 className="text-xl font-bold text-black">Buy Items</h3>
            <p className="mt-2 text-black">Browse through items listed by your college mates</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-neo">
            <h3 className="text-xl font-bold text-black">Sell Items</h3>
            <p className="mt-2 text-black">List your items and reach potential buyers</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-neo">
            <h3 className="text-xl font-bold text-black">Secure Transactions</h3>
            <p className="mt-2 text-black">Safe and verified transactions within your college</p>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-black text-black">Featured Items</h2>
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <Link 
              href="/auth" 
              className="neo-brutalism-button bg-neo-blue text-black hover:bg-neo-blue-dark transition-colors duration-200"
            >
              Login to Sell
            </Link>
          )}
          <button className="neo-brutalism-button bg-neo-pink text-black md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
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
  )
}

