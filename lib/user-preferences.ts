import { db, auth } from "./firebase"
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"

export interface UserPreferences {
  favoriteMovies: string[]
  favoriteTvShows: string[]
  continueWatchingMovies: Array<{
    id: string
    title: string
    progress: number
    lastWatchedAt: Timestamp
  }>
  continueWatchingTvShows: Array<{
    id: string
    title: string
    episodeProgress: number
    lastWatchedAt: Timestamp
  }>
}

export const initializeUserPreferences = async () => {
  const user = auth.currentUser
  if (!user) return

  const userDocRef = doc(db, "users", user.uid)
  const userDoc = await getDoc(userDocRef)

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
      favoriteMovies: [],
      favoriteTvShows: [],
      continueWatchingMovies: [],
      continueWatchingTvShows: [],
    })
  }
}

export const addToFavorites = async (contentId: string, contentType: "movie" | "tv") => {
  const user = auth.currentUser
  if (!user) return

  const userDocRef = doc(db, "users", user.uid)
  const fieldName = "favoriteMovies"
  // const fieldName = contentType === "movie" ? "favoriteMovies" : "favoriteTvShows"

  await updateDoc(userDocRef, {
    [fieldName]: arrayUnion(contentId),
  })
}

export const removeFromFavorites = async (contentId: string, contentType: "movie" | "tv") => {
  const user = auth.currentUser
  if (!user) return

  const userDocRef = doc(db, "users", user.uid)
  const fieldName = "favoriteMovies"
  // const fieldName = contentType === "movie" ? "favoriteMovies" : "favoriteTvShows"

  await updateDoc(userDocRef, {
    [fieldName]: arrayRemove(contentId),
  })
}

export const updateContinueWatching = async (
  contentId: string,
  contentTitle: string,
  progress: number,
  contentType: "movie" | "tv",
) => {
  const user = auth.currentUser
  if (!user) return

  const userDocRef = doc(db, "users", user.uid)
  const fieldName = contentType === "movie" ? "continueWatchingMovies" : "continueWatchingTvShows"

  const userDoc = await getDoc(userDocRef)
  const items = userDoc.get(fieldName) || []

  const existingIndex = items.findIndex((item: any) => item.id === contentId)

  if (existingIndex > -1) {
    items[existingIndex] = {
      ...items[existingIndex],
      progress,
      lastWatchedAt: serverTimestamp(),
    }
  } else {
    items.push({
      id: contentId,
      title: contentTitle,
      progress,
      lastWatchedAt: serverTimestamp(),
    })
  }

  await updateDoc(userDocRef, {
    [fieldName]: items,
  })
}

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const user = auth.currentUser
  if (!user) return null

  const userDocRef = doc(db, "users", user.uid)
  const userDoc = await getDoc(userDocRef)

  if (!userDoc.exists()) {
    await initializeUserPreferences()
    return null
  }

  return userDoc.data() as UserPreferences
}
