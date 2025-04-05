"use client"

import { useState } from "react"
import { HelpCircle, MessageSquare, Mail, Phone, ChevronDown, Search } from "lucide-react"

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState("faq")
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      question: "How do I list an item for sale?",
      answer: "To list an item, click on the 'Sell Item' button in the navigation bar. Fill out the required information about your item, including title, description, price, and upload photos. Once submitted, your item will be listed on the marketplace.",
      category: "selling"
    },
    {
      question: "How do I contact a seller?",
      answer: "You can contact a seller by clicking on the 'Message' button on their item listing. This will open a chat window where you can communicate with the seller directly.",
      category: "communication"
    },
    {
      question: "What payment methods are accepted?",
      answer: "We support various payment methods including credit/debit cards, PayPal, and bank transfers. The specific payment options will be displayed during the checkout process.",
      category: "payments"
    },
    {
      question: "How do I report a problem?",
      answer: "If you encounter any issues, you can report them by clicking on the 'Report' button on the item listing or by contacting our support team through the contact form below.",
      category: "support"
    },
    {
      question: "How do I update my profile information?",
      answer: "You can update your profile information by going to your profile page and clicking the 'Edit Profile' button. From there, you can modify your name, year of study, and other details.",
      category: "account"
    },
    {
      question: "What should I do if I receive a damaged item?",
      answer: "If you receive a damaged item, please contact the seller immediately through the messaging system. Take photos of the damage and provide them to the seller. If you cannot resolve the issue with the seller, contact our support team for assistance.",
      category: "support"
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = [...new Set(faqs.map(faq => faq.category))]

  return (
    <div className="min-h-screen bg-white">
      <section className="brutal-section">
        <div className="brutal-container">
          <div className="brutal-card brutal-card-hover bg-yellow-50">
            <h1 className="brutal-heading-2 text-blue-900">Help & Support</h1>
            <p className="brutal-text mt-2 text-gray-700">
              Find answers to common questions or contact our support team
            </p>

            {/* Tabs */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setActiveSection("faq")}
                className={`brutal-button ${
                  activeSection === "faq"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900"
                }`}
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                FAQ
              </button>
              <button
                onClick={() => setActiveSection("contact")}
                className={`brutal-button ${
                  activeSection === "contact"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900"
                }`}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Us
              </button>
            </div>

            {/* FAQ Section */}
            {activeSection === "faq" && (
              <div className="mt-8">
                <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="brutal-heading-3 text-blue-900">
                      Frequently Asked Questions
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="brutal-input pl-10 w-full md:w-64"
                      />
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFaqs.map((faq, index) => (
                      <div
                        key={index}
                        className="brutal-card brutal-card-hover bg-white p-4"
                      >
                        <h3 className="brutal-text font-bold text-blue-900">
                          {faq.question}
                        </h3>
                        <p className="brutal-text mt-2 text-gray-700">
                          {faq.answer}
                        </p>
                        <span className="mt-2 inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {faq.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Section */}
            {activeSection === "contact" && (
              <div className="mt-8">
                <div className="brutal-card brutal-card-hover bg-blue-50 p-6">
                  <h2 className="brutal-heading-3 text-blue-900">Contact Us</h2>
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="brutal-card brutal-card-hover bg-white p-4">
                        <div className="flex items-center gap-4">
                          <Mail className="h-5 w-5 text-blue-900" />
                          <div>
                            <h3 className="brutal-text font-bold text-blue-900">
                              Email Support
                            </h3>
                            <p className="brutal-text text-gray-700">
                              support@collegemarketplace.com
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="brutal-card brutal-card-hover bg-white p-4">
                        <div className="flex items-center gap-4">
                          <Phone className="h-5 w-5 text-blue-900" />
                          <div>
                            <h3 className="brutal-text font-bold text-blue-900">
                              Phone Support
                            </h3>
                            <p className="brutal-text text-gray-700">
                              +1 (555) 123-4567
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="brutal-heading-3 text-blue-900">
                        Send us a Message
                      </h3>
                      <form className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="brutal-text block text-gray-700">
                              Name
                            </label>
                            <input
                              type="text"
                              className="brutal-input mt-1 w-full"
                            />
                          </div>
                          <div>
                            <label className="brutal-text block text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              className="brutal-input mt-1 w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="brutal-text block text-gray-700">
                            Subject
                          </label>
                          <input
                            type="text"
                            className="brutal-input mt-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="brutal-text block text-gray-700">
                            Message
                          </label>
                          <textarea
                            rows={4}
                            className="brutal-input mt-1 w-full"
                          />
                        </div>
                        <button className="brutal-button-primary w-full">
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 