export interface Room {
  id: string
  name: string
  type: RoomType
  capacity: number
  basePrice: number
  amenities: string[]
  images: string[]
  description: string
  bedConfiguration: string
  bathType: 'shared' | 'private'
  area?: number
  isAccessible: boolean
}

export interface RoomType {
  id: string
  name: string
  category: 'dorm' | 'private' | 'suite'
  gender?: 'male' | 'female' | 'mixed'
  description: string
  features: string[]
}

export interface AvailabilitySlot {
  date: string
  available: number
  total: number
  price: number
  dynamicPrice: number
  priceBreakdown: PriceBreakdown
  restrictions?: BookingRestriction[]
}

export interface PriceBreakdown {
  basePrice: number
  seasonalMultiplier: number
  occupancyMultiplier: number
  lengthOfStayDiscount: number
  groupDiscount?: number
  taxes: number
  fees: ServiceFee[]
  total: number
}

export interface ServiceFee {
  name: string
  amount: number
  type: 'fixed' | 'percentage'
  description: string
  mandatory: boolean
}

export interface BookingRestriction {
  type: 'minStay' | 'maxStay' | 'closedForArrival' | 'closedForDeparture'
  value?: number
  reason?: string
}

export interface GuestInfo {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  nationality: string
  passportNumber?: string
  dietaryRequirements?: string[]
  specialRequests?: string
  emergencyContact?: EmergencyContact
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface BookingRequest {
  checkInDate: string
  checkOutDate: string
  roomId: string
  guests: GuestInfo[]
  primaryGuest: string // guest ID
  specialRequests?: string
  addOns?: BookingAddOn[]
  promocode?: string
  groupBooking?: GroupBookingDetails
  extendedStay?: ExtendedStayDetails
}

export interface GroupBookingDetails {
  isGroup: boolean
  groupName?: string
  groupSize: number
  roomRequirements: GroupRoomRequirement[]
  groupLeader: string // guest ID
  specialNeeds?: string
  eventType?: string
}

export interface GroupRoomRequirement {
  roomType: string
  quantity: number
  guestCount: number
  preferences?: string[]
}

export interface ExtendedStayDetails {
  isExtended: boolean
  minimumStay?: number
  discountApplied: number
  paymentSchedule?: PaymentSchedule
  checkInFlexibility?: boolean
  checkOutFlexibility?: boolean
}

export interface PaymentSchedule {
  type: 'weekly' | 'monthly' | 'upfront' | 'split'
  installments: PaymentInstallment[]
}

export interface PaymentInstallment {
  amount: number
  dueDate: string
  description: string
  status: 'pending' | 'paid' | 'overdue'
}

export interface BookingAddOn {
  id: string
  name: string
  price: number
  quantity: number
  category: 'service' | 'amenity' | 'food' | 'transport'
  description: string
  availableDates?: string[]
}

export interface Booking {
  id: string
  reference: string
  status: BookingStatus
  request: BookingRequest
  confirmation?: BookingConfirmation
  payments: PaymentRecord[]
  modifications: BookingModification[]
  checkin?: CheckInRecord
  checkout?: CheckOutRecord
  createdAt: string
  updatedAt: string
  
  // Convenience accessors from request
  checkInDate: string
  checkOutDate: string
  roomId: string
  guests: GuestInfo[]
}

export interface BookingConfirmation {
  confirmedAt: string
  totalAmount: number
  priceBreakdown: PriceBreakdown
  roomAssignments: RoomAssignment[]
  checkInInstructions: string
  cancellationPolicy: CancellationPolicy
  confirmationNumber: string
}

export interface RoomAssignment {
  guestId: string
  roomId: string
  bedNumber?: string
  checkInDate: string
  checkOutDate: string
  keyCode?: string
}

export interface CancellationPolicy {
  type: 'flexible' | 'moderate' | 'strict' | 'non-refundable'
  description: string
  deadlines: CancellationDeadline[]
  refundRules: RefundRule[]
}

export interface CancellationDeadline {
  hoursBeforeCheckIn: number
  refundPercentage: number
  penaltyAmount?: number
}

export interface RefundRule {
  condition: string
  refundAmount: number
  processingDays: number
}

export interface PaymentRecord {
  id: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  processedAt?: string
  refundedAmount?: number
  notes?: string
}

export interface BookingModification {
  id: string
  type: ModificationType
  requestedAt: string
  processedAt?: string
  status: 'pending' | 'approved' | 'rejected'
  changes: ModificationChange[]
  additionalCosts?: number
  refundAmount?: number
  notes?: string
}

export interface ModificationChange {
  field: string
  oldValue: any
  newValue: any
  impact: string
}

export interface CheckInRecord {
  processedAt: string
  processedBy: string
  method: 'automatic' | 'front-desk' | 'self-service'
  roomKeys: RoomKey[]
  documentsVerified: boolean
  depositsCollected: PaymentRecord[]
  welcomePackage?: WelcomePackage
  issues?: CheckInIssue[]
}

export interface RoomKey {
  type: 'physical' | 'digital'
  keyId: string
  accessCode?: string
  validFrom: string
  validTo: string
  permissions: string[]
}

export interface WelcomePackage {
  items: WelcomeItem[]
  deliveredAt: string
  digitalContent: DigitalWelcomeContent
}

export interface WelcomeItem {
  name: string
  description: string
  category: 'amenity' | 'information' | 'gift'
}

export interface DigitalWelcomeContent {
  wifiCredentials: WifiCredentials
  hostelMap: string
  localGuide: LocalGuide
  emergencyContacts: EmergencyContactInfo[]
  houseRules: string
}

export interface WifiCredentials {
  networkName: string
  password: string
  instructions?: string
}

export interface LocalGuide {
  attractions: LocalAttraction[]
  restaurants: LocalRestaurant[]
  transportation: TransportationInfo[]
  emergencyServices: EmergencyService[]
}

export interface LocalAttraction {
  name: string
  description: string
  address: string
  openingHours: string
  admissionPrice?: number
  category: string
  distanceFromHostel: number
  walkingTime: number
}

export interface LocalRestaurant {
  name: string
  cuisine: string
  priceRange: string
  address: string
  openingHours: string
  specialties: string[]
  distanceFromHostel: number
}

export interface TransportationInfo {
  type: 'metro' | 'bus' | 'taxi' | 'bike' | 'walking'
  description: string
  nearestStation?: string
  cost?: string
  scheduleInfo?: string
}

export interface EmergencyService {
  type: 'medical' | 'police' | 'fire' | 'embassy'
  name: string
  phone: string
  address: string
  availability: string
}

export interface EmergencyContactInfo {
  type: 'hostel' | 'medical' | 'police' | 'embassy'
  name: string
  phone: string
  email?: string
  availability: string
}

export interface CheckInIssue {
  type: 'payment' | 'documentation' | 'room-availability' | 'system'
  description: string
  resolution?: string
  resolvedAt?: string
}

export interface CheckOutRecord {
  processedAt: string
  processedBy: string
  method: 'automatic' | 'front-desk' | 'express'
  roomInspection: RoomInspectionResult
  finalCharges: PaymentRecord[]
  depositsReturned: PaymentRecord[]
  feedbackProvided?: GuestFeedback
  leftBehindItems?: LeftBehindItem[]
}

export interface RoomInspectionResult {
  inspectedAt: string
  inspectedBy: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  damages: RoomDamage[]
  cleaningRequired: boolean
  maintenanceRequired: boolean
  notes?: string
}

export interface RoomDamage {
  type: string
  description: string
  severity: 'minor' | 'moderate' | 'major'
  repairCost?: number
  chargedToGuest?: boolean
}

export interface GuestFeedback {
  overallRating: number
  cleanliness: number
  staff: number
  location: number
  value: number
  amenities: number
  comments?: string
  recommendations?: string
  wouldRecommend: boolean
  submittedAt: string
}

export interface LeftBehindItem {
  description: string
  location: string
  foundBy: string
  foundAt: string
  claimed: boolean
  claimedAt?: string
  disposalDate?: string
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'checked-out'
  | 'cancelled'
  | 'payment-failed'
  | 'no-show'
  | 'modified'

export type PaymentMethod = 
  | 'credit-card'
  | 'debit-card'
  | 'paypal'
  | 'bank-transfer'
  | 'cash'
  | 'crypto'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled'
  | 'partially-refunded'

export type ModificationType = 
  | 'date-change'
  | 'room-change'
  | 'guest-change'
  | 'add-services'
  | 'remove-services'
  | 'cancellation'

export interface AvailabilityQuery {
  checkInDate: string
  checkOutDate: string
  guests: number
  roomTypes?: string[]
  priceRange?: {
    min: number
    max: number
  }
  amenities?: string[]
  accessibility?: boolean
}

export interface AvailabilityResponse {
  query: AvailabilityQuery
  results: AvailableRoom[]
  alternatives?: AlternativeOption[]
  totalResults: number
  priceRange: {
    min: number
    max: number
  }
  checkedAt: string
}

export interface AvailableRoom {
  roomId: string
  room: Room
  availability: AvailabilitySlot[]
  totalPrice: number
  priceBreakdown: PriceBreakdown
  restrictions: BookingRestriction[]
  cancellationPolicy: CancellationPolicy
  available: number
  averageNightlyRate: number
}

export interface AlternativeOption {
  type: 'dates' | 'room-type' | 'guest-count'
  suggestion: string
  availableRooms: AvailableRoom[]
  description: string
}

// Utility types for form handling
export interface BookingFormData {
  dates: {
    checkIn: string
    checkOut: string
  }
  guests: {
    adults: number
    children: number
    infants: number
  }
  roomPreferences: {
    type: string
    amenities: string[]
    accessibility: boolean
  }
  contact: {
    email: string
    phone: string
    preferredLanguage: string
  }
  specialRequests?: string
}

export interface BookingValidation {
  isValid: boolean
  errors: BookingError[]
  warnings: BookingWarning[]
}

export interface BookingError {
  field: string
  message: string
  code: string
}

export interface BookingWarning {
  field: string
  message: string
  code: string
  dismissible: boolean
}