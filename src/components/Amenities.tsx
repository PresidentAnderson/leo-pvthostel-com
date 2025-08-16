import { Wifi, Coffee, Lock, Utensils, Tv, Shield, Car, Luggage, Bath, Gamepad2, BookOpen, Users } from 'lucide-react'

const amenities = [
  {
    icon: Wifi,
    title: 'Free High-Speed WiFi',
    description: 'Stay connected with our fast and reliable internet throughout the hostel',
  },
  {
    icon: Coffee,
    title: 'Free Breakfast',
    description: 'Start your day right with our complimentary continental breakfast',
  },
  {
    icon: Lock,
    title: 'Personal Lockers',
    description: 'Secure storage for your belongings in every dorm room',
  },
  {
    icon: Utensils,
    title: 'Fully Equipped Kitchen',
    description: 'Cook your own meals and save money with our shared kitchen facilities',
  },
  {
    icon: Tv,
    title: 'Common Room & TV',
    description: 'Relax and socialize in our comfortable common areas',
  },
  {
    icon: Shield,
    title: '24/7 Security',
    description: 'Key card access and CCTV monitoring for your safety',
  },
  {
    icon: Car,
    title: 'Parking Available',
    description: 'Convenient parking options for guests with vehicles',
  },
  {
    icon: Luggage,
    title: 'Luggage Storage',
    description: 'Free luggage storage before check-in and after checkout',
  },
  {
    icon: Bath,
    title: 'Hot Showers 24/7',
    description: 'Clean bathrooms with hot water available round the clock',
  },
  {
    icon: Gamepad2,
    title: 'Game Room',
    description: 'Pool table, board games, and gaming consoles for entertainment',
  },
  {
    icon: BookOpen,
    title: 'Book Exchange',
    description: 'Take a book, leave a book in our travelers library',
  },
  {
    icon: Users,
    title: 'Social Events',
    description: 'Weekly activities and tours to explore Montreal',
  },
]

export default function Amenities() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide all the amenities to make your stay comfortable, convenient, and memorable
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon
            return (
              <div
                key={index}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                      <Icon className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-1">
                      {amenity.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {amenity.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-heading font-bold mb-4">
            Plus Many More!
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            From laundry facilities to travel information desk, we've got everything covered to ensure your perfect stay in Montreal.
          </p>
          <a
            href="/amenities"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            View All Amenities
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}