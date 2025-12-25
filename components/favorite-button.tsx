"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { addToFavorites, removeFromFavorites, getUserPreferences } from "@/lib/user-preferences"
import { trackAddToFavorites } from "@/lib/analytics"

interface FavoriteButtonProps {
  contentId: string
  contentType: "movie" | "tv"
  contentTitle: string
}

export function FavoriteButton({ contentId, contentType, contentTitle }: FavoriteButtonProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return

      const prefs = await getUserPreferences()
      if (!prefs) return

      const favorites = contentType === "movie" ? prefs.favoriteMovies : prefs.favoriteTvShows
      setIsFavorite(favorites.includes(contentId))
    }

    checkFavorite()
  }, [user, contentId, contentType])

  const handleToggleFavorite = async () => {
    if (!user) return

    setLoading(true)
    try {
      if (isFavorite) {
        await removeFromFavorites(contentId, contentType)
        setIsFavorite(false)
      } else {
        await addToFavorites(contentId, contentType)
        setIsFavorite(true)
        trackAddToFavorites(contentId, contentType)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
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
        isFavorite ? "text-red-500 bg-red-500/10" : "text-gray-400 hover:text-red-500"
      }`}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "Favorited" : "Add"}
    </Button>
  )
}
