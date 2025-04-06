"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { MessageSquare, Shield, Clock, RefreshCw } from "lucide-react"
import { api } from "@/lib/api"

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.get("/api/transactions")
      setTransactions(data)
      setRetryCount(0)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setError(error.message || "Failed to fetch transactions. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchTransactions()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="brutal-container py-12">
          <div className="brutal-card">
            <h1 className="brutal-heading-1 text-blue-900">Please log in to view transactions</h1>
            <p className="brutal-text mt-4 text-gray-700">
              You need to be logged in to view and manage your transactions.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="brutal-container py-12">
        <div className="brutal-card">
          <h1 className="brutal-heading-1 text-blue-900">Secure Transactions</h1>
          <p className="brutal-text mt-4 text-gray-700">
            Manage your transactions and communicate with buyers/sellers securely.
          </p>

          {/* Security Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="brutal-card brutal-card-hover bg-yellow-50">
              <Shield className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">Secure Payments</h3>
              <p className="brutal-text mt-2 text-gray-700">
                All payments are processed securely through our platform.
              </p>
            </div>
            <div className="brutal-card brutal-card-hover bg-blue-50">
              <MessageSquare className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">In-App Messaging</h3>
              <p className="brutal-text mt-2 text-gray-700">
                Chat with buyers/sellers directly through our platform.
              </p>
            </div>
            <div className="brutal-card brutal-card-hover bg-red-50">
              <Clock className="h-12 w-12 text-blue-900" />
              <h3 className="brutal-heading-3 mt-4 text-blue-900">Transaction History</h3>
              <p className="brutal-text mt-2 text-gray-700">
                Keep track of all your transactions in one place.
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="mt-12">
            <div className="flex justify-between items-center">
              <h2 className="brutal-heading-2 text-blue-900">Your Transactions</h2>
              <button
                onClick={handleRetry}
                className="brutal-button-secondary"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="brutal-button-primary"
                  disabled={retryCount >= 3}
                >
                  {retryCount >= 3 ? 'Maximum retries reached' : 'Try Again'}
                </button>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">No transactions found</div>
            ) : (
              <div className="mt-6 space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="brutal-card brutal-card-hover p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="brutal-heading-3 text-blue-900">
                          {transaction.productTitle}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          ${transaction.amount}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Status: {transaction.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => window.location.href = `/chat/${transaction.id}`}
                          className="brutal-button-secondary mt-2"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 