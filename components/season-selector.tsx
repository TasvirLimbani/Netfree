"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Season {
  season_number: number
  name: string
  episode_count: number
  air_date: string
  poster_path: string | null
}

interface SeasonSelectorProps {
  seasons: Season[]
  currentSeason: number
  onSeasonChange: (seasonNumber: number) => void
}

export function SeasonSelector({ seasons, currentSeason, onSeasonChange }: SeasonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentSeasonData = seasons.find((s) => s.season_number === currentSeason)

  return (
    <div className="relative inline-block w-full md:w-auto">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full md:w-auto border-primary text-primary bg-transparent hover:bg-primary/10 gap-2 animate-slide-left"
      >
        {currentSeasonData?.name || `Season ${currentSeason}`}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full md:w-96 bg-card border border-border rounded-lg shadow-lg z-50 animate-slide-top max-h-96 overflow-y-auto">
          {seasons.map((season) => (
            <button
              key={season.season_number}
              onClick={() => {
                onSeasonChange(season.season_number)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-primary/10 transition-colors ${
                season.season_number === currentSeason ? "bg-primary/20" : ""
              }`}
            >
              <p className="font-semibold text-white">{season.name}</p>
              <p className="text-sm text-gray-400">
                {season.episode_count} episodes • {season.air_date ? new Date(season.air_date).getFullYear() : "TBA"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
