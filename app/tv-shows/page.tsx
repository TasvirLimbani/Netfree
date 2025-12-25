import { Navbar } from "@/components/navbar"
import { MovieCard } from "@/components/movie-card"
import { Pagination } from "@/components/pagination"

export const metadata = {
  title: "TV Shows - NetFree | Stream Free TV Series & Shows",
  description:
    "Discover and stream free TV shows and series on NetFree. Browse popular, trending, and top-rated TV series with HD quality. No subscription needed. Easy pagination and search.",
  keywords:
    "free TV shows, TV series streaming, watch TV online, TV episodes, trending series, popular shows, entertainment, free streaming, series",
  openGraph: {
    title: "TV Shows - NetFree",
    description: "Stream free TV shows and series in HD quality",
    type: "website",
  },
}

interface TvShowsPageProps {
  searchParams: Promise<{ page?: string }>
}

async function fetchTvShowsPage(page: number) {
  const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=ce20e7cf6328f6174905bf11f6e0ea5d&timeWindow=week&page=${page}`)
  if (!response.ok) throw  Error("Failed to fetch TV shows")
  return response.json()
}

export default async function TvShowsPage({ searchParams }: TvShowsPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, Number.parseInt(params.page || "1"))
  const { results, total_pages } = await fetchTvShowsPage(currentPage)

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="px-4 md:px-8 max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-white animate-slide-left">TV Shows</h1>
          <p className="text-gray-400 mt-2">Discover the latest and greatest TV shows</p>
          <p className="text-sm text-gray-500 mt-1">
            Page {currentPage} of {total_pages}
          </p>
        </div>

        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {results?.map((show) => (
              <MovieCard key={show.id} movie={show} type="tv" />
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={total_pages} pathname="/tv-shows" />
        </div>
      </div>
    </main>
  )
}
