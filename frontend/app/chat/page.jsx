"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"

// Sample chat data
const CHATS = [
  {
    id: 1,
    user: {
      name: "John D.",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Is the textbook still available?",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    user: {
      name: "Sarah M.",
      avatar: "/placeholder.svg",
    },
    lastMessage: "Thanks for the quick response!",
    time: "1d ago",
    unread: false,
  },
]

export default function ChatPage() {
  const { user } = useAuth()
  const [activeChat, setActiveChat] = useState(null)

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Chat List */}
      <div className="w-full border-r border-gray-200 bg-white md:w-80">
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          {CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex w-full items-center gap-4 border-b border-gray-100 p-4 text-left hover:bg-gray-50 ${
                activeChat?.id === chat.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative h-12 w-12 flex-shrink-0">
                <img
                  src={chat.user.avatar}
                  alt={chat.user.name}
                  className="h-full w-full rounded-full object-cover"
                />
                {chat.unread && (
                  <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue-600"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate font-medium text-gray-900">{chat.user.name}</p>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="truncate text-sm text-gray-500">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="hidden flex-1 flex-col md:flex">
        {activeChat ? (
          <>
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeChat.user.avatar}
                  alt={activeChat.user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{activeChat.user.name}</h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {/* Sample messages */}
                <div className="flex items-start gap-3">
                  <img
                    src={activeChat.user.avatar}
                    alt={activeChat.user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="rounded-lg bg-gray-100 px-4 py-2">
                    <p className="text-sm text-gray-900">Is the textbook still available?</p>
                  </div>
                </div>
                <div className="flex items-start justify-end gap-3">
                  <div className="rounded-lg bg-blue-600 px-4 py-2">
                    <p className="text-sm text-white">Yes, it's still available!</p>
                  </div>
                  <img
                    src={user?.avatar || "/placeholder.svg"}
                    alt="You"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <form className="flex gap-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Select a chat</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

