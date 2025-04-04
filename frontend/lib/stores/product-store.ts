import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  userId: string
  collegeId: string
  createdAt: string
}

interface ProductState {
  products: Product[]
  fetchProducts: () => void
  addProduct: (product: Product) => void
  removeProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
}

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    title: "Casio Scientific Calculator",
    description:
      "Barely used Casio FX-991EX scientific calculator. Perfect for engineering and science courses. All functions working perfectly.",
    price: 800,
    category: "Electronics",
    images: ["/placeholder.svg?height=400&width=400&text=Calculator"],
    userId: "2",
    collegeId: "1",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "2",
    title: "Data Structures and Algorithms Textbook",
    description:
      "Cormen's Introduction to Algorithms, 3rd Edition. Some highlighting and notes but in good condition. Essential for CS students.",
    price: 450,
    category: "Books",
    images: ["/placeholder.svg?height=400&width=400&text=Textbook"],
    userId: "3",
    collegeId: "1",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Desk Lamp with USB Charging Port",
    description:
      "Adjustable LED desk lamp with 3 brightness levels and USB charging port. Perfect for late night study sessions in the dorm.",
    price: 600,
    category: "Electronics",
    images: ["/placeholder.svg?height=400&width=400&text=Desk+Lamp"],
    userId: "4",
    collegeId: "1",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "4",
    title: "Ergonomic Office Chair",
    description:
      "Comfortable office chair with lumbar support. Used for one semester, selling because I'm moving off campus. Great for long study sessions.",
    price: 1200,
    category: "Furniture",
    images: ["/placeholder.svg?height=400&width=400&text=Chair"],
    userId: "5",
    collegeId: "1",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "5",
    title: "Tennis Racket - Wilson Pro Staff",
    description:
      "Wilson Pro Staff tennis racket in excellent condition. Used for just one season of intramural tennis. Includes cover.",
    price: 900,
    category: "Sports",
    images: ["/placeholder.svg?height=400&width=400&text=Tennis+Racket"],
    userId: "6",
    collegeId: "1",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "6",
    title: "Graphic Calculator TI-84 Plus",
    description:
      "Texas Instruments TI-84 Plus graphic calculator. Required for calculus and statistics courses. All functions working perfectly.",
    price: 750,
    category: "Electronics",
    images: ["/placeholder.svg?height=400&width=400&text=TI-84"],
    userId: "7",
    collegeId: "1",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
]

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: sampleProducts,
      fetchProducts: () => {
        // In a real app, this would fetch from an API
        // For demo, we'll use the sample data
        set({ products: sampleProducts })
      },
      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products],
        }))
      },
      removeProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }))
      },
      getProductById: (id) => {
        return get().products.find((product) => product.id === id)
      },
    }),
    {
      name: "product-storage",
    },
  ),
)

