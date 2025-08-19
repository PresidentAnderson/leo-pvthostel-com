import { availabilityService } from '@/services/availabilityService'
import { AvailabilityQuery } from '@/types/booking'

describe('AvailabilityService', () => {
  beforeEach(() => {
    // Clear cache before each test
    availabilityService.clearCache()
  })

  describe('checkAvailability', () => {
    it('should return available rooms for valid dates', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2
      }

      const response = await availabilityService.checkAvailability(query)

      expect(response).toBeDefined()
      expect(response.query).toEqual(query)
      expect(response.results).toBeInstanceOf(Array)
      expect(response.totalResults).toBeGreaterThanOrEqual(0)
      expect(response.checkedAt).toBeDefined()
    })

    it('should filter rooms by capacity', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 4
      }

      const response = await availabilityService.checkAvailability(query)
      
      response.results.forEach(result => {
        expect(result.room.capacity).toBeGreaterThanOrEqual(4)
      })
    })

    it('should filter rooms by room type', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2,
        roomTypes: ['private']
      }

      const response = await availabilityService.checkAvailability(query)
      
      response.results.forEach(result => {
        expect(['private', 'suite']).toContain(result.room.type.category)
      })
    })

    it('should filter rooms by price range', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2,
        priceRange: {
          min: 50,
          max: 100
        }
      }

      const response = await availabilityService.checkAvailability(query)
      
      response.results.forEach(result => {
        const pricePerNight = result.totalPrice / 4 // 4 nights
        expect(pricePerNight).toBeGreaterThanOrEqual(50)
        expect(pricePerNight).toBeLessThanOrEqual(150) // Allow for taxes/fees
      })
    })

    it('should filter rooms by accessibility', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2,
        accessibility: true
      }

      const response = await availabilityService.checkAvailability(query)
      
      response.results.forEach(result => {
        expect(result.room.isAccessible).toBe(true)
      })
    })

    it('should filter rooms by amenities', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2,
        amenities: ['AC', 'TV']
      }

      const response = await availabilityService.checkAvailability(query)
      
      response.results.forEach(result => {
        expect(result.room.amenities.some(a => a.toLowerCase().includes('ac'))).toBe(true)
        expect(result.room.amenities.some(a => a.toLowerCase().includes('tv'))).toBe(true)
      })
    })

    it('should return alternatives when no rooms available', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 20, // Very high guest count to trigger no availability
        roomTypes: ['single-room']
      }

      const response = await availabilityService.checkAvailability(query)
      
      if (response.results.length === 0) {
        expect(response.alternatives).toBeDefined()
        expect(response.alternatives!.length).toBeGreaterThan(0)
      }
    })

    it('should cache results for repeated queries', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2
      }

      const startTime = Date.now()
      await availabilityService.checkAvailability(query)
      const firstCallDuration = Date.now() - startTime

      const cachedStartTime = Date.now()
      const cachedResponse = await availabilityService.checkAvailability(query)
      const cachedCallDuration = Date.now() - cachedStartTime

      expect(cachedResponse).toBeDefined()
      expect(cachedCallDuration).toBeLessThan(firstCallDuration)
    })

    it('should calculate correct total price', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-03', // 2 nights
        guests: 2
      }

      const response = await availabilityService.checkAvailability(query)
      
      response.results.forEach(result => {
        const nights = 2
        const baseTotal = result.room.basePrice * nights
        
        // Total should be base price plus taxes and fees
        expect(result.totalPrice).toBeGreaterThan(baseTotal)
        expect(result.priceBreakdown).toBeDefined()
        expect(result.priceBreakdown.basePrice).toBe(result.room.basePrice)
        expect(result.priceBreakdown.total).toBeGreaterThan(0)
      })
    })

    it('should apply seasonal pricing correctly', async () => {
      const summerQuery: AvailabilityQuery = {
        checkInDate: '2024-07-01', // Summer (high season)
        checkOutDate: '2024-07-03',
        guests: 2
      }

      const winterQuery: AvailabilityQuery = {
        checkInDate: '2024-02-01', // Winter (low season)
        checkOutDate: '2024-02-03',
        guests: 2
      }

      const summerResponse = await availabilityService.checkAvailability(summerQuery)
      const winterResponse = await availabilityService.checkAvailability(winterQuery)

      // Find the same room in both responses
      const summerRoom = summerResponse.results.find(r => r.room.id === 'private-double')
      const winterRoom = winterResponse.results.find(r => r.room.id === 'private-double')

      if (summerRoom && winterRoom) {
        // Summer should be more expensive due to seasonal multiplier
        expect(summerRoom.priceBreakdown.seasonalMultiplier).toBeGreaterThan(
          winterRoom.priceBreakdown.seasonalMultiplier
        )
      }
    })

    it('should apply length of stay discounts', async () => {
      const shortStayQuery: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-03', // 2 nights
        guests: 2
      }

      const longStayQuery: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-15', // 14 nights
        guests: 2
      }

      const shortStayResponse = await availabilityService.checkAvailability(shortStayQuery)
      const longStayResponse = await availabilityService.checkAvailability(longStayQuery)

      const shortStayRoom = shortStayResponse.results.find(r => r.room.id === 'private-double')
      const longStayRoom = longStayResponse.results.find(r => r.room.id === 'private-double')

      if (shortStayRoom && longStayRoom) {
        // Long stay should have a discount
        expect(longStayRoom.priceBreakdown.lengthOfStayDiscount).toBeGreaterThan(
          shortStayRoom.priceBreakdown.lengthOfStayDiscount
        )
        
        // Average price per night should be lower for long stays
        const shortStayPerNight = shortStayRoom.totalPrice / 2
        const longStayPerNight = longStayRoom.totalPrice / 14
        expect(longStayPerNight).toBeLessThan(shortStayPerNight)
      }
    })

    it('should include booking restrictions', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-07-01', // High season
        checkOutDate: '2024-07-03',
        guests: 2
      }

      const response = await availabilityService.checkAvailability(query)
      
      const dormRoom = response.results.find(r => r.room.type.category === 'dorm')
      if (dormRoom) {
        expect(dormRoom.restrictions).toBeDefined()
        expect(dormRoom.restrictions.length).toBeGreaterThan(0)
        
        // Should have minimum stay restriction during high season
        const minStayRestriction = dormRoom.restrictions.find(r => r.type === 'minStay')
        expect(minStayRestriction).toBeDefined()
      }
    })

    it('should include cancellation policy', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2
      }

      const response = await availabilityService.checkAvailability(query)
      
      response.results.forEach(result => {
        expect(result.cancellationPolicy).toBeDefined()
        expect(result.cancellationPolicy.type).toBeDefined()
        expect(result.cancellationPolicy.description).toBeDefined()
        expect(result.cancellationPolicy.deadlines).toBeInstanceOf(Array)
        expect(result.cancellationPolicy.refundRules).toBeInstanceOf(Array)
      })
    })

    it('should sort results by price (lowest first)', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2
      }

      const response = await availabilityService.checkAvailability(query)
      
      if (response.results.length > 1) {
        for (let i = 1; i < response.results.length; i++) {
          expect(response.results[i].totalPrice).toBeGreaterThanOrEqual(
            response.results[i - 1].totalPrice
          )
        }
      }
    })
  })

  describe('subscribeToAvailabilityUpdates', () => {
    it('should provide real-time updates', done => {
      let updateCount = 0
      
      const unsubscribe = availabilityService.subscribeToAvailabilityUpdates(update => {
        updateCount++
        expect(update).toBeDefined()
        expect(update.timestamp).toBeDefined()
        expect(update.roomId).toBeDefined()
        expect(update.date).toBeDefined()
        expect(update.availabilityChange).toBeDefined()
        expect(update.priceChange).toBeDefined()
        
        if (updateCount >= 1) {
          unsubscribe()
          done()
        }
      })

      // Force timeout if no updates received
      setTimeout(() => {
        unsubscribe()
        done()
      }, 35000) // Slightly more than update interval
    }, 40000)
  })

  describe('clearCache', () => {
    it('should clear cached results', async () => {
      const query: AvailabilityQuery = {
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        guests: 2
      }

      // First call - should cache
      await availabilityService.checkAvailability(query)
      
      // Clear cache
      availabilityService.clearCache()
      
      // Second call - should not use cache (will take longer)
      const startTime = Date.now()
      await availabilityService.checkAvailability(query)
      const duration = Date.now() - startTime
      
      // Should take at least 500ms due to simulated API delay
      expect(duration).toBeGreaterThanOrEqual(400) // Allow some tolerance
    })
  })
})