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
    messages: [
      {
        id: 1,
        sender: "John D.",
        text: "Hi! I saw your listing for the Calculus textbook. Is it still available?",
        time: "2h ago",
      },
      {
        id: 2,
        sender: "You",
        text: "Yes, it's still available! It's in great condition.",
        time: "1h ago",
      },
      {
        id: 3,
        sender: "John D.",
        text: "That's great! Could you tell me which edition it is?",
        time: "45m ago",
      },
      {
        id: 4,
        sender: "You",
        text: "It's the 8th edition, published in 2022.",
        time: "30m ago",
      },
      {
        id: 5,
        sender: "John D.",
        text: "Perfect! I need that exact edition. How much are you asking for it?",
        time: "2m ago",
      },
    ],
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
    messages: [
      {
        id: 1,
        sender: "Sarah M.",
        text: "Hi! I'm interested in the laptop you're selling.",
        time: "1d ago",
      },
      {
        id: 2,
        sender: "You",
        text: "Hello! Yes, it's a great laptop. What would you like to know about it?",
        time: "1d ago",
      },
      {
        id: 3,
        sender: "Sarah M.",
        text: "Could you tell me the battery life and if it comes with the original charger?",
        time: "1d ago",
      },
      {
        id: 4,
        sender: "You",
        text: "The battery lasts about 6-7 hours with normal use, and yes, it comes with the original charger.",
        time: "1d ago",
      },
      {
        id: 5,
        sender: "Sarah M.",
        text: "Thanks for the quick response! I'll get back to you soon.",
        time: "1d ago",
      },
    ],
  },
  {
    id: 3,
    user: {
      name: "Alex K.",
      avatar: "/placeholder.svg",
    },
    lastMessage: "When can we meet to exchange?",
    time: "3d ago",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "Alex K.",
        text: "I'd like to buy your bike. Is it still available?",
        time: "3d ago",
      },
      {
        id: 2,
        sender: "You",
        text: "Yes, it's still available! It's in perfect condition.",
        time: "3d ago",
      },
      {
        id: 3,
        sender: "Alex K.",
        text: "Great! I can meet you on campus. When are you free?",
        time: "3d ago",
      },
      {
        id: 4,
        sender: "You",
        text: "I'm free tomorrow after 2 PM at the student center.",
        time: "3d ago",
      },
      {
        id: 5,
        sender: "Alex K.",
        text: "Perfect! I'll see you there at 2:30 PM.",
        time: "3d ago",
      },
    ],
  },
]

export default function ChatPage() {
  const { user } = useAuth()
  const [activeChat, setActiveChat] = useState(null)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat) return

    // In a real app, this would send the message to a backend
    const updatedChat = {
      ...activeChat,
      messages: [
        ...activeChat.messages,
        {
          id: activeChat.messages.length + 1,
          sender: "You",
          text: newMessage,
          time: "Just now",
        },
      ],
      lastMessage: newMessage,
      time: "Just now",
    }

    setActiveChat(updatedChat)
    setNewMessage("")
  }

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
                {activeChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-4 ${
                      message.sender === "You" ? "justify-end" : ""
                    }`}
                  >
                    {message.sender !== "You" && (
                      <img
                        src={activeChat.user.avatar}
                        alt={message.sender}
                        className="h-10 w-10 rounded-full object-cover border-2 border-black"
                      />
                    )}
                    <div
                      className={`brutal-card max-w-[70%] p-4 ${
                        message.sender === "You" ? "bg-yellow-400" : ""
                      }`}
                    >
                      <p className="brutal-text">{message.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                    </div>
                    {message.sender === "You" && (
                      <img
                        src={user?.avatar || "/placeholder.svg"}
                        alt="You"
                        className="h-10 w-10 rounded-full object-cover border-2 border-black"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-4 border-black p-6">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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

