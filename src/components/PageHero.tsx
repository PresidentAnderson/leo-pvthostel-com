'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ArrowRight, Star, MapPin, Phone, Calendar } from 'lucide-react'

interface PageHeroProps {
  title: string
  subtitle: string
  description: string
  backgroundImage: string
  ctaPrimary?: {
    text: string
    href: string
    showIcon?: boolean
  }
  ctaSecondary?: {
    text: string
    href: string
    showIcon?: boolean
  }
  showBookingPrompt?: boolean
  breadcrumbs?: Array<{
    name: string
    href: string
  }>
  stats?: Array<{
    value: string
    label: string
  }>
}

export default function PageHero({
  title,
  subtitle,
  description,
  backgroundImage,
  ctaPrimary,
  ctaSecondary,
  showBookingPrompt = true,
  breadcrumbs,
  stats
}: PageHeroProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToContent = () => {
    const element = document.getElementById('main-content')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 scale-110"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          className="object-cover"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <nav className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.name} className="flex items-center">
                      {index > 0 && (
                        <ChevronDown className="w-3 h-3 mx-2 rotate-[-90deg] text-gray-300" />
                      )}
                      <Link 
                        href={crumb.href}
                        className="hover:text-blue-300 transition-colors"
                      >
                        {crumb.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          )}

          {/* PVT Hostel Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <MapPin className="w-4 h-4 mr-2 text-blue-300" />
            Leo PVT Hostel • Montreal
            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {subtitle && (
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-blue-300 mb-2">
                {subtitle}
              </span>
            )}
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {ctaPrimary && (
              <Link 
                href={ctaPrimary.href}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {ctaPrimary.text}
                {ctaPrimary.showIcon && <ArrowRight className="ml-2 w-4 h-4" />}
              </Link>
            )}
            {ctaSecondary && (
              <Link 
                href={ctaSecondary.href}
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                {ctaSecondary.text}
                {ctaSecondary.showIcon && <Star className="ml-2 w-4 h-4" />}
              </Link>
            )}
          </div>

          {/* Quick Booking Prompt */}
          {showBookingPrompt && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-lg mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 mr-2 text-green-400" />
                <span className="text-lg font-semibold">Quick Booking</span>
              </div>
              <p className="text-gray-300 mb-4">
                Check availability and book your stay in Montreal
              </p>
              <Link 
                href="/#booking-widget"
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById('booking-widget')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-300"
              >
                Check Availability
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Scroll to content"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>
    </section>
  )
}