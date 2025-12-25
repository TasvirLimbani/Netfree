"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, X, LogOut, LogIn, Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" title="NetFree - Free Streaming Platform">
          {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform duration-300">
            NF
          </div> */}
          <img src="/logo.png" alt="" className="w-9 h-8" />
          <span className="text-xl font-bold text-white hidden sm:inline">NetFree</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-primary transition-colors duration-300">
            Home
          </Link>
          <Link href="/movies" className="text-gray-300 hover:text-primary transition-colors duration-300">
            Movies
          </Link>
          <Link href="/tv-shows" className="text-gray-300 hover:text-primary transition-colors duration-300">
            TV Shows
          </Link>
          <Link href="/search" className="text-gray-300 hover:text-primary transition-colors duration-300">
            <Search className="w-5 h-5" />
          </Link>
          {user && (
            <Link href="/favorites" className="text-gray-300 hover:text-primary transition-colors duration-300">
              <Heart className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm hidden sm:block bg-primary/50 hover:bg-primary/90 text-white gap-2 hover-lift px-3 py-1 rounded-full">
                {user.displayName || user.email?.split("@")[0]}
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-primary hover:bg-primary/10 gap-2 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-primary hover:bg-primary/10 gap-2 transition-all duration-300"
              >
                {/* <LogIn className="w-4 h-4" /> */}
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border animate-fade-scale">
          <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
            <Link href="/" className="text-gray-300 hover:text-primary transition-colors py-2">
              Home
            </Link>
            <Link href="/movies" className="text-gray-300 hover:text-primary transition-colors py-2">
              Movies
            </Link>
            <Link href="/tv-shows" className="text-gray-300 hover:text-primary transition-colors py-2">
              TV Shows
            </Link>
            <Link href="/search" className="text-gray-300 hover:text-primary transition-colors py-2">
              Search
            </Link>
            {user && (
              <Link href="/favorites" className="text-gray-300 hover:text-primary transition-colors py-2">
                Favorites
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
