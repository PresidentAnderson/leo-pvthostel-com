import {
  Booking,
  BookingRequest,
  BookingConfirmation,
  BookingStatus,
  PaymentRecord,
  PaymentMethod,
  PaymentStatus,
  BookingModification,
  CheckInRecord,
  CheckOutRecord,
  GuestInfo,
  BookingValidation,
  BookingError,
  BookingWarning,
  RoomAssignment,
  RoomKey,
  WelcomePackage,
  DigitalWelcomeContent,
  WifiCredentials,
  LocalGuide,
  EmergencyContactInfo,
  CheckInIssue,
  RoomInspectionResult,
  GuestFeedback,
  ModificationType,
  ModificationChange
} from '@/types/booking'
import availabilityService from './availabilityService'

// Mock data for demonstration
const MOCK_BOOKINGS: Map<string, Booking> = new Map()

class BookingService {
  private readonly taxRate = 0.15
  private readonly processingFee = 5
  private readonly depositPercentage = 0.2

  // Create a new booking
  async createBooking(request: BookingRequest): Promise<Booking> {
    // Validate the booking request
    const validation = await this.validateBooking(request)
    if (!validation.isValid) {
      throw new Error(`Booking validation failed: ${validation.errors.map(e => e.message).join(', ')}`)
    }

    // Check availability
    const availabilityResponse = await availabilityService.checkAvailability({
      checkInDate: request.checkInDate,
      checkOutDate: request.checkOutDate,
      guests: request.guests.length,
      roomTypes: [request.roomId]
    })

    if (availabilityResponse.results.length === 0) {
      throw new Error('Selected room is not available for the requested dates')
    }

    const selectedRoom = availabilityResponse.results[0]
    const bookingId = this.generateBookingId()
    const reference = this.generateBookingReference()

    // Calculate pricing
    const totalAmount = selectedRoom.totalPrice
    const depositAmount = Math.round(totalAmount * this.depositPercentage)

    // Create room assignments
    const roomAssignments: RoomAssignment[] = request.guests.map((guest, index) => ({
      guestId: guest.id || `guest-${index}`,
      roomId: request.roomId,
      bedNumber: `bed-${index + 1}`,
      checkInDate: request.checkInDate,
      checkOutDate: request.checkOutDate,
      keyCode: this.generateKeyCode()
    }))

    // Create confirmation
    const confirmation: BookingConfirmation = {
      confirmedAt: new Date().toISOString(),
      totalAmount,
      priceBreakdown: selectedRoom.priceBreakdown,
      roomAssignments,
      checkInInstructions: this.generateCheckInInstructions(request),
      cancellationPolicy: selectedRoom.cancellationPolicy,
      confirmationNumber: reference
    }

    // Create initial payment record (deposit)
    const depositPayment: PaymentRecord = {
      id: this.generatePaymentId(),
      amount: depositAmount,
      currency: 'CAD',
      method: 'credit-card',
      status: 'pending',
      notes: 'Booking deposit'
    }

    // Create the booking
    const booking: Booking = {
      id: bookingId,
      reference,
      status: 'pending',
      request,
      confirmation,
      payments: [depositPayment],
      modifications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Store the booking
    MOCK_BOOKINGS.set(bookingId, booking)

    // Simulate payment processing
    await this.processPayment(bookingId, depositPayment.id)

    return booking
  }

  // Validate booking request
  async validateBooking(request: BookingRequest): Promise<BookingValidation> {
    const errors: BookingError[] = []
    const warnings: BookingWarning[] = []

    // Check dates
    const checkIn = new Date(request.checkInDate)
    const checkOut = new Date(request.checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkIn < today) {
      errors.push({
        field: 'checkInDate',
        message: 'Check-in date cannot be in the past',
        code: 'INVALID_DATE'
      })
    }

    if (checkOut <= checkIn) {
      errors.push({
        field: 'checkOutDate',
        message: 'Check-out date must be after check-in date',
        code: 'INVALID_DATE'
      })
    }

    // Check guests
    if (!request.guests || request.guests.length === 0) {
      errors.push({
        field: 'guests',
        message: 'At least one guest is required',
        code: 'MISSING_GUESTS'
      })
    }

    // Validate guest information
    request.guests?.forEach((guest, index) => {
      if (!guest.firstName || !guest.lastName) {
        errors.push({
          field: `guests[${index}]`,
          message: 'Guest name is required',
          code: 'MISSING_NAME'
        })
      }

      if (!guest.email || !this.isValidEmail(guest.email)) {
        errors.push({
          field: `guests[${index}].email`,
          message: 'Valid email is required',
          code: 'INVALID_EMAIL'
        })
      }

      if (!guest.phone) {
        errors.push({
          field: `guests[${index}].phone`,
          message: 'Phone number is required',
          code: 'MISSING_PHONE'
        })
      }

      if (!guest.nationality) {
        warnings.push({
          field: `guests[${index}].nationality`,
          message: 'Nationality is recommended for international travelers',
          code: 'MISSING_NATIONALITY',
          dismissible: true
        })
      }
    })

    // Check room selection
    if (!request.roomId) {
      errors.push({
        field: 'roomId',
        message: 'Room selection is required',
        code: 'MISSING_ROOM'
      })
    }

    // Check for long stays
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    if (nights > 30) {
      warnings.push({
        field: 'dates',
        message: 'For stays longer than 30 nights, consider our extended stay rates',
        code: 'LONG_STAY',
        dismissible: true
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // Get booking by ID
  async getBooking(bookingId: string): Promise<Booking | null> {
    return MOCK_BOOKINGS.get(bookingId) || null
  }

  // Get booking by reference
  async getBookingByReference(reference: string): Promise<Booking | null> {
    for (const booking of MOCK_BOOKINGS.values()) {
      if (booking.reference === reference) {
        return booking
      }
    }
    return null
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }

    booking.status = status
    booking.updatedAt = new Date().toISOString()
    
    MOCK_BOOKINGS.set(bookingId, booking)
    return booking
  }

  // Process payment
  async processPayment(bookingId: string, paymentId: string): Promise<PaymentRecord> {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }

    const payment = booking.payments.find(p => p.id === paymentId)
    if (!payment) {
      throw new Error('Payment not found')
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update payment status
    payment.status = 'completed'
    payment.processedAt = new Date().toISOString()
    payment.transactionId = this.generateTransactionId()

    // Update booking status if deposit is paid
    if (booking.status === 'pending' && payment.notes === 'Booking deposit') {
      booking.status = 'confirmed'
    }

    booking.updatedAt = new Date().toISOString()
    MOCK_BOOKINGS.set(bookingId, booking)

    return payment
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled')
    }

    if (booking.status === 'checked-in') {
      throw new Error('Cannot cancel a booking that has already checked in')
    }

    // Calculate refund based on cancellation policy
    const refundAmount = this.calculateRefund(booking)

    // Create cancellation modification
    const modification: BookingModification = {
      id: this.generateModificationId(),
      type: 'cancellation',
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      status: 'approved',
      changes: [{
        field: 'status',
        oldValue: booking.status,
        newValue: 'cancelled',
        impact: 'Booking cancelled'
      }],
      refundAmount,
      notes: reason || 'Guest requested cancellation'
    }

    booking.modifications.push(modification)
    booking.status = 'cancelled'
    booking.updatedAt = new Date().toISOString()

    // Process refund if applicable
    if (refundAmount > 0) {
      const refundPayment: PaymentRecord = {
        id: this.generatePaymentId(),
        amount: -refundAmount,
        currency: 'CAD',
        method: 'credit-card',
        status: 'completed',
        processedAt: new Date().toISOString(),
        notes: 'Cancellation refund'
      }
      booking.payments.push(refundPayment)
    }

    MOCK_BOOKINGS.set(bookingId, booking)
    return booking
  }

  // Modify booking
  async modifyBooking(
    bookingId: string,
    modifications: Partial<BookingRequest>
  ): Promise<Booking> {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status === 'cancelled' || booking.status === 'checked-out') {
      throw new Error(`Cannot modify a ${booking.status} booking`)
    }

    const changes: ModificationChange[] = []

    // Track changes
    if (modifications.checkInDate && modifications.checkInDate !== booking.request.checkInDate) {
      changes.push({
        field: 'checkInDate',
        oldValue: booking.request.checkInDate,
        newValue: modifications.checkInDate,
        impact: 'Date change may affect room availability'
      })
    }

    if (modifications.checkOutDate && modifications.checkOutDate !== booking.request.checkOutDate) {
      changes.push({
        field: 'checkOutDate',
        oldValue: booking.request.checkOutDate,
        newValue: modifications.checkOutDate,
        impact: 'Date change may affect total price'
      })
    }

    if (changes.length === 0) {
      return booking // No changes to apply
    }

    // Check new availability if dates changed
    if (modifications.checkInDate || modifications.checkOutDate) {
      const availabilityResponse = await availabilityService.checkAvailability({
        checkInDate: modifications.checkInDate || booking.request.checkInDate,
        checkOutDate: modifications.checkOutDate || booking.request.checkOutDate,
        guests: booking.request.guests.length,
        roomTypes: [booking.request.roomId]
      })

      if (availabilityResponse.results.length === 0) {
        throw new Error('Room is not available for the new dates')
      }

      // Update pricing
      const newRoom = availabilityResponse.results[0]
      const priceDifference = newRoom.totalPrice - booking.confirmation.totalAmount

      // Create modification record
      const modification: BookingModification = {
        id: this.generateModificationId(),
        type: 'date-change',
        requestedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
        status: 'approved',
        changes,
        additionalCosts: priceDifference > 0 ? priceDifference : undefined,
        refundAmount: priceDifference < 0 ? Math.abs(priceDifference) : undefined,
        notes: 'Date modification processed'
      }

      booking.modifications.push(modification)
      booking.confirmation.totalAmount = newRoom.totalPrice
      booking.confirmation.priceBreakdown = newRoom.priceBreakdown
    }

    // Apply modifications
    booking.request = { ...booking.request, ...modifications }
    booking.status = 'modified'
    booking.updatedAt = new Date().toISOString()

    MOCK_BOOKINGS.set(bookingId, booking)
    return booking
  }

  // Check-in process
  async checkIn(bookingId: string): Promise<CheckInRecord> {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status !== 'confirmed') {
      throw new Error('Only confirmed bookings can be checked in')
    }

    // Verify check-in date
    const today = new Date().toISOString().split('T')[0]
    if (booking.request.checkInDate !== today) {
      throw new Error('Check-in date does not match booking')
    }

    // Generate room keys
    const roomKeys: RoomKey[] = booking.confirmation.roomAssignments.map(assignment => ({
      type: 'digital',
      keyId: this.generateKeyId(),
      accessCode: assignment.keyCode || this.generateKeyCode(),
      validFrom: booking.request.checkInDate,
      validTo: booking.request.checkOutDate,
      permissions: ['room', 'common-areas', 'entrance']
    }))

    // Create welcome package
    const welcomePackage = this.createWelcomePackage()

    // Create check-in record
    const checkInRecord: CheckInRecord = {
      processedAt: new Date().toISOString(),
      processedBy: 'system',
      method: 'self-service',
      roomKeys,
      documentsVerified: true,
      depositsCollected: booking.payments.filter(p => p.notes?.includes('deposit')),
      welcomePackage,
      issues: []
    }

    booking.checkin = checkInRecord
    booking.status = 'checked-in'
    booking.updatedAt = new Date().toISOString()

    MOCK_BOOKINGS.set(bookingId, booking)
    return checkInRecord
  }

  // Check-out process
  async checkOut(bookingId: string, feedback?: GuestFeedback): Promise<CheckOutRecord> {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.status !== 'checked-in') {
      throw new Error('Only checked-in bookings can be checked out')
    }

    // Perform room inspection
    const roomInspection: RoomInspectionResult = {
      inspectedAt: new Date().toISOString(),
      inspectedBy: 'system',
      condition: 'good',
      damages: [],
      cleaningRequired: true,
      maintenanceRequired: false
    }

    // Calculate final charges
    const finalCharges: PaymentRecord[] = []
    const remainingBalance = booking.confirmation.totalAmount - 
      booking.payments
        .filter(p => p.status === 'completed' && p.amount > 0)
        .reduce((sum, p) => sum + p.amount, 0)

    if (remainingBalance > 0) {
      finalCharges.push({
        id: this.generatePaymentId(),
        amount: remainingBalance,
        currency: 'CAD',
        method: 'credit-card',
        status: 'pending',
        notes: 'Final balance payment'
      })
    }

    // Process deposit return
    const depositAmount = booking.payments
      .filter(p => p.notes?.includes('deposit') && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)

    const depositsReturned: PaymentRecord[] = []
    if (depositAmount > 0 && roomInspection.damages.length === 0) {
      depositsReturned.push({
        id: this.generatePaymentId(),
        amount: -depositAmount,
        currency: 'CAD',
        method: 'credit-card',
        status: 'processing',
        notes: 'Deposit refund'
      })
    }

    // Create check-out record
    const checkOutRecord: CheckOutRecord = {
      processedAt: new Date().toISOString(),
      processedBy: 'system',
      method: 'express',
      roomInspection,
      finalCharges,
      depositsReturned,
      feedbackProvided: feedback,
      leftBehindItems: []
    }

    booking.checkout = checkOutRecord
    booking.status = 'checked-out'
    booking.updatedAt = new Date().toISOString()

    MOCK_BOOKINGS.set(bookingId, booking)
    return checkOutRecord
  }

  // Get user bookings
  async getUserBookings(email: string): Promise<Booking[]> {
    const bookings: Booking[] = []
    
    for (const booking of MOCK_BOOKINGS.values()) {
      if (booking.request.guests.some(guest => guest.email === email)) {
        bookings.push(booking)
      }
    }

    return bookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  // Calculate refund amount based on cancellation policy
  private calculateRefund(booking: Booking): number {
    const now = new Date()
    const checkIn = new Date(booking.request.checkInDate)
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60)

    const policy = booking.confirmation.cancellationPolicy
    const paidAmount = booking.payments
      .filter(p => p.status === 'completed' && p.amount > 0)
      .reduce((sum, p) => sum + p.amount, 0)

    // Find applicable deadline
    const applicableDeadline = policy.deadlines
      .sort((a, b) => b.hoursBeforeCheckIn - a.hoursBeforeCheckIn)
      .find(deadline => hoursUntilCheckIn >= deadline.hoursBeforeCheckIn)

    if (!applicableDeadline) {
      return 0 // No refund if past all deadlines
    }

    return Math.round(paidAmount * (applicableDeadline.refundPercentage / 100))
  }

  // Create welcome package
  private createWelcomePackage(): WelcomePackage {
    const wifiCredentials: WifiCredentials = {
      networkName: 'PVTHostel_Guest',
      password: 'Welcome2024!',
      instructions: 'Connect to the network and enter the password when prompted'
    }

    const digitalContent: DigitalWelcomeContent = {
      wifiCredentials,
      hostelMap: '/maps/hostel-layout.pdf',
      localGuide: {
        attractions: [
          {
            name: 'Old Montreal',
            description: 'Historic district with cobblestone streets',
            address: 'Old Montreal, QC',
            openingHours: 'Always open',
            category: 'Historic',
            distanceFromHostel: 2.5,
            walkingTime: 30
          }
        ],
        restaurants: [
          {
            name: 'Schwartz\'s Deli',
            cuisine: 'Jewish Deli',
            priceRange: '$$',
            address: '3895 Boulevard Saint-Laurent',
            openingHours: '8AM-12:30AM',
            specialties: ['Smoked meat sandwich'],
            distanceFromHostel: 1.2
          }
        ],
        transportation: [
          {
            type: 'metro',
            description: 'Montreal Metro - Orange and Green lines nearby',
            nearestStation: 'Place-d\'Armes',
            cost: '$3.50 per ride',
            scheduleInfo: '5:30AM - 1:00AM daily'
          }
        ],
        emergencyServices: [
          {
            type: 'medical',
            name: 'Montreal General Hospital',
            phone: '514-934-1934',
            address: '1650 Cedar Ave',
            availability: '24/7'
          }
        ]
      },
      emergencyContacts: [
        {
          type: 'hostel',
          name: 'PVT Hostel Front Desk',
          phone: '514-555-0100',
          email: 'frontdesk@pvthostel.com',
          availability: '24/7'
        }
      ],
      houseRules: 'Quiet hours: 10PM-8AM. No smoking. No outside guests after 11PM.'
    }

    return {
      items: [
        {
          name: 'City Map',
          description: 'Detailed map of Montreal with key attractions',
          category: 'information'
        },
        {
          name: 'Towel',
          description: 'Complimentary towel for your stay',
          category: 'amenity'
        }
      ],
      deliveredAt: new Date().toISOString(),
      digitalContent
    }
  }

  // Generate check-in instructions
  private generateCheckInInstructions(request: BookingRequest): string {
    return `
Welcome to PVT Hostel Montreal!

CHECK-IN INFORMATION:
- Check-in time: 3:00 PM
- Check-out time: 11:00 AM
- Location: 123 Rue Saint-Paul, Montreal, QC H2Y 1Z5

ARRIVAL INSTRUCTIONS:
1. Proceed to the front desk with your booking confirmation
2. Present a valid photo ID and credit card
3. Your room key will be provided after verification

WHAT TO BRING:
- Valid government-issued photo ID
- Credit card for incidentals
- Booking confirmation (this email)

CONTACT:
- Front Desk: +1 514-555-0100
- Email: info@pvthostel.com

We look forward to welcoming you!
    `.trim()
  }

  // Utility methods
  private generateBookingId(): string {
    return `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`
  }

  private generateBookingReference(): string {
    return `PVT${Date.now().toString(36).toUpperCase()}`
  }

  private generatePaymentId(): string {
    return `PAY${Date.now()}${Math.random().toString(36).substr(2, 9)}`
  }

  private generateTransactionId(): string {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
  }

  private generateModificationId(): string {
    return `MOD${Date.now()}${Math.random().toString(36).substr(2, 9)}`
  }

  private generateKeyCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  private generateKeyId(): string {
    return `KEY${Date.now()}${Math.random().toString(36).substr(2, 9)}`
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

export const bookingService = new BookingService()
export default bookingService