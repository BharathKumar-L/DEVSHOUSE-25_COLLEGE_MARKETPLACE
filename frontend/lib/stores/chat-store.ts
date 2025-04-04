import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Chat {
  id: string
  user1Id: string
  user2Id: string
  lastMessage?: string
  updatedAt: string
}

interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: string
}

interface ChatState {
  chats: Chat[]
  messages: Message[]
  startChat: (user1Id: string, user2Id: string) => string
  sendMessage: (message: Message) => void
  getMessagesForChat: (chatId: string) => Message[]
}

// Sample chat data
const sampleChats: Chat[] = [
  {
    id: "chat1",
    user1Id: "1",
    user2Id: "2",
    lastMessage: "Hi, is the calculator still available?",
    updatedAt: new Date().toISOString(),
  },
]

// Sample message data
const sampleMessages: Message[] = [
  {
    id: "msg1",
    chatId: "chat1",
    senderId: "2",
    content: "Hi, is the calculator still available?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "msg2",
    chatId: "chat1",
    senderId: "1",
    content: "Yes, it's still available! When would you like to meet?",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: "msg3",
    chatId: "chat1",
    senderId: "2",
    content: "Great! How about tomorrow at the library around 3pm?",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
]

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: sampleChats,
      messages: sampleMessages,
      startChat: (user1Id, user2Id) => {
        // Check if chat already exists
        const existingChat = get().chats.find(
          (chat) =>
            (chat.user1Id === user1Id && chat.user2Id === user2Id) ||
            (chat.user1Id === user2Id && chat.user2Id === user1Id),
        )

        if (existingChat) {
          return existingChat.id
        }

        // Create new chat
        const newChatId = `chat_${Math.random().toString(36).substring(2, 9)}`
        const newChat: Chat = {
          id: newChatId,
          user1Id,
          user2Id,
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          chats: [newChat, ...state.chats],
        }))

        return newChatId
      },
      sendMessage: (message) => {
        set((state) => {
          // Add message
          const newMessages = [...state.messages, message]

          // Update chat with last message
          const updatedChats = state.chats.map((chat) => {
            if (chat.id === message.chatId) {
              return {
                ...chat,
                lastMessage: message.content,
                updatedAt: message.timestamp,
              }
            }
            return chat
          })

          // Sort chats by updatedAt
          updatedChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

          return {
            messages: newMessages,
            chats: updatedChats,
          }
        })
      },
      getMessagesForChat: (chatId) => {
        return get()
          .messages.filter((message) => message.chatId === chatId)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      },
    }),
    {
      name: "chat-storage",
    },
  ),
)

