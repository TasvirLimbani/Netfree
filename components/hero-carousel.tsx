"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react"
import { type Movie, fetchTrendingMovies, fetchUpcomingMovies, getImageUrl } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"

export function HeroCarousel() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchUpcomingMovies("week")
        setMovies(data.results.slice(0, 5))
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch trending movies:", error)
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  if (loading || movies.length === 0) {
    return (
      <div className="relative w-full h-screen bg-gradient-dark flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-96 w-full bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  const current = movies[currentIndex]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(current.backdrop_path, "w1280") || "/placeholder.svg"}
          alt={current.title || current.name || "Movie"}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-2xl px-8 md:px-12 animate-fade-scale">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance animate-slide-left">
            {current.title || current.name}
          </h1>
          <p className="text-lg text-gray-300 mb-6 line-clamp-3 animate-slide-left">{current.overview}</p>
          <div className="flex gap-4 animate-slide-left">
            <Link href={`/movie/${current.id}-${current.title.replaceAll(" ", "")}`}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2 hover-lift">
                <Play className="w-5 h-5" />
                Watch Now
              </Button>
            </Link>
            <Link href={`/movie/${current.id}-${current.title.replaceAll(" ", "")}`}>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 gap-2 hover-lift bg-transparent"
              >
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </Link>
          </div>

          {/* Rating */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">{(current.vote_average * 10).toFixed(0)}%</span>
              </div>
              <span className="text-gray-400">Audience Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 md:px-12">
        <div className="flex gap-2">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 text-primary transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-primary/20 hover:bg-primary/40 text-primary transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
