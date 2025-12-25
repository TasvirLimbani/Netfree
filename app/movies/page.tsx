import { Navbar } from "@/components/navbar"
import { MovieCard } from "@/components/movie-card"
import { Pagination } from "@/components/pagination"

export const metadata = {
  title: "All Movies - NetFree | Browse Thousands of Free Movies",
  description:
    "Browse and stream thousands of free movies on NetFree. Discover trending, top-rated, and popular movies with HD quality. No subscription required. Easy search and pagination.",
  keywords:
    "free movies, movie streaming, watch movies online, movie collection, trending movies, top rated movies, new movies, cinema, free film",
  openGraph: {
    title: "All Movies - NetFree",
    description: "Stream thousands of free movies with HD quality and no subscription",
    type: "website",
  },
}

interface MoviesPageProps {
  searchParams: Promise<{ page?: string }>
}

async function fetchMoviesPage(page: number) {
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=ce20e7cf6328f6174905bf11f6e0ea5d&page=${page}`)
  if (!response.ok) throw new Error("Failed to fetch movies")
  return response.json()
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, Number.parseInt(params.page || "1"))
  const { results, total_pages } = await fetchMoviesPage(currentPage)

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="px-4 md:px-8 max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-white animate-slide-left">All Movies</h1>
          <p className="text-gray-400 mt-2">Explore our entire collection of movies</p>
          {/* <p className="text-sm text-gray-500 mt-1">
            Page {currentPage} of {total_pages}
          </p> */}
        </div>

        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {results?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="movie" />
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={total_pages} pathname="/movies" />
        </div>
      </div>
    </main>
  )
}
