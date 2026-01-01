"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { MovieCard } from "@/components/movie-card"
import { getMovieDetails, getMovieCredits, getImageUrl, type MovieDetail, fetchTrendingMovies } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { Play, Star, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { updateContinueWatching, initializeUserPreferences } from "@/lib/user-preferences"
import { trackContentView, trackWatchTime } from "@/lib/analytics"
import { FavoriteButton } from "@/components/favorite-button"
import { ShareMenu } from "@/components/share-menu"
import BannerAd from "@/components/BannerAd"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params
  const movieData = await getMovieDetails(Number(id), "movie")

  if (!movieData) {
    return {
      title: "Movie Details - NetFree",
      description: "View movie details on NetFree free streaming platform",
    }
  }

  const title = movieData.title || "Unknown Movie"
  const description =
    movieData.overview ||
    `Watch ${title} on NetFree. Stream free movies and TV shows with HD quality. No subscription required.`

  return {
    title: `${title} - Watch Free on NetFree | Free Streaming Movie`,
    description: description.substring(0, 160),
    keywords: `${title}, watch free, streaming, movie, ${movieData.genres?.map((g: any) => g.name).join(", ")}`,
    openGraph: {
      title: `${title} - NetFree`,
      description: description.substring(0, 160),
      type: "video.movie",
      url: `https://netfree-coral.vercel.app//movie/${id}`,
      images: [
        {
          url: getImageUrl(movieData.poster_path),
          width: 500,
          height: 750,
          alt: title,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function MovieDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const type = (searchParams.get("type") || "movie") as "movie" | "tv"
  const { user } = useAuth()

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [credits, setCredits] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [watchStartTime, setWatchStartTime] = useState<number>(0)
  const [watchProgress, setWatchProgress] = useState(0)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieData = await getMovieDetails(Number(id.split("-")[0]), type)
        setMovie(movieData)

        if (movieData) {
          trackContentView(id, type, movieData.title || movieData.name || "Unknown")
          await initializeUserPreferences()
        }

        const creditsData = await getMovieCredits(Number(id.split("-")[0]), type)
        setCredits(creditsData)

        const recData = await fetchTrendingMovies("week")
        setRecommendations(recData.results)

        setWatchStartTime(Date.now())
      } catch (error) {
        console.error("Failed to fetch details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id, type])

  useEffect(() => {
    return () => {
      if (watchStartTime > 0) {
        const watchDuration = Math.round((Date.now() - watchStartTime) / 1000)
        if (watchDuration > 5) {
          trackWatchTime(id, watchDuration)
          if (user && movie) {
            const progress = Math.min(100, (watchDuration / (movie.runtime ? movie.runtime * 60 : 7200)) * 100)
            updateContinueWatching(id, movie.title || movie.name || "Unknown", progress, type)
          }
        }
      }
    }
  }, [watchStartTime, id, user, movie, type])

  if (loading) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="h-12 bg-muted rounded-lg w-1/2"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        </div>
      </main>
    )
  }

  if (!movie) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
          <p className="text-gray-400 text-lg">Movie not found</p>
        </div>
      </main>
    )
  }

  const title = movie.title || movie.name || "Unknown"
  const releaseDate = movie.release_date || movie.first_air_date || "N/A"

  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      <div className="relative h-96 overflow-hidden pt-16">
        <Image
          src={getImageUrl(movie.backdrop_path, "w1280") || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="px-4 md:px-8 max-w-7xl mx-auto -mt-32 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <Image
              src={getImageUrl(movie.poster_path) || "/noimagep.png"}
              alt={title}
              width={200}
              height={300}
              className="rounded-lg shadow-lg hover-lift transition-all duration-300"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-left">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-up">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="text-2xl font-bold text-white">{(movie.vote_average / 2).toFixed(1)}/5</span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                {releaseDate}
              </div>
              {movie.runtime && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-400">{movie.runtime} minutes</span>
                </>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 animate-fade-up">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm hover-lift transition-all duration-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 text-lg mb-8 leading-relaxed text-pretty">{movie.overview}</p>

            <div className="flex flex-wrap gap-4 animate-slide-bottom">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white gap-2 hover-lift transition-all duration-300"
                onClick={() => {
                  if (type === "movie") {
                    window.open(
                      "https://otieu.com/4/10402681",
                      "_blank",
                      "noopener,noreferrer"
                    )
                    window.location.href = `/player?type=movie&id=${encodeURIComponent(id)}`
                  } else {
                    window.open(
                      "https://otieu.com/4/10402681",
                      "_blank",
                      "noopener,noreferrer"
                    )
                    window.location.href = `/player?type=tv&id=${encodeURIComponent(id)}`
                  }
                }}
              >
                <Play className="w-5 h-5" />
                Play Now
              </Button>
              <ShareMenu title={title} url={typeof window !== "undefined" ? window.location.href : ""} />
              <FavoriteButton movie={movie} contentType={type} />
            </div>
          </div>
        </div>
        {/* 🔥 Banner Ad */}
        <div className="my-6 flex justify-center">
          <BannerAd />
        </div>
        {credits && credits.cast && credits.cast.length > 0 && (
          <div className="mt-16 animate-fade-up">
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {credits.cast.map((actor: any, idx: number) => (
                <div
                  key={actor.id}
                  className="rounded-lg pt-3 pb-3 flex flex-col items-center text-center hover-lift transition-all duration-300 animate-fade-scale"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Image
                    src={
                      actor.profile_path
                        ? getImageUrl(actor.profile_path)
                        : "/noimagep.png"
                    }
                    alt={actor.name}
                    width={150}
                    height={225}
                    className="rounded-lg mb-2 object-cover"
                  />

                  <p className="text-white font-semibold text-sm">{actor.name}</p>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>

              ))}
            </div>
          </div>
        )}
        {/* 🔥 Banner Ad */}
        <div className="my-6 flex justify-center">
          <BannerAd />
        </div>
        {recommendations.length > 0 && (
          <div className="mt-16 animate-fade-up">
            <h2 className="text-2xl font-bold text-white mb-6">Recommendations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendations.map((rec, idx) => (
                <div key={rec.id} className="animate-fade-scale" style={{ animationDelay: `${idx * 50}ms` }}>
                  <MovieCard movie={rec} type={type} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
