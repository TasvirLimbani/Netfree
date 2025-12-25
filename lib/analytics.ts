"use client"

import { logAnalyticsEvent } from "./firebase"

// Track page views
export const trackPageView = (pageName: string, pageProperties?: Record<string, any>) => {
  logAnalyticsEvent("page_view", {
    page_name: pageName,
    ...pageProperties,
  })
}

// Track movie/TV show interactions
export const trackContentView = (contentId: string, contentType: "movie" | "tv", contentTitle: string) => {
  logAnalyticsEvent("content_view", {
    content_id: contentId,
    content_type: contentType,
    content_title: contentTitle,
  })
}

// Track watch time
export const trackWatchTime = (contentId: string, watchDurationSeconds: number) => {
  logAnalyticsEvent("watch_content", {
    content_id: contentId,
    watch_duration_seconds: watchDurationSeconds,
  })
}

// Track favorites
export const trackAddToFavorites = (contentId: string, contentType: "movie" | "tv") => {
  logAnalyticsEvent("add_to_favorites", {
    content_id: contentId,
    content_type: contentType,
  })
}

// Track search
export const trackSearch = (searchQuery: string, resultsCount: number) => {
  logAnalyticsEvent("search", {
    search_query: searchQuery,
    results_count: resultsCount,
  })
}
