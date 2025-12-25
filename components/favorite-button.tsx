"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { addToFavorites, removeFromFavorites, getUserPreferences } from "@/lib/user-preferences"
import { trackAddToFavorites } from "@/lib/analytics"

interface FavoriteButtonProps {
  movie: any
  contentType: "movie" | "tv"
}

export function FavoriteButton({ movie, contentType }: FavoriteButtonProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return
      const prefs = await getUserPreferences()
      if (!prefs) return

      const favorites =prefs.favoriteMovies
        // contentType === "movie" ? prefs.favoriteMovies : prefs.favoriteTvShows

      setIsFavorite(favorites?.some((m: any) => m.id === movie.id))
    }

    checkFavorite()
  }, [user, movie.id, contentType])

  const handleToggleFavorite = async () => {
    if (!user) return
    setLoading(true)

    try {
      if (isFavorite) {
        await removeFromFavorites(movie.id, contentType)
        setIsFavorite(false)
      } else {
        const favoriteData = {
          id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          overview: movie.overview,
          vote_average: movie.vote_average,
          release_date: movie.release_date || movie.first_air_date,
          media_type: contentType,
          addedAt: Date.now(),
        }

        await addToFavorites(favoriteData, contentType)
        setIsFavorite(true)
        trackAddToFavorites(movie.id, contentType)
      }
    } catch (err) {
      console.error("Favorite error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Button
      onClick={handleToggleFavorite}
      disabled={loading}
      variant="ghost"
      size="sm"
      className={`gap-2 transition-all duration-300 ${
        isFavorite
          ? "text-red-500 bg-red-500/10"
          : "text-gray-400 hover:text-red-500"
      }`}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "Favorited" : "Add"}
    </Button>
  )
}
