import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative py-20 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500 rounded-full filter blur-[128px] opacity-30" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full filter blur-[128px] opacity-20" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
            Ready for Your Montreal Adventure?
          </h2>
          
          {/* Subheading */}
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Book now and save 10% on stays of 3 nights or more. Experience the best of Montreal with Leo PVT Hostel as your home base.
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center text-white">
              <svg className="h-5 w-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free Cancellation</span>
            </div>
            <div className="flex items-center text-white">
              <svg className="h-5 w-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Best Price Guarantee</span>
            </div>
            <div className="flex items-center text-white">
              <svg className="h-5 w-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Instant Confirmation</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-700 bg-white hover:bg-gray-100 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book Your Stay Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-all duration-200 border border-white/30"
            >
              Contact Us
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-primary-100 mb-4">Trusted by travelers from around the world</p>
            <div className="flex justify-center items-center space-x-8">
              <div className="text-white">
                <p className="text-2xl font-bold">10,000+</p>
                <p className="text-sm text-primary-200">Happy Guests</p>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="text-white">
                <p className="text-2xl font-bold">4.8/5</p>
                <p className="text-sm text-primary-200">Average Rating</p>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="text-white">
                <p className="text-2xl font-bold">50+</p>
                <p className="text-sm text-primary-200">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}