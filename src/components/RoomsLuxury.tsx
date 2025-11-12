import Image from 'next/image'
import Link from 'next/link'

export default function RoomsLuxury() {
  const rooms = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
      title: "Mixed Dorm",
      subtitle: "4-8 Bed · Shared Bath",
      price: "$28",
      features: ["Lockers", "USB Ports", "Reading Lights"],
      available: 8
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
      title: "Female-Only Dorm",
      subtitle: "4-6 Bed · Ensuite Bath",
      price: "$32",
      features: ["Private", "Secure", "Ensuite"],
      available: 4
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
      title: "Private Double",
      subtitle: "Queen Bed · Private Bath",
      price: "$89",
      features: ["Queen Bed", "Private Bath", "City View"],
      available: 2
    }
  ]

  return (
    <section id="rooms" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            Rooms & Suites
          </h2>
          <div className="h-1 w-24 bg-pvt-gold mx-auto mb-6" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Modern design meets hostel community. From social dorms to boutique privates.
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden hover:border-pvt-gold/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(211,168,103,0.3)]"
            >
              {/* Image with Zoom Effect */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Availability Badge */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-white">{room.available} left</span>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                      {room.title}
                    </h3>
                    <p className="text-sm text-gray-400">{room.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-pvt-gold">{room.price}</div>
                    <div className="text-xs text-gray-400">per night</div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href="/book">
                  <button className="w-full py-3 bg-pvt-gold text-pvt-black font-bold rounded-xl hover:bg-yellow-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(211,168,103,0.5)] group-hover:scale-105">
                    Book Now
                  </button>
                </Link>
              </div>

              {/* Neon Edge Glow (subtle) */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                   style={{boxShadow: 'inset 0 0 20px rgba(211,168,103,0.1)'}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
