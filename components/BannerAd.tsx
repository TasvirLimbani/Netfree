"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    initBannerAd?: (args: any[]) => void
  }
}

export default function BannerAd() {
  const initialized = useRef(false)

  useEffect(() => {
    if (window.initBannerAd && !initialized.current) {
      initialized.current = true
      window.initBannerAd(["7SAD15694F7DAF30FA1", "banner", 5])
    }
  }, [])

  return (
    <div className="w-full flex justify-center">
      {/* ✅ FIXED SIZE IS REQUIRED */}
      <div
        id="7SAD15694F7DAF30FA1"
        data-7pub="7SAD15694F7DAF30FA1"
        style={{
          width: "728px",
          height: "90px",
        }}
      />

      <Script
        src="https://code.adclickppc.com/7s-banner-ad.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (!initialized.current && window.initBannerAd) {
            initialized.current = true
            window.initBannerAd(["7SAD15694F7DAF30FA1", "banner", 5])
          }
        }}
      />
    </div>
  )
}
