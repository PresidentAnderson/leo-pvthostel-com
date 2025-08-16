'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, MapPin, Users, Wifi, Coffee } from 'lucide-react'

const heroImages = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollToBooking = () => {
    const element = document.getElementById('booking-widget')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-10" />
            <Image
              src={image}
              alt={`Leo PVT Hostel Montreal - View ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
              quality={90}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white mb-6 animate-fade-in">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Downtown Montreal</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 animate-fade-up">
            Welcome to{' '}
            <span className="text-primary-400">Leo PVT Hostel</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-up animation-delay-200">
            Your home away from home in the heart of Montreal. Experience comfort, community, and culture at unbeatable prices.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-up animation-delay-400">
            <div className="flex items-center text-white">
              <Users className="h-5 w-5 mr-2 text-primary-400" />
              <span className="text-sm">Social Atmosphere</span>
            </div>
            <div className="flex items-center text-white">
              <Wifi className="h-5 w-5 mr-2 text-primary-400" />
              <span className="text-sm">Free High-Speed WiFi</span>
            </div>
            <div className="flex items-center text-white">
              <Coffee className="h-5 w-5 mr-2 text-primary-400" />
              <span className="text-sm">Free Breakfast</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-600">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Check Availability
            </Link>
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-900 bg-white hover:bg-gray-100 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View Our Rooms
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToBooking}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-20"
        aria-label="Scroll to booking"
      >
        <ChevronDown className="h-8 w-8" />
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImage ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}