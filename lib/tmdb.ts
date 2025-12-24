const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

export interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
  seasons: Season[]
  media_type?: string
}

type Season = {
  id: number
  name: string
  poster_path: string
  episode_count: number
  vote_average: number
  season_number: number
}
export interface MovieDetail extends Movie {
  genres?: Array<{ id: number; name: string }>
  runtime?: number
  number_of_seasons?: number
  created_by?: Array<{ id: number; name: string }>
}

export const getImageUrl = (path: string | null, size = "w500") => {
  if (!path) return "/placeholder.svg"
  return `https://image.tmdb.org/t/p/${size}${path}`
}

// tmdb.ts
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const fetchTrendingMovies = async (timeWindow: "day" | "week" = "week") => {
  const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=ce20e7cf6328f6174905bf11f6e0ea5d&page=1`);
  return response.json();
};



export const fetchTrendingTv = async (timeWindow: "day" | "week" = "week") => {
  const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`)
  return response.json()
}

export const searchMovies = async (query: string) => {
  const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}`)
  return response.json()
}

export const getMovieDetails = async (id: number, type: "movie" | "tv" = "movie") => {
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`)
  return response.json()
}

export const getMovieCredits = async (id: number, type: "movie" | "tv" = "movie") => {
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`)
  return response.json()
}
export const getTVCredits = async (id: number, type: "movie" | "tv" = "movie") => {
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`)
  return response.json()
}
export const getSimilarMovies = async (id: number, type: "movie" | "tv" = "movie") => {
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`)
  return response.json()
}
export const getTVMovies = async (id: number, type: "movie" | "tv" = "movie") => {
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`)
  return response.json()
}
