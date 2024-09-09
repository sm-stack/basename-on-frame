import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Basename on Frame',
  description: 'Get Based with Frame — Claim Your Basename Instantly!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/Coinbase_Display_Regular-web-1.32.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
