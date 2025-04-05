"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { ShoppingBag, MessageSquare, User, Plus, Filter, Search } from "lucide-react"
import laptop from "../../backend/uploads/laptop.jpeg"
import deskchair from "../../backend/uploads/deskchair.jpg"
import textbook from "../../backend/uploads/textbook.jpg"

// Sample data - replace with actual data fetching
const PRODUCTS = [
  {
    id: 1,
    title: "Engineering Textbook",
    price: 175,
    category: "textbooks",
    condition: "like new",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLqyoM5QobqRCw6DkoXWv-cwXhYDKBYGP2w&s",
    createdAt: "2024-03-15"
  },
  {
    id: 2,
    title: "Laptop",
    price: 20000,
    category: "electronics",
    condition: "good",
    image: "https://images.jdmagicbox.com/quickquotes/images_main/second-hand-canon-laptop-2222941636-m878bd8c.jpg",
    createdAt: "2024-03-14"
  },
  {
    id: 3,
    title: "Desk Chair",
    price: 1500,
    category: "furniture",
    condition: "used",
    image: "https://5.imimg.com/data5/MF/LH/HO/GLADMIN-87315774/used-office-chair-buyer-service-500x500.jpg",
    createdAt: "2024-03-13"
  }
]

export default function Home() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    condition: "all",
    sortBy: "newest"
  })
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS)

  // Update filtered products whenever search query or filters change
  useEffect(() => {
    let result = [...PRODUCTS]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(product => product.category === filters.category)
    }

    // Apply price range filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number)
      result = result.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max
        }
        return product.price >= min
      })
    }

    // Apply condition filter
    if (filters.condition !== "all") {
      result = result.filter(product => product.condition === filters.condition)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        default:
          return 0
      }
    })

    setFilteredProducts(result)
  }, [searchQuery, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="brutal-section bg-yellow-50">
        <div className="brutal-container">
          <div className="brutal-card">
            <h1 className="brutal-heading-1 text-blue-900">
              Welcome to College Marketplace
            </h1>
            <p className="brutal-text mt-4 text-gray-700">
              Buy and sell items within your college community. Find great deals on
              textbooks, electronics, furniture, and more.
            </p>
            {!user && (
              <Link
                href="/auth"
                className="brutal-button-primary mt-6 inline-block"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="brutal-grid">
            <div className="brutal-card brutal-card-hover bg-yellow-50">
              <ShoppingBag className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">Buy Items</h3>
              <p className="brutal-text mt-2 text-gray-700">
                Browse through thousands of items listed by students in your
                college.
              </p>
            </div>
            <div className="brutal-card brutal-card-hover bg-blue-50">
              <Plus className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">Sell Items</h3>
              <p className="brutal-text mt-2 text-gray-700">
                List your items for sale and reach potential buyers in your
                college.
              </p>
            </div>
            <div className="brutal-card brutal-card-hover bg-red-50">
              <MessageSquare className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">
                Secure Transactions
              </h3>
              <p className="brutal-text mt-2 text-gray-700">
                Chat with sellers, negotiate prices, and arrange safe meetups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="flex items-center justify-between">
            <h2 className="brutal-heading-2 text-blue-900">Featured Items</h2>
            <div className="flex items-center gap-4">
              {!user && (
                <Link
                  href="/auth"
                  className="brutal-button-secondary flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  <span>Login to Sell</span>
                </Link>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="brutal-button-secondary flex items-center gap-2"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="brutal-input pl-10 w-full"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>

            {showFilters && (
              <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="brutal-text block text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="brutal-input mt-1 w-full"
                    >
                      <option value="all">All Categories</option>
                      <option value="textbooks">Textbooks</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="clothing">Clothing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="brutal-text block text-gray-700">
                      Price Range
                    </label>
                    <select
                      name="priceRange"
                      value={filters.priceRange}
                      onChange={handleFilterChange}
                      className="brutal-input mt-1 w-full"
                    >
                      <option value="all">All Prices</option>
                      <option value="0-25">Under ₹25</option>
                      <option value="25-50">₹25 - ₹50</option>
                      <option value="50-100">₹50 - ₹100</option>
                      <option value="100-500">₹100 - ₹500</option>
                      <option value="500-1000">₹500 - ₹1000</option>
                      <option value="1000-999999">Over ₹1000</option>
                    </select>
                  </div>
                  <div>
                    <label className="brutal-text block text-gray-700">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={filters.condition}
                      onChange={handleFilterChange}
                      className="brutal-input mt-1 w-full"
                    >
                      <option value="all">All Conditions</option>
                      <option value="new">New</option>
                      <option value="like new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="brutal-text block text-gray-700">
                      Sort By
                    </label>
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                      className="brutal-input mt-1 w-full"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="brutal-grid mt-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="brutal-card brutal-card-hover bg-white"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="brutal-product-image h-48 w-full"
                  />
                  <div className="p-4">
                    <h3 className="brutal-heading-3 text-blue-900">
                      {product.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="brutal-text font-bold text-blue-900">
                        ₹{product.price}
                      </span>
                      <span className="brutal-text-sm text-gray-600">
                        {product.condition}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

