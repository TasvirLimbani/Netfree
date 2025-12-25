"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  tvId: number
  seasonNumber: number
  episodeNumber: number
  episodeTitle: string
  onEpisodeChange?: (season: number, episode: number) => void
  totalEpisodes?: number
}

export function VideoPlayer({
  tvId,
  seasonNumber,
  episodeNumber,
  episodeTitle,
  onEpisodeChange,
  totalEpisodes = 1,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const iframeUrl =
    seasonNumber === 0
      ? `https://vidfast.pro/movie/${tvId}`
      : `https://vidfast.pro/tv/${tvId}/${seasonNumber}/${episodeNumber}`

  const handleNextEpisode = () => {
    if (episodeNumber < totalEpisodes) {
      onEpisodeChange?.(seasonNumber, episodeNumber + 1)
    }
  }

  const handlePreviousEpisode = () => {
    if (episodeNumber > 1) {
      onEpisodeChange?.(seasonNumber, episodeNumber - 1)
    }
  }

  const handleFullscreen = () => {
    const iframe = document.getElementById("video-player-iframe") as HTMLIFrameElement
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen().catch(() => {})
    }
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden group">
      {/* Player Container */}
      <div className="relative bg-black aspect-video">
        <iframe
          id="video-player-iframe"
          src={iframeUrl}
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">{episodeTitle}</h3>
              <p className="text-gray-300 text-sm">
                Season {seasonNumber} • Episode {episodeNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePreviousEpisode}
                disabled={episodeNumber === 1}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleNextEpisode}
                disabled={episodeNumber >= totalEpisodes}
                className="text-white hover:bg-white/20"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button size="sm" variant="ghost" onClick={handleFullscreen} className="text-white hover:bg-white/20">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
