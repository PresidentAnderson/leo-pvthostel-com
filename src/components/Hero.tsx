'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, MapPin, Users, Wifi, Coffee, Sparkles, Star, Award } from 'lucide-react'

const heroImages = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
]

const floatingElements = [
  { icon: Sparkles, position: { top: '20%', left: '10%' }, delay: 0 },
  { icon: Star, position: { top: '30%', right: '15%' }, delay: 1 },
  { icon: Award, position: { bottom: '30%', left: '15%' }, delay: 2 },
]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -150])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const scale = useTransform(scrollY, [0, 300], [1, 1.1])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToBooking = () => {
    const element = document.getElementById('booking-widget')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      ref={heroRef}
      className="relative h-screen min-h-[100vh] flex items-center justify-center overflow-hidden particles-bg"
    >
      {/* Animated Background Mesh */}
      <motion.div 
        className="absolute inset-0 bg-mesh-gradient opacity-20"
        style={{ y: y1 }}
      />
      
      {/* Dynamic Background Images with Parallax */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: index === currentImage ? 1 : 0,
              scale: index === currentImage ? 1 : 1.1
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{ scale }}
          >
            <div className="absolute inset-0 hero-overlay z-10" />
            <Image
              src={image}
              alt={`Leo PVT Hostel Montreal - View ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
              quality={95}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating Decorative Elements */}
      {floatingElements.map((element, index) => {
        const Icon = element.icon
        return (
          <motion.div
            key={index}
            className="absolute text-white/20 float-animation"
            style={{
              ...element.position,
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: element.delay, duration: 1 }}
          >
            <Icon className="h-8 w-8 lg:h-12 lg:w-12" />
          </motion.div>
        )
      })}

      {/* Main Content with Advanced Animations */}
      <motion.div 
        className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ y: y2 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Premium Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 glass-effect rounded-full text-white mb-8 animate-pulse-glow"
          >
            <MapPin className="h-5 w-5 mr-3 text-accent-400" />
            <span className="text-base font-semibold tracking-wide">Downtown Montreal</span>
            <div className="ml-3 w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
          </motion.div>

          {/* Stunning Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-heading font-black text-white mb-8 tracking-tight"
          >
            Welcome to{' '}
            <span className="gradient-text bg-gradient-primary block lg:inline">
              Leo PVT Hostel
            </span>
          </motion.h1>

          {/* Enhanced Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl sm:text-2xl lg:text-3xl text-gray-200 mb-12 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Your luxurious home away from home in the heart of Montreal. Experience unparalleled{' '}
            <span className="gradient-text-accent">comfort</span>, vibrant{' '}
            <span className="gradient-text-accent">community</span>, and rich{' '}
            <span className="gradient-text-accent">culture</span>.
          </motion.p>

          {/* Premium Features Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, label: 'Social Atmosphere', description: 'Connect with travelers' },
              { icon: Wifi, label: 'Ultra-Fast WiFi', description: 'Blazing 1GB speeds' },
              { icon: Coffee, label: 'Gourmet Breakfast', description: 'Chef-prepared daily' }
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="card-premium text-center p-6 hover-lift"
              >
                <feature.icon className="h-8 w-8 mx-auto mb-3 text-accent-400" />
                <h3 className="text-white font-semibold text-lg mb-2">{feature.label}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Premium CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/book"
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Check Availability
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, rotateY: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/rooms"
                className="btn-secondary group"
              >
                <span className="flex items-center">
                  Explore Our Rooms
                  <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.button
        onClick={scrollToBooking}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 glass-effect p-4 rounded-full group"
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.2 }}
        aria-label="Scroll to booking"
      >
        <ChevronDown className="h-6 w-6 text-white group-hover:text-accent-400 transition-colors duration-300" />
      </motion.button>

      {/* Luxurious Image Indicators */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20"
      >
        {heroImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`relative transition-all duration-500 ${
              index === currentImage 
                ? 'w-12 h-3 bg-white rounded-full' 
                : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/60'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to image ${index + 1}`}
          >
            {index === currentImage && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-primary rounded-full animate-pulse-glow"
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Premium Animated Border */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border border-white/10 animate-shimmer-premium"></div>
      </div>
    </section>
  )
}