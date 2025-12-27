import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"
import AdBlockDetector from "@/components/AdblockDetector"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NetFree - Free Movies & TV Shows Streaming Platform",
  description:
    "Watch unlimited free movies and TV shows on NetFree. Stream thousands of movies and TV series with HD quality. No subscription required. Personalized recommendations and easy search.",
  keywords: [
    "netfree",
    "netfree movies",
    "netfree TV shows",
    "netfree cc",
    "free movies",
    "free TV shows",
    "streaming",
    "watch movies online",
    "watch TV shows online",
    "free streaming",
    "movies",
    "TV series",
    "entertainment",
    "cinema",
    "online movies",
    "HD streaming",
    "watch online free",
    "watch free movies",
    "watch free TV shows",
    "watch free movies online",
    "watch free TV shows online",
    "watch movies online free",
    "watch TV shows online free",
    "watch movies free",
    "watch TV shows free",
  ],
  icons: {
    icon: [
      { url: "/netfree-logo.png" },
      { url: "/netfree-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/netfree-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "NetFree - Free Movies & TV Shows Streaming Platform",
    description: "Watch unlimited free movies and TV shows in HD quality with personalized recommendations.",
    type: "website",
    url: "https://netfree-coral.vercel.app/",
    siteName: "NetFree",
    images: [
      {
        url: "/netfree-logo.png",
        width: 1200,
        height: 630,
        alt: "NetFree - Free Streaming Platform",
      },
    ],

  },
  twitter: {
    card: "summary_large_image",
    title: "NetFree - Free Movies & TV Shows",
    description: "Stream unlimited free movies and TV shows",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://netfree-coral.vercel.app",
  },
  generator: 'Radhe Software Solutions',
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#16A085",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#16A085" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="NetFree" />
        <link rel="manifest" href="/manifest.json" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "NetFree",
              url: "https://netfree.app",
              description: "Free streaming platform for movies and TV shows",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://netfree.app/search?q={search_term_string}",
                },
                query_input: "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          id="ad-script"
          dangerouslySetInnerHTML={{
            __html: `
             (function(s){s.dataset.zone='10382272',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
            `,
          }}
        />

      </head>
      <body className={`${geist.className} antialiased bg-background`}>
        <AuthProvider>{children}</AuthProvider>
        <AdBlockDetector />
        <Analytics />
      </body>
    </html>
  )
}
