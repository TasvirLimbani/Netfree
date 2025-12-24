"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { type Movie, getImageUrl } from "@/lib/tmdb"

interface MovieCardProps {
  movie: Movie
  type?: "movie" | "tv"
}

export function MovieCard({ movie, type = "movie" }: MovieCardProps) {
  const title = movie.title || movie.name || "Unknown"
  const href = `/${type === "movie" ? "movie" : "tv-show"}/${movie.id}?type=${type}`

  return (
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-lg bg-card hover-lift">
        {/* Poster Image */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden group">
          <Image
            src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover Overlay Info */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-sm text-gray-200 line-clamp-2">
              {movie.overview}
            </p>
          </div>
        </div>


        {/* Card Info */}
        <div className="p-4">
          <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">{title}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm text-gray-400">{(movie.vote_average / 2).toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">{movie.release_date || movie.first_air_date || "N/A"}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
