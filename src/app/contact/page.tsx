import PageHero from '@/components/PageHero'
import BookingWidget from '@/components/BookingWidget'
import CTA from '@/components/CTA'
import { ContactPageCTASection } from '@/components/CTASection'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Contact Leo PVT Hostel',
  description: 'Get in touch with Leo PVT Hostel Montreal. Find our contact information, location details, and book your stay directly with us.',
}

function ContactSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Have questions about your stay? Need assistance with booking? Our friendly team 
              is here to help you 24/7. We speak English and French!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">
                      123 Rue Saint-Laurent<br />
                      Montreal, QC H2X 2T1<br />
                      Canada
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">
                      <a href="tel:+15141234567" className="hover:text-green-600 transition-colors">
                        +1 (514) 123-4567
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">
                      <a href="mailto:info@leo.pvthostel.com" className="hover:text-purple-600 transition-colors">
                        info@leo.pvthostel.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Reception Hours</h4>
                    <p className="text-gray-600">
                      24/7 - We're always here for you!
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href="tel:+15141234567"
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                  <a 
                    href="mailto:info@leo.pvthostel.com"
                    className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="general">General Question</option>
                    <option value="support">Support Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="group">Group Booking</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Find Us</h3>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map would be integrated here</p>
                <p className="text-sm text-gray-500 mt-2">
                  123 Rue Saint-Laurent, Montreal, QC H2X 2T1
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We're Here to Help"
        description="Have questions? Need assistance? Our friendly team is available 24/7 to help make your Montreal experience unforgettable."
        backgroundImage="/images/contact/montreal-skyline.jpg"
        ctaPrimary={{
          text: "Book Direct",
          href: "#booking-widget",
          showIcon: true
        }}
        ctaSecondary={{
          text: "Call Now",
          href: "tel:+15141234567",
          showIcon: true
        }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" }
        ]}
        stats={[
          { value: "24/7", label: "Support" },
          { value: "2", label: "Languages" },
          { value: "<1hr", label: "Response Time" }
        ]}
        showBookingPrompt={false}
      />
      
      <div id="main-content">
        <ContactSection />
        <ContactPageCTASection />
        <BookingWidget />
        <CTA />
      </div>
    </>
  )
}