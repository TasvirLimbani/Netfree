"use client"

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { VideoPlayer } from "@/components/video-player"
import { SeasonSelector } from "@/components/season-selector"
import { EpisodeList } from "@/components/episode-list"
import { getMovieDetails, getSeasonDetails, getImageUrl } from "@/lib/tmdb"
import { Star, Calendar } from "lucide-react"

export default function PlayerClient() {
  const searchParams = useSearchParams()
  const type = (searchParams.get("type") || "movie") as "movie" | "tv"
  const id = searchParams.get("id") || ""
  const defaultSeason = Number(searchParams.get("season") || "1")
  const defaultEpisode = Number(searchParams.get("episode") || "1")

  const [content, setContent] = useState<any>(null)
  const [currentSeason, setCurrentSeason] = useState(defaultSeason)
  const [currentEpisode, setCurrentEpisode] = useState(defaultEpisode)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getMovieDetails(Number(id), type)
        setContent(data)

        if (type === "tv" && data.seasons) {
          const seasonData = await getSeasonDetails(Number(id), currentSeason)
          setEpisodes(seasonData.episodes || [])
        }
      } catch (error) {
        console.error("Failed to fetch content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [id, type, currentSeason])

  if (loading) {
    return (
      <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="aspect-video bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <p className="text-gray-400">Content not found</p>
      </div>
    )
  }

  const title = content.title || content.name || "Unknown"

  return (
    <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Player */}
      <div className="mb-8 animate-fade-up">
        <VideoPlayer
          tvId={Number(id)}
          seasonNumber={type === "movie" ? 0 : currentSeason}
          episodeNumber={currentEpisode}
          episodeTitle={type === "movie" ? title : episodes[currentEpisode - 1]?.name || "Episode"}
          onEpisodeChange={(season, episode) => {
            setCurrentSeason(season)
            setCurrentEpisode(episode)
          }}
          totalEpisodes={type === "movie" ? 1 : episodes.length}
        />
      </div>

      {/* Content Info */}
      <div className="bg-card rounded-lg p-6 mb-8 animate-slide-up">
        <div className="flex gap-4 items-start mb-4">
          <Image
            src={getImageUrl(content.poster_path) || "/noimagep.png"}
            alt={title}
            width={100}
            height={150}
            className="rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <div className="flex items-center gap-4 mb-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span>{(content.vote_average / 2).toFixed(1)}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{content.release_date || content.first_air_date || "N/A"}</span>
              </div>
            </div>
            <p className="text-gray-300 line-clamp-2">{content.overview}</p>
          </div>
        </div>
      </div>

      {/* TV Show Episodes */}
      {type === "tv" && content.seasons && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 animate-slide-left">
            <h3 className="text-xl font-bold text-white mb-4">Select Season</h3>
            <SeasonSelector seasons={content.seasons} currentSeason={currentSeason} onSeasonChange={setCurrentSeason} />
          </div>

          <div className="lg:col-span-3 animate-slide-right">
            <h3 className="text-xl font-bold text-white mb-4">Episodes</h3>
            {episodes.length > 0 ? (
              <EpisodeList
                episodes={episodes}
                currentEpisode={currentEpisode}
                onEpisodeSelect={(ep) => setCurrentEpisode(ep)}
              />
            ) : (
              <p className="text-gray-400">No episodes available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
