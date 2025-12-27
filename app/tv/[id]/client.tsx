"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getMovieDetails, getSeasonDetails, getImageUrl, type MovieDetail, fetchTrendingMovies, getMovieCredits, getTVCredits, getSimilarMovies } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { Play, Star, Calendar, X } from "lucide-react"
import { FavoriteButton } from "@/components/favorite-button"
import { trackContentView } from "@/lib/analytics"
import { initializeUserPreferences } from "@/lib/user-preferences"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { ShareMenu } from "@/components/share-menu"
import { MovieCard } from "@/components/movie-card"
import BannerAd from "@/components/BannerAd"

interface Season {
  season_number: number
  name: string
  episode_count: number
  air_date: string
  poster_path: string | null
}

interface Episode {
  episode_number: number
  name: string
  overview: string
  still_path: string | null
  air_date: string
  vote_average: number
  runtime?: number
}

export default function TVShowClient({ tvId }: { tvId: number }) {
  const { user } = useAuth()
  const [tvShow, setTvShow] = useState<MovieDetail | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [credits, setCredits] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllSeasons, setShowAllSeasons] = useState(false)
  const [watchStartTime, setWatchStartTime] = useState(0)

  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        setLoading(true)
        const showData = await getMovieDetails(tvId, "tv")
        setTvShow(showData)

        const creditsData = await getTVCredits(Number(tvId), "tv")
        setCredits(creditsData)

        const recData = await getSimilarMovies(Number(tvId), "tv")
        setRecommendations(recData.results)
        setLoading(false)
        if (showData) {
          trackContentView(String(tvId), "tv", showData.name || "Unknown")
          await initializeUserPreferences()
          setSeasons(showData.seasons || [])
          if (showData.seasons && showData.seasons.length > 0) {
            const lastSeason = showData.seasons[showData.seasons.length - 1]
            setSelectedSeason(lastSeason)
          }
        }

        setWatchStartTime(Date.now())
      } catch (error) {
        console.error("Failed to fetch TV show:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTvShowDetails()
  }, [tvId])

  useEffect(() => {
    const fetchSeasonEpisodes = async () => {
      if (selectedSeason) {
        try {
          const seasonData = await getSeasonDetails(tvId, selectedSeason.season_number)
          setEpisodes(seasonData.episodes || [])
        } catch (error) {
          console.error("Failed to fetch season episodes:", error)
        }
      }
    }

    fetchSeasonEpisodes()
  }, [tvId, selectedSeason])

  const title = tvShow?.name || "Unknown"
  const lastSeason = seasons.length > 0 ? seasons[seasons.length - 1] : null
  if (loading) {
    return (
      <main className="bg-background min-h-screen">
        {/* <Navbar /> */}
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
  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden pt-16">
        <Image
          src={getImageUrl(tvShow?.backdrop_path, "w1280") || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <Image
              src={getImageUrl(tvShow?.poster_path) || "/noimagep.png"}
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
                <span className="text-2xl font-bold text-white">{(tvShow?.vote_average / 2).toFixed(1)}/5</span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                {tvShow?.first_air_date}
              </div>
              {tvShow?.number_of_seasons && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-400">{tvShow.number_of_seasons} seasons</span>
                </>
              )}
            </div>

            {tvShow?.genres && tvShow.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 animate-fade-up">
                {tvShow.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm hover-lift transition-all duration-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 text-lg mb-8 leading-relaxed text-pretty">{tvShow?.overview}</p>

            <div className="flex flex-wrap gap-4 animate-slide-bottom">
              <Link href={`/player?type=tv&id=${encodeURIComponent(tvId)}&season=${selectedSeason?.season_number || 1}&episode=1`}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white gap-2 hover-lift transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  Watch Now
                </Button>
              </Link>
              <ShareMenu title={title} url={typeof window !== "undefined" ? window.location.href : ""} />
              <FavoriteButton movie={tvShow} contentType="tv" />
            </div>
          </div>
        </div>

        {/* Last Season Section */}
        {lastSeason && (
          <div className="bg-gradient-to-r from-card to-card/50 border border-border rounded-lg p-8 mb-12 animate-fade-up">
            <h2 className="text-2xl font-bold text-white mb-6">Last Season</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <Image
                  src={getImageUrl(lastSeason.poster_path) || "/noimagep.png"}
                  alt={lastSeason.name}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-lg hover-lift transition-all duration-300"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-4">{lastSeason.name}</h3>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-lg">
                    <Star className="w-5 h-5 fill-primary" />
                    <span className="font-bold">{lastSeason.episode_count}% Quality</span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(lastSeason.air_date).getFullYear()} • {lastSeason.episode_count} Episodes
                  </span>
                </div>

                {episodes.length > 0 && (
                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed">
                      {episodes[episodes.length - 1]?.name && (
                        <>
                          <span className="font-semibold">{episodes[episodes.length - 1].name}</span> (
                          {episodes[episodes.length - 1].episode_number}x{episodes[episodes.length - 1].episode_number},{" "}
                          {lastSeason.air_date})
                          <br />
                        </>
                      )}
                      {episodes[0]?.overview && episodes[0].overview}
                    </p>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 bg-transparent"
                  onClick={() => setShowAllSeasons(true)}
                >
                  View All Seasons
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Episodes Grid */}
        {selectedSeason && episodes.length > 0 && (
          <div className="mb-12 animate-fade-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                {selectedSeason && (
                  <Image
                    src={getImageUrl(selectedSeason.poster_path) || "/noimagep.png"}
                    alt={selectedSeason.name}
                    width={120}
                    height={180}
                    className="rounded-lg shadow-lg hidden md:block"
                  />
                )}
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedSeason.name}</h2>
                  <p className="text-gray-400 mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedSeason.air_date).getFullYear()} • {episodes.length} Episodes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllSeasons(true)}
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 ml-auto"
              >
                <span className="bg-primary text-white px-5 py-2 rounded text-sm font-bold">
                  View Seasons
                </span>
              </button>
            </div>

            {/* Navigation between seasons */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => {
                  const currentIdx = seasons.findIndex((s) => s.season_number === selectedSeason.season_number)
                  if (currentIdx > 0) {
                    const prevSeason = seasons[currentIdx - 1]
                    setSelectedSeason(prevSeason)
                  }
                }}
                disabled={selectedSeason.season_number === seasons[0]?.season_number}
                className="text-primary hover:text-primary/80 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous Season
              </button>
              <button
                onClick={() => {
                  const currentIdx = seasons.findIndex((s) => s.season_number === selectedSeason.season_number)
                  if (currentIdx < seasons.length - 1) {
                    const nextSeason = seasons[currentIdx + 1]
                    setSelectedSeason(nextSeason)
                  }
                }}
                disabled={selectedSeason.season_number === seasons[seasons.length - 1]?.season_number}
                className="text-primary hover:text-primary/80 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                Next Season →
              </button>
            </div>
            {/* Episodes List */}
            <div className="space-y-4">
              {episodes.map((episode, idx) => (
                <Link
                  key={episode.episode_number}
                  href={`/player?type=tv&id=${encodeURIComponent(tvId)}&season=${selectedSeason.season_number}&episode=${episode.episode_number}`}
                >
                  <div
                    className="group cursor-pointer bg-card/50 hover:bg-card border border-border hover:border-primary/50 rounded-lg overflow-hidden transition-all duration-300 hover-lift animate-fade-scale flex flex-col md:flex-row gap-4 p-4"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex-shrink-0 w-full md:w-48">
                      <Image
                        src={
                          getImageUrl(episode.still_path, "w342") ||
                          "/noimagep.png"
                        }
                        alt={episode.name}
                        width={355}
                        height={200}
                        className="w-full aspect-video object-cover rounded group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-primary text-white px-3 py-1 rounded text-xs font-bold">
                            {episode.episode_number}
                          </span>
                          <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded">
                            <Star className="w-4 h-4 fill-primary" />
                            <span className="text-xs font-semibold">{(episode.vote_average / 2).toFixed(1)}</span>
                          </div>
                          <span className="text-gray-400 text-xs ml-auto">{episode.air_date}</span>
                        </div>
                        <h4 className="text-white font-semibold text-lg group-hover:text-primary transition-colors mb-2">
                          {episode.name}
                        </h4>
                        <p className="text-gray-300 text-sm line-clamp-2">{episode.overview}</p>
                      </div>
                      <div className="mt-4">
                        {episode.runtime && (
                          <span className="text-gray-400 text-xs">Runtime: {episode.runtime} minutes</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* All Seasons Modal */}
      {showAllSeasons && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-card border border-border rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Seasons</h2>
              <button
                onClick={() => setShowAllSeasons(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {seasons.map((season, idx) => (
                <button
                  key={season.season_number}
                  onClick={async () => {
                    setSelectedSeason(season)
                    setShowAllSeasons(false)
                    try {
                      const seasonData = await getSeasonDetails(tvId, season.season_number)
                      setEpisodes(seasonData.episodes || [])
                    } catch (error) {
                      console.error("Failed to fetch season:", error)
                    }
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 hover:bg-primary/10 hover-lift animate-fade-scale flex items-center gap-4 ${selectedSeason?.season_number === season.season_number
                    ? "border-primary bg-primary/20"
                    : "border-border hover:border-primary/50"
                    }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Image
                    src={getImageUrl(season.poster_path) || "/noimagep.png"}
                    alt={season.name}
                    width={80}
                    height={120}
                    className="rounded flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                      {season.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {season.episode_count} Episodes • {new Date(season.air_date).getFullYear()}
                    </p>
                  </div>
                  {selectedSeason?.season_number === season.season_number && (
                    <span className="bg-primary text-white px-3 py-1 rounded text-xs font-bold flex-shrink-0">
                      Current
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
        {/* 🔥 Banner Ad */}
        <div className="my-6 flex justify-center">
          <BannerAd />
        </div>
      <div className="px-4 md:px-8 max-w-7xl mx-auto -mt-32 relative z-10 pb-12">
        {credits && credits.cast && credits.cast.length > 0 && (
          <div className="mt-40 animate-fade-up">
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
                        : "https://image.tmdb.org/t/p/original/MIfJmsLZk5laagRw5IxqPvaI5k.jpg"
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
              {credits.crew.map((actor: any, idx: number) => (
                <div
                  key={actor.id}
                  className="rounded-lg pt-3 pb-3 flex flex-col items-center text-center hover-lift transition-all duration-300 animate-fade-scale"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Image
                    src={
                      actor.profile_path
                        ? getImageUrl(actor.profile_path)
                        : "https://image.tmdb.org/t/p/original/MIfJmsLZk5laagRw5IxqPvaI5k.jpg"
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
                  <MovieCard movie={rec} type={"tv"} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
