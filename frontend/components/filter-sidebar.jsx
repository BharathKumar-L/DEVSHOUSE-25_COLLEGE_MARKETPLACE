"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"

const CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Appliances", "Sports", "Other"]

export default function FilterSidebar({ onFilterChange, onClose }) {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState(100)
  const [sortBy, setSortBy] = useState("newest")

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      priceRange,
      sortBy,
    })

    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="neo-brutalism bg-white p-6">
      {onClose && (
        <div className="mb-4 flex justify-end">
          <button onClick={onClose} className="rounded-full border-2 border-black p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <h2 className="mb-6 text-2xl font-black">FILTERS</h2>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-bold">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex cursor-pointer items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center border-3 border-black ${
                  selectedCategories.includes(category) ? "bg-neo-blue" : "bg-white"
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {selectedCategories.includes(category) && <Check className="h-4 w-4 text-white" />}
              </div>
              <span className="font-medium">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-bold">Max Price: ${priceRange}</h3>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="h-3 w-full appearance-none rounded-full bg-gray-200"
        />
        <div className="mt-1 flex justify-between text-sm">
          <span>$0</span>
          <span>$500</span>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-bold">Sort By</h3>
        <div className="space-y-2">
          {["newest", "price-low", "price-high"].map((option) => {
            const label =
              option === "newest"
                ? "Newest First"
                : option === "price-low"
                  ? "Price: Low to High"
                  : "Price: High to Low"

            return (
              <label key={option} className="flex cursor-pointer items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-3 border-black ${
                    sortBy === option ? "bg-neo-green" : "bg-white"
                  }`}
                  onClick={() => setSortBy(option)}
                >
                  {sortBy === option && <div className="h-3 w-3 rounded-full bg-black"></div>}
                </div>
                <span className="font-medium">{label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Apply Button */}
      <button onClick={applyFilters} className="neo-brutalism-button w-full bg-neo-yellow font-black">
        APPLY FILTERS
      </button>
    </div>
  )
}

