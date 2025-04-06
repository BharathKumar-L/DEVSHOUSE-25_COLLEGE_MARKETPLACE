"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Upload, User } from "lucide-react"

export default function SellPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    image: null,
    location: "",
    contactInfo: "",
    college: user?.college || "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First upload the image if one was selected
      let imageURL = ""
      if (formData.image) {
        const imageFormData = new FormData()
        imageFormData.append("image", formData.image)
        const uploadResponse = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          credentials: "include",
          body: imageFormData,
        })
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || "Failed to upload image")
        }
        
        const uploadData = await uploadResponse.json()
        imageURL = uploadData.imageUrl
      }

      // Then create the product
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        imageUrl: imageURL,
        location: formData.location,
        contactInfo: formData.contactInfo,
        college: formData.college,
      }

      console.log("Creating product with data:", productData)

      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login")
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create product")
      }

      const data = await response.json()
      console.log("Product created successfully:", data)
      
      // Show success message
      alert("Product listed successfully!")
      
      // Redirect to home page after successful product creation
      router.push("/")
    } catch (error) {
      console.error("Error creating product:", error)
      alert(error.message || "Failed to create product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="brutal-container py-12">
          <div className="brutal-card">
            <h1 className="brutal-heading-1 text-blue-900">Please log in to sell items</h1>
            <p className="brutal-text mt-4 text-gray-700">
              You need to be logged in to list items for sale.
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="brutal-button-primary mt-4"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="brutal-container py-12">
        <div className="brutal-card">
          <h1 className="brutal-heading-1 text-blue-900">Sell an Item</h1>
          <p className="brutal-text mt-4 text-gray-700">
            List your item for sale in your college marketplace.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="title" className="brutal-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="brutal-input"
                placeholder="Enter item title"
              />
            </div>

            <div>
              <label htmlFor="description" className="brutal-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="brutal-input"
                rows={4}
                placeholder="Describe your item"
              />
            </div>

            <div>
              <label htmlFor="price" className="brutal-label">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="brutal-input"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label htmlFor="category" className="brutal-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="brutal-select"
              >
                <option value="">Select a category</option>
                <option value="textbooks">Textbooks</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="clothing">Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="condition" className="brutal-label">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="brutal-select"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like new">Like New</option>
                <option value="good">Good</option>
                <option value="used">Used</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="brutal-label">
                Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="brutal-card brutal-card-hover bg-purple-50 p-6">
              <label htmlFor="college" className="brutal-text block text-gray-700">
                College Name
              </label>
              <div className="mt-1 flex">
                <span className="brutal-input inline-flex items-center rounded-l-md border-r-0 px-3">
                  <User className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  id="college"
                  value={formData.college}
                  onChange={(e) =>
                    setFormData({ ...formData, college: e.target.value })
                  }
                  className="brutal-input w-full rounded-l-none"
                  required
                  placeholder="Enter your college name"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="brutal-button-primary w-full"
              >
                {loading ? "Creating..." : "List Item for Sale"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

