import PageHero from '@/components/PageHero'
import Testimonials from '@/components/Testimonials'
import BookingWidget from '@/components/BookingWidget'
import CTA from '@/components/CTA'
import { Heart, Users, Shield } from 'lucide-react'

export const metadata = {
  title: 'About Leo PVT Hostel',
  description: 'Learn about Leo PVT Hostel Montreal - our story, mission, and commitment to providing exceptional accommodation for travelers from around the world.',
}

function AboutSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Leo PVT Hostel was born from a passion for travel and a deep love for Montreal. 
              We understand what travelers need because we are travelers ourselves.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Your Montreal Home</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Since opening our doors, we've welcomed thousands of travelers from over 50 countries. 
                Our mission is simple: provide safe, comfortable, and affordable accommodation while 
                creating connections that last a lifetime.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Located in the heart of downtown Montreal, we're perfectly positioned to help you 
                explore everything this incredible city has to offer - from the historic Old Port 
                to the vibrant Plateau Mont-Royal.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <Users className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Community First</h4>
                <p className="text-gray-600">Building connections between travelers from around the world.</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <Shield className="w-8 h-8 text-green-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Safety & Security</h4>
                <p className="text-gray-600">24/7 security and safe environment for all our guests.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <Heart className="w-8 h-8 text-purple-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Local Experience</h4>
                <p className="text-gray-600">Insider tips and recommendations from Montreal locals.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Leo PVT Hostel?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Happy Guests</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Leo PVT Hostel"
        subtitle="Your Home in Montreal"
        description="More than just accommodation - we're a community of travelers creating unforgettable experiences in the heart of Montreal."
        backgroundImage="/images/about/hostel-community.jpg"
        ctaPrimary={{
          text: "Join Our Community",
          href: "#booking-widget",
          showIcon: true
        }}
        ctaSecondary={{
          text: "Read Reviews",
          href: "#testimonials",
          showIcon: true
        }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" }
        ]}
        stats={[
          { value: "2019", label: "Established" },
          { value: "50+", label: "Countries" },
          { value: "24/7", label: "Reception" }
        ]}
      />
      
      <div id="main-content">
        <AboutSection />
        <div id="testimonials">
          <Testimonials />
        </div>
        <BookingWidget />
        <CTA />
      </div>
    </>
  )
}