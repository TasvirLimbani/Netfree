import type { Metadata } from "next"
import MovieClient from "./client"

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {

  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${params.id}?api_key=ce20e7cf6328f6174905bf11f6e0ea5d`,
    { cache: "no-store" }
  )

  const movie = await res.json()

  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: [`https://image.tmdb.org/t/p/w500${movie.poster_path}`],
    },
  }
}

export default function MoviePage({ params }: { params: { id: string } }) {
  return <MovieClient ids={params.id}/>
}
