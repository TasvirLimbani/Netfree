const TMDB_API_KEY = "ce20e7cf6328f6174905bf11f6e0ea5d"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tvId = searchParams.get("tvId")
  const seasonNumber = searchParams.get("seasonNumber")

  if (!tvId || !seasonNumber) {
    return new Response(JSON.stringify({ error: "tvId and seasonNumber parameters are required" }), { status: 400 })
  }

  if (!TMDB_API_KEY) {
    return new Response(JSON.stringify({ error: "TMDB API key not configured" }), { status: 500 })
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 60 * 60 } },
    )
    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch season details" }), { status: 500 })
  }
}