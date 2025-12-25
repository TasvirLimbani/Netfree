import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import TVShowClient from "./client"
import { getMovieDetails, getImageUrl, type MovieDetail } from "@/lib/tmdb"

interface TVShowPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: TVShowPageProps): Promise<Metadata> {
  const { id } = await params
  const tvShow = (await getMovieDetails(Number(id.split("-")[0]), "tv")) as MovieDetail | null

  if (!tvShow) {
    return {
      title: "TV Show - NetFree",
      description: "Watch TV shows on NetFree streaming platform",
    }
  }

  const title = tvShow.name || "Unknown Show"
  const description =
    tvShow.overview || `Watch ${title} on NetFree. Stream free TV series in HD quality. No subscription required.`

  return {
    title: `${title} - Watch Online Free | Watch Free on NetFree | Free Streaming TV Series`,
    description: description.substring(0, 160),
    keywords: `${title}, watch free TV series, streaming, episodes, ${tvShow.genres?.map((g: any) => g.name).join(", ")}`,
    openGraph: {
      title: `${title} - NetFree`,
      description: description.substring(0, 160),
      // type: "tv.series",
      url: `https://netfree.app/tv/${Number(id.split("-")[0])}`,
      images: [
        {
          url: getImageUrl(tvShow.poster_path),
          width: 500,
          height: 750,
          alt: title,
        },
      ],
    },
  }
}

export default async function TVShowPage({ params }: TVShowPageProps) {
  const { id } = await params
  const tvShowData = (await getMovieDetails(Number(id.split("-")[0]), "tv")) as MovieDetail | null

  if (!tvShowData || (tvShowData as any).success === false || (tvShowData as any).status_code === 34) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto text-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl font-bold text-white mb-4">404 - TV Show Not Found</h1>
            <p className="text-xl text-gray-400 mb-8">
              Sorry, the TV show you are looking for is not available on NetFree or has been removed.
            </p>
            <div className="space-y-4">
              <p className="text-gray-500">
                Try searching for another show or browse our collection of trending series.
              </p>
              <a
                href="/tv-shows"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 hover-lift"
              >
                Browse All TV Shows
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
      <TVShowClient tvId={Number(id.split("-")[0])} />
    </main>
  )
}
