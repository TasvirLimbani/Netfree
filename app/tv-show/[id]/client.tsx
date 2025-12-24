"use client";

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { MovieCard } from "@/components/movie-card"
import { getMovieDetails, getMovieCredits, getImageUrl, type MovieDetail, fetchTrendingMovies, getSimilarMovies } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { Play, Share2, Star, Calendar } from "lucide-react"
import { useRouter } from 'next/navigation'; // App router (Next 13+)
import Link from "next/link";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params

  console.log("Id ::::::::::::::::::::: ", id)
  const movieData = await getMovieDetails(Number(83533), "movie")

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
      url: `https://netfree.app/movie/${id}`,
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
export default function MovieDetailPage({ ids }: { ids: string }) {
  const router = useRouter() // <-- initialize router

  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const type = (searchParams.get("type") || "movie") as "movie" | "tv"

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [credits, setCredits] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieData = await getMovieDetails(Number(id), type)
        setMovie(movieData)

        const creditsData = await getMovieCredits(Number(id), type)
        setCredits(creditsData)

        // Fetch recommendations
        const recData = await getSimilarMovies(Number(id), type)
        setRecommendations(recData.results)
      } catch (error) {
        console.error("Failed to fetch details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id, type])

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

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden pt-16">
        <Image
          src={getImageUrl(movie.backdrop_path, "w1280") || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto -mt-32 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <Image
              src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
              alt={title}
              width={200}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-left">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
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
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">{movie.overview}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => router.push(`/watch/${movie.id}?session=${movie.number_of_seasons}&type=${type}`)}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white gap-2 hover-lift"
              >
                <Play className="w-5 h-5" />
                Play Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 gap-2 bg-transparent"
              >
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Seasons */}
        {movie.seasons?.length > 0 && (

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Seasons</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.seasons.map((season) => (
                <Link
                  href={`${season.season_number === 0 ? "/movie/" : "/tv-show/"}${season.id}?type=${season.season_number === 0 ? "movie" : "tv"}`}
                  className="group"
                >
                  <div
                    key={season.id}
                    className="bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition"
                    onClick={() =>
                      router.replace(
                        `/tv-show/${season.id}?type=${type}`
                      )
                    }

                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                      alt={season.name}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm">
                        {season.name}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        Episodes: {season.episode_count}
                      </p>
                      <p className="text-gray-400 text-xs">
                        ⭐ {season.vote_average}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        )}

        {/* Cast */}
        {credits && credits.cast && credits.cast.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
              {credits.cast.map((actor: any) => (
                <div key={actor.id} className="flex flex-col items-center text-center">
                  <div className="w-[150px] h-[225px] mb-2">
                    <Image
                      src={
                        actor.profile_path
                          ? getImageUrl(actor.profile_path)
                          : "https://image.tmdb.org/t/p/original/MIfJmsLZk5laagRw5IxqPvaI5k.jpg"
                      }
                      alt={actor.name}
                      width={150}
                      height={225}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-white font-semibold text-sm">{actor.name}</p>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Recommendations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((rec, idx) => (
                <div key={rec.id} className="animate-fade-scale" style={{ animationDelay: `${idx * 50}ms` }}>
                  <MovieCard movie={rec} type={type} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main >
  )
}
