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
  media_type?: string
}

export interface MovieDetail extends Movie {
  genres?: Array<{ id: number; name: string }>
  runtime?: number
  number_of_seasons?: number
  created_by?: Array<{ id: number; name: string }>
}

export const getImageUrl = (path: string | null, size = "w500") => {
  if (!path) return "/noimagep.png"
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export const fetchTrendingMovies = async (timeWindow: "day" | "week" = "week") => {
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=ce20e7cf6328f6174905bf11f6e0ea5d&page=1`);
  return response.json();
}
export const fetchUpcomingMovies = async (timeWindow: "day" | "week" = "week") => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`);
  return response.json();
}
export const fetchTopratedMovies = async (timeWindow: "day" | "week" = "week") => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`);
  return response.json();
}
export const fetchPopularMovies = async (timeWindow: "day" | "week" = "week") => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`);
  return response.json();
}

export const fetchDiscoverMovies = async (timeWindow: "day" | "week" = "week") => {
  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`);
  return response.json();
}

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

export const getSeasonDetails = async (tvId: number, seasonNumber: number) => {
  const response = await fetch(`/api/tmdb/seasons?tvId=${tvId}&seasonNumber=${seasonNumber}`)
  return response.json()
}

export const getEpisodeDetails = async (tvId: number, seasonNumber: number, episodeNumber: number) => {
  const response = await fetch(
    `/api/tmdb/episodes?tvId=${tvId}&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}`,
  )
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