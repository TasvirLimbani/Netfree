import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import PlayerClient from "./client"

export const metadata = {
  title: "Watch Online Free - NetFree | Watch Movies & TV Shows",
  description: "Stream your favorite movies and TV shows with NetFree player",
}

export default function PlayerPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <Suspense fallback={<PlayerLoadingFallback />}>
        <PlayerClient />
      </Suspense>
    </main>
  )
}

function PlayerLoadingFallback() {
  return (
    <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="aspect-video bg-muted rounded-lg mb-4"></div>
        <div className="h-8 bg-muted rounded-lg w-1/3"></div>
      </div>
    </div>
  )
}
