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
    <div className="flex h-[calc(100vh-6rem)] mt-24 bg-white">
      {/* Chat List */}
      <div className="w-full border-r-4 border-black bg-white md:w-80">
        <div className="flex h-20 items-center border-b-4 border-black px-6">
          <h2 className="brutal-heading-2">Messages</h2>
        </div>
        <div className="h-[calc(100%-5rem)] overflow-y-auto p-4">
          {CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`brutal-card w-full mb-4 p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                activeChat?.id === chat.id ? "bg-yellow-50" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <img
                    src={chat.user.avatar}
                    alt={chat.user.name}
                    className="h-full w-full rounded-full object-cover border-2 border-black"
                  />
                  {chat.unread && (
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 border-2 border-black"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="brutal-text font-bold">{chat.user.name}</p>
                    <span className="text-sm text-gray-600">{chat.time}</span>
                  </div>
                  <p className="brutal-text text-gray-600">{chat.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="hidden flex-1 flex-col md:flex">
        {activeChat ? (
          <>
            <div className="flex h-20 items-center justify-between border-b-4 border-black px-6">
              <div className="flex items-center gap-4">
                <img
                  src={activeChat.user.avatar}
                  alt={activeChat.user.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-black"
                />
                <div>
                  <h3 className="brutal-heading-3">{activeChat.user.name}</h3>
                  <p className="brutal-text text-gray-600">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Sample messages */}
                <div className="flex items-start gap-4">
                  <img
                    src={activeChat.user.avatar}
                    alt={activeChat.user.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-black"
                  />
                  <div className="brutal-card max-w-[70%] p-4">
                    <p className="brutal-text">Is the textbook still available?</p>
                  </div>
                </div>
                <div className="flex items-start justify-end gap-4">
                  <div className="brutal-card bg-yellow-400 max-w-[70%] p-4">
                    <p className="brutal-text">Yes, it's still available!</p>
                  </div>
                  <img
                    src={user?.avatar || "/placeholder.svg"}
                    alt="You"
                    className="h-10 w-10 rounded-full object-cover border-2 border-black"
                  />
                </div>
              </div>
            </div>

            <div className="border-t-4 border-black p-6">
              <form className="flex gap-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="brutal-input flex-1"
                />
                <button
                  type="submit"
                  className="brutal-button-primary"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="brutal-heading-2">Select a chat</h3>
              <p className="brutal-text mt-4 text-gray-600">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

