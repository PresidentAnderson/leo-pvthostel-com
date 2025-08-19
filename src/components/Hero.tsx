'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, MapPin, Star, Wifi, Coffee, Users, Shield } from 'lucide-react'

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  const heroImages = [
    {
      src: '/images/montreal-hostel-1.jpg',
      alt: 'Leo PVT Hostel Montreal - Modern Accommodations'
    },
    {
      src: '/images/montreal-hostel-2.jpg', 
      alt: 'Leo PVT Hostel Montreal - Social Common Area'
    },
    {
      src: '/images/montreal-hostel-3.jpg',
      alt: 'Leo PVT Hostel Montreal - Downtown Location'
    }
  ]

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
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-60' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              className="object-cover"
              quality={85}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Location Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <MapPin className="w-4 h-4 mr-2 text-blue-300" />
            Downtown Montreal, Quebec
            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Leo PVT Hostel
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 mb-8 leading-relaxed font-light">
            Your home away from home in the heart of Montreal.<br />
            <span className="text-blue-300">Affordable</span> • <span className="text-purple-300">Safe</span> • <span className="text-green-300">Social</span>
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-300" />
              <div className="text-sm font-medium">Social</div>
              <div className="text-xs text-gray-300">Meet travelers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Wifi className="w-6 h-6 mx-auto mb-2 text-green-300" />
              <div className="text-sm font-medium">Free WiFi</div>
              <div className="text-xs text-gray-300">High-speed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Shield className="w-6 h-6 mx-auto mb-2 text-purple-300" />
              <div className="text-sm font-medium">24/7 Security</div>
              <div className="text-xs text-gray-300">Safe & secure</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-orange-300" />
              <div className="text-sm font-medium">Prime Location</div>
              <div className="text-xs text-gray-300">Downtown</div>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="#booking-widget"
              onClick={scrollToBooking}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Check Availability
              <ChevronDown className="ml-2 w-4 h-4" />
            </Link>
            <Link 
              href="/rooms"
              className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              View Rooms
              <Star className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 text-sm text-gray-300">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
              <span>4.8/5 Guest Rating</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-green-400 mr-1" />
              <span>100% Secure Booking</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-blue-400 mr-1" />
              <span>10,000+ Happy Guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToBooking}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Scroll to booking"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImage 
                ? 'bg-white shadow-lg scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}