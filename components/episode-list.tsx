"use client"

import Image from "next/image"
import { Star, Play } from "lucide-react"
import { getImageUrl } from "@/lib/tmdb"

interface Episode {
  episode_number: number
  name: string
  overview: string
  still_path: string | null
  air_date: string
  vote_average: number
  runtime?: number
}

interface EpisodeListProps {
  episodes: Episode[]
  currentEpisode: number
  onEpisodeSelect: (episodeNumber: number) => void
}

export function EpisodeList({ episodes, currentEpisode, onEpisodeSelect }: EpisodeListProps) {
  return (
    <div className="space-y-4">
      {episodes.map((episode, idx) => (
        <button
          key={episode.episode_number}
          onClick={() => onEpisodeSelect(episode.episode_number)}
          className={`w-full text-left p-4 rounded-lg border transition-all duration-300 hover-lift group cursor-pointer animate-fade-scale ${
            currentEpisode === episode.episode_number
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 bg-card hover:bg-card/80"
          }`}
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="flex gap-4">
            <div className="relative flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(episode.still_path, "w342") || "/placeholder.svg?height=180&width=320&query=episode"}
                alt={episode.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-all">
                <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="font-semibold text-white group-hover:text-primary transition-colors">
                  Episode {episode.episode_number}: {episode.name}
                </h4>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm text-gray-400">{(episode.vote_average / 2).toFixed(1)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2 mb-2">{episode.overview}</p>

              <div className="flex gap-4 text-xs text-gray-500">
                {episode.air_date && <span>{new Date(episode.air_date).toLocaleDateString()}</span>}
                {episode.runtime && <span>{episode.runtime} min</span>}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
