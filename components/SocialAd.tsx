"use client"

import Script from "next/script"

declare global {
  interface Window {
    initSocialAd?: (args: any[]) => void
  }
}

export default function SocialAd() {
  return (
    <>
      {/* Ad container */}
      <div
        id="7SAD15694FBD440FC01"
        data-7pub="7SAD15694FBD440FC01"
      />

      {/* Ad script */}
      <Script
        src="https://code.adclickppc.com/7s-social-ad.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.initSocialAd) {
            window.initSocialAd([
              "7SAD15694FBD440FC01",
              "social",
            ])
          }
        }}
      />
    </>
  )
}
