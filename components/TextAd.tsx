"use client"

import Script from "next/script"

declare global {
  interface Window {
    initTextAd?: (args: any[]) => void
  }
}

export default function TextAd() {
  return (
    <>
      {/* Ad container */}
      <div
        id="7SAD15694FBDC1A11F8"
        data-7pub="7SAD15694FBDC1A11F8"
      />

      {/* Ad script */}
      <Script
        src="https://code.adclickppc.com/7s-text-ad.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.initTextAd) {
            window.initTextAd([
              "7SAD15694FBDC1A11F8",
              "text",
            ])
          }
        }}
      />
    </>
  )
}
