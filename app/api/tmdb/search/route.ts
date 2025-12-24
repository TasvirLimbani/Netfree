const TMDB_API_KEY = "ce20e7cf6328f6174905bf11f6e0ea5d"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return new Response(JSON.stringify({ error: "Query parameter is required" }), { status: 400 })
  }

  if (!TMDB_API_KEY) {
    return new Response(JSON.stringify({ error: "TMDB API key not configured" }), { status: 500 })
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`,
      { next: { revalidate: 60 * 60 } },
    )
    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to search movies" }), { status: 500 })
  }
}
