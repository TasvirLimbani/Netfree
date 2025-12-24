import { Navbar } from "@/components/navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { MoviesSection } from "@/components/movies-section"
import { TvShowsSection } from "@/components/tv-shows-section"
import { fetchTrendingMovies, fetchTrendingTv } from "@/lib/tmdb"

export const metadata = {
  title: "NetFree - Watch Free Movies & TV Shows Online | Free Streaming",
  description:
    "Stream unlimited free movies and TV shows in HD quality on NetFree. No subscription required. Discover trending content with personalized recommendations and easy search.",
  keywords: "free movies, streaming, watch online, TV shows, entertainment, free streaming, movies online, cinema",
  openGraph: {
    title: "NetFree - Watch Free Movies & TV Shows",
    description: "Stream unlimited free movies and TV shows with HD quality and personalized recommendations",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function Home() {
    const trendingMovies = await fetchTrendingMovies("week");
    const popularTv = await fetchTrendingTv("week");
    const topRatedMovies = await fetchTrendingMovies("day");
  
    return (
      <main className="bg-background">
        <Navbar />
        <HeroCarousel />
        <MoviesSection title="Trending Movies This Week"   movies={trendingMovies.results.slice(0, 12)} />
        <TvShowsSection title="Popular TV Shows" tvShow={popularTv.results} />
        <MoviesSection title="Top Rated Movies" movies={topRatedMovies.results} />
      </main>
    )
  }
  

