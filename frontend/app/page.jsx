"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { ShoppingBag, MessageSquare, User, Plus, Filter, Search } from "lucide-react"
import { api } from "@/lib/api"

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
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [collegeName, setCollegeName] = useState("College")

  // Extract college name from email
  const getCollegeName = () => {
    if (user?.email) {
      const emailParts = user.email.split('@')
      if (emailParts.length === 2) {
        const domainParts = emailParts[1].split('.')
        if (domainParts.length >= 3 && domainParts[1] === 'edu' && domainParts[2] === 'in') {
          // Handle college names with multiple words (e.g., "indian-institute" -> "Indian Institute")
          const collegeName = domainParts[0]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          return collegeName
        }
      }
    }
    return "College"
  }

  // Update college name when user changes
  useEffect(() => {
    setCollegeName(getCollegeName())
  }, [user])

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching products for college:", user?.college)
        const response = await fetch("http://localhost:8080/api/products", {
          credentials: "include",
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        console.log("Fetched products:", data)
        
        if (Array.isArray(data)) {
          setProducts(data)
          setFilteredProducts(data)
        } else {
          throw new Error('Invalid response format from server')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError(error.message || 'Failed to fetch products')
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    // Always fetch products, even if user is not logged in
    fetchProducts()
  }, [user?.college])

  // Update filtered products whenever search query or filters change
  useEffect(() => {
    let result = [...products]

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
  }, [searchQuery, filters, products])

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
              Welcome to {collegeName} Marketplace
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
            <Link href="/" className="brutal-card brutal-card-hover bg-yellow-50">
              <ShoppingBag className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">Buy Items</h3>
              <p className="brutal-text mt-2 text-gray-700">
                Browse through items listed by students in your college.
              </p>
            </Link>
            <Link href="/sell" className="brutal-card brutal-card-hover bg-blue-50">
              <Plus className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">Sell Items</h3>
              <p className="brutal-text mt-2 text-gray-700">
                List your items for sale and reach potential buyers in your college.
              </p>
            </Link>
            <Link href="/transactions" className="brutal-card brutal-card-hover bg-red-50">
              <MessageSquare className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">
                Secure Transactions
              </h3>
              <p className="brutal-text mt-2 text-gray-700">
                Chat with sellers, negotiate prices, and arrange safe meetups.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="brutal-heading-2 text-blue-900">
              {user?.college ? `Products from ${collegeName}` : "All Products"}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="brutal-button-secondary"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="brutal-input pl-10"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="brutal-card mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="brutal-select"
                >
                  <option value="all">All Categories</option>
                  <option value="textbooks">Textbooks</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                </select>
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="brutal-select"
                >
                  <option value="all">All Prices</option>
                  <option value="0-100">Under $100</option>
                  <option value="100-500">$100 - $500</option>
                  <option value="500-1000">$500 - $1000</option>
                  <option value="1000">Over $1000</option>
                </select>
                <select
                  name="condition"
                  value={filters.condition}
                  onChange={handleFilterChange}
                  className="brutal-select"
                >
                  <option value="all">All Conditions</option>
                  <option value="new">New</option>
                  <option value="like new">Like New</option>
                  <option value="good">Good</option>
                  <option value="used">Used</option>
                </select>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="brutal-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">No products found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="brutal-card brutal-card-hover"
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="brutal-heading-3 text-blue-900">{product.title}</h3>
                  <p className="text-gray-600 mt-1">${product.price}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{product.condition}</span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

