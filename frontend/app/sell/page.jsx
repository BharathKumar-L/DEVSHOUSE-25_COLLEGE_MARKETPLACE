"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"

export default function SellItemPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Appliances", "Sports", "Other"]

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length + images.length > 5) {
      setError("You can upload a maximum of 5 images")
      return
    }

    setImages([...images, ...files])

    // Create preview URLs
    const newPreviewImages = files.map((file) => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...newPreviewImages])

    setError("")
  }

  const removeImage = (index) => {
    const newImages = [...images]
    const newPreviewImages = [...previewImages]

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewImages[index])

    newImages.splice(index, 1)
    newPreviewImages.splice(index, 1)

    setImages(newImages)
    setPreviewImages(newPreviewImages)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!title || !description || !price || !category) {
      setError("Please fill in all required fields")
      return
    }

    if (images.length === 0) {
      setError("Please upload at least one image")
      return
    }

    // In a real app, this would submit the form data to a backend
    setError("")
    setSuccess("Your item has been listed successfully!")

    // Reset form after submission
    setTimeout(() => {
      setTitle("")
      setDescription("")
      setPrice("")
      setCategory("")
      setImages([])
      setPreviewImages([])
      setSuccess("")
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-black">SELL YOUR ITEM</h1>

        <form onSubmit={handleSubmit} className="neo-brutalism bg-white p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="mb-2 block text-lg font-bold">Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you selling?"
              className="neo-brutalism-input w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-2 block text-lg font-bold">Description*</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item, condition, etc."
              className="neo-brutalism-input h-32 w-full resize-none"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="mb-2 block text-lg font-bold">Price ($)*</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="neo-brutalism-input w-full"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="mb-2 block text-lg font-bold">Category*</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="neo-brutalism-input w-full"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="mb-2 block text-lg font-bold">Images* (Max 5)</label>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
              {/* Image Previews */}
              {previewImages.map((src, index) => (
                <div key={index} className="relative h-24 w-full overflow-hidden rounded border-2 border-black">
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`Preview ${index}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-white p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {images.length < 5 && (
                <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center border-4 border-dashed border-black bg-gray-50">
                  <Plus className="h-8 w-8" />
                  <span className="mt-1 text-sm font-bold">Add Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" multiple />
                </label>
              )}
            </div>
          </div>

          {error && <p className="mb-4 font-bold text-red-500">{error}</p>}
          {success && <p className="mb-4 font-bold text-green-600">{success}</p>}

          <button type="submit" className="neo-brutalism-button w-full bg-neo-green text-lg font-black text-white">
            LIST ITEM FOR SALE
          </button>
        </form>
      </div>
    </div>
  )
}

