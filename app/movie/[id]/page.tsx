import type { Metadata } from "next"
import MovieClient from "./client"
import { getImageUrl, getMovieDetails } from "@/lib/tmdb";

interface Params {
  params: Promise<{ id: string }>; // <-- params is a Promise now
  searchParams?: { type?: string };
}

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const resolvedParams = await params; // <-- unwrap the Promise
  const { id } = resolvedParams;
  const type1 = searchParams?.type || "tv";

  const movieData = await getMovieDetails(Number(id), "movie");

  if (!movieData) {
    return {
      title: "Movie Details - NetFree",
      description: "View movie details on NetFree free streaming platform",
    };
  }

  const title = movieData.title || "Unknown Movie";
  const description =
    movieData.overview ||
    `Watch ${title} on NetFree. Stream free movies and TV shows with HD quality. No subscription required.`;

  return {
    title: `${title} - Watch Free on NetFree | Free Streaming Movie`,
    description: description.substring(0, 160),
    keywords: `${title}, watch free, streaming, movie, ${movieData.genres?.map((g: any) => g.name).join(", ")}`,
    openGraph: {
      title: `${title} - NetFree`,
      description: description.substring(0, 160),
      type: "video.movie",
      url: `https://netfree.app/tv-show/${id}`,
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
    },
  };
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const resolvedParams = await params; // <-- unwrap the Promise
  const { id } = resolvedParams;
  return <MovieClient ids={id} />
}
