"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function BannerAd() {
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.initBannerAd) {
      // @ts-ignore
      window.initBannerAd(["7SAD15694F7DAF30FA1", "banner", 5])
    }
  }, [])

  return (
    <>
      <div
        id="7SAD15694F7DAF30FA1"
        data-7pub="7SAD15694F7DAF30FA1"
      />

      <Script
        src="https://code.adclickppc.com/7s-banner-ad.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          window.initBannerAd?.(["7SAD15694F7DAF30FA1", "banner", 5])
        }}
      />
    </>
  )
}
