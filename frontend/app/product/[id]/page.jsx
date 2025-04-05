"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { MessageSquare, Heart, Share2 } from "lucide-react"

export default function ProductPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)

  // Sample product data - replace with actual data fetching
  // const product = {
  //   id: id,
  //   title: "Sample Product",
  //   description: "This is a sample product description.",
  //   price: 99.99,
  //   condition: "Like New",
  //   category: "Electronics",
  //   images: [
  //     "https://via.placeholder.com/400",
  //   ],
  //   seller: {
  //     name: "John Doe",
  //     rating: 4.5,
  //   },
  // }

  const products = [
    {
      id: 1,
      title: "Engineering Textbook",
      description: "This is a engineering textbook",
      price: 175,
      condition: "like new",
      category: "textbooks",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLqyoM5QobqRCw6DkoXWv-cwXhYDKBYGP2w&s",
      seller: {
            name: "John Doe",
            rating: 4.5,
        },
    },
    {
      id: 2,
      title: "Laptop",
      description: "This is a laptop",
      price: 20000,
      condition: "good",
      category: "electronics",
      image: "https://images.jdmagicbox.com/quickquotes/images_main/second-hand-canon-laptop-2222941636-m878bd8c.jpg",
      seller: {
        name: "John David",
        rating: 4.2,
      },
    },
    {
      id: 3,
      title: "Desk Chair",
      description: "This is a desk chair",
      price: 1500,
      category: "furniture",
      condition: "used",
      image: "https://5.imimg.com/data5/MF/LH/HO/GLADMIN-87315774/used-office-chair-buyer-service-500x500.jpg",
      seller: {
        name: "Tim Jones",
        rating: 4.7,
      },
    }
  ]
  
  // Find the product with the matching ID
  const product = products.find(p => p.id === parseInt(id)) || products[0]

  return (
    <div className="min-h-screen mt-16 bg-white">
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="brutal-grid">
            {/* Product Images */}
            <div className="brutal-card brutal-card-hover bg-yellow-50">
              <img
                src={product.image}
                alt={product.title}
                className="brutal-product-image w-full"
              />
            </div>

            {/* Product Details */}
            <div className="brutal-card brutal-card-hover bg-blue-50">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="brutal-heading-2 text-blue-900">
                    {product.title}
                  </h1>
                  <p className="brutal-text mt-2 text-gray-700">
                    {product.description}
                  </p>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="brutal-button-secondary p-2"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="brutal-text text-gray-700">Price</span>
                  <span className="brutal-text font-bold text-blue-900">
                    ₹{product.price}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="brutal-text text-gray-700">Condition</span>
                  <span className="brutal-text font-bold text-blue-900">
                    {product.condition}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="brutal-text text-gray-700">Category</span>
                  <span className="brutal-text font-bold text-blue-900">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button className="brutal-button-primary w-full">
                  Contact Seller
                </button>
                <button className="brutal-button-secondary flex w-full items-center justify-center gap-2">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="brutal-card brutal-card-hover bg-red-50">
              <h2 className="brutal-heading-3 text-blue-900">Seller Information</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="brutal-text text-gray-700">Name</span>
                  <span className="brutal-text font-bold text-blue-900">
                    {product.seller.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="brutal-text text-gray-700">Rating</span>
                  <span className="brutal-text font-bold text-blue-900">
                    {product.seller.rating}/5.0
                  </span>
                </div>
                <button className="brutal-button-secondary mt-6 w-full">
                  View Seller Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

