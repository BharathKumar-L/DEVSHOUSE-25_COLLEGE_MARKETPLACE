"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ShoppingBag, MessageSquare, User, Plus, Filter, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("listings")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/api/products/user", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load your products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddProduct = () => {
    router.push("/sell")
  }

  const handleEditProduct = (productId) => {
    router.push(`/sell?edit=${productId}`)
  }

  const handleDeleteProduct = async (productId) => {
    if (deleteConfirm !== productId) {
      setDeleteConfirm(productId)
      return
    }

    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include"
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete product")
      }
      setProducts(products.filter(product => product.ID !== productId))
      setDeleteConfirm(null)
      setSuccess("Product deleted successfully!")
    } catch (error) {
      console.error("Error deleting product:", error)
      setError(error.message || "Failed to delete product. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="brutal-container">
          <div className="brutal-card brutal-card-hover bg-yellow-50 p-8">
            <p className="brutal-text">Loading your products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="brutal-card brutal-card-hover bg-yellow-50">
            <h1 className="brutal-heading-2 text-blue-900">Dashboard</h1>
            <p className="brutal-text mt-2 text-gray-700">
              Manage your listings and messages
            </p>

            {/* Tabs */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setActiveTab("listings")}
                className={`brutal-button ${
                  activeTab === "listings"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900"
                }`}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                My Listings
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`brutal-button ${
                  activeTab === "messages"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900"
                }`}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Messages
              </button>
            </div>

            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="brutal-heading-3 text-blue-900">My Listings</h2>
                  <button
                    className="brutal-button brutal-button-primary flex items-center gap-2"
                    onClick={handleAddProduct}
                  >
                    <Plus className="h-5 w-5" />
                    Add Product
                  </button>
                </div>

                {error && (
                  <div className="brutal-message-error mb-4">
                    <p className="brutal-text">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="brutal-message-success mb-4">
                    <p className="brutal-text">{success}</p>
                  </div>
                )}

                {products.length === 0 ? (
                  <div className="brutal-card brutal-card-hover bg-blue-50 p-6 text-center">
                    <p className="brutal-text">You haven't listed any products yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.ID}
                        className="brutal-card brutal-card-hover bg-white p-6"
                      >
                        <div className="relative h-48 w-full">
                          <img
                            src={product.ImageURL ? `http://localhost:8080${product.ImageURL}` : "/placeholder.png"}
                            alt={product.Title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h2 className="brutal-heading-3 text-blue-900 mb-2">
                          {product.Title}
                        </h2>
                        <p className="brutal-text text-gray-600 mb-4">
                          {product.Description}
                        </p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="brutal-text font-bold text-green-600">
                            ₹{product.Price}
                          </span>
                          <span className="brutal-text text-gray-500">
                            {product.Condition}
                          </span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            className="brutal-button brutal-button-secondary"
                            onClick={() => handleEditProduct(product.ID)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className={`brutal-button ${
                              deleteConfirm === product.ID
                                ? "brutal-button-danger"
                                : "brutal-button-secondary"
                            }`}
                            onClick={() => handleDeleteProduct(product.ID)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {deleteConfirm === product.ID && (
                          <div className="mt-2 text-sm text-red-600">
                            Click again to confirm deletion
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="mt-8">
                <h2 className="brutal-heading-3 text-blue-900">Messages</h2>
                <div className="mt-6 space-y-4">
                  {/* Messages content */}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 