"use client"

import { useState, useEffect } from "react"
import { fetchTrendingMovies, type Movie } from "@/lib/tmdb"
import { MovieCard } from "./movie-card"

interface MoviesSectionProps {
  title: string
  movies: Movie[]; // pass pre-fetched data

}

export function MoviesSection({ title, movies }: MoviesSectionProps) {
  const [movie, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setMovies(movies)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch movies:", error)
        setLoading(false)
      }
    }

    fetchMovies()
  }, [movies])

  if (loading) {
    return (
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 animate-slide-left">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-shimmer"></div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8 animate-slide-left">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <div className="h-1 w-12 bg-primary rounded-full mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movie.map((movie, idx) => (
          <div
            key={movie.id}
            className="animate-fade-scale"
            style={{
              animationDelay: `${idx * 50}ms`,
              animation: `fadeInScale 0.6s ease-out ${idx * 50}ms both`,
            }}
          >
            <MovieCard movie={movie} type="movie" />
          </div>
        ))}
      </div>
    </section>
  )
}
