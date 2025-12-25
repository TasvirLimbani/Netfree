"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Clock } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { MovieCard } from "@/components/movie-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getUserPreferences, initializeUserPreferences } from "@/lib/user-preferences"

export default function FavoritesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [favorites, setFavorites] = useState<any[]>([])
  const [continueWatching, setContinueWatching] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (!user) return

    const fetchData = async () => {
      try {
        await initializeUserPreferences()
        const prefs = await getUserPreferences()

        if (!prefs) {
          setLoadingData(false)
          return
        }

        // ✅ FAVORITES (NO TMDB)
        if (prefs.favoriteMovies?.length > 0) {
          setFavorites(
            prefs.favoriteMovies
              .filter((m: any) => m?.id && m.poster_path)
              .map((m: any) => ({
                id: m.id,
                title: m.title,
                poster_path: m.poster_path,
                overview: m.overview,
                vote_average: m.vote_average ?? 0,
                release_date: m.release_date,
                media_type: m.media_type || "movie",
              }))
          )
        }

        // ✅ CONTINUE WATCHING (optional)
        if (prefs.continueWatchingMovies?.length > 0) {
          setContinueWatching(prefs.continueWatchingMovies)
        }

      } catch (err) {
        console.error("Favorites fetch error:", err)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [user, loading, router])

  if (loading || loadingData) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="text-center py-40 text-gray-400 animate-pulse">
          Loading your library…
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-6">
          <Heart className="text-primary" />
          My Library
        </h1>

        <Tabs defaultValue="favorites">
          <TabsList>
            <TabsTrigger value="continue">
              <Clock className="w-4 h-4 mr-2" />
              Continue Watching
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

          {/* CONTINUE WATCHING */}
          <TabsContent value="continue">
            {continueWatching.length === 0 ? (
              <p className="text-gray-400 text-center py-20">
                No items in continue watching
              </p>
            ) : (
              <div className="space-y-4">
                {continueWatching.map((item: any) => (
                  <div key={item.id}>{item.title}</div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* FAVORITES */}
          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <p className="text-gray-400 text-center py-20">
                No favorites yet
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
                {favorites.map((movie: any) => (
                  <div key={movie.id} className="animate-fade-scale">
                    <MovieCard
                      movie={movie}
                      type={movie.media_type}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
