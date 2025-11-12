'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast, useSuccessToast, useErrorToast } from '@/components/Toast'
import { InlineError, LoadingSpinner } from '@/components/ErrorBoundary'
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  Shield,
  Clock,
  MapPin,
  Wifi,
  Coffee
} from 'lucide-react'
import availabilityService from '@/services/availabilityService'
import bookingService from '@/services/bookingService'
import type { 
  AvailableRoom, 
  GuestInfo, 
  BookingRequest, 
  Booking, 
  PaymentMethod 
} from '@/types/booking'

interface BookingStep {
  id: number
  title: string
  completed: boolean
  current: boolean
}

interface BookingFormData {
  room: AvailableRoom | null
  checkIn: string
  checkOut: string
  guests: number
  guestInfo: GuestInfo[]
  primaryGuestIndex: number
  specialRequests: string
  paymentMethod: PaymentMethod
  promocode: string
}

function BookingPageContent() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)
  
  // Toast notifications
  const showSuccessToast = useSuccessToast()
  const showErrorToast = useErrorToast()

  const [formData, setFormData] = useState<BookingFormData>({
    room: null,
    checkIn: searchParams.get('checkin') || '',
    checkOut: searchParams.get('checkout') || '',
    guests: parseInt(searchParams.get('guests') || '1'),
    guestInfo: [],
    primaryGuestIndex: 0,
    specialRequests: '',
    paymentMethod: 'credit-card',
    promocode: ''
  })

  const steps: BookingStep[] = [
    { id: 1, title: 'Select Room', completed: false, current: currentStep === 1 },
    { id: 2, title: 'Guest Details', completed: false, current: currentStep === 2 },
    { id: 3, title: 'Payment', completed: false, current: currentStep === 3 },
    { id: 4, title: 'Confirmation', completed: false, current: currentStep === 4 }
  ]

  // Load room details on mount
  useEffect(() => {
    const loadRoomDetails = async () => {
      const roomId = searchParams.get('room')
      if (roomId && formData.checkIn && formData.checkOut) {
        setIsLoading(true)
        try {
          const response = await availabilityService.checkAvailability({
            checkInDate: formData.checkIn,
            checkOutDate: formData.checkOut,
            guests: formData.guests,
            roomTypes: [roomId]
          })

          if (response.results.length > 0) {
            setFormData(prev => ({ ...prev, room: response.results[0] }))
            // Initialize guest info array
            const guestInfo = Array.from({ length: formData.guests }, (_, index) => ({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              nationality: '',
              dateOfBirth: ''
            }))
            setFormData(prev => ({ ...prev, guestInfo }))
          } else {
            const errorMsg = 'Selected room is no longer available for these dates'
            setError(errorMsg)
            showErrorToast('Room Unavailable', errorMsg)
          }
        } catch (err) {
          const errorMsg = 'Failed to load room details'
          setError(errorMsg)
          showErrorToast('Loading Error', errorMsg)
        }
        setIsLoading(false)
      }
    }

    loadRoomDetails()
  }, [searchParams, formData.checkIn, formData.checkOut, formData.guests])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.room && !!formData.checkIn && !!formData.checkOut
      case 2:
        return formData.guestInfo.every(guest => 
          guest.firstName && guest.lastName && guest.email && guest.phone && guest.nationality
        )
      case 3:
        return !!formData.paymentMethod
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
      setError(null)
    } else {
      setError('Please complete all required fields before continuing')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setError(null)
  }

  const handleBookingSubmit = async () => {
    if (!formData.room) return

    setIsLoading(true)
    setError(null)

    try {
      const bookingRequest: BookingRequest = {
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
        roomId: formData.room.roomId,
        guests: formData.guestInfo,
        primaryGuest: formData.guestInfo[formData.primaryGuestIndex]?.id || 'guest-0',
        specialRequests: formData.specialRequests,
        promocode: formData.promocode || undefined
      }

      const newBooking = await bookingService.createBooking(bookingRequest)
      setBooking(newBooking)
      setCurrentStep(4)
      showSuccessToast('Booking Confirmed!', 'Your reservation has been successfully created.')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Booking failed. Please try again.'
      setError(errorMsg)
      showErrorToast('Booking Failed', errorMsg)
    }
    setIsLoading(false)
  }

  if (isLoading && !formData.room) {
    return <LoadingSpinner size="lg" message="Loading booking details..." className="min-h-screen" />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm
                  ${step.current 
                    ? 'bg-blue-600 text-white' 
                    : step.completed 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {step.completed ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step.completed ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6"
                    >
                      <InlineError 
                        message={error} 
                        onRetry={() => setError(null)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Selection</h2>
                      {formData.room && (
                        <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {formData.room.room.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{formData.room.room.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {formData.room.room.amenities.map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              <span>Up to {formData.room.room.capacity} guests</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Information</h2>
                      <div className="space-y-6">
                        {formData.guestInfo.map((guest, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Guest {index + 1} {index === formData.primaryGuestIndex && '(Primary)'}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  First Name *
                                </label>
                                <input
                                  type="text"
                                  value={guest.firstName}
                                  onChange={(e) => {
                                    const newGuestInfo = [...formData.guestInfo]
                                    newGuestInfo[index].firstName = e.target.value
                                    setFormData(prev => ({ ...prev, guestInfo: newGuestInfo }))
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Last Name *
                                </label>
                                <input
                                  type="text"
                                  value={guest.lastName}
                                  onChange={(e) => {
                                    const newGuestInfo = [...formData.guestInfo]
                                    newGuestInfo[index].lastName = e.target.value
                                    setFormData(prev => ({ ...prev, guestInfo: newGuestInfo }))
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email *
                                </label>
                                <input
                                  type="email"
                                  value={guest.email}
                                  onChange={(e) => {
                                    const newGuestInfo = [...formData.guestInfo]
                                    newGuestInfo[index].email = e.target.value
                                    setFormData(prev => ({ ...prev, guestInfo: newGuestInfo }))
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Phone *
                                </label>
                                <input
                                  type="tel"
                                  value={guest.phone}
                                  onChange={(e) => {
                                    const newGuestInfo = [...formData.guestInfo]
                                    newGuestInfo[index].phone = e.target.value
                                    setFormData(prev => ({ ...prev, guestInfo: newGuestInfo }))
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Nationality *
                                </label>
                                <input
                                  type="text"
                                  value={guest.nationality}
                                  onChange={(e) => {
                                    const newGuestInfo = [...formData.guestInfo]
                                    newGuestInfo[index].nationality = e.target.value
                                    setFormData(prev => ({ ...prev, guestInfo: newGuestInfo }))
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Date of Birth
                                </label>
                                <input
                                  type="date"
                                  value={guest.dateOfBirth || ''}
                                  onChange={(e) => {
                                    const newGuestInfo = [...formData.guestInfo]
                                    newGuestInfo[index].dateOfBirth = e.target.value
                                    setFormData(prev => ({ ...prev, guestInfo: newGuestInfo }))
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Requests
                          </label>
                          <textarea
                            value={formData.specialRequests}
                            onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Any special requests or dietary requirements..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Payment Method
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="credit-card"
                                checked={formData.paymentMethod === 'credit-card'}
                                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
                                className="mr-3"
                              />
                              <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                              <span className="font-medium">Credit/Debit Card</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Shield className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-900">Secure Payment</span>
                          </div>
                          <p className="text-blue-800 text-sm">
                            We use industry-standard encryption to protect your payment information. 
                            You'll only be charged a deposit now, with the remaining balance due at check-in.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Promo Code (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.promocode}
                            onChange={(e) => setFormData(prev => ({ ...prev, promocode: e.target.value }))}
                            placeholder="Enter promo code"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && booking && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-600">
                          Your reservation has been successfully created. 
                          A confirmation email has been sent to {formData.guestInfo[0]?.email}.
                        </p>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-green-900 mb-4">Booking Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700">Confirmation Number:</span>
                            <span className="font-medium text-green-900">{booking.confirmation?.confirmationNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Check-in:</span>
                            <span className="font-medium text-green-900">
                              {new Date(booking.checkInDate).toLocaleDateString('en-CA', { 
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Check-out:</span>
                            <span className="font-medium text-green-900">
                              {new Date(booking.checkOutDate).toLocaleDateString('en-CA', { 
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-blue-900">Check-in: 3:00 PM</p>
                            <p className="text-blue-700 text-sm">Reception is open 24/7</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-blue-900">Leo PVT Hostel</p>
                            <p className="text-blue-700 text-sm">123 Rue Saint-Laurent, Montreal, QC</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </button>
                    
                    <button
                      onClick={currentStep === 3 ? handleBookingSubmit : nextStep}
                      disabled={isLoading || !validateStep(currentStep)}
                      className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : currentStep === 3 ? (
                        'Complete Booking'
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                {formData.room && (
                  <>
                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="font-medium text-gray-900">{formData.room.room.name}</p>
                        <p className="text-sm text-gray-600">{formData.guests} guests</p>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span>{new Date(formData.checkIn).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span>{new Date(formData.checkOut).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span>
                            {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatPrice(formData.room.priceBreakdown.basePrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxes & Fees:</span>
                        <span>{formatPrice(formData.room.priceBreakdown.taxes)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                        <span>Total:</span>
                        <span>{formatPrice(formData.room.totalPrice)}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Wifi className="h-4 w-4 mr-2 text-green-500" />
                        <span>Free WiFi included</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Coffee className="h-4 w-4 mr-2 text-green-500" />
                        <span>Free breakfast included</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span>Free cancellation until 24h before</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" message="Loading booking details..." className="min-h-screen" />}>
      <BookingPageContent />
    </Suspense>
  )
}