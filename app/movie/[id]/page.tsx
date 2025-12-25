import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import MovieDetailPage from "./client"
import { getMovieDetails, getImageUrl, type MovieDetail } from "@/lib/tmdb"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const movieData = (await getMovieDetails(Number(id.split("-")[0]), "movie")) as MovieDetail | null

    if (!movieData || (movieData as any).success === false) {
      return {
        title: "Movie Not Found - NetFree",
        description: "The movie you are looking for is not available on NetFree.",
      }
    }

    const title = movieData.title || "Unknown Movie"
    const description =
      movieData.overview || `Watch ${title} on NetFree. Stream free movies in HD quality. No subscription required.`

    return {
      title: `${title} - Watch Online Free | Watch Free on NetFree | Best Free Streaming Movie 2024`,
      description: description.substring(0, 160),
      keywords: `${title}, watch ${title} free, ${title} streaming, free movie streaming, watch movies online, free movies no signup, ${movieData.genres?.map((g: any) => g.name).join(", ")}, best free streaming sites, no registration movies, HD quality streaming`,
      openGraph: {
        title: `${title} - Watch Free on NetFree`,
        description: description.substring(0, 160),
        type: "video.movie",
        url: `https://netfree-coral.vercel.app//movie/${Number(id.split("-")[0])}`,
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
        googleBot: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
    }
  } catch (error) {
    return {
      title: "Error - NetFree",
      description: "An error occurred while loading the movie.",
    }
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movieData = (await getMovieDetails(Number(id.split("-")[0]), "movie")) as MovieDetail | null

  if (!movieData || (movieData as any).success === false || (movieData as any).status_code === 34) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto text-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl font-bold text-white mb-4">404 - Movie Not Found</h1>
            <p className="text-xl text-gray-400 mb-8">
              Sorry, the movie you are looking for is not available on NetFree or has been removed.
            </p>
            <div className="space-y-4">
              <p className="text-gray-500">
                Try searching for another movie or browse our collection of trending titles.
              </p>
              <a
                href="/movies"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 hover-lift"
              >
                Browse All Movies
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <MovieDetailPage />
    </main>
  )
}
