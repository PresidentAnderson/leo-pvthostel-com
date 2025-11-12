import { 
  AvailabilityQuery, 
  AvailabilityResponse, 
  AvailableRoom, 
  Room, 
  AvailabilitySlot, 
  PriceBreakdown, 
  BookingRestriction,
  AlternativeOption
} from '@/types/booking'

// Mock room data - In production, this would come from a database
const MOCK_ROOMS: Room[] = [
  {
    id: 'dorm-mixed-4',
    name: 'Mixed Dormitory (4 beds)',
    type: {
      id: 'mixed-dorm',
      name: 'Mixed Dormitory',
      category: 'dorm',
      gender: 'mixed',
      description: 'Shared dormitory room with mixed gender',
      features: ['Shared bathroom', 'Lockers', 'Common area access', 'Free WiFi']
    },
    capacity: 4,
    basePrice: 35,
    amenities: ['AC', 'Lockers', 'USB Charging', 'Reading Lights', 'Privacy Curtains'],
    images: ['/images/rooms/mixed-dorm-4.jpg'],
    description: 'Comfortable mixed dormitory with 4 bunk beds, privacy curtains, and personal lockers.',
    bedConfiguration: '4 bunk beds',
    bathType: 'shared',
    area: 25,
    isAccessible: false
  },
  {
    id: 'dorm-female-6',
    name: 'Female Dormitory (6 beds)',
    type: {
      id: 'female-dorm',
      name: 'Female Only Dormitory',
      category: 'dorm',
      gender: 'female',
      description: 'Female-only dormitory room',
      features: ['Shared bathroom', 'Lockers', 'Safe space', 'Free WiFi']
    },
    capacity: 6,
    basePrice: 32,
    amenities: ['AC', 'Lockers', 'USB Charging', 'Reading Lights', 'Privacy Curtains', 'Hair Dryer'],
    images: ['/images/rooms/female-dorm-6.jpg'],
    description: 'Safe and secure female-only dormitory with 6 beds and dedicated bathroom facilities.',
    bedConfiguration: '6 bunk beds',
    bathType: 'shared',
    area: 30,
    isAccessible: false
  },
  {
    id: 'dorm-male-8',
    name: 'Male Dormitory (8 beds)',
    type: {
      id: 'male-dorm',
      name: 'Male Only Dormitory',
      category: 'dorm',
      gender: 'male',
      description: 'Male-only dormitory room',
      features: ['Shared bathroom', 'Lockers', 'Gaming area', 'Free WiFi']
    },
    capacity: 8,
    basePrice: 28,
    amenities: ['AC', 'Lockers', 'USB Charging', 'Reading Lights', 'Privacy Curtains'],
    images: ['/images/rooms/male-dorm-8.jpg'],
    description: 'Spacious male-only dormitory with 8 beds and easy access to common areas.',
    bedConfiguration: '8 bunk beds',
    bathType: 'shared',
    area: 40,
    isAccessible: false
  },
  {
    id: 'private-double',
    name: 'Private Double Room',
    type: {
      id: 'private-double',
      name: 'Private Double Room',
      category: 'private',
      description: 'Private room for two people',
      features: ['Private bathroom', 'Double bed', 'TV', 'Free WiFi']
    },
    capacity: 2,
    basePrice: 85,
    amenities: ['AC', 'Private Bathroom', 'TV', 'Mini Fridge', 'Work Desk', 'Wardrobe'],
    images: ['/images/rooms/private-double.jpg'],
    description: 'Comfortable private room with double bed and ensuite bathroom.',
    bedConfiguration: '1 double bed',
    bathType: 'private',
    area: 15,
    isAccessible: true
  },
  {
    id: 'private-twin',
    name: 'Private Twin Room',
    type: {
      id: 'private-twin',
      name: 'Private Twin Room',
      category: 'private',
      description: 'Private room with two single beds',
      features: ['Private bathroom', 'Twin beds', 'TV', 'Free WiFi']
    },
    capacity: 2,
    basePrice: 80,
    amenities: ['AC', 'Private Bathroom', 'TV', 'Mini Fridge', 'Work Desk', 'Wardrobe'],
    images: ['/images/rooms/private-twin.jpg'],
    description: 'Private room with two single beds, perfect for friends traveling together.',
    bedConfiguration: '2 single beds',
    bathType: 'private',
    area: 16,
    isAccessible: true
  },
  {
    id: 'suite-deluxe',
    name: 'Deluxe Suite',
    type: {
      id: 'deluxe-suite',
      name: 'Deluxe Suite',
      category: 'suite',
      description: 'Luxury suite with separate living area',
      features: ['Private bathroom', 'Living area', 'Kitchenette', 'Premium amenities']
    },
    capacity: 3,
    basePrice: 150,
    amenities: ['AC', 'Private Bathroom', 'TV', 'Kitchenette', 'Living Area', 'Premium Bedding', 'Balcony'],
    images: ['/images/rooms/deluxe-suite.jpg'],
    description: 'Luxurious suite with separate living area, kitchenette, and premium amenities.',
    bedConfiguration: '1 queen bed + 1 sofa bed',
    bathType: 'private',
    area: 35,
    isAccessible: true
  }
]

class AvailabilityService {
  private cache = new Map<string, { data: AvailabilityResponse; timestamp: number }>()
  private readonly CACHE_TTL = 2 * 60 * 1000 // 2 minutes

  async checkAvailability(query: AvailabilityQuery): Promise<AvailabilityResponse> {
    const cacheKey = JSON.stringify(query)
    const cached = this.cache.get(cacheKey)
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.data
    }

    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 500))

    const results = await this.searchAvailableRooms(query)
    const alternatives = await this.findAlternatives(query, results)

    const response: AvailabilityResponse = {
      query,
      results,
      alternatives,
      totalResults: results.length,
      priceRange: this.calculatePriceRange(results),
      checkedAt: new Date().toISOString()
    }

    // Cache the response
    this.cache.set(cacheKey, { data: response, timestamp: Date.now() })
    
    return response
  }

  private async searchAvailableRooms(query: AvailabilityQuery): Promise<AvailableRoom[]> {
    const { checkInDate, checkOutDate, guests, roomTypes, priceRange, amenities, accessibility } = query
    
    let filteredRooms = MOCK_ROOMS

    // Filter by capacity
    filteredRooms = filteredRooms.filter(room => room.capacity >= guests)

    // Filter by room types
    if (roomTypes && roomTypes.length > 0) {
      filteredRooms = filteredRooms.filter(room => 
        roomTypes.includes(room.type.id) || 
        roomTypes.includes(room.type.category)
      )
    }

    // Filter by accessibility
    if (accessibility) {
      filteredRooms = filteredRooms.filter(room => room.isAccessible)
    }

    // Filter by amenities
    if (amenities && amenities.length > 0) {
      filteredRooms = filteredRooms.filter(room =>
        amenities.every(amenity => 
          room.amenities.some(roomAmenity => 
            roomAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      )
    }

    const availableRooms: AvailableRoom[] = []

    for (const room of filteredRooms) {
      const availability = await this.getRoomAvailability(room.id, checkInDate, checkOutDate)
      const totalPrice = this.calculateTotalPrice(room, checkInDate, checkOutDate, guests)
      const priceBreakdown = this.calculatePriceBreakdown(room, checkInDate, checkOutDate, guests)
      const restrictions = await this.getRoomRestrictions(room.id, checkInDate, checkOutDate)

      // Check if room is available for entire stay
      const isAvailable = availability.every(slot => slot.available > 0)
      
      if (isAvailable) {
        // Apply price range filter
        if (!priceRange || (totalPrice >= priceRange.min && totalPrice <= priceRange.max)) {
          const nights = this.calculateNights(checkInDate, checkOutDate)
          const minAvailable = Math.min(...availability.map(slot => slot.available))
          
          availableRooms.push({
            roomId: room.id,
            room,
            availability,
            totalPrice,
            priceBreakdown,
            restrictions,
            cancellationPolicy: this.getCancellationPolicy(room.type.category),
            available: minAvailable,
            averageNightlyRate: totalPrice / nights
          })
        }
      }
    }

    // Sort by price (lowest first)
    return availableRooms.sort((a, b) => a.totalPrice - b.totalPrice)
  }

  private async getRoomAvailability(roomId: string, checkIn: string, checkOut: string): Promise<AvailabilitySlot[]> {
    const slots: AvailabilitySlot[] = []
    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    
    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0]
      const room = MOCK_ROOMS.find(r => r.id === roomId)!
      
      // Simulate availability (in real app, this would query the database)
      const available = Math.floor(Math.random() * room.capacity) + 1
      const basePrice = this.getDynamicPrice(room.basePrice, date)
      
      slots.push({
        date: dateStr,
        available,
        total: room.capacity,
        price: basePrice,
        dynamicPrice: basePrice,
        priceBreakdown: this.calculateDailyPriceBreakdown(room, date),
        restrictions: this.getDailyRestrictions(date)
      })
    }
    
    return slots
  }

  private getDynamicPrice(basePrice: number, date: Date): number {
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isHighSeason = this.isHighSeason(date)
    
    let multiplier = 1
    if (isWeekend) multiplier += 0.2
    if (isHighSeason) multiplier += 0.3
    
    return Math.round(basePrice * multiplier)
  }

  private isHighSeason(date: Date): boolean {
    const month = date.getMonth()
    // Summer months (June, July, August) and winter holidays
    return month >= 5 && month <= 7 || month === 11 || month === 0
  }

  private calculateTotalPrice(room: Room, checkIn: string, checkOut: string, guests: number): number {
    const nights = this.calculateNights(checkIn, checkOut)
    const priceBreakdown = this.calculatePriceBreakdown(room, checkIn, checkOut, guests)
    return priceBreakdown.total * nights
  }

  private calculatePriceBreakdown(room: Room, checkIn: string, checkOut: string, guests: number): PriceBreakdown {
    const nights = this.calculateNights(checkIn, checkOut)
    const basePrice = room.basePrice
    
    // Calculate multipliers
    const seasonalMultiplier = this.getSeasonalMultiplier(checkIn, checkOut)
    const occupancyMultiplier = this.getOccupancyMultiplier(guests, room.capacity)
    const lengthOfStayDiscount = this.getLengthOfStayDiscount(nights)
    
    const adjustedPrice = basePrice * seasonalMultiplier * occupancyMultiplier * (1 - lengthOfStayDiscount)
    
    // Calculate fees
    const serviceFees = [
      { name: 'Cleaning Fee', amount: 15, type: 'fixed' as const, description: 'One-time cleaning fee', mandatory: true },
      { name: 'City Tax', amount: 3.50, type: 'fixed' as const, description: 'Per person per night', mandatory: true }
    ]
    
    const totalFees = serviceFees.reduce((sum, fee) => {
      return sum + (fee.type === 'fixed' ? fee.amount : adjustedPrice * (fee.amount / 100))
    }, 0)
    
    const taxes = Math.round((adjustedPrice + totalFees) * 0.15) // 15% tax
    const total = Math.round(adjustedPrice + totalFees + taxes)
    
    return {
      basePrice,
      seasonalMultiplier,
      occupancyMultiplier,
      lengthOfStayDiscount,
      taxes,
      fees: serviceFees,
      total
    }
  }

  private calculateDailyPriceBreakdown(room: Room, date: Date): PriceBreakdown {
    const basePrice = room.basePrice
    const seasonalMultiplier = this.isHighSeason(date) ? 1.3 : 1.0
    const occupancyMultiplier = 1.0 // Assume average occupancy for daily calculation
    const lengthOfStayDiscount = 0 // No discount for single day
    
    const adjustedPrice = basePrice * seasonalMultiplier
    const taxes = Math.round(adjustedPrice * 0.15)
    
    return {
      basePrice,
      seasonalMultiplier,
      occupancyMultiplier,
      lengthOfStayDiscount,
      taxes,
      fees: [],
      total: adjustedPrice + taxes
    }
  }

  private getSeasonalMultiplier(checkIn: string, checkOut: string): number {
    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    let totalMultiplier = 0
    let days = 0
    
    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      totalMultiplier += this.isHighSeason(date) ? 1.3 : 1.0
      days++
    }
    
    return totalMultiplier / days
  }

  private getOccupancyMultiplier(guests: number, capacity: number): number {
    const occupancyRate = guests / capacity
    if (occupancyRate >= 1) return 1.1 // Premium for full occupancy
    if (occupancyRate >= 0.75) return 1.05 // Slight premium for high occupancy
    return 1.0 // Base price for normal occupancy
  }

  private getLengthOfStayDiscount(nights: number): number {
    if (nights >= 30) return 0.25 // 25% discount for monthly stays
    if (nights >= 14) return 0.15 // 15% discount for 2+ week stays
    if (nights >= 7) return 0.10 // 10% discount for week+ stays
    if (nights >= 3) return 0.05 // 5% discount for 3+ night stays
    return 0 // No discount for short stays
  }

  private calculateNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  private async getRoomRestrictions(roomId: string, checkIn: string, checkOut: string): Promise<BookingRestriction[]> {
    const restrictions: BookingRestriction[] = []
    
    // Add minimum stay restrictions during high season
    const startDate = new Date(checkIn)
    if (this.isHighSeason(startDate)) {
      restrictions.push({
        type: 'minStay',
        value: 2,
        reason: 'Minimum 2-night stay during high season'
      })
    }
    
    // Add maximum stay for dormitories
    const room = MOCK_ROOMS.find(r => r.id === roomId)
    if (room?.type.category === 'dorm') {
      restrictions.push({
        type: 'maxStay',
        value: 30,
        reason: 'Maximum 30-night stay in dormitories'
      })
    }
    
    return restrictions
  }

  private getDailyRestrictions(date: Date): BookingRestriction[] {
    const restrictions: BookingRestriction[] = []
    
    // Add restrictions for specific dates (e.g., maintenance days)
    // This would be configured in a real system
    
    return restrictions
  }

  private getCancellationPolicy(roomCategory: string) {
    const policies = {
      dorm: {
        type: 'flexible' as const,
        description: 'Free cancellation up to 24 hours before check-in',
        deadlines: [
          { hoursBeforeCheckIn: 24, refundPercentage: 100 },
          { hoursBeforeCheckIn: 0, refundPercentage: 0 }
        ],
        refundRules: [
          { condition: 'Cancelled 24+ hours before', refundAmount: 100, processingDays: 3 },
          { condition: 'No-show or late cancellation', refundAmount: 0, processingDays: 0 }
        ]
      },
      private: {
        type: 'moderate' as const,
        description: 'Free cancellation up to 48 hours before check-in',
        deadlines: [
          { hoursBeforeCheckIn: 48, refundPercentage: 100 },
          { hoursBeforeCheckIn: 24, refundPercentage: 50 },
          { hoursBeforeCheckIn: 0, refundPercentage: 0 }
        ],
        refundRules: [
          { condition: 'Cancelled 48+ hours before', refundAmount: 100, processingDays: 5 },
          { condition: 'Cancelled 24-48 hours before', refundAmount: 50, processingDays: 5 },
          { condition: 'No-show or late cancellation', refundAmount: 0, processingDays: 0 }
        ]
      },
      suite: {
        type: 'strict' as const,
        description: 'Free cancellation up to 7 days before check-in',
        deadlines: [
          { hoursBeforeCheckIn: 168, refundPercentage: 100 }, // 7 days
          { hoursBeforeCheckIn: 72, refundPercentage: 50 },   // 3 days
          { hoursBeforeCheckIn: 0, refundPercentage: 0 }
        ],
        refundRules: [
          { condition: 'Cancelled 7+ days before', refundAmount: 100, processingDays: 7 },
          { condition: 'Cancelled 3-7 days before', refundAmount: 50, processingDays: 7 },
          { condition: 'No-show or late cancellation', refundAmount: 0, processingDays: 0 }
        ]
      }
    }
    
    return policies[roomCategory as keyof typeof policies] || policies.private
  }

  private calculatePriceRange(results: AvailableRoom[]): { min: number; max: number } {
    if (results.length === 0) return { min: 0, max: 0 }
    
    const prices = results.map(r => r.totalPrice)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }

  private async findAlternatives(query: AvailabilityQuery, results: AvailableRoom[]): Promise<AlternativeOption[]> {
    const alternatives: AlternativeOption[] = []
    
    // If no results found, suggest alternatives
    if (results.length === 0) {
      // Suggest different dates
      const dateAlternatives = await this.findDateAlternatives(query)
      if (dateAlternatives.length > 0) {
        alternatives.push({
          type: 'dates',
          suggestion: 'Try different dates',
          availableRooms: dateAlternatives,
          description: 'These dates have better availability'
        })
      }
      
      // Suggest different room types
      const roomTypeAlternatives = await this.findRoomTypeAlternatives(query)
      if (roomTypeAlternatives.length > 0) {
        alternatives.push({
          type: 'room-type',
          suggestion: 'Consider different room types',
          availableRooms: roomTypeAlternatives,
          description: 'Similar rooms that might meet your needs'
        })
      }
    }
    
    return alternatives
  }

  private async findDateAlternatives(query: AvailabilityQuery): Promise<AvailableRoom[]> {
    // Try dates 1-3 days before and after
    const alternatives: AvailableRoom[] = []
    const originalStart = new Date(query.checkInDate)
    const originalEnd = new Date(query.checkOutDate)
    const stayLength = this.calculateNights(query.checkInDate, query.checkOutDate)
    
    for (let offset = -3; offset <= 3; offset++) {
      if (offset === 0) continue // Skip original dates
      
      const newStart = new Date(originalStart)
      newStart.setDate(newStart.getDate() + offset)
      
      const newEnd = new Date(newStart)
      newEnd.setDate(newEnd.getDate() + stayLength)
      
      const alternativeQuery = {
        ...query,
        checkInDate: newStart.toISOString().split('T')[0],
        checkOutDate: newEnd.toISOString().split('T')[0]
      }
      
      try {
        const alternativeResults = await this.searchAvailableRooms(alternativeQuery)
        alternatives.push(...alternativeResults.slice(0, 2)) // Limit results
      } catch (error) {
        // Skip this alternative if it fails
      }
    }
    
    return alternatives
  }

  private async findRoomTypeAlternatives(query: AvailabilityQuery): Promise<AvailableRoom[]> {
    // Remove room type filter and search again
    const alternativeQuery = {
      ...query,
      roomTypes: undefined
    }
    
    try {
      return await this.searchAvailableRooms(alternativeQuery)
    } catch (error) {
      return []
    }
  }

  // Real-time availability updates (WebSocket simulation)
  subscribeToAvailabilityUpdates(callback: (update: any) => void): () => void {
    const interval = setInterval(() => {
      // Simulate real-time updates
      const update = {
        timestamp: new Date().toISOString(),
        roomId: MOCK_ROOMS[Math.floor(Math.random() * MOCK_ROOMS.length)].id,
        date: new Date().toISOString().split('T')[0],
        availabilityChange: Math.random() > 0.5 ? 1 : -1,
        priceChange: (Math.random() - 0.5) * 10
      }
      
      callback(update)
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }

  // Clear cache (useful for testing or forced refreshes)
  clearCache(): void {
    this.cache.clear()
  }
}

export const availabilityService = new AvailabilityService()
export default availabilityService