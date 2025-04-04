import Link from "next/link"
import Image from "next/image"
import { Eye } from "lucide-react"

export default function ProductCard({ product }) {
  const { id, title, price, category, image, seller, postedDate } = product

  // Randomly select a color class for the category badge
  const colorClasses = ["bg-neo-pink", "bg-neo-blue", "bg-neo-green", "bg-neo-yellow", "bg-neo-purple"]

  const randomColorIndex = Math.floor(Math.random() * colorClasses.length)
  const badgeColorClass = colorClasses[randomColorIndex]

  return (
    <div className="neo-brutalism group overflow-hidden bg-white transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className={`absolute right-2 top-2 ${badgeColorClass} border-2 border-black px-2 py-1 font-bold`}>
          {category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 text-xl font-bold">{title}</h3>
        <p className="mb-3 text-2xl font-black">${price}</p>

        <div className="mb-4 flex items-center justify-between text-sm">
          <span>Seller: {seller}</span>
          <span>{postedDate}</span>
        </div>

        <Link
          href={`/product/${id}`}
          className="neo-brutalism-button flex w-full items-center justify-center gap-2 bg-neo-yellow"
        >
          <Eye className="h-5 w-5" />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  )
}

