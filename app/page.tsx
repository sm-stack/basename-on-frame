import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import frame1 from './images/frame-1.png'
import frame2 from './images/frame-2.png'
import frame3 from './images/frame-3.png'
import shoutout from './images/shoutout.png'

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="w-full pt-2 px-4 sm:px-6 h-16 flex items-center justify-center">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <Link className="flex items-center justify-center" href="#">
            <span className="sr-only">Basename on Frame</span>
            <span className="font-bold text-xl sm:text-2xl" style={{ fontFamily: "'Coinbase Display', sans-serif", color: "#0355FF" }}>Basename on Frame</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center w-full">
        <section className="w-full py-12 sm:py-24">
          <div className="w-full px-4 sm:px-6 sm:max-w-7xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tighter" style={{ fontFamily: "'Coinbase Display', sans-serif", color: "#0355FF" }}>
                  Mint Your Basename on Frame
                </h1>
                <p className="mx-auto sm:max-w-[700px] text-gray-500 text-sm sm:text-xl dark:text-gray-400" style={{ fontFamily: "'Coinbase Display', sans-serif" }}>
                  Secure your unique Based identity directly from a Frame.
                </p>
                <p className="mx-auto sm:max-w-[700px] text-gray-500 text-sm sm:text-xl dark:text-gray-400" style={{ marginTop: 0, fontFamily: "'Coinbase Display', sans-serif" }}>
                  Fast, easy, and straighforward.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Link
                  className="w-full sm:w-auto block inline-flex h-9 items-center justify-center rounded-md bg-[#0355FF] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#0355FF]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0355FF] disabled:pointer-events-none disabled:opacity-50"
                  href='https://warpcast.com/sm-stack/0x59ff0ae7'
                  target='_blank'
                >
                  Try It Now
                </Link>
                <Link
                  className="w-full sm:w-auto block inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  href='https://www.base.org/names'
                  target='_blank'
                >
                  What's a Basename?
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 sm:py-24 bg-gray-100 dark:bg-gray-800">
          <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-7xl">
            <h3 className="text-2xl sm:text-4xl text-white mb-4 text-center" style={{ fontFamily: "'Coinbase Display', sans-serif" }}>
              Shoutout from Jesse
            </h3>
            <div className="grid gap-6 sm:grid-cols-1 sm:gap-12">
              <Image
                alt="Shoutout from jesse"
                className="mx-auto rounded-xl object-cover object-center"
                height="400"
                src={shoutout}
                width="550"
                quality={100}
              />
              <h3 className="text-2xl sm:text-4xl text-white mt-6 mb-4 text-center" style={{ fontFamily: "'Coinbase Display', sans-serif" }}>
                Sneak peak of the frame app
              </h3>
              <Image
                alt="App Screenshot 1"
                className="mx-auto rounded-xl object-cover object-center"
                height="400"
                src={frame1}
                width="550"
                quality={100}
              />
              <Image
                alt="App Screenshot 2"
                className="mx-auto rounded-xl object-cover object-center"
                height="400"
                src={frame2}
                width="550"
                quality={100}
              />
              <Image
                alt="App Screenshot 3"
                className="mx-auto rounded-xl object-cover object-center"
                height="400"
                src={frame3}
                width="550"
                quality={100}
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 border-t">
        <div className="w-full px-4 sm:px-6 sm:max-w-7xl mx-auto flex flex-col sm:flex-row gap-2 items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: "'Coinbase Display', sans-serif" }}>Farcaster @sm-stack & @0xdonsterling</p>
          </div>
      </footer>
    </div>
  )
}
