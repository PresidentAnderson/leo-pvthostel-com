'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bed, Users, Wifi, Lock, Bath, Wind } from 'lucide-react'

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

export default function RoomShowcase() {
  const [selectedType, setSelectedType] = useState('All')
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)

  const filteredRooms = selectedType === 'All' 
    ? rooms 
    : rooms.filter(room => room.type === selectedType)

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Our Accommodation Options
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From budget-friendly dorms to private rooms, we have the perfect space for every traveler
          </p>
        </div>

        {/* Room Type Filter */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1">
            {roomTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedType === type
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              {/* Room Image */}
              <div className="relative h-56 overflow-hidden">
                {room.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-accent-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    hoveredRoom === room.id ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Room Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-gray-900 mb-1">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-600">{room.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">${room.price}</p>
                    <p className="text-xs text-gray-600">per night</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Room Features */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{room.capacity} Guests</span>
                  </div>
                  {room.features.includes('Private Bathroom') ? (
                    <div className="flex items-center text-gray-600">
                      <Bath className="h-4 w-4 mr-1" />
                      <span className="text-sm">Private Bath</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <Bath className="h-4 w-4 mr-1" />
                      <span className="text-sm">Shared Bath</span>
                    </div>
                  )}
                  {room.features.includes('Air Conditioning') && (
                    <div className="flex items-center text-gray-600">
                      <Wind className="h-4 w-4 mr-1" />
                      <span className="text-sm">AC</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="flex-1 text-center py-2 px-4 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/book?room=${room.slug}`}
                    className="flex-1 text-center py-2 px-4 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Rooms CTA */}
        <div className="text-center mt-12">
          <Link
            href="/rooms"
            className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-200"
          >
            View All Room Options
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}