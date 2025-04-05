"use client"

import { useState } from "react"

export default function PrivacyPage() {
  const [formData, setFormData] = useState({
    privacySettings: {
      showEmail: false,
      showPhone: false,
      showLocation: false,
      allowMessages: true,
      allowNotifications: true,
      dataSharing: false
    }
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [name]: checked
      }
    }))
  }

  const handlePrivacySave = async () => {
    try {
      // In a real app, this would make an API call to save privacy settings
      console.log("Privacy settings saved:", formData.privacySettings)
      setSuccess("Privacy settings updated successfully")
    } catch (err) {
      setError("Failed to update privacy settings")
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="brutal-container">
        <div className="brutal-card">
          <h1 className="brutal-heading-1 mb-8">Privacy Settings</h1>

          {/* Error and Success Messages */}
          {error && (
            <div className="brutal-alert brutal-alert-error mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="brutal-alert brutal-alert-success mb-6">
              {success}
            </div>
          )}

          <div className="space-y-8">
            <div className="brutal-card bg-yellow-50">
              <h3 className="brutal-heading-3 mb-4">Profile Visibility</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="showEmail"
                    id="showEmail"
                    checked={formData.privacySettings.showEmail}
                    onChange={handleInputChange}
                    className="brutal-checkbox"
                  />
                  <label htmlFor="showEmail" className="brutal-text">
                    Show my email address to other users
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="showPhone"
                    id="showPhone"
                    checked={formData.privacySettings.showPhone}
                    onChange={handleInputChange}
                    className="brutal-checkbox"
                  />
                  <label htmlFor="showPhone" className="brutal-text">
                    Show my phone number to other users
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="showLocation"
                    id="showLocation"
                    checked={formData.privacySettings.showLocation}
                    onChange={handleInputChange}
                    className="brutal-checkbox"
                  />
                  <label htmlFor="showLocation" className="brutal-text">
                    Show my location to other users
                  </label>
                </div>
              </div>
            </div>

            <div className="brutal-card bg-blue-50">
              <h3 className="brutal-heading-3 mb-4">Communication Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowMessages"
                    id="allowMessages"
                    checked={formData.privacySettings.allowMessages}
                    onChange={handleInputChange}
                    className="brutal-checkbox"
                  />
                  <label htmlFor="allowMessages" className="brutal-text">
                    Allow other users to send me messages
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowNotifications"
                    id="allowNotifications"
                    checked={formData.privacySettings.allowNotifications}
                    onChange={handleInputChange}
                    className="brutal-checkbox"
                  />
                  <label htmlFor="allowNotifications" className="brutal-text">
                    Allow email notifications
                  </label>
                </div>
              </div>
            </div>

            <div className="brutal-card bg-red-50">
              <h3 className="brutal-heading-3 mb-4">Data Sharing</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="dataSharing"
                    id="dataSharing"
                    checked={formData.privacySettings.dataSharing}
                    onChange={handleInputChange}
                    className="brutal-checkbox"
                  />
                  <label htmlFor="dataSharing" className="brutal-text">
                    Allow data sharing with trusted partners for better service
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handlePrivacySave}
                className="brutal-button-primary"
              >
                Save Privacy Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 