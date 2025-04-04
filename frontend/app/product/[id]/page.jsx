"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, MessageCircle, Flag, User } from "lucide-react"

// Sample product data
const PRODUCT = {
  id: 1,
  title: "Engineering Textbook - Fundamentals of Electrical Engineering",
  price: 25,
  category: "Books",
  description:
    "This is the 5th edition of the popular Electrical Engineering textbook used in ENG201. In excellent condition with minimal highlighting. Perfect for next semester's class.",
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  seller: {
    name: "John Doe",
    joined: "September 2023",
    rating: 4.8,
  },
  postedDate: "2 days ago",
  location: "Engineering Building",
}

export default function ProductPage({ params }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")

  // In a real app, we would fetch the product data based on the ID
  const productId = params.id

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === PRODUCT.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? PRODUCT.images.length - 1 : prev - 1))
  }

  const handleReport = (e) => {
    e.preventDefault()

    // In a real app, this would send the report to a backend
    console.log("Reporting product:", productId, "Reason:", reportReason)

    // Close the modal and reset the form
    setShowReportModal(false)
    setReportReason("")

    // Show a success message (in a real app)
    alert("Thank you for your report. We will review it shortly.")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center font-bold hover:underline">
        <ChevronLeft className="mr-1 h-5 w-5" />
        Back to Marketplace
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="neo-brutalism bg-white">
          <div className="relative h-[400px] w-full">
            <Image
              src={PRODUCT.images[currentImageIndex] || "/placeholder.svg"}
              alt={PRODUCT.title}
              fill
              className="object-contain"
            />

            {/* Image Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border-4 border-black bg-white p-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border-4 border-black bg-white p-2"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {PRODUCT.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-3 w-3 rounded-full border-2 border-black ${
                    currentImageIndex === index ? "bg-black" : "bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="neo-brutalism bg-white p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="neo-brutalism-pink inline-block px-3 py-1 text-sm font-bold">{PRODUCT.category}</span>
              <span className="text-sm">{PRODUCT.postedDate}</span>
            </div>

            <h1 className="mb-2 text-3xl font-black">{PRODUCT.title}</h1>
            <p className="mb-4 text-3xl font-bold">${PRODUCT.price}</p>

            <h2 className="mb-2 text-xl font-bold">Description</h2>
            <p className="mb-4">{PRODUCT.description}</p>

            <h2 className="mb-2 text-xl font-bold">Location</h2>
            <p className="mb-4">{PRODUCT.location}</p>
          </div>

          {/* Seller Info */}
          <div className="neo-brutalism bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Seller Information</h2>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neo-blue text-white">
                <User className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold">{PRODUCT.seller.name}</h3>
                <p className="text-sm">Member since {PRODUCT.seller.joined}</p>
                <p className="text-sm">Rating: {PRODUCT.seller.rating}/5</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href={`/chat?product=${productId}`}
              className="neo-brutalism-button flex-1 bg-neo-blue text-center font-bold text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>Message Seller</span>
              </div>
            </Link>

            <button
              onClick={() => setShowReportModal(true)}
              className="neo-brutalism-button flex items-center justify-center gap-2 bg-white font-bold"
            >
              <Flag className="h-5 w-5" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="neo-brutalism-red w-full max-w-md bg-white p-6">
            <h2 className="mb-4 text-2xl font-black">Report Item</h2>

            <form onSubmit={handleReport}>
              <label className="mb-2 block font-bold">Why are you reporting this item?</label>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please provide details about why you're reporting this item..."
                className="neo-brutalism-input mb-4 h-32 w-full resize-none"
                required
              />

              <div className="flex gap-4">
                <button type="submit" className="neo-brutalism-button flex-1 bg-neo-red font-bold text-white">
                  Submit Report
                </button>

                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="neo-brutalism-button flex-1 bg-white font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

