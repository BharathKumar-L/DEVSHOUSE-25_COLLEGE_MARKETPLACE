import Link from "next/link"
import Image from "next/image"
import { Eye } from "lucide-react"

export default function ProductCard({ product }) {
  const { id, title, price, category, image, seller, postedDate } = product

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
          {category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
        <p className="mb-4 text-2xl font-bold text-blue-600">${price}</p>

        <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="font-medium">By</span> {seller}
          </span>
          <span>{postedDate}</span>
        </div>

        <Link
          href={`/product/${id}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
        >
          <Eye className="h-5 w-5" />
          <span className="font-medium">View Details</span>
        </Link>
      </div>
    </div>
  )
}

