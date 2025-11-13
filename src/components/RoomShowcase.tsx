'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bed, Users, Wifi, Lock, Bath, Wind, Star, Crown, Heart, ArrowRight } from 'lucide-react'

const rooms = [
  {
    id: 1,
    name: '4-Bed Mixed Dormitory',
    slug: '4-bed-mixed-dorm',
    price: 35,
    capacity: 4,
    type: 'Dormitory',
    image: '/images/rooms/dorm-4-mixed.jpg',
    features: ['Free WiFi', 'Lockers', 'Shared Bathroom', 'Air Conditioning', 'Reading Light', 'Power Outlets'],
    description: 'Perfect for solo travelers looking to meet new people. Our mixed dorms offer comfort and security.',
    popular: true,
  },
  {
    id: 2,
    name: '6-Bed Female Dormitory',
    slug: '6-bed-female-dorm',
    price: 32,
    capacity: 6,
    type: 'Female Only',
    image: '/images/rooms/dorm-6-female.jpg',
    features: ['Free WiFi', 'Lockers', 'Shared Bathroom', 'Air Conditioning', 'Privacy Curtains', 'Vanity Mirror'],
    description: 'A safe and comfortable space exclusively for female travelers with added privacy features.',
    popular: false,
  },
  {
    id: 3,
    name: '8-Bed Mixed Dormitory',
    slug: '8-bed-mixed-dorm',
    price: 28,
    capacity: 8,
    type: 'Dormitory',
    image: '/images/rooms/dorm-8-mixed.jpg',
    features: ['Free WiFi', 'Lockers', 'Shared Bathroom', 'Fan', 'Reading Light', 'Common Area Access'],
    description: 'Our most social room! Great for budget-conscious travelers who love making new friends.',
    popular: false,
  },
  {
    id: 4,
    name: 'Private Double Room',
    slug: 'private-double',
    price: 89,
    capacity: 2,
    type: 'Private',
    image: '/images/rooms/private-double.jpg',
    features: ['Free WiFi', 'Private Bathroom', 'Air Conditioning', 'TV', 'Mini Fridge', 'Work Desk'],
    description: 'Enjoy privacy and comfort in our cozy double rooms, perfect for couples or close friends.',
    popular: true,
  },
  {
    id: 5,
    name: 'Private Twin Room',
    slug: 'private-twin',
    price: 85,
    capacity: 2,
    type: 'Private',
    image: '/images/rooms/private-twin.jpg',
    features: ['Free WiFi', 'Private Bathroom', 'Air Conditioning', 'TV', 'Wardrobe', 'City View'],
    description: 'Two comfortable single beds in a private room with all the amenities you need.',
    popular: false,
  },
  {
    id: 6,
    name: 'Private Family Room',
    slug: 'private-family',
    price: 120,
    capacity: 4,
    type: 'Private',
    image: '/images/rooms/private-family.jpg',
    features: ['Free WiFi', 'Private Bathroom', 'Air Conditioning', 'TV', 'Mini Fridge', 'Sofa Bed'],
    description: 'Spacious room perfect for families or groups traveling together.',
    popular: false,
  },
]

const roomTypes = ['All', 'Dormitory', 'Private', 'Female Only']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const
    }
  },
}

export default function RoomShowcase() {
  const [selectedType, setSelectedType] = useState('All')
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)

  const filteredRooms = selectedType === 'All' 
    ? rooms 
    : rooms.filter(room => room.type === selectedType)

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      <div className="absolute inset-0 particles-bg opacity-20"></div>
      <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-8 w-8 text-accent-400 mr-3" />
            <h2 className="text-4xl lg:text-6xl font-heading font-black gradient-text">
              Luxury Accommodations
            </h2>
            <Crown className="h-8 w-8 text-accent-400 ml-3" />
          </div>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            From premium dormitories to exclusive private suites, experience unparalleled{' '}
            <span className="gradient-text-accent">comfort</span> and{' '}
            <span className="gradient-text-accent">elegance</span> in the heart of Montreal
          </p>
        </motion.div>

        {/* Premium Room Type Filter */}
        <motion.div 
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-effect rounded-3xl p-2 border border-white/10">
            <div className="flex space-x-2">
              {roomTypes.map((type, index) => (
                <motion.button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`relative px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                    selectedType === type
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <span className="relative z-10">{type}</span>
                  {selectedType === type && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-gradient-primary rounded-2xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Premium Rooms Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                variants={cardVariants}
                layout
                className="group card-premium overflow-hidden hover-lift"
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Premium Room Image */}
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  {room.popular && (
                    <motion.div 
                      className="absolute top-4 left-4 z-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                    >
                      <div className="glass-effect px-4 py-2 rounded-full border border-accent-400/50">
                        <div className="flex items-center text-accent-400 font-bold text-xs">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          POPULAR
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div
                    className="absolute top-4 right-4 z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.6, type: "spring" }}
                  >
                    <motion.button
                      className="glass-effect p-2 rounded-full text-gray-300 hover:text-red-400 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="h-4 w-4" />
                    </motion.button>
                  </motion.div>

                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredRoom === room.id ? 'scale-110 brightness-110' : 'scale-100 brightness-100'
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${
                    hoveredRoom === room.id ? 'opacity-100' : 'opacity-60'
                  }`} />
                  
                  {/* Floating price badge */}
                  <motion.div
                    className="absolute bottom-4 right-4 glass-effect rounded-2xl p-3 border border-white/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                  >
                    <div className="text-right">
                      <p className="text-2xl font-black text-white gradient-text-accent">${room.price}</p>
                      <p className="text-xs text-gray-300 font-medium">per night</p>
                    </div>
                  </motion.div>
                </div>

                {/* Premium Room Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300">
                      {room.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="glass-subtle px-3 py-1 rounded-full text-sm font-medium text-gray-300">
                        {room.type}
                      </span>
                      <div className="flex items-center text-accent-400">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{room.capacity} Guests</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Premium Room Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.features.includes('Private Bathroom') ? (
                      <div className="glass-subtle px-3 py-1 rounded-xl flex items-center text-gray-300">
                        <Bath className="h-3 w-3 mr-2 text-accent-400" />
                        <span className="text-xs font-medium">Private Bath</span>
                      </div>
                    ) : (
                      <div className="glass-subtle px-3 py-1 rounded-xl flex items-center text-gray-300">
                        <Bath className="h-3 w-3 mr-2 text-accent-400" />
                        <span className="text-xs font-medium">Shared Bath</span>
                      </div>
                    )}
                    {room.features.includes('Air Conditioning') && (
                      <div className="glass-subtle px-3 py-1 rounded-xl flex items-center text-gray-300">
                        <Wind className="h-3 w-3 mr-2 text-accent-400" />
                        <span className="text-xs font-medium">AC</span>
                      </div>
                    )}
                    <div className="glass-subtle px-3 py-1 rounded-xl flex items-center text-gray-300">
                      <Wifi className="h-3 w-3 mr-2 text-accent-400" />
                      <span className="text-xs font-medium">Free WiFi</span>
                    </div>
                  </div>

                  {/* Premium Action Buttons */}
                  <div className="flex gap-3">
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href={`/rooms/${room.slug}`}
                        className="btn-secondary w-full text-center"
                      >
                        View Details
                      </Link>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href={`/book?room=${room.slug}`}
                        className="btn-primary w-full text-center group"
                      >
                        <span className="flex items-center justify-center">
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Premium CTA Section */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/rooms"
              className="btn-secondary group relative overflow-hidden text-lg px-8 py-4"
            >
              <span className="relative z-10 flex items-center">
                Explore All Premium Rooms
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}