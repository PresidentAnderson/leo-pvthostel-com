'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Phone, 
  Mail, 
  Star, 
  Users, 
  Shield, 
  Clock, 
  ArrowRight, 
  MapPin,
  Wifi,
  Coffee,
  Car,
  Gift,
  Heart,
  MessageCircle,
  Download
} from 'lucide-react'

interface CTACardProps {
  className?: string
}

interface UrgencyTimerProps {
  initialTime: number // seconds
}

function UrgencyTimer({ initialTime }: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  
  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev > 0 ? prev - 1 : 0)
    }, 1000)
    
    return () => clearInterval(timer)
  })
  
  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60
  
  return (
    <div className="flex items-center justify-center space-x-2 text-lg font-mono">
      <div className="bg-red-600 text-white px-2 py-1 rounded">{hours.toString().padStart(2, '0')}</div>
      <span className="text-red-600">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded">{minutes.toString().padStart(2, '0')}</div>
      <span className="text-red-600">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded">{seconds.toString().padStart(2, '0')}</div>
    </div>
  )
}

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
}

export function BookingCTACard({ className = "" }: CTACardProps) {
  return (
    <motion.div 
      variants={ctaVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <Calendar className="w-8 h-8 text-blue-200" />
        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          Best Rate
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2">Book Direct & Save</h3>
      <p className="text-blue-100 mb-4 text-sm">
        Get the best rates when you book directly with us. Free cancellation up to 24 hours before arrival.
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold">$28</div>
          <div className="text-xs text-blue-200">from/night</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">4.8★</div>
          <div className="text-xs text-blue-200">rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">24/7</div>
          <div className="text-xs text-blue-200">support</div>
        </div>
      </div>
      
      <Link 
        href="#booking-widget"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="block w-full bg-white text-blue-600 text-center font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors group"
      >
        Check Availability
        <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  )
}

export function ContactCTACard({ className = "" }: CTACardProps) {
  return (
    <motion.div 
      variants={ctaVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`bg-white border-2 border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-300 ${className}`}
    >
      <div className="flex items-center mb-4">
        <div className="bg-green-100 p-2 rounded-lg mr-3">
          <MessageCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Need Help?</h3>
          <p className="text-sm text-gray-600">We're here 24/7</p>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">
        Questions about your stay? Our friendly team speaks English & French.
      </p>
      
      <div className="space-y-3">
        <a 
          href="tel:+15141234567"
          className="flex items-center justify-between w-full bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors group"
        >
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Call Now</span>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
        
        <Link 
          href="/contact"
          className="flex items-center justify-between w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
        >
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Send Message</span>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

export function UrgencyCTACard({ className = "" }: CTACardProps) {
  return (
    <motion.div 
      variants={ctaVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${className}`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Clock className="w-8 h-8 text-red-200" />
          <div className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold animate-pulse">
            LIMITED TIME
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">Flash Sale - 25% Off!</h3>
        <p className="text-red-100 mb-4 text-sm">
          Book in the next 6 hours and save 25% on stays of 3+ nights. Hurry, only 3 beds left!
        </p>
        
        <div className="bg-black/20 p-3 rounded-lg mb-4">
          <div className="text-center text-xs text-red-200 mb-2">Offer expires in:</div>
          <UrgencyTimer initialTime={21600} /> {/* 6 hours */}
        </div>
        
        <Link 
          href="#booking-widget"
          className="block w-full bg-yellow-500 text-black text-center font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors animate-pulse"
        >
          CLAIM OFFER NOW!
        </Link>
      </div>
    </motion.div>
  )
}

export function SafetyCTACard({ className = "" }: CTACardProps) {
  return (
    <motion.div 
      variants={ctaVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center mb-4">
        <Shield className="w-8 h-8 text-purple-200 mr-3" />
        <div>
          <h3 className="text-lg font-bold">Safe & Secure</h3>
          <div className="flex items-center text-purple-200 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
            Security Active
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <Shield className="w-4 h-4 mr-2 text-purple-300" />
          <span>24/7 CCTV Monitoring</span>
        </div>
        <div className="flex items-center text-sm">
          <Shield className="w-4 h-4 mr-2 text-purple-300" />
          <span>Keycard Access</span>
        </div>
        <div className="flex items-center text-sm">
          <Shield className="w-4 h-4 mr-2 text-purple-300" />
          <span>Secure Lockers</span>
        </div>
        <div className="flex items-center text-sm">
          <Shield className="w-4 h-4 mr-2 text-purple-300" />
          <span>Female-Only Floors</span>
        </div>
      </div>
      
      <Link 
        href="/about#safety"
        className="block w-full bg-white/20 backdrop-blur text-center font-medium py-2 rounded-lg hover:bg-white/30 transition-colors text-sm"
      >
        Learn About Our Safety
      </Link>
    </motion.div>
  )
}

export function ReviewsCTACard({ className = "" }: CTACardProps) {
  return (
    <motion.div 
      variants={ctaVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400 mr-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">4.8/5</div>
          <div className="text-sm text-gray-600">2,847 reviews</div>
        </div>
      </div>
      
      <blockquote className="text-gray-700 mb-4 text-sm italic">
        "Amazing hostel! Clean, safe, and great location. The staff went above and beyond to help us."
      </blockquote>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-gray-500">- Sarah M., Canada</div>
        <div className="flex items-center text-xs text-gray-500">
          <Users className="w-3 h-3 mr-1" />
          Verified Guest
        </div>
      </div>
      
      <Link 
        href="/reviews"
        className="block w-full bg-yellow-50 text-yellow-700 text-center font-medium py-2 rounded-lg hover:bg-yellow-100 transition-colors text-sm border border-yellow-200"
      >
        Read All Reviews
      </Link>
    </motion.div>
  )
}

export function AmenitiesCTACard({ className = "" }: CTACardProps) {
  return (
    <motion.div 
      variants={ctaVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <Wifi className="w-8 h-8 text-teal-200" />
        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          ALL FREE
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-4">Premium Amenities</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center">
          <Wifi className="w-4 h-4 mr-2 text-teal-200" />
          <span>Free WiFi</span>
        </div>
        <div className="flex items-center">
          <Coffee className="w-4 h-4 mr-2 text-teal-200" />
          <span>Free Breakfast</span>
        </div>
        <div className="flex items-center">
          <Car className="w-4 h-4 mr-2 text-teal-200" />
          <span>Luggage Storage</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-teal-200" />
          <span>Prime Location</span>
        </div>
      </div>
      
      <Link 
        href="/amenities"
        className="block w-full bg-white text-teal-600 text-center font-semibold py-3 rounded-lg hover:bg-teal-50 transition-colors"
      >
        Explore All Amenities
      </Link>
    </motion.div>
  )
}

export function NewsletterCTACard({ className = "" }: CTACardProps) {
  return (
    <motion.div 
      variants={ctaVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center mb-4">
        <Mail className="w-8 h-8 text-orange-200 mr-3" />
        <div>
          <h3 className="text-lg font-bold">Montreal Insider Tips</h3>
          <div className="text-orange-200 text-sm">Free Montreal Guide</div>
        </div>
      </div>
      
      <p className="text-orange-100 mb-4 text-sm">
        Get our exclusive Montreal travel guide + insider tips delivered to your inbox.
      </p>
      
      <div className="flex space-x-2 mb-4">
        <input 
          type="email" 
          placeholder="Your email"
          className="flex-1 px-3 py-2 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-50 transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-xs text-orange-200 flex items-center">
        <Heart className="w-3 h-3 mr-1" />
        Join 5,000+ travelers. No spam, unsubscribe anytime.
      </div>
    </motion.div>
  )
}

// Main export function for easy use
export default function CTACard({ className }: CTACardProps) {
  return <BookingCTACard className={className} />
}