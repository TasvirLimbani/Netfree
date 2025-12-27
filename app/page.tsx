import { Navbar } from "@/components/navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { MoviesSection } from "@/components/movies-section"
import { TvShowsSection } from "@/components/tv-shows-section"
import { fetchDiscoverMovies, fetchPopularMovies, fetchTopratedMovies, fetchTrendingMovies, fetchTrendingTv, fetchUpcomingMovies } from "@/lib/tmdb"
import BannerAd from "@/components/BannerAd"
import NativeAd from "@/components/NativeAd"

export const metadata = {
  title: "NetFree - Watch Free Movies & TV Shows Online | Watch Online Free | Free Streaming",
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
  const upcomingMovies = await fetchUpcomingMovies("week");
  const topratedMovies = await fetchTopratedMovies("week");
  const popularMovies = await fetchPopularMovies("week");
  const discoverMovies = await fetchDiscoverMovies("week");
  const popularTv = await fetchTrendingTv("week");
  return (
    <main className="bg-background">
      <Navbar />
      <HeroCarousel />
      <NativeAd />
      <MoviesSection title="Trending Movies" movies={trendingMovies.results} />
      <MoviesSection title="Upcoming Movies" movies={upcomingMovies.results} />
      <MoviesSection title="Popular Movies" movies={popularMovies.results} />
      <TvShowsSection title="Popular TV Shows" tvShow={popularTv.results} />
      <MoviesSection title="Top Rated Movies" movies={topratedMovies.results} />
      <MoviesSection title="Discover Movies" movies={discoverMovies.results} />
    </main>
  )
}
