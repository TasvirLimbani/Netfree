"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { MovieCard } from "@/components/movie-card"
import { searchMovies, type Movie } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const data = await searchMovies(query)
      setResults(data.results.slice(0, 24))
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 animate-slide-left">Search</h1>

          <form onSubmit={handleSearch} className="mb-12 animate-fade-scale">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search movies, TV shows, actors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-card border-border text-white placeholder:text-gray-500"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white hover-lift">
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>

          {searched && (
            <>
              <p className="text-gray-400 mb-8">
                {loading ? "Searching..." : `Found ${results.length} results for "${query}"`}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.map((result, idx) => (
                  <div key={result.id} className="animate-fade-scale" style={{ animationDelay: `${idx * 30}ms` }}>
                    <MovieCard movie={result} type={result.media_type === "tv" ? "tv" : "movie"} />
                  </div>
                ))}
              </div>

              {results.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No results found</p>
                </div>
              )}
            </>
          )}

          {!searched && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Start searching to find your favorite movies and shows</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
