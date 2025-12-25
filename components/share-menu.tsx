"use client"

import { useState } from "react"
import { Share2, Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareMenuProps {
  title: string
  url?: string
}

export function ShareMenu({ title, url }: ShareMenuProps) {
  const [showMenu, setShowMenu] = useState(false)
  const currentUrl = typeof window !== "undefined" ? url || window.location.href : ""

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      // alert("Link copied to clipboard!")
      setShowMenu(false)
    } catch {
      alert("Failed to copy link")
    }
  }

  const shareOptions = [
    {
      name: "Copy Link",
      icon: Copy,
      action: handleCopyLink,
    },
    {
      name: "WhatsApp",
      action: () => {
        const text = `Check out ${title} on NetFree!`
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + currentUrl)}`, "_blank")
        setShowMenu(false)
      },
    },
    {
      name: "Facebook",
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank")
        setShowMenu(false)
      },
    },
    {
      name: "Telegram",
      action: () => {
        const text = `Check out ${title} on NetFree!`
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`,
          "_blank",
        )
        setShowMenu(false)
      },
    },
    {
      name: "Twitter",
      action: () => {
        const text = `Watching ${title} on NetFree! 🎬`
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`,
          "_blank",
        )
        setShowMenu(false)
      },
    },
  ]

  return (
    <div className="relative">
      <Button
        size="lg"
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10 gap-2 bg-transparent transition-all duration-300"
        onClick={() => setShowMenu(!showMenu)}
      >
        <Share2 className="w-5 h-5" />
        Share
      </Button>

      {/* Share Menu Popup */}
      {showMenu && (
        <div className="absolute top-full mt-2 right-0 bg-card border border-primary/30 rounded-lg shadow-lg z-50 min-w-48 animate-fade-up">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-white">Share {title}</h3>
            <button onClick={() => setShowMenu(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2 space-y-1">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-primary/10 rounded-md transition-colors text-sm text-gray-300 hover:text-primary"
              >
                {option.icon && <option.icon className="w-4 h-4" />}
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
    </div>
  )
}
