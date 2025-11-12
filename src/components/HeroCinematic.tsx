'use client'

import Link from 'next/link'
import * as PVT from './PVT'

export default function HeroCinematic() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-pvt-black">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/montreal-hostel-1.jpg"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-city-streets-at-night-1170-large.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-pvt-black/60 via-pvt-black/40 to-pvt-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <PVT.Heading level="1" font="display" className="text-text-inverse mb-4">
          Leo PVT Hostel — Montreal
        </PVT.Heading>

        <PVT.Text size="lg" color="secondary" className="mb-8 text-gray-300">
          Stylish. Social. Safe. A new era of budget‑luxury hospitality in the heart of downtown.
        </PVT.Text>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="#booking">
            <PVT.Button variant="gold" size="lg" className="w-full sm:w-auto">
              Check Availability
            </PVT.Button>
          </Link>
          <Link href="/rooms">
            <PVT.Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Rooms
            </PVT.Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
