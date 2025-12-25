"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackPageView } from "@/lib/analytics"

export function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const startTime = Date.now()

    const handleBeforeUnload = () => {
      const holdTime = Math.round((Date.now() - startTime) / 1000)
      trackPageView(pathname, {
        hold_time_seconds: holdTime,
      })
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    // Also track on page change
    trackPageView(pathname)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [pathname])

  return null
}
