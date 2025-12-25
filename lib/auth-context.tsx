"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { auth, googleProvider, logAnalyticsEvent } from "./firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      if (currentUser) {
        logAnalyticsEvent("user_login", {
          user_id: currentUser.uid,
          auth_method: "email",
        })
      }
    })

    return unsubscribe
  }, [])

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
    logAnalyticsEvent("user_signup", { auth_method: "email" })
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
    logAnalyticsEvent("user_login", { auth_method: "email" })
  }

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
    logAnalyticsEvent("user_login", { auth_method: "google" })
  }

  const logout = async () => {
    await signOut(auth)
    logAnalyticsEvent("user_logout")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
