"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { User, Mail, Phone, MapPin, Edit2, Camera, GraduationCap } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    yearOfStudy: user?.yearOfStudy || "",
    phone: user?.phone || "",
    location: user?.location || "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await updateProfile(formData)
      setSuccess("Profile updated successfully")
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="brutal-card brutal-card-hover bg-yellow-50">
            <div className="flex items-center justify-between">
              <h1 className="brutal-heading-2 text-blue-900">Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="brutal-button-secondary flex items-center gap-2"
              >
                <Edit2 className="h-5 w-5" />
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-600 text-red-900">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-600 text-green-900">
                {success}
              </div>
            )}

            <div className="mt-8">
              <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-gray-200">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-full w-full p-8 text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white">
                        <Camera className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="mt-4 w-full">
                      <label className="brutal-text block text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="brutal-input mt-1 w-full"
                      />
                    </div>
                  ) : (
                    <h2 className="brutal-heading-3 mt-4 text-blue-900">
                      {user?.name || "User"}
                    </h2>
                  )}
                  <p className="brutal-text text-gray-600">{user?.email}</p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <GraduationCap className="h-5 w-5 text-blue-900" />
                    <div className="flex-1">
                      <label className="brutal-text block text-gray-700">
                        Year of Study
                      </label>
                      {isEditing ? (
                        <select
                          name="yearOfStudy"
                          value={formData.yearOfStudy}
                          onChange={handleInputChange}
                          className="brutal-input mt-1 w-full"
                        >
                          <option value="">Select Year</option>
                          <option value="1">First Year</option>
                          <option value="2">Second Year</option>
                          <option value="3">Third Year</option>
                          <option value="4">Fourth Year</option>
                          <option value="5">Fifth Year</option>
                          <option value="graduate">Graduate</option>
                        </select>
                      ) : (
                        <p className="brutal-text mt-1 text-gray-900">
                          {user?.yearOfStudy || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-blue-900" />
                    <div className="flex-1">
                      <label className="brutal-text block text-gray-700">
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="brutal-input mt-1 w-full"
                        />
                      ) : (
                        <p className="brutal-text mt-1 text-gray-900">
                          {user?.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-blue-900" />
                    <div className="flex-1">
                      <label className="brutal-text block text-gray-700">
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="brutal-input mt-1 w-full"
                        />
                      ) : (
                        <p className="brutal-text mt-1 text-gray-900">
                          {user?.location || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8">
                    <button 
                      onClick={handleSubmit}
                      className="brutal-button-primary w-full"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 