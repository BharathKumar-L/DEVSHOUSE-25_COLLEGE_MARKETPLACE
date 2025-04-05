import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import ClientLayout from "@/components/ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "College Marketplace",
  description: "Buy and sell items within your college community",
  generator: "v0.dev"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>
            <Navbar />
            <main className="mt-16">{children}</main>
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
