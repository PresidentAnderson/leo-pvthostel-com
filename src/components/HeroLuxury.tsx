'use client'

import Link from 'next/link'

export default function HeroLuxury() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black">
      {/* Video Background - Montreal Night Cityscape */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/montreal-night.jpg"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-city-streets-at-night-1170-large.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-radial-gradient opacity-40"
           style={{background: 'radial-gradient(circle at center, transparent 0%, black 100%)'}} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-6">
        {/* Location Badge - Montreal Identity */}
        <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
          <div className="w-2 h-2 bg-pvt-gold rounded-full animate-pulse" />
          <span className="text-sm font-mono text-gray-300 tracking-wider uppercase">
            Downtown Montreal • Plateau-Mont-Royal
          </span>
        </div>

        {/* Main Headline - Luxury Typography */}
        <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-none">
          LEO PVT HOSTEL
        </h1>

        <div className="h-1 w-24 bg-pvt-gold mx-auto mb-6" />

        {/* Subtitle - Brand Pillars */}
        <p className="text-xl md:text-3xl text-gray-300 mb-4 font-light tracking-wide">
          Urban. Social. Connected.
        </p>

        <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Where Montreal's heartbeat meets boutique hospitality.
          Design-forward dorms, 24/7 security, and the energy of a global youth community.
        </p>

        {/* CTAs - Electric Blue + Gold */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#booking"
            className="group relative px-10 py-5 bg-pvt-gold text-pvt-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(211,168,103,0.5)]"
          >
            <span className="relative z-10">Book Your Stay</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pvt-gold to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="#rooms"
            className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-semibold text-lg rounded-full backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            Explore Rooms
          </Link>
        </div>

        {/* Trust Bar - Social Proof */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pvt-gold/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-pvt-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-mono">4.8/5 Rating</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-mono">24/7 Security</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-mono">15K+ Guests</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
