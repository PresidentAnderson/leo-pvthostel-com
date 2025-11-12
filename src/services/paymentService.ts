import type { 
  PaymentMethod, 
  PaymentRecord, 
  PaymentStatus,
  Booking 
} from '@/types/booking'

interface PaymentRequest {
  amount: number
  currency: string
  method: PaymentMethod
  bookingId: string
  customerEmail: string
  customerName: string
  description: string
}

interface PaymentResponse {
  success: boolean
  paymentId: string
  status: PaymentStatus
  message?: string
  transactionId?: string
  receiptUrl?: string
}

interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
}

class PaymentService {
  private isStripeLoaded = false
  private stripe: any = null

  // In production, these would come from environment variables
  private config: StripeConfig = {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_...',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...'
  }

  // Initialize Stripe (client-side)
  async initializeStripe() {
    if (typeof window === 'undefined') return null

    if (!this.isStripeLoaded) {
      // In production, load Stripe dynamically
      // const stripeLib = await import('@stripe/stripe-js')
      // this.stripe = await stripeLib.loadStripe(this.config.publishableKey)
      
      // For demo purposes, we'll simulate Stripe
      this.stripe = {
        createPaymentMethod: this.mockCreatePaymentMethod.bind(this),
        confirmCardPayment: this.mockConfirmCardPayment.bind(this)
      }
      this.isStripeLoaded = true
    }

    return this.stripe
  }

  // Mock Stripe methods for demonstration
  private async mockCreatePaymentMethod(options: any): Promise<any> {
    await this.delay(1000) // Simulate API call
    
    return {
      paymentMethod: {
        id: `pm_${this.generateId()}`,
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242'
        }
      },
      error: null
    }
  }

  private async mockConfirmCardPayment(clientSecret: string, paymentMethod: any): Promise<any> {
    await this.delay(2000) // Simulate processing time
    
    // Simulate success/failure (90% success rate)
    const success = Math.random() > 0.1
    
    if (success) {
      return {
        paymentIntent: {
          id: `pi_${this.generateId()}`,
          status: 'succeeded',
          amount: 5000, // $50.00 in cents
          currency: 'cad',
          receipt_url: `https://dashboard.stripe.com/receipts/${this.generateId()}`
        },
        error: null
      }
    } else {
      return {
        paymentIntent: null,
        error: {
          type: 'card_error',
          code: 'card_declined',
          message: 'Your card was declined. Please try a different payment method.'
        }
      }
    }
  }

  // Process payment (main entry point)
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Initialize Stripe
      const stripe = await this.initializeStripe()
      if (!stripe) {
        throw new Error('Payment processor not available')
      }

      // Create payment intent on server (simulated)
      const paymentIntent = await this.createPaymentIntent(request)
      
      // For demo purposes, we'll simulate a successful payment
      if (request.method === 'credit-card') {
        return await this.processCreditCardPayment(request, paymentIntent)
      }

      throw new Error(`Payment method ${request.method} not supported`)
    } catch (error) {
      console.error('Payment processing failed:', error)
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment processing failed'
      }
    }
  }

  // Create payment intent (server-side simulation)
  private async createPaymentIntent(request: PaymentRequest): Promise<any> {
    await this.delay(500)
    
    return {
      id: `pi_${this.generateId()}`,
      client_secret: `pi_${this.generateId()}_secret_${this.generateId()}`,
      amount: Math.round(request.amount * 100), // Convert to cents
      currency: request.currency.toLowerCase(),
      status: 'requires_payment_method'
    }
  }

  // Process credit card payment
  private async processCreditCardPayment(
    request: PaymentRequest, 
    paymentIntent: any
  ): Promise<PaymentResponse> {
    try {
      // Simulate creating a payment method
      const { paymentMethod, error: pmError } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        },
        billing_details: {
          name: request.customerName,
          email: request.customerEmail
        }
      })

      if (pmError) {
        throw new Error(pmError.message)
      }

      // Confirm the payment
      const { paymentIntent: confirmedPI, error: confirmError } = 
        await this.stripe.confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethod.id
        })

      if (confirmError) {
        throw new Error(confirmError.message)
      }

      if (confirmedPI.status === 'succeeded') {
        return {
          success: true,
          paymentId: confirmedPI.id,
          status: 'completed',
          transactionId: confirmedPI.id,
          receiptUrl: confirmedPI.receipt_url,
          message: 'Payment successful'
        }
      } else {
        throw new Error(`Payment status: ${confirmedPI.status}`)
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Credit card payment failed'
      }
    }
  }

  // Refund payment
  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResponse> {
    await this.delay(1000)
    
    // Simulate refund processing
    return {
      success: true,
      paymentId: `rf_${this.generateId()}`,
      status: 'completed',
      message: `Refund of ${amount ? `$${amount}` : 'full amount'} processed successfully`
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    await this.delay(300)
    
    // Simulate status check
    const statuses: PaymentStatus[] = ['completed', 'pending', 'failed', 'cancelled']
    return statuses[0] // Most payments succeed
  }

  // Process booking payment (specific to hostel bookings)
  async processBookingPayment(booking: Booking, paymentMethod: PaymentMethod): Promise<PaymentResponse> {
    const depositAmount = booking.confirmation?.totalAmount 
      ? Math.round(booking.confirmation.totalAmount * 0.2) // 20% deposit
      : 0

    const paymentRequest: PaymentRequest = {
      amount: depositAmount,
      currency: 'CAD',
      method: paymentMethod,
      bookingId: booking.id,
      customerEmail: booking.guests[0]?.email || '',
      customerName: `${booking.guests[0]?.firstName} ${booking.guests[0]?.lastName}`,
      description: `Booking deposit for ${booking.roomId} - Confirmation #${booking.confirmation?.confirmationNumber}`
    }

    return await this.processPayment(paymentRequest)
  }

  // Webhook handler for payment updates
  async handleWebhook(payload: string, signature: string): Promise<void> {
    // In production, verify webhook signature
    // const event = stripe.webhooks.constructEvent(payload, signature, this.config.webhookSecret)
    
    // Handle different event types
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     await this.handlePaymentSuccess(event.data.object)
    //     break
    //   case 'payment_intent.payment_failed':
    //     await this.handlePaymentFailure(event.data.object)
    //     break
    // }
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Calculate fees and taxes
  calculateBookingFees(subtotal: number): {
    subtotal: number
    taxes: number
    processingFee: number
    total: number
  } {
    const taxes = Math.round(subtotal * 0.15) // 15% tax (Quebec HST + GST)
    const processingFee = 5 // $5 processing fee
    const total = subtotal + taxes + processingFee

    return {
      subtotal,
      taxes,
      processingFee,
      total
    }
  }

  // Validate credit card (basic client-side validation)
  validateCreditCard(cardNumber: string): {
    isValid: boolean
    cardType?: string
    message?: string
  } {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '')
    
    // Basic length check
    if (cleaned.length < 13 || cleaned.length > 19) {
      return { isValid: false, message: 'Invalid card number length' }
    }
    
    // Luhn algorithm check
    if (!this.luhnCheck(cleaned)) {
      return { isValid: false, message: 'Invalid card number' }
    }
    
    // Determine card type
    const cardType = this.getCardType(cleaned)
    
    return { isValid: true, cardType }
  }

  private luhnCheck(cardNumber: string): boolean {
    let sum = 0
    let alternate = false
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i))
      
      if (alternate) {
        digit *= 2
        if (digit > 9) {
          digit = (digit % 10) + 1
        }
      }
      
      sum += digit
      alternate = !alternate
    }
    
    return sum % 10 === 0
  }

  private getCardType(cardNumber: string): string {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/
    }
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return type
      }
    }
    
    return 'unknown'
  }
}

export default new PaymentService()