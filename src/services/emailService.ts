import type { Booking, GuestInfo } from '@/types/booking'

interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent: string
}

interface EmailRequest {
  to: string
  subject: string
  htmlContent: string
  textContent?: string
  attachments?: EmailAttachment[]
}

interface EmailAttachment {
  filename: string
  content: string
  contentType: string
}

interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

class EmailService {
  private apiKey: string
  private senderEmail: string
  private senderName: string

  constructor() {
    // In production, these would come from environment variables
    this.apiKey = process.env.SENDGRID_API_KEY || process.env.MAILGUN_API_KEY || ''
    this.senderEmail = process.env.EMAIL_FROM || 'noreply@leo.pvthostel.com'
    this.senderName = process.env.EMAIL_FROM_NAME || 'Leo PVT Hostel'
  }

  // Send booking confirmation email
  async sendBookingConfirmation(booking: Booking): Promise<EmailResponse> {
    const primaryGuest = booking.guests[0]
    if (!primaryGuest?.email) {
      return { success: false, error: 'No primary guest email found' }
    }

    const template = this.generateBookingConfirmationTemplate(booking, primaryGuest)
    
    const emailRequest: EmailRequest = {
      to: primaryGuest.email,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent
    }

    return await this.sendEmail(emailRequest)
  }

  // Send booking modification email
  async sendBookingModification(booking: Booking, modificationType: string): Promise<EmailResponse> {
    const primaryGuest = booking.guests[0]
    if (!primaryGuest?.email) {
      return { success: false, error: 'No primary guest email found' }
    }

    const template = this.generateModificationTemplate(booking, primaryGuest, modificationType)
    
    const emailRequest: EmailRequest = {
      to: primaryGuest.email,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent
    }

    return await this.sendEmail(emailRequest)
  }

  // Send cancellation confirmation
  async sendCancellationConfirmation(booking: Booking): Promise<EmailResponse> {
    const primaryGuest = booking.guests[0]
    if (!primaryGuest?.email) {
      return { success: false, error: 'No primary guest email found' }
    }

    const template = this.generateCancellationTemplate(booking, primaryGuest)
    
    const emailRequest: EmailRequest = {
      to: primaryGuest.email,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent
    }

    return await this.sendEmail(emailRequest)
  }

  // Send pre-arrival email (24-48 hours before check-in)
  async sendPreArrivalEmail(booking: Booking): Promise<EmailResponse> {
    const primaryGuest = booking.guests[0]
    if (!primaryGuest?.email) {
      return { success: false, error: 'No primary guest email found' }
    }

    const template = this.generatePreArrivalTemplate(booking, primaryGuest)
    
    const emailRequest: EmailRequest = {
      to: primaryGuest.email,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent
    }

    return await this.sendEmail(emailRequest)
  }

  // Send check-out follow-up email
  async sendCheckOutFollowUp(booking: Booking): Promise<EmailResponse> {
    const primaryGuest = booking.guests[0]
    if (!primaryGuest?.email) {
      return { success: false, error: 'No primary guest email found' }
    }

    const template = this.generateCheckOutFollowUpTemplate(booking, primaryGuest)
    
    const emailRequest: EmailRequest = {
      to: primaryGuest.email,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent
    }

    return await this.sendEmail(emailRequest)
  }

  // Generic email sending method
  private async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    try {
      // For demo purposes, we'll simulate email sending
      console.log('📧 Sending email:', {
        to: request.to,
        subject: request.subject,
        content: request.textContent?.substring(0, 100) + '...'
      })

      // Simulate API call delay
      await this.delay(1000)

      // In production, integrate with email service:
      // - SendGrid: https://sendgrid.com/docs/api-reference/
      // - Mailgun: https://documentation.mailgun.com/en/latest/api_reference.html
      // - AWS SES: https://docs.aws.amazon.com/ses/
      // - Postmark: https://postmarkapp.com/developer

      // Simulate successful send
      return {
        success: true,
        messageId: `msg_${this.generateId()}`
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email sending failed'
      }
    }
  }

  // Template generators
  private generateBookingConfirmationTemplate(booking: Booking, guest: GuestInfo): EmailTemplate {
    const checkInDate = new Date(booking.checkInDate).toLocaleDateString('en-CA', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    })
    const checkOutDate = new Date(booking.checkOutDate).toLocaleDateString('en-CA', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    })
    const confirmationNumber = booking.confirmation?.confirmationNumber || booking.id

    const subject = `Booking Confirmed - Leo PVT Hostel Montreal | ${confirmationNumber}`

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #374151; color: white; padding: 20px; text-align: center; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        .important { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏨 Booking Confirmed!</h1>
            <p>Welcome to Leo PVT Hostel Montreal</p>
        </div>
        
        <div class="content">
            <h2>Hi ${guest.firstName}!</h2>
            <p>Great news! Your booking has been confirmed. We're excited to welcome you to Montreal!</p>
            
            <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
                <p><strong>Check-in:</strong> ${checkInDate} at 3:00 PM</p>
                <p><strong>Check-out:</strong> ${checkOutDate} by 11:00 AM</p>
                <p><strong>Room:</strong> ${booking.roomId}</p>
                <p><strong>Guests:</strong> ${booking.guests.length}</p>
                <p><strong>Total Amount:</strong> $${booking.confirmation?.totalAmount || 0}</p>
            </div>

            <div class="important">
                <h4>🎯 Important Information</h4>
                <ul>
                    <li><strong>Address:</strong> 123 Rue Saint-Laurent, Montreal, QC H2X 2T1</li>
                    <li><strong>Check-in:</strong> Available 24/7 at reception</li>
                    <li><strong>WiFi:</strong> Free high-speed internet throughout the hostel</li>
                    <li><strong>Breakfast:</strong> Complimentary continental breakfast 7-10 AM</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://leo.pvthostel.com/check-in" class="btn">Complete Online Check-in</a>
            </div>

            <h3>🗺️ Getting Here</h3>
            <p><strong>From Montreal Airport:</strong> Take the 747 bus to Berri-UQAM metro station, then metro to Place-des-Arts (5 min walk)</p>
            <p><strong>From Train/Bus Station:</strong> Metro to Place-des-Arts station (3 min walk)</p>

            <h3>📞 Need Help?</h3>
            <p>Our reception is open 24/7. Contact us at:</p>
            <p>📱 Phone: +1 (514) 123-4567</p>
            <p>📧 Email: info@leo.pvthostel.com</p>
        </div>

        <div class="footer">
            <p>Looking forward to hosting you in Montreal!</p>
            <p>🍁 Leo PVT Hostel Team</p>
        </div>
    </div>
</body>
</html>`

    const textContent = `
Booking Confirmed - Leo PVT Hostel Montreal

Hi ${guest.firstName}!

Your booking has been confirmed. Here are your details:

Confirmation Number: ${confirmationNumber}
Check-in: ${checkInDate} at 3:00 PM
Check-out: ${checkOutDate} by 11:00 AM
Room: ${booking.roomId}
Guests: ${booking.guests.length}

Address: 123 Rue Saint-Laurent, Montreal, QC H2X 2T1
Phone: +1 (514) 123-4567
Email: info@leo.pvthostel.com

Looking forward to welcoming you to Montreal!

Leo PVT Hostel Team
`

    return { subject, htmlContent, textContent }
  }

  private generateModificationTemplate(booking: Booking, guest: GuestInfo, modificationType: string): EmailTemplate {
    const subject = `Booking Modified - Leo PVT Hostel | ${booking.confirmation?.confirmationNumber}`

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Modified</title>
</head>
<body>
    <h1>Booking Modified</h1>
    <p>Hi ${guest.firstName},</p>
    <p>Your booking has been successfully modified (${modificationType}).</p>
    <p>Confirmation Number: ${booking.confirmation?.confirmationNumber}</p>
    <p>If you have any questions, please contact us at info@leo.pvthostel.com</p>
</body>
</html>`

    const textContent = `Your booking has been modified. Confirmation: ${booking.confirmation?.confirmationNumber}`

    return { subject, htmlContent, textContent }
  }

  private generateCancellationTemplate(booking: Booking, guest: GuestInfo): EmailTemplate {
    const subject = `Booking Cancelled - Leo PVT Hostel | ${booking.confirmation?.confirmationNumber}`

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Cancelled</title>
</head>
<body>
    <h1>Booking Cancelled</h1>
    <p>Hi ${guest.firstName},</p>
    <p>Your booking has been successfully cancelled.</p>
    <p>Confirmation Number: ${booking.confirmation?.confirmationNumber}</p>
    <p>We hope to welcome you to Montreal in the future!</p>
</body>
</html>`

    const textContent = `Your booking has been cancelled. Confirmation: ${booking.confirmation?.confirmationNumber}`

    return { subject, htmlContent, textContent }
  }

  private generatePreArrivalTemplate(booking: Booking, guest: GuestInfo): EmailTemplate {
    const subject = `Almost here! Check-in info for tomorrow - Leo PVT Hostel`

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pre-Arrival Information</title>
</head>
<body>
    <h1>Almost here!</h1>
    <p>Hi ${guest.firstName},</p>
    <p>We're excited to welcome you tomorrow! Here's everything you need to know for a smooth check-in.</p>
    <p>Check-in time: 3:00 PM</p>
    <p>Address: 123 Rue Saint-Laurent, Montreal, QC H2X 2T1</p>
</body>
</html>`

    const textContent = `Almost here! Check-in tomorrow at 3:00 PM at 123 Rue Saint-Laurent, Montreal.`

    return { subject, htmlContent, textContent }
  }

  private generateCheckOutFollowUpTemplate(booking: Booking, guest: GuestInfo): EmailTemplate {
    const subject = `Thanks for staying with us! - Leo PVT Hostel`

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Thank You</title>
</head>
<body>
    <h1>Thank you for staying with us!</h1>
    <p>Hi ${guest.firstName},</p>
    <p>We hope you enjoyed your stay in Montreal. Please consider leaving us a review!</p>
    <p>We'd love to welcome you back anytime.</p>
</body>
</html>`

    const textContent = `Thank you for staying with us! We hope you enjoyed Montreal and would love to welcome you back.`

    return { subject, htmlContent, textContent }
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Schedule emails (for pre-arrival, follow-up, etc.)
  async scheduleEmail(booking: Booking, emailType: 'pre-arrival' | 'check-out-follow-up', scheduleDate: Date): Promise<void> {
    // In production, use a job queue like Bull or agenda.js
    console.log(`📅 Scheduled ${emailType} email for ${scheduleDate.toISOString()}`)
    
    // For demo, we'll just log the scheduling
    setTimeout(async () => {
      if (emailType === 'pre-arrival') {
        await this.sendPreArrivalEmail(booking)
      } else if (emailType === 'check-out-follow-up') {
        await this.sendCheckOutFollowUp(booking)
      }
    }, Math.max(0, scheduleDate.getTime() - Date.now()))
  }
}

export default new EmailService()