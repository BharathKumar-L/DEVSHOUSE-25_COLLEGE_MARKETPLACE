"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Upload, X } from "lucide-react"

export default function SellPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [productId, setProductId] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    ImageURL: "",
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId) {
      setIsEditing(true)
      setProductId(editId)
      fetchProduct(editId)
    }
  }, [searchParams])

  const fetchProduct = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/products/${id}`, {
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch product")
      }
      
      const product = await response.json()
      setFormData({
        title: product.Title,
        description: product.Description,
        price: product.Price.toString(),
        category: product.Category,
        condition: product.Condition,
        ImageURL: product.ImageURL,
      })
      
      if (product.ImageURL) {
        setImagePreview(`http://localhost:8080${product.ImageURL}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, ImageURL: data.imageUrl }))
      setImagePreview(`http://localhost:8080${data.imageUrl}`)
    } catch (err) {
      console.error("Error uploading image:", err)
      setError("Failed to upload image. Please try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = isEditing 
        ? `http://localhost:8080/products/${productId}`
        : "http://localhost:8080/products"
      
      // Convert price to number before sending
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      }

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save product")
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Error saving product:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="brutal-card brutal-card-hover bg-yellow-50">
            <h1 className="brutal-heading-2 text-blue-900">
              {isEditing ? "Edit Item" : "Sell an Item"}
            </h1>
            <p className="brutal-text mt-2 text-gray-700">
              {isEditing 
                ? "Update your item listing in the college marketplace."
                : "List your item for sale in the college marketplace."}
            </p>

            {error && (
              <div className="brutal-message-error mt-4">
                <p className="brutal-text">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Image Upload */}
              <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                <label className="brutal-text block text-gray-700">
                  Product Images
                </label>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="brutal-product-image h-32 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -right-2 -top-2 brutal-button-secondary p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex h-32 cursor-pointer items-center justify-center brutal-border brutal-shadow bg-gray-50 hover:bg-gray-100">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="brutal-text-sm mt-2 block text-gray-600">
                        Upload Images
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="brutal-card brutal-card-hover bg-red-50 p-6">
                <label htmlFor="title" className="brutal-text block text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="brutal-input mt-1 w-full"
                  required
                />
              </div>

              {/* Description */}
              <div className="brutal-card brutal-card-hover bg-yellow-50 p-6">
                <label
                  htmlFor="description"
                  className="brutal-text block text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="brutal-textarea mt-1 w-full"
                  required
                />
              </div>

              {/* Price */}
              <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                <label htmlFor="price" className="brutal-text block text-gray-700">
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  min="0"
                  step="0.01"
                  className="brutal-input mt-1 w-full"
                  required
                />
              </div>

              {/* Category */}
              <div className="brutal-card brutal-card-hover bg-red-50 p-6">
                <label
                  htmlFor="category"
                  className="brutal-text block text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="brutal-input mt-1 w-full"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="textbooks">Textbooks</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Condition */}
              <div className="brutal-card brutal-card-hover bg-yellow-50 p-6">
                <label
                  htmlFor="condition"
                  className="brutal-text block text-gray-700"
                >
                  Condition
                </label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                  className="brutal-input mt-1 w-full"
                  required
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="brutal-button-primary w-full"
                disabled={loading}
              >
                {loading 
                  ? (isEditing ? "Updating..." : "Creating Listing...") 
                  : (isEditing ? "Update Item" : "List Item for Sale")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

