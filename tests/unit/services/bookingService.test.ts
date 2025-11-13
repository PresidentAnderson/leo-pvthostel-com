import { bookingService } from '@/services/bookingService'
import { BookingRequest, GuestInfo, BookingStatus } from '@/types/booking'

describe('BookingService', () => {
  const mockGuestInfo: GuestInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-514-555-0123',
    nationality: 'Canada',
    passportNumber: 'CA123456',
    dateOfBirth: '1990-01-01'
  }

  // Use future dates for tests
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 5)
  
  const mockBookingRequest: BookingRequest = {
    checkInDate: tomorrow.toISOString().split('T')[0],
    checkOutDate: nextWeek.toISOString().split('T')[0],
    roomId: 'private-double',
    guests: [mockGuestInfo],
    primaryGuest: 'guest-0',
    specialRequests: 'Late check-in please'
  }

  describe('createBooking', () => {
    it('should create a new booking successfully', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)

      expect(booking).toBeDefined()
      expect(booking.id).toBeDefined()
      expect(booking.reference).toBeDefined()
      expect(booking.status).toBe('pending')
      expect(booking.request).toEqual(mockBookingRequest)
      expect(booking.confirmation).toBeDefined()
      expect(booking.payments).toHaveLength(1)
      expect(booking.payments[0].notes).toContain('deposit')
    })

    it('should validate booking request', async () => {
      const invalidRequest: BookingRequest = {
        ...mockBookingRequest,
        checkInDate: '2020-01-01', // Past date
      }

      await expect(bookingService.createBooking(invalidRequest)).rejects.toThrow(
        'Booking validation failed'
      )
    })

    it('should check room availability before booking', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)

      expect(booking.confirmation).toBeDefined()
      expect(booking.confirmation?.roomAssignments).toBeDefined()
      expect(booking.confirmation?.roomAssignments).toHaveLength(1)
      expect(booking.confirmation?.roomAssignments[0].roomId).toBe(mockBookingRequest.roomId)
    })

    it('should generate unique booking reference', async () => {
      const booking1 = await bookingService.createBooking(mockBookingRequest)
      const booking2 = await bookingService.createBooking({
        ...mockBookingRequest,
        guests: [{ ...mockGuestInfo, email: 'jane.doe@example.com' }]
      })

      expect(booking1.reference).not.toBe(booking2.reference)
      expect(booking1.id).not.toBe(booking2.id)
    })

    it('should include check-in instructions', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)

      expect(booking.confirmation).toBeDefined()
      expect(booking.confirmation?.checkInInstructions).toBeDefined()
      expect(booking.confirmation?.checkInInstructions).toContain('CHECK-IN INFORMATION')
      expect(booking.confirmation?.checkInInstructions).toContain('3:00 PM')
    })

    it('should calculate deposit correctly', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)

      const depositPayment = booking.payments[0]
      const totalAmount = booking.confirmation?.totalAmount ?? 0

      expect(depositPayment.amount).toBe(Math.round(totalAmount * 0.2))
    })
  })

  describe('validateBooking', () => {
    it('should validate valid booking request', async () => {
      const futureDate1 = new Date()
      futureDate1.setDate(futureDate1.getDate() + 10)
      const futureDate2 = new Date()
      futureDate2.setDate(futureDate2.getDate() + 15)
      
      const validRequest = {
        ...mockBookingRequest,
        checkInDate: futureDate1.toISOString().split('T')[0],
        checkOutDate: futureDate2.toISOString().split('T')[0]
      }
      
      const validation = await bookingService.validateBooking(validRequest)
      
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should reject past check-in dates', async () => {
      const invalidRequest: BookingRequest = {
        ...mockBookingRequest,
        checkInDate: '2020-01-01'
      }

      const validation = await bookingService.validateBooking(invalidRequest)
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContainEqual(
        expect.objectContaining({
          field: 'checkInDate',
          code: 'INVALID_DATE'
        })
      )
    })

    it('should reject check-out before check-in', async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)
      const earlierDate = new Date()
      earlierDate.setDate(earlierDate.getDate() + 5)
      
      const invalidRequest: BookingRequest = {
        ...mockBookingRequest,
        checkInDate: futureDate.toISOString().split('T')[0],
        checkOutDate: earlierDate.toISOString().split('T')[0]
      }

      const validation = await bookingService.validateBooking(invalidRequest)
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContainEqual(
        expect.objectContaining({
          field: 'checkOutDate',
          code: 'INVALID_DATE'
        })
      )
    })

    it('should require at least one guest', async () => {
      const invalidRequest: BookingRequest = {
        ...mockBookingRequest,
        guests: []
      }

      const validation = await bookingService.validateBooking(invalidRequest)
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContainEqual(
        expect.objectContaining({
          field: 'guests',
          code: 'MISSING_GUESTS'
        })
      )
    })

    it('should validate guest email format', async () => {
      const invalidRequest: BookingRequest = {
        ...mockBookingRequest,
        guests: [{
          ...mockGuestInfo,
          email: 'invalid-email'
        }]
      }

      const validation = await bookingService.validateBooking(invalidRequest)
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContainEqual(
        expect.objectContaining({
          field: 'guests[0].email',
          code: 'INVALID_EMAIL'
        })
      )
    })

    it('should warn about long stays', async () => {
      const futureDate1 = new Date()
      futureDate1.setDate(futureDate1.getDate() + 10)
      const futureDate2 = new Date()
      futureDate2.setDate(futureDate2.getDate() + 50) // 40 days later
      
      const longStayRequest: BookingRequest = {
        ...mockBookingRequest,
        checkInDate: futureDate1.toISOString().split('T')[0],
        checkOutDate: futureDate2.toISOString().split('T')[0]
      }

      const validation = await bookingService.validateBooking(longStayRequest)
      
      expect(validation.isValid).toBe(true)
      expect(validation.warnings).toContainEqual(
        expect.objectContaining({
          field: 'dates',
          code: 'LONG_STAY'
        })
      )
    })

    it('should warn about missing nationality', async () => {
      const request: BookingRequest = {
        ...mockBookingRequest,
        guests: [{
          ...mockGuestInfo,
          nationality: ''
        }]
      }

      const validation = await bookingService.validateBooking(request)
      
      expect(validation.warnings).toContainEqual(
        expect.objectContaining({
          field: 'guests[0].nationality',
          code: 'MISSING_NATIONALITY'
        })
      )
    })
  })

  describe('getBooking', () => {
    it('should retrieve booking by ID', async () => {
      const created = await bookingService.createBooking(mockBookingRequest)
      const retrieved = await bookingService.getBooking(created.id)
      
      expect(retrieved).toEqual(created)
    })

    it('should return null for non-existent booking', async () => {
      const booking = await bookingService.getBooking('non-existent-id')
      
      expect(booking).toBeNull()
    })
  })

  describe('getBookingByReference', () => {
    it('should retrieve booking by reference', async () => {
      const created = await bookingService.createBooking(mockBookingRequest)
      const retrieved = await bookingService.getBookingByReference(created.reference)
      
      expect(retrieved).toEqual(created)
    })

    it('should return null for invalid reference', async () => {
      const booking = await bookingService.getBookingByReference('INVALID-REF')
      
      expect(booking).toBeNull()
    })
  })

  describe('updateBookingStatus', () => {
    it('should update booking status', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      const updated = await bookingService.updateBookingStatus(booking.id, 'confirmed')
      
      expect(updated.status).toBe('confirmed')
      expect(updated.updatedAt).not.toBe(booking.updatedAt)
    })

    it('should throw error for non-existent booking', async () => {
      await expect(
        bookingService.updateBookingStatus('non-existent', 'confirmed')
      ).rejects.toThrow('Booking not found')
    })
  })

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      const paymentId = booking.payments[0].id
      
      const payment = await bookingService.processPayment(booking.id, paymentId)
      
      expect(payment.status).toBe('completed')
      expect(payment.processedAt).toBeDefined()
      expect(payment.transactionId).toBeDefined()
    })

    it('should update booking status after deposit payment', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      const paymentId = booking.payments[0].id
      
      await bookingService.processPayment(booking.id, paymentId)
      const updated = await bookingService.getBooking(booking.id)
      
      expect(updated?.status).toBe('confirmed')
    })
  })

  describe('cancelBooking', () => {
    it('should cancel confirmed booking', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      
      const cancelled = await bookingService.cancelBooking(booking.id, 'Changed plans')
      
      expect(cancelled.status).toBe('cancelled')
      expect(cancelled.modifications).toHaveLength(1)
      expect(cancelled.modifications[0].type).toBe('cancellation')
      expect(cancelled.modifications[0].notes).toBe('Changed plans')
    })

    it('should not cancel already cancelled booking', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      await bookingService.cancelBooking(booking.id)
      
      await expect(
        bookingService.cancelBooking(booking.id)
      ).rejects.toThrow('Booking is already cancelled')
    })

    it('should not cancel checked-in booking', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      await bookingService.checkIn(booking.id)
      
      await expect(
        bookingService.cancelBooking(booking.id)
      ).rejects.toThrow('Cannot cancel a booking that has already checked in')
    })

    it('should calculate refund based on cancellation policy', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      
      // Process payment first
      await bookingService.processPayment(booking.id, booking.payments[0].id)
      
      const cancelled = await bookingService.cancelBooking(booking.id)
      
      expect(cancelled.modifications[0].refundAmount).toBeDefined()
      
      // Should have a refund payment record
      const refundPayment = cancelled.payments.find(p => p.notes === 'Cancellation refund')
      expect(refundPayment).toBeDefined()
      expect(refundPayment?.amount).toBeLessThan(0) // Negative amount for refund
    })
  })

  describe('modifyBooking', () => {
    it('should modify booking dates', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      
      const newCheckOut = '2024-12-07'
      const modified = await bookingService.modifyBooking(booking.id, {
        checkOutDate: newCheckOut
      })
      
      expect(modified.request.checkOutDate).toBe(newCheckOut)
      expect(modified.status).toBe('modified')
      expect(modified.modifications).toHaveLength(1)
      expect(modified.modifications[0].type).toBe('date-change')
    })

    it('should check availability for new dates', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      
      const modified = await bookingService.modifyBooking(booking.id, {
        checkInDate: '2024-12-02',
        checkOutDate: '2024-12-06'
      })
      
      expect(modified.modifications[0].changes).toHaveLength(2)
      expect(modified.confirmation?.totalAmount).toBeDefined()
    })

    it('should not modify cancelled booking', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      await bookingService.cancelBooking(booking.id)

      await expect(
        bookingService.modifyBooking(booking.id, { checkOutDate: '2024-12-07' })
      ).rejects.toThrow('Cannot modify a cancelled booking')
    })

    it('should calculate price difference for modifications', async () => {
      const booking = await bookingService.createBooking(mockBookingRequest)
      const originalTotal = booking.confirmation?.totalAmount ?? 0

      const modified = await bookingService.modifyBooking(booking.id, {
        checkOutDate: '2024-12-10' // Extended stay
      })

      const modification = modified.modifications[0]

      if ((modified.confirmation?.totalAmount ?? 0) > originalTotal) {
        expect(modification.additionalCosts).toBeDefined()
        expect(modification.additionalCosts).toBeGreaterThan(0)
      } else if ((modified.confirmation?.totalAmount ?? 0) < originalTotal) {
        expect(modification.refundAmount).toBeDefined()
        expect(modification.refundAmount).toBeGreaterThan(0)
      }
    })
  })

  describe('checkIn', () => {
    it('should check in confirmed booking', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      
      const checkInRecord = await bookingService.checkIn(booking.id)
      
      expect(checkInRecord).toBeDefined()
      expect(checkInRecord.processedAt).toBeDefined()
      expect(checkInRecord.roomKeys).toHaveLength(booking.request.guests.length)
      expect(checkInRecord.welcomePackage).toBeDefined()
      expect(checkInRecord.documentsVerified).toBe(true)
    })

    it('should only check in on correct date', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: '2025-12-01' // Future date
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      
      await expect(
        bookingService.checkIn(booking.id)
      ).rejects.toThrow('Check-in date does not match booking')
    })

    it('should generate digital room keys', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      
      const checkInRecord = await bookingService.checkIn(booking.id)
      
      checkInRecord.roomKeys.forEach(key => {
        expect(key.type).toBe('digital')
        expect(key.keyId).toBeDefined()
        expect(key.accessCode).toBeDefined()
        expect(key.permissions).toContain('room')
        expect(key.permissions).toContain('common-areas')
      })
    })

    it('should include welcome package', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      
      const checkInRecord = await bookingService.checkIn(booking.id)
      const welcomePackage = checkInRecord.welcomePackage!
      
      expect(welcomePackage.items).toBeDefined()
      expect(welcomePackage.digitalContent).toBeDefined()
      expect(welcomePackage.digitalContent.wifiCredentials).toBeDefined()
      expect(welcomePackage.digitalContent.localGuide).toBeDefined()
      expect(welcomePackage.digitalContent.emergencyContacts).toBeDefined()
      expect(welcomePackage.digitalContent.houseRules).toBeDefined()
    })
  })

  describe('checkOut', () => {
    it('should check out checked-in booking', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      await bookingService.checkIn(booking.id)
      
      const checkOutRecord = await bookingService.checkOut(booking.id)
      
      expect(checkOutRecord).toBeDefined()
      expect(checkOutRecord.processedAt).toBeDefined()
      expect(checkOutRecord.roomInspection).toBeDefined()
      expect(checkOutRecord.finalCharges).toBeDefined()
      expect(checkOutRecord.depositsReturned).toBeDefined()
    })

    it('should perform room inspection', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      await bookingService.checkIn(booking.id)
      
      const checkOutRecord = await bookingService.checkOut(booking.id)
      const inspection = checkOutRecord.roomInspection
      
      expect(inspection.inspectedAt).toBeDefined()
      expect(inspection.condition).toBeDefined()
      expect(inspection.damages).toBeDefined()
      expect(inspection.cleaningRequired).toBeDefined()
    })

    it('should calculate final charges', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      await bookingService.checkIn(booking.id)
      
      const checkOutRecord = await bookingService.checkOut(booking.id)
      
      // Should calculate remaining balance if deposit was paid
      const totalPaid = booking.payments
        .filter(p => p.status === 'completed' && p.amount > 0)
        .reduce((sum, p) => sum + p.amount, 0)

      const remainingBalance = (booking.confirmation?.totalAmount ?? 0) - totalPaid

      if (remainingBalance > 0) {
        expect(checkOutRecord.finalCharges).toHaveLength(1)
        expect(checkOutRecord.finalCharges[0].amount).toBe(remainingBalance)
      }
    })

    it('should process deposit return', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      await bookingService.processPayment(booking.id, booking.payments[0].id)
      await bookingService.checkIn(booking.id)
      
      const checkOutRecord = await bookingService.checkOut(booking.id)
      
      // If no damages, deposit should be returned
      if (checkOutRecord.roomInspection.damages.length === 0) {
        expect(checkOutRecord.depositsReturned).toHaveLength(1)
        expect(checkOutRecord.depositsReturned[0].amount).toBeLessThan(0) // Negative for refund
      }
    })

    it('should accept guest feedback', async () => {
      const booking = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      })
      await bookingService.updateBookingStatus(booking.id, 'confirmed')
      await bookingService.checkIn(booking.id)
      
      const feedback = {
        overallRating: 5,
        cleanliness: 5,
        staff: 5,
        location: 4,
        value: 5,
        amenities: 4,
        comments: 'Great stay!',
        wouldRecommend: true,
        submittedAt: new Date().toISOString()
      }
      
      const checkOutRecord = await bookingService.checkOut(booking.id, feedback)
      
      expect(checkOutRecord.feedbackProvided).toEqual(feedback)
    })
  })

  describe('getUserBookings', () => {
    it('should retrieve all bookings for a user', async () => {
      const email = 'user@example.com'
      const guest: GuestInfo = {
        ...mockGuestInfo,
        email
      }
      
      // Create multiple bookings
      await bookingService.createBooking({
        ...mockBookingRequest,
        guests: [guest]
      })
      
      await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: '2025-01-01',
        checkOutDate: '2025-01-05',
        guests: [guest]
      })
      
      const userBookings = await bookingService.getUserBookings(email)
      
      expect(userBookings).toHaveLength(2)
      expect(userBookings[0].request.guests[0].email).toBe(email)
    })

    it('should return bookings sorted by creation date', async () => {
      const email = 'sorted@example.com'
      const guest: GuestInfo = {
        ...mockGuestInfo,
        email
      }
      
      // Create bookings with slight delay
      const booking1 = await bookingService.createBooking({
        ...mockBookingRequest,
        guests: [guest]
      })
      
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const booking2 = await bookingService.createBooking({
        ...mockBookingRequest,
        checkInDate: '2025-01-01',
        checkOutDate: '2025-01-05',
        guests: [guest]
      })
      
      const userBookings = await bookingService.getUserBookings(email)
      
      expect(userBookings[0].id).toBe(booking2.id)
      expect(userBookings[1].id).toBe(booking1.id)
    })

    it('should return empty array for user with no bookings', async () => {
      const bookings = await bookingService.getUserBookings('no-bookings@example.com')
      
      expect(bookings).toEqual([])
    })
  })
})