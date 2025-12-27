"use client"

import Script from "next/script"

export default function PopUnderAd() {
  return (
    <>
      <div
        id="7SAD15694F87FE98862"
        data-7pub="7SAD15694F87FE98862"
      />

      <Script
        src="https://code.adclickppc.com/7s-popunder.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          if (typeof initAd === "function") {
            // @ts-ignore
            initAd(["7SAD15694F87FE98862", "popunder"])
          }
        }}
      />
    </>
  )
}
