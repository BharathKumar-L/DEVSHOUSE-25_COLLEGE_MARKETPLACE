"use client"

import { useState } from "react"
import { X } from "lucide-react"

const CATEGORIES = [
  "Textbooks",
  "Study Materials",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports Equipment",
  "Musical Instruments",
  "Lab Equipment",
  "Stationery",
  "Other",
]

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"]

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
  { label: "Over ₹5000", min: 5000, max: Infinity },
]

export default function FilterSidebar({ onFilterChange, onClose }) {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [selectedPriceRange, setSelectedPriceRange] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleConditionChange = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    )
  }

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range === selectedPriceRange ? null : range)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      conditions: selectedConditions,
      priceRange: selectedPriceRange,
      searchQuery,
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedConditions([])
    setSelectedPriceRange(null)
    setSearchQuery("")
    onFilterChange({
      categories: [],
      conditions: [],
      priceRange: null,
      searchQuery: "",
    })
  }

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search items..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Categories
        </label>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Condition
        </label>
        <div className="space-y-2">
          {CONDITIONS.map((condition) => (
            <label key={condition} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedConditions.includes(condition)}
                onChange={() => handleConditionChange(condition)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Price Range
        </label>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center">
              <input
                type="radio"
                checked={selectedPriceRange === range}
                onChange={() => handlePriceRangeChange(range)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={clearFilters}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear All
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

