'use client'

import { useState } from 'react'
import { Calendar, Users, Search } from 'lucide-react'

export default function BookingWidget() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [roomType, setRoomType] = useState('all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking search logic here
    console.log('Searching:', { checkIn, checkOut, guests, roomType })
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]
  
  // Get tomorrow's date as default checkout
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  return (
    <section id="booking-widget" className="relative -mt-20 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900">Check Availability</h2>
            <p className="text-gray-600 mt-2">Find your perfect room at the best price</p>
          </div>
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Check-in Date */}
            <div className="relative">
              <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="check-in"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  required
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Check-out Date */}
            <div className="relative">
              <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="check-out"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || tomorrowStr}
                  required
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div className="relative">
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room Type */}
            <div className="relative">
              <label htmlFor="room-type" className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                id="room-type"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Rooms</option>
                <option value="dorm">Dormitory</option>
                <option value="private">Private Room</option>
                <option value="female">Female Dorm</option>
                <option value="male">Male Dorm</option>
                <option value="mixed">Mixed Dorm</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">$35</p>
              <p className="text-sm text-gray-600">Starting from/night</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">24/7</p>
              <p className="text-sm text-gray-600">Reception</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">100%</p>
              <p className="text-sm text-gray-600">Secure Booking</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">4.8★</p>
              <p className="text-sm text-gray-600">Guest Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}