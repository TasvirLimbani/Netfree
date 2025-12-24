"use client"

import { useEffect, useState } from "react"

export default function AdBlockPopup() {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const bait = document.createElement("div")
    bait.className = "ads ad adsbox ad-banner ad-placement"
    bait.style.position = "absolute"
    bait.style.height = "10px"
    bait.style.left = "-999px"

    document.body.appendChild(bait)

    setTimeout(() => {
      if (
        bait.offsetHeight === 0 ||
        bait.clientHeight === 0 ||
        getComputedStyle(bait).display === "none"
      ) {
        setBlocked(true)
        document.body.style.overflow = "hidden"
      }

      document.body.removeChild(bait)
    }, 100)
  }, [])

  if (!blocked) return null

  return (
    <div className="adblock-overlay">
      <div className="adblock-popup">
        <h2>Ad Blocker Detected</h2>
        <p>
          Please turn off your ad blocker to continue using{" "}
          <strong>Netfree</strong>.
        </p>

        <button onClick={() => window.location.reload()}>
          I’ve Turned It Off
        </button>
      </div>

      <style jsx>{`
        .adblock-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
        }

        .adblock-popup {
          background: #111;
          color: #fff;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          max-width: 400px;
        }

        .adblock-popup h2 {
          margin-bottom: 10px;
          color: #e50914;
        }

        .adblock-popup button {
          margin-top: 20px;
          padding: 10px 20px;
          background: #e50914;
          border: none;
          color: #fff;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
