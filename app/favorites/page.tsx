"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getUserPreferences, initializeUserPreferences } from "@/lib/user-preferences"
import { getMovieDetails } from "@/lib/tmdb"
import { Navbar } from "@/components/navbar"
import { MovieCard } from "@/components/movie-card"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb"

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

    const fetchData = async () => {
      if (!user) return

      try {
        await initializeUserPreferences()
        const prefs = await getUserPreferences()

        if (!prefs) {
          setLoadingData(false)
          return
        }

        if (prefs.favoriteMovies && prefs.favoriteMovies.length > 0) {
          const favMovies = await Promise.all(
            prefs.favoriteMovies.slice(0, 12).map((id: string) => getMovieDetails(Number(id), "movie")),
          )
          setFavorites(favMovies.filter(Boolean))
        }

        // Fetch continue watching data
        if (prefs.continueWatchingMovies && prefs.continueWatchingMovies.length > 0) {
          setContinueWatching(prefs.continueWatchingMovies)
        }

        setLoadingData(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoadingData(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, loading, router])

  if (loading || loadingData) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-40 text-center">
          <p className="text-gray-400 animate-pulse">Loading your library...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12 animate-fade-scale">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            My Library
          </h1>
          <p className="text-gray-400">Manage your favorites and continue watching</p>
        </div>

        <Tabs defaultValue="continue" className="space-y-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="continue" className="data-[state=active]:bg-primary">
              <Clock className="w-4 h-4 mr-2" />
              Continue Watching
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

          {/* Continue Watching Tab */}
          <TabsContent value="continue" className="space-y-6">
            {continueWatching.length === 0 ? (
              <div className="text-center py-20 animate-fade-up">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No items in continue watching</p>
                <p className="text-gray-500 text-sm mt-2">Start watching movies to see them here</p>
                <Link href="/movies" className="text-primary hover:text-primary/80 mt-4 inline-block">
                  Browse Movies
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {continueWatching.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/movie/${item.id}`}
                    className="group block bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 hover-lift"
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative w-24 h-32 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={getImageUrl(item.poster_path) || "/noimagep.png"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2 max-w-xs">
                              <div
                                className="bg-primary h-full rounded-full transition-all duration-300"
                                style={{ width: `${item.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-400">{Math.round(item.progress || 0)}%</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Last watched {new Date(item.lastWatchedAt?.toDate?.() || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            {favorites.length === 0 ? (
              <div className="text-center py-20 animate-fade-up">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No favorites yet</p>
                <p className="text-gray-500 text-sm mt-2">Add movies to your favorites to see them here</p>
                <Link href="/movies" className="text-primary hover:text-primary/80 mt-4 inline-block">
                  Explore Movies
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favorites.map((movie: any) => (
                  <div key={movie.id} className="animate-fade-scale">
                    <MovieCard movie={movie} type="movie" />
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
