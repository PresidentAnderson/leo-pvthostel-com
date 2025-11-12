'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import availabilityService from '@/services/availabilityService'
import type { AvailabilityResponse, AvailableRoom } from '@/types/booking'

interface BookingState {
  checkIn: string
  checkOut: string
  guests: number
  roomType: string
}

interface SearchState {
  isLoading: boolean
  error: string | null
  results: AvailableRoom[]
  hasSearched: boolean
}

export default function BookingWidget() {
  const [booking, setBooking] = useState<BookingState>({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: 'all'
  })

  const [search, setSearch] = useState<SearchState>({
    isLoading: false,
    error: null,
    results: [],
    hasSearched: false
  })

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]
  
  // Get tomorrow's date as default checkout
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  // Set default checkout when checkin changes
  useEffect(() => {
    if (booking.checkIn && !booking.checkOut) {
      const checkInDate = new Date(booking.checkIn)
      checkInDate.setDate(checkInDate.getDate() + 1)
      setBooking(prev => ({
        ...prev,
        checkOut: checkInDate.toISOString().split('T')[0]
      }))
    }
  }, [booking.checkIn, booking.checkOut])

  const validateDates = (): string | null => {
    if (!booking.checkIn || !booking.checkOut) {
      return 'Please select check-in and check-out dates'
    }

    const checkInDate = new Date(booking.checkIn)
    const checkOutDate = new Date(booking.checkOut)
    const todayDate = new Date(today)

    if (checkInDate < todayDate) {
      return 'Check-in date cannot be in the past'
    }

    if (checkOutDate <= checkInDate) {
      return 'Check-out date must be after check-in date'
    }

    const daysDifference = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDifference > 30) {
      return 'Maximum stay is 30 nights'
    }

    return null
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateDates()
    if (validationError) {
      setSearch(prev => ({ ...prev, error: validationError, hasSearched: false }))
      return
    }

    setSearch(prev => ({ ...prev, isLoading: true, error: null, hasSearched: false }))

    try {
      const roomTypes = booking.roomType === 'all' ? undefined : [booking.roomType]
      
      const response: AvailabilityResponse = await availabilityService.checkAvailability({
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        guests: booking.guests,
        roomTypes
      })

      setSearch({
        isLoading: false,
        error: null,
        results: response.results,
        hasSearched: true
      })

      // Scroll to results
      setTimeout(() => {
        document.getElementById('search-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)

    } catch (error) {
      console.error('Availability search failed:', error)
      setSearch({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to search availability. Please try again.',
        results: [],
        hasSearched: false
      })
    }
  }

  const updateBooking = (field: keyof BookingState, value: string | number) => {
    setBooking(prev => ({ ...prev, [field]: value }))
    // Clear search results when booking parameters change
    if (search.hasSearched) {
      setSearch(prev => ({ ...prev, results: [], hasSearched: false, error: null }))
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <>
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
                    value={booking.checkIn}
                    onChange={(e) => updateBooking('checkIn', e.target.value)}
                    min={today}
                    required
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={booking.checkOut}
                    onChange={(e) => updateBooking('checkOut', e.target.value)}
                    min={booking.checkIn || tomorrowStr}
                    required
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={booking.guests}
                    onChange={(e) => updateBooking('guests', Number(e.target.value))}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
                  value={booking.roomType}
                  onChange={(e) => updateBooking('roomType', e.target.value)}
                  className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Rooms</option>
                  <option value="mixed-dorm">Mixed Dormitory</option>
                  <option value="female-dorm">Female Dormitory</option>
                  <option value="male-dorm">Male Dormitory</option>
                  <option value="private-room">Private Room</option>
                  <option value="family-room">Family Room</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={search.isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {search.isLoading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  {search.isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {/* Error Display */}
            <AnimatePresence>
              {search.error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{search.error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">$28</p>
                <p className="text-sm text-gray-600">Starting from/night</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">24/7</p>
                <p className="text-sm text-gray-600">Reception</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">100%</p>
                <p className="text-sm text-gray-600">Secure Booking</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">4.8★</p>
                <p className="text-sm text-gray-600">Guest Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <AnimatePresence>
        {search.hasSearched && (
          <motion.section
            id="search-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-12 bg-gray-50"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Available Rooms
                </h3>
                <p className="text-gray-600">
                  {booking.checkIn && booking.checkOut && (
                    <>
                      {new Date(booking.checkIn).toLocaleDateString('en-CA', { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                      })} - {new Date(booking.checkOut).toLocaleDateString('en-CA', { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                      })} • {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                    </>
                  )}
                </p>
              </div>

              {search.results.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No rooms available</h4>
                  <p className="text-gray-600 mb-6">
                    No rooms match your search criteria for the selected dates.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>Try adjusting your search:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Select different dates</li>
                      <li>Reduce the number of guests</li>
                      <li>Try "All Rooms" room type</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {search.results.map((room, index) => (
                    <motion.div
                      key={room.roomId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-1">
                                  {room.room.name}
                                </h4>
                                <p className="text-gray-600 text-sm mb-2">
                                  {room.room.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {room.room.amenities.slice(0, 4).map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                  {room.room.amenities.length > 4 && (
                                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                                      +{room.room.amenities.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                              {room.available <= 3 && (
                                <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                  Only {room.available} left!
                                </div>
                              )}
                            </div>

                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>Up to {room.room.capacity} guests</span>
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                <span>Free cancellation</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 lg:mt-0 lg:ml-6 lg:text-right">
                            <div className="mb-4">
                              <div className="text-3xl font-bold text-gray-900">
                                {formatPrice(room.totalPrice)}
                              </div>
                              <div className="text-sm text-gray-600">
                                total for {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatPrice(room.averageNightlyRate)}/night avg
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                // Navigate to booking flow
                                window.location.href = `/book?room=${room.roomId}&checkin=${booking.checkIn}&checkout=${booking.checkOut}&guests=${booking.guests}`
                              }}
                              className="w-full lg:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
                            >
                              Select Room
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}