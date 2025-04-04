"use client"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { MessageCircle, Heart } from "lucide-react"

// Sample product data
const PRODUCT = {
  id: 1,
  title: "Engineering Textbook",
  price: 25,
  category: "Books",
  description:
    "This engineering textbook is in excellent condition. It was used for one semester and has minimal highlighting. Perfect for students taking the course this semester.",
  condition: "Like New",
  images: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
  seller: {
    name: "John D.",
    avatar: "/placeholder.svg",
    rating: 4.8,
    joined: "2023",
  },
  postedDate: "2 days ago",
  location: "Engineering Building",
}

export default function ProductPage({ params }) {
  const { isAuthenticated } = useAuth()
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                <Image
                  src={PRODUCT.images[activeImage]}
                  alt={PRODUCT.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {PRODUCT.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg bg-white ${
                      activeImage === index ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <Image src={image} alt={`${PRODUCT.title} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{PRODUCT.title}</h1>
                <p className="mt-2 text-2xl font-bold text-blue-600">${PRODUCT.price}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gray-200">
                    <Image
                      src={PRODUCT.seller.avatar}
                      alt={PRODUCT.seller.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{PRODUCT.seller.name}</p>
                    <p className="text-sm text-gray-500">Joined {PRODUCT.seller.joined}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-blue-50 px-3 py-1">
                  <p className="text-sm font-medium text-blue-600">{PRODUCT.seller.rating} ★</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="mt-2 text-gray-600">{PRODUCT.description}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Condition</h3>
                  <p className="mt-2 text-gray-600">{PRODUCT.condition}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="mt-2 text-gray-600">{PRODUCT.location}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {isAuthenticated ? (
                  <>
                    <button className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700">
                      Message Seller
                    </button>
                    <button className="rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50">
                      <Heart className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700">
                    Login to Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

