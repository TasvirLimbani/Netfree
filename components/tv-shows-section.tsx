"use client"

import { useState, useEffect } from "react"
import { fetchTrendingTv, type Movie } from "@/lib/tmdb"
import { MovieCard } from "./movie-card"

interface TvShowsSectionProps {
  title: string
  tvShow: Movie[]; // pass pre-fetched data

}

export function TvShowsSection({ title, tvShow }: TvShowsSectionProps) {
  const [shows, setShows] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setShows(tvShow)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch TV shows:", error)
        setLoading(false)
      }
    }

    fetchShows()
  }, [tvShow])

  if (loading) {
    return (
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 animate-slide-left">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 animate-slide-left">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {shows.map((show, idx) => (
          <div key={show.id} className="animate-fade-scale" style={{ animationDelay: `${idx * 50}ms` }}>
            <MovieCard movie={show} type="tv" />
          </div>
        ))}
      </div>
    </section>
  )
}
