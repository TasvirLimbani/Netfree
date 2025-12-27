"use client"

import Script from "next/script"

declare global {
  interface Window {
    initNativeAd?: (args: any[]) => void
  }
}

export default function NativeAd() {
  return (
    <>
      {/* Ad container */}
      <div
        id="7SAD15694FBC149C7A9"
        data-7pub="7SAD15694FBC149C7A9"
      />

      {/* Ad script */}
      <Script
        src="https://code.adclickppc.com/7s-native-ad.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.initNativeAd) {
            window.initNativeAd([
              "7SAD15694FBC149C7A9",
              "native",
              1,
            ])
          }
        }}
      />
    </>
  )
}
