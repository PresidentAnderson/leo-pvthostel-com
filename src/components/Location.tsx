'use client'

import { MapPin, Train, Bus, Plane, Clock } from 'lucide-react'

const nearbyAttractions = [
  { name: 'Old Montreal', distance: '10 min walk', type: 'Historic District' },
  { name: 'Notre-Dame Basilica', distance: '12 min walk', type: 'Landmark' },
  { name: 'Montreal Museum of Fine Arts', distance: '15 min walk', type: 'Museum' },
  { name: 'Mount Royal Park', distance: '20 min walk', type: 'Park' },
  { name: 'Jean-Talon Market', distance: '15 min metro', type: 'Market' },
  { name: 'Olympic Stadium', distance: '25 min metro', type: 'Sports Venue' },
]

const transportation = [
  { icon: Train, name: 'Metro Station', info: '2 min walk to Place-des-Arts' },
  { icon: Bus, name: 'Bus Stop', info: 'Multiple lines at your doorstep' },
  { icon: Plane, name: 'Airport', info: '30 min by public transport' },
  { icon: Clock, name: 'Downtown', info: 'You\'re already here!' },
]

export default function Location() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Perfect Location in Downtown Montreal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay in the heart of the city with easy access to all major attractions and transportation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200 relative">
              {/* Replace with actual map integration */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.0834653595!2d-73.56951!3d45.50689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a4d840dc5e1%3A0x7e4b0b3b6f42e5c!2sDowntown%20Montreal!5e0!3m2!1sen!2sca!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Leo PVT Hostel</p>
                    <p className="text-sm text-gray-600">123 Rue Example, Montreal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Transportation */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                Getting Around
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {transportation.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.info}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Nearby Attractions */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                Explore Nearby
              </h3>
              <div className="space-y-3">
                {nearbyAttractions.map((attraction, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{attraction.name}</p>
                      <p className="text-sm text-gray-600">{attraction.type}</p>
                    </div>
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      {attraction.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h4 className="font-heading font-semibold mb-2">Full Address</h4>
              <p className="text-gray-300">
                123 Rue Example<br />
                Montreal, QC H2X 1Y7<br />
                Canada
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-2">Contact</h4>
              <p className="text-gray-300">
                Phone: +1 (514) 123-4567<br />
                Email: info@leo.pvthostel.com<br />
                WhatsApp: +1 514-123-4567
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-2">Reception Hours</h4>
              <p className="text-gray-300">
                24/7 Reception<br />
                Check-in: 3:00 PM<br />
                Check-out: 11:00 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}